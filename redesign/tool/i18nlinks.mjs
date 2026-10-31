import puppeteer from 'puppeteer-core'; import fs from 'fs'; import path from 'path';
const SITE='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site/';
const files=['index','free-scan','how-it-works','menu','results','reviews','gabriel','boost-fit','visit','bring-a-friend','404'].map(f=>f+'.html');
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
let problems=0;
for(const L of ['','ro/','ru/']) for(const f of files){
  const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.setRequestInterception(true);
  p.on('request',r=>{ const u=r.url(); if(u.endsWith('/site.js')){ let s=fs.readFileSync(SITE+'site.js','utf8'); s=s.replace("+'</a>'</p></div>'","+'</a></p></div>'"); r.respond({status:200,contentType:'application/javascript',body:s}); } else r.continue(); });
  await p.goto('file://'+SITE+L+f,{waitUntil:'domcontentloaded'}); await new Promise(r=>setTimeout(r,500));
  const info=await p.evaluate(()=>({lang:[...document.querySelectorAll('.nav .lang a')].map(a=>a.href), sheet:[...document.querySelectorAll('.sheet .bot a')].map(a=>a.href),
     links:[...document.querySelectorAll('a[href]')].map(a=>a.href).filter(h=>h.startsWith('file:')),
     wa:[...new Set([...document.querySelectorAll('a[href*="wa.me"]')].map(a=>decodeURIComponent(a.href.split('text=')[1]||'')))],
     legal:[...document.querySelectorAll('.foot a[href*="boostclub.ro"]')].map(a=>a.href), sel:(document.querySelector('select[name=lang]')||{}).value }));
  const bad=[];
  for(const h of [...info.lang,...info.sheet,...info.links]){ const fp=decodeURIComponent(h.replace('file://','').split('#')[0].split('?')[0]); if(!fs.existsSync(fp)) bad.push('MISSING '+fp.replace(SITE,'')); }
  const expect={'':['ro/'+f,'ru/'+f],'ro/':[f,'ru/'+f],'ru/':['ro/'+f,f]}[L];
  const got=info.lang.map(h=>h.replace('file://'+SITE,''));
  if(JSON.stringify(got)!==JSON.stringify(expect)) bad.push('SWITCH '+JSON.stringify(got));
  if(L && info.wa.some(w=>/Hi!/.test(w))) bad.push('WA english '+info.wa);
  if(errs.length) bad.push('ERR '+errs[0]);
  if(bad.length){ problems++; console.log(L+f, [...new Set(bad)].join(' | ')); }
  else if(f==='index.html') console.log(L+f,'ok · wa:',info.wa.join(' / '),'· legal:',info.legal.join(' '),'· sel:',info.sel);
  await p.close(); }
console.log('pages with problems:',problems); await b.close();
