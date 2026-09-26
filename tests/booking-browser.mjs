import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '/Users/Gabi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out='/Users/Gabi/boostclub-audit-implementation-evidence-2026-09-26';
fs.mkdirSync(out+'/batch1',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const findings=[];
try {
for(const lang of ['ro','en','ru']) {
  const context=await browser.newContext({viewport:{width:375,height:812}});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  let mode='error', submissions=0, archive=0;
  await page.route('**/api/availability?*',async route=>{
    if(mode==='offline')return route.abort('internetdisconnected');
    if(mode==='error')return route.fulfill({status:503,json:{ok:false,code:'AVAILABILITY_UNAVAILABLE',requestId:'test-503'}});
    const date=new URL(route.request().url()).searchParams.get('date');
    if(mode==='closed')return route.fulfill({json:{ok:true,date,hours:null,slots:[]}});
    const slots=mode==='full'?[]:[{start:'10:00',end:'10:40',startAt:date+'T07:00:00.000Z'}];
    return route.fulfill({json:{ok:true,date,hours:{open:'07:00',close:'20:00'},slots}});
  });
  await page.route('**/api/lead',async route=>{
    submissions++;
    if(mode==='conflict')return route.fulfill({status:409,json:{ok:false,code:'BOOKING_SLOT_UNAVAILABLE',requestId:'test-conflict'}});
    return route.fulfill({json:{ok:true,calendarEventId:'test-event',calendarStartAt:'2030-01-07T08:00:00.000Z',calendarEndAt:'2030-01-07T08:40:00.000Z'}});
  });
  await page.route('http://127.0.0.1:4173/',route=>{
    if(route.request().method()==='POST'){archive++;return route.fulfill({status:503,body:'test archive failure'});}
    return route.continue();
  });
  const prefix=lang==='ro'?'':'/'+lang;
  await page.goto('http://127.0.0.1:4173'+prefix+'/consultatie-gratuita');
  const date=page.locator('#booking-date');
  await date.fill('2030-01-07');await date.dispatchEvent('change');
  await page.locator('.booking-recovery').waitFor();
  assert.equal(await page.locator('.booking-recovery a[href^="https://wa.me/"]').count(),1);
  assert.equal(await page.locator('.booking-recovery a[href^="tel:"]').count(),1);
  assert.equal(await page.locator('input[name="booking_slot"]').count(),0);
  const name=page.locator('input[autocomplete="given-name"]');await name.fill('Internal Test');
  const phone=page.locator('input[type="tel"]');await phone.fill('+40700000000');
  for(const width of [375,430,768,1366,1440]) {
    await page.setViewportSize({width,height:900});await page.locator('#booking-form').scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,lang+' overflow '+width);
    await page.screenshot({path:out+'/batch1/'+lang+'-booking-failure-'+width+'.png',fullPage:true});
  }
  for(const state of ['closed','full','offline','ok']) {
    mode=state; await date.fill(state==='ok'?'2030-01-08':'2030-01-07');await date.dispatchEvent('change');
    await page.waitForFunction(()=>!document.querySelector('[data-booking-slots]').hasAttribute('aria-busy'));
    assert.equal(await name.inputValue(),'Internal Test');assert.equal(await phone.inputValue(),'+40700000000');
    assert.equal(await page.locator('input[name="booking_slot"]').count(),state==='ok'?1:0);
    findings.push({lang,state,status:await page.locator('[data-booking-status]').innerText()});
  }
  await page.locator('label.booking-slot').click();mode='conflict';
  await page.locator('#booking-form button[type="submit"]').click();
  await page.locator('.booking-submit-error:not([hidden])').waitFor();
  assert.equal(await page.locator('.booking-submit-error').evaluate(e=>e===document.activeElement),true);
  mode='ok';await date.fill('2030-01-09');await date.dispatchEvent('change');await page.locator('label.booking-slot').waitFor();await page.locator('label.booking-slot').click();
  await page.locator('#booking-form button[type="submit"]').click();
  await page.waitForURL('**/multumim');
  assert.equal(await page.locator('#confirmation-content').isVisible(),true);
  assert.equal(archive,1);assert.equal(submissions,2);
  await page.reload();assert.equal(await page.locator('#confirmation-content').isVisible(),true);
  await page.goBack();assert.ok(page.url().endsWith('/consultatie-gratuita'));
  assert.equal(submissions,2,'Back navigation must not submit another booking');
  await page.goForward();assert.equal(await page.locator('#confirmation-content').isVisible(),true);
  assert.equal(submissions,2);
  assert.deepEqual(errors,[]);findings.push({lang,confirmation:true,archiveFailureDidNotCancel:true,errors});
  await context.close();
}
fs.writeFileSync(out+'/batch1/browser-results.json',JSON.stringify(findings,null,2));
console.log('Booking browser checks passed: 3 locales × 5 widths, failure/closed/full/offline, retained input, focused conflict, confirmed navigation and archive failure.');
} finally {await browser.close();}
