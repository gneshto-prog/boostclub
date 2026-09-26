import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import availability from '../netlify/functions/availability.mts';
import lead from '../netlify/functions/lead.mts';
import { bookingSlotsForDate, bookingHoursForDate, validateRequestedBooking } from '../netlify/functions/_shared/booking.mts';
import { upstreamJson } from '../netlify/functions/_shared/upstream.mts';
import { checkBookingConfig } from '../scripts/check-booking-config.mjs';

const privateKey = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({type:'pkcs8',format:'pem'});
const env = { SUPABASE_URL:'https://test.supabase.co', SUPABASE_SECRET_KEY:'sb_secret_test', GOOGLE_CALENDAR_ID:'test-calendar', GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({client_email:'test@example.invalid', private_key:privateKey}) };
globalThis.Netlify = { env:{get:name=>env[name]} };
const future = '2030-01-07'; // Monday, independent of current working week.
const start = bookingSlotsForDate(future)[0].startAt;
const end = bookingSlotsForDate(future)[0].endAt;
let calls, busy, occupancy, mode, replay, ingested, marked;
const response = (body,status=200)=>new Response(JSON.stringify(body),{status});
function reset() {
  calls=[]; busy=[]; occupancy=[]; mode='ok'; replay=null; ingested=0; marked=0;
  globalThis.fetch = async (url,init={}) => {
    calls.push(String(url));
    if (String(url).includes('oauth2')) return response({access_token:'test-token'});
    if (String(url).endsWith('/freeBusy')) {
      if(mode==='calendar-error') return response({calendars:{'test-calendar':{errors:[{reason:'notFound'}]}}});
      return response({calendars:{'test-calendar':{busy}}});
    }
    if(String(url).includes('/rpc/')) {
      assert.equal(init.headers.apikey,'sb_secret_test');
      assert.equal(init.headers.Authorization,undefined,'Opaque secret keys must not be treated as JWTs');
      if(String(url).endsWith('get_website_booking_occupancy')) {
        if(mode==='db-error') return response({code:'XX000',message:'test outage'},503);
        return response(occupancy);
      }
      if(String(url).endsWith('get_website_booking_replay')) return response(replay);
      if(String(url).endsWith('ingest_website_lead')) {
        ingested++;
        if(mode==='conflict') return response({code:'P0001',message:'booking_slot_unavailable'},409);
        return response({person_id:'test-person',consultation_id:'test-consultation',calendar_start_at:start,calendar_end_at:end,...(mode==='replay'?{calendar_synced_at:'2030-01-01',calendar_event_id:'test-event',idempotent_replay:true}:{})});
      }
      if(String(url).endsWith('mark_website_lead_calendar')) { marked++; return response({}); }
    }
    if(String(url).includes('/events')) {
      if(mode==='write-error') return response({error:'test outage'},503);
      if(mode==='event-exists' && init.method==='POST') return response({error:'exists'},409);
      return response({id:'test-event',htmlLink:'https://example.invalid/test'});
    }
    throw new Error('Unexpected test request');
  };
}
const get = date => availability(new Request('https://boostclub.ro/api/availability?date='+date),{requestId:'test-request'});
test('availability filters calendar and CRM occupancy without fabricating slots',async()=>{
  reset(); busy=[{start,end}]; occupancy=[{scheduled_at:bookingSlotsForDate(future)[1].startAt}];
  const res=await get(future); const body=await res.json();
  assert.equal(res.status,200); assert.equal(body.slots.length,bookingSlotsForDate(future).length-2);
  assert.equal(body.slots[0].start,'08:20'); assert.equal(res.headers.get('cache-control'),'no-store');
});
test('Sunday hours, closed Saturday, past and fully booked dates are distinct from failure',async()=>{
  reset(); assert.equal(bookingHoursForDate('2030-01-06').open,'10:00');
  assert.equal((await (await get('2030-01-05')).json()).hours,null); assert.equal(calls.length,0);
  assert.equal((await (await get('2000-01-03')).json()).slots.length,0);
  busy=[{start:future+'T00:00:00Z',end:future+'T23:59:59Z'}];
  const full=await (await get(future)).json(); assert.deepEqual(full.slots,[]); assert.ok(full.hours);
});
test('invalid dates and methods cannot call providers',async()=>{
  reset(); for(const d of ['2030-02-30','bad',''])assert.equal((await get(d)).status,422);
  assert.equal((await availability(new Request('https://boostclub.ro/api/availability',{method:'POST'}),{})).status,405);
  assert.equal((await availability(new Request('https://boostclub.ro/api/availability?date='+future,{headers:{origin:'https://other.example'}}),{})).status,403);
  assert.equal(calls.length,0);
});
test('missing production config and malformed hours fail safely',async()=>{
  reset(); assert.throws(()=>checkBookingConfig({CONTEXT:'production'}),/SUPABASE_URL/);
  checkBookingConfig(env);
  const saved=env.SUPABASE_SECRET_KEY; delete env.SUPABASE_SECRET_KEY;
  assert.equal((await get(future)).status,503); env.SUPABASE_SECRET_KEY=saved;
  env.BOOST_BOOKING_HOURS_JSON='{'; assert.equal((await get(future)).status,503); delete env.BOOST_BOOKING_HOURS_JSON;
});
test('upstream errors and malformed occupancy fail closed',async()=>{
  for(const failure of ['db-error','calendar-error']) {reset();mode=failure;const res=await get(future);assert.equal(res.status,503);assert.equal((await res.json()).requestId,'test-request');}
  for(const invalid of [null,{},[{scheduled_at:'bad'}]]) {reset();occupancy=invalid;assert.equal((await get(future)).status,503);}
});
test('provider timeout is bounded and sanitized',async()=>{
  globalThis.fetch=(_url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('secret body','AbortError'))));
  await assert.rejects(upstreamJson('https://example.invalid',{},'TEST',10),/TEST_TIMEOUT/);
});
test('Bucharest daylight-saving boundaries preserve local labels',()=>{
  reset(); const now=new Date('2029-01-01');
  assert.equal(bookingSlotsForDate('2029-03-23',now)[0].startAt,'2029-03-23T05:00:00.000Z');
  assert.equal(bookingSlotsForDate('2029-03-26',now)[0].startAt,'2029-03-26T04:00:00.000Z');
  assert.equal(bookingSlotsForDate('2029-10-26',now)[0].startAt,'2029-10-26T04:00:00.000Z');
  assert.equal(bookingSlotsForDate('2029-10-29',now)[0].startAt,'2029-10-29T05:00:00.000Z');
  assert.throws(()=>validateRequestedBooking('2000-01-03T05:00:00Z'),/INVALID_BOOKING_SLOT/);
});
function submission(lang='ro') {
  return new Request('https://boostclub.ro/api/lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({idempotencyKey:'11111111-1111-4111-8111-111111111111',formName:lang==='ro'?'consultatie':'consultatie-'+lang,language:lang,leadType:'client',fullName:'Internal Test',phone:'+40700000000',requestedStart:start})});
}
test('all locales confirm only after CRM and calendar succeed; no real booking is made',async()=>{
  for(const lang of ['ro','en','ru']) {reset();const res=await lead(submission(lang),{requestId:'test'});const body=await res.json();assert.equal(res.status,200);assert.equal(body.calendarEventId,'test-event');assert.equal(ingested,1);assert.equal(marked,1);}
});
test('conflicts, replay and partial calendar failures remain truthful',async()=>{
  reset();mode='conflict';assert.equal((await lead(submission(),{})).status,409);
  reset();mode='replay';replay={booking_slot:start};const saved=await (await lead(submission(),{})).json();assert.equal(saved.idempotentReplay,true);assert.equal(calls.some(x=>x.includes('googleapis')),false);
  reset();mode='write-error';const partial=await lead(submission(),{});assert.equal(partial.status,503);const body=await partial.json();assert.equal(body.ok,false);assert.equal(body.savedToCrm,true);
  reset();mode='event-exists';assert.equal((await lead(submission(),{})).status,200);assert.equal(calls.filter(x=>x.includes('/events')).length,2);
});
