import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '/Users/Gabi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out='/Users/Gabi/boostclub-audit-implementation-evidence-2026-09-26/batch2';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const results=[];
function contrast(a,b) {
  const lum = value => value.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((s,n,i)=>s+n*[.2126,.7152,.0722][i],0);
  const x=lum(a),y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
try {
 for(const lang of ['ro','en','ru']) {
  const context=await browser.newContext({viewport:{width:375,height:900},reducedMotion:'reduce'});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/api/**',route=>route.fulfill({status:503,json:{ok:false,code:'TEST_UNAVAILABLE'}}));
  const pages=JSON.parse(fs.readFileSync(`content/${lang}/pages.json`)).filter(p=>p.slug!=='multumim');
  for(const item of pages) {
    const prefix=lang==='ro'?'':`/${lang}`;
    await page.goto(`http://127.0.0.1:4173${prefix}/${item.slug==='index'?'':item.slug}`,{waitUntil:'domcontentloaded'});
    await page.locator('h1').first().waitFor();
    for(const width of [375,430,768,1366,1440]) {
      await page.setViewportSize({width,height:900});
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      assert.ok(overflow<=1,`${lang}/${item.slug}@${width}: overflow ${overflow}`);
      if(width===375 && await page.locator('.menu-toggle').isVisible()) {
        await page.locator('.menu-toggle').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
        assert.equal(await page.locator('.mobile-menu a[href="rezultate"]').count(),1);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
        assert.equal(await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement),true);
      }
      if(['index','contact','consultatie-gratuita','rezultate','recenzii','business','cookies'].includes(item.slug)) {
        await page.evaluate(()=>document.querySelectorAll('.rv,[data-reveal]').forEach(e=>e.classList.add('in')));
        await page.screenshot({path:`${out}/${lang}-${item.slug}-${width}.png`,fullPage:true});
      }
      results.push({lang,slug:item.slug,width,overflow});
    }
    const buttons=page.locator('.section-dark a.btn-primary');
    for(let n=0;n<await buttons.count();n++) {
      const button=buttons.nth(n);
      for(const state of ['normal','hover','focus']) {
        if(state==='hover')await button.hover(); if(state==='focus')await button.focus();
        const colors=await button.evaluate(e=>({fg:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor,image:getComputedStyle(e).backgroundImage}));
        const backgrounds=colors.image.match(/rgb\([^)]+\)/g) || [colors.bg];
        const ratio=Math.min(...backgrounds.map(bg=>contrast(colors.fg,bg)));
        assert.ok(ratio>=4.5,`${lang}/${item.slug} ${state}: ${ratio} ${JSON.stringify(colors)} ${await button.getAttribute("class")}`);
        results.push({lang,slug:item.slug,state,contrast:ratio});
      }
    }
  }
  assert.deepEqual(errors,[],lang);await context.close();
 }
 fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2));
 console.log('All public page families passed overflow, navigation and CTA contrast checks across 3 locales × 5 widths.');
} finally {await browser.close();}
