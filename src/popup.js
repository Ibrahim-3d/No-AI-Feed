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
    checkingTab: 'Checking current tab…',
    rescan: 'Rescan page',
    aiFilter: 'AI Filter',
    aiFilterDesc: 'Hide AI-generated content, tools, and signals.',
    focused: 'Focused',
    focusedDesc: 'Minimal filtering',
    balanced: 'Balanced',
    balancedDesc: 'A cleaner feed',
    aggressive: 'Aggressive',
    aggressiveDesc: 'Maximum filtering',
    recommended: 'Recommended',
    myFilters: 'My Filters',
    manage: 'Manage',
    quickAddPlaceholder: 'Add a topic or phrase…',
    topicPhrase: 'Topic / phrase',
    creatorSource: 'Creator / page / channel',
    addFilter: 'Add filter',
    whenMatched: 'When something matches',
    whenMatchedDesc: 'Choose how filtered content should behave.',
    blur: 'Blur',
    hideCompletely: 'Hide completely',
    localOnly: 'Private by design',
    localOnlyDesc: 'Filtering stays in your browser.',
    supportTitle: 'Support No AI Feed',
    supportDesc: 'Help keep the web a more human place.',
    supportButton: 'Buy me a coffee',
    feedback: 'Feedback',
    privacy: 'Privacy',
    manageFiltersTitle: 'Manage filters',
    manageFiltersDesc: 'Edit rules, exceptions, and advanced detection.',
    filtersTab: 'Filters',
    advancedTab: 'Advanced',
    back: 'Back',
    previous: 'Previous page',
    next: 'Next page',
    exceptions: 'Exceptions',
    exceptionsHelp: 'One phrase per line. Exceptions override built-in and personal filters.',
    exceptionsPlaceholder: 'e.g. cloud photography\nAI research paper',
    facebookLabels: 'Facebook AI labels',
    facebookLabelsDesc: 'Uses labels such as “AI info” and “Made with AI”.',
    mediaMetadata: 'Media metadata',
    mediaMetadataDesc: 'Reads Facebook/CDN media locally for AI metadata.',
    metadataSensitivity: 'Metadata sensitivity',
    aiCoverage: 'AI filter coverage',
    blurStrength: 'Blur strength',
    showReason: 'Show why it was filtered',
    showReasonDesc: 'Display the matching rule when content is blurred.',
    ruleEmpty: 'No personal filters yet.',
    ruleSingular: 'rule',
    rulePlural: 'rules',
    topicBadge: 'TOPIC',
    sourceBadge: 'SOURCE',
    removeFilter: 'Remove filter',
    topicPlaceholder: 'e.g. crypto, football transfers, politics',
    sourcePlaceholder: 'e.g. MrBeast, Some Facebook Page, @channel',
    topicHelp: 'Hide posts or videos that mention this topic or phrase.',
    sourceHelp: 'Hide posts or videos from this creator, page or channel.',
    blockCurrentChannel: 'Block current channel: {source}',
    blockCurrentSource: 'Block current page/creator: {source}',
    openSupported: 'Open Facebook or YouTube',
    connectedActive: 'Filtering active',
    connectedEmpty: 'Filtering active',
    reloadTab: 'Reload once to activate',
    noSupportedSite: 'Current tab',
    saving: 'Saving…',
    saved: 'Saved',
    rescanned: 'Rescanned',
    typeFirst: 'Type something first',
    alreadyFiltered: 'Already filtered',
    filterAdded: 'Filter added',
    filterRemoved: 'Filter removed',
    supportUnavailable: 'Add your donation URL to activate this button.',
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
    keyword1Desc: 'Major AI tools and topics.',
    keyword2Title: 'Focused',
    keyword2Desc: 'Adds common image and video generators.',
    keyword3Title: 'Technical',
    keyword3Desc: 'Adds LLM, agent, ML, RAG, MCP and engineering terms.',
    keyword4Title: 'Balanced',
    keyword4Desc: 'Adds AI infrastructure, chips, databases and product terminology.',
    keyword5Title: 'Aggressive',
    keyword5Desc: 'Also blocks broad adjacent technology terms.'
  },
  ar: {
    brandSubtitle: 'خلاصتك، بقواعدك أنت',
    checkingTab: 'جارٍ فحص الصفحة…',
    rescan: 'إعادة فحص الصفحة',
    aiFilter: 'فلتر الذكاء الاصطناعي',
    aiFilterDesc: 'إخفاء المحتوى والأدوات والإشارات المرتبطة بالذكاء الاصطناعي.',
    focused: 'محدد',
    focusedDesc: 'فلترة خفيفة',
    balanced: 'متوازن',
    balancedDesc: 'خلاصة أنظف',
    aggressive: 'أقصى',
    aggressiveDesc: 'أقصى فلترة',
    recommended: 'موصى به',
    myFilters: 'فلاتري',
    manage: 'إدارة',
    quickAddPlaceholder: 'أضف موضوعاً أو عبارة…',
    topicPhrase: 'موضوع / عبارة',
    creatorSource: 'منشئ / صفحة / قناة',
    addFilter: 'إضافة فلتر',
    whenMatched: 'عند العثور على تطابق',
    whenMatchedDesc: 'اختر ما يحدث للمحتوى المطابق.',
    blur: 'تمويه',
    hideCompletely: 'إخفاء بالكامل',
    localOnly: 'خصوصيتك أولاً',
    localOnlyDesc: 'الفلترة تبقى داخل متصفحك.',
    supportTitle: 'ادعم No AI Feed',
    supportDesc: 'ساعدنا نحافظ على ويب أكثر إنسانية.',
    supportButton: 'ادعم المشروع',
    feedback: 'ملاحظات',
    privacy: 'الخصوصية',
    manageFiltersTitle: 'إدارة الفلاتر',
    manageFiltersDesc: 'عدّل القواعد والاستثناءات والاكتشاف المتقدم.',
    filtersTab: 'الفلاتر',
    advancedTab: 'متقدم',
    back: 'رجوع',
    previous: 'الصفحة السابقة',
    next: 'الصفحة التالية',
    exceptions: 'الاستثناءات',
    exceptionsHelp: 'عبارة واحدة في كل سطر. الاستثناءات تتجاوز كل الفلاتر الأخرى.',
    exceptionsPlaceholder: 'مثال: تصوير السحاب\nبحث أكاديمي عن الذكاء الاصطناعي',
    facebookLabels: 'علامات الذكاء الاصطناعي في فيسبوك',
    facebookLabelsDesc: 'يستخدم علامات مثل “AI info” و “Made with AI”.',
    mediaMetadata: 'بيانات الوسائط',
    mediaMetadataDesc: 'يقرأ وسائط فيسبوك وشبكة توصيله محلياً لفحص بياناتها.',
    metadataSensitivity: 'حساسية بيانات الوسائط',
    aiCoverage: 'نطاق فلترة الذكاء الاصطناعي',
    blurStrength: 'قوة التمويه',
    showReason: 'إظهار سبب الفلترة',
    showReasonDesc: 'يعرض القاعدة المطابقة عند تمويه المحتوى.',
    ruleEmpty: 'لا توجد فلاتر شخصية بعد.',
    ruleSingular: 'فلتر',
    rulePlural: 'فلاتر',
    topicBadge: 'موضوع',
    sourceBadge: 'مصدر',
    removeFilter: 'حذف الفلتر',
    topicPlaceholder: 'مثال: كريبتو، انتقالات كرة القدم، سياسة',
    sourcePlaceholder: 'مثال: اسم قناة، صفحة فيسبوك، @channel',
    topicHelp: 'يخفي أي منشور أو فيديو يذكر هذا الموضوع أو العبارة.',
    sourceHelp: 'يخفي المحتوى من منشئ المحتوى أو الصفحة أو القناة.',
    blockCurrentChannel: 'حظر القناة الحالية: {source}',
    blockCurrentSource: 'حظر الصفحة/المنشئ الحالي: {source}',
    openSupported: 'افتح فيسبوك أو يوتيوب',
    connectedActive: 'الفلترة تعمل',
    connectedEmpty: 'الفلترة تعمل',
    reloadTab: 'أعد التحميل مرة واحدة للتفعيل',
    noSupportedSite: 'الصفحة الحالية',
    saving: 'جارٍ الحفظ…',
    saved: 'تم الحفظ',
    rescanned: 'تمت إعادة الفحص',
    typeFirst: 'اكتب شيئاً أولاً',
    alreadyFiltered: 'مضاف بالفعل',
    filterAdded: 'تمت إضافة الفلتر',
    filterRemoved: 'تم حذف الفلتر',
    supportUnavailable: 'أضف رابط التبرع لتفعيل هذا الزر.',
    metadata1Title: 'صارم', metadata1Desc: 'يعتمد فقط على دلائل صريحة.',
    metadata2Title: 'ثقة عالية', metadata2Desc: 'يضيف أسماء مولدات معروفة.',
    metadata3Title: 'موصى به', metadata3Desc: 'يشمل بيانات التوليد والبرامج الشائعة.',
    metadata4Title: 'واسع', metadata4Desc: 'يقبل إشارات أوسع مرتبطة بالذكاء الاصطناعي.',
    metadata5Title: 'هجومي', metadata5Desc: 'يفلتر حتى الإشارات الضعيفة.',
    keyword1Title: 'أساسي', keyword1Desc: 'أهم أدوات ومواضيع الذكاء الاصطناعي.',
    keyword2Title: 'محدد', keyword2Desc: 'يضيف مولدات الصور والفيديو الشائعة.',
    keyword3Title: 'تقني', keyword3Desc: 'يضيف LLM والوكلاء وML وRAG وMCP.',
    keyword4Title: 'متوازن', keyword4Desc: 'يضيف البنية التحتية والشرائح وقواعد البيانات.',
    keyword5Title: 'أقصى', keyword5Desc: 'يضيف مصطلحات تقنية أوسع.'
  }
};

