#!/usr/bin/env python3
"""Build /menugen21/ (Boost Club x GEN21 partner menu) from menu/index.html.

The partner page is the live /menu with GEN21's look (aubergine, amber ring,
cream disc, blue GEN21 wordmark in Montserrat 800) and an order sheet that
REQUIRES name + phone. Orders post to /api/menu-order with src:"gen21", which
sends the Telegram message and saves the person to the CRM (form menu-gen21).

Never edit menugen21/index.html by hand: change menu/index.html or this
script, then run  python3 scripts/build-menugen21.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / "menu" / "index.html").read_text(encoding="utf-8")


def rep(old, new, count=1):
    global src
    found = src.count(old)
    if found != count:
        raise SystemExit(f"expected {count}x, found {found}x: {old[:70]!r}")
    src = src.replace(old, new)


# --- head ---------------------------------------------------------------
rep('<title>Menu | Boost Club București</title>', '<title>Boost Club × GEN21 | Shake Menu</title>')
rep('<link rel="canonical" href="https://boostclub.ro/menu/">',
    '<link rel="canonical" href="https://boostclub.ro/menugen21/">\n<meta name="robots" content="noindex, follow">')
rep('<meta name="theme-color" content="#06281F">', '<meta name="theme-color" content="#221A33">')
rep('<meta property="og:title" content="Boost Club Menu">', '<meta property="og:title" content="Boost Club × GEN21 Shake Menu">')
rep('<link rel="preload" href="/menu/fonts/anton-400-latin.woff2" as="font" type="font/woff2" crossorigin>',
    '<link rel="preload" href="/menugen21/fonts/montserrat-800-latin.woff2" as="font" type="font/woff2" crossorigin>')
rep('<style>\n', '''<style>
@font-face{font-family:Montserrat;src:url(/menugen21/fonts/montserrat-800-latin.woff2) format("woff2");font-weight:800;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Montserrat;src:url(/menugen21/fonts/montserrat-800-latin-ext.woff2) format("woff2");font-weight:800;font-display:swap;unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
''')

# --- palette: GEN21 aubergine + amber ring + blue wordmark ---------------
rep('''  --night:#041E17; --deep:#06281F; --green:#0D5645; --mid:#11705A;
  --gold:#C9A24B; --gold-hi:#E8C877; --cream:#F5F0E4; --dim:#A9C2B7; --rule:rgba(232,200,119,.22);''',
    '''  --night:#221A33; --deep:#2C2340; --green:#3B2F58; --mid:#3772E1;
  --gold:#F5A623; --gold-hi:#FFC45C; --cream:#F4EFE6; --dim:#BDB3D0; --rule:rgba(255,196,92,.24);
  --g21:#3772E1; --g21-navy:#3E4A72;''')
rep('rgba(4,30,23,.96);border-bottom:1px solid rgba(232,200,119,.12)', 'rgba(34,26,51,.96);border-bottom:1px solid rgba(255,196,92,.14)')
rep('background:rgba(4,30,23,.92)}', 'background:rgba(34,26,51,.92)}')
rep('radial-gradient(120% 70% at 50% 100%,#0D5645 0%,rgba(13,86,69,0) 60%),radial-gradient(60% 40% at 50% 30%,rgba(201,162,75,.16),transparent 70%)',
    'radial-gradient(120% 70% at 50% 110%,#3B2F58 0%,rgba(59,47,88,0) 60%),radial-gradient(60% 45% at 50% 38%,rgba(245,166,35,.14),transparent 70%)')
rep('background:rgba(2,14,10,.6)}', 'background:rgba(14,9,24,.62)}')
rep('.ticket .hint{margin:10px 0 0;font-size:11px;color:#5A6B63}', '.ticket .hint{margin:10px 0 0;font-size:11px;color:#5A5470}')
rep('.sheet .sum{margin:6px 0 14px;font-size:13px;color:#2E4A40;line-height:1.5}', '.sheet .sum{margin:6px 0 14px;font-size:13px;color:#3A3150;line-height:1.5}')
rep('.sheet p.s{margin:0;font-size:12.5px;color:#5A6B63}', '.sheet p.s{margin:0;font-size:12.5px;color:#5A5470}')
rep('color:#5f6d63}', 'color:#5A5470}')
rep('color:#3b4a40;', 'color:#3A3150;')
rep('.sheet input[type=text]{', '.sheet input[type=text],.sheet input[type=tel]{')

# --- GEN21 type + hero + bar lockup --------------------------------------
rep('</style>', '''/* === Boost Club x GEN21 === */
.disp,.step-h .n,.step-h h3,.ticket .tn,.mode b,.sig .nm,.sheet h3,.temp button b,.dstage .dt .tn{font-family:Montserrat,Poppins,sans-serif;font-weight:800;letter-spacing:-.01em}
.sh h2{font-size:clamp(32px,8.4vw,70px);line-height:1}
.step-h .n{font-size:34px}
.step-h h3{font-size:22px}
.ticket .tn{font-size:21px;line-height:1.05}
.mode b{font-size:20px}
.sig .nm{font-size:19px;line-height:1.08}
.sheet h3{font-size:23px;line-height:1.1}
.temp button b{font-size:15px}
.dstage .dt .tn{font-size:16px;line-height:1.1}
.chip.mix{background:rgba(55,114,225,.2);color:#9DBBF5}
@media(max-width:879px){.ticket .tn{font-size:16px}}
.bar .lock{display:flex;align-items:center;gap:9px;text-decoration:none}
.bar .lock .x{color:var(--gold-hi);font:600 14px Poppins,sans-serif}
.bar .lock .g{font:800 19px/1 Montserrat,Poppins,sans-serif;color:var(--g21);letter-spacing:-.01em}
.hero{padding-top:96px}
.g21grid{position:absolute;inset:0;pointer-events:none;opacity:.5;
  background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:56px 56px;
  -webkit-mask:radial-gradient(70% 60% at 50% 45%,#000,transparent);mask:radial-gradient(70% 60% at 50% 45%,#000,transparent)}
.g21disc{position:relative;width:min(76vw,400px);aspect-ratio:1;margin:0 auto}
.g21disc::before{content:"";position:absolute;inset:7.5%;border-radius:50%;
  background:radial-gradient(circle at 50% 46%,#FBF8F2 0%,#F1ECE4 55%,#DCD4CC 84%,rgba(220,212,204,.15) 100%);
  box-shadow:0 0 50px rgba(244,239,230,.18)}
.g21ring{position:absolute;inset:0;border-radius:50%;border:clamp(4px,1.2vw,7px) solid var(--gold);
  box-shadow:0 0 22px rgba(245,166,35,.55),0 0 60px rgba(245,166,35,.22),inset 0 0 18px rgba(245,166,35,.35);animation:glow 4s ease-in-out infinite}
@keyframes glow{50%{box-shadow:0 0 30px rgba(245,166,35,.75),0 0 80px rgba(245,166,35,.3),inset 0 0 24px rgba(245,166,35,.45)}}
.g21in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:0 16%}
.g21in img{width:46%;height:auto;display:block}
.g21in .x{font:600 clamp(16px,4vw,22px)/1 Poppins,sans-serif;color:var(--gold);margin:2px 0 0}
.g21in .logo{font:800 clamp(52px,15.5vw,104px)/1 Montserrat,Poppins,sans-serif;color:var(--g21);letter-spacing:-.02em}
.g21in .tag{font:600 clamp(9.5px,2.5vw,13px)/1.2 Poppins,sans-serif;color:var(--g21-navy);margin-top:2px;white-space:nowrap}
.hero h1{font-size:clamp(40px,12vw,104px);line-height:.95;margin:30px 0 0}
.hero h1 .outline{-webkit-text-stroke:1.5px var(--gold-hi)}
.hero .cta{margin-top:26px}
.sheet p.consent{margin:2px 0 14px;font-size:11px;line-height:1.45}
.sheet input.bad{border-color:#D2304F}
footer .lockline{font:800 15px Montserrat,Poppins,sans-serif;color:var(--g21);letter-spacing:.02em;margin:10px 0 0}
</style>''')

rep('''  <a href="/" aria-label="Boost Club"><img src="/images/boostclub-wordmark-cream.png" alt="Boost Club" width="102" height="22"></a>''',
    '''  <a href="/" class="lock" aria-label="Boost Club × GEN21"><img src="/images/boostclub-wordmark-cream.png" alt="Boost Club" width="102" height="22"><span class="x">×</span><span class="g">GEN21</span></a>''')

hero_start = src.index('<section class="hero">')
hero_end = src.index('</section>', hero_start) + len('</section>')
src = src[:hero_start] + '''<section class="hero">
  <div class="g21grid" aria-hidden="true"></div>
  <div>
    <div class="g21disc">
      <div class="g21ring" aria-hidden="true"></div>
      <div class="g21in">
        <img src="/images/boostclub-wordmark-dark.png" alt="Boost Club" width="3699" height="799">
        <span class="x" aria-hidden="true">×</span>
        <span class="logo">GEN21</span>
        <span class="tag">Conectăm generația următoare.</span>
      </div>
    </div>
    <h1 class="disp" data-i18n="heroTitle">Meniul<br><span class="outline">Shake</span></h1>
    <a class="cta" href="#build" data-i18n="heroCta">Construiește-ți shake-ul ↓</a>
  </div>
</section>''' + src[hero_end:]

rep('<p class="disp big" data-i18n="fBig">Ne vedem la bar</p>',
    '<p class="disp big" data-i18n="fBig">Ne vedem la bar</p>\n  <p class="lockline">BOOST CLUB × GEN21</p>')

# --- order sheet: name + phone required ----------------------------------
rep('''    <input type="text" id="oName" maxlength="40" autocomplete="given-name" data-ph="oName" placeholder="Your name">''',
    '''    <input type="text" id="oName" maxlength="40" autocomplete="name" data-ph="oName" placeholder="Your name" required>
    <input type="tel" id="oPhone" maxlength="20" autocomplete="tel" inputmode="tel" placeholder="Phone (WhatsApp)" required>
    <p class="s consent" data-i18n="oConsent">By sending, you agree Boost Club can message you on WhatsApp about your order and the club.</p>''')

rep("oCancel:'Înapoi',", "oCancel:'Înapoi',oPhone:'Telefon (WhatsApp)',oNeed:'Scrie numele și telefonul, ca Gabi să știe al cui e shake-ul.',oBadPhone:'Verifică numărul, ex. 0722 123 456.',oConsent:'Trimițând, ești de acord ca Boost Club să-ți scrie pe WhatsApp despre comandă și club.',")
rep("oCancel:'Back',", "oCancel:'Back',oPhone:'Phone (WhatsApp)',oNeed:'Add your name and phone so Gabi knows whose shake it is.',oBadPhone:'Check the number, e.g. 0722 123 456.',oConsent:'By sending, you agree Boost Club can message you on WhatsApp about your order and the club.',")

rep('if(e.key==="Enter"&&document.activeElement===$("oName"))$("oSend").click()',
    'if(e.key==="Enter"&&(document.activeElement===$("oName")||document.activeElement===$("oPhone")))$("oSend").click()')

rep('''$("oName").placeholder=L.oName;''', '''$("oName").placeholder=L.oName;$("oPhone").placeholder=L.oPhone;$("oName").classList.remove("bad");$("oPhone").classList.remove("bad");''')
rep('''try{$("oName").value=$("oName").value||localStorage.getItem("bc-menu-name")||""}catch(_){}''',
    '''try{$("oName").value=$("oName").value||localStorage.getItem("bc-menu-name")||"";$("oPhone").value=$("oPhone").value||localStorage.getItem("bc-gen21-phone")||""}catch(_){}''')

rep('''  if(t.id==="oSend"){var L2=T[lang],nm=$("oName").value.trim();try{localStorage.setItem("bc-menu-name",nm)}catch(_){}''',
    '''  if(t.id==="oSend"){var L2=T[lang],nm=$("oName").value.trim(),ph=$("oPhone").value.trim(),pd=ph.replace(/[^0-9+]/g,"");
    var phOk=/^07[2-9][0-9]{7}$/.test(pd)||/^(\\+|00)407[2-9][0-9]{7}$/.test(pd)||(/^(\\+|00)[1-9][0-9]{6,14}$/.test(pd)&&!/^(\\+|00)40/.test(pd));
    $("oName").classList.toggle("bad",nm.length<2);$("oPhone").classList.toggle("bad",!phOk);
    if(nm.length<2||!phOk){$("oMsg").textContent=nm.length<2||!ph?L2.oNeed:L2.oBadPhone;(nm.length<2?$("oName"):$("oPhone")).focus();return}
    try{localStorage.setItem("bc-menu-name",nm);localStorage.setItem("bc-gen21-phone",ph)}catch(_){}''')

rep('''body:JSON.stringify({b:st.b,''', '''body:JSON.stringify({src:"gen21",phone:ph,b:st.b,''')
rep('''(r.status===429?L2.oSlow:L2.oFail)''', '''(r.status===429?L2.oSlow:r.status===400?L2.oBadPhone:L2.oFail)''')

out = ROOT / "menugen21" / "index.html"
out.parent.mkdir(exist_ok=True)
out.write_text(src, encoding="utf-8")
print(f"wrote {out.relative_to(ROOT)} ({len(src):,} bytes)")
