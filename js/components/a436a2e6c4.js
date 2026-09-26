const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* progress bar */
const prog=document.getElementById('progress');
/* header shrink + sticky cta show/hide */
const topbar=document.getElementById('topbar');
const sticky=document.getElementById('stickycta');
let ticking=false;
function onScroll(){
  const h=document.documentElement, y=h.scrollTop, max=h.scrollHeight-h.clientHeight;
  prog.style.width=(y/max*100)+'%';
  topbar.classList.toggle('shrink',y>40);
  const nearFooter=(h.scrollHeight-(y+innerHeight))<420;
  sticky.classList.toggle('show', y>560 && !nearFooter);
  stepScroll(y);
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});

/* ---- unified reveal system (staggered) ---- */
if(REDUCE){
  document.querySelectorAll('.reveal,.clipin,.pointlist .p').forEach(e=>e.classList.add('in'));
}else{
  try{
    const sequences=document.querySelectorAll('[data-seq]');
    const io=new IntersectionObserver((es)=>{es.forEach(e=>{
      if(e.isIntersecting){
        const items=e.target.querySelectorAll('.reveal,.clipin,.pointlist .p');
        items.forEach((el,i)=>{el.style.setProperty('--rd',(i*70)+'ms');el.classList.add('in');});
        if(e.target.matches('.reveal,.clipin'))e.target.classList.add('in');
        io.unobserve(e.target);
      }
    })},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    document.documentElement.classList.add('motion-ready');
    sequences.forEach(s=>io.observe(s));
  }catch(error){
    document.documentElement.classList.remove('motion-ready');
    document.querySelectorAll('.reveal,.clipin,.pointlist .p').forEach(e=>e.classList.add('in'));
  }
}

/* ---- count-up ---- */
function countUp(el){
  const t=+el.dataset.count, dur=1100, st=performance.now();
  (function tick(now){const p=Math.min(1,(now-st)/dur);el.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick);})(st);
}
document.querySelectorAll('[data-count]').forEach(el=>{
  if(REDUCE){el.textContent=el.dataset.count;return;}
  const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){countUp(el);o.disconnect();}}),{threshold:.6});
  o.observe(el);
});

/* ---- magnetic buttons (desktop pointer only) ---- */
if(matchMedia('(hover:hover) and (pointer:fine)').matches && !REDUCE){
  document.querySelectorAll('.btn-mag').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*0.18}px,${(e.clientY-r.top-r.height/2)*0.3}px)`;});
    b.addEventListener('mouseleave',()=>{b.style.transform='';});
  });
}

/* ---- steps: scroll-drawn progress line ---- */
const steps=document.getElementById('steps');
function stepScroll(){
  if(!steps||REDUCE)return;
  const r=steps.getBoundingClientRect(), start=innerHeight*0.82;
  let p=(start-r.top)/(r.height*0.9);
  p=Math.max(0,Math.min(1,p));
  steps.style.setProperty('--p',p.toFixed(3));
}
stepScroll();

/* ---- FAQ accordion (accessible, animated) ---- */
document.querySelectorAll('#faq .qa').forEach(qa=>{
  const btn=qa.querySelector('.q');
  btn.addEventListener('click',()=>{
    const open=qa.classList.toggle('open');
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
});

/* ---- who: persona chips ---- */
const chips=document.querySelectorAll('.chip');
const pdetail=document.getElementById('pdetail');
const pcta=document.getElementById('pcta');
chips.forEach(chip=>{
  chip.addEventListener('click',()=>{
    const already=chip.getAttribute('aria-pressed')==='true';
    chips.forEach(c=>c.setAttribute('aria-pressed','false'));
    if(already){pdetail.innerHTML='<span class="hint">Select one above — it should sound like a description of you.</span>';pcta.classList.remove('show');return;}
    chip.setAttribute('aria-pressed','true');
    pdetail.innerHTML=chip.dataset.detail+' <b>'+(chip.dataset.r||'')+'</b>';
    pcta.href='https://wa.me/40726205752?text='+encodeURIComponent("Hi Gabi — this sounds like me ("+chip.textContent.trim()+"). I'd like to start with a conversation.");
    pcta.classList.add('show');
  });
});

/* ---- interactive world map ---- */
const AVAILABLE=new Set([
 "United States of America","Canada","Mexico","Guatemala","Honduras","El Salvador","Nicaragua","Costa Rica","Panama","Dominican Republic","Jamaica","Trinidad and Tobago","Puerto Rico","Colombia","Venezuela","Ecuador","Peru","Bolivia","Brazil","Chile","Argentina","Uruguay","Paraguay",
 "United Kingdom","Ireland","France","Spain","Portugal","Italy","Germany","Netherlands","Belgium","Switzerland","Austria","Denmark","Sweden","Norway","Finland","Iceland","Poland","Czechia","Slovakia","Hungary","Romania","Bulgaria","Greece","Croatia","Slovenia","Serbia","Bosnia and Herzegovina","North Macedonia","Estonia","Latvia","Lithuania","Ukraine","Belarus","Moldova","Russia","Cyprus","Kazakhstan","Kyrgyzstan","Uzbekistan","Mongolia","Georgia","Armenia","Azerbaijan",
 "Israel","Turkey","Lebanon","South Africa","Zambia","Botswana","Namibia","Ghana","eSwatini","Lesotho",
 "India","Japan","South Korea","Taiwan","Philippines","Vietnam","Thailand","Cambodia","Malaysia","Indonesia","Australia","New Zealand"
]);
const WA_COUNTRY=n=>`https://wa.me/40726205752?text=${encodeURIComponent("Hi Gabi, I'm in "+n+". I'd like to book a call about building there.")}`;

