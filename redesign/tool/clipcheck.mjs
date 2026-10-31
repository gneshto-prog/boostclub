import puppeteer from 'puppeteer-core';
// Finds text that is cut off by an ancestor with overflow hidden/clip: compares each text node's line boxes
// to the clipping ancestor's box, after scrolling the whole page so every reveal animation has finished.
const base=process.env.BASE||'http://localhost:8765/';
const pages=(process.argv[2]||'_home_local.html,menu.html,how-it-works.html,free-scan.html,results.html,reviews.html,gabriel.html,boost-fit.html,visit.html,bring-a-friend.html,404.html').split(',');
const widths=(process.argv[3]||'1440,390').split(',').map(Number);
const langs=(process.argv[4]||'en').split(',');
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
let total=0;
for(const lang of langs) for(const pg0 of pages) for(const w of widths){
  const pg=lang==='en'?pg0:(pg0==='_home_local.html'?lang+'/index.html':lang+'/'+pg0);
  const p=await b.newPage(); await p.setViewport({width:w,height:w<800?844:900,isMobile:w<800,hasTouch:w<800});
  await p.goto(base+pg,{waitUntil:'networkidle0',timeout:60000});
  await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=250){ scrollTo({top:y,behavior:'instant'}); await new Promise(r=>setTimeout(r,60)); } await new Promise(r=>setTimeout(r,1800)); });
  const res=await p.evaluate(()=>{
    const out=[]; const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let n; while((n=tw.nextNode())){
      const t=n.textContent.trim(); if(t.length<2) continue;
      const el=n.parentElement; if(!el||el.closest('[hidden],[aria-hidden="true"],script,style,.k-marquee,.rbar,.k-curtain,.sheet,svg')) continue;
      const cs=getComputedStyle(el); if(cs.visibility==='hidden'||+cs.opacity===0) continue;
      const r=document.createRange(); r.selectNodeContents(n); const rects=[...r.getClientRects()].filter(x=>x.width>1&&x.height>1); if(!rects.length) continue;
      let a=el; while(a&&a!==document.body){ const s=getComputedStyle(a); if(/(hidden|clip)/.test(s.overflow+s.overflowX+s.overflowY)) break; a=a.parentElement; }
      if(!a||a===document.body) continue;
      const ar=a.getBoundingClientRect(); if(ar.width<2||ar.height<2) continue;
      const sc=getComputedStyle(a); if(/(auto|scroll)/.test(sc.overflowX)) continue; // scrollers clip by design
      let worst=0; rects.forEach(x=>{ worst=Math.max(worst,ar.top-x.top,x.bottom-ar.bottom,ar.left-x.left,x.right-ar.right); });
      const fs=parseFloat(cs.fontSize)||16;
      if(worst>Math.max(3,fs*.12)) out.push({t:t.slice(0,40),px:Math.round(worst),fs:Math.round(fs),cls:(a.className||a.tagName).toString().slice(0,40)});
    }
    return out;
  });
  total+=res.length; console.log((res.length?'✗ ':'✓ ')+pg+' '+w+(res.length?'  '+res.slice(0,6).map(x=>`"${x.t}" ${x.px}px in .${x.cls}`).join(' | '):''));
  await p.close();
}
console.log(total?total+' clipped text boxes':'NO CLIPPED TEXT'); await b.close();
