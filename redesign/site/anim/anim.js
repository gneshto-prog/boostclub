/* BCAnim: the motion layer of the Colour Club site.
   build(el,opts)  scroll-built cup from the menu's real layer photos
   cycle(el,list,opts)  hero cup cycler, colour floods in as a drip
   drip(el,from,to,opts)  drip divider between two colour sections
   delights(root)  cup tilt on .tile, magnetic .btn-brass, sheen on cups
   Needs GSAP 3.12 + ScrollTrigger for scroll work; everything renders a static final state without them
   or under prefers-reduced-motion. Animated properties: transform, opacity, clip-path, mask-position. */
(function(){
var W=window,D=document,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,
  me=D.currentScript&&D.currentScript.src||'', BASE=me.replace(/[^\/]*$/,''), CUPS=BASE+'../cups/',
  FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
function G(){ return W.gsap&&W.ScrollTrigger&&(W.gsap.registerPlugin(W.ScrollTrigger),W.gsap); }
function t(v){ var d=W.BC_T; return v&&d&&d[v]||v; }
function cl(v){ return v<0?0:v>1?1:v; }
function seg(p,a,b){ return b<=a?(p>=b?1:0):cl((p-a)/(b-a)); }
var o3=function(t){ return 1-Math.pow(1-t,3); },
  io3=function(t){ return t<.5?4*t*t*t:1-Math.pow(2-2*t,3)/2; },
  back=function(t){ var c=1.7; return t<=0?0:1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2); };
function h(tag,cls,html){ var e=D.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
function near(el,fn){ if(!('IntersectionObserver' in W)) return fn();
  var io=new IntersectionObserver(function(es){ for(var i=0;i<es.length;i++) if(es[i].isIntersecting){ io.disconnect(); fn(); return; } },{rootMargin:'120% 0px'}); io.observe(el); }
function load(urls){ return Promise.all(urls.map(function(u){ return new Promise(function(r){ var i=new Image(); i.onload=function(){ (i.decode?i.decode():Promise.resolve()).then(r,r); }; i.onerror=r; i.src=u; }); })); }
// smoothed scroll progress: a scrubbed proxy tween, so the picture lags the wheel slightly, like it has weight
function scrub(trigger,fn,o){ var g=G(), s={p:0}; if(!g) return fn(1);
  return g.to(s,{p:1,ease:'none',onUpdate:function(){ fn(s.p); },scrollTrigger:Object.assign({trigger:trigger,start:'top top',end:'bottom bottom',scrub:.7,invalidateOnRefresh:true},o||{})}); }

/* ---------- drips: one shape generator for the flood, the divider and the syrup mask ---------- */
function drops(n,seed,w0,w1){ var r=seed||7,a=[]; function rnd(){ r=r*16807%2147483647; return r/2147483647; }
  for(var i=0;i<n;i++) a.push({x:(i+.5+(rnd()-.5)*.55)*100/n,w:w0+rnd()*(w1-w0),l:.3+rnd()*.7}); return a; }
// fill from the top down to edge y; each drop hangs l*L below it. k = width/height of the box, keeps tips round
function dpath(ds,y,L,k){ var f=function(v){ return Math.round(v*100)/100; }, s='M0 -1H100V'+f(y), px=100, sag=Math.min(L*.06,2.2)*k/Math.max(k,1);
  // between two drops the edge bellies down a little, like something thick
  var to=function(x){ s+='Q'+f((px+x)/2)+' '+f(y+sag)+' '+f(x)+' '+f(y); };
  for(var i=ds.length-1;i>=0;i--){ var d=ds[i], l=d.l*L, w=Math.min(d.w/2,l*.45/k), t=y+l, fl=w*.9, wy=w*k;
    if(l<.05) continue;
    to(d.x+w+fl); s+='Q'+f(d.x+w)+' '+f(y)+' '+f(d.x+w)+' '+f(y+fl*k)+'L'+f(d.x+w)+' '+f(Math.max(y+fl*k,t-wy))+
      'C'+f(d.x+w)+' '+f(t+wy*.35)+' '+f(d.x-w)+' '+f(t+wy*.35)+' '+f(d.x-w)+' '+f(Math.max(y+fl*k,t-wy))+
      'L'+f(d.x-w)+' '+f(y+fl*k)+'Q'+f(d.x-w)+' '+f(y)+' '+f(d.x-w-fl)+' '+f(y); px=d.x-w-fl; }
  to(0); return s+'Z'; }
function svg(cls){ var e=D.createElementNS('http://www.w3.org/2000/svg','svg'); e.setAttribute('class',cls); e.setAttribute('viewBox','0 0 100 100'); e.setAttribute('preserveAspectRatio','none'); e.setAttribute('aria-hidden','true');
  var p=D.createElementNS(e.namespaceURI,'path'); e.appendChild(p); return [e,p]; }
// syrup runs down the walls: a curtain mask (opaque top, dripping lower edge) slides down over the syrup layer
var CURTAIN='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 250" preserveAspectRatio="none"><path d="'+dpath(drops(9,3,3,7),100,26,.667).replace('M0 -1','M0 0')+'"/></svg>')+'")';

/* ---------- recipes: the live menu's signature builds ---------- */
var FL={vanilla:'Vanilla',choc:'Chocolate',cookie:'Cookie',latte:'Café latte',banana:'Banana',straw:'Strawberry',mint:'Mint',dubai:'Dubai',rasp:'Raspberry'},
  SY={scar:'Caramel',schoc:'Chocolate',shaz:'Hazelnut',sstraw:'Strawberry'},
  TP={tcoco:'Coconut',thaz:'Hazelnut',talm:'Almond',tpist:'Pistachio'},
  R={'pistachio-dream':'vanilla dubai|scar|tpist','berry-blush':'rasp straw|sstraw|tcoco',mocha:'latte choc|schoc|thaz','caramel-macchiato':'latte|scar|',
    'mint-mojito':'mint vanilla||tcoco','cookies-cream':'cookie vanilla|schoc|','strawberry-cheesecake':'cookie|sstraw|',banoffee:'banana|scar|talm',
    neapolitan:'vanilla straw|schoc|','chunky-monkey':'choc banana|scar|thaz','black-forest':'choc rasp|schoc|tcoco',dubai:'dubai|schoc|tpist'};
function sp(v){ return v?v.split(' '):[]; }
function recipe(o){ if(o.recipe) return o.recipe; var r=(R[o.shake]||'vanilla||').split('|'); return {b:sp(r[0]),s:sp(r[1]),t:sp(r[2])}; }
function shakeOf(id){ var l=W.SHAKES||[]; for(var i=0;i<l.length;i++) if(l[i].id===id) return l[i]; return {id:id,name:id,bg:'#E7C548',ink:'#13201B'}; }
function nm(map,a,none){ return a.length?a.map(function(k){ return t(map[k]||k); }).join(' + '):t(none); }

/* ---------- 1. build ---------- */
function build(el,o){ o=o||{}; o.shake=o.shake||'pistachio-dream';
  var S=o.data||shakeOf(o.shake), r=recipe(o), mix=r.b.length>1, idx=(W.SHAKES||[]).indexOf(S)+1;
  var steps=[[t('Base'),nm(FL,r.b),r.b.length?1:0],[t('Syrup'),nm(SY,r.s,'No syrup'),r.s.length],[t('Topping'),nm(TP,r.t,'No topping'),r.t.length]];
  el.classList.add('bca-build'); el.style.setProperty('--bca-bg',S.bg); el.style.setProperty('--bca-ink',S.ink);
  if(o.length) el.style.setProperty('--bca-len',o.length);
  var st=h('div','bca-stage'); st.setAttribute('aria-label',S.name);
  st.innerHTML='<div class="bca-flood"></div>'+
   '<div class="bca-copy"><span class="bca-eye">'+t(o.eyebrow||'Make it yours')+'</span>'+
   '<h2 class="bca-h loud"><span class="bca-h1">'+t(o.title||'Build it.')+'</span><span class="bca-h2" aria-hidden="true">'+S.name.replace(/ (?=\S+$)/,'<br>')+'</span></h2>'+
   '<p class="bca-lead"><span>'+t(o.lead||'One flavour, or two mixed half and half. Syrup down the walls, then the topping. Show the ticket at the counter.')+'</span><span>'+t(S.d||'')+'</span></p>'+
   '<ol class="bca-steps">'+steps.map(function(s,i){ return '<li><b>0'+(i+1)+'</b><span>'+s[0]+'</span><em>'+s[1]+'</em><i></i></li>'; }).join('')+'</ol></div>'+
   '<div class="bca-cupbox"><div class="bca-cup"><span class="bca-floor"></span><img class="bca-e" alt="">'+
   '<div class="bca-f1"><img alt=""></div><div class="bca-f2"><img class="bca-mix" alt=""></div>'+
   r.s.map(function(){ return '<img class="bca-s" alt="">'; }).join('')+'<div class="bca-tw">'+r.t.map(function(k,i){ return '<img class="bca-t'+(i?' bca-top2':'')+'" alt="">'; }).join('')+'</div>'+
   '<span class="bca-lsh"></span><img class="bca-lb" alt=""><i class="bca-sheen"></i></div></div>'+
   '<div class="bca-num" aria-hidden="true"><div class="bca-nr">'+steps.map(function(s,i){ return '<div><b class="loud">0'+(i+1)+'</b><span>'+s[0]+' · '+s[1]+'</span></div>'; }).join('')+'</div></div>'+
   '<div class="bca-ticket" role="note"><div class="bca-tk"><span>'+t('Your ticket')+'</span><span>'+(idx?t('Signature')+' '+String(idx).padStart(2,'0'):t('Build'))+'</span></div><div class="bca-tn loud">'+S.name+'</div>'+
   '<dl>'+steps.map(function(s){ return '<div><dt>'+s[0]+'</dt><dd>'+s[1]+'</dd></div>'; }).join('')+'</dl>'+
   '<p class="bca-t1l">'+steps.map(function(s){ return s[2]?s[1]:''; }).filter(Boolean).join(' · ')+'</p><div class="bca-tf">'+t(o.cta||'Show it at the counter')+'</div></div>';
  el.innerHTML=''; el.appendChild(st);
  var q=function(s){ return st.querySelector(s); }, qa=function(s){ return st.querySelectorAll(s); },
    cup=q('.bca-cup'), f1=q('.bca-f1'), f2=q('.bca-f2'), mixI=q('.bca-mix'), sy=qa('.bca-s'), tp=qa('.bca-t'), lb=q('.bca-lb'), lsh=q('.bca-lsh'),
    fl=q('.bca-flood'), h1=q('.bca-h1'), h2=q('.bca-h2'), tk=q('.bca-ticket'), nr=q('.bca-nr'), nb=q('.bca-num'), lis=qa('.bca-steps li'), bars=qa('.bca-steps i'), sh=q('.bca-sheen');
  var src={e:BASE+'cup-empty.webp',f1:BASE+'f-'+r.b[0]+'.webp',f2:BASE+'f-'+(r.b[1]||r.b[0])+'.webp',lb:BASE+'label.webp'};
  var urls=[src.e,src.f1,src.lb,BASE+'mask-mix2.png',BASE+'mask-top2.png'].concat(mix?[src.f2]:[],r.s.map(function(k){ return BASE+k+'.webp'; }),r.t.map(function(k){ return BASE+k+'.webp'; }));
  sy.forEach(function(e){ e.style.webkitMaskImage=e.style.maskImage=CURTAIN; });
  if(!mix) f2.style.display='none';
  // timeline: the three steps share the scroll; an empty step gets a short beat so the count still reads 01 02 03
  var len=[.04,mix?1.5:1,r.s.length?.95:.3,r.t.length?.6:.3,.4,.62,.18], tot=len.reduce(function(a,b){ return a+b; }), T=[], acc=0;
  len.forEach(function(v){ T.push(acc/tot); acc+=v; }); T.push(1);
  var wave=function(L,ph){ var y=94-L*101, a=1.3*Math.sin(Math.PI*L), pts=[]; for(var i=12;i>=0;i--) pts.push(i*100/12+'% '+(y+a*Math.sin(i/12*7+ph)).toFixed(2)+'%'); return 'polygon(0% 100%,100% 100%,'+pts.join(',')+')'; };
  var last=-1;
  function render(p){ if(Math.abs(p-last)<1e-4) return; last=p;
    var b=seg(p,T[1],T[2]), s=seg(p,T[2],T[3]), t=seg(p,T[3],T[4]), l=seg(p,T[4],T[5]), f=seg(p,T[5],T[6]);
    // 01 base: rises from the bottom with a soft slosh; a second flavour pours over it and swirls into the mix mask
    var L1=o3(mix?seg(b,0,.55):b); f1.style.clipPath=f1.style.webkitClipPath=L1>=1?'none':wave(L1,L1*9);
    if(mix){ var L2=o3(seg(b,.38,1)); f2.style.clipPath=f2.style.webkitClipPath=L2>=1?'none':wave(L2,2-L2*11); mixI.style.webkitMaskPosition=mixI.style.maskPosition=(io3(seg(b,.38,1))*100).toFixed(2)+'% 0'; }
    // 02 syrup runs down the walls
    sy.forEach(function(e,i){ var v=io3(seg(s,i*.3,i*.3+(sy.length>1?.7:1))); e.style.webkitMaskPosition=e.style.maskPosition='0 '+((1-v)*93.4).toFixed(2)+'%';
      e.style.transform=(i?'scaleX(-1) ':'')+'translateY('+(-(1-v)*2.5).toFixed(2)+'%)'; e.style.opacity=v>0?1:0; });
    // 03 topping drops and lands with a small bounce
    tp.forEach(function(e,i){ var v=seg(t,i*.25,i*.25+(tp.length>1?.75:1)); e.style.transform='translateY('+(-(1-back(v))*13).toFixed(2)+'%)'; e.style.opacity=cl(v*3); });
    // the sticker settles: lands from above with a shadow that tightens as it touches the cup
    var e=back(l); lb.style.transform='translate('+((1-e)*3).toFixed(2)+'%,'+(-(1-e)*7).toFixed(2)+'%) rotate('+(-(1-e)*14).toFixed(2)+'deg) scale('+(1+(1-e)*.28).toFixed(3)+')'; lb.style.opacity=cl(l*4);
    lsh.style.opacity=(seg(l,0,.2)*(1-seg(l,.75,1))*.5).toFixed(3); lsh.style.transform='translate('+((1-l)*6).toFixed(2)+'%,'+((1-l)*8).toFixed(2)+'%) scale('+(1.15-.15*l).toFixed(3)+')';
    // finale: the shake's colour floods out from the cup, the name takes the headline, the ticket comes up
    var g=io3(f); fl.style.clipPath=fl.style.webkitClipPath=g<=0?'circle(0% at 50% 56%)':'circle('+(g*135).toFixed(2)+'% at 50% 56%)';
    st.classList.toggle('bca-done',f>.42);
    var hh=io3(seg(f,.18,.7)); h1.style.transform='translateY('+(-hh*105).toFixed(2)+'%)'; h2.style.transform='translateY('+((1-hh)*105).toFixed(2)+'%)'; h1.style.opacity=1-hh; h2.style.opacity=hh;
    var k=o3(seg(f,.45,1)); tk.style.opacity=k; tk.style.transform='translateY('+((1-k)*24).toFixed(1)+'px) rotate('+((1-k)*-3).toFixed(2)+'deg)'; tk.style.visibility=k>0?'visible':'hidden';
    cup.style.transform='translateY('+(-io3(seg(f,0,.6))*1.5).toFixed(2)+'%)';
    sh.style.setProperty('--sx',(-130+io3(seg(f,.35,1))*260).toFixed(1)+'%');
    var nf=seg(p,T[2]-.025,T[2]+.025)+seg(p,T[3]-.025,T[3]+.025); nr.style.transform='translateY('+(-io3(nf%1)*100/3-Math.floor(nf)*100/3).toFixed(3)+'%)';
    nb.style.opacity=(seg(p,T[1]-.03,T[1])*(1-seg(f,0,.4))).toFixed(3);
    // step rail
    var ph=[b,s,t], act=p<T[2]?0:p<T[3]?1:p<T[4]?2:3;
    for(var i=0;i<3;i++){ bars[i].style.transform='scaleX('+ph[i].toFixed(3)+')'; lis[i].className=i===act?'on':i<act?'ok':''; }
  }
  // long names (Strawberry Cheesecake) shrink to the copy column instead of being clipped
  function fit(){ h2.style.fontSize=''; var cw=h2.parentNode.clientWidth, w=h2.offsetWidth; if(w>cw) h2.style.fontSize=(parseFloat(getComputedStyle(h2).fontSize)*cw/w*.98).toFixed(1)+'px'; }
  fit(); D.fonts&&D.fonts.ready.then(fit); addEventListener('resize',fit);
  var api={el:el,render:render,shake:S};
  if(RM||!G()){ el.classList.add('bca-static'); load(urls).then(function(){ set(); render(1); }); render(1); set(); return api; }
  render(0);
  function set(){ q('.bca-e').src=src.e; f1.firstChild.src=src.f1; mixI.src=src.f2; lb.src=src.lb;
    sy.forEach(function(e,i){ e.src=BASE+r.s[i]+'.webp'; }); tp.forEach(function(e,i){ e.src=BASE+r.t[i]+'.webp'; }); }
  near(el,function(){ load(urls).then(function(){ set(); last=-1; api.tween=scrub(el,render); }); });
  return api;
}

/* ---------- 2. cycle ---------- */
function cycle(el,list,o){ o=o||{}; list=list||W.SHAKES||[]; var n=list.length; if(!n) return;
  var box=o.cups||el, sv=svg('bca-flood'), path=sv[1], ds=drops(o.drops||9,11,3,8), k=1, i=o.start||0, busy=0, hold=0, timer, vis=1, A, B;
  el.classList.add('bca-cyc'); el.insertBefore(sv[0],el.firstChild); box.classList.add('bca-cups');
  function slot(){ var s=h('div','bca-slot','<span class="bca-floor"></span><img alt=""><i class="bca-sheen"></i>'); box.appendChild(s); return s; }
  A=slot(); B=slot();
  function put(s,x){ var im=s.querySelector('img'); im.src=CUPS+x.id+'.webp'; im.alt=x.name; s.querySelector('.bca-sheen').style.setProperty('--m','url("'+CUPS+x.id+'.webp")'); }
  function size(){ k=el.clientWidth/Math.max(1,el.clientHeight); }
  function tf(s,c,dir){ s.style.transform='translate3d('+(dir*c*24).toFixed(2)+'%,'+(Math.abs(c)*5).toFixed(2)+'%,0) rotateY('+(dir*c*-30).toFixed(2)+'deg) rotateZ('+(dir*c*4).toFixed(2)+'deg) scale('+(1-Math.abs(c)*.12).toFixed(3)+')'; }
  function paint(a,b,p){ var e=io3(p), c=io3(seg(p,.12,.92));
    el.style.backgroundColor=list[a].bg; path.setAttribute('fill',list[b].bg);
    path.setAttribute('d',p<=0?'':dpath(ds,-48+152*e,14+30*Math.sin(Math.PI*e),k));
    tf(A,-c,1); A.style.opacity=(1-seg(c,.1,.6)).toFixed(3);
    tf(B,1-c,1); B.style.opacity=seg(c,.04,.4).toFixed(3);
    B.querySelector('.bca-sheen').style.setProperty('--sx',(-130+seg(p,.5,1)*260).toFixed(1)+'%');
    var ink=p>.5?list[b]:list[a]; if(el.dataset.ink!==ink.id){ el.dataset.ink=ink.id; el.style.color=ink.ink; o.onChange&&o.onChange(ink,list.indexOf(ink)); }
  }
  function rest(a){ i=a; put(A,list[a]); A.style.transform='none'; A.style.opacity=1; B.style.opacity=0; el.style.backgroundColor=list[a].bg; path.setAttribute('d','');
    var ink=list[a]; if(el.dataset.ink!==ink.id){ el.dataset.ink=ink.id; el.style.color=ink.ink; o.onChange&&o.onChange(ink,a); } }
  function go(b){ var g=G()||W.gsap; b=(b+n)%n; if(busy||b===i) return; if(!g||RM){ rest(b); return; }
    busy=1; put(B,list[b]); var s={p:0}, a=i;
    g.to(s,{p:1,duration:o.duration||1.35,ease:'none',onUpdate:function(){ paint(a,b,s.p); },onComplete:function(){ busy=0; rest(b); sweep(A); next(); }}); }
  function next(){ clearTimeout(timer); if(!o.scroll&&!RM&&!hold&&vis&&!D.hidden) timer=setTimeout(function(){ go(i+1); },o.interval||2600); }
  function pause(){ hold=1; clearTimeout(timer); } function play(){ hold=0; next(); }
  size(); addEventListener('resize',size); rest(i);
  var api={el:el,go:go,pause:pause,play:play,get index(){ return i; }};
  if(RM) return api;
  near(el,function(){ load(list.map(function(x){ return CUPS+x.id+'.webp'; })).then(function(){
    if(o.scroll){ var lastI=-1; scrub(o.scroll===true?el:o.scroll,function(p){ var f=p*(n-1), a=Math.min(n-2,Math.floor(f)), q=seg(f-a,.18,.82);
        if(a!==lastI){ lastI=a; put(A,list[a]); put(B,list[a+1]); } i=a; paint(a,a+1,q); }); return; }
    ['pointerenter','focusin'].forEach(function(t){ el.addEventListener(t,pause); }); el.addEventListener('pointerleave',play);
    el.addEventListener('focusout',function(e){ if(!el.contains(e.relatedTarget)) play(); });
    D.addEventListener('visibilitychange',next);
    new IntersectionObserver(function(es){ vis=es[0].isIntersecting; vis?next():clearTimeout(timer); }).observe(el); next(); }); });
  return api;
}

/* ---------- 3. drip divider ---------- */
function drip(el,from,to,o){ o=o||{}; var sv=svg('bca-dsvg'), path=sv[1], ds=drops(o.drops||(innerWidth<700?9:16),o.seed||5,1.1,3.2), k=1;
  el.classList.add('bca-drip'); el.style.backgroundColor=to; path.setAttribute('fill',from); el.appendChild(sv[0]); el.setAttribute('aria-hidden','true');
  var cur=RM?1:0;
  function size(){ k=el.clientWidth/Math.max(1,el.clientHeight); draw(cur); }
  function draw(p){ cur=p; var e=o3(p); path.setAttribute('d',dpath(ds,4+e*10,8+e*80,k)); }
  size(); addEventListener('resize',size);
  if(!RM&&G()) near(el,function(){ var s={p:0}; G().to(s,{p:1,ease:'none',onUpdate:function(){ draw(s.p); },scrollTrigger:{trigger:el,start:'top bottom',end:'bottom 35%',scrub:.6}}); });
  else draw(1);
  return {el:el,set:function(f,t){ if(f) path.setAttribute('fill',f); if(t) el.style.backgroundColor=t; }};
}

/* ---------- 4. small delights ---------- */
function sweep(s){ var e=s&&s.querySelector('.bca-sheen'); if(!e) return; e.classList.remove('bca-go'); void e.offsetWidth; e.classList.add('bca-go'); }
function delights(root){ root=root||D; if(RM) return;
  // a sheen inside every cup photo, masked by the cup itself
  root.querySelectorAll('.cupwrap').forEach(function(w){ if(w.querySelector('.bca-sheen')) return; var im=w.querySelector('.cup'); if(!im) return;
    var s=h('i','bca-sheen'); s.style.setProperty('--m','url("'+im.src+'")'); w.appendChild(s); });
  if(!FINE) return;
  // tiles: the cup leans toward the pointer (max 8 degrees), the sheen runs once on enter
  root.querySelectorAll('.tile').forEach(function(t){ var im=t.querySelector('.cup'), sh=t.querySelector('.bca-sheen'), tx=0,ty=0,x=0,y=0,raf=0; if(!im) return;
    function tick(){ x+=(tx-x)*.14; y+=(ty-y)*.14; var v='perspective(700px) rotateY('+(x*8).toFixed(2)+'deg) rotateX('+(-y*6).toFixed(2)+'deg)'; im.style.transform=v; if(sh) sh.style.transform=v;
      raf=Math.abs(tx-x)+Math.abs(ty-y)>.002?requestAnimationFrame(tick):0; }
    t.addEventListener('pointermove',function(e){ var r=t.getBoundingClientRect(); tx=(e.clientX-r.left)/r.width*2-1; ty=(e.clientY-r.top)/r.height*2-1; if(!raf) raf=requestAnimationFrame(tick); });
    t.addEventListener('pointerenter',function(){ sweep(t); });
    t.addEventListener('pointerleave',function(){ tx=ty=0; if(!raf) raf=requestAnimationFrame(tick); }); });
  // brass buttons drift toward the pointer when it comes close, then spring back
  var g=W.gsap; if(!g) return; var btns=[].slice.call(root.querySelectorAll('.btn-brass')), px=-1e4, py=0, on=0;
  var mv=btns.map(function(b){ return {b:b,x:g.quickTo(b,'x',{duration:.5,ease:'power3.out'}),y:g.quickTo(b,'y',{duration:.5,ease:'power3.out'}),m:0}; });
  function frame(){ on=0; var rs=mv.map(function(m){ return m.b.getBoundingClientRect(); });
    mv.forEach(function(m,i){ var r=rs[i]; if(!r.width) return; var cx=r.left+r.width/2-(g.getProperty(m.b,'x')||0), cy=r.top+r.height/2-(g.getProperty(m.b,'y')||0), dx=px-cx, dy=py-cy,
      R=Math.max(r.width,r.height)*.5+48, d=Math.hypot(dx,dy);
      if(d<R){ var f=1-d/R*.6; m.x(dx*.28*f); m.y(dy*.38*f); m.m=1; } else if(m.m){ m.m=0; m.x(0); m.y(0); } }); }
  addEventListener('pointermove',function(e){ if(e.pointerType!=='mouse') return; px=e.clientX; py=e.clientY; if(!on){ on=1; requestAnimationFrame(frame); } },{passive:true});
}

W.BCAnim={build:build,cycle:cycle,drip:drip,delights:delights,sweep:sweep,recipes:R,base:BASE};
})();
