import puppeteer from 'puppeteer-core';
const base='http://localhost:8765/', out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/sshots/b_';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const [pg,w,h,tag] of [['menu.html',1440,900,'md'],['menu.html',390,844,'mm'],['_home_local.html',1440,900,'hd'],['ro/menu.html',390,844,'rm']]){
 const p=await b.newPage(); await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800});
 await p.goto(base+pg,{waitUntil:'networkidle0'});
 if(tag==='md'||tag==='mm'){ await new Promise(r=>setTimeout(r,3500)); await p.screenshot({path:out+tag+'_hero.jpg',type:'jpeg',quality:65}); }
 const [top,hgt]=await p.evaluate(()=>{const e=document.getElementById('build');const r=e.getBoundingClientRect();return [r.top+scrollY,e.offsetHeight]});
 for(let i=0;i<6;i++){ const y=Math.round(top-h*0.6+ (hgt+h*0.2)*i/5);
   await p.evaluate(async y=>{const s=scrollY;for(let k=1;k<=12;k++){scrollTo(0,s+(y-s)*k/12);await new Promise(r=>setTimeout(r,50));}},y);
   await new Promise(r=>setTimeout(r,1300)); await p.screenshot({path:`${out}${tag}_${i}.jpg`,type:'jpeg',quality:60}); }
 await p.close(); }
await b.close();
