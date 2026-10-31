import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/_home_local.html',{waitUntil:'networkidle0'});
const f=await p.$('img.soft'); await f.evaluate(e=>e.closest('figure').scrollIntoView({block:'center'})); await new Promise(r=>setTimeout(r,1200));
await (await f.evaluateHandle(e=>e.closest('figure'))).screenshot({path:'/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/sshots/soft.jpg',type:'jpeg',quality:75});
await b.close();
