(() => {
  'use strict';

  const DEFAULTS = {
    enabled: true,
    personalRules: [],
    excludedKeywords: [],
    behavior: 'blur',
    blurStrength: 14,
    showReason: true
  };

  const FACEBOOK_SELECTORS = [
    '[aria-posinset]',
    '[role="article"]',
    '[data-pagelet^="FeedUnit_"]',
    '[data-pagelet*="FeedUnit"]'
  ];

  const YOUTUBE_SELECTORS = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'yt-lockup-view-model',
    'ytd-compact-video-renderer',
    'ytd-grid-video-renderer',
    'ytm-shorts-lockup-view-model',
    'ytm-shorts-lockup-view-model-v2'
  ];

  const state = {
    settings: { ...DEFAULTS },
    observer: null,
    scanTimer: null,
    pollTimer: null,
    processedSignature: new WeakMap(),
    temporarilyShown: new WeakSet()
  };

  const platform = /youtube\.com$/i.test(location.hostname) || /\.youtube\.com$/i.test(location.hostname)
    ? 'YouTube'
    : 'Facebook';

  function normalizeText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function containsTerm(text, rawTerm) {
    const term = normalizeText(rawTerm).toLowerCase();
    if (!term) return false;
    const source = normalizeText(text).toLowerCase();

    if (/^[a-z0-9+#.@_-]+$/i.test(term)) {
      const escaped = escapeRegex(term);
      const left = /^[a-z0-9]/i.test(term) ? '(?<![a-z0-9])' : '';
      const right = /[a-z0-9]$/i.test(term) ? '(?![a-z0-9])' : '';
      try {
        return new RegExp(`${left}${escaped}${right}`, 'i').test(source);
      } catch {
        return source.includes(term);
      }
    }

    return source.includes(term);
  }

  function normalizedRules() {
    return (Array.isArray(state.settings.personalRules) ? state.settings.personalRules : [])
      .map((rule) => ({
        id: String(rule?.id || ''),
        type: rule?.type === 'source' ? 'source' : 'topic',
        value: normalizeText(rule?.value)
      }))
      .filter((rule) => rule.value)
      .slice(0, 300);
  }

  function isExcluded(text, sourceText = '') {
    const combined = `${text} ${sourceText}`;
    return (state.settings.excludedKeywords || []).some((term) => containsTerm(combined, term));
  }

  function getFacebookText(item) {
    const pieces = [item.innerText || item.textContent || ''];
    item.querySelectorAll('[aria-label], img[alt]').forEach((el) => {
      const aria = el.getAttribute('aria-label');
      const alt = el.getAttribute('alt');
      if (aria) pieces.push(aria);
      if (alt) pieces.push(alt);
    });
    return normalizeText(pieces.join(' ')).slice(0, 50000);
  }

  function getFacebookSource(item) {
    const names = [];
    const links = [...item.querySelectorAll('a[href]')].slice(0, 18);
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      if (!href || /\/photo|\/watch|\/reel|\/story|\/hashtag|\/groups\//i.test(href)) continue;
      const text = normalizeText(link.innerText || link.textContent || link.getAttribute('aria-label') || '');
      if (text && text.length <= 100) names.push(text);
      if (names.length >= 6) break;
    }
    return normalizeText([...new Set(names)].join(' · '));
  }

  function getYouTubeText(item) {
    const pieces = [item.innerText || item.textContent || ''];
    item.querySelectorAll('[title], [aria-label]').forEach((el) => {
      const title = el.getAttribute('title');
      const aria = el.getAttribute('aria-label');
      if (title) pieces.push(title);
      if (aria) pieces.push(aria);
    });
    return normalizeText(pieces.join(' ')).slice(0, 30000);
  }

  function getYouTubeSource(item) {
    const names = [];
    item.querySelectorAll('#channel-name, ytd-channel-name, a[href^="/@"], a[href^="/channel/"], a[href^="/c/"]').forEach((el) => {
      const text = normalizeText(el.innerText || el.textContent || el.getAttribute('title') || el.getAttribute('aria-label') || '');
      if (text && text.length <= 120) names.push(text);
    });
    return normalizeText([...new Set(names)].join(' · '));
  }

  function getItemText(item) {
    return platform === 'YouTube' ? getYouTubeText(item) : getFacebookText(item);
  }

  function getItemSource(item) {
    return platform === 'YouTube' ? getYouTubeSource(item) : getFacebookSource(item);
  }

  function analyzeItem(item) {
    const text = getItemText(item);
    const sourceText = getItemSource(item);
    if (!text && !sourceText) return { match: false };
    if (isExcluded(text, sourceText)) return { match: false };

    for (const rule of normalizedRules()) {
      if (rule.type === 'source' && containsTerm(sourceText, rule.value)) {
        return {
          match: true,
          reason: `Blocked creator/page/channel: “${rule.value}”`,
          rule
        };
      }
      if (rule.type === 'topic' && containsTerm(text, rule.value)) {
        return {
          match: true,
          reason: `Blocked topic/phrase: “${rule.value}”`,
          rule
        };
      }
    }

    return { match: false };
  }

  function isFacebookItem(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (el.dataset.noAiFeedPersonalPlaceholder === '1') return false;
    const hasAnchor = el.hasAttribute('aria-posinset') || el.matches('[role="article"], [data-pagelet^="FeedUnit_"], [data-pagelet*="FeedUnit"]');
    if (!hasAnchor) return false;
    const textLength = normalizeText(el.innerText || el.textContent || '').length;
    return textLength >= 20 || !!el.querySelector('img, video, a[href]');
  }

  function isYouTubeItem(el) {
    if (!(el instanceof HTMLElement)) return false;
    return !!el.querySelector('a[href*="/watch"], a[href^="/shorts/"]');
  }

  function findItems(root = document) {
    const selectors = platform === 'YouTube' ? YOUTUBE_SELECTORS : FACEBOOK_SELECTORS;
    const set = new Set();
    for (const selector of selectors) {
      if (root instanceof Element && root.matches(selector)) set.add(root);
      root.querySelectorAll?.(selector).forEach((el) => set.add(el));
    }

    if (platform === 'Facebook') {
      root.querySelectorAll?.('[aria-label*="Actions for this post" i]').forEach((action) => {
        const row = action.closest('[aria-posinset], [role="article"], [data-pagelet^="FeedUnit_"]');
        if (row) set.add(row);
      });
    }

    const validator = platform === 'YouTube' ? isYouTubeItem : isFacebookItem;
    const list = [...set].filter(validator);
    return list.filter((candidate) => !list.some((other) => other !== candidate && other.contains(candidate) && validator(other)));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function clearTreatment(item) {
    item.classList.remove('no-ai-feed-personal-removed', 'no-ai-feed-personal-blurred');
    item.style.removeProperty('--no-ai-feed-personal-blur');
    item.querySelector(':scope > [data-no-ai-feed-personal-overlay="1"]')?.remove();
    const previous = item.previousElementSibling;
    if (previous?.dataset?.noAiFeedPersonalPlaceholder === '1') previous.remove();
  }

  function makeReveal(item, analysis) {
    const wrapper = document.createElement('div');
    wrapper.className = platform === 'YouTube' ? 'no-ai-feed-personal-overlay' : 'no-ai-feed-personal-reveal';
    if (platform === 'YouTube') wrapper.dataset.noAiFeedPersonalOverlay = '1';
    else wrapper.dataset.noAiFeedPersonalPlaceholder = '1';

    const reason = state.settings.showReason ? `<span>${escapeHtml(analysis.reason)}</span>` : '';
    wrapper.innerHTML = `<div><strong>Hidden by your filter</strong>${reason}<button type="button">Show ${platform === 'YouTube' ? 'video' : 'post'}</button></div>`;
    wrapper.querySelector('button')?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      state.temporarilyShown.add(item);
      clearTreatment(item);
    });
    return wrapper;
  }

  function applyTreatment(item, analysis) {
    if (state.temporarilyShown.has(item)) return;
    clearTreatment(item);

    if (state.settings.behavior === 'remove') {
      item.classList.add('no-ai-feed-personal-removed');
      return;
    }

    const blur = Math.max(2, Math.min(40, Number(state.settings.blurStrength) || 14));
    item.style.setProperty('--no-ai-feed-personal-blur', `${blur}px`);
    item.classList.add('no-ai-feed-personal-blurred');

    const reveal = makeReveal(item, analysis);
    if (platform === 'YouTube') item.appendChild(reveal);
    else item.parentElement?.insertBefore(reveal, item);
  }

  function processItem(item, force = false) {
    const text = getItemText(item);
    const sourceText = getItemSource(item);
    const signature = `${text.slice(0, 7000)}::${sourceText}`;
    if (!force && state.processedSignature.get(item) === signature) return;
    state.processedSignature.set(item, signature);

    if (!state.settings.enabled || normalizedRules().length === 0) {
      clearTreatment(item);
      return;
    }

    const analysis = analyzeItem(item);
    if (analysis.match) applyTreatment(item, analysis);
    else clearTreatment(item);
  }

  function scan(root = document, force = false) {
    findItems(root).forEach((item) => processItem(item, force));
  }

  function rescanAll() {
    state.processedSignature = new WeakMap();
    document.querySelectorAll('[data-no-ai-feed-personal-placeholder="1"], [data-no-ai-feed-personal-overlay="1"]').forEach((el) => el.remove());
    findItems(document).forEach((item) => {
      state.temporarilyShown.delete?.(item);
      clearTreatment(item);
      processItem(item, true);
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
      attributeFilter: ['title', 'aria-label', 'href', 'aria-posinset']
    });

    clearInterval(state.pollTimer);
    state.pollTimer = setInterval(() => scan(document), 2500);
    if (platform === 'YouTube') document.addEventListener('yt-navigate-finish', () => setTimeout(() => scan(document, true), 150));
  }

  function getCurrentSource() {
    if (platform === 'YouTube') {
      const selectors = [
        'ytd-watch-metadata ytd-channel-name a',
        '#owner #channel-name a',
        'ytd-c4-tabbed-header-renderer #channel-name',
        'yt-page-header-view-model h1',
        'ytd-channel-name a'
      ];
      for (const selector of selectors) {
        const text = normalizeText(document.querySelector(selector)?.textContent || '');
        if (text && text.length <= 120) return text;
      }
      return '';
    }

    if (/facebook\.com\/(?:$|home|watch|reels|groups)/i.test(location.href)) return '';
    const headings = [...document.querySelectorAll('h1, [role="main"] h1')];
    for (const heading of headings) {
      const text = normalizeText(heading.textContent || '');
      if (text && text.length <= 120 && !/facebook/i.test(text)) return text;
    }
    return '';
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    for (const [key, change] of Object.entries(changes)) state.settings[key] = change.newValue;
    rescanAll();
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'NO_AI_FEED_CURRENT_SOURCE') {
      sendResponse({ platform, source: getCurrentSource() });
    }
  });

  async function init() {
    const saved = await chrome.storage.local.get(DEFAULTS);
    state.settings = { ...DEFAULTS, ...saved };
    scan(document, true);
    startObserver();
    setTimeout(() => scan(document), 700);
    setTimeout(() => scan(document), 1800);
  }

  void init();
})();