const SUPPORT_URL = '';
const RULES_PER_PAGE = 5;
const $ = (id) => document.getElementById(id);
let personalRules = [];
let currentSource = '';
let activePlatform = null;
let language = 'en';
let rulesPage = 0;
let toastTimer = null;

function normalizeText(value) { return (value || '').replace(/\s+/g, ' ').trim(); }
function t(key, vars = {}) {
  let value = COPY[language]?.[key] ?? COPY.en[key] ?? key;
  Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
  return value;
}
function resolveInitialLanguage(saved) {
  if (saved === 'en' || saved === 'ar') return saved;
  const ui = (chrome.i18n?.getUILanguage?.() || navigator.language || 'en').toLowerCase();
  return ui.startsWith('ar') ? 'ar' : 'en';
}
function showToast(keyOrText, isKey = true) {
  const el = $('status');
  if (!el) return;
  el.textContent = isKey ? t(keyOrText) : keyOrText;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1500);
}
function applyLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const value = t(el.dataset.i18nAria);
    el.setAttribute('aria-label', value);
    if (el.hasAttribute('title')) el.title = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  $('languageToggle').textContent = language === 'ar' ? 'EN' : 'AR';
  $('languageToggle').setAttribute('aria-label', language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  $('excludedKeywords').placeholder = t('exceptionsPlaceholder');
  renderRules();
  updateUi();
  updateQuickSource();
}
function listFromTextarea(id) { return $(id).value.split('\n').map((v) => normalizeText(v)).filter(Boolean).slice(0, 250); }
function normalizeRules(rules) {
  const seen = new Set();
  return (Array.isArray(rules) ? rules : []).map((rule) => ({
    id: String(rule?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    type: rule?.type === 'source' ? 'source' : 'topic',
    value: normalizeText(rule?.value)
  })).filter((rule) => {
    if (!rule.value) return false;
    const key = `${rule.type}:${rule.value.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 300);
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
function removeIcon() { return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>'; }
function ruleLabel(type) { return type === 'source' ? t('creatorSource') : t('topicPhrase'); }

function renderRulePreview() {
  const list = $('rulePreviewList');
  list.replaceChildren();
  if (!personalRules.length) {
    const empty = document.createElement('span');
    empty.className = 'rule-empty-preview';
    empty.textContent = t('ruleEmpty');
    list.appendChild(empty);
    return;
  }
  personalRules.slice(0, 3).forEach((rule) => {
    const chip = document.createElement('span');
    chip.className = 'rule-chip';
    const value = document.createElement('span');
    value.textContent = rule.value;
    value.title = `${ruleLabel(rule.type)}: ${rule.value}`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.setAttribute('aria-label', `${t('removeFilter')}: ${rule.value}`);
    remove.innerHTML = removeIcon();
    remove.addEventListener('click', () => void removeRule(rule.id));
    chip.append(value, remove);
    list.appendChild(chip);
  });
}
function renderManageRules() {
  const list = $('ruleList');
  list.replaceChildren();
  const pageCount = Math.max(1, Math.ceil(personalRules.length / RULES_PER_PAGE));
  rulesPage = Math.max(0, Math.min(rulesPage, pageCount - 1));
  const start = rulesPage * RULES_PER_PAGE;
  const visible = personalRules.slice(start, start + RULES_PER_PAGE);
  if (!visible.length) {
    const empty = document.createElement('div');
    empty.className = 'rule-empty';
    empty.textContent = t('ruleEmpty');
    list.appendChild(empty);
  } else {
    visible.forEach((rule) => {
      const row = document.createElement('div'); row.className = 'rule-row';
      const main = document.createElement('div'); main.className = 'rule-main';
      const type = document.createElement('span'); type.className = `rule-type ${rule.type}`; type.textContent = rule.type === 'source' ? t('sourceBadge') : t('topicBadge');
      const value = document.createElement('span'); value.className = 'rule-value'; value.textContent = rule.value; value.title = `${ruleLabel(rule.type)}: ${rule.value}`;
      const remove = document.createElement('button'); remove.className = 'rule-remove'; remove.type = 'button'; remove.setAttribute('aria-label', `${t('removeFilter')}: ${rule.value}`); remove.innerHTML = removeIcon(); remove.addEventListener('click', () => void removeRule(rule.id));
      main.append(type, value); row.append(main, remove); list.appendChild(row);
    });
  }
  $('rulesPage').textContent = `${rulesPage + 1} / ${pageCount}`;
  $('prevRules').disabled = rulesPage <= 0;
  $('nextRules').disabled = rulesPage >= pageCount - 1;
}
function renderRules() {
  $('ruleCount').textContent = `${personalRules.length} ${personalRules.length === 1 ? t('ruleSingular') : t('rulePlural')}`;
  renderRulePreview();
  renderManageRules();
}

function updateRuleBuilder() {
  const primaryType = $('ruleType').value;
  const manageType = $('manageRuleType').value;
  $('manageRuleValue').placeholder = manageType === 'source' ? t('sourcePlaceholder') : t('topicPlaceholder');
  $('ruleValue').placeholder = t('quickAddPlaceholder');
  $('ruleHelp').textContent = primaryType === 'source' ? t('sourceHelp') : t('topicHelp');
}
function updateQuickSource() {
  const visible = Boolean(currentSource && activePlatform);
  $('quickBlockSource').hidden = !visible;
  $('quickBlockSourceManage').hidden = !visible;
  if (!visible) return;
  const text = activePlatform === 'YouTube' ? t('blockCurrentChannel', { source: currentSource }) : t('blockCurrentSource', { source: currentSource });
  $('quickBlockText').textContent = text;
  $('quickBlockTextManage').textContent = text;
}
function getMetadataLevel(level) {
  const safe = Math.max(1, Math.min(5, Number(level) || 3));
  return [t(`metadata${safe}Title`), t(`metadata${safe}Desc`)];
}
function getKeywordLevel(level) {
  const safe = Math.max(1, Math.min(5, Number(level) || 4));
  return [t(`keyword${safe}Title`), t(`keyword${safe}Desc`)];
}
function updateModeSelection() {
  const level = Number($('keywordSensitivity').value) || 4;
  const selectedLevel = level <= 2 ? 2 : level >= 5 ? 5 : 4;
  document.querySelectorAll('.mode-option').forEach((button) => {
    const selected = Number(button.dataset.level) === selectedLevel;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-checked', String(selected));
  });
}
function updateUi() {
  const metadata = getMetadataLevel($('detectionSensitivity').value);
  $('detectionSensitivityValue').textContent = metadata[0];
  $('metadataHint').textContent = metadata[1];
  const keywords = getKeywordLevel($('keywordSensitivity').value);
  $('keywordSensitivityValue').textContent = keywords[0];
  $('keywordSensitivityAdvancedValue').textContent = keywords[0];
  $('keywordSensitivityAdvanced').value = $('keywordSensitivity').value;
  $('blurStrengthValue').textContent = `${$('blurStrength').value}px`;
  $('metadataControls').classList.toggle('disabled-section', !$('detectMetadata').checked);
  $('keywordControls').classList.toggle('disabled-section', !$('detectKeywords').checked);
  updateModeSelection();
  updateRuleBuilder();
}

async function getActiveTab() { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); return tab; }
function platformFromUrl(url = '') {
  if (/^https:\/\/(?:www\.|web\.|m\.)?facebook\.com\//i.test(url)) return 'Facebook';
  if (/^https:\/\/(?:www\.|m\.)?youtube\.com\//i.test(url)) return 'YouTube';
  return null;
}
function platformIcon(platform) {
  if (platform === 'YouTube') return '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3V9Z"/></svg>';
  if (platform === 'Facebook') return '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10"/><path d="M13 8.5h2V6h-2c-2.2 0-3.5 1.3-3.5 3.6V11H7v3h2.5v4H13v-4h2.5l.5-3H13V9.8c0-.8.3-1.3 1-1.3Z"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>';
}
function setPlatform(platform) {
  const mark = $('platformMark');
  mark.className = `platform-mark ${platform === 'YouTube' ? 'youtube' : platform === 'Facebook' ? 'facebook' : 'generic'}`;
  mark.innerHTML = platformIcon(platform);
  $('connectionPlatform').textContent = platform || t('noSupportedSite');
}
function setConnection(kind, text) {
  $('connectionDetail').textContent = text;
  $('connectionDot').className = `connection-dot ${kind}`;
}
function formatStats(stats, fallbackPlatform) {
  return { platform: stats?.platform || fallbackPlatform, count: Number(stats?.postCount || 0), filtered: Number(stats?.filteredCount || 0) };
}
async function refreshCurrentSource(tab, platform) {
  currentSource = '';
  updateQuickSource();
  if (!tab?.id || !platform) return;
  try {
    const context = await chrome.tabs.sendMessage(tab.id, { type: 'NO_AI_FEED_CURRENT_SOURCE' });
    currentSource = normalizeText(context?.source);
    updateQuickSource();
  } catch {}
}
async function refreshConnection() {
  const tab = await getActiveTab();
  activePlatform = platformFromUrl(tab?.url || '');
  setPlatform(activePlatform);
  if (!tab?.id || !activePlatform) {
    setConnection('disconnected', t('openSupported'));
    currentSource = '';
    updateQuickSource();
    return;
  }
  try {
    const stats = await chrome.tabs.sendMessage(tab.id, { type: 'NO_AI_FEED_STATS' });
    const info = formatStats(stats, activePlatform);
    setPlatform(info.platform);
    setConnection(info.count >= 0 ? 'connected' : 'checking', info.count > 0 ? t('connectedActive') : t('connectedEmpty'));
    $('connectionDetail').title = `${info.filtered} filtered`;
  } catch {
    setConnection('disconnected', t('reloadTab'));
  }
  await refreshCurrentSource(tab, activePlatform);
}

async function persistRules(statusKey = 'saved') {
  personalRules = normalizeRules(personalRules);
  await chrome.storage.local.set({ personalRules, customKeywords: [] });
  renderRules();
  showToast(statusKey);
  setTimeout(refreshConnection, 120);
}
async function addRule(type, rawValue) {
  const normalizedType = type === 'source' ? 'source' : 'topic';
  const value = normalizeText(rawValue);
  if (!value) { showToast('typeFirst'); return false; }
  const duplicate = personalRules.some((rule) => rule.type === normalizedType && rule.value.toLowerCase() === value.toLowerCase());
  if (duplicate) { showToast('alreadyFiltered'); return false; }
  personalRules.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, type: normalizedType, value });
  rulesPage = Math.max(0, Math.ceil(personalRules.length / RULES_PER_PAGE) - 1);
  await persistRules('filterAdded');
  return true;
}
async function removeRule(id) {
  personalRules = personalRules.filter((rule) => rule.id !== id);
  await persistRules('filterRemoved');
}

async function load() {
  $('supportButton').hidden = !SUPPORT_URL;
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
  $('keywordSensitivityAdvanced').value = settings.keywordSensitivity;
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
  updateUi();
  showToast('saving');
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
  showToast('saved');
  setTimeout(refreshConnection, 120);
}
async function rescan() {
  const tab = await getActiveTab();
  activePlatform = platformFromUrl(tab?.url || '');
  setPlatform(activePlatform);
  if (!tab?.id || !activePlatform) return;
  try {
    const stats = await chrome.tabs.sendMessage(tab.id, { type: 'NO_AI_FEED_RESCAN' });
    const info = formatStats(stats, activePlatform);
    setConnection('connected', t('connectedActive'));
    $('connectionDetail').title = `${info.filtered} filtered`;
    showToast('rescanned');
  } catch { setConnection('disconnected', t('reloadTab')); }
  await refreshCurrentSource(tab, activePlatform);
}
function showView(name) {
  $('primaryView').hidden = name !== 'primary';
  $('manageView').hidden = name !== 'manage';
}
function showManageTab(name) {
  const filters = name === 'filters';
  $('filtersTabPanel').hidden = !filters;
  $('advancedTabPanel').hidden = filters;
  $('filtersTabButton').classList.toggle('active', filters);
  $('advancedTabButton').classList.toggle('active', !filters);
  $('filtersTabButton').setAttribute('aria-selected', String(filters));
  $('advancedTabButton').setAttribute('aria-selected', String(!filters));
}

['enabled', 'detectLabels', 'detectMetadata', 'detectKeywords', 'detectionSensitivity', 'blurStrength', 'excludedKeywords', 'showReason'].forEach((id) => {
  const event = ['detectionSensitivity', 'blurStrength', 'excludedKeywords'].includes(id) ? 'input' : 'change';
  $(id).addEventListener(event, queueSave);
});
document.querySelectorAll('input[name="behavior"]').forEach((el) => el.addEventListener('change', queueSave));
document.querySelectorAll('.mode-option').forEach((button) => button.addEventListener('click', () => {
  $('keywordSensitivity').value = button.dataset.level;
  $('keywordSensitivityAdvanced').value = button.dataset.level;
  queueSave();
}));
$('keywordSensitivityAdvanced').addEventListener('input', () => {
  $('keywordSensitivity').value = $('keywordSensitivityAdvanced').value;
  queueSave();
});
$('ruleType').addEventListener('change', updateRuleBuilder);
$('manageRuleType').addEventListener('change', updateRuleBuilder);
$('addRule').addEventListener('click', async () => {
  const type = $('ruleType').value || 'topic';
  if (await addRule(type, $('ruleValue').value)) $('ruleValue').value = '';
});
$('ruleValue').addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') { event.preventDefault(); const type = $('ruleType').value || 'topic'; if (await addRule(type, $('ruleValue').value)) $('ruleValue').value = ''; }
});
$('manageAddRule').addEventListener('click', async () => {
  if (await addRule($('manageRuleType').value, $('manageRuleValue').value)) $('manageRuleValue').value = '';
});
$('manageRuleValue').addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') { event.preventDefault(); if (await addRule($('manageRuleType').value, $('manageRuleValue').value)) $('manageRuleValue').value = ''; }
});
$('quickBlockSource').addEventListener('click', () => { if (currentSource) void addRule('source', currentSource); });
$('quickBlockSourceManage').addEventListener('click', () => { if (currentSource) void addRule('source', currentSource); });
$('languageToggle').addEventListener('click', async () => {
  language = language === 'ar' ? 'en' : 'ar';
  await chrome.storage.local.set({ uiLanguage: language });
  applyLanguage();
  await refreshConnection();
  showToast('saved');
});
$('rescan').addEventListener('click', () => void rescan());
$('manageFilters').addEventListener('click', () => { showView('manage'); showManageTab('filters'); renderRules(); });
$('backToMain').addEventListener('click', () => showView('primary'));
$('filtersTabButton').addEventListener('click', () => showManageTab('filters'));
$('advancedTabButton').addEventListener('click', () => showManageTab('advanced'));
$('prevRules').addEventListener('click', () => { rulesPage = Math.max(0, rulesPage - 1); renderManageRules(); });
$('nextRules').addEventListener('click', () => { rulesPage += 1; renderManageRules(); });
$('supportButton').addEventListener('click', () => {
  if (SUPPORT_URL) window.open(SUPPORT_URL, '_blank', 'noopener,noreferrer');
  else showToast('supportUnavailable');
});

void load();