function initMap(){
  const wrap=document.getElementById('mapwrap');
  const svg=d3.select('#worldmap'), W=960,H=480;
  const tip=document.getElementById('maptip');
  const statusEl=document.getElementById('mapstatus');
  const ctaBox=document.getElementById('mapcta'), ctaLink=document.getElementById('mapctalink');
  const proj=d3.geoNaturalEarth1(), pathGen=d3.geoPath(proj);
  d3.json("../vendor/countries-110m.json").catch(function(){return d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");}).then(topo=>{
    wrap.classList.remove('loading');
    const feats=topojson.feature(topo,topo.objects.countries).features;
    proj.fitSize([W,H],{type:"Sphere"});
    const view=svg.append("g").attr("id","mapview");
    view.append("path").attr("class","sphere").attr("d",pathGen({type:"Sphere"}));
    const byName={};
    const paths=view.append("g").selectAll("path").data(feats).join("path")
      .attr("d",pathGen)
      .attr("class",d=>AVAILABLE.has(d.properties.name)?"c on":"c off")
      .each(function(d){byName[d.properties.name.toLowerCase()]=this;})
      .on("mousemove",function(ev,d){
        const on=AVAILABLE.has(d.properties.name), r=wrap.getBoundingClientRect();
        tip.style.left=(ev.clientX-r.left)+"px";tip.style.top=(ev.clientY-r.top)+"px";
        tip.innerHTML=on?d.properties.name+' · <span class="avail">Available to build</span>':d.properties.name+' · Not currently available';
        tip.classList.add("on");
      })
      .on("mouseleave",()=>tip.classList.remove("on"))
      .on("click",(ev,d)=>select(d.properties.name));
    /* staggered west→east fill-in */
    if(!REDUCE){
      const on=paths.filter(d=>AVAILABLE.has(d.properties.name));
      on.style("opacity",0).transition().delay((d)=>{const c=pathGen.centroid(d);return isNaN(c[0])?0:c[0]*1.1;}).duration(500).style("opacity",1);
    }
    /* origin -> country arc layer (under the pin) */
    const arcLayer=view.append("g").attr("class","arclayer");
    const BUC=proj([26.1025,44.4268]);
    function drawArc(dest){
      arcLayer.selectAll("*").remove();
      if(!dest||isNaN(dest[0]))return;
      const p0=BUC,p1=dest,mx=(p0[0]+p1[0])/2,my=(p0[1]+p1[1])/2;
      const dx=p1[0]-p0[0],dy=p1[1]-p0[1],dist=Math.hypot(dx,dy)||1;
      const lift=Math.min(90,dist*0.3),nx=-dy/dist,ny=dx/dist;
      const cx=mx+nx*lift,cy=my+ny*lift-Math.abs(lift)*0.15;
      const path=arcLayer.append("path").attr("class","arc").attr("d",`M${p0[0]},${p0[1]} Q${cx},${cy} ${p1[0]},${p1[1]}`);
      const dot=arcLayer.append("circle").attr("class","arc-dot").attr("r",3).attr("transform",`translate(${p1[0]},${p1[1]})`);
      if(!REDUCE){
        const len=path.node().getTotalLength();
        path.attr("stroke-dasharray",len).attr("stroke-dashoffset",len).transition().duration(750).ease(d3.easeCubicOut).attr("stroke-dashoffset",0);
        dot.attr("opacity",0).transition().delay(600).duration(220).attr("opacity",1);
      }
    }
    /* Bucharest flagship */
    const p=proj([26.1025,44.4268]);
    const g=view.append("g").attr("transform",`translate(${p[0]},${p[1]})`);
    g.append("circle").attr("class","pin-halo").attr("r",5);
    g.append("circle").attr("class","pin-core").attr("r",4);
    g.append("text").attr("class","pin-label").attr("x",9).attr("y",3.5).text("Boost Club");
    g.style("cursor","pointer").on("click",()=>select("Romania"))
     .on("mousemove",function(ev){const r=wrap.getBoundingClientRect();tip.style.left=(ev.clientX-r.left)+"px";tip.style.top=(ev.clientY-r.top)+"px";tip.innerHTML='Boost Club · Sevastopol 24, Bucharest';tip.classList.add("on");})
     .on("mouseleave",()=>tip.classList.remove("on"));

    /* search datalist */
    const dl=document.getElementById('countrylist');
    feats.map(f=>f.properties.name).sort().forEach(n=>{const o=document.createElement('option');o.value=n;dl.appendChild(o);});
    const search=document.getElementById('mapsearch');
    const run=()=>{const v=search.value.trim();if(v)select(v);};
    search.addEventListener('change',run);
    search.addEventListener('keydown',e=>{if(e.key==='Enter')run();});
    document.getElementById('mapreset').addEventListener('click',resetView);

    function zoomTo(node){
      const d=d3.select(node).datum();
      const [[x0,y0],[x1,y1]]=pathGen.bounds(d);
      const cx=(x0+x1)/2, cy=(y0+y1)/2;
      const k=Math.max(1.6,Math.min(4,0.55*Math.min(W/(x1-x0||1),H/(y1-y0||1))));
      const t=`translate(${W/2},${H/2}) scale(${k}) translate(${-cx},${-cy})`;
      if(REDUCE)view.attr("transform",t); else view.transition().duration(650).attr("transform",t);
    }
    function resetView(){
      paths.classed("sel",false).classed("dim",false);
      arcLayer.selectAll("*").remove();
      if(REDUCE)view.attr("transform",null); else view.transition().duration(500).attr("transform",null);
      statusEl.innerHTML="Type your country, or tap the map, to check if the opportunity is available there.";
      ctaBox.hidden=true;
      document.getElementById('mapsearch').value="";
    }
    function select(name){
      const node=byName[name.toLowerCase()];
      if(!node){statusEl.textContent="Couldn't find that country — try the exact name, or tap it on the map.";return;}
      const d=d3.select(node).datum(), nm=d.properties.name, on=AVAILABLE.has(nm);
      paths.classed("sel",false).classed("dim",true);
      d3.select(node).classed("sel",true).classed("dim",false).raise();
      zoomTo(node);
      if(on){
        drawArc(pathGen.centroid(d));
        statusEl.innerHTML='<b>'+nm+'</b> — <span class="ok">✓ Available to build</span> · <span class="origin-note">a line from <b>Node 00 · Bucharest</b> to you</span>';
        ctaLink.href=WA_COUNTRY(nm);
        ctaLink.firstChild.textContent="Book a call about "+nm+" ";
        ctaBox.hidden=false;
        if(window.__cfgSetCountry)window.__cfgSetCountry(nm);
        if(window.__cfgAwait){window.__cfgAwait=false;var wsec=document.getElementById('where');if(wsec)setTimeout(function(){wsec.scrollIntoView({behavior:'smooth'});},550);}
      }else{
        arcLayer.selectAll("*").remove();
        statusEl.innerHTML='<b>'+nm+'</b> — not currently available. Herbalife is in 90+ countries and still expanding.';
        ctaBox.hidden=true;
      }
    }
    window.__mapSelect=select;
  }).catch(()=>{document.getElementById('map-fallback').style.display='block';document.getElementById('worldmap').style.display='none';wrap.classList.remove('loading');});
}
/* ---- lazy-load map libraries when the map nears view (vendor/ first, CDN fallback) ---- */
(function(){
  var mapSec=document.querySelector('.map-sec'); if(!mapSec)return;
  var started=false;
  function loadScript(list,cb){var i=0;(function next(){if(i>=list.length){cb();return;}var sc=document.createElement('script');sc.src=list[i++];sc.onload=function(){cb();};sc.onerror=next;document.head.appendChild(sc);})();}
  function ensure(cb){
    if(window.d3&&window.topojson){cb();return;}
    loadScript(['../vendor/d3.min.js','https://cdn.jsdelivr.net/npm/d3@7'],function(){
      loadScript(['../vendor/topojson-client.min.js','https://cdn.jsdelivr.net/npm/topojson-client@3'],cb);
    });
  }
  function go(){if(started)return;started=true;ensure(function(){
    if(window.d3&&window.topojson){initMap();}
    else{var mf=document.getElementById('map-fallback');if(mf)mf.style.display='block';var mw=document.getElementById('mapwrap');if(mw)mw.classList.remove('loading');}
  });}
  if('IntersectionObserver' in window){var mo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)go();});},{rootMargin:'400px'});mo.observe(mapSec);}else{go();}
})();

