import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '/Users/Gabi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out='/Users/Gabi/boostclub-audit-implementation-evidence-2026-09-26/final';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const results=[];
try {
 for(const lang of ['ro','en','ru']) {
  const context=await browser.newContext({viewport:{width:375,height:900},reducedMotion:'reduce'});const page=await context.newPage();
  await page.route('**/api/**',route=>route.fulfill({status:503,json:{ok:false,code:'TEST_UNAVAILABLE'}}));
  for(const item of JSON.parse(fs.readFileSync(`content/${lang}/pages.json`)).filter(p=>p.slug!=='multumim'&&(!process.env.BOOST_PAGE_FILTER||process.env.BOOST_PAGE_FILTER.split(',').includes(p.slug)))) {
   const path=`${lang==='ro'?'':`/${lang}`}/${item.slug==='index'?'':item.slug}`;
   await page.goto(`http://127.0.0.1:4173${path}`);
   await page.evaluate(async()=>{document.querySelectorAll('.rv,.reveal,[data-reveal]').forEach(e=>e.classList.add('in'));await document.fonts.ready;});
   await page.addScriptTag({path:'/Users/Gabi/.npm/_npx/8003d8991b0d346b/node_modules/axe-core/axe.min.js'});
   const report=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return {version:r.testEngine.version,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))};});
   results.push({path,...report});if(report.violations.length)console.log(path,JSON.stringify(report.violations));
  }
  await context.close();
 }
 fs.writeFileSync(out+'/axe-results.json',JSON.stringify(results,null,2));
 assert.ok(results.every(r=>!r.violations.length),'Review all axe violations in evidence/final/axe-results.json');
 console.log(`Axe 4.13: ${results.length} routes checked, no automatic A/AA violations. Manual and owner-dependent checks remain separately recorded.`);
} finally {await browser.close();}
