const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/background.js'),'utf8');
function worker(fetcher=async()=>{throw Error('network unexpected')}){
 let handler;let writes=0;
 const context=vm.createContext({URL,Uint8Array,DataView,ArrayBuffer,TextDecoder,AbortController,setTimeout,clearTimeout,fetch:fetcher,
 chrome:{runtime:{id:'test',onMessage:{addListener(fn){handler=fn}}},storage:{local:{set(){writes++}}}}});
 vm.runInContext(source,context);return {context,handler,writes:()=>writes};
}
test('worker restart does not seed or resurrect personal keywords',()=>{const w=worker();assert.equal(w.writes(),0)});
test('media URL boundary rejects deceptive hosts, credentials and insecure URLs',()=>{const {context}=worker();for(const url of ['http://a.fbcdn.net/x','https://fbcdn.net.evil.test/x','https://evil.test/?facebook.com','https://user:pass@a.fbcdn.net/x','file:///x'])assert.equal(vm.runInContext(`allowedMediaUrl(${JSON.stringify(url)})`,context),false);for(const url of ['https://scontent.a.fbcdn.net/image','https://www.facebook.com/media'])assert.equal(vm.runInContext(`allowedMediaUrl(${JSON.stringify(url)})`,context),true)});
test('metadata text respects sensitivity and does not label ordinary text',()=>{const {context}=worker();assert.equal(vm.runInContext("analyzeMetadataText('trainedAlgorithmicMedia', 1).match",context),true);assert.equal(vm.runInContext("analyzeMetadataText('generative-ai', 1).match",context),false);assert.equal(vm.runInContext("analyzeMetadataText('ordinary photo', 5).match",context),false)});
test('stream stops at cap even if Range is ignored',async()=>{let canceled=false,reads=0;const {context}=worker();context.response={body:{getReader(){return {async read(){reads++;return {done:false,value:new Uint8Array(1024*1024)}},async cancel(){canceled=true}}}}};const size=await vm.runInContext('readLimitedBody(response).then(b=>b.byteLength)',context);assert.equal(size,2*1024*1024);assert.equal(reads,2);assert.equal(canceled,true)});
test('background rejects non-Facebook senders and foreign extension IDs',()=>{const {handler}=worker();const msg={type:'NO_AI_FEED_SCAN_METADATA',urls:[]};assert.equal(handler(msg,{id:'other',url:'https://www.facebook.com/'},()=>assert.fail()),undefined);assert.equal(handler(msg,{id:'test',url:'https://www.youtube.com/'},()=>assert.fail()),undefined)});
test('metadata fetch omits credentials/referrer and refuses redirects',async()=>{let args;const {context}=worker(async(url,options)=>{args={url,options};return {ok:true,body:null,headers:{get:()=>''}}});await vm.runInContext("scanUrl('https://a.fbcdn.net/photo',3)",context);assert.equal(args.options.credentials,'omit');assert.equal(args.options.redirect,'error');assert.equal(args.options.referrerPolicy,'no-referrer')});
