import puppeteer from 'puppeteer-core';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/sshots/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
for(const [w,h,t] of [[1440,900,'d'],[390,844,'m']]){
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.setViewport({width:w,height:h,isMobile:w<800});
await p.goto('http://localhost:8765/boost-fit.html',{waitUntil:'networkidle0'});
await p.evaluate(()=>document.querySelector('.vcard').scrollIntoView({block:'center'})); await new Promise(r=>setTimeout(r,4500));
console.log(t, await p.evaluate(()=>{const v=document.querySelector('.vcv');return {paused:v.paused,t:v.currentTime.toFixed(1),rs:v.readyState,w:v.videoWidth}}), errs);
const g=await p.$('.fgrid'); await g.screenshot({path:out+'vid_'+t+'.jpg',type:'jpeg',quality:70}); await p.close();}
await b.close();
