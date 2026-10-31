import puppeteer from 'puppeteer-core';
import fs from 'fs';
const OUT = '../shots';
const [,, listArg, widthsArg] = process.argv;
const pages = listArg.split(',');
const widths = widthsArg.split(',').map(w => w.split('x').map(Number));
const browser = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, args:['--hide-scrollbars','--lang=en-US']});
const meta = {};
for (const p of pages) {
  for (const [w,h] of widths) {
    const page = await browser.newPage();
    const mobile = w < 768;
    await page.setViewport({width:w, height:h, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile});
    if (mobile) await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1');
    await page.evaluateOnNewDocument(() => { try { localStorage.setItem('bc_lang', location.pathname.startsWith('/ro')?'ro':location.pathname.startsWith('/ru')?'ru':'en'); } catch(e){} });
    const errs = [];
    page.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
    page.on('requestfailed', r => errs.push('FAIL '+r.url()));
    page.on('response', r => { if (r.status()>=400) errs.push(r.status()+' '+r.url()); });
    const url = 'https://boostclub.ro' + p;
    await page.goto(url, {waitUntil:'networkidle2', timeout:60000});
    await new Promise(r=>setTimeout(r,1500));
    const slug = (p.replace(/\//g,'_').replace(/^_|_$/g,'')||'home') + '_' + w;
    // first view untouched
    await page.screenshot({path:`${OUT}/${slug}_00.jpg`, type:'jpeg', quality:72});
    // walk page to trigger lazy + reveals
    let H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y=0; y<H; y+=Math.round(h/2)) { await page.evaluate(y=>window.scrollTo(0,y), y); await new Promise(r=>setTimeout(r,180)); H = await page.evaluate(() => document.documentElement.scrollHeight); }
    await new Promise(r=>setTimeout(r,1200));
    let i=1;
    for (let y=h; y<H; y+=h) { await page.evaluate(y=>window.scrollTo(0,y), y); await new Promise(r=>setTimeout(r,500)); await page.screenshot({path:`${OUT}/${slug}_${String(i++).padStart(2,'0')}.jpg`, type:'jpeg', quality:72}); if (i>45) break; }
    const info = await page.evaluate(() => {
      const imgs = [...document.images].map(im => ({src: im.currentSrc.replace(location.origin,''), alt: im.alt, nat: im.naturalWidth+'x'+im.naturalHeight, rend: Math.round(im.getBoundingClientRect().width)+'x'+Math.round(im.getBoundingClientRect().height), fit: getComputedStyle(im).objectFit, pos:getComputedStyle(im).objectPosition}));
      const bgs = [...document.querySelectorAll('*')].map(e=>getComputedStyle(e).backgroundImage).filter(b=>b.includes('url(')).map(b=>b.slice(0,140));
      const fonts = [...new Set([...document.querySelectorAll('h1,h2,h3,p,a,button,body')].map(e=>getComputedStyle(e).fontFamily.split(',')[0]))];
      const h1 = document.querySelector('h1'); const cs = h1 && getComputedStyle(h1);
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      return {title: document.title, H: document.documentElement.scrollHeight, imgs, bgs:[...new Set(bgs)], fonts, h1: h1 && {text:h1.innerText.slice(0,120), size:cs.fontSize, weight:cs.fontWeight, lh:cs.lineHeight, ls:cs.letterSpacing, ff:cs.fontFamily}, overflow, sections: [...document.querySelectorAll('main > section, main > div, body > section')].map(s=>(s.id||s.className||s.tagName).toString().slice(0,60))};
    });
    info.errs = errs; meta[slug] = info;
    console.log(slug, 'H=',info.H, 'segs=',i, 'overflowX=',info.overflow, 'errs=',errs.length);
    await page.close();
  }
}
fs.writeFileSync(`${OUT}/meta-${Date.now()}.json`, JSON.stringify(meta,null,1));
await browser.close();
