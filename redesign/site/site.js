(function(){
  var B=document.body, C=document.getElementById('bc')||B, page=C.dataset.page||'';
  var LANG=document.documentElement.lang||'en', T=function(x){ return (window.BC_T&&window.BC_T[x])||x; }, P=(LANG==='en'?'':'../');
  window.BC_T_fn=T;
  // language switch: EN at the root, RO under ro/, RU under ru/
  var file=(location.pathname.split('/').pop()||'index.html'); if(file==='_home_local.html') file='index.html';
  function langHref(l){ return (LANG==='en'?'':'../')+(l==='en'?'':l+'/')+file; }
  var LINKS=[['free-scan.html','Free consultation','scan'],['menu.html','Shake menu','menu'],['boost-fit.html','Boost Fit','fit'],['results.html','Results','results'],['gabriel.html','Founder','gabriel']];
  [['icon','brand/favicon.svg'],['alternate icon','brand/favicon.ico'],['apple-touch-icon','brand/apple-touch-icon.png']].forEach(function(x){ var l=document.createElement('link'); l.rel=x[0]; l.href=P+x[1]; document.head.appendChild(l); });
  // the real Boost Club leaf, from the wordmark
  window.LEAF='<svg class="leaf" viewBox="0 0 24 25.7" aria-hidden="true" focusable="false"><path d="M18.62 0h2.56C23.06 0 24 5.98 24 9.22v2.48c0 7.94-6.92 14-18.62 14H2.82C.85 25.7 0 19.64 0 17.08v-3.59C0 5.98 6.83 0 18.62 0Z" fill="currentColor"/><path d="M3.5 22.8 14.94 9.48" stroke="var(--leafcut,#fff)" stroke-width="2.2" stroke-linecap="round"/></svg>';
  var WAICON='<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3Z"/></svg>';
  var IGICON='<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>';
  var WA='https://wa.me/40726205752?text=Hi%21%20I%27d%20like%20to%20book%20a%20free%20scan.';
  window.BC={WA:WA};

  // header + phone menu (a sub-brand page such as Boost Fit brings its own: data-nonav)
  var setSheet=function(){};
  if(!C.dataset.nonav){
  var nav=document.createElement('header');
  nav.className='nav gut'+(C.dataset.navlight?' light-start':'');
  nav.innerHTML='<a class="brand" href="index.html" aria-label="Boost Club home"><img class="c" src="'+P+'img/wm-nav-cream.png" alt="Boost Club"><img class="d" src="'+P+'img/wm-nav-dark.png" alt="Boost Club"></a>'+
    '<nav aria-label="Main"><ul>'+LINKS.map(function(l){ var inner = l[2]==='fit' ? '<img class="bfl d" src="'+P+'brand/boostfit-on-dark.svg" alt="Boost Fit"><img class="bfl l" src="'+P+'brand/boostfit-on-light.svg" alt="Boost Fit">' : T(l[1]); return '<li><a href="'+l[0]+'"'+(l[2]===page?' aria-current="page"':'')+'>'+inner+'</a></li>'}).join('')+'</ul></nav>'+
    '<div class="r"><span class="lang">'+['ro','en','ru'].map(function(l){ return l===LANG?'<b>'+l.toUpperCase()+'</b>':'<a href="'+langHref(l)+'" hreflang="'+l+'">'+l.toUpperCase()+'</a>'; }).join(' · ')+'</span><a class="btn btn-brass btn-sm" href="#" data-reserve>'+T('Reserve a visit')+'</a><button class="mb" aria-label="'+T('Open menu')+'" aria-expanded="false"><i></i></button></div>';
  B.prepend(nav);
  var sheet=document.createElement('div'); sheet.className='sheet'; sheet.setAttribute('aria-hidden','true');
  sheet.innerHTML='<div class="top"><img src="'+P+'img/wm-nav-cream.png" alt="Boost Club"><button class="x" aria-label="'+T('Close menu')+'">✕</button></div><nav aria-label="Menu">'+
    [['index.html','Home']].concat(LINKS).concat([['how-it-works.html','How it works'],['reviews.html','Reviews'],['visit.html','Visit']]).map(function(l){return '<a href="'+l[0]+'">'+(l[2]==='fit'?'<img src="'+P+'brand/boostfit-on-dark.svg" alt="Boost Fit" style="height:.62em;width:auto;display:inline-block;vertical-align:baseline">':T(l[1]))+'</a>'}).join('')+
    '</nav><div class="bot"><span>'+['ro','en','ru'].map(function(l){ return l===LANG?'<b style="color:var(--brass)">'+l.toUpperCase()+'</b>':'<a href="'+langHref(l)+'" hreflang="'+l+'" style="text-decoration:none">'+l.toUpperCase()+'</a>'; }).join(' · ')+'</span><span>+40 726 205 752</span></div>';
  B.appendChild(sheet);
  var mb=nav.querySelector('.mb');
  setSheet=function(on){ sheet.classList.toggle('on',on); sheet.setAttribute('aria-hidden',!on); mb.setAttribute('aria-expanded',on); B.style.overflow=on?'hidden':''; }
  mb.addEventListener('click',function(){setSheet(true)}); sheet.querySelector('.x').addEventListener('click',function(){setSheet(false)});
  addEventListener('keydown',function(e){ if(e.key==='Escape') setSheet(false); });
  var solidAt=+(C.dataset.solidAt||(C.dataset.page==='home'?0.6:0.1));
  function onScroll(){ nav.classList.toggle('solid', scrollY>innerHeight*solidAt); }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  }

  // reserve bar (Remedy-style), a request: Gabriel confirms the slot on WhatsApp
  if(!C.dataset.norbar){
    var f=document.createElement('form'); f.className='rbar'; f.setAttribute('aria-label','Reserve a visit');
    var O=function(v){ return '<option value="'+v+'">'+T(v)+'</option>'; };
    f.innerHTML='<div class="mini">'+T('Free body scan')+'<small>'+T('25 to 30 min · we confirm on WhatsApp')+'</small></div>'+
      '<label><span>'+T('Experience')+'</span><select name="exp">'+['Free body scan + consultation','Shake at the club','Boost Fit, Sunday'].map(O).join('')+'</select></label>'+
      '<label><span>'+T('Day')+'</span><select name="day">'+['Tomorrow','Monday','Tuesday','Wednesday','Thursday','Friday','Sunday'].map(O).join('')+'</select></label>'+
      '<label><span>'+T('Time')+'</span><select name="time">'+['Morning','Midday','Evening'].map(O).join('')+'</select></label>'+
      '<label><span>'+T('Language')+'</span><select name="lang"><option>English</option><option>Română</option><option>Русский</option></select></label>'+
      '<button class="btn btn-brass" type="submit">'+T('Reserve')+' <span class="ar">→</span></button>';
    B.appendChild(f);
  }
  var toast=document.createElement('div'); toast.className='toast'; toast.setAttribute('role','status'); B.appendChild(toast);
  function say(m){ toast.textContent=m; toast.classList.add('on'); clearTimeout(say.t); say.t=setTimeout(function(){toast.classList.remove('on')},3800); }
  window.BC.say=say;
  document.addEventListener('submit',function(e){ var f=e.target; if(!f.matches('form.rbar,form[data-demo]')) return; e.preventDefault();
    // free scan -> the self-booking page (5 Nov 2026), with the picked day + part of the day pre-filtered; shake / Boost Fit keep the request form
    if(f.matches('.rbar')&&f.exp.selectedIndex===0){ location.href='book.html?part='+['am','mid','pm'][f.time.selectedIndex]+(f.day.selectedIndex>0?'&wd='+[0,1,2,3,4,5,7][f.day.selectedIndex]:''); return; }
    if(f.matches('.rbar')){ var d=f.day.value, t=f.time.value.toLowerCase(), x=f.exp.value; location.href='free-scan.html?when='+encodeURIComponent(T(d)+', '+T(f.time.value).toLowerCase()+(x.indexOf('Free')===0?'':' · '+T(x)))+'#book'; return; }
    else say(T('Concept only. Live, this sends the request and Gabriel messages you on WhatsApp.')); });
  document.addEventListener('click',function(e){ var a=e.target.closest('[data-reserve]'); if(!a) return; e.preventDefault(); setSheet(false);
    // every Reserve / Book button opens the self-booking page (5 Nov 2026); on that page it just scrolls to the picker
    if(document.getElementById('bkflow')){ document.getElementById('book').scrollIntoView({behavior:'smooth'}); return; }
    location.href='book.html'; });

  // footer
  if(!C.dataset.nofoot){
    var ft=document.createElement('footer'); ft.className='foot gut';
    ft.innerHTML='<div class="wrap"><div class="cols"><div><h4>'+T('Boost Club')+'</h4><p style="margin:0;opacity:.82">'+T('Strada Sevastopol 24, Sector 1, Bucharest')+'</p><p style="margin-top:14px;opacity:.82">+40 726 205 752</p><a href="'+WA+'" target="_blank" rel="noopener">WhatsApp</a></div>'+
      '<div><h4>'+T('The club')+'</h4><a href="free-scan.html">'+T('Free consultation')+'</a><a href="how-it-works.html">'+T('How it works')+'</a><a href="menu.html">'+T('Shake menu')+'</a><a href="boost-fit.html">'+T('Boost Fit')+'</a><a href="bring-a-friend.html">'+T('Bring a friend')+'</a></div>'+
      '<div><h4>'+T('People')+'</h4><a href="results.html">'+T('Results')+'</a><a href="reviews.html">'+T('Reviews')+'</a><a href="gabriel.html">'+T('Founder')+'</a><a href="visit.html">'+T('Visit')+'</a></div>'+
      '<div><h4>'+T('Hours')+'</h4><p style="margin:0;opacity:.82">'+T('Mon to Fri 07:00 to 20:00/21:00')+'<br>'+T('Saturday closed')+'<br>'+T('Sunday 10:00 to 18:00')+'</p><a class="bt" href="business.html"><span>'+T('Business partnership →')+'</span></a></div></div>'+
      '<img class="wm" src="'+P+'img/wordmark-cream-hd.png" alt="Boost Club">'+
      '<p class="fine">'+T('Independent Herbalife Distributor. Boost Club provides wellness guidance and educational consultations. Consultations do not diagnose, treat or replace medical care. Results vary from person to person.')+' · <a href="https://boostclub.ro/confidentialitate" target="_blank" rel="noopener" style="display:inline">'+T('Privacy')+'</a> · <a href="https://boostclub.ro/termeni" target="_blank" rel="noopener" style="display:inline">'+T('Terms')+'</a> · <a href="https://boostclub.ro/cookies" target="_blank" rel="noopener" style="display:inline">'+T('Cookies')+'</a></p></div>';
    B.appendChild(ft);
  }
  document.querySelectorAll('a.btn[href*="wa.me"]').forEach(function(a){ a.insertAdjacentHTML('afterbegin',WAICON); });
  document.querySelectorAll('a.btn[href*="instagram.com"]').forEach(function(a){ a.insertAdjacentHTML('afterbegin',IGICON); });
  document.querySelectorAll('.faq summary').forEach(function(s){ s.insertAdjacentHTML('beforeend','<span class="fl">'+LEAF+'</span>'); });
  if(/[?&]slots\b/.test(location.search)){ var sb=document.createElement('button'); sb.className='slotbtn'; sb.textContent=T('Show photo slots'); function tog(){ B.classList.toggle('slots'); sb.textContent=T(B.classList.contains('slots')?'Hide photo slots':'Show photo slots'); }
  sb.addEventListener('click',tog); B.appendChild(sb);
  var fl=document.querySelector('.foot .cols>div:nth-child(3)'); if(fl){ var bt=document.createElement('button'); bt.className='slotlink'; bt.textContent=T('Show photo slots'); bt.addEventListener('click',function(){ tog(); scrollTo({top:0,behavior:'smooth'}); }); fl.appendChild(bt); } }

  // shakes: every signature has its own loud colour; names and lines are the live menu's copy
  window.SHAKES=[
    {id:'pistachio-dream',name:'Pistachio Dream',d:'Vanilla and Dubai, pistachio and caramel.',bg:'#E7C548',ink:'#13201B',shot:'img/shot-pistachio.jpg',k:'mix'},
    {id:'berry-blush',name:'Berry Blush',d:'Raspberry and strawberry, white coconut on top.',bg:'#F2707A',ink:'#13201B',shot:'img/shot-berry.jpg',k:'mix'},
    {id:'mocha',name:'Mocha',d:'Coffee meets chocolate, hazelnut on top.',bg:'#C8643B',ink:'#0E1412',shot:'img/shot-mocha.jpg',k:'mix'},
    {id:'caramel-macchiato',name:'Caramel Macchiato',d:'Coffee and caramel. Simple, perfect.',bg:'#2F5BD3',ink:'#FFF8EE',shot:'img/shot-caramel.jpg',k:'single'},
    {id:'mint-mojito',name:'Mint Mojito',d:'Mint and vanilla, coconut. Fresh.',bg:'#E5432F',ink:'#0E1412',shot:'img/shot-mint.jpg',k:'mix'},
    {id:'cookies-cream',name:'Cookies & Cream',d:'Cookie and vanilla, chocolate on the walls.',bg:'#7A4FD1',ink:'#FFF8EE',shot:'img/shot-cookies.jpg',k:'mix'},
    {id:'strawberry-cheesecake',name:'Strawberry Cheesecake',d:'The cookie is the crust, the syrup is the berries.',bg:'#B5DA3F',ink:'#13201B',shot:'img/shot-strawberry.jpg',k:'single'},
    {id:'banoffee',name:'Banoffee',d:'Banana, caramel, crunchy almond.',bg:'#FF9F1C',ink:'#13201B',k:'single'},
    {id:'neapolitan',name:'Neapolitan',d:'Vanilla and strawberry with chocolate. Three in one.',bg:'#FF8DC7',ink:'#13201B',k:'mix'},
    {id:'chunky-monkey',name:'Chunky Monkey',d:'Banana and chocolate with caramel. Indulgent.',bg:'#1BA39C',ink:'#0E1412',k:'mix'},
    {id:'black-forest',name:'Black Forest',d:'Chocolate and raspberry, like the cake.',bg:'#FFC2D1',ink:'#13201B',k:'mix'},
    {id:'dubai',name:'Dubai',d:'Pistachio on Dubai Chocolate. Limited edition.',bg:'#1F7A4D',ink:'#FFF8EE',k:'single'}
  ];
  // href false: a plain card (the menu page itself), otherwise a link (default: the menu)
  window.wetCard=function(s,href){ var tg=href===false?'div':'a'; return '<'+tg+' class="wc"'+(href===false?'':' href="'+(href||P+'menu.html')+'"')+' style="--bg:'+s.bg+';--ink:'+s.ink+'"><img src="'+P+'img/wet/'+s.id+'-sm.jpg" srcset="'+P+'img/wet/'+s.id+'-sm.jpg 560w, '+P+'img/wet/'+s.id+'.jpg 1100w" sizes="(max-width:700px) 80vw, (max-width:1200px) 40vw, 420px" alt="'+s.name+'" loading="lazy"><span class="wc-l"><b>'+s.name+'</b><small>'+T(s.d)+'</small></span></'+tg+'>'; };
  window.cupTile=function(s){ return '<span class="cupwrap"><img class="cs" src="'+P+'cups/'+s.id+'.webp" alt="" aria-hidden="true"><img class="cup" src="'+P+'cups/'+s.id+'.webp" alt="'+s.name+'" loading="lazy"></span>'; };
  window.colourCards=function(el,list){ el.innerHTML=list.map(function(s,i){ return '<article class="ccard" style="background:'+s.bg+';color:'+s.ink+'"><div class="pic" data-slot="'+s.name+', bold colour"><img src="'+P+s.shot+'" alt="'+s.name+' shake on a bold background" loading="lazy"></div><div class="txt"><div class="k"><span>'+T('Signature')+' '+String(i+1).padStart(2,'0')+'</span><span>'+T('18 on the menu')+'</span></div><div class="nm loud">'+s.name.replace(' ','<br>')+'</div><p>'+T(s.d)+'</p><a class="go" href="menu.html">'+T('See it on the menu →')+'</a></div></article>'; }).join(''); };
  window.colourTiles=function(el,list){ el.innerHTML=list.map(function(s){ return '<a class="tile" data-k="'+s.k+'" href="#" style="background:'+s.bg+';color:'+s.ink+'">'+cupTile(s)+'<div class="n loud">'+s.name+'</div><div class="d">'+T(s.d)+'</div></a>'; }).join(''); };

  // segmental body scan, drawn the way a bioimpedance analyser shows it
  window.drawScan=function(el,opt){ opt=opt||{}; var m=opt.muscle||'#1F6B4F', f=opt.fat||'#D9B26A', base=opt.base||'rgba(127,127,127,.18)', ink=opt.ink||'currentColor';
    var segs=[{id:'head',x:74,y:6,w:52,h:58,r:26,fat:0},{id:'trunk',x:60,y:74,w:80,h:148,r:30,fat:.32,label:'Trunk',lx:178,ly:140},{id:'la',x:28,y:82,w:24,h:142,r:12,fat:.24,label:'Left arm',lx:-52,ly:110,left:1},{id:'ra',x:148,y:82,w:24,h:142,r:12,fat:.22},{id:'ll',x:64,y:230,w:32,h:182,r:16,fat:.26,label:'Left leg',lx:-52,ly:330,left:1},{id:'rl',x:104,y:230,w:32,h:182,r:16,fat:.25,label:'Right leg',lx:178,ly:330}];
    var u=Math.random().toString(36).slice(2,7);
    var s='<svg viewBox="-96 -10 392 440" role="img" aria-label="Example segmental body composition: lean and fat share by body segment"><defs>';
    segs.forEach(function(g){ s+='<clipPath id="c'+u+g.id+'"><rect x="'+g.x+'" y="'+g.y+'" width="'+g.w+'" height="'+g.h+'" rx="'+g.r+'"/></clipPath>'; });
    s+='<linearGradient id="bm'+u+'" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="'+f+'" stop-opacity="0"/><stop offset=".5" stop-color="'+f+'" stop-opacity=".9"/><stop offset="1" stop-color="'+f+'" stop-opacity="0"/></linearGradient></defs>';
    segs.forEach(function(g){ s+='<g clip-path="url(#c'+u+g.id+')"><rect x="'+g.x+'" y="'+g.y+'" width="'+g.w+'" height="'+g.h+'" fill="'+base+'"/>';
      if(g.fat){ var mh=g.h*(1-g.fat); s+='<rect class="fill" data-h="'+mh+'" x="'+g.x+'" y="'+(g.y+g.h)+'" width="'+g.w+'" height="0" fill="'+m+'"/><rect x="'+g.x+'" y="'+g.y+'" width="'+g.w+'" height="'+(g.h*g.fat)+'" fill="'+f+'" fill-opacity=".85"/>'; }
      s+='</g><rect x="'+g.x+'" y="'+g.y+'" width="'+g.w+'" height="'+g.h+'" rx="'+g.r+'" fill="none" stroke="'+ink+'" stroke-opacity=".35"/>';
      if(g.label){ var x2=g.left?g.x-4:g.x+g.w+4, y2=g.y+g.h*.45, tx=g.left?g.lx+42:g.lx-2, an=g.left?'end':'start';
        s+='<line x1="'+x2+'" y1="'+y2+'" x2="'+(g.left?g.lx+46:g.lx-6)+'" y2="'+g.ly+'" stroke="'+ink+'" stroke-opacity=".35"/><text x="'+tx+'" y="'+(g.ly-6)+'" text-anchor="'+an+'" font-size="10" font-weight="600" letter-spacing="1.4" fill="'+ink+'" fill-opacity=".7">'+g.label.toUpperCase()+'</text><text x="'+tx+'" y="'+(g.ly+10)+'" text-anchor="'+an+'" font-size="13" font-weight="600" fill="'+ink+'">'+Math.round((1-g.fat)*100)+'% lean</text>'; } });
    s+='<rect class="beam" x="10" y="0" width="180" height="22" fill="url(#bm'+u+')"/></svg>'; el.innerHTML=s;
    var run=function(){ el.querySelectorAll('.fill').forEach(function(r,i){ var h=+r.dataset.h, y0=+r.getAttribute('y'), t0=null; function st(t){ if(!t0)t0=t; var p=Math.min(1,(t-t0)/(1200+i*120)); p=1-Math.pow(1-p,3); r.setAttribute('height',h*p); r.setAttribute('y',y0-h*p); if(p<1) requestAnimationFrame(st);} requestAnimationFrame(st); }); };
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){ run(); return; }
    var io=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ run(); io.disconnect(); } },{threshold:.3}); io.observe(el); };

  // numbers count up once seen; they rest at their final value without script
  document.querySelectorAll('[data-count]').forEach(function(b){ var end=parseFloat(b.dataset.count), dec=(b.dataset.count.split('.')[1]||'').length, u=b.querySelector('small'); u=u?u.outerHTML:''; var pre=(b.firstChild&&b.firstChild.nodeType===3?(b.firstChild.textContent.match(/^[^\d]*/)||[''])[0]:'');
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var io=new IntersectionObserver(function(es){ if(!es[0].isIntersecting) return; io.disconnect(); var t0=null; function st(t){ if(!t0)t0=t; var p=Math.min(1,(t-t0)/1400); p=1-Math.pow(1-p,3); b.innerHTML=pre+(end*p).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,',')+u; if(p<1) requestAnimationFrame(st);} requestAnimationFrame(st); },{threshold:.4}); io.observe(b); });
})();
