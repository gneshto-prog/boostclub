import fs from "node:fs";
import path from "node:path";
import { benefits, brand, concepts, finalistRound, finalistSites, images, proof, reviews, steps } from "../../content/homepage-concepts.mjs";

const arrow = '<span aria-hidden="true">↗</span>';

function logo() {
  return '<span class="concept-logo" aria-label="Boost Club">B<span class="leaf">oo</span>st Club<span class="dot">.</span></span>';
}

function nav(modifier = "") {
  return `<header class="concept-nav ${modifier}">
    <a class="brand-link" href="../">${logo()}</a>
    <nav aria-label="Concept navigation">
      <a href="#experience">Experience</a>
      <a href="#method">Method</a>
      <a href="#stories">Stories</a>
    </nav>
    <a class="nav-cta" href="${brand.bookingHref}">Book free ${arrow}</a>
  </header>`;
}

function finalistNav(theme, activePage) {
  const site = finalistSites[theme];
  const modifier = theme === "organic-flow" ? "nav-organic" : "nav-cinematic";
  const links = site.pages
    .map((page) => `<a href="${page.slug}.html"${page.id === activePage ? ' aria-current="page"' : ""}>${page.label}</a>`)
    .join("");
  return `<header class="concept-nav ${modifier} finalist-nav">
    <a class="brand-link" href="${site.pages[0].slug}.html">${logo()}</a>
    <span class="finalist-edition">${site.label} / finalist</span>
    <a class="nav-cta" href="${brand.bookingHref}">Book free ${arrow}</a>
  </header>
  <nav class="theme-tabs ${theme === "organic-flow" ? "organic-tabs" : "cinematic-tabs"}" aria-label="${site.navLabel}">${links}</nav>
  <div class="scroll-progress" aria-hidden="true"><i></i></div>`;
}

function themeRibbon(theme) {
  const words = theme === "organic-flow"
    ? "ENERGY · CLARITY · COMMUNITY · CONSISTENCY · YOUR PACE · "
    : "ARRIVE · MEASURE · UNDERSTAND · RETURN · YOUR STORY · ";
  return `<div class="theme-ribbon ${theme === "organic-flow" ? "organic-ribbon" : "cinematic-ribbon"}" aria-hidden="true"><div>${words.repeat(3)}</div></div>`;
}

function faqMarkup(className) {
  const items = [
    ["free", "Is the first assessment really free?", "Yes. Your first body composition assessment and the explanation that follows are complimentary."],
    ["time", "How long should I allow?", "Plan for 30 to 40 minutes, so there is enough time to understand the numbers and ask questions."],
    ["prepare", "Do I need to prepare anything?", "Come as you are. Comfortable clothing and normal hydration are helpful, but no special preparation is required."],
    ["choice", "Will I be pressured to buy something?", "No. The first visit is designed to give you clarity. Any next step is discussed openly and remains your choice."],
  ];
  return `<div class="${className}">${items.map(([id, question, answer]) => `<details class="reveal" data-faq="${id}"><summary>${question}<span>+</span></summary><p>${answer}</p></details>`).join("")}</div>`;
}

function conceptDock(concept) {
  return `<aside class="concept-dock" aria-label="Concept preview controls">
    <a href="./" aria-label="Back to all concepts">All 10</a>
    <span>${concept.id} / 10</span>
    <button type="button" data-motion-toggle aria-pressed="true">Motion on</button>
  </aside>`;
}

function finalistRoundNav(finalist) {
  return `<header class="round-nav">
    <a class="brand-link" href="finalists.html">${logo()}</a>
    <span class="round-edition">${finalist.family} / finalist ${finalist.id}</span>
    <a class="nav-cta" href="${brand.bookingHref}">Book free ${arrow}</a>
  </header>
  <nav class="round-tabs" aria-label="Finalist navigation">
    <a href="#welcome">Welcome</a><a href="#experience">Experience</a><a href="#method">Method</a><a href="#stories">Stories</a><a href="#visit">Visit</a>
  </nav>
  <div class="scroll-progress" aria-hidden="true"><i></i></div>`;
}

function finalistRoundDock(finalist) {
  return `<aside class="concept-dock round-dock" aria-label="Concept preview controls">
    <a href="finalists.html" aria-label="Back to the six finalists">Final 6</a>
    <span>${finalist.id} / 06</span>
    <button type="button" data-motion-toggle aria-pressed="true">Motion on</button>
  </aside>`;
}

function roundRibbon(words) {
  return `<div class="round-ribbon" aria-hidden="true"><div>${(`${words} · `).repeat(8)}</div></div>`;
}

function proofMarkup(className = "proof-strip") {
  return `<div class="${className}">${proof.map((item) => `<div><strong>${item.value}</strong><span>${item.label}</span></div>`).join("")}</div>`;
}

function benefitMarkup(className = "benefit-grid") {
  return `<div class="${className}">${benefits.map((item) => `<article class="benefit-card reveal"><span>${item.number}</span><h3>${item.title}</h3><p>${item.copy}</p></article>`).join("")}</div>`;
}

function stepMarkup(className = "step-grid") {
  return `<div class="${className}">${steps.map((item) => `<article class="step-card reveal"><span>${item.number}</span><h3>${item.title}</h3><p>${item.copy}</p></article>`).join("")}</div>`;
}

function reviewMarkup(className = "review-grid") {
  return `<div class="${className}">${reviews.map((item) => `<blockquote class="review-card reveal"><div class="stars">★★★★★</div><p>“${item.quote}”</p><footer>${item.author} · Google</footer></blockquote>`).join("")}</div>`;
}

function finalCta(eyebrow = "Your first visit is free", title = "Meet your numbers. Meet your people.") {
  return `<section class="final-cta reveal">
    <span class="eyebrow">${eyebrow}</span>
    <h2>${title}</h2>
    <p>30 to 40 minutes. A complete body assessment, a clear explanation and one realistic next step.</p>
    <div class="cta-group">
      <a class="primary-cta" href="${brand.bookingHref}">Book the free assessment ${arrow}</a>
      <a class="text-cta" href="${brand.whatsappHref}">Message Gabriel on WhatsApp</a>
    </div>
  </section>`;
}

function footer() {
  return `<footer class="concept-footer">
    <div>${logo()}<p>${brand.location}</p></div>
    <div><a href="${brand.phoneHref}">${brand.phone}</a><a href="${brand.instagramHref}">@gabineshto</a></div>
    <p>Independent Herbalife Distributor. Results vary by person. © 2026 Boost Club.</p>
  </footer>`;
}

function kineticEditorial() {
  return `${nav("nav-editorial")}
  <main>
    <section class="ke-hero">
      <div class="ke-issue">BC / 01 <span>Bucharest wellness journal</span></div>
      <div class="ke-title reveal"><span>BE</span><span>YOUR</span><span>BEST.</span></div>
      <div class="ke-copy reveal"><span class="eyebrow">Nutrition is personal</span><h1>Not another health plan. A place that learns your name.</h1><p>Start with a free body composition assessment and turn real numbers into a routine you can live with.</p><a class="primary-cta" href="${brand.bookingHref}">Start free ${arrow}</a></div>
      <figure class="ke-photo reveal"><img src="${images.portrait}" alt="Gabriel Neshto inside Boost Club"><figcaption>Gabriel Neshto / Founder</figcaption></figure>
      <div class="ke-vertical">Victoria Square · 07:00 mornings · community energy</div>
    </section>
    <section class="ke-manifesto" id="experience"><p>Good health should feel less like discipline from the outside and more like momentum from the inside.</p><span>That is why Boost Club begins with people, not products.</span></section>
    <section class="ke-method" id="method"><header><span class="eyebrow">The issue</span><h2>Your body is not generic. Your starting point should not be either.</h2></header>${benefitMarkup("ke-benefits")}</section>
    <section class="ke-story" id="stories"><div><span class="eyebrow">Inside the club</span><h2>Real mornings.<br>Real people.<br>Real rhythm.</h2>${proofMarkup("ke-proof")}</div><img src="${images.consultation}" alt="A personal consultation at Boost Club"></section>
    ${reviewMarkup("ke-reviews")}${finalCta("Cover story: you", "Your next chapter starts with one honest measurement.")}
  </main>`;
}

