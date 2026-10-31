import puppeteer from 'puppeteer-core';
const base='file:///private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/concepts/b/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for (const [pg,sel,extra,w,h,tag] of [['c4','#scene',0.05,1440,900,'a'],['c4','#scene',2.2,1440,900,'b'],['c4','#scene',3.6,390,844,'c'],['c6','#open',0,1440,900,'d']]){
 const p=await b.newPage(); await p.setViewport({width:w,height:h,isMobile:w<800}); await p.goto(base+pg+'.html',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1800));
 await p.evaluate(async (sel,extra)=>{const y=document.querySelector(sel).getBoundingClientRect().top+scrollY+extra*innerHeight; for(let k=0;k<=15;k++){scrollTo(0,y*k/15); await new Promise(r=>setTimeout(r,50));}},sel,extra);
 await new Promise(r=>setTimeout(r,1500)); await p.screenshot({path:`../cshots3/mid_${tag}.jpg`,type:'jpeg',quality:72}); await p.close(); }
await b.close();
