(() => {
  'use strict';

  const DEFAULTS = {
    enabled: true,
    detectLabels: true,
    detectMetadata: true,
    detectKeywords: true,
    detectionSensitivity: 3,
    keywordSensitivity: 4,
    behavior: 'blur',
    blurStrength: 14,
    customKeywords: [],
    excludedKeywords: [],
    showReason: true
  };

  const META_LABEL_PATTERNS = [
    /\bai info\b/i,
    /\bmade with ai\b/i,
    /\bimagined with ai\b/i,
    /\bgenerated (?:by|with|using) ai\b/i,
    /\bcreated (?:by|with|using) ai\b/i,
    /\bai[- ]generated\b/i,
    /\bsynthetic media\b/i,
    /معلومات[^\n]{0,30}الذكاء الاصطناعي/i,
    /تم (?:إنشاؤه|انشاؤه)[^\n]{0,30}بالذكاء الاصطناعي/i
  ];

  const KEYWORD_LEVELS = {
    1: [
      'artificial intelligence', 'generative ai', 'gen ai', 'genai', 'ai generated',
      'ai-generated', 'chatgpt', 'openai', 'claude', 'anthropic', 'gemini',
      'google ai', 'microsoft copilot', 'copilot ai', 'الذكاء الاصطناعي'
    ],
    2: [
      'midjourney', 'stable diffusion', 'stability ai', 'dall-e', 'dalle', 'sora',
      'runway', 'kling ai', 'klingai', 'veo', 'flux ai', 'flux.1', 'firefly ai',
      'adobe firefly', 'leonardo ai', 'ideogram', 'comfyui', 'automatic1111',
      'a1111', 'fooocus', 'recraft', 'pika labs', 'luma dream machine', 'hailuo ai'
    ],
    3: [
      'llm', 'large language model', 'foundation model', 'multimodal model',
      'ai agent', 'ai agents', 'agentic ai', 'agentic system', 'machine learning',
      'deep learning', 'neural network', 'prompt engineering', 'prompt engineer',
      'model training', 'fine tuning', 'fine-tuning', 'inference', 'rag',
      'retrieval augmented generation', 'mcp', 'model context protocol',
      'llama', 'mistral', 'qwen', 'deepseek', 'grok', 'perplexity ai',
      'hugging face', 'huggingface', 'ollama', 'langchain', 'crewai', 'autogen'
    ],
    4: [
      'nvidia ai', 'nvidia gpu', 'cuda', 'tensor core', 'gpu compute',
      'ai accelerator', 'ai chip', 'data center ai', 'datacenter ai',
      'vector database', 'vector db', 'pinecone', 'weaviate', 'milvus',
      'ai startup', 'ai company', 'ai model', 'ai tool', 'ai tools', 'ai app',
      'ai automation', 'ai workflow', 'coding assistant', 'vibe coding'
    ],
    5: [
      'ai', 'cloud', 'cloud computing', 'aws', 'amazon web services', 'azure',
      'google cloud', 'gcp', 'gpu', 'datacenter', 'data center', 'api', 'automation',
      'model', 'inference server', 'compute', 'saas'
    ]
  };

  // Facebook changes its feed markup frequently. aria-posinset is the current
  // primary feed-unit anchor; the older selectors are kept as fallbacks.
  const POST_SELECTORS = [
    '[aria-posinset]',
    '[role="article"]',
    '[data-pagelet^="FeedUnit_"]',
    '[data-pagelet*="FeedUnit"]'
  ];

  const state = {
    settings: { ...DEFAULTS },
    observer: null,
    scanTimer: null,
    pollTimer: null,
    processedSignature: new WeakMap(),
    temporarilyShown: new WeakSet(),
    metadataInFlight: new WeakMap(),
    scanRuns: 0
  };

  function normalizeText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function getFeedRoot() {
    return document.querySelector('div[role="main"]') || document.body || document.documentElement;
  }

  function getPostText(post) {
    const pieces = [post.innerText || post.textContent || ''];
    post.querySelectorAll('[aria-label], img[alt]').forEach((el) => {
      const aria = el.getAttribute('aria-label');
      const alt = el.getAttribute('alt');
      if (aria) pieces.push(aria);
      if (alt) pieces.push(alt);
    });
    return normalizeText(pieces.join(' ')).slice(0, 50000);
  }

  function testPatterns(text, patterns) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    return null;
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function containsKeyword(text, rawKeyword) {
    const keyword = normalizeText(rawKeyword).toLowerCase();
    if (!keyword) return false;
    const source = text.toLowerCase();

    if (/^[a-z0-9+#.-]+$/i.test(keyword)) {
      const escaped = escapeRegex(keyword);
      const left = /^[a-z0-9]/i.test(keyword) ? '(?<![a-z0-9])' : '';
      const right = /[a-z0-9]$/i.test(keyword) ? '(?![a-z0-9])' : '';
      try {
        return new RegExp(`${left}${escaped}${right}`, 'i').test(source);
      } catch {
        return source.includes(keyword);
      }
    }

    return source.includes(keyword);
  }

  function isExcluded(text) {
    return (state.settings.excludedKeywords || []).some((keyword) => containsKeyword(text, keyword));
  }

  function getBuiltInKeywords() {
    const sensitivity = Math.max(1, Math.min(5, Number(state.settings.keywordSensitivity) || 1));
    const keywords = [];
    for (let level = 1; level <= sensitivity; level += 1) keywords.push(...(KEYWORD_LEVELS[level] || []));
    return keywords;
  }

  function analyzeText(post) {
    const text = getPostText(post);
    if (!text) return { match: false, text: '' };

    if (state.settings.detectLabels) {
      const label = testPatterns(text, META_LABEL_PATTERNS);
      if (label) {
        return { match: true, confidence: 'high', detector: 'label', reason: `Facebook AI label: “${label}”`, text };
      }
    }

    if (state.settings.detectKeywords && !isExcluded(text)) {
      for (const keyword of state.settings.customKeywords || []) {
        if (containsKeyword(text, keyword)) {
          return { match: true, confidence: 'custom', detector: 'keyword', reason: `Your keyword: “${normalizeText(keyword)}”`, text };
        }
      }
      for (const keyword of getBuiltInKeywords()) {
        if (containsKeyword(text, keyword)) {
          return { match: true, confidence: 'keyword', detector: 'keyword', reason: `AI topic keyword: “${keyword}”`, text };
        }
      }
    }

    return { match: false, text };
  }

  function getMediaUrls(post) {
    const urls = new Set();

    post.querySelectorAll('img[src]').forEach((img) => {
      const src = img.currentSrc || img.src;
      if (!src || src.startsWith('data:') || src.startsWith('blob:')) return;
      const width = img.naturalWidth || img.width || 0;
      const height = img.naturalHeight || img.height || 0;
      if (width && height && Math.max(width, height) < 220) return;
      if (/fbcdn\.net|facebook\.com/i.test(src)) urls.add(src);
    });

    post.querySelectorAll('video[src], video source[src]').forEach((video) => {
      const src = video.currentSrc || video.src || video.getAttribute('src');
      if (!src || src.startsWith('blob:')) return;
      if (/fbcdn\.net|facebook\.com/i.test(src)) urls.add(src);
    });

    return [...urls].slice(0, 3);
  }

  function getPostSignature(post) {
    const text = getPostText(post).slice(0, 6000);
    const media = getMediaUrls(post).join('|');
    return `${text}\n::media::${media}`;
  }

  async function analyzeMetadata(post) {
    if (!state.settings.detectMetadata) return { match: false };
    const urls = getMediaUrls(post);
    if (!urls.length) return { match: false };

    try {
      const result = await chrome.runtime.sendMessage({
        type: 'NO_AI_FEED_SCAN_METADATA',
        urls,
        sensitivity: Number(state.settings.detectionSensitivity) || 3
      });
      if (result?.match) {
        return {
          match: true,
          detector: 'metadata',
          confidence: result.confidence || 'high',
          reason: result.reason || 'AI provenance found in media metadata'
        };
      }
    } catch {
      // Metadata is best effort. Never infer from the pixels.
    }
    return { match: false };
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function createRevealBar(post, analysis) {
    const bar = document.createElement('div');
    bar.className = 'no-ai-feed-reveal';
    bar.dataset.noAiFeedPlaceholder = '1';

    const reason = state.settings.showReason ? `<span>${escapeHtml(analysis.reason)}</span>` : '';
    bar.innerHTML = `<div><strong>Filtered AI content</strong>${reason}</div>`;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Show post';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      state.temporarilyShown.add(post);
      clearTreatment(post);
    });
    bar.appendChild(button);
    return bar;
  }

  function clearTreatment(post) {
    post.classList.remove('no-ai-feed-removed', 'no-ai-feed-blurred');
    post.style.removeProperty('--no-ai-feed-blur');
    const previous = post.previousElementSibling;
    if (previous?.dataset?.noAiFeedPlaceholder === '1') previous.remove();
  }

  function applyTreatment(post, analysis) {
    if (state.temporarilyShown.has(post)) return;
    clearTreatment(post);

    if (state.settings.behavior === 'remove') {
      post.classList.add('no-ai-feed-removed');
    } else {
      const blur = Math.max(2, Math.min(40, Number(state.settings.blurStrength) || 14));
      post.style.setProperty('--no-ai-feed-blur', `${blur}px`);
      post.classList.add('no-ai-feed-blurred');
      const bar = createRevealBar(post, analysis);
      post.parentElement?.insertBefore(bar, post);
    }
  }

  function isLikelyFeedPost(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (el.dataset.noAiFeedPlaceholder === '1') return false;
    if (el.closest('[data-no-ai-feed-placeholder="1"]')) return false;

    // aria-posinset is the current primary FB feed row signal. Older article/
    // FeedUnit nodes remain valid fallbacks. Require meaningful content so
    // listbox/menu items elsewhere on the page are ignored.
    const hasAnchor = el.hasAttribute('aria-posinset') || el.matches('[role="article"], [data-pagelet^="FeedUnit_"], [data-pagelet*="FeedUnit"]');
    if (!hasAnchor) return false;
    const textLength = normalizeText(el.innerText || el.textContent || '').length;
    const hasMedia = !!el.querySelector('img, video');
    const hasLinks = !!el.querySelector('a[href]');
    return textLength >= 20 || (hasMedia && hasLinks);
  }

  function dedupePostCandidates(candidates) {
    // Prefer the outer feed unit when two fallback selectors point into the
    // same post, but avoid swallowing the entire feed.
    const list = [...candidates].filter(isLikelyFeedPost);
    return list.filter((candidate) => {
      return !list.some((other) => other !== candidate && other.contains(candidate) && isLikelyFeedPost(other));
    });
  }

  function findPosts(root = document) {
    const posts = new Set();
    const searchRoot = root === document ? getFeedRoot() : root;

    for (const selector of POST_SELECTORS) {
      if (searchRoot instanceof Element && searchRoot.matches(selector)) posts.add(searchRoot);
      searchRoot.querySelectorAll?.(selector).forEach((el) => posts.add(el));
    }

    // Current Facebook builds may expose an actions button even when the
    // article wrapper is absent. Walk up to its aria-posinset feed row.
    searchRoot.querySelectorAll?.('[aria-label*="Actions for this post" i]').forEach((action) => {
      const row = action.closest('[aria-posinset], [role="article"], [data-pagelet^="FeedUnit_"]');
      if (row) posts.add(row);
    });

    return dedupePostCandidates(posts);
  }

  async function processPost(post, force = false) {
    if (!(post instanceof HTMLElement)) return;

    const signature = getPostSignature(post);
    if (!force && state.processedSignature.get(post) === signature) return;
    state.processedSignature.set(post, signature);

    if (!state.settings.enabled) {
      clearTreatment(post);
      return;
    }

    const textAnalysis = analyzeText(post);
    if (textAnalysis.match) {
      applyTreatment(post, textAnalysis);
      return;
    }

    if (!state.settings.detectMetadata) {
      clearTreatment(post);
      return;
    }

    const promise = analyzeMetadata(post);
    state.metadataInFlight.set(post, promise);
    const metadataAnalysis = await promise;
    if (state.metadataInFlight.get(post) !== promise) return;
    if (state.processedSignature.get(post) !== signature) return;

    if (metadataAnalysis.match) applyTreatment(post, metadataAnalysis);
    else clearTreatment(post);
  }

  function scan(root = document, force = false) {
    state.scanRuns += 1;
    findPosts(root).forEach((post) => { void processPost(post, force); });
  }

  function rescanAll() {
    state.processedSignature = new WeakMap();
    state.metadataInFlight = new WeakMap();
    document.querySelectorAll('[data-no-ai-feed-placeholder="1"]').forEach((el) => el.remove());
    findPosts(document).forEach((post) => {
      state.temporarilyShown.delete?.(post);
      clearTreatment(post);
      void processPost(post, true);
    });
  }

  function scheduleScan(delay = 120) {
    clearTimeout(state.scanTimer);
    state.scanTimer = setTimeout(() => scan(document), delay);
  }

  function startObserver() {
    state.observer?.disconnect();

    state.observer = new MutationObserver((mutations) => {
      let relevant = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && (mutation.addedNodes.length || mutation.removedNodes.length)) relevant = true;
        if (mutation.type === 'characterData') relevant = true;
        if (mutation.type === 'attributes') relevant = true;
        if (relevant) break;
      }
      if (relevant) scheduleScan();
    });

    state.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['src', 'aria-label', 'alt', 'aria-posinset']
    });

    // Safety net for Facebook's recycled/virtualized feed nodes.
    clearInterval(state.pollTimer);
    state.pollTimer = setInterval(() => scan(document), 2500);
  }

  async function loadSettings() {
    const saved = await chrome.storage.local.get(DEFAULTS);
    state.settings = { ...DEFAULTS, ...saved };
  }

  function getStats() {
    const posts = findPosts(document);
    const filtered = posts.filter((post) => post.classList.contains('no-ai-feed-removed') || post.classList.contains('no-ai-feed-blurred')).length;
    return {
      connected: true,
      postCount: posts.length,
      filteredCount: filtered,
      scanRuns: state.scanRuns,
      url: location.href
    };
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    for (const [key, change] of Object.entries(changes)) state.settings[key] = change.newValue;
    rescanAll();
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'NO_AI_FEED_STATS') {
      sendResponse(getStats());
      return;
    }
    if (message?.type === 'NO_AI_FEED_RESCAN') {
      rescanAll();
      setTimeout(() => sendResponse({ ok: true, ...getStats() }), 60);
      return true;
    }
  });

  async function init() {
    await loadSettings();
    scan(document, true);
    startObserver();
    setTimeout(() => scan(document), 700);
    setTimeout(() => scan(document), 1800);
  }

  void init();
})();