function wellnessObservatory() {
  return `${nav("nav-observatory")}
  <main>
    <section class="wo-hero">
      <div class="wo-grid" aria-hidden="true"></div>
      <div class="wo-intro reveal"><span class="system-label">BOOST / BODY INTELLIGENCE / 001</span><h1>See what your body has been trying to tell you.</h1><p>A free, professional body composition assessment. Explained by a human, not hidden behind a dashboard.</p><div class="cta-group"><a class="primary-cta" href="${brand.bookingHref}">Begin your scan ${arrow}</a><a class="text-cta" href="#method">Explore the data</a></div></div>
      <div class="wo-orbit reveal">
        <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="orbit orbit-c"></div>
        <figure><img src="${images.founder}" alt="Gabriel Neshto, Boost Club founder"></figure>
        <span class="signal signal-a"><b>01</b> Measure</span><span class="signal signal-b"><b>02</b> Decode</span><span class="signal signal-c"><b>03</b> Act</span>
      </div>
      <div class="wo-status"><span class="pulse"></span> Assessments available this week</div>
    </section>
    <section class="wo-readout" id="experience">${proof.map((item, index) => `<article class="reveal"><span>0${index + 1}</span><strong>${item.value}</strong><p>${item.label}</p><i></i></article>`).join("")}</section>
    <section class="wo-scan" id="method"><div class="wo-scan-copy"><span class="system-label">LIVE EXPLANATION</span><h2>Your numbers become a plan only when they make sense.</h2><p>Muscle, fat, water, visceral fat and metabolic age. Gabriel translates the full picture into simple priorities built around your day.</p></div><div class="wo-console reveal"><header><span>BODY MAP</span><span>SESSION 30:00</span></header><div class="body-core"><div class="core-ring"></div><strong>YOU</strong><span>measured as a whole</span></div><div class="metric-lines"><span>Composition <b>analysed</b></span><span>Goals <b>mapped</b></span><span>Next step <b>clear</b></span></div></div></section>
    <section class="wo-protocol" id="stories"><span class="system-label">THE PROTOCOL</span>${stepMarkup("wo-steps")}</section>
    ${finalCta("Signal acquired", "Clarity is a powerful place to begin.")}
  </main>`;
}

function morningClub() {
  return `${nav("nav-morning")}
  <main>
    <section class="mc-hero">
      <div class="sun-disc" aria-hidden="true"></div>
      <div class="mc-copy reveal"><span class="eyebrow">Good mornings begin here</span><h1>Your healthiest habit might be a place you love coming back to.</h1><p>A warm community, a simple breakfast ritual and guidance that remembers the person behind the goal.</p><div class="cta-group"><a class="primary-cta" href="${brand.bookingHref}">Come for a free visit ${arrow}</a><a class="text-cta" href="${brand.whatsappHref}">Ask us anything</a></div></div>
      <figure class="mc-arch reveal"><img src="${images.consultation}" alt="A welcoming consultation at Boost Club"><figcaption><span>Open today</span> Morning sessions from 07:00</figcaption></figure>
      <div class="mc-note note-one">Shake.<br>Talk.<br>Reset.</div><div class="mc-note note-two">Five minutes from<br>Victoria Square</div>
    </section>
    <section class="mc-marquee" aria-label="Boost Club values"><span>ENERGY</span><i>✦</i><span>COMMUNITY</span><i>✦</i><span>CLARITY</span><i>✦</i><span>CONSISTENCY</span></section>
    <section class="mc-ritual" id="experience"><header><span class="eyebrow">Your new morning ritual</span><h2>Everything feels easier when you do not do it alone.</h2></header><div class="mc-day"><div><b>07:00</b><span>Doors open</span></div><div><b>07:10</b><span>Your shake and hello</span></div><div><b>07:20</b><span>Quick check-in</span></div><div><b>07:30</b><span>Leave energised</span></div></div></section>
    <section class="mc-community" id="method"><figure><img src="${images.family}" alt="The Boost Club wellness community"></figure><div><span class="eyebrow">People make the plan stick</span><h2>A club, not a clinic.</h2><p>You are welcomed by name. Your progress gets noticed. Small wins are shared. The atmosphere is relaxed, but the direction is always clear.</p>${proofMarkup("mc-proof")}</div></section>
    <section id="stories">${reviewMarkup("mc-reviews")}</section>${finalCta("Tomorrow morning can feel different", "Come in curious. Leave with a clear direction.")}
  </main>`;
}

function performanceBrutalist() {
  return `<div class="pb-ticker"><span>FREE BODY ASSESSMENT</span><span>BUCHAREST / SECTOR 1</span><span>NO GUESSWORK</span><span>REAL COMMUNITY</span></div>${nav("nav-brutalist")}
  <main>
    <section class="pb-hero">
      <div class="pb-code">BC-RO-0101<br>44.4625 N<br>26.0832 E</div>
      <div class="pb-headline reveal"><span>MEASURE.</span><span>UNDERSTAND.</span><span>MOVE.</span><h1>Wellness without the vague promises.</h1></div>
      <div class="pb-side reveal"><p>One professional assessment. One straight conversation. One direction you can actually follow.</p><a class="pb-button" href="${brand.bookingHref}">BOOK / FREE ${arrow}</a></div>
      <figure class="pb-photo"><img src="${images.training}" alt="Gabriel Neshto training"><figcaption>FOUNDER / ATHLETE / COACH</figcaption></figure>
    </section>
    <section class="pb-score" id="experience">${proof.map((item, index) => `<article><span>${index + 1}</span><strong>${item.value}</strong><p>${item.label}</p></article>`).join("")}</section>
    <section class="pb-system" id="method"><header><span>THE SYSTEM</span><h2>NO MAGIC.<br>JUST SIGNALS.</h2></header>${benefits.map((item) => `<article class="reveal"><span>${item.number}</span><h3>${item.title}</h3><p>${item.copy}</p><i>+</i></article>`).join("")}</section>
    <section class="pb-founder" id="stories"><img src="${images.mma}" alt="Gabriel Neshto during MMA training"><div><span>BUILT, NOT BOUGHT</span><h2>Gabriel knows what starting from zero feels like.</h2><p>More than 20 kg of muscle built through nutrition and training. Years of study. A family with 36 years in wellness. No borrowed confidence.</p><a href="../en/gabriel">READ THE FULL STORY ${arrow}</a></div></section>
    ${finalCta("YOUR MOVE", "The assessment is free. The insight is yours.")}
  </main>`;
}

function neoSwiss() {
  return `${nav("nav-swiss")}
  <main>
    <section class="ns-hero">
      <div class="ns-index">01<br><span>INTRODUCTION</span></div>
      <div class="ns-title reveal"><span class="eyebrow">Boost Club / Bucharest</span><h1>Personal wellness, precisely organised.</h1><p>Professional body composition data, clear guidance and a community designed to make consistency feel natural.</p><a class="primary-cta" href="${brand.bookingHref}">Reserve a free assessment ${arrow}</a></div>
      <figure class="ns-image reveal"><img src="${images.portrait}" alt="Gabriel Neshto in Boost Club"><figcaption>Fig. 01 / Personal guidance</figcaption></figure>
      <div class="ns-meta"><span>MON-FRI</span><b>07:00</b><span>SEVASTOPOL 24</span><b>SECTOR 1</b></div>
    </section>
    <section class="ns-statement" id="experience"><span>02 / PRINCIPLE</span><h2>A plan becomes useful when it is clear enough to repeat.</h2><p>We reduce the noise. You see where you are, understand what matters and leave knowing what comes next.</p></section>
    <section class="ns-modules" id="method"><header><span>03 / METHOD</span><h2>Four steps. No ambiguity.</h2></header>${stepMarkup("ns-steps")}</section>
    <section class="ns-proof" id="stories"><header><span>04 / EVIDENCE</span><h2>Trust, measured over time.</h2></header>${proofMarkup("ns-proof-grid")}</section>
    ${reviewMarkup("ns-reviews")}${finalCta("05 / APPOINTMENT", "A precise beginning, built around you.")}
  </main>`;
}

