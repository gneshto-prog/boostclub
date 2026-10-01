#!/usr/bin/env python3
"""Builds menutest/index.html from menu/index.html.

menutest = the live shake menu + the bar section (tea, aloe, hot/iced, shake extras, Boost+,
named combos). Run after every change to menu/index.html so the test page keeps the live fixes:
    python3 scripts/build-menutest.py
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "menu", "index.html")
OUT = os.path.join(ROOT, "menutest", "index.html")

h = open(SRC, encoding="utf-8").read()

def rep(old, new, count=1):
    global h
    assert h.count(old) >= 1, "anchor missing: " + old[:60]
    h = h.replace(old, new, count)

# ---------- head ----------
rep('<title>Shake Menu | Boost Club București</title>',
    '<title>Menu test | Boost Club București</title>\n<meta name="robots" content="noindex,nofollow">')
rep('<link rel="canonical" href="https://boostclub.ro/menu/">', '')

# ---------- css ----------
rep('</style>', '''
/* === drinks (menutest) === */
#drinks{background:var(--night);border-top:1px solid var(--rule)}
#drinks .steps{max-width:none}
.temp{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:360px}
.temp button{border:1px solid var(--rule);background:var(--card);border-radius:14px;padding:12px 14px;text-align:left;display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500}
.temp button b{font-family:Anton,Impact,sans-serif;font-weight:400;text-transform:uppercase;font-size:22px;line-height:1}
.temp button[aria-pressed=true]{background:var(--cream);color:var(--night);border-color:var(--cream)}
.lvl{font-size:9.5px;font-weight:600;letter-spacing:.1em;color:var(--gold-hi);border:1px solid var(--rule);border-radius:5px;padding:2px 5px;margin-left:2px}
.opt[aria-pressed=true] .lvl{color:var(--night);border-color:rgba(4,30,23,.35)}
.sig.nop{grid-template-columns:1fr}
.sig .glassbar{width:100%;height:6px;border-radius:99px;background:linear-gradient(90deg,var(--g1),var(--g2));margin-bottom:12px}
.sig .star.plus{background:transparent;color:var(--gold-hi);border:1px solid var(--rule)}
.inc{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--dim);margin:-6px 0 18px}
.inc i{width:8px;height:8px;border-radius:50%;background:var(--gold);display:inline-block}
/* drink preview under the cup: photo if it exists, CSS glass until then */
.drink{position:relative;width:110px;aspect-ratio:2/3;margin:12px auto 0}
.drink img{position:absolute;inset:0;width:100%;height:100%;display:block}
.drink .g{position:absolute;inset:10% 18% 4%;border-radius:10px 10px 22px 22px;background:linear-gradient(180deg,var(--c1) 0%,var(--c2) 100%);box-shadow:inset 0 0 0 2px rgba(255,255,255,.25),0 10px 24px rgba(0,0,0,.4);overflow:hidden}
.drink .g::before{content:"";position:absolute;inset:6% 0 0 0;background:linear-gradient(90deg,rgba(255,255,255,.22),transparent 40%,rgba(255,255,255,.08))}
.drink .ice{position:absolute;width:26%;aspect-ratio:1;border-radius:4px;background:rgba(255,255,255,.55);box-shadow:inset 0 0 0 1px rgba(255,255,255,.6)}
.drink .steam{position:absolute;left:50%;top:-4%;width:2px;height:16%;border-radius:99px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.5),transparent);transform:translateX(-50%);animation:steam 2.2s ease-in-out infinite}
.drink .steam.s2{left:40%;animation-delay:-.8s}.drink .steam.s3{left:60%;animation-delay:-1.5s}
@keyframes steam{0%{transform:translate(-50%,8px);opacity:0}50%{opacity:1}100%{transform:translate(-50%,-10px);opacity:0}}
.drink .lbl{position:absolute;left:50%;bottom:-18px;transform:translateX(-50%);font-size:9px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-hi);white-space:nowrap}
.opt .sw.th{background:var(--c) var(--img) center 28%/180% no-repeat}
.sig .phd{width:76px;height:114px;border-radius:12px;overflow:hidden;background:linear-gradient(180deg,var(--g1),var(--g2))}
.sig .phd img{width:100%;height:100%;object-fit:cover;display:block}
@media(max-width:879px){.drink{display:none}}
/* sticky drink stage at the top of the drinks section: the cup you are building, on every screen size */
.dstage{position:sticky;top:72px;z-index:5;display:grid;grid-template-columns:96px 1fr;gap:12px;align-items:center;padding:10px 12px;margin-bottom:26px;border:1px solid var(--rule);border-radius:18px;background:radial-gradient(80% 60% at 50% 45%,rgba(201,162,75,.18),transparent 70%),var(--night);box-shadow:0 14px 30px rgba(0,0,0,.45)}
.dstage .drink{display:block;width:96px;margin:0}
.dstage .drink .lbl{display:none}
.dstage .dt{background:var(--cream);color:var(--night);border-radius:14px;padding:11px 12px 10px;text-align:left}
.dstage .dt .k{font-size:9.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#5f6d63}
.dstage .dt .tn{font-family:Anton,Impact,sans-serif;text-transform:uppercase;font-size:21px;line-height:1;margin:3px 0 6px}
.dstage .dt .x{font-size:11.5px;color:#3b4a40;line-height:1.4}
@media(min-width:880px){.dstage{max-width:420px;top:84px}}
</style>''')

# ---------- stage: drink preview + ticket rows ----------
rep('<div class="cup" id="cup" role="img" aria-label="Shake preview"></div>',
    '<div class="cup" id="cup" role="img" aria-label="Shake preview"></div>\n        <div class="drink" id="drink" role="img" aria-label="Drink preview"></div>')
rep('<dt class="ext" data-i18n="tTop">Topping</dt><dd class="ext" id="tTop"></dd>',
    '<dt class="ext" data-i18n="tTop">Topping</dt><dd class="ext" id="tTop"></dd>\n            <dt data-i18n="tDrink">Drink</dt><dd id="tDrink"></dd>\n            <dt data-i18n="tExtra">Extra</dt><dd id="tExtra"></dd>')

# ---------- drinks section ----------
SECTION = '''
<section id="drinks">
  <div class="wrap">
    <div class="sh reveal">
      <div><p class="eyebrow" data-i18n="dEyebrow">The bar</p><h2 class="disp" data-i18n="dTitle">Your drinks</h2></div>
      <p data-i18n="dLead">Every visit comes with a tea and an aloe next to the shake, in one cup. Pick the flavours, pick iced or hot.</p>
    </div>
    <div class="dstage" aria-live="polite">
      <div class="drink" role="img" aria-label="Drink preview"></div>
      <div class="dt"><div class="k" data-i18n="tDrink">Drink</div><div class="tn" id="tDrink2"></div><div class="x" id="tExtra2"></div></div>
    </div>
    <div class="steps">
      <div class="step">
        <div class="step-h"><span class="n">04</span><h3 data-i18n="s4">The tea</h3></div>
        <p class="sub" data-i18n="s4sub">Comes with every shake. Pick a flavour.</p>
        <div class="opts" id="optTea"></div>
      </div>
      <div class="step">
        <div class="step-h"><span class="n">05</span><h3 data-i18n="s5">The aloe</h3></div>
        <p class="sub" data-i18n="s5sub">Goes in the same cup as the tea. Pick a flavour.</p>
        <div class="opts" id="optAloe"></div>
      </div>
      <div class="step">
        <div class="step-h"><span class="n">06</span><h3 data-i18n="s6">Iced or hot</h3></div>
        <p class="sub" data-i18n="s6sub">Over ice, or warm.</p>
        <div class="temp" id="optTemp"></div>
      </div>
      <div class="step">
        <div class="step-h"><span class="n">07</span><h3 data-i18n="s7">In the shake</h3></div>
        <p class="sub" data-i18n="s7sub">Optional. One, or none.</p>
        <div class="opts" id="optX"></div>
      </div>
      <div class="step">
        <div class="step-h"><span class="n">08</span><h3>Boost+</h3></div>
        <p class="sub" data-i18n="s8sub">The upgrade list. Boost+ membership, or add one to any visit for a set amount. Ask at the counter.</p>
        <div class="opts" id="optPlus"></div>
      </div>
    </div>

    <div class="sh reveal" style="margin-top:56px">
      <div><p class="eyebrow" data-i18n="cEyebrow">Bar recipes</p><h2 class="disp" data-i18n="cTitle">The combos</h2></div>
      <p data-i18n="cLead">Named drinks, built from the list above. Tap one and it lands on your ticket.</p>
    </div>
    <p class="inc"><i></i> <span data-i18n="cInc">Gold tag = included with every membership</span></p>
    <div class="sigs" id="combos"></div>
  </div>
</section>
'''
rep('<section id="house">', SECTION + '\n<section id="house">')

# ---------- data ----------
rep('var T={', '''var TEA=[
 {id:"original",ro:"Original",en:"Original",c:"#C9A24B",c2:"#8E6A22"},
 {id:"lemon",ro:"Lămâie",en:"Lemon",c:"#E6D86A",c2:"#B8A52E"},
 {id:"peach",ro:"Piersică",en:"Peach",c:"#F2A86B",c2:"#C97A3E"},
 {id:"mango",ro:"Mango & Fructul dragonului",en:"Mango & Dragon Fruit",c:"#E7527C",c2:"#A8305A",nw:1}
];
var ALOE=[
 {id:"original",ro:"Original",en:"Original",c:"#CFE8D2"},
 {id:"mango",ro:"Mango",en:"Mango",c:"#F6C453",nw:1}
];
var TEMP=[{id:"iced",ro:"Cu gheață",en:"Iced",ic:"🧊"},{id:"hot",ro:"Cald",en:"Hot",ic:"☕"}];
var XTRA=[
 {id:"f3",ro:"Proteină Formula 3",en:"Formula 3 Protein",c:"#D9C9A8"},
 {id:"fibre",ro:"Fibre din măr și ovăz",en:"Oat Apple Fibre",c:"#B9D98A"},
 {id:"creatine",ro:"Creatine+",en:"Creatine+",c:"#DDE7F0"}
];
var PLUS=[
 {id:"collagen",ro:"Collagen Skin Booster",en:"Collagen Skin Booster",c:"#F2B5C4"},
 {id:"cr7",ro:"CR7 Drive",en:"CR7 Drive",c:"#7B3FA0"},
 {id:"hydrate",ro:"H24 Hydrate",en:"H24 Hydrate",c:"#9EC9F3"},
 {id:"nightmode",ro:"Night Mode",en:"Night Mode",c:"#3B2A6B"},
 {id:"betaheart",ro:"Beta Heart",en:"Beta Heart",c:"#E9DFC8"},
 {id:"immune",ro:"Immune Booster",en:"Immune Booster",c:"#A33B5B"},
 {id:"aloemax",ro:"Aloe Max",en:"Aloe Max",c:"#8FD3B0"},
 {id:"liftoff",ro:"Liftoff",en:"Liftoff",c:"#F5E04A"},
 {id:"icedcoffee",ro:"High Protein Iced Coffee",en:"High Protein Iced Coffee",c:"#8A6A4E"}
];
var COMBO=[
 {n:"Skin Boost",plus:1,tea:"peach",aloe:"original",temp:"iced",x:[],p:["collagen"],g1:"#F2A86B",g2:"#F2B5C4",ro:"Ceai de piersică cu colagen. Piele, păr, unghii.",en:"Peach tea with collagen stirred in. Skin, hair, nails."},
 {n:"Energy Boost",plus:1,tea:"lemon",aloe:"original",temp:"iced",x:[],p:["liftoff"],g1:"#E6D86A",g2:"#F5E04A",ro:"Ceai de lămâie cu un Liftoff. Înainte de antrenament.",en:"Lemon tea with a Liftoff dropped in. Before training."},
 {n:"Gut Reset",tea:"original",aloe:"original",temp:"hot",x:["fibre"],p:[],g1:"#C9A24B",g2:"#B9D98A",ro:"Ceai original cald, aloe original, fibre în shake. Zi ușoară.",en:"Hot original tea, original aloe, fibre in the shake. Light day."},
 {n:"Iron",tea:"lemon",aloe:"original",temp:"iced",x:["f3"],p:[],g1:"#D9C9A8",g2:"#E6D86A",ro:"Formula 3 în shake, ceai de lămâie cu gheață. Zi de sală.",en:"Formula 3 in the shake, iced lemon tea. Gym day."},
 {n:"Hydro",plus:1,tea:"peach",aloe:"mango",temp:"iced",x:[],p:["hydrate"],g1:"#9EC9F3",g2:"#F6C453",ro:"Hydrate cu aloe de mango. După alergare, după o noapte lungă.",en:"Hydrate with mango aloe. After a run, after a night out."},
 {n:"Night Cap",plus:1,tea:"peach",aloe:"original",temp:"hot",x:[],p:["nightmode"],g1:"#3B2A6B",g2:"#F2A86B",ro:"Night Mode cald, mușețel și piersică. Ultima vizită a zilei.",en:"Night Mode, warm, chamomile and peach. The last visit of the day."},
 {n:"Heart",plus:1,tea:"original",aloe:"original",temp:"hot",x:[],p:["betaheart"],g1:"#E9DFC8",g2:"#CFE8D2",ro:"Beta Heart în shake, ceai și aloe calde. Colesterolul sub control.",en:"Beta Heart in the shake, warm tea and aloe. Cholesterol in check."},
 {n:"Dragon",tea:"mango",aloe:"mango",temp:"iced",x:[],p:[],g1:"#E7527C",g2:"#F6C453",ro:"Ceai de mango și fructul dragonului cu gheață, aloe de mango. Cel de vară.",en:"Mango and dragon fruit tea over ice, mango aloe. The summer one."}
];
var T={''')

# i18n strings
rep("none:'Fără',mix:'Mix'", "dEyebrow:'Barul',dTitle:'Băuturile tale',dLead:'La fiecare vizită primești un ceai și un aloe lângă shake, în același pahar. Alege aromele, alege cu gheață sau cald.',s4:'Ceaiul',s4sub:'Vine cu fiecare shake. Alege o aromă.',s5:'Aloe',s5sub:'Merge în același pahar cu ceaiul. Alege o aromă.',s6:'Cu gheață sau cald',s6sub:'Peste gheață, sau cald.',s7:'În shake',s7sub:'Opțional. Unul, sau niciunul.',s8sub:'Lista de upgrade. Abonament Boost+, sau adaugi unul la orice vizită pentru o sumă fixă. Întreabă la tejghea.',cEyebrow:'Rețetele barului',cTitle:'Combinațiile',cLead:'Băuturi cu nume, din lista de mai sus. Apasă pe una și ajunge pe biletul tău.',cInc:'Eticheta aurie = inclus în orice abonament',nw:'Nou',tDrink:'Băutura',tExtra:'Extra',incl:'Inclus',plusAsk:'Boost+',iced:'cu gheață',hot:'cald',none:'Fără',mix:'Mix'")
rep("none:'None',mix:'Mix'", "dEyebrow:'The bar',dTitle:'Your drinks',dLead:'Every visit comes with a tea and an aloe next to the shake, in one cup. Pick the flavours, pick iced or hot.',s4:'The tea',s4sub:'Comes with every shake. Pick a flavour.',s5:'The aloe',s5sub:'Goes in the same cup as the tea. Pick a flavour.',s6:'Iced or hot',s6sub:'Over ice, or warm.',s7:'In the shake',s7sub:'Optional. One, or none.',s8sub:'The upgrade list. Boost+ membership, or add one to any visit for a set amount. Ask at the counter.',cEyebrow:'Bar recipes',cTitle:'The combos',cLead:'Named drinks, built from the list above. Tap one and it lands on your ticket.',cInc:'Gold tag = included with every membership',nw:'New',tDrink:'Drink',tExtra:'Extra',incl:'Included',plusAsk:'Boost+',iced:'iced',hot:'hot',none:'None',mix:'Mix'")

# "New" badge next to "Limited"
rep('''(o.ltd?'<span class="badge">'+T[lang].ltd+'</span>':'')''', '''(o.ltd?'<span class="badge">'+T[lang].ltd+'</span>':o.nw?'<span class="badge">'+T[lang].nw+'</span>':'')''')

# state
rep('var st={b:["vanilla"],s:[],t:[],dbl:false},mode="loaded";',
    'var st={b:["vanilla"],s:[],t:[],dbl:false,tea:["original"],aloe:["original"],temp:["iced"],x:[],p:[]},mode="loaded";')

# render options for the new groups
rep('  $("optTop").innerHTML=TP.map(function(f){return optBtn(f,"t",f[lang])}).join("");\n}',
    '''  $("optTop").innerHTML=TP.map(function(f){return optBtn(f,"t",f[lang])}).join("");
  $("optTea").innerHTML=TEA.map(function(f){return optBtn(f,"tea",f[lang])}).join("");
  $("optAloe").innerHTML=ALOE.map(function(f){return optBtn(f,"aloe",f[lang])}).join("");
  $("optTemp").innerHTML=TEMP.map(function(f){return '<button type="button" data-g="temp" data-id="'+f.id+'" aria-pressed="false"><span>'+f.ic+'</span><b>'+esc(f[lang])+'</b></button>'}).join("");
  $("optX").innerHTML=XTRA.map(function(f){return optBtn(f,"x",f[lang])}).join("");
  $("optPlus").innerHTML=PLUS.map(function(f){return '<button type="button" class="opt" data-g="p" data-id="'+f.id+'" aria-pressed="false"><span class="sw th" style="--c:'+f.c+';--img:url('+DIMG+'plus-'+f.id+'.webp)"></span>'+esc(f[lang])+'<span class="lvl">Boost+</span></button>'}).join("");
}
function renderCombos(){
  $("combos").innerHTML=COMBO.map(function(c,i){
    var chips=[byId(TEA,c.tea)[lang]+(lang==="ro"?" (ceai)":" tea"),byId(ALOE,c.aloe)[lang]+(lang==="ro"?" (aloe)":" aloe"),T[lang][c.temp]].concat(c.x.map(function(x){return byId(XTRA,x)[lang]}),c.p.map(function(p){return byId(PLUS,p)[lang]}));
    var ph=c.p.length?DIMG+"plus-"+c.p[0]+".webp":DIMG+"tea-"+c.tea+"-"+c.aloe+"-"+c.temp+".webp";
    return '<button type="button" class="sig" data-combo="'+i+'">'+(c.plus?'<span class="star plus">Boost+</span>':'<span class="star">'+T[lang].incl+'</span>')+'<div class="phd" style="--g1:'+c.g1+';--g2:'+c.g2+'"><img src="'+ph+'" alt="" loading="lazy" width="480" height="720"></div><div><div class="nm">'+esc(c.n)+'</div><p class="d">'+esc(c[lang])+'</p><div class="chips">'+chips.map(function(x){return '<span class="chip">'+esc(x)+'</span>'}).join("")+'</div></div><span class="try">'+T[lang].tryIt+'</span></button>';
  }).join("");
  $("combos").querySelectorAll(".phd img").forEach(function(i){i.onerror=function(){i.remove()}});
}''')

# drink preview + ticket rows inside update()
rep('''  $("tTop").textContent=st.t.length?st.t.map(function(i){return byId(TP,i)[lang]}).join(" + ")+x:L.none;''',
    '''  $("tTop").textContent=st.t.length?st.t.map(function(i){return byId(TP,i)[lang]}).join(" + ")+x:L.none;
  var tea=byId(TEA,st.tea[0]),aloe=byId(ALOE,st.aloe[0]);
  $("tDrink").textContent=(lang==="ro"?"Ceai "+tea.ro.toLowerCase()+" + aloe "+aloe.ro.toLowerCase():tea.en+" tea + "+aloe.en+" aloe")+" · "+L[st.temp[0]];
  var ex=st.x.map(function(i){return byId(XTRA,i)[lang]}).concat(st.p.map(function(i){return byId(PLUS,i)[lang]+" (Boost+)"}));
  $("tExtra").textContent=ex.length?ex.join(" + "):L.none;
  $("tDrink2").textContent=$("tDrink").textContent;$("tExtra2").textContent=ex.length?ex.join(" + "):"";
  drawDrink(tea,aloe,st.temp[0]);''')

# drawDrink function (photo if present, CSS glass otherwise) placed before drawCup
rep('/* cup: the real signature photo, or flavour photo + syrup/topping layers */',
    '''/* drink: /menu/images/drinks/web/tea-<tea>-<aloe>-<temp>.webp if it exists, CSS glass until then */
var DIMG="/menu/images/drinks/web/";
function drawDrink(tea,aloe,temp){
  var ds=[].slice.call(document.querySelectorAll(".drink")),src=DIMG+"tea-"+tea.id+"-"+aloe.id+"-"+temp+".webp";
  var css='<div class="g" style="--c1:'+aloe.c+';--c2:'+(tea.c2||tea.c)+'">'+(temp==="iced"?'<span class="ice" style="left:18%;top:14%;transform:rotate(12deg)"></span><span class="ice" style="left:52%;top:9%;transform:rotate(-8deg)"></span><span class="ice" style="left:34%;top:30%;transform:rotate(28deg)"></span>':'<span class="steam"></span><span class="steam s2"></span><span class="steam s3"></span>')+'</div><span class="lbl">'+T[lang][temp]+'</span>';
  var n=++drawDN,im=new Image();im.alt="";im.decoding="async";
  im.onload=function(){if(n!==drawDN)return;(im.decode?im.decode().catch(function(){}):Promise.resolve()).then(function(){if(n===drawDN)ds.forEach(function(d){d.replaceChildren(im.cloneNode())})})};
  im.onerror=function(){if(n===drawDN)ds.forEach(function(d){d.innerHTML=css})};im.src=src;
}
var drawDN=0;
/* cup: the real signature photo, or flavour photo + syrup/topping layers */''')

# toggle: single-select groups
rep('''function toggle(g,id){
  var arr=st[g],i=arr.indexOf(id),note="";''',
    '''function toggle(g,id){
  var arr=st[g],i=arr.indexOf(id),note="";
  if(g==="tea"||g==="aloe"||g==="temp"){st[g]=[id];update();return}
  if(g==="x"||g==="p"){st[g]=i>-1?[]:[id];update();return}''')

# preload drink photos with the shake layers
rep('''  list.forEach(function(u){var i=new Image();i.decoding="async";i.src=u});''',
    '''  TEA.forEach(function(t){ALOE.forEach(function(a){TEMP.forEach(function(m){list.push(DIMG+"tea-"+t.id+"-"+a.id+"-"+m.id+".webp")})})});
  PLUS.forEach(function(p){list.push(DIMG+"plus-"+p.id+".webp")});
  list.forEach(function(u){var i=new Image();i.decoding="async";i.src=u});''')

# combo click + surprise drinks
rep('  if(t.hasAttribute("data-sig")){load(SIG[+t.getAttribute("data-sig")]);return}',
    '''  if(t.hasAttribute("data-sig")){load(SIG[+t.getAttribute("data-sig")]);return}
  if(t.hasAttribute("data-combo")){var c=COMBO[+t.getAttribute("data-combo")];st.tea=[c.tea];st.aloe=[c.aloe];st.temp=[c.temp];st.x=c.x.slice();st.p=c.p.slice();update();document.getElementById("build").scrollIntoView({behavior:"smooth"});return}''')
rep('''    st.b=pick(FL,Math.random()<.4?2:1);st.s=pick(SY,Math.random()<.8?1:0);st.t=pick(TP,Math.random()<.75?1:(Math.random()<.5?2:0));''',
    '''    st.b=pick(FL,Math.random()<.4?2:1);st.s=pick(SY,Math.random()<.8?1:0);st.t=pick(TP,Math.random()<.75?1:(Math.random()<.5?2:0));
    st.tea=pick(TEA,1);st.aloe=pick(ALOE,1);st.temp=pick(TEMP,1);''')

# order summary + payload
rep('''$("oSum").textContent=$("tName").textContent+" · "+$("tBase").textContent+(mode==="loaded"&&st.s.length?" · "+$("tSyrup").textContent:"")+(mode==="loaded"&&st.t.length?" · "+$("tTop").textContent:"");''',
    '''$("oSum").textContent=$("tName").textContent+" · "+$("tBase").textContent+(mode==="loaded"&&st.s.length?" · "+$("tSyrup").textContent:"")+(mode==="loaded"&&st.t.length?" · "+$("tTop").textContent:"")+" · "+$("tDrink").textContent+(st.x.length||st.p.length?" · "+$("tExtra").textContent:"");''')
rep('''body:JSON.stringify({b:st.b,s:mode==="loaded"?st.s:[],t:mode==="loaded"?st.t:[],name:nm,sig:matchSig()||"",lang:lang,website:$("oHp").value})''',
    '''body:JSON.stringify({b:st.b,s:mode==="loaded"?st.s:[],t:mode==="loaded"?st.t:[],name:nm,sig:matchSig()||"",lang:lang,website:$("oHp").value,d:{tea:st.tea[0],aloe:st.aloe[0],temp:st.temp[0],x:st.x,p:st.p}})''')

# reset keeps drinks defaults
rep('''if(t.id==="reset"){st={b:["vanilla"],s:[],t:[],dbl:false};''',
    '''if(t.id==="reset"){st={b:["vanilla"],s:[],t:[],dbl:false,tea:["original"],aloe:["original"],temp:["iced"],x:[],p:[]};''')

# pressed-state loop must cover the iced/hot buttons too (they are not .opt)
rep('''  document.querySelectorAll(".opt").forEach(function(o){var g=o.getAttribute("data-g");o.setAttribute("aria-pressed",String(st[g].indexOf(o.getAttribute("data-id"))>-1))});''',
    '''  document.querySelectorAll("[data-g]").forEach(function(o){var g=o.getAttribute("data-g");o.setAttribute("aria-pressed",String(st[g].indexOf(o.getAttribute("data-id"))>-1))});''')

# renderAll includes combos
rep('function renderAll(){applyText();renderOpts();renderSigs();update();observe()}',
    'function renderAll(){applyText();renderOpts();renderSigs();renderCombos();update();observe()}')

# simple mode must not hide the drink rows (they have no .ext class, fine) — nothing to do.

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w", encoding="utf-8").write(h)
print("wrote", os.path.relpath(OUT, ROOT), len(h), "bytes")
