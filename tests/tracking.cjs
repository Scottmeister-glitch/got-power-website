const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = readFileSync('script.js','utf8');
function run({thanks=false, pending=null, hash='', blocked=false, storageBlocked=false}={}) {
  const events=[], handlers={}, timers=[];
  const storage = new Map(pending ? [['got-power-pending-submission',JSON.stringify(pending)]] : []);
  const next={value:''}, honey={value:''};
  const form={querySelector:s=>s.includes('_next')?next:honey, addEventListener:(n,f)=>handlers[n]=f};
  const location={href:'https://gotpowerelectrical.com/?ga_debug=1',search:'?ga_debug=1',pathname:'/thanks.html',hash};
  const context={URL,URLSearchParams,Date,crypto:{randomUUID:()=> 'test-token'},location,
    history:{replaceState(){}}, sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>{if(storageBlocked)throw Error();storage.set(k,v)},removeItem:k=>storage.delete(k)},
    document:{body:{dataset:{page:thanks?'contact-thanks':''}},querySelector:s=>s==='#form'&&!thanks?form:null,addEventListener:(n,f)=>handlers[n]=f},
    setTimeout:f=>{timers.push(f);return 1},clearTimeout(){}};
  context.window={location,...(blocked?{}:{gtag:(...args)=>events.push(args)})};
  vm.runInNewContext(code,context);
  return {events,handlers,timers,location,next,storage,honey};
}
let r=run();r.handlers.submit();assert.match(r.next.value,/thanks.html\?ga_debug=1#test-token$/);assert.equal(r.events.length,0);
let pending=JSON.parse(r.storage.get('got-power-pending-submission'));
r=run({thanks:true,pending,hash:'#test-token'});assert.equal(r.events[0][1],'generate_lead');assert.equal(r.storage.size,0);
for(const opts of [{},{pending,hash:'#wrong'},{pending:{token:'test-token',time:Date.now()-3600001},hash:'#test-token'}]) assert.equal(run({thanks:true,...opts}).events.length,0);
assert.equal(run({thanks:true,pending:null,hash:'#test-token'}).events.length,0);
r=run({storageBlocked:true});r.handlers.submit();assert.equal(r.next.value,'https://gotpowerelectrical.com/thanks.html');
r=run();r.honey.value='spam';r.handlers.submit();assert.equal(r.storage.size,0);
for(const blocked of [false,true]) {
 r=run({blocked});let prevented=false;
 const link={target:'',getAttribute:()=> 'tel:+17076555981',closest:s=>s==='.hero'?{}:null};
 r.handlers.click({target:{closest:()=>link},button:0,preventDefault:()=>prevented=true});
 assert.ok(prevented);
 if(!blocked) {assert.equal(r.events[0][1],'phone_click');assert.equal(r.events[0][2].link_location,'hero');r.events[0][2].event_callback();}
 r.timers[0]();assert.equal(r.location.href,'tel:+17076555981');
}
console.log('Tracking checks passed: normal POST preparation, valid/missing/expired return, deduplication, storage failure, honeypot, phone callback and blocked-tag fallback.');