function cinematicJourney() {
  return `${finalistNav("cinematic-journey", "home")}
  <main class="finalist-home cinematic-home">
    <section class="cj-hero">
      <img class="cj-backdrop" src="${images.portrait}" alt="Gabriel Neshto welcoming clients at Boost Club">
      <div class="cj-shade"></div><div class="cj-frame"></div>
      <div class="cj-copy reveal"><span>BOOST CLUB PRESENTS</span><h1>The moment your health stops feeling like a solo project.</h1><p>A personal wellness experience in the heart of Bucharest.</p><a class="primary-cta" href="${brand.bookingHref}">Book your first scene ${arrow}</a></div>
      <div class="cj-caption"><b>01</b><span>THE ARRIVAL</span><i>Scroll to continue</i></div>
    </section>
    ${themeRibbon("cinematic-journey")}
    <section class="cj-chapter chapter-light" id="experience"><div class="cj-number">01</div><figure><img src="${images.consultation}" alt="Body composition consultation at Boost Club"></figure><div><span class="eyebrow">The first visit</span><h2>You arrive with questions.</h2><p>No judgement. No pressure. Just a welcoming space and a professional measurement of your real starting point.</p><a class="chapter-link" href="cinematic-journey-experience.html">Enter the experience ${arrow}</a></div></section>
    <section class="cj-chapter chapter-dark" id="method"><div class="cj-number">02</div><figure><img src="${images.founder}" alt="Gabriel Neshto, founder and consultant"></figure><div><span class="eyebrow">The conversation</span><h2>The numbers start making sense.</h2><p>Gabriel explains the full picture in plain language, connects it to your goal and helps you choose a realistic direction.</p><a class="chapter-link" href="cinematic-journey-method.html">See the method ${arrow}</a></div></section>
    <section class="cj-chapter chapter-blue" id="stories"><div class="cj-number">03</div><figure><img src="${images.family}" alt="Boost Club community"></figure><div><span class="eyebrow">The rhythm</span><h2>You stop doing it alone.</h2><p>Come back for the people, the morning energy and the kind of accountability that feels like belonging.</p><a class="chapter-link" href="cinematic-journey-stories.html">Meet the community ${arrow}</a></div></section>
    <section class="cj-credits">${proofMarkup("cj-proof")}<p>YOUR STORY / NEXT</p></section>${finalCta("Now showing in Victoria Square", "Your first visit costs nothing. It can change the whole plot.")}
  </main>`;
}

function organicFlow() {
  return `${finalistNav("organic-flow", "home")}
  <main class="finalist-home organic-home">
    <section class="of-hero">
      <div class="of-blob blob-one" aria-hidden="true"></div><div class="of-blob blob-two" aria-hidden="true"></div>
      <div class="of-copy reveal"><span class="eyebrow">Feel good. For real.</span><h1>A softer way to build stronger habits.</h1><p>Friendly guidance, real body insights and a community that makes healthy mornings something to look forward to.</p><a class="primary-cta" href="${brand.bookingHref}">Find your starting point ${arrow}</a></div>
      <figure class="of-photo reveal"><img src="${images.consultation}" alt="A friendly wellness consultation"><figcaption>Come exactly as you are</figcaption></figure>
      <div class="of-orbit-word word-one">ENERGY</div><div class="of-orbit-word word-two">SUPPORT</div><div class="of-orbit-word word-three">YOU</div>
    </section>
    ${themeRibbon("organic-flow")}
    <section class="of-wave" id="experience"><div><span class="eyebrow">A little structure. A lot of humanity.</span><h2>Wellness can be serious without feeling severe.</h2></div>${benefitMarkup("of-benefits")}<a class="chapter-link" href="organic-flow-experience.html">Explore the whole experience ${arrow}</a></section>
    <section class="of-playground" id="method"><header><span class="eyebrow">Choose your focus</span><h2>What would make today feel better?</h2></header><div class="goal-picker" role="group" aria-label="Choose a wellness goal"><button type="button" data-goal="energy" aria-pressed="true">More energy</button><button type="button" data-goal="strength" aria-pressed="false">More strength</button><button type="button" data-goal="balance" aria-pressed="false">More balance</button></div><div class="goal-answer" data-goal-answer><strong>Start with what fuels your day.</strong><span>We will map your current rhythm and find the easiest win to repeat.</span></div></section>
    <section class="of-community" id="stories"><div><img src="${images.family}" alt="The Boost Club community"></div><div><span class="eyebrow">The people effect</span><h2>Small steps grow faster in good company.</h2>${proofMarkup("of-proof")}<a class="chapter-link" href="organic-flow-stories.html">Read the real stories ${arrow}</a></div></section>
    ${finalCta("Your body. Your pace.", "Let the first step feel light.")}
  </main>`;
}

function organicExperience() {
  return `${finalistNav("organic-flow", "experience")}
  <main class="finalist-subpage organic-subpage">
    <section class="of-page-hero">
      <div class="of-blob blob-one" aria-hidden="true"></div><div class="of-blob blob-two" aria-hidden="true"></div>
      <div class="reveal"><span class="eyebrow">The experience</span><h1>A morning that meets you where you are.</h1><p>No white coats. No performance. Just useful insight, a warm welcome and a place that is easy to return to.</p></div>
      <figure class="organic-visual reveal"><img src="${images.consultation}" alt="A relaxed personal consultation at Boost Club"><figcaption>Sevastopol 24 / Sector 1</figcaption></figure>
    </section>
    ${themeRibbon("organic-flow")}
    <section class="of-rhythm">
      <header class="reveal"><span class="eyebrow">A simple rhythm</span><h2>Your first visit, from hello to clear next step.</h2></header>
      <div class="of-timeline">
        <article class="reveal"><b>00</b><span>Arrive</span><h3>Walk in as you are.</h3><p>Settle in, share what brought you here and tell us what you want to feel different.</p></article>
        <article class="reveal"><b>10</b><span>Measure</span><h3>See the real starting point.</h3><p>A professional body composition assessment gives the conversation something concrete.</p></article>
        <article class="reveal"><b>20</b><span>Understand</span><h3>Make the numbers human.</h3><p>Gabriel explains what matters, what does not and how it connects to your goal.</p></article>
        <article class="reveal"><b>35</b><span>Leave clear</span><h3>Take one realistic direction.</h3><p>No overloaded plan. Just a next step simple enough to remember tomorrow morning.</p></article>
      </div>
    </section>
    <section class="of-senses">
      <div class="reveal"><span class="eyebrow">What it feels like</span><h2>Thoughtful enough to be useful. Relaxed enough to feel natural.</h2></div>
      <div class="of-sense-cards"><article class="reveal"><span>01</span><h3>Welcomed</h3><p>Someone knows your name, your goal and the context around it.</p></article><article class="reveal"><span>02</span><h3>Understood</h3><p>Your questions get plain answers without clinical language or judgement.</p></article><article class="reveal"><span>03</span><h3>Included</h3><p>The morning community turns consistency into a shared rhythm.</p></article></div>
    </section>
    <section class="of-wide-story"><figure><img src="${images.family}" alt="The welcoming Boost Club community"></figure><div class="reveal"><span class="eyebrow">Stay for the people</span><h2>The assessment opens the door. The atmosphere brings you back.</h2><a class="primary-cta" href="organic-flow-visit.html">Plan your visit ${arrow}</a></div></section>
    ${finalCta("A free first visit", "Come curious. Leave knowing what comes next.")}
  </main>`;
}

function organicMethod() {
  return `${finalistNav("organic-flow", "method")}
  <main class="finalist-subpage organic-subpage">
    <section class="of-page-hero of-method-hero">
      <div class="of-blob blob-one" aria-hidden="true"></div>
      <div class="reveal"><span class="eyebrow">The method</span><h1>Useful numbers. Human translation. Your pace.</h1><p>The process is structured, but the direction is personal. We measure first, listen closely and simplify what comes next.</p></div>
      <div class="of-body-map reveal"><div class="body-map-orbit"><strong>YOU</strong><span>the whole picture</span></div><ul><li>Muscle mass <b>measured</b></li><li>Body fat <b>understood</b></li><li>Water balance <b>considered</b></li><li>Metabolic age <b>explained</b></li></ul></div>
    </section>
    <section class="of-method-path"><header class="reveal"><span class="eyebrow">Four gentle moves</span><h2>A clear process, without the pressure.</h2></header>${stepMarkup("of-full-steps")}</section>
    <section class="of-principles"><div class="reveal"><span class="eyebrow">Built for real life</span><h2>Three principles keep the plan grounded.</h2></div><div><article class="reveal"><span>Enough</span><h3>Start with enough clarity to act.</h3><p>You do not need every answer today. You need the right first answer.</p></article><article class="reveal"><span>Repeatable</span><h3>Make the next step easy to repeat.</h3><p>Consistency grows from routines that fit mornings, work and family life.</p></article><article class="reveal"><span>Personal</span><h3>Keep your goal at the centre.</h3><p>Your data informs the conversation. It never replaces your lived experience.</p></article></div></section>
    <section class="of-method-photo"><figure><img src="${images.founder}" alt="Gabriel Neshto explaining a personal wellness plan"></figure><div class="reveal"><span class="eyebrow">Your guide</span><h2>Science is only helpful when someone makes it understandable.</h2><p>Gabriel combines professional assessment, personal experience and a community-first approach to turn information into a practical direction.</p><a class="chapter-link" href="organic-flow-stories.html">See what members say ${arrow}</a></div></section>
    ${finalCta("Clarity before commitment", "Begin with the full picture, then choose your pace.")}
  </main>`;
}

