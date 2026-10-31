import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.setViewport({width:390,height:844,isMobile:true});
await p.goto('http://localhost:8765/menu.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1500));
for(let i=0;i<4;i++){ await p.screenshot({path:'/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/audit/cyc_'+i+'.jpg',type:'jpeg',quality:70}); await new Promise(r=>setTimeout(r,500)); }
console.log(errs); await b.close();
