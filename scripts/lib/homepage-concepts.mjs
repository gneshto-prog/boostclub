import fs from "node:fs";
import path from "node:path";
import { benefits, brand, concepts, images, proof, reviews, steps } from "../../content/homepage-concepts.mjs";

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

function conceptDock(concept) {
  return `<aside class="concept-dock" aria-label="Concept preview controls">
    <a href="./" aria-label="Back to all concepts">All 10</a>
    <span>${concept.id} / 10</span>
    <button type="button" data-motion-toggle aria-pressed="true">Motion on</button>
  </aside>`;
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
  return `${nav("nav-cinematic")}
  <main>
    <section class="cj-hero">
      <img class="cj-backdrop" src="${images.portrait}" alt="Gabriel Neshto welcoming clients at Boost Club">
      <div class="cj-shade"></div><div class="cj-frame"></div>
      <div class="cj-copy reveal"><span>BOOST CLUB PRESENTS</span><h1>The moment your health stops feeling like a solo project.</h1><p>A personal wellness experience in the heart of Bucharest.</p><a class="primary-cta" href="${brand.bookingHref}">Book your first scene ${arrow}</a></div>
      <div class="cj-caption"><b>01</b><span>THE ARRIVAL</span><i>Scroll to continue</i></div>
    </section>
    <section class="cj-chapter chapter-light" id="experience"><div class="cj-number">01</div><figure><img src="${images.consultation}" alt="Body composition consultation at Boost Club"></figure><div><span class="eyebrow">The first visit</span><h2>You arrive with questions.</h2><p>No judgement. No pressure. Just a welcoming space and a professional measurement of your real starting point.</p></div></section>
    <section class="cj-chapter chapter-dark" id="method"><div class="cj-number">02</div><figure><img src="${images.founder}" alt="Gabriel Neshto, founder and consultant"></figure><div><span class="eyebrow">The conversation</span><h2>The numbers start making sense.</h2><p>Gabriel explains the full picture in plain language, connects it to your goal and helps you choose a realistic direction.</p></div></section>
    <section class="cj-chapter chapter-blue" id="stories"><div class="cj-number">03</div><figure><img src="${images.family}" alt="Boost Club community"></figure><div><span class="eyebrow">The rhythm</span><h2>You stop doing it alone.</h2><p>Come back for the people, the morning energy and the kind of accountability that feels like belonging.</p></div></section>
    <section class="cj-credits">${proofMarkup("cj-proof")}<p>YOUR STORY / NEXT</p></section>${finalCta("Now showing in Victoria Square", "Your first visit costs nothing. It can change the whole plot.")}
  </main>`;
}

function organicFlow() {
  return `${nav("nav-organic")}
  <main>
    <section class="of-hero">
      <div class="of-blob blob-one" aria-hidden="true"></div><div class="of-blob blob-two" aria-hidden="true"></div>
      <div class="of-copy reveal"><span class="eyebrow">Feel good. For real.</span><h1>A softer way to build stronger habits.</h1><p>Friendly guidance, real body insights and a community that makes healthy mornings something to look forward to.</p><a class="primary-cta" href="${brand.bookingHref}">Find your starting point ${arrow}</a></div>
      <figure class="of-photo reveal"><img src="${images.consultation}" alt="A friendly wellness consultation"><figcaption>Come exactly as you are</figcaption></figure>
      <div class="of-orbit-word word-one">ENERGY</div><div class="of-orbit-word word-two">SUPPORT</div><div class="of-orbit-word word-three">YOU</div>
    </section>
    <section class="of-wave" id="experience"><div><span class="eyebrow">A little structure. A lot of humanity.</span><h2>Wellness can be serious without feeling severe.</h2></div>${benefitMarkup("of-benefits")}</section>
    <section class="of-playground" id="method"><header><span class="eyebrow">Choose your focus</span><h2>What would make today feel better?</h2></header><div class="goal-picker" role="group" aria-label="Choose a wellness goal"><button type="button" data-goal="energy" aria-pressed="true">More energy</button><button type="button" data-goal="strength" aria-pressed="false">More strength</button><button type="button" data-goal="balance" aria-pressed="false">More balance</button></div><div class="goal-answer" data-goal-answer><strong>Start with what fuels your day.</strong><span>We will map your current rhythm and find the easiest win to repeat.</span></div></section>
    <section class="of-community" id="stories"><div><img src="${images.family}" alt="The Boost Club community"></div><div><span class="eyebrow">The people effect</span><h2>Small steps grow faster in good company.</h2>${proofMarkup("of-proof")}</div></section>
    ${finalCta("Your body. Your pace.", "Let the first step feel light.")}
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

function pageShell(concept, content) {
  return `<!doctype html>
<html lang="en" data-concept="${concept.slug}" data-motion="on">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="theme-color" content="#061a2f">
  <title>${concept.title} | Boost Club homepage concept</title>
  <meta name="description" content="${concept.subtitle}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a class="skip-link" href="#concept-main">Skip to content</a>
  ${conceptDock(concept)}
  <div id="concept-main" class="concept-page">${content}${footer()}</div>
  <script src="interactions.js" defer></script>
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
  concepts.forEach((concept, index) => {
    fs.writeFileSync(path.join(destination, `${concept.slug}.html`), pageShell(concept, renderers[index]()));
  });
  return concepts;
}
