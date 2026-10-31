# /business = BOOST TEAM, the partner programme. Gabi's 31 Oct ruling: the previous /business concept (light,
# navy + blue + orange, the country map, "find out if you're a fit", "Want to own something? Let's talk.") rebuilt and
# elevated, branded with the real Boost Team kit (scripts/assets/boost-team-brand-board-original.pdf: navy #061A2F,
# blue #1098D4 primary, orange #FF8A00, green #2E7D50 accent only, gold #C8A24A dot). Short copy, three paths, the family,
# one call. Disclosures stay, compact (fact register: business/research/fact-register.md). Runs inside build.py's globals.
# The archived long version is qa/pages_e_business.v1-corporate.py.

_BT_WA = "https://wa.me/40726205752?text=Hi%20Gabriel%2C%20I%27d%20like%20to%20talk%20business."
_BT_SAGC = "https://www.herbalife.com/content/dam/global-reusable-assets/documents/pd-statement-typical-distributor-earnings-ro-ro.pdf"
_BT_WAICO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4 5.2 5.2 0 0 0 3.1.6 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>'

# Herbalife markets on the map (the live page's list, minus Vietnam: not in Herbalife's statement index, fact register P3)
_BT_MARKETS = ["United States of America", "Canada", "Mexico", "Guatemala", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Dominican Republic", "Jamaica",
               "Trinidad and Tobago", "Puerto Rico", "Colombia", "Venezuela", "Ecuador", "Peru", "Bolivia", "Brazil", "Chile", "Argentina", "Uruguay", "Paraguay",
               "United Kingdom", "Ireland", "France", "Spain", "Portugal", "Italy", "Germany", "Netherlands", "Belgium", "Switzerland", "Austria", "Denmark", "Sweden",
               "Norway", "Finland", "Iceland", "Poland", "Czechia", "Slovakia", "Hungary", "Romania", "Bulgaria", "Greece", "Croatia", "Slovenia", "Serbia",
               "Bosnia and Herzegovina", "North Macedonia", "Estonia", "Latvia", "Lithuania", "Ukraine", "Belarus", "Moldova", "Russia", "Cyprus", "Kazakhstan",
               "Kyrgyzstan", "Uzbekistan", "Mongolia", "Georgia", "Armenia", "Azerbaijan", "Israel", "Turkey", "Lebanon", "South Africa", "Zambia", "Botswana",
               "Namibia", "Ghana", "eSwatini", "Lesotho", "India", "Japan", "South Korea", "Taiwan", "Philippines", "Thailand", "Cambodia", "Malaysia", "Indonesia",
               "Australia", "New Zealand"]

_BT_PATHS = [
    ("a", "A", "Open a Boost Club", "img/real/planning-talk.jpg", "Two partners talking through the plan for a new club",
     "A Boost Club in your city, as a partner, where that arrangement is available.",
     ["Physical club", "Boost Club concept", "Closest mentoring"]),
    ("b", "B", "Open your own nutrition club", "img/real/gabi-painting-wall.jpg", "Gabriel painting the wall of his club before it opened",
     "Your name, your design, the Boost Team way of working behind it.",
     ["Physical club", "Your own brand", "Full mentoring"]),
    ("c", "C", "Build your own wellness business", "img/wet/mocha.jpg", "A Boost Club mocha shake with chocolate swirls",
     "No premises. Your customers, your coaching, your pace, part-time or full-time.",
     ["No premises", "Start part-time", "Lowest start-up cost"]),
]
_bt_cards = "".join(f'''<article class="bt-path bt-rv" data-path="{k}" style="--i:{i}">
      <figure><img src="{img}" alt="{alt}" loading="lazy"><span class="bt-pl">{L}</span></figure>
      <div class="bt-pb"><h3>{name}</h3><p>{line}</p><ul>{"".join(f"<li>{t}</li>" for t in tags)}</ul>
      <button type="button" class="bt-pick" data-path="{k}">Talk about this path <span aria-hidden="true">→</span></button></div>
    </article>''' for i, (k, L, name, img, alt, line, tags) in enumerate(_BT_PATHS))

_BT_SUP = [
    ('<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"/>', "Mentoring from Gabriel", "One-to-one, from your first call."),
    ('<path d="M4 6h16M4 12h16M4 18h10"/>', "A working method", "Consultations, follow-up and the club routine Boost Club runs every day."),
    ('<path d="M8 3v4M16 3v4M4 9h16M5 5h14v15H5z"/>', "Weekly business trainings", "Friday nights at the club in Bucharest, or by call."),
    ('<path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20a6 6 0 0 1 12 0M12 20a6 6 0 0 1 10 0"/>', "A team that builds together", "Ambitious people, shared wins, events across Romania and beyond."),
]
_bt_sup = "".join(f'<li class="bt-rv" style="--i:{i}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{ic}</svg><h3>{h}</h3><p>{p}</p></li>' for i, (ic, h, p) in enumerate(_BT_SUP))

