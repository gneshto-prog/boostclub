import puppeteer from 'puppeteer-core';
const base='http://localhost:8765/';
const out='/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/rp/';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]); // no peek animation interfering
await p.setViewport({width:1440,height:900});
await p.goto(base+'results.html',{waitUntil:'networkidle0'});
const val=()=>p.$eval('.ba-hero .ba-h',h=>[h.getAttribute('aria-valuenow'),h.getAttribute('aria-valuetext')]);
const log=(k,v)=>console.log(k.padEnd(28),JSON.stringify(v));
log('initial',await val());
// pointer drag
const r=await p.$eval('.ba-hero',e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height}});
await p.mouse.move(r.x+r.w*.5,r.y+r.h*.5); await p.mouse.down(); await p.mouse.move(r.x+r.w*.2,r.y+r.h*.5,{steps:8});
log('drag to 20%',await val()); await p.mouse.move(r.x+r.w*.85,r.y+r.h*.4,{steps:8}); await p.mouse.up();
log('drag to 85%',await val());
log('focused element',await p.evaluate(()=>document.activeElement.getAttribute('role')));
// click elsewhere
await p.mouse.click(r.x+r.w*.3,r.y+r.h*.7); log('click 30%',await val());
// keyboard
await p.focus('.ba-hero .ba-h');
await p.keyboard.press('ArrowRight'); log('ArrowRight',await val());
await p.keyboard.down('Shift'); await p.keyboard.press('ArrowLeft'); await p.keyboard.up('Shift'); log('Shift+ArrowLeft',await val());
await p.keyboard.press('Home'); log('Home',await val());
await p.keyboard.press('ArrowLeft'); log('ArrowLeft at 0 (clamp)',await val());
await p.keyboard.press('End'); log('End',await val());
await p.keyboard.press('PageDown'); log('PageDown',await val());
// touch-style pointer events dispatched directly
await p.$eval('.ba-hero',e=>{const b=e.getBoundingClientRect(); const o={bubbles:true,pointerId:7,pointerType:'touch',isPrimary:true,clientY:b.y+b.height/2};
  e.dispatchEvent(new PointerEvent('pointerdown',{...o,clientX:b.x+b.width*.6})); e.dispatchEvent(new PointerEvent('pointermove',{...o,clientX:b.x+b.width*.4})); e.dispatchEvent(new PointerEvent('pointerup',{...o,clientX:b.x+b.width*.4}));});
log('touch pointer to 40%',await val());
log('clip on before img',await p.$eval('.ba-hero .ba-before',e=>getComputedStyle(e).clipPath));
// picker
await p.click('.pk:nth-child(3)'); log('picker 03 caption',await p.$eval('[data-cap-t]',e=>e.textContent)); log('after picker',await val());
log('hero img src',await p.$eval('.ba-hero .ba-before',e=>e.getAttribute('src')));
// lightbox
await p.evaluate(()=>document.querySelector('[data-open="4"]').scrollIntoView());
await p.click('[data-open="4"]'); await new Promise(r=>setTimeout(r,500));
log('dialog open',await p.$eval('#lb',d=>d.open));
log('lb title',await p.$eval('#lb .lb-t',e=>e.textContent.trim()));
log('lb focus',await p.evaluate(()=>document.activeElement.className));
await p.keyboard.press('ArrowLeft'); log('lb ArrowLeft',await p.$eval('#lb .ba-h',h=>h.getAttribute('aria-valuenow')));
await p.screenshot({path:out+'lb_1440.jpg',type:'jpeg',quality:65});
const seen=[]; for(let i=0;i<6;i++){ await p.keyboard.press('Tab'); seen.push(await p.evaluate(()=>{const a=document.activeElement;return (a.closest('#lb')?'IN:':'OUT:')+(a.getAttribute('aria-label')||a.className)})); }
log('tab cycle',seen);
await p.click('[data-lb-next]'); log('next',await p.$eval('#lb .lb-t',e=>e.textContent.trim()));
await p.keyboard.press('Escape'); await new Promise(r=>setTimeout(r,300));
log('dialog after Esc',await p.$eval('#lb',d=>d.open));
log('focus returned to',await p.evaluate(()=>document.activeElement.getAttribute('data-open')));
log('html overflow',await p.evaluate(()=>document.documentElement.style.overflow));
await p.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
await p.click('[data-open="0"]'); await new Promise(r=>setTimeout(r,500)); await p.screenshot({path:out+'lb_390.jpg',type:'jpeg',quality:65});
console.log('errors',errs);
await b.close();
