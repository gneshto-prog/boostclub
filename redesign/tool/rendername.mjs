import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1400,height:400});
await p.goto('file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/board/name.html',{waitUntil:'networkidle0'}); await p.evaluate(()=>document.fonts.ready);
const el=await p.$('#t'); await el.screenshot({path:'/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/board/name.png',omitBackground:true});
console.log(await p.evaluate(()=>document.fonts.check('900 200px Poppins'))); await b.close();
