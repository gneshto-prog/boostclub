import puppeteer from 'puppeteer-core';
const D=process.argv[2]; const pages=['','consultatie-gratuita','cum-functioneaza','rezultate','recenzii','contact','gabriel','business','bring-a-friend','shake-menu','boostfit/','nope-404'];
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const links=new Set(); let bad=0;
for(const L of ['','ro/','ru/']) for(const pg of pages){ const p=await b.newPage(); await p.setViewport({width:1280,height:900}); const errs=[], fails=[];
  p.on('pageerror',e=>errs.push(e.message)); p.on('response',r=>{ const u=r.url(); if(u.startsWith(D)&&r.status()>=400&&!u.includes('nope-404')) fails.push(r.status()+' '+u.replace(D,'')); });
  p.on('requestfailed',r=>{ if(r.url().startsWith(D)) fails.push('FAILED '+r.url().replace(D,'')); });
  await p.goto(D+'/'+L+pg,{waitUntil:'load',timeout:60000}); await p.evaluate(async()=>{ for(let y=0;y<document.body.scrollHeight;y+=700){ scrollTo(0,y); await new Promise(r=>setTimeout(r,120)); } }); await new Promise(r=>setTimeout(r,1200));
  const info=await p.evaluate(()=>({t:document.title, lang:document.documentElement.lang, can:(document.querySelector('link[rel=canonical]')||{}).href, ls:[...document.querySelectorAll('a[href]')].map(a=>a.href), broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.src).map(i=>i.src)}));
  info.ls.filter(u=>u.startsWith('https://boostclub.ro')).forEach(u=>links.add(u.split('#')[0]));
  info.ls.filter(u=>u.startsWith(D)).forEach(u=>links.add(u.split('#')[0]));
  const ok=!errs.length&&!fails.length&&!info.broken.length; if(!ok) bad++;
  console.log((ok?'OK  ':'BAD ')+'/'+L+pg+' | '+info.lang+' | '+info.t.slice(0,60)+' | canon '+(info.can||'-').replace('https://boostclub.ro','')+(errs.length?' | JS '+errs.join(' ; '):'')+(fails.length?' | NET '+[...new Set(fails)].slice(0,6).join(' ; '):'')+(info.broken.length?' | IMG '+info.broken.slice(0,3).join(' '):''));
  await p.close(); }
await b.close();
const fs=await import('fs'); fs.writeFileSync('qa/draft-links.txt',[...links].join('\n')); console.log(bad?bad+' pages with problems':'ALL PAGES CLEAN', '| links found', links.size);
