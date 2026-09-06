(() => {
  'use strict';

  const DEFAULTS = {
    enabled: true,
    detectKeywords: true,
    keywordSensitivity: 4,
    behavior: 'blur',
    blurStrength: 14,
    customKeywords: [],
    excludedKeywords: [],
    showReason: true
  };

  const KEYWORD_LEVELS = {
    1: [
      'artificial intelligence', 'generative ai', 'gen ai', 'genai', 'ai generated',
      'ai-generated', 'chatgpt', 'openai', 'claude', 'anthropic', 'gemini',
      'google ai', 'microsoft copilot', 'copilot ai', 'الذكاء الاصطناعي',
      'higgsfield', 'higgsfield ai', 'highsefield', 'astra', 'project astra',
      'gpt-6 astra', 'gpt 6 astra', '3d jutsu', 'genjutsu'
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

  const CARD_SELECTORS = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'yt-lockup-view-model',
    'ytd-compact-video-renderer',
    'ytd-grid-video-renderer',
    'ytm-shorts-lockup-view-model',
    'ytm-shorts-lockup-view-model-v2'
  ];

  const CARD_SELECTOR = CARD_SELECTORS.join(',');

  const state = {
    settings: { ...DEFAULTS },
    observer: null,
    scanTimer: null,
    pollTimer: null,
    processedSignature: new WeakMap(),
    temporarilyShown: new WeakSet(),
    scanRuns: 0
  };

  function normalizeText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
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

  function getBuiltInKeywords() {
    const sensitivity = Math.max(1, Math.min(5, Number(state.settings.keywordSensitivity) || 1));
    const keywords = [];
    for (let level = 1; level <= sensitivity; level += 1) keywords.push(...(KEYWORD_LEVELS[level] || []));
    return keywords;
  }

  function getCardText(card) {
    const pieces = [card.innerText || card.textContent || ''];
    card.querySelectorAll('[title], [aria-label]').forEach((el) => {
      const title = el.getAttribute('title');
      const aria = el.getAttribute('aria-label');
      if (title) pieces.push(title);
      if (aria) pieces.push(aria);
    });
    return normalizeText(pieces.join(' ')).slice(0, 30000);
  }

  function isExcluded(text) {
    return (state.settings.excludedKeywords || []).some((keyword) => containsKeyword(text, keyword));
  }

  function analyzeCard(card) {
    const text = getCardText(card);
    if (!text || !state.settings.detectKeywords || isExcluded(text)) return { match: false, text };

    for (const keyword of state.settings.customKeywords || []) {
      if (containsKeyword(text, keyword)) {
        return { match: true, reason: `Your keyword: “${normalizeText(keyword)}”`, detector: 'keyword' };
      }
    }

    for (const keyword of getBuiltInKeywords()) {
      if (containsKeyword(text, keyword)) {
        return { match: true, reason: `AI topic keyword: “${keyword}”`, detector: 'keyword' };
      }
    }

    return { match: false, text };
  }

  function isLikelyVideoCard(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (!el.matches(CARD_SELECTOR)) return false;
    if (el.dataset.noAiFeedYoutubeOverlay === '1') return false;
    return !!el.querySelector('a[href*="/watch"], a[href^="/shorts/"]');
  }

  function findCards(root = document) {
    const set = new Set();
    if (root instanceof Element && root.matches(CARD_SELECTOR)) set.add(root);
    root.querySelectorAll?.(CARD_SELECTOR).forEach((el) => set.add(el));

    const list = [...set].filter(isLikelyVideoCard);
    return list.filter((candidate) => {
      return !list.some((other) => other !== candidate && other.contains(candidate) && isLikelyVideoCard(other));
    });
  }

  function clearTreatment(card) {
    card.classList.remove('no-ai-feed-removed', 'no-ai-feed-youtube-blurred');
    card.style.removeProperty('--no-ai-feed-blur');
    card.querySelector(':scope > [data-no-ai-feed-youtube-overlay="1"]')?.remove();
  }

  function createOverlay(card, analysis) {
    const overlay = document.createElement('div');
    overlay.className = 'no-ai-feed-youtube-overlay';
    overlay.dataset.noAiFeedYoutubeOverlay = '1';

    const reason = state.settings.showReason ? `<span>${escapeHtml(analysis.reason)}</span>` : '';
    overlay.innerHTML = `<div><strong>Filtered by No AI Feed</strong>${reason}<button type="button">Show video</button></div>`;
    overlay.querySelector('button')?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      state.temporarilyShown.add(card);
      clearTreatment(card);
    });
    return overlay;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function applyTreatment(card, analysis) {
    if (state.temporarilyShown.has(card)) return;
    clearTreatment(card);

    if (state.settings.behavior === 'remove') {
      card.classList.add('no-ai-feed-removed');
      return;
    }

    const blur = Math.max(2, Math.min(40, Number(state.settings.blurStrength) || 14));
    card.style.setProperty('--no-ai-feed-blur', `${blur}px`);
    card.classList.add('no-ai-feed-youtube-blurred');
    card.appendChild(createOverlay(card, analysis));
  }

  function processCard(card, force = false) {
    if (!(card instanceof HTMLElement)) return;
    const signature = getCardText(card).slice(0, 8000);
    if (!force && state.processedSignature.get(card) === signature) return;
    state.processedSignature.set(card, signature);

    if (!state.settings.enabled) {
      clearTreatment(card);
      return;
    }

    const analysis = analyzeCard(card);
    if (analysis.match) applyTreatment(card, analysis);
    else clearTreatment(card);
  }

  function scan(root = document, force = false) {
    state.scanRuns += 1;
    findCards(root).forEach((card) => processCard(card, force));
  }

  function rescanAll() {
    state.processedSignature = new WeakMap();
    findCards(document).forEach((card) => {
      state.temporarilyShown.delete?.(card);
      clearTreatment(card);
      processCard(card, true);
    });
  }

  function scheduleScan(delay = 100) {
    clearTimeout(state.scanTimer);
    state.scanTimer = setTimeout(() => scan(document), delay);
  }

  function startObserver() {
    state.observer?.disconnect();
    state.observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.type === 'childList' || mutation.type === 'characterData' || mutation.type === 'attributes')) {
        scheduleScan();
      }
    });
    state.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['title', 'aria-label', 'href']
    });

    clearInterval(state.pollTimer);
    state.pollTimer = setInterval(() => scan(document), 2500);
    document.addEventListener('yt-navigate-finish', () => setTimeout(() => scan(document, true), 150));
  }

  async function loadSettings() {
    const saved = await chrome.storage.local.get(DEFAULTS);
    state.settings = { ...DEFAULTS, ...saved };
  }

  function getStats() {
    const cards = findCards(document);
    const filtered = cards.filter((card) => card.classList.contains('no-ai-feed-removed') || card.classList.contains('no-ai-feed-youtube-blurred')).length;
    return {
      connected: true,
      platform: 'YouTube',
      itemLabel: 'video',
      postCount: cards.length,
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