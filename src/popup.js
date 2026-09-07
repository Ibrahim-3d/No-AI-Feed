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
  personalRules: [],
  excludedKeywords: [],
  showReason: true,
  uiLanguage: 'auto'
};

const COPY = {
  en: {
    brandSubtitle: 'Your feed, your rules',
    currentSite: 'Current site',
    checkingTab: 'Checking current tab…',
    rescan: 'Rescan page',
    aiFilter: 'AI filter',
    aiFilterDesc: 'Hide AI tools, models and generated-content signals.',
    coverage: 'Coverage',
    focused: 'Focused',
    aggressive: 'Aggressive',
    advancedDetection: 'Advanced detection',
    facebookLabels: 'Facebook AI labels',
    facebookLabelsDesc: 'Uses labels such as “AI info” and “Made with AI”.',
    mediaMetadata: 'Media metadata',
    mediaMetadataDesc: 'Checks supported Facebook media for AI provenance.',
    metadataSensitivity: 'Metadata sensitivity',
    myFilters: 'My filters',
    myFiltersDesc: 'Hide any topic, phrase, creator, page or channel.',
    topicPhrase: 'Topic / phrase',
    creatorSource: 'Creator / page / channel',
    addFilter: 'Add filter',
    exceptions: 'Exceptions',
    exceptionsNote: 'Never hide these',
    exceptionsHelp: 'One phrase per line. Exceptions override built-in and personal filters.',
    whenMatched: 'When something matches',
    whenMatchedDesc: 'Choose how filtered content should behave.',
    blur: 'Blur',
    hideCompletely: 'Hide completely',
    blurStrength: 'Blur strength',
    showReason: 'Show why it was filtered',
    showReasonDesc: 'Display the matching rule when content is blurred.',
    localOnly: 'Private by design',
    localOnlyDesc: 'Filtering and preferences stay in your browser.',
    savedAutomatically: 'Saved automatically',
    ruleEmpty: 'No personal filters yet. Add a topic or creator above.',
    ruleSingular: 'rule',
    rulePlural: 'rules',
    topicBadge: 'TOPIC',
    sourceBadge: 'SOURCE',
    removeFilter: 'Remove filter',
    topicPlaceholder: 'e.g. crypto, football transfers, politics',
    sourcePlaceholder: 'e.g. MrBeast, Some Facebook Page, @channel',
    topicHelp: 'Hide posts or videos that mention this topic or phrase.',
    sourceHelp: 'Hide posts or videos from this creator, page or channel.',
    exceptionsPlaceholder: 'e.g. cloud photography\nAI research paper',
    blockCurrentChannel: 'Block current channel: {source}',
    blockCurrentSource: 'Block current page/creator: {source}',
    openSupported: 'Open Facebook or YouTube in the current tab.',
    connected: '{platform} · {count} {items} detected · {filtered} filtered',
    connectedEmpty: '{platform} connected · no filterable items visible yet',
    reloadTab: 'Reload this {platform} tab once to activate the extension.',
    itemPost: 'post',
    itemPosts: 'posts',
    itemVideo: 'video',
    itemVideos: 'videos',
    saving: 'Saving…',
    saved: 'Saved',
    rescanned: 'Rescanned',
    typeFirst: 'Type something first',
    alreadyFiltered: 'Already filtered',
    filterAdded: 'Filter added',
    filterRemoved: 'Filter removed',
    metadata1Title: 'Strict',
    metadata1Desc: 'Only explicit AI-generation provenance.',
    metadata2Title: 'High confidence',
    metadata2Desc: 'Also detects metadata naming known AI generators.',
    metadata3Title: 'Recommended',
    metadata3Desc: 'Includes common creator/software and generation fields.',
    metadata4Title: 'Broad',
    metadata4Desc: 'Also accepts broader generative-AI metadata terms.',
    metadata5Title: 'Aggressive',
    metadata5Desc: 'Filters weak AI references found in metadata fields.',
    keyword1Title: 'Core',
    keyword1Desc: 'Major AI tools and topics including ChatGPT, Higgsfield and Astra.',
    keyword2Title: 'Creators',
    keyword2Desc: 'Adds image and video generators such as Midjourney, Sora and Runway.',
    keyword3Title: 'Technical',
    keyword3Desc: 'Adds LLMs, agents, machine learning, RAG, MCP and engineering terms.',
    keyword4Title: 'Industry',
    keyword4Desc: 'Adds AI infrastructure, chips, databases and product terminology.',
    keyword5Title: 'Maximum',
    keyword5Desc: 'Also blocks broad adjacent terms such as cloud, GPU, API and automation.'
  },
  ar: {
    brandSubtitle: 'خلاصتك، بقواعدك أنت',
    currentSite: 'الموقع الحالي',
    checkingTab: 'جارٍ فحص الصفحة الحالية…',
    rescan: 'إعادة فحص الصفحة',
    aiFilter: 'فلتر الذكاء الاصطناعي',
    aiFilterDesc: 'إخفاء أدوات ونماذج ومحتوى الذكاء الاصطناعي.',
    coverage: 'نطاق الفلترة',
    focused: 'محدد',
    aggressive: 'أوسع',
    advancedDetection: 'اكتشاف متقدم',
    facebookLabels: 'علامات الذكاء الاصطناعي في فيسبوك',
    facebookLabelsDesc: 'يستخدم علامات مثل “AI info” و “Made with AI”.',
    mediaMetadata: 'بيانات الوسائط',
    mediaMetadataDesc: 'يفحص بيانات المصدر داخل وسائط فيسبوك المدعومة.',
    metadataSensitivity: 'حساسية بيانات الوسائط',
    myFilters: 'فلاتري',
    myFiltersDesc: 'اخفِ أي موضوع أو عبارة أو منشئ محتوى أو صفحة أو قناة.',
    topicPhrase: 'موضوع / عبارة',
    creatorSource: 'منشئ / صفحة / قناة',
    addFilter: 'إضافة فلتر',
    exceptions: 'الاستثناءات',
    exceptionsNote: 'لا تُخفِ هذه',
    exceptionsHelp: 'عبارة واحدة في كل سطر. الاستثناءات تتجاوز كل الفلاتر الأخرى.',
    whenMatched: 'عند العثور على تطابق',
    whenMatchedDesc: 'اختر ما يحدث للمحتوى المطابق.',
    blur: 'تمويه',
    hideCompletely: 'إخفاء بالكامل',
    blurStrength: 'قوة التمويه',
    showReason: 'إظهار سبب الفلترة',
    showReasonDesc: 'يعرض القاعدة المطابقة عند تمويه المحتوى.',
    localOnly: 'خصوصيتك أولاً',
    localOnlyDesc: 'الفلترة والإعدادات تبقى داخل متصفحك.',
    savedAutomatically: 'يتم الحفظ تلقائياً',
    ruleEmpty: 'لا توجد فلاتر شخصية بعد. أضف موضوعاً أو منشئ محتوى.',
    ruleSingular: 'فلتر',
    rulePlural: 'فلاتر',
    topicBadge: 'موضوع',
    sourceBadge: 'مصدر',
    removeFilter: 'حذف الفلتر',
    topicPlaceholder: 'مثال: كريبتو، انتقالات كرة القدم، سياسة',
    sourcePlaceholder: 'مثال: اسم قناة، صفحة فيسبوك، @channel',
    topicHelp: 'يخفي أي منشور أو فيديو يذكر هذا الموضوع أو العبارة.',
    sourceHelp: 'يخفي المحتوى من منشئ المحتوى أو الصفحة أو القناة.',
    exceptionsPlaceholder: 'مثال: تصوير السحاب\nبحث أكاديمي عن الذكاء الاصطناعي',
    blockCurrentChannel: 'حظر القناة الحالية: {source}',
    blockCurrentSource: 'حظر الصفحة/المنشئ الحالي: {source}',
    openSupported: 'افتح فيسبوك أو يوتيوب في الصفحة الحالية.',
    connected: '{platform} · تم رصد {count} {items} · تم فلترة {filtered}',
    connectedEmpty: '{platform} متصل · لا يوجد محتوى قابل للفلترة حالياً',
    reloadTab: 'أعد تحميل صفحة {platform} مرة واحدة لتفعيل الإضافة.',
    itemPost: 'منشور',
    itemPosts: 'منشورات',
    itemVideo: 'فيديو',
    itemVideos: 'فيديوهات',
    saving: 'جارٍ الحفظ…',
    saved: 'تم الحفظ',
    rescanned: 'تمت إعادة الفحص',
    typeFirst: 'اكتب شيئاً أولاً',
    alreadyFiltered: 'مضاف بالفعل',
    filterAdded: 'تمت إضافة الفلتر',
    filterRemoved: 'تم حذف الفلتر',
    metadata1Title: 'صارم',
    metadata1Desc: 'يعتمد فقط على دلائل صريحة لإنشاء المحتوى بالذكاء الاصطناعي.',
    metadata2Title: 'ثقة عالية',
    metadata2Desc: 'يضيف أسماء مولدات الذكاء الاصطناعي المعروفة.',
    metadata3Title: 'موصى به',
    metadata3Desc: 'يشمل حقول البرامج والمنشئ وبيانات التوليد الشائعة.',
    metadata4Title: 'واسع',
    metadata4Desc: 'يقبل إشارات أوسع مرتبطة بالذكاء الاصطناعي التوليدي.',
    metadata5Title: 'هجومي',
    metadata5Desc: 'يفلتر حتى الإشارات الضعيفة للذكاء الاصطناعي في البيانات.',
    keyword1Title: 'أساسي',
    keyword1Desc: 'أهم أدوات ومواضيع الذكاء الاصطناعي مثل ChatGPT وHiggsfield وAstra.',
    keyword2Title: 'أدوات إبداعية',
    keyword2Desc: 'يضيف مولدات الصور والفيديو مثل Midjourney وSora وRunway.',
    keyword3Title: 'تقني',
    keyword3Desc: 'يضيف LLM والوكلاء وML وRAG وMCP والمصطلحات الهندسية.',
    keyword4Title: 'الصناعة',
    keyword4Desc: 'يضيف البنية التحتية والشرائح وقواعد البيانات ومصطلحات منتجات AI.',
    keyword5Title: 'أقصى نطاق',
    keyword5Desc: 'يضيف كلمات أوسع مثل cloud وGPU وAPI وautomation.'
  }
};

