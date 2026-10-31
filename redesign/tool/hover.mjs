import puppeteer from 'puppeteer-core';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/ashots/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); await p.setViewport({width:1440,height:900});
await p.goto('http://127.0.0.1:8931/anim/demo.html',{waitUntil:'networkidle0'});
// hero transition frames
const t0=Date.now(); await p.evaluate(()=>window.__t=performance.now());
for(let i=0;i<8;i++){ await new Promise(r=>setTimeout(r,i?170:2500)); await p.screenshot({path:out+`hero_${i}.jpg`,type:'jpeg',quality:70}); }
// tiles hover
await p.evaluate(()=>document.querySelector('#tiles').scrollIntoView()); await new Promise(r=>setTimeout(r,800));
const r=await p.evaluate(()=>{const t=document.querySelectorAll('.tile')[1].getBoundingClientRect(); return [t.left,t.top,t.width,t.height]});
await p.mouse.move(r[0]+r[2]*0.5,r[1]+r[3]*0.5); await p.mouse.move(r[0]+r[2]*0.9,r[1]+r[3]*0.2,{steps:8}); await new Promise(r=>setTimeout(r,450));
await p.screenshot({path:out+'tile_a.jpg',type:'jpeg',quality:75,clip:{x:r[0]-20,y:r[1]-20,width:r[2]*2+40,height:r[3]+40}});
await new Promise(r=>setTimeout(r,900)); await p.screenshot({path:out+'tile_b.jpg',type:'jpeg',quality:75,clip:{x:r[0]-20,y:r[1]-20,width:r[2]*2+40,height:r[3]+40}});
// magnetic button
const bb=await p.evaluate(()=>{const e=document.querySelector('.sec .btn-brass').getBoundingClientRect(); return [e.left,e.top,e.width,e.height]});
await p.mouse.move(bb[0]+bb[2]+30,bb[1]+bb[3]+20,{steps:10}); await new Promise(r=>setTimeout(r,700));
const tr=await p.evaluate(()=>getComputedStyle(document.querySelector('.sec .btn-brass')).transform);
await p.screenshot({path:out+'mag.jpg',type:'jpeg',quality:75,clip:{x:bb[0]-80,y:bb[1]-60,width:bb[2]+160,height:bb[3]+120}});
console.log('magnet transform',tr);
// perf: run a scrub through build and record long frames
await p.evaluate(()=>document.querySelector('#build').scrollIntoView()); await new Promise(r=>setTimeout(r,800));
const perf=await p.evaluate(async()=>{ const el=document.querySelector('#build'), y0=scrollY, H=el.offsetHeight-innerHeight; let frames=[],last=performance.now(); let run=true;
  (function f(t){ frames.push(t-last); last=t; if(run) requestAnimationFrame(f); })(last);
  for(let k=0;k<=120;k++){ scrollTo(0,y0+H*k/120); await new Promise(r=>requestAnimationFrame(r)); }
  await new Promise(r=>setTimeout(r,1200)); run=false; frames.shift(); frames.sort((a,b)=>a-b);
  return {n:frames.length,median:frames[frames.length>>1].toFixed(1),p95:frames[Math.floor(frames.length*.95)].toFixed(1),max:frames[frames.length-1].toFixed(1)}; });
console.log('frames',JSON.stringify(perf));
await b.close();
