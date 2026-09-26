import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function page(path='/ru/recenzii') {
  const handlers={}; const calls=[]; const storage=new Map([['bc-attribution-v1','{"gclid":"old-id"}']]);
  const document={documentElement:{lang:'ru'},referrer:'https://example.com/private?email=private@example.com',addEventListener:(name,fn)=>{handlers[name]=fn;}};
  const window={addEventListener:(name,fn)=>{handlers[name]=fn;},dispatchEvent:event=>handlers[event.type]?.(event),gtag:(...args)=>calls.push(args)};
  const context={window,document,location:new URL('https://boostclub.ro'+path+'?gclid=advertising-id&email=private@example.com'),URL,URLSearchParams,Set,WeakSet,CustomEvent:class {constructor(type,options){this.type=type;this.detail=options?.detail;}},sessionStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}};
  vm.runInNewContext(fs.readFileSync('js/analytics.js','utf8'),context);
  vm.runInNewContext(fs.readFileSync('js/attribution.js','utf8'),context);
  return {window,context,calls,storage,handlers};
}
test('optional measurement is disabled by default, even with a legacy gtag present',()=>{
  const p=page();p.window.bcTrack('phone_click');
  assert.deepEqual(p.calls,[]);assert.equal(p.storage.size,0);
  assert.equal(Object.keys(p.window.BoostAttribution.current()).length,0);
});
test('consented adapter emits only allowlisted events with no supplied personal data and deduplicates completion',()=>{
  const p=page();p.window.BoostAnalytics.setSink((name,params)=>p.calls.push({name,...params}));
  assert.equal(p.calls.length,0);
  p.window.BoostConsent.update({analytics:true});
  assert.equal(p.calls[0].name,'reviews_viewed');
  p.window.BoostConsent.update({analytics:true});assert.equal(p.calls.length,1);
  const options={onceKey:'internal-test-key',phone:'+40700000000',email:'private@example.com',goal:'sensitive',fullName:'Internal Test',event_label:'private'};
  p.window.BoostAnalytics.track('booking_completed',options);p.window.BoostAnalytics.track('booking_completed',options);
  p.window.BoostAnalytics.track('arbitrary_event',options);
  assert.equal(p.calls.length,2);
  assert.deepEqual(Object.keys(p.calls[1]).sort(),['language','name','page_path']);
  assert.equal(p.calls[1].page_path,'/ru/recenzii');
  assert.equal(p.storage.size,0);
  p.window.BoostConsent.update({analytics:false});p.window.bcTrack('phone_click');assert.equal(p.calls.length,2);
});
test('attribution needs both consents and is purged on revocation',()=>{
  const p=page();p.window.BoostConsent.update({analytics:true,marketing:true});
  const data=p.window.BoostAttribution.current();
  assert.equal(data.gclid,'advertising-id');assert.equal(data.email,undefined);
  assert.equal(data.referrer,'https://example.com');
  p.window.BoostConsent.update({analytics:true,marketing:false});assert.equal(p.storage.size,0);
});
test('analytics never changes WhatsApp text or includes its phone/message in payloads',()=>{
  const p=page();p.window.BoostAnalytics.setSink((name,params)=>p.calls.push({name,...params}));p.window.BoostConsent.update({analytics:true});
  const link={href:'https://wa.me/40726205752?text=Private%20question'};
  p.handlers.click({target:{closest:()=>link}});
  assert.equal(link.href,'https://wa.me/40726205752?text=Private%20question');
  assert.equal(p.calls.at(-1).name,'whatsapp_click');
  assert.doesNotMatch(JSON.stringify(p.calls),/Private|40726205752|gclid|email/);
});
