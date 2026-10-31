import puppeteer from 'puppeteer-core';
const [pg,vw,sels]=[process.argv[2],process.argv[3],process.argv[4].split('|')];
const [w,h]=vw.split('x').map(Number); const tag=process.argv[5]||'';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/tmpc/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('console '+m.text())});
await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800});
await p.goto('http://localhost:8765/'+pg,{waitUntil:'networkidle0',timeout:60000}); await new Promise(r=>setTimeout(r,2500));
// scroll whole page slowly so every trigger fires
const H=await p.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<H;y+=300){ await p.evaluate(y=>scrollTo(0,y),y); await new Promise(r=>setTimeout(r,120)); }
await new Promise(r=>setTimeout(r,1500));
let i=0; for(const s of sels){ const el=await p.$(s); if(!el){console.log('missing',s);continue;}
  await p.evaluate(e=>{const r=e.getBoundingClientRect(); scrollTo(0,scrollY+r.top-70);},el); await new Promise(r=>setTimeout(r,1400));
  await p.screenshot({path:`${out}sec_${tag}${pg.replace(/[\/.]/g,'_')}_${w}_${i++}.jpg`,type:'jpeg',quality:72}); }
const info=await p.evaluate(()=>({h1:document.querySelectorAll('h1').length,ov:document.documentElement.scrollWidth-innerWidth,
 broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.split('/').pop()),
 vid:[...document.querySelectorAll('video')].map(v=>({rs:v.readyState,t:v.currentTime.toFixed(1),paused:v.paused})),
 wide:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('svg,.bf-mq,.k-marquee,.k-rail,.bf-poster,.bf-hero,.k-band,.k-curtain')}).slice(0,6).map(e=>e.className||e.tagName)}));
console.log(pg,vw,JSON.stringify(info),'errs',JSON.stringify(errs.slice(0,4)));
await b.close();
