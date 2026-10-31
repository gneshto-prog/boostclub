import puppeteer from 'puppeteer-core'; import fs from 'fs';
const SITE='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/';
const [pg,w,h,js]=[process.argv[2],+process.argv[3],+process.argv[4],process.argv[5]];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setRequestInterception(true);
p.on('request',r=>{ const u=r.url(); if(u.endsWith('/site.js')){ let s=fs.readFileSync(SITE+'site.js','utf8'); s=s.replace("+'</a>'</p></div>'","+'</a></p></div>'"); r.respond({status:200,contentType:'application/javascript',body:s}); } else r.continue(); });
await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800});
await p.goto('file://'+SITE+pg,{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1000));
console.log(JSON.stringify(await p.evaluate(js),null,1));
if(process.argv[6]) { await p.screenshot({path:process.argv[6],type:'jpeg',quality:70}); }
await b.close();
