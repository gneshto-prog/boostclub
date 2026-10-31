import puppeteer from 'puppeteer-core';
const D=process.argv[2]; const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const [u,w,f] of [['/',1280,'d-home'],['/ro/boostfit/',390,'d-bf-ro'],['/shake-menu',1280,'d-menu'],['/ru/business',390,'d-bt-ru']]){
  const p=await b.newPage(); await p.setViewport({width:w,height:w<800?844:860,isMobile:w<800}); await p.goto(D+u,{waitUntil:'load'}); await new Promise(r=>setTimeout(r,2500));
  await p.screenshot({path:'qa/'+f+'.jpg',type:'jpeg',quality:70}); await p.close(); }
await b.close();
