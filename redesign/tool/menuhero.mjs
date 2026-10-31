import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const [w,h] of [[1440,900],[390,844]]){ const p=await b.newPage(); await p.setViewport({width:w,height:h,isMobile:w<800});
 await p.goto('http://localhost:8765/menu.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1500));
 await p.screenshot({path:`/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/menuhero-${w}.png`}); await p.close(); }
await b.close();
