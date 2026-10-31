import puppeteer from 'puppeteer-core';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/ashots/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('http://127.0.0.1:8931/anim/demo.html',{waitUntil:'networkidle0'});
await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'; scrollTo(0,document.querySelector('#tiles').getBoundingClientRect().top+scrollY-120)}); await new Promise(r=>setTimeout(r,900));
const r=await p.evaluate(()=>{const t=document.querySelectorAll('.tile')[1].getBoundingClientRect(); return [t.left,t.top,t.width,t.height,scrollY]});
const clip={x:r[0]-r[2]-30,y:r[1]+r[4]-10,width:r[2]*3+60,height:r[3]+20};
await p.mouse.move(r[0]+r[2]*0.5,r[1]+r[3]*0.5); await p.mouse.move(r[0]+r[2]*0.95,r[1]+r[3]*0.1,{steps:8});
for(const [i,t] of [[0,120],[1,200],[2,250]]){ await new Promise(x=>setTimeout(x,t)); await p.screenshot({path:out+`tile_${i}.jpg`,type:'jpeg',quality:80,clip}); }
await b.close();