_BT_FAQ = [
    ("Is this Herbalife?", "Yes. Boost Team builds with Herbalife products. Every partner is an independent Herbalife distributor running their own business."),
    ("Is it a franchise?", "No. There are no franchise fees and nothing to buy from us. Clubs are independently owned and follow Herbalife's club rules."),
    ("What does it cost to start?", "It depends on your country and your path. Starting without premises needs a small budget, a club needs a real one. We go through the numbers for your city on the call."),
    ("How do people earn?", f'From the products their customers buy and, as they grow, from Herbalife on the sales of the team they train. Results vary and most people earn little at first. <a href="{_BT_SAGC}" target="_blank" rel="noopener">Herbalife\'s typical earnings →</a>'),
    ("Do I need experience?", "No. You need to like people and follow the method. We teach the rest."),
    ("Can I do this next to my job?", "Yes, many start part-time with path C and decide on a club later."),
    ("What if I live outside Romania?", "Herbalife operates in 90+ countries. On the call we check what building looks like where you live."),
]

_bt_body = f'''
<header class="bt-bar">
  <a class="bt-brand" href="business.html" aria-label="Boost Team"><img src="bt/boost-team-wm.svg" alt="Boost Team" width="220" height="25"></a>
  <nav class="bt-links" aria-label="Boost Team"><a href="#paths">Three paths</a><a href="#map">Your country</a><a href="#family">Heritage</a><a href="#faq">FAQ</a></nav>
  <div class="bt-right"><a class="bt-back" href="index.html">Boost Club</a><span class="bt-lang"></span><a class="bt-btn bt-o bt-sm" href="#talk">Let's talk business</a></div>
</header>

<section class="bt-hero" id="top">
  <div class="bt-aurora" aria-hidden="true"></div>
  <div class="bt-wrap bt-heroin">
    <div class="bt-herotx">
      <span class="bt-kl">Boost Team · Partner program</span>
      <h1 class="bt-h1">Do you want to own <span class="bt-bl">a nutrition business?</span></h1>
      <p class="bt-lead">Learn the Boost Team system and build it where you live. Three ways to start, one team behind you.</p>
      <div class="bt-ctas"><a class="bt-btn bt-o" href="#talk">Let's talk business <span aria-hidden="true">→</span></a><a class="bt-btn bt-ghost" href="#paths">See the three paths</a></div>
      <ul class="bt-chips"><li>No experience needed</li><li>Start part-time, next to your job</li><li>Your first call is with Gabriel</li></ul>
    </div>
    <div class="bt-herovis">
      <figure class="bt-hph1" data-slot="REAL · a partnership handshake at the Boost Club sign"><img src="img/real/sign-handshake.jpg" alt="A handshake under the Boost Club sign in Bucharest" fetchpriority="high"><figcaption><b>Boost Club</b><span>Bucharest · open</span></figcaption></figure>
      <figure class="bt-hph2" data-slot="REAL · Gabriel, founder"><img src="img/real/gabi-event.jpg" alt="Gabriel Neshto, founder of Boost Team" loading="lazy"><figcaption>Gabriel Neshto · Founder</figcaption></figure>
      <div class="bt-badge" aria-hidden="true"><img src="bt/bt-favicon.svg" alt=""></div>
    </div>
  </div>
  <div class="bt-wrap"><dl class="bt-stats">
    <div class="bt-rv"><dt>1992</dt><dd>The family business begins</dd></div>
    <div class="bt-rv"><dt>90+</dt><dd>Countries where Herbalife operates</dd></div>
    <div class="bt-rv"><dt>3</dt><dd>Ways to build</dd></div>
    <div class="bt-rv"><dt>1</dt><dd>Call to start</dd></div>
  </dl></div>
</section>

<section class="bt-sec" id="paths">
  <div class="bt-wrap">
    <div class="bt-head bt-rv"><span class="bt-kl">Three paths</span><h2>Pick how you <span class="bt-bl">want to build.</span></h2></div>
    <div class="bt-paths">{_bt_cards}</div>
  </div>
</section>

<section class="bt-next" id="varna" aria-labelledby="bt-next-h">
  <div class="bt-wrap bt-nextg">
    <div class="bt-rv">
      <span class="bt-kl">Next city</span>
      <h2 id="bt-next-h"><span class="bt-vout" aria-hidden="true">Varna</span><span class="vh">Varna, Bulgaria. Coming soon.</span></h2>
      <p class="bt-nextsub"><b>Boost Club · Varna, Bulgaria</b><span class="bt-soon">Coming soon</span></p>
      <p class="bt-nextp">Our second club, on the Black Sea coast. Want to build in Bulgaria too?</p>
      <a class="bt-btn bt-o" href="#talk">Let's talk business <span aria-hidden="true">→</span></a>
    </div>
    <figure class="bt-route bt-rv" aria-hidden="true">
      <svg viewBox="0 0 520 300"><defs><linearGradient id="btsea" x1="0" x2="1"><stop offset="0" stop-color="#0E2A47"/><stop offset="1" stop-color="#103A5E"/></linearGradient></defs>
        <path d="M430 40 C 470 90, 455 150, 470 210 S 500 280, 520 300 L520 0 L400 0 Z" fill="url(#btsea)"/>
        <path class="bt-rt" d="M120 70 C 230 40, 330 120, 400 205" fill="none" stroke="#FF8A00" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 10"/>
        <circle cx="120" cy="70" r="9" fill="#FF8A00"/><circle class="bt-rp" cx="120" cy="70" r="9" fill="none" stroke="#FF8A00" stroke-width="2"/>
        <circle cx="400" cy="205" r="9" fill="#4FB0E2"/><circle class="bt-rp bt-rp2" cx="400" cy="205" r="9" fill="none" stroke="#4FB0E2" stroke-width="2"/>
      </svg>
      <span class="bt-city c1"><b>Bucharest</b><i>Open</i></span><span class="bt-city c2"><b>Varna</b><i>Coming soon</i></span><span class="bt-sea">Black Sea</span>
    </figure>
  </div>
</section>

<section class="bt-sec bt-pale" id="map">
  <div class="bt-wrap">
    <div class="bt-head bt-rv"><span class="bt-kl">Your country</span><h2>Start with <span class="bt-bl">your country.</span></h2><p>Type it or tap it on the map. Everything in blue is available.</p></div>
    <div class="bt-mapbox bt-rv">
      <div class="bt-mapbar"><label class="bt-search"><span class="vh">Your country</span><input id="bt-country-q" list="bt-qlist" placeholder="Type your country" autocomplete="off"></label><datalist id="bt-qlist"></datalist><span class="bt-legend"><i class="on"></i>Available <i class="hq"></i>Boost Club, Bucharest <i class="nx"></i>Varna, coming soon</span></div>
      <div class="bt-mapwrap">
        <div class="bt-map" id="bt-map"><svg id="bt-worldmap" viewBox="0 0 960 520" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of the available countries, with Boost Club in Bucharest and Varna"></svg>
          <div class="bt-tip" id="bt-tip" hidden></div>
          <div class="bt-zoom" role="group" aria-label="Map zoom"><button type="button" id="bt-zin" aria-label="Zoom in">+</button><button type="button" id="bt-zout" aria-label="Zoom out">−</button></div>
          <div class="bt-views" role="group" aria-label="Map view"><button type="button" data-view="eu" aria-pressed="true">Europe</button><button type="button" data-view="world" aria-pressed="false">World</button></div>
          <div class="bt-hint" id="bt-hint" hidden></div>
        </div>
        <aside class="bt-panel" id="bt-panel" aria-live="polite">
          <span class="bt-pk" id="bt-pk">Your country</span>
          <h3 id="bt-pn">Pick a country</h3>
          <p id="bt-ps">Tap a blue country, search above, or tap a pin.</p>
          <div class="bt-quick" id="bt-quick" aria-label="Quick picks"></div>
          <dl class="bt-pd" id="bt-pd" hidden><div><dt>Distance to Boost Club</dt><dd id="bt-pdist"></dd></div><div><dt>Status</dt><dd id="bt-pstat"></dd></div></dl>
          <a class="bt-btn bt-o bt-sm" id="bt-mapcta" href="#talk" hidden>Talk about building there <span aria-hidden="true">→</span></a>
        </aside>
      </div>
      <p class="bt-note">Whether and how you can register where you live, we check together on the call.</p>
    </div>
  </div>
</section>

<section class="bt-sec" id="fit">
  <div class="bt-wrap">
    <div class="bt-head bt-rv"><span class="bt-kl">Your version</span><h2>Find out <span class="bt-bl">if you're a fit.</span></h2></div>
    <div class="bt-cfg bt-rv" id="bt-cfg">
      <fieldset><legend><b>01</b> Your path</legend><div class="bt-ch">
        <label><input type="radio" name="bt-p" value="a"><span>A · Boost Club</span></label><label><input type="radio" name="bt-p" value="b"><span>B · Own club</span></label><label><input type="radio" name="bt-p" value="c"><span>C · Wellness business</span></label></div></fieldset>
      <fieldset><legend><b>02</b> Your starting point</legend><div class="bt-ch">
        <label><input type="radio" name="bt-s" value="From a job"><span>From a job</span></label><label><input type="radio" name="bt-s" value="From a gym or studio"><span>From a gym or studio</span></label><label><input type="radio" name="bt-s" value="Already coaching"><span>Already coaching</span></label><label><input type="radio" name="bt-s" value="A student"><span>A student</span></label><label><input type="radio" name="bt-s" value="From zero"><span>From zero</span></label></div></fieldset>
      <fieldset><legend><b>03</b> Your pace</legend><div class="bt-ch">
        <label><input type="radio" name="bt-t" value="Part-time"><span>Part-time</span></label><label><input type="radio" name="bt-t" value="Full-time"><span>Full-time</span></label><label><input type="radio" name="bt-t" value="Not sure yet"><span>Not sure yet</span></label></div></fieldset>
      <div class="bt-sum"><div class="bt-sumtx" id="bt-sumtx">Pick one from each row. Your path assembles here.</div><a class="bt-btn bt-o" href="#talk" id="bt-sumcta">Let's talk business <span aria-hidden="true">→</span></a></div>
    </div>
  </div>
</section>

<section class="bt-sec bt-pale" id="support">
  <div class="bt-wrap">
    <div class="bt-head bt-rv"><span class="bt-kl">Support</span><h2>The team is with you <span class="bt-bl">the whole way.</span></h2></div>
    <ul class="bt-sup">{_bt_sup}</ul>
  </div>
</section>

<section class="bt-fam" id="family">
  <div class="bt-wrap bt-famg">
    <figure class="bt-famph bt-rv" data-slot="REAL · Gabriel with his parents and their team"><img src="img/real/gabi-gala-group.jpg" alt="Gabriel Neshto with his parents, Oleg Neshto and Lana Goldenblank, and their team at a Herbalife event" loading="lazy"></figure>
    <div class="bt-famtx bt-rv">
      <span class="bt-kl">The family behind Boost Team</span>
      <p class="bt-year" aria-hidden="true">1992</p>
      <h2>Two generations. <span class="bt-bl">One way of building.</span></h2>
      <p>Oleg Neshto and Lana Goldenblank started their Herbalife business together in July 1992 and spent more than 34 years building a team that, in their words, spans continents. Gabriel grew up inside that business. Boost Team is how he passes it on.</p>
      <ol class="bt-ms">
        <li><b>1992</b><span>Oleg and Lana start their Herbalife business</span></li>
        <li><b>34+ years</b><span>Building teams across continents</span></li>
        <li><b>2026</b><span>Gabriel opens Boost Club in Bucharest</span></li>
        <li><b>Today</b><span>Boost Team: the next generation</span></li>
      </ol>
      <p class="bt-famlinks"><a href="gabriel.html">Gabriel's story →</a></p>
      <p class="bt-famnote">Their results are their own and not typical.</p>
    </div>
  </div>
</section>

<section class="bt-sec" id="faq">
  <div class="bt-wrap bt-faqg">
    <div class="bt-head bt-rv"><span class="bt-kl">Questions</span><h2>Straight <span class="bt-bl">answers.</span></h2></div>
    <div class="bt-faq bt-rv">{"".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in _BT_FAQ)}</div>
  </div>
</section>

<section class="bt-final" id="talk" data-k-calm>
  <div class="bt-aurora" aria-hidden="true"></div>
  <div class="bt-wrap bt-finalg">
    <div class="bt-rv">
      <span class="bt-kl">Next step</span>
      <h2>Want to own something? <span class="bt-bl2">Let's talk.</span></h2>
      <p>One call with Gabriel. Free. We'll see if there's a path where you live.</p>
      <a class="bt-wa" href="{_BT_WA}" target="_blank" rel="noopener">{_BT_WAICO}<span>Prefer WhatsApp? Message Gabriel</span></a>
    </div>
    <div class="bt-card bt-rv">
      <form id="btform" name="partner-lead" method="POST" action="/" data-netlify="true" netlify-honeypot="bot-field" novalidate aria-label="Partner enquiry">
        <input type="hidden" name="form-name" value="partner-lead"><input type="hidden" name="lang" value="en"><input type="hidden" name="lead_type" value="business"><input type="hidden" name="referrer" value=""><input type="hidden" name="landing_page" value=""><input type="hidden" name="goal" value="">
        <p class="vh" aria-hidden="true"><label>Leave this field empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <label>Your name<input name="name" id="bt-name" required autocomplete="name"></label>
        <label>Phone or email<input name="contact" id="bt-contact" required autocomplete="tel"></label>
        <div class="bt-two"><label>Country<input name="country" id="bt-country" required list="bt-qlist" autocomplete="country-name"></label>
        <label>Path<select name="path" id="bt-path"><option value="Not sure yet">Not sure yet</option><option value="A Open a Boost Club">A · Open a Boost Club</option><option value="B Open your own nutrition club">B · Own nutrition club</option><option value="C Build your own wellness business">C · Wellness business</option></select></label></div>
        <p class="bt-err" id="bt-err" role="alert" hidden></p>
        <button class="bt-btn bt-o bt-send" type="submit" id="bt-send">Let's talk business <span aria-hidden="true">→</span></button>
        <p class="bt-priv">We use your details only to reply and arrange the call. <a href="https://boostclub.ro/confidentialitate" target="_blank" rel="noopener">Privacy</a></p>
      </form>
      <div class="bt-done" id="bt-done" hidden tabindex="-1"><span aria-hidden="true">✓</span><h3>Thank you. Gabriel will message you.</h3><a class="bt-wa" id="bt-wa2" href="{_BT_WA}" target="_blank" rel="noopener">{_BT_WAICO}<span>Say hi on WhatsApp</span></a></div>
    </div>
  </div>
</section>

<footer class="bt-foot">
  <div class="bt-wrap">
    <div class="bt-ftop"><img src="bt/boost-team-lockup-on-dark.svg" alt="Boost Team. Build your best" width="230" height="42"><div><a href="index.html">boostclub.ro</a><a href="tel:+40726205752">+40 726 205 752</a><span>Strada Sevastopol 24, Sector 1, Bucharest</span></div></div>
    <p class="bt-legal">Gabriel Neshto, Herbalife Independent Distributor. Boost Team is a self-employed business opportunity, not employment and not a franchise. Results are not guaranteed and depend on effort, skill and time; you must be 18 or older. <a href="{_BT_SAGC}" target="_blank" rel="noopener">Herbalife's statement of typical earnings (Romania)</a> · <a href="https://boostclub.ro/confidentialitate" target="_blank" rel="noopener">Privacy</a> · <a href="https://boostclub.ro/termeni" target="_blank" rel="noopener">Terms</a></p>
  </div>
</footer>
'''