function organicStories() {
  return `${finalistNav("organic-flow", "stories")}
  <main class="finalist-subpage organic-subpage">
    <section class="of-stories-hero"><div class="reveal"><span class="eyebrow">Real people, real mornings</span><h1>Progress feels better when someone notices.</h1><p>Every story starts somewhere different. The common thread is practical guidance, steady support and a place people enjoy returning to.</p></div>${proofMarkup("of-story-proof")}</section>
    <section class="of-story-mosaic"><figure class="reveal"><img src="${images.resultOne}" alt="A Boost Club member progress story"><figcaption>Consistency</figcaption></figure><blockquote class="reveal"><div>★★★★★</div><p>“Gabriel was incredibly welcoming, kind and supportive from the very beginning.”</p><span>Andreea Popa</span></blockquote><figure class="reveal"><img src="${images.resultTwo}" alt="A Boost Club community progress story"><figcaption>Support</figcaption></figure><blockquote class="reveal"><div>★★★★★</div><p>“Friendly people, good energy and coaching you can actually understand.”</p><span>Kevin R.</span></blockquote><figure class="reveal"><img src="${images.resultThree}" alt="A Boost Club member wellbeing story"><figcaption>Momentum</figcaption></figure></section>
    <p class="story-disclaimer">Individual results vary. Images show personal experiences and do not guarantee a specific outcome.</p>
    <section class="of-community-notes"><header class="reveal"><span class="eyebrow">What people remember</span><h2>The feeling around the progress matters too.</h2></header>${reviewMarkup("of-full-reviews")}</section>
    <section class="of-story-invite"><img src="${images.consultation}" alt="A personal Boost Club consultation"><div class="reveal"><span class="eyebrow">Your story can start quietly</span><h2>One visit. One honest conversation. No pressure to know the ending.</h2><a class="primary-cta" href="organic-flow-visit.html">See how to visit ${arrow}</a></div></section>
    ${finalCta("Your starting point is enough", "Come in exactly as you are.")}
  </main>`;
}

function organicVisit() {
  return `${finalistNav("organic-flow", "visit")}
  <main class="finalist-subpage organic-subpage">
    <section class="of-visit-hero"><div class="reveal"><span class="eyebrow">Visit Boost Club</span><h1>Your first visit is free. Your next step stays yours.</h1><p>Find us near Victoria Square for a welcoming 30 to 40 minute body composition assessment and conversation.</p><div class="cta-group"><a class="primary-cta" href="${brand.bookingHref}">Choose a time ${arrow}</a><a class="text-cta" href="${brand.whatsappHref}">Ask on WhatsApp</a></div></div><figure class="organic-visual reveal"><img src="${images.consultation}" alt="Inside a consultation at Boost Club"><figcaption>Strada Sevastopol 24</figcaption></figure></section>
    <section class="of-visit-grid"><article class="reveal"><span>Where</span><h2>Five minutes from Victoria Square.</h2><p>Strada Sevastopol 24<br>Sector 1, Bucharest</p><a href="https://maps.google.com/?q=Strada+Sevastopol+24+Bucharest">Open in Maps ${arrow}</a></article><article class="reveal"><span>When</span><h2>Build it into your morning.</h2><dl><div><dt>Monday to Friday</dt><dd>07:00 onward</dd></div><div><dt>First consultation</dt><dd>30 to 40 min</dd></div><div><dt>Booking</dt><dd>Online or WhatsApp</dd></div></dl></article><article class="reveal"><span>Talk</span><h2>A real person answers.</h2><p>Call or message Gabriel if you want to ask something before choosing a time.</p><a href="${brand.phoneHref}">${brand.phone}</a></article></section>
    <section class="of-faq"><header class="reveal"><span class="eyebrow">Before you come</span><h2>Everything you might want to ask.</h2></header>${faqMarkup("of-faq-list")}</section>
    ${finalCta("Sevastopol 24 / Sector 1", "A warm hello and a clearer direction are waiting.")}
  </main>`;
}

function cinematicExperience() {
  return `${finalistNav("cinematic-journey", "experience")}
  <main class="finalist-subpage cinematic-subpage">
    <section class="cj-page-hero"><img src="${images.consultation}" alt="The first Boost Club consultation"><div class="cj-shade"></div><div class="cj-frame"></div><div class="reveal"><span>CHAPTER ONE / THE EXPERIENCE</span><h1>Every first visit has a turning point.</h1><p>This one begins when vague questions become something you can finally see.</p></div><b>01</b></section>
    ${themeRibbon("cinematic-journey")}
    <section class="cj-scene chapter-cream"><div class="scene-index">SCENE 01<br>00:00</div><figure class="cinematic-frame reveal"><img src="${images.consultation}" alt="Arriving at Boost Club"></figure><div class="reveal"><span class="eyebrow">The arrival</span><h2>No performance required.</h2><p>You are welcomed into a relaxed club, asked what matters to you and given space to tell the honest version.</p></div></section>
    <section class="cj-scene chapter-deep"><div class="scene-index">SCENE 02<br>00:10</div><figure class="cinematic-frame reveal"><img src="${images.founder}" alt="Gabriel explaining body composition results"></figure><div class="reveal"><span class="eyebrow">The reveal</span><h2>The numbers find their meaning.</h2><p>Your body composition is measured, placed in context and translated into language that feels useful immediately.</p></div></section>
    <section class="cj-scene chapter-green"><div class="scene-index">SCENE 03<br>00:35</div><figure class="cinematic-frame reveal"><img src="${images.family}" alt="The wider Boost Club community"></figure><div class="reveal"><span class="eyebrow">The return</span><h2>The plan becomes a place.</h2><p>What brings you back is not a dashboard. It is the welcome, the rhythm and the feeling that your progress has witnesses.</p></div></section>
    <section class="cj-pullquote reveal"><span>THE FEELING TO REMEMBER</span><blockquote>“I do not have to figure this out alone.”</blockquote></section>
    ${finalCta("Chapter one is complimentary", "See what your own turning point could feel like.")}
  </main>`;
}

function cinematicMethod() {
  return `${finalistNav("cinematic-journey", "method")}
  <main class="finalist-subpage cinematic-subpage">
    <section class="cj-page-hero cj-method-cover"><img src="${images.founder}" alt="Gabriel Neshto guiding a Boost Club consultation"><div class="cj-shade"></div><div class="cj-frame"></div><div class="reveal"><span>CHAPTER TWO / THE METHOD</span><h1>The plot becomes clear when the signals connect.</h1><p>Measure the full picture. Translate it honestly. Choose one direction that belongs in real life.</p></div><b>02</b></section>
    <section class="cj-method-acts"><header class="reveal"><span>THE FOUR ACT STRUCTURE</span><h2>No mystery. Just a well-directed beginning.</h2></header><div>${steps.map((item) => `<article class="reveal"><span>ACT ${item.number}</span><h3>${item.title}</h3><p>${item.copy}</p></article>`).join("")}</div></section>
    <section class="cj-measurement"><div class="cj-measurement-copy reveal"><span class="eyebrow">What we look at</span><h2>Not one number. The relationship between them.</h2><p>Muscle, body fat, water, visceral fat and metabolic age are considered together, then connected back to your priorities.</p></div><div class="cj-reel reveal"><div><span>MUSCLE</span><b>01</b></div><div><span>BODY FAT</span><b>02</b></div><div><span>WATER</span><b>03</b></div><div><span>METABOLIC AGE</span><b>04</b></div><i></i></div></section>
    <section class="cj-director"><figure class="cinematic-frame"><img src="${images.mma}" alt="Gabriel Neshto during athletic training"></figure><div class="reveal"><span class="eyebrow">The guide behind the process</span><h2>Built through experience. Explained without ego.</h2><p>Gabriel brings professional accreditation, years of study and his own transformation into a method centred on clear communication.</p><a class="chapter-link" href="cinematic-journey-stories.html">Continue to the stories ${arrow}</a></div></section>
    ${finalCta("The method begins with listening", "Your numbers deserve a human explanation.")}
  </main>`;
}

