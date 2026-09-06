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

const METADATA_LABELS = {
  1: ['Strict', 'Only explicit AI-generation provenance.'],
  2: ['High confidence', 'Also detects metadata naming known AI generators, including Higgsfield/Astra signals.'],
  3: ['Recommended', 'Includes creator/software fields and common generation metadata.'],
  4: ['Broad', 'Also accepts broader generative-AI metadata terms.'],
  5: ['Aggressive', 'Filters weak AI references found in metadata fields.']
};

const KEYWORD_LABELS = {
  1: ['Core', 'Core AI + major tools and blocked topics such as ChatGPT, Higgsfield and Astra.'],
  2: ['Creators', 'Adds image/video generators such as Midjourney, Stable Diffusion, Sora and Runway.'],
  3: ['Technical', 'Adds LLMs, agents, ML, models, RAG, MCP and AI engineering terms.'],
  4: ['Industry', 'Adds AI infrastructure, chips, vector databases and AI product/startup terminology.'],
  5: ['Maximum', 'Also blocks broad adjacent terms such as AI, cloud, AWS, Azure, GPU, API, automation and SaaS. Expect false positives.']
};

const $ = (id) => document.getElementById(id);

function listFromTextarea(id) {
  return $(id).value.split('\n').map((v) => v.trim()).filter(Boolean).slice(0, 250);
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

async function refreshConnection() {
  const tab = await getActiveTab();
  const platform = platformFromUrl(tab?.url || '');
  if (!tab?.id || !platform) {
    setConnection('disconnected', 'Open Facebook or YouTube in the current tab.');
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
}

async function load() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  $('enabled').checked = settings.enabled;
  $('detectLabels').checked = settings.detectLabels;
  $('detectMetadata').checked = settings.detectMetadata;
  $('detectKeywords').checked = settings.detectKeywords;
  $('detectionSensitivity').value = settings.detectionSensitivity;
  $('keywordSensitivity').value = settings.keywordSensitivity;
  $('blurStrength').value = settings.blurStrength;
  $('customKeywords').value = (settings.customKeywords || []).join('\n');
  $('excludedKeywords').value = (settings.excludedKeywords || []).join('\n');
  $('showReason').checked = settings.showReason;
  const behavior = document.querySelector(`input[name="behavior"][value="${settings.behavior}"]`);
  if (behavior) behavior.checked = true;
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
    customKeywords: listFromTextarea('customKeywords'),
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
}

[
  'enabled', 'detectLabels', 'detectMetadata', 'detectKeywords',
  'detectionSensitivity', 'keywordSensitivity', 'blurStrength',
  'customKeywords', 'excludedKeywords', 'showReason'
].forEach((id) => {
  const event = ['customKeywords', 'excludedKeywords', 'detectionSensitivity', 'keywordSensitivity', 'blurStrength'].includes(id) ? 'input' : 'change';
  $(id).addEventListener(event, queueSave);
});

document.querySelectorAll('input[name="behavior"]').forEach((el) => el.addEventListener('change', queueSave));
$('rescan').addEventListener('click', rescan);

void load();