_bt_css = open(os.path.join(D, "bt", "boost-team.css"), encoding="utf-8").read()
_BT_ISO = dict(zip(_BT_MARKETS, "US CA MX GT HN SV NI CR PA DO JM TT PR CO VE EC PE BO BR CL AR UY PY GB IE FR ES PT IT DE NL BE CH AT DK SE NO FI IS PL CZ SK HU RO BG GR HR SI RS BA MK EE LV LT UA BY MD RU CY KZ KG UZ MN GE AM AZ IL TR LB ZA ZM BW NA GH SZ LS IN JP KR TW PH TH KH MY ID AU NZ".split()))
assert len(_BT_ISO) == len(_BT_MARKETS)
_bt_js = open(os.path.join(D, "bt", "boost-team-page.js"), encoding="utf-8").read().replace("__MARKETS__", "[" + ",".join('["' + m + '","' + _BT_ISO[m] + '"]' for m in _BT_MARKETS) + "]")

_bt_gsap = r"""
  gsap.from('.bt-herotx>*',{y:26,opacity:0,duration:1,stagger:.08,ease:'power3.out',delay:.1});
  gsap.from('.bt-hph1',{y:40,opacity:0,duration:1.2,ease:'power3.out',delay:.2});
  gsap.from('.bt-hph2',{y:60,opacity:0,duration:1.2,ease:'power3.out',delay:.4});
  gsap.to('.bt-hph1 img',{yPercent:6,ease:'none',scrollTrigger:{trigger:'.bt-hero',start:'top top',end:'bottom top',scrub:true}});"""

DESC["business.html"] = "Boost Team: build your own nutrition business with a mentor team. Open a Boost Club, your own nutrition club, or a wellness business without premises. Book a call with Gabriel Neshto."
page("business.html", "Boost Team · Partner program", "business", _bt_body, css=_bt_css, js=_bt_js, gsapjs=_bt_gsap, light=False, dark=False,
     cfg=' data-nonav="1" data-nofoot="1" data-norbar="1"',
     head='<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">',
     scripts='<script src="bt/vendor/d3.min.js"></script><script src="bt/vendor/topojson-client.min.js"></script>')
