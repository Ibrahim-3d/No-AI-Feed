// npm install --no-save playwright; CHROME_BIN=/path/to/chrome node tests/browser.cjs
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const ROOT=path.resolve(__dirname,'..');
const ASSETS=path.join(ROOT,'store/assets');fs.mkdirSync(ASSETS,{recursive:true});
const chromeMock=(settings)=>{
 let data={...settings};const listeners=[],messages=[];
 window.chrome={i18n:{getUILanguage:()=> 'en'},storage:{local:{async get(defaults){return {...defaults,...data}},async set(values){const changes={};for(const [key,newValue] of Object.entries(values)){if(JSON.stringify(data[key])!==JSON.stringify(newValue))changes[key]={oldValue:data[key],newValue};data[key]=newValue}for(const fn of listeners)fn(changes,'local')}},onChanged:{addListener(fn){listeners.push(fn)}}},runtime:{onMessage:{addListener(fn){messages.push(fn)}},async sendMessage(){return {match:false}}},tabs:{async query(){return [{id:1,url:'https://www.youtube.com/results?search_query=landscape'}]},async sendMessage(id,message){if(message.type==='NO_AI_FEED_CURRENT_SOURCE')return {platform:'YouTube',source:''};return {connected:true,postCount:3,filteredCount:1}}}};
 window.__settings=()=>data;window.__rescan=()=>messages.forEach(fn=>fn({type:'NO_AI_FEED_RESCAN'},{},()=>{}));
};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,args:['--no-sandbox','--disable-gpu'],headless:true});
 const checks=[],errors=[];const context=await browser.newContext({viewport:{width:380,height:540},deviceScaleFactor:2});
 context.setDefaultTimeout(8000);context.setDefaultNavigationTimeout(8000);const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(chromeMock,{uiLanguage:'en',personalRules:[{id:'a',type:'topic',value:'crypto'},{id:'b',type:'source',value:'Example Channel'}]});
 await page.goto('file://'+ROOT+'/src/popup.html');await page.waitForFunction(()=>document.querySelector('#connectionDetail').textContent!=='Checking current tab…');
 for(const language of ['en','ar']){ console.log('UI',language);
 if(language==='ar')await page.click('#languageToggle');
 if(await page.locator('#backToMain').isVisible())await page.click('#backToMain');
 await page.locator('.app-shell').screenshot({path:ASSETS+`/popup-${language}.png`});
 await page.click('#manageFilters');await page.locator('.app-shell').screenshot({path:ASSETS+`/manage-${language}.png`});
 await page.click('#advancedTabButton');await page.locator('.app-shell').screenshot({path:ASSETS+`/advanced-${language}.png`});
 const bounds=await page.evaluate(()=>({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight}));assert.equal(bounds.w,380);assert.equal(bounds.h,540);checks.push(`${language}: 380x540 popup, management and advanced views rendered`);
 await page.click('#backToMain');
 }
 await page.fill('#ruleValue','test phrase');await page.click('#addRule');await page.waitForFunction(()=>window.__settings().personalRules.some(r=>r.value==='test phrase'));checks.push('popup saves a personal topic rule');
 await page.click('#languageToggle');await page.click('#openAdvancedSettings');await page.uncheck('#detectMetadata');await page.waitForFunction(()=>window.__settings().detectMetadata===false);checks.push('popup persists metadata toggle');
 // Isolated supported-page fixtures execute actual content scripts with mocked Chrome APIs.
 for(const platform of ['youtube','facebook']){
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.route('**/*',route=>route.fulfill({contentType:'text/html',body:`<!doctype html><html><body><main role="main">${platform==='youtube'?'<ytd-rich-item-renderer id="item"><a href="/watch?v=1">ChatGPT landscape tutorial</a><ytd-channel-name><a href="/@example">Example Channel</a></ytd-channel-name></ytd-rich-item-renderer>':'<article role="article" id="item"><a href="/example">Example Creator</a><p>AI info — ChatGPT landscape tutorial</p></article>'}</main></body></html>`}));
 await p.addInitScript(chromeMock,{enabled:true,detectMetadata:false,personalRules:[{id:'dual',type:'topic',value:'landscape'}]});await p.goto(`https://www.${platform}.com/`);
 for(const script of [platform==='youtube'?'youtube.js':'content.js','personal-filter.js'])await p.addScriptTag({path:ROOT+'/src/'+script});
 await p.waitForFunction(()=>document.querySelector('#item').className.includes('blurred'));
 await p.locator('button').first().click();await p.waitForFunction(()=>!document.querySelector('#item').className.includes('blurred'));checks.push(`${platform}: one click reveals an item matched by both filters`);
 await p.evaluate(()=>chrome.storage.local.set({excludedKeywords:['landscape']}));await p.waitForFunction(()=>!document.querySelector('#item').className.includes('blurred'));checks.push(`${platform}: exception overrides built-in and personal rules`);
 await p.evaluate(()=>chrome.storage.local.set({excludedKeywords:[],behavior:'remove'}));await p.waitForFunction(()=>document.querySelector('#item').className.includes('removed'));
 await p.evaluate(()=>chrome.storage.local.set({enabled:false}));await p.waitForFunction(()=>!document.querySelector('#item').className.includes('removed'));checks.push(`${platform}: hide then disable restores item`);
 await p.evaluate(()=>chrome.storage.local.set({enabled:true,detectKeywords:false,detectLabels:false,behavior:'blur'}));await p.waitForFunction(()=>document.querySelector('#item').className.includes('personal-blurred'));checks.push(`${platform}: personal rule works with AI detectors disabled`);
 await p.locator('button').first().click();await p.evaluate(()=>window.__rescan());await p.waitForFunction(()=>document.querySelector('#item').className.includes('personal-blurred'));checks.push(`${platform}: rescan reapplies personal rule`);
 await p.close();
 }
 assert.deepEqual(errors,[]);checks.push('no uncaught browser page errors');
 fs.writeFileSync(ROOT+'/store/browser-results.json',JSON.stringify({browser:browser.version(),mode:'Chromium DOM fixtures; Chrome APIs mocked, not a live-site or installed-extension test',checks,errors},null,2));
 console.log(JSON.stringify(checks,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
