import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '/Users/Gabi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out='/Users/Gabi/boostclub-audit-implementation-evidence-2026-09-26/batch5';fs.mkdirSync(out,{recursive:true});
const manifest=JSON.parse(fs.readFileSync('content/responsive-images.json'));
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const results=[];
function contrast(a,b) {const lum=v=>v.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((s,n,i)=>s+n*[.2126,.7152,.0722][i],0);const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
try {
 for(const lang of ['ro','en','ru']) {
  const prefix=lang==='ro'?'':`/${lang}`;
  for(const width of [375,1440]) for(const dpr of [1,2]) {
    const context=await browser.newContext({viewport:{width,height:812},deviceScaleFactor:dpr,reducedMotion:'reduce'});
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`http://127.0.0.1:4173${prefix}/rezultate`);
    await page.locator('.results-grid').scrollIntoViewIfNeeded();
    await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.results-grid img')].map(async img=>{img.loading='eager';await img.decode();}));});
    const selected=await page.locator('.results-grid img').evaluateAll(imgs=>imgs.map(img=>({src:img.getAttribute('src').replace('../',''),selected:new URL(img.currentSrc).pathname.slice(1),width:img.getBoundingClientRect().width,linked:img.closest('a')?.getAttribute('href')})));
    let before=0,after=0;
    for(const item of selected) {before+=manifest[item.src].bytes;after+=fs.statSync(item.selected).size;assert.ok(item.linked);assert.ok(item.selected===item.src||manifest[item.src].variants.some(v=>v.src===item.selected));}
    // At high desktop DPR, an original smaller than 640px is already the best
    // available source. Never upscale it merely to manufacture a derivative.
    assert.ok(after<before*(width===375?.6:1),`${lang}@${width}/${dpr}: ${after}/${before}`);
    results.push({lang,width,dpr,beforeImageBytes:before,selectedImageBytes:after,selected});
    const heroRequests=[];page.on('request',request=>{if(request.url().includes('gabriel-neshto-boost-club-bucuresti'))heroRequests.push(request.url());});
    await page.goto(`http://127.0.0.1:4173${prefix}/`);
    await page.locator('.hero img').evaluate(img=>img.decode());
    assert.equal(new Set(heroRequests).size,1,'Responsive hero preload must not download a duplicate original.');
    assert.equal(await page.locator('.hero img').getAttribute('fetchpriority'),'high');
    assert.deepEqual(errors,[]);await context.close();
  }
  const context=await browser.newContext({viewport:{width:375,height:812},reducedMotion:'reduce'});const page=await context.newPage();const requests=[];
  page.on('request',r=>requests.push(r.url()));
  await page.route('https://www.google.com/maps/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<html><title>Test map</title><body>Mock map</body></html>'}));
  await page.goto(`http://127.0.0.1:4173${prefix}/contact`);await page.locator('[data-map-src]').scrollIntoViewIfNeeded();
  assert.equal(requests.filter(u=>u.includes('google.com/maps')).length,0);
  await page.locator('[data-map-src]').click();await page.locator('iframe[src*="google.com/maps"]').waitFor();
  assert.equal(requests.filter(u=>u.includes('google.com/maps')).length,1);
  assert.ok(await page.locator('a[href*="maps/dir/"]').count());
  if(await page.locator('.closed-tag').count()) {
    const c=await page.locator('.closed-tag').evaluate(e=>({fg:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor}));
    const ratio=contrast(c.fg,c.bg);assert.ok(ratio>=4.5);results.push({lang,closedLabelContrast:ratio});
  }
  requests.length=0;await page.goto(`http://127.0.0.1:4173${prefix}/business`);await page.locator('#load-world-map').scrollIntoViewIfNeeded();
  assert.equal(requests.filter(u=>/d3\.min|topojson-client|countries-110m/.test(u)).length,0);
  await page.locator('#load-world-map').click();await page.waitForFunction(()=>document.querySelectorAll('#worldmap path').length>50);
  assert.ok(requests.some(u=>u.includes('d3.min')));assert.ok(requests.some(u=>u.includes('countries-110m')));
  const fine=await page.locator('.perk-fine').evaluate(e=>{let p=e;while(p){const s=getComputedStyle(p);if(s.backgroundColor!=='rgba(0, 0, 0, 0)')return{fg:getComputedStyle(e).color,bg:s.backgroundColor,size:parseFloat(getComputedStyle(e).fontSize)};p=p.parentElement;}return null;});
  assert.ok(fine);assert.ok(fine.size>=14);assert.ok(contrast(fine.fg,fine.bg)>=4.5,JSON.stringify(fine));
  results.push({lang,mapsRequireClick:true,countryMapWorking:true,disclaimerContrast:contrast(fine.fg,fine.bg),disclaimerSize:fine.size});
  await page.goto(`http://127.0.0.1:4173${prefix}/cookies`);const table=page.locator('.table-scroll');await table.focus();
  assert.equal(await table.evaluate(e=>e===document.activeElement),true);
  const overflow=await table.evaluate(e=>e.scrollWidth>e.clientWidth);
  if(overflow){await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('.table-scroll').scrollLeft>0);}
  results.push({lang,tableKeyboardFocus:true,horizontalScrollRequired:overflow});await context.close();
 }
 fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2));console.log('Responsive resource selection, preload deduplication, click-only maps, disclaimer contrast and table keyboard checks passed.');
} finally {await browser.close();}