const $ = (id) => document.getElementById(id);
let personalRules = [];
let currentSource = '';
let activePlatform = null;
let language = 'en';

function normalizeText(value) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function t(key, vars = {}) {
  let value = COPY[language]?.[key] ?? COPY.en[key] ?? key;
  Object.entries(vars).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, String(replacement));
  });
  return value;
}

function resolveInitialLanguage(saved) {
  if (saved === 'en' || saved === 'ar') return saved;
  const ui = (chrome.i18n?.getUILanguage?.() || navigator.language || 'en').toLowerCase();
  return ui.startsWith('ar') ? 'ar' : 'en';
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const value = t(el.dataset.i18nAria);
    el.setAttribute('aria-label', value);
    el.title = value;
  });
  $('languageToggle').textContent = language === 'ar' ? 'EN' : 'AR';
  $('languageToggle').setAttribute('aria-label', language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  $('excludedKeywords').placeholder = t('exceptionsPlaceholder');
  renderRules();
  updateUi();
  updateQuickSource();
}

function listFromTextarea(id) {
  return $(id).value.split('\n').map((v) => normalizeText(v)).filter(Boolean).slice(0, 250);
}

function normalizeRules(rules) {
  const seen = new Set();
  return (Array.isArray(rules) ? rules : [])
    .map((rule) => ({
      id: String(rule?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
      type: rule?.type === 'source' ? 'source' : 'topic',
      value: normalizeText(rule?.value)
    }))
    .filter((rule) => {
      if (!rule.value) return false;
      const key = `${rule.type}:${rule.value.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 300);
}

function migrateLegacyKeywords(settings) {
  const rules = normalizeRules(settings.personalRules);
  const existing = new Set(rules.map((rule) => `${rule.type}:${rule.value.toLowerCase()}`));
  let changed = false;
  for (const value of settings.customKeywords || []) {
    const clean = normalizeText(value);
    if (!clean) continue;
    const key = `topic:${clean.toLowerCase()}`;
    if (existing.has(key)) continue;
    rules.push({ id: `legacy-${Date.now()}-${rules.length}`, type: 'topic', value: clean });
    existing.add(key);
    changed = true;
  }
  return { rules: rules.slice(0, 300), changed: changed || (settings.customKeywords || []).length > 0 };
}

function ruleLabel(type) {
  return type === 'source' ? t('creatorSource') : t('topicPhrase');
}

function removeIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>';
}

function renderRules() {
  const list = $('ruleList');
  if (!list) return;
  list.replaceChildren();
  $('ruleCount').textContent = `${personalRules.length} ${personalRules.length === 1 ? t('ruleSingular') : t('rulePlural')}`;

  if (!personalRules.length) {
    const empty = document.createElement('div');
    empty.className = 'rule-empty';
    empty.textContent = t('ruleEmpty');
    list.appendChild(empty);
    return;
  }

  personalRules.forEach((rule) => {
    const row = document.createElement('div');
    row.className = 'rule-row';

    const main = document.createElement('div');
    main.className = 'rule-main';

    const type = document.createElement('span');
    type.className = `rule-type ${rule.type}`;
    type.textContent = rule.type === 'source' ? t('sourceBadge') : t('topicBadge');

    const value = document.createElement('span');
    value.className = 'rule-value';
    value.textContent = rule.value;
    value.title = `${ruleLabel(rule.type)}: ${rule.value}`;

    const remove = document.createElement('button');
    remove.className = 'rule-remove';
    remove.type = 'button';
    remove.setAttribute('aria-label', `${t('removeFilter')}: ${rule.value}`);
    remove.title = t('removeFilter');
    remove.innerHTML = removeIcon();
    remove.addEventListener('click', () => void removeRule(rule.id));

    main.append(type, value);
    row.append(main, remove);
    list.appendChild(row);
  });
}

function updateRuleBuilder() {
  const type = $('ruleType').value;
  if (type === 'source') {
    $('ruleValue').placeholder = t('sourcePlaceholder');
    $('ruleHelp').textContent = t('sourceHelp');
  } else {
    $('ruleValue').placeholder = t('topicPlaceholder');
    $('ruleHelp').textContent = t('topicHelp');
  }
}

function updateQuickSource() {
  if (!currentSource || !activePlatform) {
    $('quickBlockSource').hidden = true;
    $('quickBlockText').textContent = '';
    return;
  }
  $('quickBlockText').textContent = activePlatform === 'YouTube'
    ? t('blockCurrentChannel', { source: currentSource })
    : t('blockCurrentSource', { source: currentSource });
  $('quickBlockSource').hidden = false;
}

function getMetadataLevel(level) {
  const safe = Math.max(1, Math.min(5, Number(level) || 3));
  return [t(`metadata${safe}Title`), t(`metadata${safe}Desc`)];
}

function getKeywordLevel(level) {
  const safe = Math.max(1, Math.min(5, Number(level) || 4));
  return [t(`keyword${safe}Title`), t(`keyword${safe}Desc`)];
}

function updateUi() {
  const metadata = getMetadataLevel($('detectionSensitivity').value);
  $('detectionSensitivityValue').textContent = metadata[0];
  $('metadataHint').textContent = metadata[1];

  const keywords = getKeywordLevel($('keywordSensitivity').value);
  $('keywordSensitivityValue').textContent = keywords[0];
  $('keywordHint').textContent = keywords[1];

  $('blurStrengthValue').textContent = `${$('blurStrength').value}px`;
  $('metadataControls').classList.toggle('disabled-section', !$('detectMetadata').checked);
  $('keywordControls').classList.toggle('disabled-section', !$('detectKeywords').checked);
  const behavior = document.querySelector('input[name="behavior"]:checked')?.value || 'blur';
  $('blurControls').hidden = behavior !== 'blur';
  updateRuleBuilder();
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function platformFromUrl(url = '') {
  if (/^https:\/\/(?:www\.|web\.|m\.)?facebook\.com\//i.test(url)) return 'Facebook';
  if (/^https:\/\/(?:www\.|m\.)?youtube\.com\//i.test(url)) return 'YouTube';
  return null;
}

function setConnection(kind, text) {
  $('connectionDetail').textContent = text;
  $('connectionDot').className = `connection-dot ${kind}`;
}

function formatStats(stats, fallbackPlatform) {
  const platform = stats?.platform || fallbackPlatform;
  const count = Number(stats?.postCount || 0);
  const filtered = Number(stats?.filteredCount || 0);
  const isVideo = (stats?.itemLabel || (platform === 'YouTube' ? 'video' : 'post')) === 'video';
  const items = isVideo
    ? (count === 1 ? t('itemVideo') : t('itemVideos'))
    : (count === 1 ? t('itemPost') : t('itemPosts'));
  return { platform, count, filtered, items };
}

async function refreshCurrentSource(tab, platform) {
  currentSource = '';
  updateQuickSource();
  if (!tab?.id || !platform) return;
  try {
    const context = await chrome.tabs.sendMessage(tab.id, { type: 'NO_AI_FEED_CURRENT_SOURCE' });
    const source = normalizeText(context?.source);
    if (!source) return;
    currentSource = source;
    updateQuickSource();
  } catch {
    // Current page may need one refresh after an extension update.
  }
}

async function refreshConnection() {
  const tab = await getActiveTab();
  activePlatform = platformFromUrl(tab?.url || '');
  if (!tab?.id || !activePlatform) {
    setConnection('disconnected', t('openSupported'));
    currentSource = '';
    updateQuickSource();
    return;
  }

  try {
    const stats = await chrome.tabs.sendMessage(tab.id, { type: 'NO_AI_FEED_STATS' });
    const info = formatStats(stats, activePlatform);
    if (info.count > 0) {
      setConnection('connected', t('connected', {
        platform: info.platform,
        count: info.count,
        items: info.items,
        filtered: info.filtered
      }));
    } else {
      setConnection('checking', t('connectedEmpty', { platform: info.platform }));
    }
  } catch {
    setConnection('disconnected', t('reloadTab', { platform: activePlatform }));
  }

  await refreshCurrentSource(tab, activePlatform);
}

async function persistRules(statusKey = 'saved') {
  personalRules = normalizeRules(personalRules);
  await chrome.storage.local.set({ personalRules, customKeywords: [] });
  renderRules();
  $('status').textContent = t(statusKey);
  setTimeout(refreshConnection, 120);
}

async function addRule(type = $('ruleType').value, rawValue = $('ruleValue').value) {
  const value = normalizeText(rawValue);
  const normalizedType = type === 'source' ? 'source' : 'topic';
  if (!value) {
    $('status').textContent = t('typeFirst');
    $('ruleValue').focus();
    return;
  }

  const duplicate = personalRules.some((rule) => rule.type === normalizedType && rule.value.toLowerCase() === value.toLowerCase());
  if (duplicate) {
    $('status').textContent = t('alreadyFiltered');
    return;
  }

  personalRules.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: normalizedType,
    value
  });
  $('ruleValue').value = '';
  await persistRules('filterAdded');
  $('ruleValue').focus();
}

async function removeRule(id) {
  personalRules = personalRules.filter((rule) => rule.id !== id);
  await persistRules('filterRemoved');
}

async function load() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  language = resolveInitialLanguage(settings.uiLanguage);
  const migration = migrateLegacyKeywords(settings);
  personalRules = migration.rules;

  $('enabled').checked = settings.enabled;
  $('detectLabels').checked = settings.detectLabels;
  $('detectMetadata').checked = settings.detectMetadata;
  $('detectKeywords').checked = settings.detectKeywords;
  $('detectionSensitivity').value = settings.detectionSensitivity;
  $('keywordSensitivity').value = settings.keywordSensitivity;
  $('blurStrength').value = settings.blurStrength;
  $('excludedKeywords').value = (settings.excludedKeywords || []).join('\n');
  $('showReason').checked = settings.showReason;
  const behavior = document.querySelector(`input[name="behavior"][value="${settings.behavior}"]`);
  if (behavior) behavior.checked = true;

  if (migration.changed) await chrome.storage.local.set({ personalRules, customKeywords: [] });
  applyLanguage();
  await refreshConnection();
}

let saveTimer;
function queueSave() {
  clearTimeout(saveTimer);
  $('status').textContent = t('saving');
  updateUi();
  saveTimer = setTimeout(save, 160);
}

async function save() {
  await chrome.storage.local.set({
    enabled: $('enabled').checked,
    detectLabels: $('detectLabels').checked,
    detectMetadata: $('detectMetadata').checked,
    detectKeywords: $('detectKeywords').checked,
    detectionSensitivity: Number($('detectionSensitivity').value),
    keywordSensitivity: Number($('keywordSensitivity').value),
    behavior: document.querySelector('input[name="behavior"]:checked')?.value || 'blur',
    blurStrength: Number($('blurStrength').value),
    personalRules: normalizeRules(personalRules),
    customKeywords: [],
    excludedKeywords: listFromTextarea('excludedKeywords'),
    showReason: $('showReason').checked,
    uiLanguage: language
  });
  $('status').textContent = t('saved');
  setTimeout(refreshConnection, 120);
}

async function rescan() {
  const tab = await getActiveTab();
  activePlatform = platformFromUrl(tab?.url || '');
  if (!tab?.id || !activePlatform) return;
  try {
    const stats = await chrome.tabs.sendMessage(tab.id, { type: 'NO_AI_FEED_RESCAN' });
    $('status').textContent = t('rescanned');
    const info = formatStats(stats, activePlatform);
    if (info.count > 0) {
      setConnection('connected', t('connected', {
        platform: info.platform,
        count: info.count,
        items: info.items,
        filtered: info.filtered
      }));
    } else {
      setConnection('checking', t('connectedEmpty', { platform: info.platform }));
    }
  } catch {
    setConnection('disconnected', t('reloadTab', { platform: activePlatform }));
  }
  await refreshCurrentSource(tab, activePlatform);
}

[
  'enabled', 'detectLabels', 'detectMetadata', 'detectKeywords',
  'detectionSensitivity', 'keywordSensitivity', 'blurStrength',
  'excludedKeywords', 'showReason'
].forEach((id) => {
  const event = ['excludedKeywords', 'detectionSensitivity', 'keywordSensitivity', 'blurStrength'].includes(id) ? 'input' : 'change';
  $(id).addEventListener(event, queueSave);
});

document.querySelectorAll('input[name="behavior"]').forEach((el) => el.addEventListener('change', queueSave));
$('ruleType').addEventListener('change', updateRuleBuilder);
$('addRule').addEventListener('click', () => void addRule());
$('ruleValue').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    void addRule();
  }
});
$('quickBlockSource').addEventListener('click', () => {
  if (currentSource) void addRule('source', currentSource);
});
$('languageToggle').addEventListener('click', async () => {
  language = language === 'ar' ? 'en' : 'ar';
  await chrome.storage.local.set({ uiLanguage: language });
  applyLanguage();
  await refreshConnection();
  $('status').textContent = t('saved');
});
$('rescan').addEventListener('click', () => void rescan());

void load();