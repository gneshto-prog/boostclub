import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('http://127.0.0.1:8931/anim/demo.html',{waitUntil:'networkidle0'});
const r=await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'; const t=document.querySelectorAll('.tile')[3]; scrollTo(0,t.getBoundingClientRect().top+scrollY-100);
  document.querySelectorAll('.tile .bca-sheen').forEach((s,i)=>s.style.setProperty('--sx',(i*25-60)+'%')); const q=t.getBoundingClientRect(); return [q.left,q.top+scrollY]});
await new Promise(r=>setTimeout(r,600));
await p.screenshot({path:'/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/ashots/sheen.jpg',type:'jpeg',quality:85,clip:{x:40,y:r[1]-20,width:1360,height:420}});
await b.close();
