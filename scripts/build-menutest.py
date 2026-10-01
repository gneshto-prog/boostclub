#!/usr/bin/env python3
"""Builds menutest/index.html from menu/index.html.

menutest = the live shake menu, reordered (signatures before the builder), plus two sections:
  - Your drink: one step. Four tea photos, aloe Original/Mango toggle, iced/hot toggle. Both drinks
    come with every shake, in one cup. (PDM is halved at the counter when they take both. Never on
    the page.)
  - Boost+: five named upgrade drinks with photos. Second membership level or a set amount per
    visit, asked at the counter. No prices on the page.

Run after every change to menu/index.html so the test page keeps the live fixes:
    python3 scripts/build-menutest.py
Never edit menutest/index.html by hand.
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "menu", "index.html")
OUT = os.path.join(ROOT, "menutest", "index.html")

h = open(SRC, encoding="utf-8").read()

def rep(old, new, count=1):
    global h
    assert h.count(old) >= 1, "anchor missing: " + old[:70]
    h = h.replace(old, new, count)

# ---------- head ----------
rep('<title>Shake Menu | Boost Club București</title>',
    '<title>Menu test | Boost Club București</title>\n<meta name="robots" content="noindex,nofollow">')
rep('<link rel="canonical" href="https://boostclub.ro/menu/">', '')

# ---------- signatures before the builder ----------
m = re.search(r'<section id="house">.*?</section>\n', h, re.S)
house = m.group(0)
h = h.replace(house, '', 1)
rep('<section id="build">', house + '\n<section id="build">')

# ---------- css ----------
rep('</style>', '''
/* === drink + Boost+ (menutest) === */
#house{background:var(--night)}
#drinks{background:var(--night);border-top:1px solid var(--rule)}
#plus{background:var(--deep);border-block:1px solid var(--rule)}
#drinks .steps,#plus .steps{max-width:none}
.dstage{position:sticky;top:72px;z-index:5;display:grid;grid-template-columns:96px 1fr;gap:12px;align-items:center;padding:10px 12px;margin-bottom:26px;border:1px solid var(--rule);border-radius:18px;background:radial-gradient(80% 60% at 50% 45%,rgba(201,162,75,.18),transparent 70%),var(--night);box-shadow:0 14px 30px rgba(0,0,0,.45)}
.drink{position:relative;width:96px;aspect-ratio:2/3}
.drink img{position:absolute;inset:0;width:100%;height:100%;display:block}
.dstage .dt{background:var(--cream);color:var(--night);border-radius:14px;padding:11px 12px 10px;text-align:left}
.dstage .dt .k{font-size:9.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#5f6d63}
.dstage .dt .tn{font-family:Anton,Impact,sans-serif;text-transform:uppercase;font-size:21px;line-height:1;margin:3px 0 6px}
.dstage .dt .x{font-size:11.5px;color:#3b4a40;line-height:1.4;min-height:1.4em}
@media(min-width:880px){.dstage{max-width:420px;top:84px}}
.teas{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.tea{position:relative;border:1px solid var(--rule);background:var(--card);border-radius:18px;padding:12px 8px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;font-size:13.5px;font-weight:500;text-align:center;transition:background .2s,border-color .2s,transform .15s}
.tea img{width:84px;height:126px;object-fit:contain;display:block}
.tea:hover{background:var(--card-hi)}
.tea:active{transform:scale(.97)}
.tea[aria-pressed=true]{background:var(--cream);color:var(--night);border-color:var(--cream)}
.tea .badge{position:absolute;top:10px;right:10px;font-size:9.5px;font-weight:600;letter-spacing:.1em;background:var(--gold);color:var(--night);border-radius:5px;padding:2px 5px}
.tea[aria-pressed=true]::after{content:"";position:absolute;left:12px;top:12px;width:18px;height:18px;border-radius:50%;background:var(--gold)}
.tea[aria-pressed=true]::before{content:"";position:absolute;left:17px;top:16px;width:7px;height:4px;border:solid var(--night);border-width:0 0 2px 2px;transform:rotate(-45deg);z-index:1}
@media(max-width:879px){.teas{grid-template-columns:repeat(2,1fr)}}
.tog{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
.tog .lab{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-hi);margin:0 0 8px}
.temp{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.temp button{border:1px solid var(--rule);background:var(--card);border-radius:14px;padding:11px 12px;text-align:left;display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:500;transition:background .2s,border-color .2s}
.temp button b{font-family:Anton,Impact,sans-serif;font-weight:400;text-transform:uppercase;font-size:20px;line-height:1}
.temp button[aria-pressed=true]{background:var(--cream);color:var(--night);border-color:var(--cream)}
.temp .badge{font-size:9.5px;font-weight:600;letter-spacing:.1em;background:var(--gold);color:var(--night);border-radius:5px;padding:2px 5px;margin-left:auto}
@media(max-width:879px){.tog{grid-template-columns:1fr}}
.sig .phd{width:76px;height:114px;border-radius:12px;overflow:hidden;background:linear-gradient(180deg,var(--g1),var(--g2))}
.sig .phd img{width:100%;height:100%;object-fit:cover;display:block}
.sig .star.plus{background:transparent;color:var(--gold-hi);border:1px solid var(--rule)}
.sig[aria-pressed=true]{border-color:var(--gold);background:var(--card-hi)}
.sig[aria-pressed=true] .star.plus{background:var(--gold);color:var(--night);border-color:var(--gold)}
.sig[aria-pressed=true] .try{color:var(--cream)}
</style>''')

# ---------- ticket rows ----------
rep('<dt class="ext" data-i18n="tTop">Topping</dt><dd class="ext" id="tTop"></dd>',
    '<dt class="ext" data-i18n="tTop">Topping</dt><dd class="ext" id="tTop"></dd>\n            <dt data-i18n="tDrink">Drink</dt><dd id="tDrink"></dd>\n            <dt>Boost+</dt><dd id="tExtra"></dd>')

# ---------- sections, placed right after the builder ----------
SECTIONS = '''
<section id="drinks">
  <div class="wrap">
    <div class="sh reveal">
      <div><p class="eyebrow" data-i18n="dEyebrow">The bar</p><h2 class="disp" data-i18n="dTitle">Your drink</h2></div>
      <p data-i18n="dLead">Every visit comes with a tea and an aloe in one cup, next to the shake. Tap a tea. Iced or hot.</p>
    </div>
    <div class="dstage" aria-live="polite">
      <div class="drink" role="img" aria-label="Drink preview"></div>
      <div class="dt"><div class="k" data-i18n="tDrink">Drink</div><div class="tn" id="tDrink2"></div><div class="x" id="tExtra2"></div></div>
    </div>
    <div class="steps">
      <div class="step">
        <div class="step-h"><span class="n">04</span><h3 data-i18n="s4">The tea</h3></div>
        <p class="sub" data-i18n="s4sub">Comes with every shake. Pick one.</p>
        <div class="teas" id="optTea"></div>
        <div class="tog">
          <div><p class="lab" data-i18n="aloeL">Aloe</p><div class="temp" id="optAloe"></div></div>
          <div><p class="lab" data-i18n="tempL">Served</p><div class="temp" id="optTemp"></div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="plus">
  <div class="wrap">
    <div class="sh reveal">
      <div><p class="eyebrow">Boost+</p><h2 class="disp" data-i18n="pTitle">The upgrades</h2></div>
      <p data-i18n="pLead">Five drinks on top of your membership. Boost+ membership, or add one to any visit for a set amount. Ask at the counter.</p>
    </div>
    <div class="sigs" id="combos"></div>
  </div>
</section>
'''
m2 = re.search(r'<section id="build">.*?</section>\n', h, re.S)
h = h.replace(m2.group(0), m2.group(0) + SECTIONS, 1)

# ---------- data ----------
rep('var T={', '''var TEA=[
 {id:"original",ro:"Original",en:"Original"},
 {id:"lemon",ro:"Lămâie",en:"Lemon"},
 {id:"peach",ro:"Piersică",en:"Peach"},
 {id:"mango",ro:"Mango & Fructul dragonului",en:"Mango & Dragon Fruit",nw:1}
];
var ALOE=[{id:"original",ro:"Original",en:"Original"},{id:"mango",ro:"Mango",en:"Mango",nw:1}];
var TEMP=[{id:"iced",ro:"Cu gheață",en:"Iced",ic:"🧊"},{id:"hot",ro:"Cald",en:"Hot",ic:"☕"}];
var PLUS=[
 {id:"collagen",en:"Collagen Skin Booster"},{id:"cr7",en:"CR7 Drive"},{id:"hydrate",en:"H24 Hydrate"},
 {id:"nightmode",en:"Night Mode"},{id:"betaheart",en:"Beta Heart"},{id:"immune",en:"Immune Booster"},
 {id:"aloemax",en:"Aloe Max"},{id:"liftoff",en:"Liftoff"},{id:"icedcoffee",en:"High Protein Iced Coffee"}
];
var COMBO=[
 {n:"Skin Boost",tea:"peach",aloe:"original",temp:"iced",p:"collagen",g1:"#F2A86B",g2:"#F2B5C4",ro:"Ceai de piersică cu colagen. Piele, păr, unghii.",en:"Peach tea with collagen stirred in. Skin, hair, nails."},
 {n:"Energy Boost",tea:"lemon",aloe:"original",temp:"iced",p:"liftoff",g1:"#E6D86A",g2:"#F5E04A",ro:"Ceai de lămâie cu un Liftoff. Înainte de antrenament.",en:"Lemon tea with a Liftoff dropped in. Before training."},
 {n:"Hydro",tea:"peach",aloe:"mango",temp:"iced",p:"hydrate",g1:"#9EC9F3",g2:"#F6C453",ro:"Hydrate cu aloe de mango. După alergare, după o noapte lungă.",en:"Hydrate with mango aloe. After a run, after a night out."},
 {n:"Night Cap",tea:"peach",aloe:"original",temp:"hot",p:"nightmode",g1:"#3B2A6B",g2:"#F2A86B",ro:"Night Mode cald, mușețel și piersică. Ultima vizită a zilei.",en:"Night Mode, warm, chamomile and peach. The last visit of the day."},
 {n:"Heart",tea:"original",aloe:"original",temp:"hot",p:"betaheart",g1:"#E9DFC8",g2:"#CFE8D2",ro:"Beta Heart în shake, ceai și aloe calde. Colesterolul sub control.",en:"Beta Heart in the shake, warm tea and aloe. Cholesterol in check."}
];
var T={''')

rep("none:'Fără',mix:'Mix'", "dEyebrow:'Barul',dTitle:'Băutura ta',dLead:'La fiecare vizită primești un ceai și un aloe în același pahar, lângă shake. Apasă un ceai. Cu gheață sau cald.',s4:'Ceaiul',s4sub:'Vine cu fiecare shake. Alege unul.',aloeL:'Aloe',tempL:'Servit',pTitle:'Upgrade-urile',pLead:'Cinci băuturi peste abonamentul tău. Abonament Boost+, sau adaugi una la orice vizită pentru o sumă fixă. Întreabă la tejghea.',tDrink:'Băutura',nw:'Nou',iced:'cu gheață',hot:'cald',tapOff:'Apasă din nou ca să renunți',none:'Fără',mix:'Mix'")
rep("none:'None',mix:'Mix'", "dEyebrow:'The bar',dTitle:'Your drink',dLead:'Every visit comes with a tea and an aloe in one cup, next to the shake. Tap a tea. Iced or hot.',s4:'The tea',s4sub:'Comes with every shake. Pick one.',aloeL:'Aloe',tempL:'Served',pTitle:'The upgrades',pLead:'Five drinks on top of your membership. Boost+ membership, or add one to any visit for a set amount. Ask at the counter.',tDrink:'Drink',nw:'New',iced:'iced',hot:'hot',tapOff:'Tap again to remove',none:'None',mix:'Mix'")

# ---------- state ----------
rep('var st={b:["vanilla"],s:[],t:[],dbl:false},mode="loaded";',
    'var st={b:["vanilla"],s:[],t:[],dbl:false,tea:["original"],aloe:["original"],temp:["iced"],p:[]},mode="loaded";')

# ---------- render ----------
rep('  $("optTop").innerHTML=TP.map(function(f){return optBtn(f,"t",f[lang])}).join("");\n}',
    '''  $("optTop").innerHTML=TP.map(function(f){return optBtn(f,"t",f[lang])}).join("");
  $("optTea").innerHTML=TEA.map(function(f){return '<button type="button" class="tea" data-g="tea" data-id="'+f.id+'" aria-pressed="false"><img src="'+teaImg(f.id)+'" alt="" width="480" height="720">'+esc(f[lang])+(f.nw?'<span class="badge">'+T[lang].nw+'</span>':'')+'</button>'}).join("");
  $("optAloe").innerHTML=ALOE.map(function(f){return '<button type="button" data-g="aloe" data-id="'+f.id+'" aria-pressed="false"><b>'+esc(f[lang])+'</b>'+(f.nw?'<span class="badge">'+T[lang].nw+'</span>':'')+'</button>'}).join("");
  $("optTemp").innerHTML=TEMP.map(function(f){return '<button type="button" data-g="temp" data-id="'+f.id+'" aria-pressed="false"><span>'+f.ic+'</span><b>'+esc(f[lang])+'</b></button>'}).join("");
}
function renderCombos(){
  $("combos").innerHTML=COMBO.map(function(c,i){
    var chips=[byId(TEA,c.tea)[lang]+(lang==="ro"?" (ceai)":" tea"),byId(ALOE,c.aloe)[lang]+(lang==="ro"?" (aloe)":" aloe"),T[lang][c.temp],byId(PLUS,c.p).en];
    return '<button type="button" class="sig" data-combo="'+i+'" aria-pressed="false"><span class="star plus">Boost+</span><div class="phd" style="--g1:'+c.g1+';--g2:'+c.g2+'"><img src="'+DIMG+'plus-'+c.p+'.webp" alt="" loading="lazy" width="480" height="720"></div><div><div class="nm">'+esc(c.n)+'</div><p class="d">'+esc(c[lang])+'</p><div class="chips">'+chips.map(function(x){return '<span class="chip">'+esc(x)+'</span>'}).join("")+'</div></div><span class="try">'+T[lang].tryIt+'</span></button>';
  }).join("");
  $("combos").querySelectorAll(".phd img").forEach(function(i){i.onerror=function(){i.remove()}});
}''')

# ---------- ticket + previews inside update() ----------
rep('''  $("tTop").textContent=st.t.length?st.t.map(function(i){return byId(TP,i)[lang]}).join(" + ")+x:L.none;''',
    '''  $("tTop").textContent=st.t.length?st.t.map(function(i){return byId(TP,i)[lang]}).join(" + ")+x:L.none;
  var tea=byId(TEA,st.tea[0]),aloe=byId(ALOE,st.aloe[0]),combo=curCombo();
  $("tDrink").textContent=(lang==="ro"?"Ceai "+tea.ro.toLowerCase()+" + aloe "+aloe.ro.toLowerCase():tea.en+" tea + "+aloe.en+" aloe")+" · "+L[st.temp[0]];
  $("tExtra").textContent=combo?combo.n+" ("+byId(PLUS,combo.p).en+")":L.none;
  $("tDrink2").textContent=$("tDrink").textContent;$("tExtra2").textContent=combo?"Boost+ · "+combo.n+" · "+L.tapOff:"";
  document.querySelectorAll(".tea img").forEach(function(i){var id=i.parentNode.getAttribute("data-id"),u=teaImg(id);if(i.getAttribute("src")!==u)i.src=u});
  document.querySelectorAll("[data-combo]").forEach(function(b){b.setAttribute("aria-pressed",String(!!combo&&COMBO[+b.getAttribute("data-combo")]===combo))});
  drawDrink(tea,aloe,st.temp[0]);''')

# pressed-state loop must cover the tea tiles and the toggles (not .opt)
rep('''  document.querySelectorAll(".opt").forEach(function(o){var g=o.getAttribute("data-g");o.setAttribute("aria-pressed",String(st[g].indexOf(o.getAttribute("data-id"))>-1))});''',
    '''  document.querySelectorAll("[data-g]").forEach(function(o){var g=o.getAttribute("data-g");o.setAttribute("aria-pressed",String(st[g].indexOf(o.getAttribute("data-id"))>-1))});''')

# ---------- drink helpers ----------
rep('/* cup: the real signature photo, or flavour photo + syrup/topping layers */',
    '''/* drink: /menu/images/drinks/web/tea-<tea>-<aloe>-<temp>.webp, swapped in once decoded */
var DIMG="/menu/images/drinks/web/";
function teaImg(id){return DIMG+"tea-"+id+"-"+st.aloe[0]+"-"+st.temp[0]+".webp"}
function curCombo(){if(!st.p.length)return null;for(var i=0;i<COMBO.length;i++){var c=COMBO[i];if(c.p===st.p[0]&&c.tea===st.tea[0]&&c.aloe===st.aloe[0]&&c.temp===st.temp[0])return c}return null}
function drawDrink(tea,aloe,temp){
  var ds=[].slice.call(document.querySelectorAll(".drink")),src=DIMG+"tea-"+tea.id+"-"+aloe.id+"-"+temp+".webp";
  var n=++drawDN,im=new Image();im.alt="";im.decoding="async";
  im.onload=function(){if(n!==drawDN)return;(im.decode?im.decode().catch(function(){}):Promise.resolve()).then(function(){if(n===drawDN)ds.forEach(function(d){d.replaceChildren(im.cloneNode())})})};
  im.onerror=function(){};im.src=src;
}
var drawDN=0;
/* cup: the real signature photo, or flavour photo + syrup/topping layers */''')

# ---------- preload drink photos with the shake layers ----------
rep('''  list.forEach(function(u){var i=new Image();i.decoding="async";i.src=u});''',
    '''  TEA.forEach(function(t){ALOE.forEach(function(a){TEMP.forEach(function(m){list.push(DIMG+"tea-"+t.id+"-"+a.id+"-"+m.id+".webp")})})});
  COMBO.forEach(function(c){list.push(DIMG+"plus-"+c.p+".webp")});
  list.forEach(function(u){var i=new Image();i.decoding="async";i.src=u});''')

# ---------- toggle: single-select drink groups; changing the drink drops a Boost+ combo that no longer matches ----------
rep('''function toggle(g,id){
  var arr=st[g],i=arr.indexOf(id),note="";''',
    '''function toggle(g,id){
  var arr=st[g],i=arr.indexOf(id),note="";
  if(g==="tea"||g==="aloe"||g==="temp"){st[g]=[id];if(!curCombo())st.p=[];update();return}''')

# ---------- clicks: combo = tap to set, tap again to remove; surprise + reset ----------
rep('  if(t.hasAttribute("data-sig")){load(SIG[+t.getAttribute("data-sig")]);return}',
    '''  if(t.hasAttribute("data-sig")){load(SIG[+t.getAttribute("data-sig")]);return}
  if(t.hasAttribute("data-combo")){var c=COMBO[+t.getAttribute("data-combo")];if(curCombo()===c){st.p=[]}else{st.tea=[c.tea];st.aloe=[c.aloe];st.temp=[c.temp];st.p=[c.p]}update();return}''')
rep('''    st.b=pick(FL,Math.random()<.4?2:1);st.s=pick(SY,Math.random()<.8?1:0);st.t=pick(TP,Math.random()<.75?1:(Math.random()<.5?2:0));''',
    '''    st.b=pick(FL,Math.random()<.4?2:1);st.s=pick(SY,Math.random()<.8?1:0);st.t=pick(TP,Math.random()<.75?1:(Math.random()<.5?2:0));
    st.tea=pick(TEA,1);st.aloe=pick(ALOE,1);st.temp=pick(TEMP,1);st.p=[];''')
rep('''if(t.id==="reset"){st={b:["vanilla"],s:[],t:[],dbl:false};''',
    '''if(t.id==="reset"){st={b:["vanilla"],s:[],t:[],dbl:false,tea:["original"],aloe:["original"],temp:["iced"],p:[]};''')

# ---------- order summary + payload ----------
rep('''$("oSum").textContent=$("tName").textContent+" · "+$("tBase").textContent+(mode==="loaded"&&st.s.length?" · "+$("tSyrup").textContent:"")+(mode==="loaded"&&st.t.length?" · "+$("tTop").textContent:"");''',
    '''$("oSum").textContent=$("tName").textContent+" · "+$("tBase").textContent+(mode==="loaded"&&st.s.length?" · "+$("tSyrup").textContent:"")+(mode==="loaded"&&st.t.length?" · "+$("tTop").textContent:"")+" · "+$("tDrink").textContent+(st.p.length?" · Boost+ "+$("tExtra").textContent:"");''')
rep('''body:JSON.stringify({b:st.b,s:mode==="loaded"?st.s:[],t:mode==="loaded"?st.t:[],name:nm,sig:matchSig()||"",lang:lang,website:$("oHp").value})''',
    '''body:JSON.stringify({b:st.b,s:mode==="loaded"?st.s:[],t:mode==="loaded"?st.t:[],name:nm,sig:matchSig()||"",lang:lang,website:$("oHp").value,d:{tea:st.tea[0],aloe:st.aloe[0],temp:st.temp[0],x:[],p:st.p,combo:(curCombo()||{}).n||""}})''')

rep('function renderAll(){applyText();renderOpts();renderSigs();update();observe()}',
    'function renderAll(){applyText();renderOpts();renderSigs();renderCombos();update();observe()}')

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w", encoding="utf-8").write(h)
print("wrote", os.path.relpath(OUT, ROOT), len(h), "bytes")
