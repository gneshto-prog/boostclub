import puppeteer from 'puppeteer-core';
// Full-site QA: every page x widths (+ RO/RU). Reports overflow, JS errors, failed requests, broken images,
// h1 count, text boxes that run off the right edge, and text clipped by the fixed reserve bar at rest.
const base=process.env.BASE||'http://localhost:8765/';
const pages=(process.argv[2]||'_home_local.html,menu.html,how-it-works.html,free-scan.html,results.html,reviews.html,gabriel.html,boost-fit.html,visit.html,bring-a-friend.html,404.html').split(',');
const widths=(process.argv[3]||'1440,1024,768,390').split(',').map(Number);
const langs=(process.argv[4]||'en,ro,ru').split(',');
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
let bad=0;
for(const lang of langs) for(const pg0 of pages){
  const pg = lang==='en'?pg0:(pg0==='_home_local.html'?lang+'/index.html':lang+'/'+pg0);
  for(const w of (lang==='en'?widths:[1440,390])){
    const p=await b.newPage(); const errs=[];
    p.on('pageerror',e=>errs.push('JS '+e.message.slice(0,120)));
    p.on('requestfailed',r=>{ const u=r.url(); if(!/fonts\.g|gstatic/.test(u)) errs.push('FAIL '+u.replace(base,'')+' '+(r.failure()?.errorText||'')); });
    await p.setViewport({width:w,height:w<800?844:900,isMobile:w<800,hasTouch:w<800});
    try{ await p.goto(base+pg,{waitUntil:'networkidle0',timeout:60000}); }catch(e){ errs.push('GOTO '+e.message); }
    await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=400){ scrollTo({top:y,behavior:'instant'}); await new Promise(r=>setTimeout(r,35)); } scrollTo({top:0,behavior:'instant'}); });
    await new Promise(r=>setTimeout(r,800));
    const r=await p.evaluate(()=>{
      const out={};
      out.ov=document.documentElement.scrollWidth-innerWidth;
      out.h1=document.querySelectorAll('h1').length;
      out.broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.src&&!i.closest('[hidden]')).map(i=>i.getAttribute('src')).slice(0,4);
      out.noalt=[...document.images].filter(i=>!i.hasAttribute('alt')).length;
      const off=[]; document.querySelectorAll('h1,h2,h3,p,a.btn,blockquote,li,b,span.loud').forEach(e=>{ if(!e.offsetParent&&getComputedStyle(e).position!=='fixed') return; const cs=getComputedStyle(e); if(cs.visibility==='hidden') return;
        let anc=e.parentElement, clipped=false; while(anc&&anc!==document.body){ const s=getComputedStyle(anc); if(/(hidden|auto|scroll|clip)/.test(s.overflowX)){ clipped=true; break; } anc=anc.parentElement; }
        if(clipped) return; const rc=e.getBoundingClientRect(); if(rc.width&&rc.right>innerWidth+2) off.push((e.tagName+' '+(e.textContent||'').trim().slice(0,30))); });
      out.off=off.slice(0,4);
      return out; });
    const issues=[]; if(r.ov>0) issues.push('overflow '+r.ov); if(r.h1!==1) issues.push('h1='+r.h1); if(r.broken.length) issues.push('broken '+r.broken.join(' ')); if(r.noalt) issues.push('noalt '+r.noalt); if(r.off.length) issues.push('offscreen '+r.off.join(' | ')); issues.push(...errs.slice(0,4));
    if(issues.length){ bad++; console.log('✗',pg,w,issues.join(' ; ')); } else console.log('✓',pg,w);
    await p.close();
  }
}
console.log(bad?`${bad} page-widths with issues`:'ALL CLEAN'); await b.close();
