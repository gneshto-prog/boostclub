import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '/Users/Gabi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out='/Users/Gabi/boostclub-audit-implementation-evidence-2026-09-26/batch3';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const results=[];
try {
 for(const lang of ['ro','en','ru']) {
  const context=await browser.newContext({viewport:{width:375,height:812},reducedMotion:'reduce'});
  const page=await context.newPage(); const prefix=lang==='ro'?'':`/${lang}`;
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const confirmation={ok:true,calendarEventId:'test',calendarStartAt:'2030-01-07T08:00:00Z',calendarEndAt:'2030-01-07T08:40:00Z'};
  let mode='fail',calls=0;
  await page.route('**/api/lead',async route=>{calls++;await route.fulfill({status:mode==='fail'?503:200,json:mode==='fail'?{ok:false,code:'LEAD_PIPELINE_FAILED',requestId:'test-only'}:confirmation});});
  await page.route('**/api/availability?*',async route=>{
    const date=new URL(route.request().url()).searchParams.get('date');
    await route.fulfill({json:{ok:true,date,hours:{open:'07:00',close:'20:00'},slots:[{start:'10:00',end:'10:40',startAt:date+'T07:00:00Z'}]}});
  });
  await page.route('http://127.0.0.1:4173/',route=>route.request().method()==='POST'?route.fulfill({status:200,body:'test archive'}):route.continue());
  await page.goto(`http://127.0.0.1:4173${prefix}/multumim`);
  assert.equal(await page.locator('#confirmation-unavailable').isVisible(),true);
  assert.equal(await page.locator('#confirmation-content').isVisible(),false);
  assert.ok(page.url().endsWith('/multumim'));
  await page.goto(`http://127.0.0.1:4173${prefix}/business`);
  await page.evaluate(()=>{window.testEvents=[];window.BoostAnalytics.setSink((event,payload)=>testEvents.push({event,payload}));window.BoostConsent.update({analytics:true});});
  const form=page.locator('#leadForm');
  assert.equal(await form.locator('label.lf-field').count(),3);
  assert.equal(await form.locator('a[href="confidentialitate"]').count(),1);
  await form.locator('[name="name"]').fill('Internal Test');
  await form.locator('[name="contact"]').fill('test@example.invalid');
  await form.locator('[name="country"]').fill('Romania');
  await form.locator('[type="submit"]').click();await form.locator('.lf-error:not([hidden])').waitFor();
  assert.equal(await form.locator('.lf-error').evaluate(e=>e===document.activeElement),true);
  assert.equal(await form.locator('[name="name"]').inputValue(),'Internal Test');
  mode='ok';
  await page.evaluate(async()=>{const f=document.getElementById('leadForm');const a=BoostLeadPipeline.submit(f),b=BoostLeadPipeline.submit(f);window.sameRequest=a===b;await Promise.all([a,b]);});
  assert.equal(await page.evaluate(()=>window.sameRequest),true);assert.equal(calls,2);
  await form.locator('[type="submit"]').click();await page.locator('#leadThanks:not([hidden])').waitFor();
  const events=await page.evaluate(()=>window.testEvents);
  assert.equal(events.filter(e=>e.event==='partner_lead_completed').length,1);
  assert.equal(events.filter(e=>e.event==='partner_lead_started').length,1);
  assert.doesNotMatch(JSON.stringify(events),/Internal Test|example.invalid|Romania/);
  for(const width of [375,430,768,1366,1440]) {
    await page.setViewportSize({width,height:900});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:`${out}/${lang}-partner-success-${width}.png`});
  }
  // Browser storage can be denied without invalidating a server-confirmed booking.
  await page.goto(`http://127.0.0.1:4173${prefix}/consultatie-gratuita`);
  await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked','SecurityError');};});
  await page.locator('#booking-date').fill('2030-01-07');await page.locator('#booking-date').dispatchEvent('change');
  await page.locator('label.booking-slot').first().click();
  await page.locator('input[autocomplete="given-name"]').fill('Internal Test');await page.locator('input[type="tel"]').fill('+40700000000');
  await page.locator('#booking-form [type="submit"]').click();await page.locator('#success-msg.visible').waitFor();
  assert.equal(await page.locator('#booking-form').isVisible(),false);
  assert.ok(page.url().endsWith('/consultatie-gratuita'));
  assert.deepEqual(errors,[]);results.push({lang,partnerRecovery:true,duplicateRequestDeduplicated:true,completionDeduplicated:true,storageBlockedBookingConfirmed:true});
  await context.close();
  const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();await staticPage.goto(`http://127.0.0.1:4173${prefix}/consultatie-gratuita`);
  assert.equal(await staticPage.locator('#booking-form [type="submit"]').isDisabled(),true);
  assert.equal(await staticPage.locator('noscript a[href^="tel:"]').count(),1);await nojs.close();
 }
 fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2));console.log('Partner, confirmation, duplicate/consent and blocked-storage/no-JavaScript browser checks passed in all locales.');
} finally {await browser.close();}
