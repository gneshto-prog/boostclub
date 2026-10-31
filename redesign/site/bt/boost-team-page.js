  var LG=document.documentElement.lang||'en', PRE=(LG==='en'?'':'../');
  function track(n){ try{ if(window.BoostAnalytics&&BoostAnalytics.track) BoostAnalytics.track(n); }catch(e){} }
  track('partner_program_viewed');
  // language switch + Boost Team favicon
  document.querySelector('.bt-lang').innerHTML=['ro','en','ru'].map(function(l){ var h=PRE+(l==='en'?'':l+'/')+'business.html'; return l===LG?'<b>'+l.toUpperCase()+'</b>':'<a href="'+h+'" hreflang="'+l+'">'+l.toUpperCase()+'</a>'; }).join('');
  document.querySelectorAll('link[rel~="icon"]').forEach(function(x){ x.remove(); }); var fi=document.createElement('link'); fi.rel='icon'; fi.href=PRE+'bt/bt-favicon.svg'; document.head.appendChild(fi);
  var bar=document.querySelector('.bt-bar'); function onS(){ bar.classList.toggle('solid',scrollY>30); } addEventListener('scroll',onS,{passive:true}); onS();
  // reveals
  if('IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('bt-seen'); io.unobserve(e.target); } }); },{rootMargin:'0px 0px -8% 0px'}); document.querySelectorAll('.bt-rv').forEach(function(x){ io.observe(x); }); }
  else document.querySelectorAll('.bt-rv').forEach(function(x){ x.classList.add('bt-seen'); });
  // path cards, configurator and form share one state
  var fPath=document.getElementById('bt-path'), fCountry=document.getElementById('bt-country'), IDX={a:1,b:2,c:3};
  function go(id){ document.getElementById(id).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}); }
  var cfg=document.getElementById('bt-cfg'), sumtx=document.getElementById('bt-sumtx'), country='';
  function lbl(n){ var x=cfg.querySelector('input[name='+n+']:checked'); return x?x.nextElementSibling.textContent:''; }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}); }
  function sum(){ cfg.querySelectorAll('fieldset').forEach(function(f){ f.classList.toggle('done',!!f.querySelector('input:checked')); });
    var p=lbl('bt-p'), s=lbl('bt-s'), t=lbl('bt-t'); if(!p&&!s&&!t&&!country) return;
    sumtx.innerHTML=[p&&('<b>'+esc(p)+'</b>'),country&&esc(country),s&&esc(s),t&&esc(t)].filter(Boolean).join(' · ');
    var pk=cfg.querySelector('input[name=bt-p]:checked'); if(pk) fPath.selectedIndex=IDX[pk.value]; }
  cfg.addEventListener('change',function(e){ sum(); if(e.target.name==='bt-p') track('partner_path_selected'); });
  document.querySelectorAll('.bt-pick').forEach(function(b){ b.addEventListener('click',function(){ var k=b.dataset.path; fPath.selectedIndex=IDX[k]; var r=cfg.querySelector('input[name=bt-p][value='+k+']'); if(r){ r.checked=true; sum(); } track('partner_path_selected'); go('talk'); setTimeout(function(){ document.getElementById('bt-name').focus({preventScroll:true}); },700); }); });
  // the map: available countries, Boost Club in Bucharest, Varna coming soon. Zoom (buttons, pinch, Ctrl/Cmd + scroll),
  // fly to the chosen country, distance from the club, search in EN/RO/RU (country names come from Intl.DisplayNames)
  var MK=__MARKETS__; // [topojson name, ISO alpha-2]
  (function(){ var wrap=document.getElementById('bt-map'), svgEl=document.getElementById('bt-worldmap'), tip=document.getElementById('bt-tip'), q=document.getElementById('bt-country-q'), hint=document.getElementById('bt-hint');
    var P={k:document.getElementById('bt-pk'),n:document.getElementById('bt-pn'),s:document.getElementById('bt-ps'),d:document.getElementById('bt-pd'),dist:document.getElementById('bt-pdist'),stat:document.getElementById('bt-pstat'),cta:document.getElementById('bt-mapcta')};
    var dn=null; try{ dn=new Intl.DisplayNames([LG],{type:'region'}); }catch(e){}
    var CODE={}, LOC={}, BY={}; MK.forEach(function(m){ CODE[m[0]]=m[1]; var l=dn?dn.of(m[1]):m[0]; LOC[m[0]]=l; BY[l.toLowerCase()]=m[0]; BY[m[0].toLowerCase()]=m[0]; });
    function locName(n){ return LOC[n]||n; }
    // localized suggestions for the search and the form's country field
    document.getElementById('bt-qlist').innerHTML=MK.map(function(m){ return locName(m[0]); }).sort(function(a,b){ return a.localeCompare(b,LG); }).map(function(n){ return '<option value="'+esc(n)+'">'; }).join('');
    if(!window.d3||!window.topojson){ P.s.textContent='Type your country above.'; return; }
    wrap.classList.add('loading');
    var W=960, H=520, BUC=[26.1,44.43], VAR=[27.91,43.21], RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
    var svg=d3.select(svgEl), proj=d3.geoNaturalEarth1(), path=d3.geoPath(proj), byName={}, sel=null, k=1;
    d3.json(PRE+'bt/vendor/countries-110m.json').then(function(topo){ wrap.classList.remove('loading');
      var G=topo.objects.countries.geometries, isr=G.filter(function(g){ return g.properties.name==='Israel'||g.properties.name==='Palestine'; });
      var feats=topojson.feature(topo,topo.objects.countries).features.filter(function(f){ return f.properties.name!=='Antarctica'&&f.properties.name!=='Palestine'; });
      feats.forEach(function(f){ if(f.properties.name==='Israel') f.geometry=topojson.merge(topo,isr); });
      proj.fitExtent([[8,8],[W-8,H-8]],{type:'FeatureCollection',features:feats});
      var view=svg.append('g').attr('class','bt-view');
      view.append('g').selectAll('path').data(feats).join('path').attr('d',path).attr('class',function(d){ return CODE[d.properties.name]?'c on':'c off'; })
        .attr('vector-effect','non-scaling-stroke')
        .each(function(d){ byName[d.properties.name]={el:this,d:d}; })
        .on('mousemove',function(ev,d){ var r=wrap.getBoundingClientRect(); tip.hidden=false; tip.style.left=(ev.clientX-r.left)+'px'; tip.style.top=(ev.clientY-r.top)+'px'; tip.innerHTML=esc(locName(d.properties.name))+(CODE[d.properties.name]?' · <span class="on">'+'Available'+'</span>':''); })
        .on('mouseleave',function(){ tip.hidden=true; })
        .on('click',function(ev,d){ pick(d.properties.name,true); });
      var hq=proj(BUC), vn=proj(VAR), arcs=view.append('g');
      view.append('path').attr('class','nxl').attr('vector-effect','non-scaling-stroke').attr('d','M'+hq[0]+','+hq[1]+' Q'+((hq[0]+vn[0])/2)+','+(Math.min(hq[1],vn[1])-6)+' '+vn[0]+','+vn[1]);
      function pin(xy,cls,label,sub,fn){ var g=view.append('g').attr('class','pin '+cls).attr('transform','translate('+xy[0]+','+xy[1]+')').attr('tabindex',0).attr('role','button').attr('aria-label',label+', '+sub);
        g.append('circle').attr('class','ring').attr('r',6); g.append('circle').attr('class','dot').attr('r',4.5);
        var lb=g.append('g').attr('class','plab'); lb.append('rect').attr('rx',4); var t=lb.append('text').attr('x',8).attr('y',4).text(label); lb.append('text').attr('class','ps').attr('x',8).attr('y',15).text(sub);
        g.on('click',fn).on('keydown',function(ev){ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); fn(); } }); return g; }
      var pB=pin(hq,'hqp','Bucharest','Boost Club · open',function(){ pick('Romania',true,'buc'); }), pV=pin(vn,'vnp','Varna','Coming soon',function(){ pick('Bulgaria',true,'var'); });
      function sizeLabels(){ view.selectAll('.pin').each(function(){ var g=d3.select(this); g.select('.dot').attr('r',4.5/k); g.select('.ring').attr('r',6/k); var lb=g.select('.plab'); lb.attr('transform','scale('+(1/k)+')'); var w=0; lb.selectAll('text').each(function(){ w=Math.max(w,this.getComputedTextLength()); }); lb.select('rect').attr('x',2).attr('y',-9).attr('width',w+14).attr('height',30); });
        view.selectAll('.dest').attr('r',5/k); pV.select('.plab').attr('transform','translate(0,'+(6/k)+') scale('+(1/k)+')'); pB.select('.plab').attr('transform','translate(0,'+(-34/k)+') scale('+(1/k)+')'); }
      // zoom: buttons, pinch, Ctrl/Cmd + wheel; one-finger drag pans only once zoomed in, so the page still scrolls
      var zoom=d3.zoom().scaleExtent([1,14]).translateExtent([[-40,-40],[W+40,H+40]])
        .filter(function(ev){ if(ev.type==='wheel'){ if(!(ev.ctrlKey||ev.metaKey)){ showHint(); return false; } return true; } if(ev.touches) return ev.touches.length>1||k>1.05; return !ev.button; })
        .on('zoom',function(ev){ k=ev.transform.k; view.attr('transform',ev.transform); sizeLabels(); wrap.classList.toggle('zoomed',k>1.05); });
      svg.call(zoom).on('dblclick.zoom',null);
      var ht; function showHint(){ hint.textContent=(/Mac|iPhone|iPad/.test(navigator.platform)?'⌘':'Ctrl')+' + '+'scroll to zoom'; hint.hidden=false; clearTimeout(ht); ht=setTimeout(function(){ hint.hidden=true; },1400); }
      function fit(b,pad,maxK){ var dx=b[1][0]-b[0][0], dy=b[1][1]-b[0][1], cx=(b[0][0]+b[1][0])/2, cy=(b[0][1]+b[1][1])/2, s=Math.max(1,Math.min(maxK||10,(pad||.85)/Math.max(dx/W,dy/H)));
        return d3.zoomIdentity.translate(W/2,H/2).scale(s).translate(-cx,-cy); }
      function go(t){ svg.transition().duration(RM?0:900).ease(d3.easeCubicInOut).call(zoom.transform,t); }
      var EU=fit([proj([-11,64]),proj([44,34])],.95,4), WORLD=d3.zoomIdentity;
      function setView(v){ document.querySelectorAll('.bt-views button').forEach(function(b){ b.setAttribute('aria-pressed',b.dataset.view===v); }); go(v==='eu'?EU:WORLD); }
      document.querySelectorAll('.bt-views button').forEach(function(b){ b.addEventListener('click',function(){ setView(b.dataset.view); }); });
      document.getElementById('bt-zin').addEventListener('click',function(){ svg.transition().duration(RM?0:300).call(zoom.scaleBy,1.6); });
      document.getElementById('bt-zout').addEventListener('click',function(){ svg.transition().duration(RM?0:300).call(zoom.scaleBy,1/1.6); });
      svg.call(zoom.transform,EU); sizeLabels();
      var QK=document.getElementById('bt-quick');
      QK.innerHTML=['Romania','Moldova','Bulgaria','Italy','Spain','Germany','United Kingdom','Israel'].map(function(n){ return '<button type="button" data-n="'+n+'">'+esc(locName(n))+'</button>'; }).join('');
      QK.addEventListener('click',function(e){ var b=e.target.closest('button'); if(b) pick(b.dataset.n,true); });
      function km(a,b){ return Math.round(d3.geoDistance(a,b)*6371); }
      function pick(name,fly,special){ var it=byName[name]; if(!it) return; var on=!!CODE[name];
        if(sel) d3.select(sel).classed('sel',false); sel=it.el; d3.select(sel).classed('sel',true);
        var cen=d3.geoCentroid(it.d); if(name==='Russia') cen=[37.6,55.75]; if(name==='United States of America') cen=[-98,39]; if(name==='France') cen=[2.3,46.6]; if(name==='Norway') cen=[10.7,59.9];
        var c=proj(cen); arcs.selectAll('*').remove();
        if(name!=='Romania'&&special!=='var'){ var mx=(hq[0]+c[0])/2, my=Math.min(hq[1],c[1])-Math.max(18,Math.abs(hq[0]-c[0])*.22); arcs.append('path').attr('class','arc').attr('vector-effect','non-scaling-stroke').attr('d','M'+hq[0]+','+hq[1]+' Q'+mx+','+my+' '+c[0]+','+c[1]); arcs.append('circle').attr('class','dest').attr('cx',c[0]).attr('cy',c[1]).attr('r',5/k); }
        if(fly){ var b=path.bounds(it.d); if(name==='Russia'||name==='United States of America'||name==='Canada') b=[proj([cen[0]-25,cen[1]+15]),proj([cen[0]+25,cen[1]-15])]; var hb=[[Math.min(b[0][0],hq[0]),Math.min(b[0][1],hq[1])],[Math.max(b[1][0],hq[0]),Math.max(b[1][1],hq[1])]];
          var dist=km(BUC,cen); go(fit(dist<2500?hb:b,.7,8)); document.querySelectorAll('.bt-views button').forEach(function(x){ x.setAttribute('aria-pressed','false'); }); }
        var L=locName(name); P.n.textContent=L; P.d.hidden=false; document.getElementById('bt-quick').hidden=true; P.cta.hidden=false; country=L; fCountry.value=L; q.value=L;
        if(special==='buc'||name==='Romania'){ P.k.textContent='Boost Club'; P.s.textContent='Boost Club is here: Strada Sevastopol 24, Bucharest.'; P.dist.textContent='0 km'; P.stat.textContent='Open'; }
        else if(special==='var'||name==='Bulgaria'){ P.k.textContent='Next city'; P.s.textContent='Boost Club Varna is coming soon.'; P.dist.textContent=km(BUC,VAR)+' km'; P.stat.textContent='Coming soon'; }
        else if(on){ P.k.textContent='Available'; P.s.textContent='You can start here.'; P.dist.textContent=km(BUC,cen).toLocaleString(LG)+' km'; P.stat.textContent='Available'; }
        else { P.k.textContent='Your country'; P.s.textContent='We check this one together on the call.'; P.dist.textContent=km(BUC,cen).toLocaleString(LG)+' km'; P.stat.textContent='To check on the call'; }
        sum(); track('partner_path_viewed'); }
      q.addEventListener('change',function(){ var v=q.value.trim().toLowerCase(); if(!v) return; var name=BY[v]||Object.keys(BY).filter(function(x){ return x.indexOf(v)===0; }).map(function(x){ return BY[x]; })[0];
        if(!name){ var hit=Object.keys(byName).find(function(n){ return n.toLowerCase().indexOf(v)===0; }); name=hit; }
        if(name) pick(name,true); else { P.n.textContent=q.value.trim(); P.k.textContent='Your country'; P.s.textContent='We check this one together on the call.'; P.d.hidden=true; P.cta.hidden=false; fCountry.value=q.value.trim(); country=q.value.trim(); sum(); } });
    }).catch(function(){ wrap.classList.remove('loading'); P.s.textContent='Type your country above.'; });
  })();
  // form: Netlify partner-lead, as on the live page (submission-created.mts writes a business lead to the CRM)
  var f=document.getElementById('btform'), send=document.getElementById('bt-send'), sendL=send.innerHTML, err=document.getElementById('bt-err'), started=false;
  f.elements['lang'].value=LG; f.elements['landing_page'].value=location.pathname;
  f.addEventListener('focusin',function(){ if(!started){ started=true; track('partner_lead_started'); } });
  function fail(m,el){ err.hidden=false; err.textContent=m; if(el) el.focus(); }
  function fill(t){ return t.replace('{name}',document.getElementById('bt-name').value.trim()).replace('{country}',fCountry.value.trim()).replace('{path}',fPath.options[fPath.selectedIndex].text); }
  f.addEventListener('submit',function(e){ e.preventDefault(); if(send.disabled) return;
    var nm=document.getElementById('bt-name'), ct=document.getElementById('bt-contact');
    var digits=ct.value.replace(/\D/g,''), mail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ct.value.trim());
    if(!nm.value.trim()) return fail('Please add your name.',nm);
    if(!mail&&digits.length<9) return fail('Please add a phone number with country code, or an email address.',ct);
    if(!fCountry.value.trim()) return fail('Please add the country where you would build.',fCountry);
    err.hidden=true;
    var extra=[lbl('bt-s'),lbl('bt-t')].filter(Boolean).join(', ');
    f.elements['goal'].value=[fPath.value,extra].filter(Boolean).join(' · ').slice(0,118); f.elements['referrer'].value=location.href;
    send.disabled=true; send.textContent='Sending…';
    var data=new URLSearchParams(new FormData(f)); if(extra) data.set('cand',extra);
    fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data.toString()})
      .then(function(r){ if(!r.ok) throw new Error(r.status); track('partner_lead_completed');
        var wa=document.getElementById('bt-wa2'); wa.href=wa.href.split('?')[0]+'?'+'text='+encodeURIComponent(fill('Hi Gabriel, I just asked for a business call on boostclub.ro. {name}, {country}. Path: {path}.'));
        f.hidden=true; var d=document.getElementById('bt-done'); d.hidden=false; d.focus(); })
      .catch(function(){ send.disabled=false; send.innerHTML=sendL; err.hidden=false; err.textContent='We could not send your request. Please message Gabriel on WhatsApp instead.'+' ';
        var a=document.createElement('a'); a.target='_blank'; a.rel='noopener'; a.textContent='Open WhatsApp →'; a.href=document.querySelector('.bt-final .bt-wa').href.split('?')[0]+'?'+'text='+encodeURIComponent(fill('Hi Gabriel, I would like a business call. {name}, {country}. Path: {path}.')); err.appendChild(a); });
  });
  document.querySelectorAll('a[href="#talk"]').forEach(function(a){ a.addEventListener('click',function(){ track('booking_cta_click'); }); });