function cinematicStories() {
  return `${finalistNav("cinematic-journey", "stories")}
  <main class="finalist-subpage cinematic-subpage">
    <section class="cj-page-hero cj-stories-cover"><img src="${images.family}" alt="People in the Boost Club wellness community"><div class="cj-shade"></div><div class="cj-frame"></div><div class="reveal"><span>CHAPTER THREE / THE STORIES</span><h1>The credits belong to the people who kept going.</h1><p>Progress is personal. Community is what gives it a soundtrack.</p></div><b>03</b></section>
    <section class="cj-testimonials"><header class="reveal"><span>VOICES FROM THE CLUB</span><h2>Three honest reviews. One unmistakable feeling.</h2></header>${reviewMarkup("cj-full-reviews")}</section>
    <section class="cj-filmstrip"><figure class="reveal"><img src="${images.resultOne}" alt="Boost Club member progress"><figcaption>01 / CONSISTENCY</figcaption></figure><figure class="reveal"><img src="${images.resultTwo}" alt="Boost Club member progress"><figcaption>02 / SUPPORT</figcaption></figure><figure class="reveal"><img src="${images.resultThree}" alt="Boost Club member progress"><figcaption>03 / MOMENTUM</figcaption></figure></section>
    <p class="story-disclaimer cinematic-disclaimer">Individual results vary. Images show personal experiences and do not guarantee a specific outcome.</p>
    <section class="cj-credits cj-story-credits">${proofMarkup("cj-proof")}<p>THE NEXT NAME IN THE CREDITS COULD BE YOURS</p><a class="primary-cta" href="cinematic-journey-visit.html">Plan the first scene ${arrow}</a></section>
    ${finalCta("No perfect ending required", "Just a first scene that feels possible.")}
  </main>`;
}

function cinematicVisit() {
  return `${finalistNav("cinematic-journey", "visit")}
  <main class="finalist-subpage cinematic-subpage">
    <section class="cj-page-hero cj-visit-cover"><img src="${images.portrait}" alt="Gabriel Neshto welcoming a visitor"><div class="cj-shade"></div><div class="cj-frame"></div><div class="reveal"><span>NOW SHOWING / VICTORIA SQUARE</span><h1>Your first scene is already set.</h1><p>Thirty to forty minutes. A complete assessment. A conversation that puts you at the centre.</p><div class="cta-group"><a class="primary-cta" href="${brand.bookingHref}">Book the free visit ${arrow}</a><a class="text-cta" href="${brand.whatsappHref}">Message Gabriel</a></div></div><b>04</b></section>
    <section class="cj-showtimes"><header class="reveal"><span>LOCATION / SHOWTIMES / CONTACT</span><h2>Everything you need before you arrive.</h2></header><div><article class="reveal"><span>LOCATION</span><h3>Strada Sevastopol 24</h3><p>Sector 1, Bucharest<br>Five minutes from Victoria Square</p><a href="https://maps.google.com/?q=Strada+Sevastopol+24+Bucharest">Open in Maps ${arrow}</a></article><article class="reveal"><span>SESSION</span><h3>30 to 40 minutes</h3><p>Morning appointments available Monday to Friday from 07:00 onward.</p><a href="${brand.bookingHref}">See available times ${arrow}</a></article><article class="reveal"><span>CONTACT</span><h3>${brand.phone}</h3><p>Call directly or send a WhatsApp message before you book.</p><a href="${brand.whatsappHref}">Start a conversation ${arrow}</a></article></div></section>
    <section class="cj-faq"><header class="reveal"><span class="eyebrow">Before the opening scene</span><h2>The practical questions, answered.</h2></header>${faqMarkup("cj-faq-list")}</section>
    <section class="cj-closing-frame"><figure class="cinematic-frame"><img src="${images.consultation}" alt="A welcoming first Boost Club visit"></figure><div class="reveal"><span>FINAL CARD</span><h2>Arrive with questions. Leave with direction.</h2><a class="primary-cta" href="${brand.bookingHref}">Reserve your visit ${arrow}</a></div></section>
    ${finalCta("Boost Club / Bucharest", "Your story deserves a strong beginning.")}
  </main>`;
}

function auroraGlass() {
  return `${nav("nav-glass")}
  <main>
    <section class="ag-hero">
      <div class="ag-aurora aurora-one"></div><div class="ag-aurora aurora-two"></div><div class="ag-stars"></div>
      <div class="ag-copy reveal"><span class="system-label">PERSONAL WELLNESS / REIMAGINED</span><h1>Your body is full of signals. We make them visible.</h1><p>Precision body insights, translated into a simple plan by someone who knows your name.</p><div class="cta-group"><a class="primary-cta" href="${brand.bookingHref}">Unlock your free assessment ${arrow}</a><a class="glass-link" href="#method">See what is measured</a></div></div>
      <div class="ag-dashboard reveal">
        <figure><img src="${images.portrait}" alt="Gabriel Neshto at Boost Club"></figure>
        <div class="ag-chip chip-one"><span>Guidance</span><b>1:1</b></div><div class="ag-chip chip-two"><span>Session</span><b>30-40m</b></div>
        <div class="ag-reading"><span>BODY COMPOSITION</span><div class="ag-bars"><i></i><i></i><i></i><i></i><i></i></div><p>Measured. Explained. Personalised.</p></div>
      </div>
    </section>
    <section class="ag-trust" id="experience">${proofMarkup("ag-proof")}</section>
    <section class="ag-insights" id="method"><header><span class="system-label">WHAT BECOMES CLEAR</span><h2>One session. A much sharper picture.</h2></header><div class="ag-insight-grid"><article><span>01</span><h3>Body composition</h3><p>Understand muscle, body fat, water and visceral fat together.</p></article><article><span>02</span><h3>Goal alignment</h3><p>Connect the numbers to the outcome that matters to you.</p></article><article><span>03</span><h3>Daily system</h3><p>Turn insight into a routine simple enough to maintain.</p></article></div></section>
    <section class="ag-human" id="stories"><figure><img src="${images.founder}" alt="Gabriel Neshto, personal wellness consultant"></figure><div><span class="system-label">HUMAN IN THE LOOP</span><h2>Advanced insight. Entirely human guidance.</h2><p>The interface is not the experience. The conversation is. Gabriel makes the science useful, personal and easy to act on.</p><a href="../en/gabriel">Meet Gabriel ${arrow}</a></div></section>
    ${finalCta("Your data stays personal", "The clearest version of your starting point.")}
  </main>`;
}

function proofWall() {
  return `${nav("nav-proofwall")}
  <main>
    <section class="pw-hero">
      <div class="pw-centre reveal"><span class="eyebrow">Do not take our word for it</span><h1>Feel the proof.</h1><p>Real people. Real mornings. Real momentum in the centre of Bucharest.</p><a class="primary-cta" href="${brand.bookingHref}">Join your first session ${arrow}</a></div>
      <figure class="pw-tile tile-a"><img src="${images.resultOne}" alt="Boost Club transformation"><figcaption>START / PROGRESS</figcaption></figure>
      <blockquote class="pw-tile tile-b"><div>★★★★★</div><p>“The positive energy is impossible to miss.”</p><span>Lana</span></blockquote>
      <figure class="pw-tile tile-c"><img src="${images.consultation}" alt="Consultation at Boost Club"></figure>
      <div class="pw-tile tile-d"><strong>5.0</strong><span>on Google</span></div>
      <figure class="pw-tile tile-e"><img src="${images.resultTwo}" alt="Boost Club member result"></figure>
      <blockquote class="pw-tile tile-f"><p>“Easy to understand and apply in everyday life.”</p><span>Andreea</span></blockquote>
    </section>
    <section class="pw-band"><span>THE CLUB PEOPLE RECOMMEND TO PEOPLE THEY CARE ABOUT</span></section>
    <section class="pw-evidence" id="experience"><header><span class="eyebrow">Evidence over promises</span><h2>Progress looks different on everyone. Confidence looks unmistakable.</h2></header><div class="pw-results"><figure><img src="${images.resultOne}" alt="Member transformation"><span>Consistency</span></figure><figure><img src="${images.resultTwo}" alt="Member transformation"><span>Support</span></figure><figure><img src="${images.resultThree}" alt="Member transformation"><span>Momentum</span></figure></div><p class="disclaimer">Individual results vary. Images represent personal experiences and do not guarantee a specific outcome.</p></section>
    <section class="pw-method" id="method"><h2>What everyone starts with.</h2>${stepMarkup("pw-steps")}</section>
    <section class="pw-voices" id="stories"><header><span>UNFILTERED VOICES</span><h2>Five stars, in their own words.</h2></header>${reviewMarkup("pw-reviews")}</section>
    ${finalCta("Add your own story", "Start with a free assessment, not a commitment.")}
  </main>`;
}

