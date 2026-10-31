import puppeteer from 'puppeteer-core';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/audit/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:8765/_home_local.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1800));
const st=await p.evaluate(()=>{ const t=ScrollTrigger.getAll().find(t=>t.pin&&t.pin.classList.contains('sx-pin')); return [t.start,t.end]; });
console.log('scan pin',st);
async function go(y){ await p.evaluate(async y=>{ const s=scrollY; for(let k=1;k<=20;k++){ window.scrollTo({top:s+(y-s)*k/20,behavior:'instant'}); await new Promise(r=>setTimeout(r,40)); } },y); await new Promise(r=>setTimeout(r,900)); }
const shots=[st[0]-450, st[0]+60, st[0]+(st[1]-st[0])*.55, st[1]-10];
for(const [i,y] of shots.entries()){ await go(y); await p.screenshot({path:`${out}scanB_${i}.jpg`,type:'jpeg',quality:72}); }
console.log(errs); await b.close();
