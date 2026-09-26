import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '/Users/Gabi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const results=[];
try {
 for(const lang of ['ro','en','ru']) {
  const context=await browser.newContext({viewport:{width:375,height:812},reducedMotion:'reduce'});const page=await context.newPage();
  const prefix=lang==='ro'?'':`/${lang}`;const held=[];
  await page.route('**/api/availability?*',async route=>{
    const date=new URL(route.request().url()).searchParams.get('date');
    if(date==='2030-01-07'){held.push(route);return;}
    await route.fulfill({json:{ok:true,date,hours:{open:'07:00',close:'20:00'},slots:[{start:'11:00',end:'11:40',startAt:date+'T08:00:00Z'}]}});
  });
  await page.goto(`http://127.0.0.1:4173${prefix}/consultatie-gratuita`);
  await Promise.all([page.waitForRequest('**date=2030-01-07'),page.evaluate(()=>{const d=document.querySelector('#booking-date');d.value='2030-01-07';d.dispatchEvent(new Event('change'));})]);
  await page.evaluate(()=>{const d=document.querySelector('#booking-date');d.value='2030-01-08';d.dispatchEvent(new Event('change'));});
  await page.locator('input[name="booking_slot"][value="2030-01-08T08:00:00Z"]').waitFor({state:'attached'});
  for(const route of held)try{await route.fulfill({json:{ok:true,date:'2030-01-07',hours:{open:'07:00',close:'20:00'},slots:[]}});}catch{/* aborted old request */}
  assert.equal(await page.locator('input[name="booking_slot"]').count(),1);
  assert.ok((await page.locator('input[name="booking_slot"]').inputValue()).startsWith('2030-01-08'));
  // Exercise the same deadline path with an accelerated test clock.
  await context.addInitScript(()=>{const timeout=window.setTimeout;window.setTimeout=function(fn,ms,...args){return timeout(fn,ms===12000?50:ms,...args);};});
  await page.reload();await page.evaluate(()=>{const d=document.querySelector('#booking-date');d.value='2030-01-07';d.dispatchEvent(new Event('change'));});
  await page.locator('.booking-recovery').waitFor();assert.equal(await page.locator('input[name="booking_slot"]').count(),0);
  await page.route('**/vendor/d3.min.js',route=>route.abort('failed'));
  await page.goto(`http://127.0.0.1:4173${prefix}/business`);await page.locator('#load-world-map').click();
  await page.locator('#map-fallback').waitFor({state:'visible'});
  assert.ok(await page.locator('a[href^="https://wa.me/"]').count());
  results.push({lang,staleResponseIgnored:true,frontendTimeoutRecovery:true,mapFailureFallback:true});await context.close();
 }
 const out='/Users/Gabi/boostclub-audit-implementation-evidence-2026-09-26/batch5/reliability-results.json';fs.writeFileSync(out,JSON.stringify(results,null,2));console.log('Stale dates, availability timeout and optional map failure recover in all locales.');
} finally {await browser.close();}