function quietLuxury() {
  return `${nav("nav-luxury")}
  <main>
    <section class="ql-hero">
      <div class="ql-copy reveal"><span class="eyebrow">A private introduction to better habits</span><h1>Wellness, with room to breathe.</h1><p>One thoughtful consultation. A clear view of your body today. Guidance designed around the life you want to keep living.</p><div class="cta-group"><a class="primary-cta" href="${brand.bookingHref}">Arrange your complimentary visit ${arrow}</a><a class="text-cta" href="#experience">Discover the experience</a></div></div>
      <figure class="ql-portrait reveal"><img src="${images.founder}" alt="Gabriel Neshto, founder of Boost Club"><figcaption>Gabriel Neshto<br>Founder and ISSA accredited consultant</figcaption></figure>
      <div class="ql-monogram" aria-hidden="true">B</div>
    </section>
    <section class="ql-intro" id="experience"><span class="eyebrow">The Boost Club approach</span><h2>Personal attention is not an extra. It is the entire point.</h2><p>We created a quiet, welcoming place where data is explained with care, goals are treated with respect and progress is allowed to be personal.</p></section>
    <section class="ql-service" id="method"><div><span>01</span><h3>A considered assessment</h3><p>Your body composition is measured professionally, without judgement or rushed conclusions.</p></div><div><span>02</span><h3>An honest conversation</h3><p>Every number is translated into clear language and connected to your own priorities.</p></div><div><span>03</span><h3>A sustainable direction</h3><p>You leave with a simple next step designed to work beyond the consultation room.</p></div></section>
    <section class="ql-founder" id="stories"><figure><img src="${images.family}" alt="The Neshto family wellness heritage"></figure><div><span class="eyebrow">A 36 year family practice</span><h2>Experience that feels present, not inherited.</h2><p>Gabriel brings three generations of wellness knowledge into a contemporary, deeply personal club experience in central Bucharest.</p><a href="../en/gabriel">Read Gabriel's story ${arrow}</a></div></section>
    <section class="ql-quote"><blockquote>“Information is only useful when it becomes simple enough to live.”</blockquote><span>Gabriel Neshto</span></section>
    ${finalCta("Complimentary first consultation", "A calm beginning can still be a powerful one.")}
  </main>`;
}

function finalistOrganicSoftCurrent(finalist) {
  return `${finalistRoundNav(finalist)}
  <main class="round-page soft-current">
    <section class="sc-hero" id="welcome">
      <div class="sc-orb sc-orb-a" aria-hidden="true"></div><div class="sc-orb sc-orb-b" aria-hidden="true"></div>
      <div class="sc-copy reveal"><span class="eyebrow">A softer way forward</span><h1>Feel well, without forcing the pace.</h1><p>Begin with a clear picture of your body, then find a rhythm that feels natural enough to keep.</p><div class="cta-group"><a class="primary-cta" href="${brand.bookingHref}">Book a free assessment ${arrow}</a><a class="text-cta" href="#experience">Follow the flow</a></div></div>
      <figure class="sc-portrait round-parallax reveal"><img src="${images.consultation}" alt="A relaxed personal consultation at Boost Club"><figcaption>30 to 40 quiet, useful minutes</figcaption></figure>
      <span class="sc-float-note note-a">Your pace</span><span class="sc-float-note note-b">Real clarity</span>
    </section>
    ${roundRibbon("MEASURE GENTLY · UNDERSTAND CLEARLY · MOVE NATURALLY")}
    <section class="sc-welcome round-section" id="experience">
      <header class="round-heading reveal"><span class="eyebrow">A gentle current</span><h2>Everything you need to begin. Nothing you need to perform.</h2><p>The experience moves from curiosity to clarity, one comfortable step at a time.</p></header>
      <div class="sc-petals">${benefits.map((item) => `<article class="round-card reveal"><span>${item.number}</span><h3>${item.title}</h3><p>${item.copy}</p></article>`).join("")}</div>
    </section>
    <section class="sc-path" id="method">
      <div class="sc-path-copy reveal"><span class="eyebrow">The first visit</span><h2>A smooth line from question to next step.</h2><p>Your data matters, but the conversation gives it meaning. Gabriel helps you understand the full picture and choose one realistic move.</p></div>
      <div class="sc-current" aria-hidden="true"><i></i></div>
      <div class="sc-path-steps">${steps.map((item) => `<article class="reveal"><b>${item.number}</b><div><h3>${item.title}</h3><p>${item.copy}</p></div></article>`).join("")}</div>
    </section>
    <section class="sc-community" id="stories">
      <figure class="round-parallax reveal"><img src="${images.family}" alt="The Boost Club community together"></figure>
      <div class="reveal"><span class="eyebrow">People create momentum</span><h2>A place that notices when you come back.</h2><p>Friendly faces, honest encouragement and mornings that feel a little lighter together.</p>${proofMarkup("round-proof")}</div>
    </section>
    <section class="sc-voices">${reviewMarkup("round-reviews")}</section>
    <div id="visit">${finalCta("Your first visit is free", "A calm beginning. A direction you can trust.")}</div>
  </main>`;
}

function finalistOrganicBotanicalRhythm(finalist) {
  return `${finalistRoundNav(finalist)}
  <main class="round-page botanical-rhythm">
    <section class="br-hero" id="welcome">
      <div class="br-contour" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="br-intro reveal"><span class="eyebrow">Wellness, grown around you</span><h1>Follow what feels alive.</h1><p>A body assessment, a human conversation and an organic rhythm shaped around real life.</p><a class="primary-cta" href="${brand.bookingHref}">Find your starting point ${arrow}</a></div>
      <figure class="br-main-photo round-parallax reveal"><img src="${images.portrait}" alt="Gabriel Neshto welcoming visitors to Boost Club"></figure>
      <figure class="br-small-photo reveal"><img src="${images.family}" alt="A warm Boost Club community moment"></figure>
      <div class="br-seed"><span>01</span><b>Start where you are</b></div>
    </section>
    ${roundRibbon("ROOTED IN CLARITY · GUIDED BY PEOPLE · BUILT TO GROW")}
    <section class="br-trail round-section" id="experience">
      <header class="round-heading reveal"><span class="eyebrow">The path through the club</span><h2>One continuous experience, from first hello to lasting habit.</h2></header>
      <div class="br-trail-line" aria-hidden="true"></div>
      ${steps.map((item, index) => `<article class="br-trail-stop reveal"><span>${item.number}</span><div><small>${["ARRIVE", "DISCOVER", "TRANSLATE", "GROW"][index]}</small><h3>${item.title}</h3><p>${item.copy}</p></div></article>`).join("")}
    </section>
    <section class="br-canopy" id="method">
      <div class="reveal"><span class="eyebrow">A full picture</span><h2>Useful signals, seen in relation.</h2><p>Muscle, body fat, water and metabolic age become a meaningful map when someone explains how the pieces connect.</p><a class="text-cta" href="${brand.bookingHref}">See your own map ${arrow}</a></div>
      <div class="br-rings reveal"><i></i><i></i><i></i><strong>YOU</strong><span>Body · goal · routine</span></div>
    </section>
    <section class="br-stories" id="stories">
      <header class="round-heading reveal"><span class="eyebrow">The people in the landscape</span><h2>Progress grows better in good company.</h2></header>
      <div class="br-story-grid"><figure class="reveal"><img src="${images.resultOne}" alt="A Boost Club member progress story"><figcaption>Consistency</figcaption></figure><figure class="reveal"><img src="${images.consultation}" alt="Personal guidance inside Boost Club"><figcaption>Clarity</figcaption></figure><blockquote class="reveal"><div>★★★★★</div><p>“Amazing and positive environment. The best coach and a great community.”</p><span>Lana G. · Google</span></blockquote></div>
      <p class="story-disclaimer">Individual results vary. Images show personal experiences and do not guarantee a specific outcome.</p>
    </section>
    <div id="visit">${finalCta("Plant the first seed", "Thirty minutes can change the shape of what comes next.")}</div>
  </main>`;
}

function finalistMorningSunriseRitual(finalist) {
  return `${finalistRoundNav(finalist)}
  <main class="round-page sunrise-ritual">
    <section class="sr-hero" id="welcome">
      <div class="sr-sun" aria-hidden="true"></div>
      <div class="sr-copy reveal"><span class="eyebrow">Good morning, Bucharest</span><h1>A better day can start around one friendly table.</h1><p>Drop in for a body assessment, stay for the warm welcome and leave with a simple plan for the day ahead.</p><div class="cta-group"><a class="primary-cta" href="${brand.bookingHref}">Join a free morning ${arrow}</a><a class="text-cta" href="#experience">See the ritual</a></div></div>
      <figure class="sr-arch round-parallax reveal"><img src="${images.consultation}" alt="A friendly morning consultation at Boost Club"><figcaption><b>07:00</b><span>Doors open</span></figcaption></figure>
      <div class="sr-sticker sticker-one">Come<br>as you are</div><div class="sr-sticker sticker-two">5 min from<br>Victoria Square</div>
    </section>
    ${roundRibbon("SHAKE · TALK · LEARN · LAUGH · RESET · RETURN")}
    <section class="sr-schedule" id="experience">
      <header class="round-heading reveal"><span class="eyebrow">Your morning, made easier</span><h2>A small ritual with a surprisingly big lift.</h2></header>
      <div class="sr-times">${["07:00|A warm hello", "07:10|Your breakfast ritual", "07:20|A personal check-in", "07:30|Back into your day"].map((entry) => { const [time, label] = entry.split("|"); return `<article class="reveal"><b>${time}</b><span>${label}</span><i></i></article>`; }).join("")}</div>
    </section>
    <section class="sr-table" id="method">
      <figure class="reveal"><img src="${images.family}" alt="The friendly Boost Club wellness community"></figure>
      <div class="reveal"><span class="eyebrow">The club feeling</span><h2>Guidance feels different when it comes with belonging.</h2><p>We measure where you are, listen to where you want to go and help build a repeatable routine with people around you.</p>${benefitMarkup("sr-benefits")}</div>
    </section>
    <section class="sr-notes" id="stories"><div class="sr-note-title reveal"><span class="eyebrow">Notes from the table</span><h2>What people take into the rest of their day.</h2></div>${reviews.map((item, index) => `<blockquote class="reveal note-${index + 1}"><div>★★★★★</div><p>“${item.quote}”</p><footer>${item.author}</footer></blockquote>`).join("")}</section>
    <div id="visit">${finalCta("Tomorrow morning is open", "Come for the clarity. Stay for how it feels.")}</div>
  </main>`;
}

