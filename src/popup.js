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
  showReason: true
};

const METADATA_LABELS = {
  1: ['Strict', 'Only explicit AI-generation provenance.'],
  2: ['High confidence', 'Also detects metadata naming known AI generators, including Higgsfield/Astra signals.'],
  3: ['Recommended', 'Includes creator/software fields and common generation metadata.'],
  4: ['Broad', 'Also accepts broader generative-AI metadata terms.'],
  5: ['Aggressive', 'Filters weak AI references found in metadata fields.']
};

const KEYWORD_LABELS = {
  1: ['Core', 'Core AI + major tools such as ChatGPT, Higgsfield and Astra.'],
  2: ['Creators', 'Adds image/video generators such as Midjourney, Stable Diffusion, Sora and Runway.'],
  3: ['Technical', 'Adds LLMs, agents, ML, models, RAG, MCP and AI engineering terms.'],
  4: ['Industry', 'Adds AI infrastructure, chips, vector databases and AI product/startup terminology.'],
  5: ['Maximum', 'Also blocks broad adjacent terms such as AI, cloud, AWS, Azure, GPU, API, automation and SaaS. Expect false positives.']
};

const $ = (id) => document.getElementById(id);
let personalRules = [];
let currentSource = '';

function normalizeText(value) {
  return (value || '').replace(/\s+/g, ' ').trim();
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
  return type === 'source' ? 'Creator / page / channel' : 'Topic / phrase';
}

function renderRules() {
  const list = $('ruleList');
  list.replaceChildren();
  $('ruleCount').textContent = `${personalRules.length} ${personalRules.length === 1 ? 'rule' : 'rules'}`;

  if (!personalRules.length) {
    const empty = document.createElement('div');
    empty.className = 'rule-empty';
    empty.textContent = 'No personal filters yet. Add a topic or creator above.';
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
    type.textContent = rule.type === 'source' ? 'SOURCE' : 'TOPIC';

    const value = document.createElement('span');
    value.className = 'rule-value';
    value.textContent = rule.value;
    value.title = `${ruleLabel(rule.type)}: ${rule.value}`;

    const remove = document.createElement('button');
    remove.className = 'rule-remove';
    remove.type = 'button';
    remove.setAttribute('aria-label', `Remove ${rule.value}`);
    remove.title = 'Remove filter';
    remove.textContent = '×';
    remove.addEventListener('click', () => removeRule(rule.id));

    main.append(type, value);
    row.append(main, remove);
    list.appendChild(row);
  });
}

function updateRuleBuilder() {
  const type = $('ruleType').value;
  if (type === 'source') {
    $('ruleValue').placeholder = 'e.g. MrBeast, Some Facebook Page, @channel';
    $('ruleHelp').textContent = 'Hide posts or videos from this creator, page or channel.';
  } else {
    $('ruleValue').placeholder = 'e.g. crypto, football transfers, politics';
    $('ruleHelp').textContent = 'Hide any post or video that mentions this topic or phrase.';
  }
}

function updateUi() {
  const metadata = METADATA_LABELS[$('detectionSensitivity').value] || METADATA_LABELS[3];
  $('detectionSensitivityValue').textContent = metadata[0];
  $('metadataHint').textContent = metadata[1];

  const keywords = KEYWORD_LABELS[$('keywordSensitivity').value] || KEYWORD_LABELS[4];
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
  const singular = stats?.itemLabel || (platform === 'YouTube' ? 'video' : 'post');
  const plural = count === 1 ? singular : `${singular}s`;
  return { platform, count, filtered, singular, plural };
}

function hideQuickSource() {
  currentSource = '';
  $('quickBlockSource').hidden = true;
  $('quickBlockSource').textContent = '';
}