/* ---- Path Configurator ---- */
(function(){
  var wrap=document.getElementById('cfg');
  if(!wrap)return;
  var out=document.getElementById('cfg-out'), cta=document.getElementById('cfg-cta');
  var state={country:null,start:null,pace:null};
  window.__cfgState=state;
  var CN={};
  function cname(c){return CN[c]||c;}
  wrap.querySelectorAll('.cfg-chip').forEach(function(chip){
    chip.addEventListener('click',function(){
      if(chip.dataset.link==='map'){window.__cfgAwait=true;var m=document.querySelector('.map-sec');if(m)m.scrollIntoView({behavior:'smooth'});return;}
      var cat=chip.dataset.cat, val=chip.dataset.v;
      var group=wrap.querySelectorAll('.cfg-chip[data-cat="'+cat+'"]');
      var wasOn=chip.getAttribute('aria-pressed')==='true';
      group.forEach(function(c){c.setAttribute('aria-pressed','false');});
      state[cat]=wasOn?null:val;
      if(!wasOn)chip.setAttribute('aria-pressed','true');
      render();
    });
  });
  function paceText(p){return p==='undecided'?"at a pace we'll decide together":'at a <b>'+p+'</b> pace';}
  function render(){
    var c=state.country,s=state.start,p=state.pace;
    if(!c&&!s&&!p){out.innerHTML='<span class="cfg-hint">Pick one from each row — your path assembles here.</span>';cta.classList.remove('show');return;}
    var parts=['Building in <b>'+(c?cname(c):'your country')+'</b>'];
    if(s)parts.push('starting <b>'+s+'</b>');
    if(p)parts.push(paceText(p));
    out.innerHTML='Your path: '+parts.join(', ')+'.';
    if(c&&s&&p){
      cta.href='https://wa.me/40726205752?text='+encodeURIComponent("Hi Gabi, I'd like to book a personalized call. I'm building in "+cname(c)+", starting "+s+", "+(p==='undecided'?'pace to decide together':'at a '+p+' pace')+".");
      cta.classList.add('show');
    }else{cta.classList.remove('show');}
    if(window.__flowLights)window.__flowLights();
  }
  window.__cfgSetCountry=function(name){
    state.country=name;
    wrap.querySelectorAll('.cfg-chip[data-cat="country"]').forEach(function(c){c.setAttribute('aria-pressed',c.dataset.v===name?'true':'false');});
    render();
  };
})();


