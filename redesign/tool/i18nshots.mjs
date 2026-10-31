import puppeteer from 'puppeteer-core';
import fs from 'fs';
const SITE='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/';
const base='file://'+SITE;
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/i18nshots/';
const pages=process.argv[2].split(','); const shots=process.argv[3]!=='noshots';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for (const pg of pages) for (const [w,h,tag,n] of [[1440,900,'d',5],[390,844,'m',6]]){
  const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('requestfailed',r=>{ if(!/fonts|gsap|cdnjs/.test(r.url())) errs.push('FAIL '+r.url().replace(base,'')); });
  await p.setRequestInterception(true);
  p.on('request',r=>{ const u=r.url(); if(u.endsWith('/site.js')){ let s=fs.readFileSync(SITE+'site.js','utf8'); s=s.replace("+'</a>'</p></div>'","+'</a></p></div>'"); r.respond({status:200,contentType:'application/javascript',body:s}); } else r.continue(); });
  await p.setViewport({width:w,height:h,isMobile:w<800,hasTouch:w<800});
  await p.goto(base+pg,{waitUntil:'networkidle0',timeout:60000}); await new Promise(r=>setTimeout(r,1200));
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  const name=pg.replace('/','_').replace('.html','');
  if(shots) for(let i=0;i<n;i++){ const y=Math.round((H-h)*i/(n-1)); await p.evaluate(async y=>{const s=scrollY; for(let k=1;k<=8;k++){scrollTo(0,s+(y-s)*k/8); await new Promise(r=>setTimeout(r,40));}},y); await new Promise(r=>setTimeout(r,900)); await p.screenshot({path:`${out}${name}_${tag}_${i}.jpg`,type:'jpeg',quality:62}); }
  const rep=await p.evaluate(()=>{
    const W=innerWidth, bad=[];
    const skip=el=>el.closest('.film,.mq,.mq-row,.sheet,.rbar,.stack,.lb,dialog,.slotbtn,.tiles,.gal,.pks,.toast');
    document.querySelectorAll('h1,h2,h3,p,a,span,b,div.loud,.nm,li,button,label,summary').forEach(el=>{
      if(skip(el)) return; const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') return;
      const r=el.getBoundingClientRect(); if(!r.width) return;
      if(r.right>W+1 && el.children.length===0) bad.push('OFF '+el.tagName+'.'+el.className+' r='+Math.round(r.right)+' "'+el.textContent.trim().slice(0,50)+'"');
      if(el.scrollWidth>el.clientWidth+2 && cs.overflowX!=='auto' && cs.overflowX!=='scroll' && /H1|H2|H3|DIV/.test(el.tagName) && el.clientWidth>0 && el.textContent.trim()) bad.push('WIDE '+el.tagName+'.'+el.className+' sw='+el.scrollWidth+' cw='+el.clientWidth+' "'+el.textContent.trim().slice(0,50)+'"');
    });
    const eng=[]; // visible English left: crude check for common English words in text nodes outside [lang]
    const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
    while((n=tw.nextNode())){ const t=n.nodeValue.trim(); const pe=n.parentElement; if(!t||!pe||/SCRIPT|STYLE/.test(pe.tagName)) continue; const lg=pe.closest('[lang]'); if(lg&&lg!==document.documentElement) continue;
      if(/\b(the|and|your|you|with|from|for|our|is|are|to)\b/i.test(t) && /[a-z]{3}/.test(t)) eng.push(t.slice(0,80)); }
    return {bad:[...new Set(bad)].slice(0,12), eng:[...new Set(eng)].slice(0,15), ov:document.documentElement.scrollWidth-innerWidth};
  });
  console.log(pg,tag,'H',H,'overflow',rep.ov,'errs',JSON.stringify(errs.slice(0,3)));
  rep.bad.forEach(x=>console.log('   ',x)); rep.eng.forEach(x=>console.log('    EN?',x));
  await p.close(); }
await b.close();
