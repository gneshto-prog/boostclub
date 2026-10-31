import puppeteer from 'puppeteer-core';
const dir = process.argv[2]; const names = process.argv[3].split(',');
const b = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for (const n of names){ const p=await b.newPage(); const mob=n.endsWith('mob');
 await p.setViewport({width:mob?390:1440,height:mob?844:900,deviceScaleFactor:mob?2:1});
 await p.goto('file://'+dir+'/'+n+'.html',{waitUntil:'networkidle0'}); await p.evaluate(()=>document.fonts.ready); await new Promise(r=>setTimeout(r,400));
 await p.screenshot({path:dir+'/'+n+'.jpg',type:'jpeg',quality:85}); await p.close(); }
await b.close();