/* ---- guided flow: sky background + sequential step lighting ---- */
(function(){
  var whereSec=document.getElementById('where'), mapSec=document.querySelector('.map-sec');
  function lights(){
    var st=window.__cfgState||{};
    if(mapSec)mapSec.classList.toggle('lit',!st.country);
    var cols=document.querySelectorAll('#cfg .col');
    if(!cols.length)return;
    var keys=['country','start','pace'];
    var next=-1;
    for(var i=0;i<keys.length;i++){if(!st[keys[i]]){next=i;break;}}
    cols.forEach(function(col,i){
      col.classList.remove('lit','done','await');
      if(st[keys[i]])col.classList.add('done');
      else if(i===next)col.classList.add('lit');
      else if(next>-1&&i>next)col.classList.add('await');
    });
  }
  window.__flowLights=lights;
  if('IntersectionObserver' in window && whereSec){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.target===whereSec)whereSec.classList.toggle('sky',e.isIntersecting);
      if(e.isIntersecting)lights();
    });},{threshold:.22});
    io.observe(whereSec);
    if(mapSec)io.observe(mapSec);
  }else{lights();}
})();

/* ---- perk photo reveal ---- */
(function(){
  var pop=document.getElementById('perkpop');
  if(!pop)return;
  var veil=document.createElement('div');veil.id='perkveil';document.body.appendChild(veil);
  document.body.appendChild(pop); // escape .reveal transforms that break position:fixed
  var img=pop.querySelector('img'), vid=pop.querySelector('video'), cap=pop.querySelector('figcaption');
  var hideT=null, current=null;
  vid.preload='metadata';
  vid.addEventListener('loadedmetadata',function(){
    if(vid.videoWidth)vid.style.aspectRatio=vid.videoWidth+'/'+vid.videoHeight;
    if(current){place(current);requestAnimationFrame(clampIntoView);}
  });
  function place(perk){
    var vsrc=perk.dataset.video;
    var pw=vsrc?Math.min(280,Math.round(innerHeight*0.42)):230;
    pop.style.width=pw+'px';
    var ph=pop.offsetHeight;
    var pr=perk.getBoundingClientRect();
    var x=Math.max(10,Math.min(pr.left+pr.width/2-pw/2,innerWidth-pw-10));
    var top=pr.top-ph-12;
    if(top<10)top=pr.bottom+12;
    top=Math.max(10,Math.min(top,innerHeight-ph-10));
    pop.style.left=x+'px';
    pop.style.top=top+'px';
  }
  function clampIntoView(){
    var r=pop.getBoundingClientRect(), dy=0;
    if(r.bottom>innerHeight-10)dy=innerHeight-10-r.bottom;
    if(r.top+dy<10)dy=10-r.top;
    if(dy)pop.style.top=(parseFloat(pop.style.top||0)+dy)+'px';
  }
  function show(perk){
    var src=perk.dataset.img, vsrc=perk.dataset.video; if(!src&&!vsrc)return;
    clearTimeout(hideT); current=perk;
    pop.classList.toggle('vid',!!vsrc);
    if(vsrc){ img.hidden=true; vid.hidden=false; }
    else{ vid.hidden=true; vid.pause(); img.hidden=false; }
    cap.textContent=perk.dataset.cap||'';
    place(perk);                 // position first — Chrome won't load media on offscreen elements
    showY=scrollY;
    pop.classList.add('on');
    veil.classList.add('on');
    requestAnimationFrame(clampIntoView);
    if(vsrc){
      vid.onerror=function(){ vid.hidden=true; if(src){img.hidden=false;img.src=src;} else hideNow(); };
      if(vid.getAttribute('src')!==vsrc){ vid.src=vsrc; vid.load(); }
      else if(vid.readyState===0&&vid.networkState!==1){ vid.load(); }
      vid.play().catch(function(){});
    }else{
      img.onerror=function(){hideNow();};
      if(img.getAttribute('src')!==src)img.src=src;
    }
  }
  function hideNow(){pop.classList.remove('on');veil.classList.remove('on');current=null;vid.pause();}
  function hide(){hideT=setTimeout(hideNow,120);}
  var showY=0;
  addEventListener('scroll',function(){if(current&&Math.abs(scrollY-showY)>48)hideNow();},{passive:true});
  document.querySelectorAll('.perk[data-img],.perk[data-video]').forEach(function(p){
    p.addEventListener('mouseenter',function(){show(p);});
    p.addEventListener('mouseleave',hide);
    p.addEventListener('focus',function(){show(p);});
    p.addEventListener('blur',hide);
    p.addEventListener('click',function(){ if(current===p&&pop.classList.contains('on')&&!matchMedia('(hover:hover)').matches){hideNow();} else show(p); });
  });
})();

/* ---- club vs online tabs ---- */
(function(){
  var tabs=document.querySelectorAll('.mode');
  if(!tabs.length)return;
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      tabs.forEach(function(o){o.setAttribute('aria-selected','false');var p=document.getElementById(o.getAttribute('aria-controls'));if(p)p.hidden=true;});
      t.setAttribute('aria-selected','true');
      var panel=document.getElementById(t.getAttribute('aria-controls'));
      if(panel){panel.hidden=false;panel.classList.remove('reveal','in');void panel.offsetWidth;panel.style.animation='none';requestAnimationFrame(function(){panel.style.animation='';});}
    });
  });
})();

/* ---- keep sticky CTA out of the way while typing ---- */
(function(){
  var lf=document.getElementById('leadForm'), st=document.getElementById('stickycta');
  if(!lf||!st)return;
  lf.addEventListener('focusin',function(){st.style.display='none';});
  lf.addEventListener('focusout',function(){st.style.display='';});
})();

