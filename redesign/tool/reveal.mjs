import puppeteer from 'puppeteer-core';
import fs from 'fs';
// Real-scroll check: scrolls each animated element ([data-k], .kw words, pinned sections) to the middle of the screen
// the way a visitor would, waits for the animation, then reports any text still clipped, hidden or overlapping.
// Optionally walks the page a viewport at a time and saves a tiled contact sheet (WALK=dir).
const base=process.env.BASE||'http://localhost:8765/';
const pages=(process.env.PAGES||'_home_local.html,menu.html,how-it-works.html,free-scan.html,results.html,reviews.html,gabriel.html,boost-fit.html,visit.html,bring-a-friend.html,business.html,404.html').split(',');
const widths=(process.env.WIDTHS||'390,1440').split(',').map(Number);
const langs=(process.env.LANGS||'en').split(',');
const WALK=process.env.WALK;
const LAUNCH=()=>puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'],protocolTimeout:300000});
const out=[];
const jobs=[]; for(const lang of langs) for(const pg0 of pages) for(const w of widths) jobs.push({lang,pg:lang==='en'?pg0:(pg0==='_home_local.html'?lang+'/index.html':lang+'/'+pg0),w});
async function run(j,b){
  const p=await b.newPage(); const mob=j.w<800; const H=mob?(j.w<400?740:844):(j.w<1100?768:900);
  await p.setViewport({width:j.w,height:H,isMobile:mob,hasTouch:mob});
  await p.goto(base+j.pg,{waitUntil:'networkidle0',timeout:90000});
  await new Promise(r=>setTimeout(r,900));
  const shots=[];
  if(WALK){ fs.mkdirSync(WALK,{recursive:true}); let y=0; const total=await p.evaluate(()=>document.documentElement.scrollHeight); let i=0;
    while(y<total && i<60){ await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y); await new Promise(r=>setTimeout(r,1100));
      const f=`${WALK}/${j.lang}-${j.pg.replace(/\//g,'_').replace('.html','')}-${j.w}-${String(i).padStart(2,'0')}.jpg`; await p.screenshot({path:f,type:'jpeg',quality:60}); shots.push(f);
      y+=Math.round(H*.85); i++; } }
  // each animated block: bring to centre, wait, test
  const n=await p.evaluate(()=>document.querySelectorAll('[data-k],.k-h,h1,h2,.loud').length);
  const bad=[];
  for(let k=0;k<n;k++){
    const r=await p.evaluate(async(k)=>{ const el=document.querySelectorAll('[data-k],.k-h,h1,h2,.loud')[k]; if(!el||!el.getClientRects().length) return null;
      const st=getComputedStyle(el); if(st.display==='none'||st.visibility==='hidden') return null;
      const rr=el.getBoundingClientRect(); scrollTo({top:scrollY+rr.top-innerHeight*.4,behavior:'instant'}); await new Promise(r=>setTimeout(r,1500));
      const probs=[]; const R=el.getBoundingClientRect();
      // words/lines still translated out of their mask, or invisible
      el.querySelectorAll('*').forEach(c=>{ if(!c.firstChild||c.children.length) return; const t=(c.textContent||'').trim(); if(!t) return; const s=getComputedStyle(c); if(+s.opacity<0.5) probs.push('faded "'+t.slice(0,24)+'" op='+s.opacity);
        let a=c.parentElement; while(a&&a!==document.body){ const sa=getComputedStyle(a); if(/(hidden|clip)/.test(sa.overflow+sa.overflowX+sa.overflowY)) break; a=a.parentElement; }
        if(a&&a!==document.body){ const ar=a.getBoundingClientRect(), cr=c.getBoundingClientRect(); const fs=parseFloat(s.fontSize)||16; const cut=Math.max(ar.top-cr.top,cr.bottom-ar.bottom,ar.left-cr.left,cr.right-ar.right);
          const sa=getComputedStyle(a); if(cut>Math.max(3,fs*.14)&&!/(auto|scroll)/.test(sa.overflowX+sa.overflowY)) probs.push('cut "'+t.slice(0,24)+'" '+Math.round(cut)+'px'); } });
      if(!el.children.length){ const s=getComputedStyle(el); if(+s.opacity<0.5) probs.push('faded block op='+s.opacity); }
      return probs.length?{el:(el.tagName+'.'+(el.className||'').toString().split(' ')[0]+' "'+el.textContent.trim().replace(/\s+/g,' ').slice(0,40)+'"'),probs:[...new Set(probs)].slice(0,4)}:null; },k).catch(e=>({el:'ERR',probs:[String(e).slice(0,80)]}));
    if(r) bad.push(r);
  }
  out.push({...j,bad,shots}); console.log((bad.length?'✗ ':'✓ ')+j.lang+' '+j.pg+' '+j.w+(bad.length?'\n   '+bad.map(x=>x.el+' → '+x.probs.join(' ; ')).join('\n   '):''));
  await p.close();
}
const N=+(process.env.CONC||4); let i=0;
await Promise.all(Array.from({length:N},async()=>{ const b=await LAUNCH(); while(i<jobs.length){ const j=jobs[i++]; try{ await run(j,b); }catch(e){ console.log('FATAL',j.pg,j.w,String(e).slice(0,120)); } } await b.close(); }));
fs.writeFileSync(process.env.OUT||'reveal.json',JSON.stringify(out,null,1));