function finalistMorningNeighbourhoodTable(finalist) {
  return `${finalistRoundNav(finalist)}
  <main class="round-page neighbourhood-table">
    <section class="nt-hero" id="welcome">
      <div class="nt-headline reveal"><span class="eyebrow">Your friendly corner of Bucharest</span><h1>Pull up a chair. We saved you a place.</h1><p>Boost Club is a welcoming morning community where nutrition gets simpler, progress gets noticed and everybody starts somewhere.</p><a class="primary-cta" href="${brand.bookingHref}">Say hello for free ${arrow}</a></div>
      <div class="nt-collage">
        <figure class="nt-photo photo-one round-parallax reveal"><img src="${images.family}" alt="People together in the Boost Club community"><figcaption>Morning people</figcaption></figure>
        <figure class="nt-photo photo-two reveal"><img src="${images.portrait}" alt="Gabriel Neshto inside Boost Club"><figcaption>Your host, Gabriel</figcaption></figure>
        <span class="nt-pin pin-one">No judgement</span><span class="nt-pin pin-two">Plenty of questions</span><span class="nt-pin pin-three">Good energy</span>
      </div>
    </section>
    ${roundRibbon("KNOWN BY NAME · SUPPORTED IN PERSON · WELCOME TOMORROW")}
    <section class="nt-board" id="experience">
      <header class="round-heading reveal"><span class="eyebrow">On the noticeboard</span><h2>Four things happening around the table.</h2></header>
      <div class="nt-board-grid">${steps.map((item, index) => `<article class="reveal card-${index + 1}"><span>${item.number}</span><h3>${item.title}</h3><p>${item.copy}</p><small>BOOST CLUB / MORNING NOTE</small></article>`).join("")}</div>
    </section>
    <section class="nt-menu" id="method">
      <div class="reveal"><span class="eyebrow">Today at the club</span><h2>Clear numbers, simple choices and a little more confidence.</h2></div>
      <div class="nt-menu-list">${benefits.map((item) => `<article class="reveal"><span>${item.number}</span><h3>${item.title}</h3><p>${item.copy}</p><b>INCLUDED</b></article>`).join("")}</div>
    </section>
    <section class="nt-wall" id="stories">
      <figure class="reveal"><img src="${images.resultTwo}" alt="A Boost Club progress story"></figure>
      <div class="nt-wall-copy reveal"><span class="eyebrow">The regulars say</span><blockquote>“Friendly people, good energy and coaching you can actually understand.”</blockquote><p>Kevin R. · Google review</p>${proofMarkup("round-proof")}</div>
      <div class="nt-postcard reveal"><strong>SEE YOU<br>TOMORROW?</strong><span>Sevastopol 24</span></div>
    </section>
    <div id="visit">${finalCta("There is room at the table", "Your first visit is free and your questions are welcome.")}</div>
  </main>`;
}

function finalistHybridGentleMomentum(finalist) {
  return `${finalistRoundNav(finalist)}
  <main class="round-page gentle-momentum">
    <section class="gm-hero" id="welcome">
      <div class="gm-copy reveal"><span class="eyebrow">A morning rhythm made personal</span><h1>Start gently. Keep moving.</h1><p>The warmth of a familiar morning club, carried through a clear and beautifully simple wellness journey.</p><div class="cta-group"><a class="primary-cta" href="${brand.bookingHref}">Begin for free ${arrow}</a><a class="text-cta" href="#experience">See how it flows</a></div></div>
      <div class="gm-visual">
        <div class="gm-shape" aria-hidden="true"></div>
        <figure class="round-parallax reveal"><img src="${images.portrait}" alt="Gabriel Neshto in the welcoming Boost Club space"></figure>
        <span class="gm-badge badge-one">Morning energy</span><span class="gm-badge badge-two">Personal clarity</span><span class="gm-badge badge-three">Shared momentum</span>
      </div>
    </section>
    <section class="gm-proof">${proofMarkup("round-proof")}</section>
    <section class="gm-flow round-section" id="experience">
      <header class="round-heading reveal"><span class="eyebrow">Your first morning</span><h2>Every moment carries you naturally into the next.</h2></header>
      <div class="gm-journey">${steps.map((item, index) => `<article class="reveal"><b>${item.number}</b><span>${["Welcome", "Insight", "Meaning", "Momentum"][index]}</span><h3>${item.title}</h3><p>${item.copy}</p></article>`).join("")}</div>
    </section>
    <section class="gm-method" id="method">
      <div class="gm-method-copy reveal"><span class="eyebrow">Personal, not complicated</span><h2>Good guidance should fit into your life like a familiar habit.</h2><p>The body assessment creates clarity. The conversation makes it useful. The club helps it become consistent.</p>${benefitMarkup("gm-benefits")}</div>
      <figure class="round-parallax reveal"><img src="${images.consultation}" alt="A one-to-one Boost Club body assessment"><figcaption>Measure · understand · move</figcaption></figure>
    </section>
    <section class="gm-community" id="stories">
      <header class="round-heading reveal"><span class="eyebrow">The social side of consistency</span><h2>A plan feels lighter when the room is on your side.</h2></header>
      <div class="gm-community-grid"><figure class="reveal"><img src="${images.family}" alt="The Boost Club morning community"></figure>${reviewMarkup("round-reviews")}</div>
    </section>
    <div id="visit">${finalCta("One free morning to begin", "Meet your numbers. Then meet the people who help them matter.")}</div>
  </main>`;
}

function finalistHybridLivingClub(finalist) {
  return `${finalistRoundNav(finalist)}
  <main class="round-page living-club">
    <section class="lc-hero" id="welcome">
      <div class="lc-copy reveal"><span class="eyebrow">Wellness with a pulse</span><h1>A club that moves with you.</h1><p>Real insight, organic momentum and a room full of people making their next healthy choice together.</p><a class="primary-cta" href="${brand.bookingHref}">Step inside for free ${arrow}</a></div>
      <div class="lc-mosaic">
        <figure class="lc-tall round-parallax reveal"><img src="${images.consultation}" alt="A Boost Club consultation in progress"></figure>
        <figure class="lc-small reveal"><img src="${images.family}" alt="The Boost Club community"></figure>
        <div class="lc-pulse-card reveal"><span>THIS WEEK</span><strong>FREE</strong><p>Body composition assessment</p></div>
      </div>
      <div class="lc-ring" aria-hidden="true"><span>BOOST · CLUB · BUCHAREST · </span></div>
    </section>
    ${roundRibbon("COME CURIOUS · LEAVE CLEAR · RETURN ENERGISED")}
    <section class="lc-manifesto" id="experience">
      <span class="eyebrow">The living system</span><h2 class="reveal">Numbers give you direction. People give you momentum.</h2>
      <div class="lc-manifesto-grid">${benefits.map((item) => `<article class="reveal"><span>${item.number}</span><h3>${item.title}</h3><p>${item.copy}</p></article>`).join("")}</div>
    </section>
    <section class="lc-sequence" id="method">
      ${steps.map((item, index) => `<article class="reveal"><div class="lc-number">${item.number}</div><figure><img src="${[images.portrait, images.consultation, images.founder, images.family][index]}" alt=""></figure><div><span>${["COME IN", "SEE CLEARLY", "MAKE SENSE", "KEEP GOING"][index]}</span><h3>${item.title}</h3><p>${item.copy}</p></div></article>`).join("")}
    </section>
    <section class="lc-voices" id="stories">
      <div class="lc-voices-title reveal"><span class="eyebrow">The room is talking</span><h2>Good energy is hard to fake.</h2></div>
      ${reviews.map((item, index) => `<blockquote class="reveal voice-${index + 1}"><div>★★★★★</div><p>“${item.quote}”</p><footer>${item.author} · Google</footer></blockquote>`).join("")}
      <div class="lc-score reveal"><strong>5.0</strong><span>Google rating</span></div>
    </section>
    <div id="visit">${finalCta("The door is open", "Bring your questions. Leave with energy and a clear next move.")}</div>
  </main>`;
}

