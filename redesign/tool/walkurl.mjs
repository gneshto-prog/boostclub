import puppeteer from 'puppeteer-core'; import fs from 'fs';
// node walkurl.mjs <url> <width> <outdir> <prefix> : viewport-by-viewport screenshots after real scrolling
const [url,w,dir,pre]=[process.argv[2],+process.argv[3],process.argv[4],process.argv[5]];
fs.mkdirSync(dir,{recursive:true});
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const H=w<800?844:900; await p.setViewport({width:w,height:H,isMobile:w<800,hasTouch:w<800});
await p.goto(url,{waitUntil:'networkidle0',timeout:90000}); await new Promise(r=>setTimeout(r,2500));
const total=await p.evaluate(()=>document.documentElement.scrollHeight); let y=0,i=0;
while(y<total&&i<40){ await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y); await new Promise(r=>setTimeout(r,1300)); await p.screenshot({path:`${dir}/${pre}-${w}-${String(i).padStart(2,'0')}.jpg`,type:'jpeg',quality:62}); y+=Math.round(H*.9); i++; }
console.log(i,'shots'); await b.close();