async function refreshCurrentSource(tab, platform) {
  hideQuickSource();
  if (!tab?.id || !platform) return;

  try {
    const context = await chrome.tabs.sendMessage(tab.id, { type: 'NO_AI_FEED_CURRENT_SOURCE' });
    const source = normalizeText(context?.source);
    if (!source) return;
    currentSource = source;
    $('quickBlockSource').textContent = `Block current ${platform === 'YouTube' ? 'channel' : 'page/creator'}: ${source}`;
    $('quickBlockSource').hidden = false;
  } catch {
    // The current tab may need one refresh after updating the extension.
  }
}

async function refreshConnection() {
  const tab = await getActiveTab();
  const platform = platformFromUrl(tab?.url || '');
  if (!tab?.id || !platform) {
    setConnection('disconnected', 'Open Facebook or YouTube in the current tab.');
    hideQuickSource();
    return;
  }

  try {
    const stats = await chrome.tabs.sendMessage(tab.id, { type: 'NO_AI_FEED_STATS' });
    const info = formatStats(stats, platform);
    if (info.count > 0) {
      setConnection('connected', `${info.platform} · ${info.count} ${info.plural} detected · ${info.filtered} filtered`);
    } else {
      setConnection('checking', `${info.platform} connected, but no filterable items are visible yet.`);
    }
  } catch {
    setConnection('disconnected', `Reload this ${platform} tab once to activate the extension.`);
  }

  await refreshCurrentSource(tab, platform);
}

async function persistRules(statusText = 'Saved') {
  personalRules = normalizeRules(personalRules);
  await chrome.storage.local.set({ personalRules, customKeywords: [] });
  renderRules();
  $('status').textContent = statusText;
  setTimeout(refreshConnection, 120);
}

async function addRule(type = $('ruleType').value, rawValue = $('ruleValue').value) {
  const value = normalizeText(rawValue);
  const normalizedType = type === 'source' ? 'source' : 'topic';
  if (!value) {
    $('status').textContent = 'Type something first';
    $('ruleValue').focus();
    return;
  }

  const duplicate = personalRules.some((rule) => rule.type === normalizedType && rule.value.toLowerCase() === value.toLowerCase());
  if (duplicate) {
    $('status').textContent = 'Already filtered';
    return;
  }

  personalRules.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: normalizedType,
    value
  });
  $('ruleValue').value = '';
  await persistRules('Filter added');
  $('ruleValue').focus();
}

async function removeRule(id) {
  personalRules = personalRules.filter((rule) => rule.id !== id);
  await persistRules('Filter removed');
}

async function load() {
  const settings = await chrome.storage.local.get(DEFAULTS);
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
  renderRules();
  updateUi();
  await refreshConnection();
}

let saveTimer;
function queueSave() {
  clearTimeout(saveTimer);
  $('status').textContent = 'Saving…';
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
    showReason: $('showReason').checked
  });
  $('status').textContent = 'Saved';
  setTimeout(refreshConnection, 120);
}

async function rescan() {
  const tab = await getActiveTab();
  const platform = platformFromUrl(tab?.url || '');
  if (!tab?.id || !platform) return;
  try {
    const stats = await chrome.tabs.sendMessage(tab.id, { type: 'NO_AI_FEED_RESCAN' });
    $('status').textContent = 'Rescanned';
    const info = formatStats(stats, platform);
    if (info.count > 0) setConnection('connected', `${info.platform} · ${info.count} ${info.plural} detected · ${info.filtered} filtered`);
    else setConnection('checking', `${info.platform} connected, but no filterable items are visible yet.`);
  } catch {
    $('status').textContent = `Reload ${platform}`;
    setConnection('disconnected', `Reload this ${platform} tab once to activate the extension.`);
  }
  await refreshCurrentSource(tab, platform);
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
$('addRule').addEventListener('click', () => addRule());
$('ruleValue').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    void addRule();
  }
});
$('quickBlockSource').addEventListener('click', () => {
  if (currentSource) void addRule('source', currentSource);
});
$('rescan').addEventListener('click', rescan);

void load();