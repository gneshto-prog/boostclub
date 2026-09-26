import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '/Users/Gabi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out='/Users/Gabi/boostclub-audit-implementation-evidence-2026-09-26/final';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const results=[];
try {
 for(const lang of ['ro','en','ru']) {
  const context=await browser.newContext({viewport:{width:320,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();const prefix=lang==='ro'?'':`/${lang}`;const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/**',route=>route.fulfill({status:503,json:{ok:false,code:'TEST_UNAVAILABLE'}}));
  for(const item of JSON.parse(fs.readFileSync(`content/${lang}/pages.json`))) {
   await page.setViewportSize({width:320,height:900});
   await page.goto(`http://127.0.0.1:4173${prefix}/${item.slug==='index'?'':item.slug}`);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${lang}/${item.slug}: 320px reflow`);
   await page.setViewportSize({width:768,height:900});
   await page.evaluate(()=>document.documentElement.style.fontSize='200%');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${lang}/${item.slug}: 200% root font size`);
   results.push({lang,slug:item.slug,reflow320:true,rootFont200:true});
  }
  await page.setViewportSize({width:375,height:900});
  await page.goto(`http://127.0.0.1:4173${prefix}/`);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-nav').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Enter');
  const toggle=page.locator('.menu-toggle');await toggle.focus();await page.keyboard.press('Enter');
  assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>!!document.activeElement.closest('.mobile-menu')),true);
  await page.keyboard.press('Escape');assert.equal(await toggle.evaluate(e=>e===document.activeElement),true);
  const faq=page.locator('.faq-q').last();await faq.focus();await page.keyboard.press('Enter');
  assert.equal(await faq.getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Space');assert.equal(await faq.getAttribute('aria-expanded'),'false');
  assert.equal(await faq.evaluate(e=>e.closest('.faq-item').querySelector('.faq-a').hidden),true);
  await page.goto(`http://127.0.0.1:4173${prefix}/cookies`);
  const table=page.locator('.table-scroll').first();await table.focus();
  assert.equal(await table.evaluate(e=>e===document.activeElement),true);await page.keyboard.press('ArrowRight');
  await page.goto(`http://127.0.0.1:4173${prefix}/multumim`);
  await page.evaluate(()=>sessionStorage.setItem('boost_booking_confirmation',JSON.stringify({startAt:'2030-01-07T08:00:00Z',endAt:'2030-01-07T08:40:00Z',savedAt:new Date().toISOString()})));
  await page.reload();assert.equal(await page.locator('#booking-time-confirmed').innerText(),'10:00–10:40');
  for(const width of [375,430,768,1366,1440]) {
   await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:`${out}/${lang}-confirmation-${width}.png`,fullPage:true});
  }
  await page.locator('#download-calendar').focus();
  const [download]=await Promise.all([page.waitForEvent('download'),page.keyboard.press('Enter')]);
  const file=`${out}/${lang}-internal-test.ics`;await download.saveAs(file);const ics=fs.readFileSync(file,'utf8');
  assert.match(ics,/BEGIN:VCALENDAR\r\n/);assert.match(ics,/DTSTART:20300107T080000Z/);assert.match(ics,/DTEND:20300107T084000Z/);
  assert.match(ics,/LOCATION:Strada Sevastopol 24/);assert.match(ics,/END:VCALENDAR$/);
  const missing=await page.goto(`http://127.0.0.1:4173${prefix}/not-a-real-route`);assert.equal(missing.status(),404);
  assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/noindex/);
  assert.deepEqual(errors,[]);results.push({lang,keyboard:true,confirmationFiveWidths:true,icsUTC:true,unknownRoute404:true});await context.close();
  const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();await staticPage.goto(`http://127.0.0.1:4173${prefix}/`);
  assert.ok(await staticPage.locator('.faq-a').last().evaluate(e=>e.getBoundingClientRect().height>20),'FAQ answer available without JavaScript');await nojs.close();
 }
 fs.writeFileSync(out+'/accessibility-results.json',JSON.stringify(results,null,2));
 console.log('All 42 localized routes reflow at 320px and 200% root text; keyboard, confirmation, calendar and no-JS FAQ checks passed.');
} finally {await browser.close();}
