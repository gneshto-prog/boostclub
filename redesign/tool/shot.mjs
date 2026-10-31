import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for (const [w,h,n] of [[1440,900,'d'],[390,844,'m']]){ const p=await b.newPage(); await p.setViewport({width:w,height:h});
 await p.goto('file://'+process.argv[2],{waitUntil:'networkidle0'}); await p.evaluate(()=>document.fonts.ready);
 const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth); console.log(n,'overflow',ov,'H',await p.evaluate(()=>document.body.scrollHeight));
 await p.screenshot({path:`../sheets/rep_${n}.jpg`,type:'jpeg',quality:70,fullPage:false}); 
 await p.evaluate(()=>document.querySelector('#system').scrollIntoView()); await new Promise(r=>setTimeout(r,300));
 await p.screenshot({path:`../sheets/rep_${n}2.jpg`,type:'jpeg',quality:70}); await p.close();}
await b.close();
