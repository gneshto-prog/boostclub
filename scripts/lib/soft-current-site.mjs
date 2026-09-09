import fs from "node:fs";
import path from "node:path";

const brand = {
  location: "Strada Sevastopol 24, Sector 1, Bucharest",
  phone: "+40 726 205 752",
  phoneHref: "tel:+40726205752",
  mapsHref: "https://maps.app.goo.gl/yZJkKDwB5sqtPskf8",
  whatsappHref: "https://wa.me/40726205752?text=Hi%21%20I%27d%20like%20to%20book%20a%20free%20consultation.",
};

const pages = [
  { slug: "home", file: "index.html", label: "Home", title: "Boost Club Bucharest | Feel better together", description: "A welcoming nutrition club near Victoria Square where body insight, simple routines and community help you move toward your goals." },
  { slug: "club", file: "club.html", label: "The club", title: "The Boost Club community | Bucharest", description: "Discover the people, atmosphere and morning rhythm that make Boost Club feel different." },
  { slug: "first-visit", file: "first-visit.html", label: "First visit", title: "Your first free visit | Boost Club", description: "See exactly what happens during your free 30 to 40 minute body composition assessment at Boost Club." },
  { slug: "method", file: "method.html", label: "Our method", title: "The Boost Club method | Clear, personal guidance", description: "Professional body composition insight translated into one practical direction that fits your real life." },
  { slug: "stories", file: "stories.html", label: "Stories", title: "Member stories and reviews | Boost Club", description: "Real voices, community moments and personal progress from Boost Club members in Bucharest." },
  { slug: "about", file: "about.html", label: "About", title: "About Gabriel and Boost Club", description: "Meet Gabriel Neshto and the family experience behind Boost Club's warm, practical approach." },
  { slug: "visit", file: "visit.html", label: "Visit", title: "Visit Boost Club near Victoria Square", description: "Find Boost Club, ask a question or request your free body composition assessment." },
];

const reviews = [
  ["Gabriel was incredibly welcoming, kind and supportive from the very beginning.", "Andreea Popa"],
  ["Friendly people, good energy and nutrition coaching you can actually understand.", "Kevin R."],
  ["Amazing and positive environment. The best coach and a great community.", "Lana G."],
];

const steps = [
  ["01", "Arrive", "Walk in as you are. We start with a relaxed conversation about what brought you here."],
  ["02", "Measure", "A professional body composition assessment gives you a useful, honest starting point."],
  ["03", "Understand", "Every important number is explained clearly and connected to the goal that matters to you."],
  ["04", "Move", "Leave with one realistic next step and a community ready to welcome you back."],
];

function logo() {
  return `<span class="sc-logo" aria-label="Boost Club">B<span class="leaves">oo</span>st Club<span class="dot">.</span></span>`;
}

function symbolCluster(label = "Grow at your pace") {
  return `<div class="symbol-cluster" aria-label="${label}"><i>✦</i><i>+</i><i>○</i><i>↗</i><strong>${label}</strong></div>`;
}

function photoBrief(number, title, direction, modifier = "") {
  return `<figure class="photo-brief ${modifier}" role="img" aria-label="Photography brief: ${title}. ${direction}">
    <span>PHOTO SLOT ${number}</span><div class="photo-symbol" aria-hidden="true">✦</div><strong>Picture of ${title}</strong><p>Show: ${direction}</p>
  </figure>`;
}

