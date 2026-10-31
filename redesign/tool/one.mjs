import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
await p.goto('file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/concepts/a/c1.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,2500));
await p.screenshot({path:'/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/concepts/a/thumbs/c1_m_0.jpg',type:'jpeg',quality:80});
await b.close();
