import puppeteer from 'puppeteer-core';
import fs from 'fs';
// Pre-launch audit: every page x width x language, rendered in Chrome. Per run: horizontal overflow, JS errors,
// console errors, failed requests, broken images, clipped text, text-on-text overlap, text under fixed bars at rest,
// tap targets, links (collected for a separate status check), headings, alt, meta. Writes JSON to OUT.
const base=process.env.BASE||'http://localhost:8765/';
const OUT=process.env.OUT||'audit.json';
const pages=(process.env.PAGES||'_home_local.html,menu.html,how-it-works.html,free-scan.html,results.html,reviews.html,gabriel.html,boost-fit.html,visit.html,bring-a-friend.html,business.html,404.html').split(',');
const widths=(process.env.WIDTHS||'320,375,390,430,768,1024,1280,1440,1920').split(',').map(Number);
const langs=(process.env.LANGS||'en,ro,ru').split(',');
const SHOTS=process.env.SHOTS; // dir for full-page screenshots
const jobs=[];
for(const lang of langs) for(const pg0 of pages) for(const w of widths){
  const pg=lang==='en'?pg0:(pg0==='_home_local.html'?lang+'/index.html':lang+'/'+pg0);
  jobs.push({lang,pg,w,h:w<800?(w<400?740:844):(w<1100?768:(w<1600?900:1080))});
}
if(process.env.LAND) jobs.push(...pages.map(pg=>({lang:'en',pg,w:844,h:390,land:1})));
const LAUNCH=()=>puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows'],protocolTimeout:180000});
const results=[];
async function run(j,b){
  const p=await b.newPage(); await p.evaluateOnNewDocument(HELP); const errs=[], cons=[], fails=[];
  p.on('pageerror',e=>errs.push(e.message.slice(0,160)));
  p.on('console',m=>{ if(['error','warning','warn'].includes(m.type())) cons.push(m.type()+': '+m.text().slice(0,160)); });
  p.on('requestfailed',r=>{ const u=r.url(); const t=r.failure()?.errorText||''; if(/fonts\.g|gstatic/.test(u)) return; if(/\.(mp4|webm|mov)/.test(u)&&/ABORTED/.test(t)) return; fails.push(u.replace(base,'')+' '+t); });
  p.on('response',r=>{ if(r.status()>=400) fails.push(r.status()+' '+r.url().replace(base,'')); });
  const mob=j.w<800;
  await p.setViewport({width:j.w,height:j.h,isMobile:mob,hasTouch:mob});
  try{ await p.goto(base+j.pg,{waitUntil:'load',timeout:90000}); await new Promise(r=>setTimeout(r,1500)); }catch(e){ errs.push('GOTO '+e.message.slice(0,80)); }
  await new Promise(r=>setTimeout(r,600));
  // at rest (top): text hidden under fixed elements
  const top=await p.evaluate(()=>fixedCover());
  await p.evaluate(async()=>{ const H=()=>document.documentElement.scrollHeight; for(let y=0;y<H();y+=Math.round(innerHeight*.45)){ scrollTo({top:y,behavior:'instant'}); await new Promise(r=>setTimeout(r,70)); } await new Promise(r=>setTimeout(r,1600)); }).catch(()=>{});
  const r=await p.evaluate(()=>audit()).catch(e=>({err:String(e)}));
  if(SHOTS&&!j.land){ fs.mkdirSync(SHOTS,{recursive:true}); try{ await p.evaluate(()=>{scrollTo({top:0,behavior:'instant'})}); await new Promise(r=>setTimeout(r,400));
    await p.screenshot({path:`${SHOTS}/${j.lang}-${j.pg.replace(/\//g,'_').replace('.html','')}-${j.w}.jpg`,fullPage:true,type:'jpeg',quality:55}); }catch(e){} }
  results.push({...j,errs,cons:[...new Set(cons)].slice(0,8),fails:[...new Set(fails)].slice(0,8),top,...r});
  await p.close();
}
// helpers injected into every page
const HELP=`
window.vis=function(el){ if(!el.getClientRects().length) return false; let a=el; while(a&&a.nodeType===1){ const s=getComputedStyle(a); if(s.display==='none'||s.visibility==='hidden'||+s.opacity<0.05) return false; if(a.hasAttribute('hidden')||a.getAttribute('aria-hidden')==='true') return false; a=a.parentElement; } return true; };
window.label=function(el){ return (el.tagName.toLowerCase()+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\\s+/).slice(0,2).join('.'):'')+' "'+(el.textContent||'').trim().replace(/\\s+/g,' ').slice(0,36)+'"'); };
window.textBlocks=function(){ const out=[]; const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n; const seen=new Set();
  while((n=tw.nextNode())){ if(n.textContent.trim().length<2) continue; const el=n.parentElement; if(!el||seen.has(el)) continue; if(el.closest('script,style,svg,noscript,.k-marquee,.k-curtain,[aria-hidden="true"]')) continue; seen.add(el); if(!vis(el)) continue; out.push([el,n]); } return out; };
window.fixedCover=function(){ const fx=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e); return (s.position==='fixed'||s.position==='sticky')&&vis(e)&&e.getBoundingClientRect().height>20&&e.getBoundingClientRect().height<innerHeight*.5;});
  const bars=fx.map(e=>({e,r:e.getBoundingClientRect()})).filter(x=>x.r.width>innerWidth*.5);
  const out=[]; textBlocks().forEach(([el,n])=>{ if(bars.some(x=>x.e.contains(el))) return; const r=document.createRange(); r.selectNodeContents(n); const rr=r.getBoundingClientRect(); if(rr.bottom<0||rr.top>innerHeight||!rr.width) return;
    bars.forEach(x=>{ const ov=Math.min(rr.bottom,x.r.bottom)-Math.max(rr.top,x.r.top); const ow=Math.min(rr.right,x.r.right)-Math.max(rr.left,x.r.left); if(ov>rr.height*.35&&ow>8){ const bg=getComputedStyle(x.e).backgroundColor; if(bg==='rgba(0, 0, 0, 0)'&&!x.e.querySelector('*')) return; const hit=document.elementFromPoint(Math.max(1,Math.min(innerWidth-1,(Math.max(rr.left,x.r.left)+Math.min(rr.right,x.r.right))/2)),(Math.max(rr.top,x.r.top)+Math.min(rr.bottom,x.r.bottom))/2); if(hit&&x.e.contains(hit)&&!el.contains(hit)) out.push(label(el)+' under '+label(x.e).slice(0,30)); } }); });
  return [...new Set(out)].slice(0,6); };
window.audit=function(){ const o={};
  o.ov=document.documentElement.scrollWidth-innerWidth;
  o.title=document.title; o.desc=(document.querySelector('meta[name=description]')||{}).content||''; o.og=!!document.querySelector('meta[property="og:image"]'); o.canon=!!document.querySelector('link[rel=canonical]');
  o.lang=document.documentElement.lang;
  o.heads=[...document.querySelectorAll('h1,h2,h3,h4')].filter(vis).map(h=>h.tagName[1]).join('');
  o.h1=document.querySelectorAll('h1').length;
  o.broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&(i.currentSrc||i.src)).map(i=>i.getAttribute('src')).slice(0,5);
  o.noalt=[...document.images].filter(i=>!i.hasAttribute('alt')).map(i=>i.getAttribute('src')).slice(0,5);
  o.bigimg=[...document.images].filter(i=>i.naturalWidth&&vis(i)&&i.getBoundingClientRect().width>40&&i.naturalWidth>i.getBoundingClientRect().width*devicePixelRatio*3.2).map(i=>(i.getAttribute('src')||'').split('?')[0]+' '+i.naturalWidth+'→'+Math.round(i.getBoundingClientRect().width)).slice(0,5);
  o.lowimg=[...document.images].filter(i=>i.naturalWidth&&vis(i)&&i.getBoundingClientRect().width>120&&i.naturalWidth<i.getBoundingClientRect().width*.85&&getComputedStyle(i).filter==='none').map(i=>(i.getAttribute('src')||'').split('?')[0]+' '+i.naturalWidth+'→'+Math.round(i.getBoundingClientRect().width)).slice(0,5);
  // clipped text
  const clip=[]; textBlocks().forEach(([el,n])=>{ const cs=getComputedStyle(el); const r=document.createRange(); r.selectNodeContents(n); const rects=[...r.getClientRects()].filter(x=>x.width>1&&x.height>1); if(!rects.length) return;
    let a=el; while(a&&a!==document.body){ const s=getComputedStyle(a); if(/(hidden|clip)/.test(s.overflow+s.overflowX+s.overflowY)) break; a=a.parentElement; } if(!a||a===document.body) return;
    const sa=getComputedStyle(a); if(/(auto|scroll)/.test(sa.overflowX+sa.overflowY)) return; if(sa.textOverflow==='ellipsis') return; const ar=a.getBoundingClientRect(); if(ar.width<2||ar.height<2) return;
    let worst=0; rects.forEach(x=>{ worst=Math.max(worst,ar.top-x.top,x.bottom-ar.bottom,ar.left-x.left,x.right-ar.right); }); const fs=parseFloat(cs.fontSize)||16;
    if(worst>Math.max(3,fs*.12)) clip.push(label(el)+' '+Math.round(worst)+'px'); });
  o.clip=clip.slice(0,8);
  // text on text overlap (different blocks, not nested)
  const blocks=textBlocks().map(([el,n])=>{ const r=document.createRange(); r.selectNodeContents(n); return {el,rs:[...r.getClientRects()].filter(x=>x.width>2&&x.height>4)}; }).filter(x=>x.rs.length);
  const ovl=[]; for(let i=0;i<blocks.length&&ovl.length<8;i++) for(let k=i+1;k<blocks.length;k++){ const A=blocks[i],B=blocks[k]; if(A.el.contains(B.el)||B.el.contains(A.el)) continue;
    let hit=0; for(const a of A.rs) for(const c of B.rs){ const w=Math.min(a.right,c.right)-Math.max(a.left,c.left), h=Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top); if(w>4&&h>Math.min(a.height,c.height)*.4) hit=1; }
    if(hit){ ovl.push(label(A.el)+' × '+label(B.el)); if(ovl.length>=8) break; } }
  o.overlap=ovl;
  // off right edge, not inside a clipping/scrolling ancestor
  const off=[]; textBlocks().forEach(([el])=>{ let a=el.parentElement,c=false; while(a&&a!==document.body){ const s=getComputedStyle(a); if(/(hidden|auto|scroll|clip)/.test(s.overflowX)){c=true;break;} a=a.parentElement; } if(c) return; const rc=el.getBoundingClientRect(); if(rc.right>innerWidth+1||rc.left<-1) off.push(label(el)); });
  o.off=off.slice(0,6);
  // tap targets on phones
  if(innerWidth<800){ o.tap=[...document.querySelectorAll('a,button,[role=button],input,select')].filter(e=>vis(e)&&!e.closest('.k-marquee,footer p,p')).map(e=>({e,r:e.getBoundingClientRect()})).filter(x=>x.r.width&&(x.r.height<32||x.r.width<32)).map(x=>label(x.e)+' '+Math.round(x.r.width)+'x'+Math.round(x.r.height)).slice(0,8); }
  // links + controls
  o.links=[...document.querySelectorAll('a')].map(a=>({h:a.getAttribute('href'),t:(a.textContent||a.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,40),r:!!a.closest('[data-reserve]')||a.hasAttribute('data-reserve'),tg:a.target||''}));
  o.noname=[...document.querySelectorAll('a,button')].filter(e=>vis(e)&&!(e.textContent||'').trim()&&!e.getAttribute('aria-label')&&!e.querySelector('img[alt]:not([alt=""])')&&!e.title).map(e=>label(e)).slice(0,6);
  o.ids=(()=>{ const m={}; document.querySelectorAll('[id]').forEach(e=>m[e.id]=(m[e.id]||0)+1); return Object.keys(m).filter(k=>m[k]>1).slice(0,8); })();
  return o; };`;
const N=+(process.env.CONC||6); let i=0;
await Promise.all(Array.from({length:N},async()=>{ const b=await LAUNCH(); while(i<jobs.length){ const j=jobs[i++]; try{ await run(j,b); }catch(e){ results.push({...j,fatal:String(e).slice(0,200)}); } if(results.length%20===0) console.log(results.length+'/'+jobs.length); } await b.close(); }));
fs.writeFileSync(OUT,JSON.stringify(results,null,1)); console.log('done',results.length);