function realPhoto(src, alt, caption = "", modifier = "") {
  const priority = src.includes("boost-club-community") ? ' fetchpriority="high"' : ' loading="lazy"';
  return `<figure class="real-photo ${modifier}" data-parallax><img src="${src}" alt="${alt}"${priority}>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
}

function motionFilm(src, poster, alt, label, caption, modifier = "") {
  return `<figure class="motion-film ${modifier} reveal">
    <div class="motion-frame">
      <video muted loop playsinline preload="none" poster="${poster}" data-autoplay-video aria-label="${alt}"><source data-src="${src}" type="video/mp4"></video>
      <div class="film-controls"><button type="button" data-video-toggle aria-label="Play film"><span aria-hidden="true">▶</span></button><button type="button" data-audio-toggle aria-label="Turn sound on" aria-pressed="false">Sound off</button></div>
      <span class="film-progress" aria-hidden="true"><i></i></span>
    </div>
    <figcaption><span>${label}</span><strong>${caption}</strong></figcaption>
  </figure>`;
}

function shakePhoto(src, alt, number, title, copy, modifier = "") {
  return `<figure class="shake-card ${modifier} reveal" data-parallax data-shake-photo>
    <div class="shake-card-media"><img src="${src}" alt="${alt}" loading="lazy" decoding="async"><span>${number}</span></div>
    <figcaption><strong>${title}</strong><p>${copy}</p></figcaption>
  </figure>`;
}

function reviewsMarkup() {
  return `<div class="review-cloud">${reviews.map(([quote, author], index) => `<blockquote class="review-bubble reveal bubble-${index + 1}"><span>★★★★★</span><p>“${quote}”</p><footer>${author} · Google</footer></blockquote>`).join("")}</div>`;
}

function header(active) {
  const links = pages.slice(1).map((page) => `<a href="${page.file}"${page.slug === active ? ' aria-current="page"' : ""}>${page.label}</a>`).join("");
  const mobileLinks = pages.map((page) => `<a href="${page.file}"${page.slug === active ? ' aria-current="page"' : ""}>${page.label}</a>`).join("");
  return `<header class="site-header">
    <a class="brand-link" href="index.html">${logo()}</a>
    <nav class="desktop-nav" aria-label="Primary navigation">${links}</nav>
    <div class="header-actions">
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode"><span data-theme-icon aria-hidden="true">☾</span><span class="theme-label">Theme</span></button>
      <a class="button button-small" href="visit.html#booking">Book free <span aria-hidden="true">↗</span></a>
      <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span class="sr-only">Open menu</span></button>
    </div>
  </header>
  <nav class="mobile-nav" id="mobile-menu" aria-label="Mobile navigation">${mobileLinks}<a class="button" href="visit.html#booking">Book free</a></nav>
  <div class="scroll-progress" aria-hidden="true"><i></i></div>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="footer-lead"><div>${logo()}<p>Feel better together.</p></div><h2>A welcoming place to understand your body and build habits that last.</h2></div>
    <div class="footer-grid"><div><span>Visit</span><p>${brand.location}</p><p>Mon-Fri 07:00-20:00/21:00<br>Sunday 10:00-18:00</p></div><div><span>Talk to us</span><a href="${brand.phoneHref}">${brand.phone}</a><a href="${brand.whatsappHref}">WhatsApp</a></div><div><span>Explore</span><a href="club.html">The club</a><a href="first-visit.html">First visit</a><a href="stories.html">Stories</a><a href="about.html">About</a></div><div><span>Legal</span><a href="../en/confidentialitate">Privacy</a><a href="../en/termeni">Terms</a><a href="../en/cookies">Cookies</a></div></div>
    <div class="footer-bottom"><p>Independent Herbalife Distributor. Consultations are educational and do not replace medical care. Results vary by person.</p><p>© 2026 Boost Club</p></div>
  </footer>`;
}

function ribbon(words = "COMMUNITY · CLARITY · ENERGY · CONSISTENCY") {
  return `<div class="word-ribbon" aria-hidden="true"><div>${(words + " · ").repeat(6)}</div></div>`;
}

function finalCta(eyebrow, title, copy) {
  return `<section class="soft-cta"><div class="cta-orbits" aria-hidden="true"><i></i><i></i><i></i></div><div class="reveal"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2><p>${copy}</p><div class="button-row"><a class="button" href="visit.html#booking">Book the free assessment <span aria-hidden="true">↗</span></a><a class="text-link" href="${brand.whatsappHref}">Ask us on WhatsApp</a></div></div></section>`;
}

function pageHero(eyebrow, title, copy, visual, modifier = "") {
  return `<section class="page-hero ${modifier}"><div class="page-hero-copy reveal"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${copy}</p></div><div class="page-hero-visual">${visual}${symbolCluster("Made for real life")}</div></section>`;
}

function homePage() {
  return `<main>
    <section class="home-hero">
      <div class="hero-orb orb-a" aria-hidden="true"></div><div class="hero-orb orb-b" aria-hidden="true"></div>
      <div class="home-hero-copy reveal"><span class="eyebrow">Boost Club · Victoria Square</span><h1>Feel better, together.</h1><p>A friendly nutrition club where real body insight, simple morning rituals and people who know your name help you keep moving.</p><div class="button-row"><a class="button" href="visit.html#booking">Book your free assessment <span aria-hidden="true">↗</span></a><a class="text-link" href="club.html">Meet the club</a></div></div>
      <div class="community-hero-visual">${realPhoto("../images/boost-club-community.jpg", "Boost Club members smiling together around a table", "The club, as it really feels", "community-photo")}<span class="float-pill pill-a">Your people</span><span class="float-pill pill-b">Real mornings</span><span class="float-pill pill-c">Your pace</span></div>
      ${symbolCluster("Better together")}
    </section>
    ${ribbon()}
    <section class="proof-current"><div><strong>5.0</strong><span>Google rating</span></div><div><strong>36 years</strong><span>Family wellness experience</span></div><div><strong>ISSA</strong><span>Accredited guidance</span></div><div><strong>30-40 min</strong><span>Free first assessment</span></div></section>
    <section class="story-intro section-pad">
      <header class="section-heading reveal"><span class="eyebrow">This is Boost Club</span><h2>A place where feeling welcome is part of the plan.</h2><p>The same faces return, small wins get noticed and health stops feeling like a solo project.</p></header>
      <div class="value-petals"><article class="petal-card reveal"><span>01</span><div class="petal-symbol">○</div><h3>Known by name</h3><p>Personal attention from the moment you walk through the door.</p></article><article class="petal-card reveal"><span>02</span><div class="petal-symbol">✦</div><h3>Clear, not clinical</h3><p>Useful information explained in plain language and without judgement.</p></article><article class="petal-card reveal"><span>03</span><div class="petal-symbol">∞</div><h3>Easier together</h3><p>A community rhythm that makes consistency feel more natural.</p></article></div>
    </section>
    <section class="cinematic-morning" aria-labelledby="cinematic-heading">
      <div class="cinema-copy reveal"><span class="eyebrow">A morning in motion</span><h2 id="cinematic-heading">The ritual is simple. The feeling is <em>real.</em></h2><p>A fresh start does not happen outside real life. It happens between the first pour, a familiar face and all the small moments that make the club feel human.</p><div class="cinema-chapters" aria-label="Film chapters"><span><b>01</b> Made fresh</span><span><b>02</b> Made for real life</span></div></div>
      <div class="cinema-stage">
        <div class="cinema-orbits" aria-hidden="true"><i></i><i></i><i></i></div><span class="cinema-word" aria-hidden="true">MORNING</span>
        ${motionFilm("../videos/soft-current-shake.mp4", "../images/soft-current-shake-poster.jpg", "A breakfast shake being poured into a Boost Club cup", "01 · The morning ritual", "Made one pour at a time.", "film-shake")}
        ${motionFilm("../videos/soft-current-club-baby.mp4", "../images/soft-current-club-baby-poster.jpg", "A young child sitting comfortably inside Boost Club", "02 · Life belongs here", "A club warm enough for real life.", "film-baby")}
      </div>
    </section>
    <section class="shake-edit section-pad" aria-labelledby="shake-edit-heading">
      <header class="shake-edit-heading reveal"><span class="eyebrow">From the counter</span><h2 id="shake-edit-heading">Three shakes. Three moods. One morning ritual.</h2><p>Made fresh, finished with personality and easy to enjoy around the table with everyone else.</p></header>
      <div class="shake-edit-grid"><div class="shake-loop" aria-hidden="true"><i></i><i></i><strong>Fresh<br>every<br>morning</strong></div>${shakePhoto("../images/soft-current-shake-02.jpg", "A creamy Boost Club shake topped with cocoa, drizzle and crunchy pieces", "01", "Cocoa on top.", "Creamy, layered and made to feel like a treat.", "shake-left")}${shakePhoto("../images/soft-current-shake-01.jpg", "A chocolate-swirled Boost Club shake with whipped topping", "02", "A little drama.", "Chocolate swirls, a cloud-like top and the club mark front and centre.", "shake-centre")}${shakePhoto("../images/soft-current-shake-03.jpg", "A pale Boost Club shake with whipped topping and golden crunch", "03", "Golden finish.", "Bright, crunchy and ready for the first conversation of the day.", "shake-right")}</div>
      <div class="shake-edit-footer reveal"><span>SWIRL · LAYER · CRUNCH</span><p>Ask what is being made at the club today.</p></div>
    </section>
    <section class="photo-stream section-pad">
      <header class="section-heading reveal"><span class="eyebrow">A morning at the club</span><h2>Real moments belong in the story.</h2><p>These photo briefs are ready for the images you will add next.</p></header>
      <div class="photo-stream-grid">${photoBrief("01", "members arriving and greeting each other", "A candid wide shot with people entering, smiling and saying hello.", "brief-round")}${photoBrief("02", "fresh fruit and toppings on the breakfast counter", "Hands, ingredients and colour in warm morning light.", "brief-tall")}${photoBrief("03", "two members laughing over breakfast", "A close, natural moment that feels social rather than posed.", "brief-wide")}${photoBrief("04", "a small group celebrating a weekly win", "Genuine applause, high-fives or a shared progress moment.", "brief-soft")}</div>
    </section>
    <section class="first-visit-preview">
      <div class="visit-copy reveal"><span class="eyebrow">Your free first visit</span><h2>Come with questions. Leave with a clear starting point.</h2><p>In 30 to 40 minutes, you get a professional body composition assessment, a clear explanation and one realistic next step. No hidden cost and no obligation.</p><a class="button" href="first-visit.html">See the whole experience <span aria-hidden="true">↗</span></a></div>
      <div class="visit-path">${steps.map(([number, title, copy]) => `<article class="reveal"><b>${number}</b><div><h3>${title}</h3><p>${copy}</p></div></article>`).join("")}</div>
    </section>
    <section class="home-stories section-pad"><header class="section-heading reveal"><span class="eyebrow">Voices from the club</span><h2>The feeling people remember.</h2></header>${reviewsMarkup()}<a class="text-link section-link" href="stories.html">Read more member stories <span aria-hidden="true">↗</span></a></section>
    <section class="founder-teaser section-pad">${realPhoto("../images/gabriel-neshto-consultant-wellness.webp", "Gabriel Neshto, founder of Boost Club", "Gabriel · Founder and ISSA accredited consultant", "founder-photo")}<div class="reveal"><span class="eyebrow">The person behind the welcome</span><h2>Guidance that understands how hard starting can feel.</h2><p>Gabriel built Boost Club as a friendly place, not a clinic. His job is to make the information useful, keep the direction realistic and help the community grow around every member.</p><a class="text-link" href="about.html">Meet Gabriel <span aria-hidden="true">↗</span></a></div></section>
    ${finalCta("Start where you are", "Your first visit is free. Your next step stays yours.", "Come for the assessment, meet the community and see how a healthier rhythm could feel.")}
  </main>`;
}

function clubPage() {
  return `<main>
    ${pageHero("The club", "Come for your goal. Stay for the people.", "Boost Club is a nutrition club built around real mornings, familiar faces and the feeling that somebody notices your progress.", realPhoto("../images/boost-club-community.jpg", "Members sharing time together inside Boost Club", "A real community moment", "hero-community"), "club-hero")}
    ${ribbon("KNOWN BY NAME · WELCOME EVERY MORNING · STRONGER TOGETHER")}
    <section class="club-beliefs section-pad"><header class="section-heading reveal"><span class="eyebrow">What the club believes</span><h2>Belonging is not decoration. It helps the habit last.</h2></header><div class="belief-orbits"><article class="reveal"><i>01</i><strong>People first</strong><p>We remember the person, not only the goal.</p></article><article class="reveal"><i>02</i><strong>Progress over perfection</strong><p>Small steps deserve to be seen and repeated.</p></article><article class="reveal"><i>03</i><strong>Clarity without pressure</strong><p>You understand the options and choose what fits.</p></article></div></section>
    <section class="club-gallery section-pad"><header class="section-heading reveal"><span class="eyebrow">Build the real visual story</span><h2>The club should look as friendly as it feels.</h2><p>Use candid photography with warm daylight, eye contact and movement.</p></header><div class="organic-gallery">${photoBrief("05", "the whole morning group around the main table", "A generous horizontal image with different ages and personalities visible.", "gallery-main")}${photoBrief("06", "someone being welcomed at the door", "Capture the first smile and open body language.", "gallery-small")}${photoBrief("07", "members holding their favourite shakes", "A playful portrait with colour, hands and genuine expressions.", "gallery-tall")}${photoBrief("08", "a quiet one-to-one check-in", "Listening, attention and a relaxed conversation.", "gallery-soft")}${photoBrief("09", "the club between busy moments", "An atmospheric interior shot with plants, tables and morning light.", "gallery-wide")}</div></section>
    <section class="daily-rhythm section-pad"><div class="sticky-heading reveal"><span class="eyebrow">A shared morning rhythm</span><h2>Easy to join. Easy to make your own.</h2></div><div class="rhythm-list"><article><b>07:00</b><h3>The door opens</h3><p>First hellos, familiar music and the day beginning together.</p></article><article><b>07:10</b><h3>Breakfast and conversation</h3><p>A simple shake ritual, questions and the kind of talk that makes the room warm.</p></article><article><b>07:20</b><h3>Your personal check-in</h3><p>A quick look at how you feel, what changed and what needs adjusting.</p></article><article><b>07:30</b><h3>Back into your day</h3><p>More energy, a clear focus and people expecting to see you again.</p></article></div></section>
    <section class="bring-friend section-pad">${symbolCluster("Bring your people")}<div class="reveal"><span class="eyebrow">Bring a friend</span><h2>The first step feels lighter with someone you know.</h2><p>Come to your free consultation together and ask about the current referral rewards at the club.</p><a class="button" href="${brand.whatsappHref}">Ask about referrals <span aria-hidden="true">↗</span></a></div>${photoBrief("10", "two friends arriving for their first visit", "Shared anticipation, a natural smile and the club entrance.", "brief-round")}</section>
    ${finalCta("There is room at the table", "Meet the club in person.", "Your first assessment is free, and you are welcome to bring someone with you.")}
  </main>`;
}

function firstVisitPage() {
  return `<main>
    ${pageHero("Your first visit", "No performance required. Just come as you are.", "Your first 30 to 40 minutes are free, relaxed and designed to turn questions into a clear starting point.", photoBrief("11", "a new visitor receiving a warm welcome", "Gabriel and a visitor at the entrance with open, relaxed body language.", "hero-brief"), "visit-hero")}
    <section class="visit-sequence section-pad">${steps.map(([number, title, copy], index) => `<article class="sequence-row reveal"><span>${number}</span><div><small>${["00:00 · WELCOME", "00:10 · INSIGHT", "00:20 · CLARITY", "00:35 · DIRECTION"][index]}</small><h2>${title}</h2><p>${copy}</p></div>${photoBrief(String(12 + index).padStart(2, "0"), ["the arrival conversation", "the body composition assessment", "results being explained face to face", "the visitor leaving with confidence"][index], ["A candid seated conversation with comfortable eye contact.", "The analyser and the process without making it feel clinical.", "Hands pointing to results with both people engaged.", "A bright final moment near the door, relaxed and optimistic."][index], index % 2 ? "brief-soft" : "brief-round")}</article>`).join("")}</section>
    <section class="measurement-map section-pad"><div class="reveal"><span class="eyebrow">What becomes visible</span><h2>Not one number. The relationship between them.</h2><p>Body fat, muscle mass, water, visceral fat and metabolic age are considered together and connected back to your own goal.</p></div><div class="body-orbit" aria-label="Body composition signals"><i></i><i></i><i></i><strong>YOU</strong><span>Muscle</span><span>Water</span><span>Body fat</span><span>Metabolic age</span></div></section>
    <section class="faq-section section-pad"><header class="section-heading reveal"><span class="eyebrow">Before you come</span><h2>Everything you might want to ask.</h2></header><div class="faq-list"><details><summary>Is the assessment really free?<span>+</span></summary><p>Yes. The body assessment and first conversation are complimentary, with no hidden cost and no obligation.</p></details><details><summary>Do I need to prepare anything?<span>+</span></summary><p>Come as you are. Normal hydration and comfortable clothing are helpful, but no special preparation is required.</p></details><details><summary>Will I be pressured to buy something?<span>+</span></summary><p>No. You receive your results and recommendations, then any next decision remains entirely yours.</p></details><details><summary>Can I bring a friend?<span>+</span></summary><p>Absolutely. Starting together can make the first visit feel even more relaxed.</p></details></div></section>
    ${finalCta("Clarity before commitment", "See your real starting point.", "Book online or message us on WhatsApp. We will choose a time that fits.")}
  </main>`;
}

function methodPage() {
  return `<main>
    ${pageHero("Our method", "Useful numbers. Human translation. Your pace.", "We measure first, listen closely and simplify what comes next. The method is structured, but the direction is personal.", photoBrief("16", "the body composition results laid out clearly", "The results sheet, a hand explaining it and warm club details around it.", "hero-brief"), "method-hero")}
    ${ribbon("MEASURE · UNDERSTAND · PERSONALISE · REPEAT")}
    <section class="method-principles section-pad"><header class="section-heading reveal"><span class="eyebrow">Built for real life</span><h2>Three principles keep the plan grounded.</h2></header><div class="principle-stack"><article><span>01</span><h3>Enough clarity to act</h3><p>You do not need every answer today. You need the right first answer.</p><i>○</i></article><article><span>02</span><h3>Simple enough to repeat</h3><p>Consistency grows from choices that can survive work, weekends and family life.</p><i>∞</i></article><article><span>03</span><h3>Personal enough to matter</h3><p>Your data informs the conversation. It never replaces your lived experience.</p><i>✦</i></article></div></section>
    <section class="goal-garden section-pad"><div class="reveal"><span class="eyebrow">Different goals, one clear beginning</span><h2>What would you like to feel different?</h2></div><div class="goal-picker" data-goal-picker><button type="button" data-goal="energy" aria-pressed="true">More energy</button><button type="button" data-goal="weight" aria-pressed="false">Healthy weight loss</button><button type="button" data-goal="muscle" aria-pressed="false">Build muscle</button><button type="button" data-goal="clarity" aria-pressed="false">Know my starting point</button></div><div class="goal-response" data-goal-response><span>YOUR DIRECTION</span><strong>Start with the rhythm of your day.</strong><p>We will look at what currently drains your energy and find one change that feels realistic enough to repeat.</p></div></section>
    <section class="method-photo-notes section-pad">${photoBrief("17", "a balanced shake and ingredients on the counter", "Clean ingredients, colour and hands preparing breakfast, with no product-ad feeling.", "brief-tall")}${photoBrief("18", "a member doing a progress check-in", "A notebook or phone, with the member and Gabriel sharing the screen.", "brief-round")}${photoBrief("19", "movement or training that feels achievable", "A real member moving with confidence, not an extreme fitness image.", "brief-wide")}</section>
    <section class="method-summary section-pad"><div class="reveal"><span class="eyebrow">The whole method in one line</span><h2>See clearly. Choose simply. Keep going together.</h2></div>${symbolCluster("Clarity creates momentum")}</section>
    ${finalCta("Your pace is part of the plan", "Begin with the full picture.", "The first assessment and explanation are free, practical and pressure-free.")}
  </main>`;
}

function storiesPage() {
  return `<main>
    ${pageHero("Stories", "Progress feels better when somebody notices.", "Every member starts somewhere different. What they share is practical guidance, steady support and a place they enjoy returning to.", realPhoto("../images/boost-club-community.jpg", "Boost Club members gathered around a table", "The people behind the progress", "hero-community"), "stories-hero")}
    <section class="story-quotes section-pad">${reviewsMarkup()}</section>
    <section class="portrait-briefs section-pad"><header class="section-heading reveal"><span class="eyebrow">Future member portraits</span><h2>Tell the stories in faces, routines and small details.</h2><p>Photograph each person in their own style and let their reason for returning guide the image.</p></header><div>${photoBrief("20", "a member who found more everyday energy", "A relaxed environmental portrait on the way into work, holding their morning shake.", "brief-round")}${photoBrief("21", "a member celebrating a consistency milestone", "A warm portrait in the club with one meaningful object or handwritten note.", "brief-tall")}${photoBrief("22", "friends who started together", "A candid two-person portrait with movement, laughter and no formal posing.", "brief-soft")}</div></section>
    <section class="results-section section-pad"><header class="section-heading reveal"><span class="eyebrow">Real results</span><h2>Different bodies. Different timelines. Real commitment.</h2><p>These are personal experiences, not promises of a particular result.</p></header><div class="result-flow">${realPhoto("../images/before.webp", "Gabriel Neshto personal transformation", "Gabriel · personal transformation", "result-photo")}${realPhoto("../images/results9.webp", "A Boost Club member progress result", "Member progress", "result-photo")}${realPhoto("../images/results13.webp", "A Boost Club member progress result", "Member progress", "result-photo")}</div><p class="result-disclaimer">Results vary from person to person depending on starting point, consistency, lifestyle and individual factors.</p></section>
    <section class="story-invite section-pad">${photoBrief("23", "a wall of handwritten member notes and small wins", "Layer real notes, dates and first names into one rich community detail.", "brief-wide")}<div class="reveal"><span class="eyebrow">Your story can begin quietly</span><h2>One visit. One honest conversation. No pressure to know the ending.</h2><a class="button" href="visit.html#booking">Start your own story <span aria-hidden="true">↗</span></a></div></section>
  </main>`;
}

function aboutPage() {
  return `<main>
    ${pageHero("About", "The club is the story. Gabriel is here to guide it.", "Boost Club brings family wellness experience, professional accreditation and a very personal understanding of what it takes to begin.", realPhoto("../images/gabriel-neshto-consultant-wellness.webp", "Gabriel Neshto, Boost Club founder", "Gabriel · Founder", "hero-founder"), "about-hero")}
    <section class="founder-story section-pad"><div class="reveal"><span class="eyebrow">Why Boost Club exists</span><h2>A friendly place, not a clinic.</h2><p>Gabriel grew up in a family that has worked in wellness for 36 years. After building more than 20 kg of muscle through nutrition and training, he learned from the inside how hard the beginning can feel and how much the right support matters.</p><p>He built Boost Club to make useful body insight easier to understand and to surround personal progress with a real community.</p></div>${realPhoto("../images/familie-neshto-wellness.webp", "The Neshto family wellness heritage", "Three generations of experience", "family-photo")}</section>
    <section class="credentials section-pad"><div><strong>36</strong><span>years of family experience in wellness</span></div><div><strong>ISSA</strong><span>accredited personal guidance</span></div><div><strong>20+ kg</strong><span>personal muscle-building journey</span></div><div><strong>30k</strong><span>people in the wider community</span></div></section>
    <section class="about-gallery section-pad"><header class="section-heading reveal"><span class="eyebrow">The story beyond the portrait</span><h2>Show the work, the welcome and the ordinary moments.</h2></header><div>${photoBrief("24", "Gabriel opening the club early in the morning", "A quiet documentary moment with natural light and no posing.", "brief-tall")}${photoBrief("25", "Gabriel listening during a member conversation", "Focus on attention and eye contact, with the member equally visible.", "brief-round")}${photoBrief("26", "Gabriel and members sharing a normal club moment", "A group interaction where he is one person in the community, not the centre.", "brief-wide")}${photoBrief("27", "the small details that make the club personal", "Names, notes, cups, plants or objects that regular members recognise.", "brief-soft")}</div></section>
    ${finalCta("Meet the guide, then meet the club", "The welcome is personal. The progress is yours.", "Start with a free body assessment and a clear conversation.")}
  </main>`;
}

function visitPage() {
  return `<main>
    ${pageHero("Visit Boost Club", "Your place at the table is closer than you think.", "Find us five minutes from Victoria Square. Your first assessment takes 30 to 40 minutes and costs nothing.", realPhoto("../images/consultatie-wellness-boost-club.webp", "A welcoming consultation inside Boost Club", "Strada Sevastopol 24", "hero-visit"), "contact-hero")}
    <section class="visit-info section-pad"><article><span>WHERE</span><h2>Five minutes from Victoria Square.</h2><p>${brand.location}</p><a class="text-link" href="${brand.mapsHref}">Open in Maps <span aria-hidden="true">↗</span></a></article><article><span>WHEN</span><h2>Morning to evening.</h2><p>Monday to Friday<br>07:00 to 20:00/21:00</p><p>Sunday<br>10:00 to 18:00</p></article><article><span>TALK</span><h2>A real person answers.</h2><a href="${brand.phoneHref}">${brand.phone}</a><a class="text-link" href="${brand.whatsappHref}">Message on WhatsApp</a></article></section>
    <section class="arrival-photos section-pad">${photoBrief("28", "the exterior of Boost Club from the street", "Shoot wide enough to show the building, pavement and an easy-to-recognise landmark.", "brief-wide")}${photoBrief("29", "the exact entrance visitors should use", "A clear straight-on image that removes any uncertainty on arrival.", "brief-round")}${photoBrief("30", "the first view when someone walks inside", "A welcoming interior angle with the table, people and light visible.", "brief-tall")}</section>
    <section class="booking-section section-pad" id="booking">
      <div class="booking-copy reveal"><span class="eyebrow">Free booking request</span><h2>Choose your easiest way to say hello.</h2><p>WhatsApp is fastest. You can also send the short form and we will contact you to confirm a time.</p><a class="button button-whatsapp" href="${brand.whatsappHref}">Message on WhatsApp <span aria-hidden="true">↗</span></a></div>
      <form class="soft-form" name="soft-current-consultation-en" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="soft-current-consultation-en"><p class="honeypot"><label>Do not fill in <input name="bot-field"></label></p>
        <label>First name<input type="text" name="firstname" autocomplete="given-name" required placeholder="Maria"></label>
        <label>Phone<input type="tel" name="phone" autocomplete="tel" required placeholder="+40 722 000 000"></label>
        <fieldset><legend>What would you like help with?</legend><label><input type="radio" name="goal" value="Healthy weight loss" required><span>Healthy weight loss</span></label><label><input type="radio" name="goal" value="More energy"><span>More energy</span></label><label><input type="radio" name="goal" value="Build muscle"><span>Build muscle</span></label><label><input type="radio" name="goal" value="Know my starting point"><span>Know my starting point</span></label></fieldset>
        <label>Best day to visit<input type="date" name="preferred_date" required></label>
        <p class="form-note">By sending this form, you agree that Boost Club may contact you to confirm your visit. Your information is not shared with third parties.</p>
        <button class="button" type="submit">Request my free visit <span aria-hidden="true">↗</span></button>
      </form>
    </section>
    <section class="visit-reassurance section-pad"><div><span>FREE</span><strong>No hidden costs</strong></div><div><span>30-40 MIN</span><strong>Enough time to understand</strong></div><div><span>NO PRESSURE</span><strong>Your next step stays yours</strong></div></section>
  </main>`;
}

const renderers = { home: homePage, club: clubPage, "first-visit": firstVisitPage, method: methodPage, stories: storiesPage, about: aboutPage, visit: visitPage };

function shell(page, content) {
  return `<!doctype html>
<html lang="en" data-theme="light" data-motion="on" data-page="${page.slug}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="theme-color" content="#0D5645">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:image" content="https://boostclub.ro/images/soft-current-og-v2.png">
  <meta property="og:image:width" content="1730">
  <meta property="og:image:height" content="909">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="styles.css">
  <script>try{const saved=localStorage.getItem("boost-theme");document.documentElement.dataset.theme=saved||((matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light")}catch(e){}</script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  ${header(page.slug)}
  <div id="main-content">${content}</div>
  ${footer()}
  <aside class="preview-note" aria-label="Prototype status"><a href="../concepts/finalists.html">Selected: Soft Current</a><button type="button" data-motion-toggle aria-pressed="true">Motion on</button></aside>
  <script src="interactions.js" defer></script>
</body>
</html>
`;
}

export function buildSoftCurrentSite(root, outputRoot) {
  const source = path.join(root, "soft-current-site");
  const destination = path.join(outputRoot, "soft-current");
  fs.mkdirSync(destination, { recursive: true });
  fs.copyFileSync(path.join(source, "styles.css"), path.join(destination, "styles.css"));
  fs.copyFileSync(path.join(source, "interactions.js"), path.join(destination, "interactions.js"));
  for (const page of pages) fs.writeFileSync(path.join(destination, page.file), shell(page, renderers[page.slug]()));
  return pages;
}

export { pages as softCurrentPages };