const renderers = [
  kineticEditorial,
  wellnessObservatory,
  morningClub,
  performanceBrutalist,
  neoSwiss,
  cinematicJourney,
  organicFlow,
  auroraGlass,
  proofWall,
  quietLuxury,
];

const finalistRenderers = {
  "organic-flow": {
    experience: organicExperience,
    method: organicMethod,
    stories: organicStories,
    visit: organicVisit,
  },
  "cinematic-journey": {
    experience: cinematicExperience,
    method: cinematicMethod,
    stories: cinematicStories,
    visit: cinematicVisit,
  },
};

const finalistRoundRenderers = {
  "finalist-organic-soft-current": finalistOrganicSoftCurrent,
  "finalist-organic-botanical-rhythm": finalistOrganicBotanicalRhythm,
  "finalist-morning-sunrise-ritual": finalistMorningSunriseRitual,
  "finalist-morning-neighbourhood-table": finalistMorningNeighbourhoodTable,
  "finalist-hybrid-gentle-momentum": finalistHybridGentleMomentum,
  "finalist-hybrid-living-club": finalistHybridLivingClub,
};

function pageShell(concept, content) {
  const isFinalist = Boolean(finalistSites[concept.slug] || concept.finalistRound);
  const title = concept.pageTitle || concept.title;
  const description = concept.pageDescription || concept.subtitle;
  const finalistAttribute = concept.finalistRound ? ` data-finalist="${concept.slug}"` : "";
  return `<!doctype html>
<html lang="en" data-concept="${concept.themeSlug || concept.slug}"${finalistAttribute} data-motion="on">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="theme-color" content="${isFinalist ? "#0D5645" : "#061a2f"}">
  <title>${title} | Boost Club concept</title>
  <meta name="description" content="${description}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a class="skip-link" href="#concept-main">Skip to content</a>
  ${concept.finalistRound ? finalistRoundDock(concept) : conceptDock(concept)}
  <div id="concept-main" class="concept-page">${content}${footer()}</div>
  <script src="interactions.js" defer></script>
</body>
</html>
`;
}

function finalistRoundCard(finalist, index) {
  const imageSet = [images.consultation, images.portrait, images.consultation, images.family, images.portrait, images.family];
  return `<a class="round-gallery-card finalist-card-${finalist.id}" href="${finalist.slug}.html">
    <div class="round-gallery-visual"><img src="${imageSet[index]}" alt=""><span>${finalist.family}</span><b>${finalist.id}</b><i></i></div>
    <div class="round-gallery-copy"><span>${finalist.signal}</span><h2>${finalist.title}</h2><p>${finalist.subtitle}</p><strong>Open finalist ${arrow}</strong></div>
  </a>`;
}

function finalistGalleryShell() {
  return `<!doctype html>
<html lang="en" data-concept="finalist-gallery">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="theme-color" content="#0D5645">
  <title>Boost Club | Final six homepage directions</title>
  <meta name="description" content="Six finalist homepage directions combining Organic Flow and The Morning Club for Boost Club.">
  <link rel="stylesheet" href="styles.css">
</head>
<body class="finalist-gallery-body">
  <main class="finalist-gallery">
    <header class="finalist-gallery-header"><div><a href="./">${logo()}</a><span>Final selection / English homepage</span></div><div><span class="eyebrow">Six distinct directions</span><h1>Flow you can feel. Warmth you can belong to.</h1></div><p>Two Organic Flow evolutions, two Morning Club evolutions and two hybrids. Every option uses the exact Boost Club brand palette.</p></header>
    <nav class="finalist-filter" aria-label="Finalist groups"><a href="#organic">Organic Flow · 2</a><a href="#morning">Morning Club · 2</a><a href="#hybrid">Hybrids · 2</a></nav>
    <section class="finalist-gallery-group" id="organic"><header><span>01 + 02</span><h2>Organic Flow</h2><p>Calm movement, tactile layers and the best long-form pacing.</p></header><div>${finalistRound.slice(0, 2).map(finalistRoundCard).join("")}</div></section>
    <section class="finalist-gallery-group" id="morning"><header><span>03 + 04</span><h2>The Morning Club</h2><p>Friendly, optimistic and built around the feeling of joining in.</p></header><div>${finalistRound.slice(2, 4).map((item, index) => finalistRoundCard(item, index + 2)).join("")}</div></section>
    <section class="finalist-gallery-group" id="hybrid"><header><span>05 + 06</span><h2>The Hybrids</h2><p>Morning warmth carried through Organic Flow's smoother journey.</p></header><div>${finalistRound.slice(4, 6).map((item, index) => finalistRoundCard(item, index + 4)).join("")}</div></section>
    <footer class="gallery-footer"><span>BOOST CLUB / BUCHAREST / FINAL SIX</span><a href="./">Back to all ten concepts ${arrow}</a></footer>
  </main>
</body>
</html>
`;
}

function galleryCard(concept, index) {
  const imageSet = [images.portrait, images.founder, images.consultation, images.training, images.portrait, images.family, images.consultation, images.founder, images.resultTwo, images.founder];
  return `<a class="gallery-card card-${concept.id}" href="${concept.slug}.html">
    <div class="mini-preview"><img src="${imageSet[index]}" alt=""><span class="mini-line line-one"></span><span class="mini-line line-two"></span><span class="mini-button"></span><b>${concept.id}</b></div>
    <div class="gallery-card-copy"><span>${concept.signal}</span><h2>${concept.title}</h2><p>${concept.subtitle}</p><i>Open concept ${arrow}</i></div>
  </a>`;
}

function galleryShell() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="theme-color" content="#061a2f">
  <title>Boost Club | Ten homepage directions</title>
  <meta name="description" content="Ten distinct art directions for the Boost Club English homepage.">
  <link rel="stylesheet" href="styles.css">
</head>
<body class="gallery-body">
  <main class="concept-gallery">
    <header class="gallery-header"><div>${logo()}<span>English homepage study</span></div><h1>Ten ways Boost Club could feel unforgettable.</h1><p>Same identity. Same real offer. Ten completely different creative worlds. Open each direction full-screen and choose the one worth developing.</p></header>
    <a class="finalist-callout" href="finalists.html"><span>New / finalist round</span><strong>Six refined directions from Organic Flow and The Morning Club.</strong><i>Compare the final six ${arrow}</i></a>
    <div class="gallery-grid">${concepts.map(galleryCard).join("")}</div>
    <footer class="gallery-footer"><span>BOOST CLUB / BUCHAREST / 2026</span><a href="../en/">Current English homepage ${arrow}</a></footer>
  </main>
</body>
</html>
`;
}

export function buildHomepageConcepts(root, outputRoot) {
  const sourceRoot = path.join(root, "concept-lab");
  const destination = path.join(outputRoot, "concepts");
  fs.mkdirSync(destination, { recursive: true });
  fs.copyFileSync(path.join(sourceRoot, "styles.css"), path.join(destination, "styles.css"));
  fs.copyFileSync(path.join(sourceRoot, "interactions.js"), path.join(destination, "interactions.js"));
  fs.writeFileSync(path.join(destination, "index.html"), galleryShell());
  fs.writeFileSync(path.join(destination, "finalists.html"), finalistGalleryShell());
  concepts.forEach((concept, index) => {
    fs.writeFileSync(path.join(destination, `${concept.slug}.html`), pageShell(concept, renderers[index]()));
  });
  for (const [theme, renderMap] of Object.entries(finalistRenderers)) {
    const concept = concepts.find((item) => item.slug === theme);
    for (const page of finalistSites[theme].pages.filter((item) => item.id !== "home")) {
      const render = renderMap[page.id];
      fs.writeFileSync(
        path.join(destination, `${page.slug}.html`),
        pageShell({ ...concept, pageTitle: page.title, pageDescription: page.description }, render()),
      );
    }
  }
  finalistRound.forEach((finalist) => {
    fs.writeFileSync(
      path.join(destination, `${finalist.slug}.html`),
      pageShell({ ...finalist, finalistRound: true }, finalistRoundRenderers[finalist.slug](finalist)),
    );
  });
  return [...concepts, ...finalistRound];
}
