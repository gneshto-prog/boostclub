// Partner landing pages (15 Oct 2026): boostclub.ro/<slug> (EN) + /ro/<slug> (RO) for every
// partner in partners/partners.json. One template, one data file: a new partner is a new entry
// plus a photo. Every WhatsApp tap first saves the visitor to the CRM (Netlify form
// "partner-page" -> submission-created -> ingest_website_request) and then opens a chat with
// the partner, so no lead goes to a partner without Gabi seeing it.
import fs from "node:fs";
import path from "node:path";

const esc = (value) => String(value ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const REVIEWS = [
  ["It helped me gain muscle and stay consistent with my nutrition. Gabriel explains everything clearly and takes the time to make sure you understand the process.", "Theo"],
  ["The body composition assessment was free and everything was explained to me in a friendly, clear and professional way.", "Diana"],
  ["Thanks to their analysis I understand my body better and where i need to keep working. Great team! Really recommend!", "Buduianu Filofteia"],
];

const COPY = {
  en: {
    htmlLang: "en",
    role: "Boost Club Partner · Bucharest",
    cta: (f) => `Message ${f} on WhatsApp`,
    storyLink: "Read my story",
    storyTitle: "My story",
    focusTitle: "How I can help",
    focus: {
      muscle: ["Muscle and weight gain", "A structured nutrition plan that gives your body what it needs to grow."],
      fat: ["Fat loss", "Lose fat and keep your muscle, with a plan you can maintain."],
      energy: ["Energy and consistency", "Steady energy throughout the day, built on simple daily habits."],
    },
    stepsTitle: "How it works",
    steps: () => [
      ["Send me a message", "Tap the button and start a conversation on WhatsApp."],
      ["Free body composition scan", "At Boost Club we measure your body fat, muscle mass, hydration and metabolic age, and explain what each number means. It takes 25-30 minutes."],
      ["Your personal plan", "We set a clear goal and your first steps together, and I keep you on track from there."],
    ],
    reviewsTitle: "What clients say about Boost Club",
    review: "Google review",
    clubTitle: "Visit Boost Club",
    clubLine: "Strada Sevastopol 24, Sector 1",
    clubNear: "5 minutes from Piața Victoriei metro (M1, M2)",
    map: "Open in Google Maps",
    rating: "5.0 · 122 Google reviews",
    finalTitle: "Ready to get started?",
    finalText: "Send me a message and we'll book your free body scan.",
    sheetTitle: (f) => `Message ${f}`,
    sheetText: (f) => `Leave your name and number so ${f} knows who is reaching out. WhatsApp then opens with your message ready to send.`,
    nameLabel: "First name",
    namePh: "e.g. Alex",
    phoneLabel: "Phone (WhatsApp)",
    phonePh: "e.g. 0722 000 000",
    send: "Continue to WhatsApp",
    consent: "By continuing, you agree that Boost Club may contact you on WhatsApp.",
    privacy: "Privacy policy",
    privacyHref: "/confidentialitate",
    errName: "Please enter your first name.",
    errPhone: "Please enter the phone number you use on WhatsApp.",
    errPrefix: "Romanian mobile numbers start with 072 to 079. Please check the number.",
    waText: (f) => `Hi ${f}! I'm {name}. I found your page on boostclub.ro and I'd like to book my free body scan.`,
    waFallback: (f) => `Hi ${f}! I found your page on boostclub.ro and I'd like to book my free body scan.`,
    disclosure: (n) => `${n} is an Independent Herbalife Distributor and a Boost Club partner. Results shown are personal and individual results vary. The body scan is an educational wellness assessment, not a medical diagnosis, and does not replace medical care.`,
    otherLang: ["ro", "Română"],
    title: (n) => `${n} | Boost Club Bucharest`,
    description: (n, h) => `${n}, Boost Club partner in Bucharest. ${h} Start with a free body composition scan at Boost Club, 5 minutes from Piața Victoriei.`,
  },
  ro: {
    htmlLang: "ro",
    role: "Partener Boost Club · București",
    cta: (f) => `Scrie-i lui ${f} pe WhatsApp`,
    storyLink: "Citește povestea mea",
    storyTitle: "Povestea mea",
    focusTitle: "Cum te pot ajuta",
    focus: {
      muscle: ["Masă musculară și creștere în greutate", "Un plan de nutriție structurat, care îi dă corpului tău tot ce are nevoie ca să crească."],
      fat: ["Slăbire", "Pierzi grăsime și îți păstrezi masa musculară, cu un plan pe care îl poți menține."],
      energy: ["Energie și consecvență", "Energie constantă pe tot parcursul zilei, construită pe obiceiuri simple."],
    },
    stepsTitle: "Cum funcționează",
    steps: () => [
      ["Trimite-mi un mesaj", "Apasă butonul și începe conversația pe WhatsApp."],
      ["Scanare corporală gratuită", "La Boost Club îți măsurăm grăsimea, masa musculară, hidratarea și vârsta metabolică și îți explicăm ce înseamnă fiecare cifră. Durează 25-30 de minute."],
      ["Planul tău personal", "Stabilim împreună un obiectiv clar și primii pași, iar apoi te ajut să rămâi pe drumul cel bun."],
    ],
    reviewsTitle: "Ce spun clienții despre Boost Club",
    review: "Recenzie Google",
    clubTitle: "Vino la Boost Club",
    clubLine: "Strada Sevastopol 24, Sector 1",
    clubNear: "La 5 minute de metroul Piața Victoriei (M1, M2)",
    map: "Deschide în Google Maps",
    rating: "5.0 · 122 de recenzii Google",
    finalTitle: "Ești gata să începi?",
    finalText: "Trimite-mi un mesaj și îți programăm scanarea corporală gratuită.",
    sheetTitle: (f) => `Scrie-i lui ${f}`,
    sheetText: (f) => `Lasă-ți numele și numărul, ca ${f} să știe cine îi scrie. Apoi se deschide WhatsApp cu mesajul pregătit.`,
    nameLabel: "Prenume",
    namePh: "ex. Andrei",
    phoneLabel: "Telefon (WhatsApp)",
    phonePh: "ex. 0722 000 000",
    send: "Continuă pe WhatsApp",
    consent: "Continuând, ești de acord ca Boost Club să te contacteze pe WhatsApp.",
    privacy: "Politica de confidențialitate",
    privacyHref: "/ro/confidentialitate",
    errName: "Te rugăm să introduci prenumele.",
    errPhone: "Te rugăm să introduci numărul pe care folosești WhatsApp.",
    errPrefix: "Numerele de mobil din România încep cu 072 până la 079. Te rugăm să verifici numărul.",
    waText: (f) => `Salut ${f}! Sunt {name}. Am găsit pagina ta pe boostclub.ro și aș vrea să-mi programez scanarea corporală gratuită.`,
    waFallback: (f) => `Salut ${f}! Am găsit pagina ta pe boostclub.ro și aș vrea să-mi programez scanarea corporală gratuită.`,
    disclosure: (n) => `${n} este Distribuitor Independent Herbalife și partener Boost Club. Rezultatele prezentate sunt personale, iar rezultatele diferă de la o persoană la alta. Scanarea corporală este o evaluare educațională de wellness, nu un diagnostic medical, și nu înlocuiește îngrijirea medicală.`,
    otherLang: ["en", "English"],
    title: (n) => `${n} | Boost Club București`,
    description: (n, h) => `${n}, partener Boost Club în București. ${h} Începe cu o scanare corporală gratuită la Boost Club, la 5 minute de Piața Victoriei.`,
  },
};

const routeFor = (lang, slug) => (lang === "en" ? `/${slug}/` : `/${lang}/${slug}/`);

function photoFor(root, slug, name) {
  if (!name) return null;
  const file = path.join(root, "partners", "photos", name);
  if (!fs.existsSync(file)) throw new Error(`partners: photo missing for ${slug}: partners/photos/${name}`);
  return `/partners/photos/${name}`;
}

function renderPage({ lang, slug, partner, photo, clubPhoto }) {
  const c = COPY[lang];
  const t = partner[lang];
  const first = partner.name.split(" ")[0];
  const waNumber = partner.whatsapp.replace(/\D/g, "");
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(c.waFallback(first))}`;
  const route = routeFor(lang, slug);
  // Link previews (WhatsApp, Instagram) want a JPG: use <photo>.jpg next to the .webp when present.
  const ogImage = photo && fs.existsSync(path.join(process.cwd(), photo.replace(/\.webp$/, ".jpg")))
    ? photo.replace(/\.webp$/, ".jpg") : photo || "/images/og-image-v2.jpg";
  const [otherLang, otherLabel] = c.otherLang;
  const otherRoute = routeFor(otherLang, slug);
  const cta = (cls = "") => `<a class="btn btn-gold${cls}" href="${esc(waHref)}" data-open-sheet>${esc(c.cta(first))}</a>`;
  const portrait = photo
    ? `<img src="${esc(photo)}" alt="${esc(partner.name)}" width="900" height="1200" fetchpriority="high">`
    : `<span class="initials" aria-hidden="true">${esc(partner.initials)}</span>`;
  const ig = partner.instagram
    ? `<a class="ig" href="https://www.instagram.com/${esc(partner.instagram)}/" target="_blank" rel="noopener">@${esc(partner.instagram)}</a>`
    : "";

  return `<!DOCTYPE html>
<html lang="${c.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(c.title(partner.name))}</title>
<meta name="description" content="${esc(c.description(partner.name, t.headline))}">
<!-- Partner page, generated from partners/partners.json by scripts/lib/partner-pages.mjs. Do not hand-edit. -->
<meta name="theme-color" content="#08382D">
<link rel="canonical" href="https://boostclub.ro${route}">
<link rel="alternate" hreflang="en" href="https://boostclub.ro${routeFor("en", slug)}">
<link rel="alternate" hreflang="ro" href="https://boostclub.ro${routeFor("ro", slug)}">
<meta property="og:type" content="profile">
<meta property="og:url" content="https://boostclub.ro${route}">
<meta property="og:title" content="${esc(partner.name)} · Boost Club">
<meta property="og:description" content="${esc(t.headline)} ${esc(t.lead)}">
<meta property="og:image" content="https://boostclub.ro${esc(ogImage)}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/poppins/poppins-700-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/partners/partner.css?v=1">
</head>
<body>

<header class="top">
  <a class="logo" href="${lang === "en" ? "/" : "/ro/"}" aria-label="Boost Club">Boost Club<span class="dot">.</span></a>
  <nav class="top-nav">
    <a class="lang" href="${otherRoute}" hreflang="${otherLang}">${otherLabel}</a>
    <a class="top-cta" href="${esc(waHref)}" data-open-sheet>WhatsApp</a>
  </nav>
</header>

<main>
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${esc(c.role)}</p>
        <h1>${esc(partner.name)}</h1>
        <p class="headline">${esc(t.headline)}</p>
        <p class="lead">${esc(t.lead)}</p>
        <div class="ctas">
          ${cta()}
          <a class="btn btn-ghost" href="#story">${esc(c.storyLink)}</a>
        </div>
        <div class="hero-proof">
          <a class="rating-link" href="https://g.page/r/CUSJCWfOpKRSEAE" target="_blank" rel="noopener"><span class="stars" aria-hidden="true">★★★★★</span> ${esc(c.rating)}</a>
          ${ig}
        </div>
      </div>
      <figure class="portrait${photo ? "" : " portrait-empty"}">
        ${portrait}
        <figcaption class="stat"><strong>${esc(partner.stat)}</strong><span>${esc(t.statLabel)}</span></figcaption>
      </figure>
    </div>
  </section>

  <section class="story" id="story">
    <div class="wrap narrow">
      <h2>${esc(c.storyTitle)}</h2>
      ${t.story.map((line) => `<p>${esc(line)}</p>`).join("\n      ")}
    </div>
  </section>

  <section class="band">
    <div class="wrap">
      <h2>${esc(c.focusTitle)}</h2>
      <div class="grid3">
        ${partner.focus.map((key) => `<div class="item"><h3>${esc(c.focus[key][0])}</h3><p>${esc(c.focus[key][1])}</p></div>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="steps">
    <div class="wrap">
      <h2>${esc(c.stepsTitle)}</h2>
      <ol class="grid3">
        ${c.steps(first).map(([h, p], i) => `<li class="item"><span class="num">0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join("\n        ")}
      </ol>
    </div>
  </section>

  <section class="reviews">
    <div class="wrap">
      <h2>${esc(c.reviewsTitle)}</h2>
      <div class="grid3">
        ${REVIEWS.map(([q, who]) => `<blockquote><p>${esc(q)}</p><footer>${esc(who)} · ${esc(c.review)}</footer></blockquote>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="club">
    <div class="wrap club-grid">
      <figure class="club-photo${clubPhoto ? " club-photo-partner" : ""}">
        ${clubPhoto
          ? `<img src="${esc(clubPhoto)}" alt="${esc(lang === "ro" ? `${partner.name} la Boost Club` : `${partner.name} at Boost Club`)}" width="1050" height="1400" loading="lazy">`
          : `<img src="/images/boost-club-community.webp" alt="Boost Club, Strada Sevastopol 24" width="2048" height="1536" loading="lazy"
             srcset="/images/responsive/boost-club-community.a1ccc7b3cb87.320.webp 320w, /images/responsive/boost-club-community.a309daf2d76a.640.webp 640w, /images/responsive/boost-club-community.cf60a986baa5.960.webp 960w, /images/boost-club-community.webp 2048w"
             sizes="(max-width: 860px) 100vw, 50vw">`}
      </figure>
      <div>
        <h2>${esc(c.clubTitle)}</h2>
        <address><strong>${esc(c.clubLine)}</strong><br>${esc(c.clubNear)}</address>
        <p class="rating"><a href="https://g.page/r/CUSJCWfOpKRSEAE" target="_blank" rel="noopener"><span class="stars" aria-hidden="true">★★★★★</span> ${esc(c.rating)}</a></p>
        <p><a href="https://maps.google.com/?q=Boost+Club+Strada+Sevastopol+24+Bucuresti" target="_blank" rel="noopener">${esc(c.map)}</a></p>
      </div>
    </div>
  </section>

  <section class="final">
    <div class="wrap">
      <h2>${esc(c.finalTitle)}</h2>
      <p>${esc(c.finalText)}</p>
      ${cta(" btn-big")}
    </div>
  </section>
</main>

<footer class="foot">
  <div class="wrap">
    <p>Boost Club · Strada Sevastopol 24, Sector 1, Bucharest · <a href="${lang === "en" ? "/" : "/ro/"}">boostclub.ro</a></p>
    <p class="small">${esc(c.disclosure(partner.name))}</p>
  </div>
</footer>

<dialog class="sheet" id="lead-sheet" aria-labelledby="sheet-title">
  <form id="partner-form" name="partner-page" method="POST" data-netlify="true" netlify-honeypot="bot-field" novalidate
        data-wa="${esc(waNumber)}" data-wa-text="${esc(c.waText(first))}"
        data-err-name="${esc(c.errName)}" data-err-phone="${esc(c.errPhone)}" data-err-prefix="${esc(c.errPrefix)}">
    <input type="hidden" name="form-name" value="partner-page">
    <input type="hidden" name="partner" value="${esc(slug)}">
    <input type="hidden" name="lang" value="${lang}">
    <p class="hp"><label>Leave empty: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
    <button type="button" class="close" data-close aria-label="Close">×</button>
    <h2 id="sheet-title">${esc(c.sheetTitle(first))}</h2>
    <p class="sheet-text">${esc(c.sheetText(first))}</p>
    <label for="firstname">${esc(c.nameLabel)}</label>
    <input id="firstname" name="firstname" type="text" required autocomplete="given-name" maxlength="60" placeholder="${esc(c.namePh)}">
    <label for="phone">${esc(c.phoneLabel)}</label>
    <input id="phone" name="phone" type="tel" required autocomplete="tel" inputmode="tel" maxlength="20" placeholder="${esc(c.phonePh)}">
    <p class="error" id="form-error" role="alert" hidden></p>
    <button type="submit" class="btn btn-gold btn-full">${esc(c.send)}</button>
    <p class="small">${esc(c.consent)} <a href="${c.privacyHref}">${esc(c.privacy)}</a></p>
  </form>
</dialog>

<script src="/js/lang-route.js"></script>
<script src="/partners/partner.js?v=1"></script>
</body>
</html>
`;
}

export function readPartners(root) {
  const file = path.join(root, "partners", "partners.json");
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, "utf8")).partners || {};
}

export function partnerRoutes(root) {
  return Object.entries(readPartners(root))
    .filter(([, partner]) => partner.active)
    .flatMap(([slug]) => [routeFor("en", slug), routeFor("ro", slug)]);
}

// Runs after the main site is built, so a slug that collides with a real page fails the build.
export function buildPartnerPages(root, outputRoot) {
  const partners = readPartners(root);
  const redirects = [];
  const built = [];
  for (const [slug, partner] of Object.entries(partners)) {
    if (!/^[a-z0-9-]{3,40}$/.test(slug)) throw new Error(`partners: bad slug "${slug}" (lowercase letters, digits, dashes)`);
    for (const lang of ["en", "ro"]) {
      const dir = path.join(outputRoot, ...(lang === "en" ? [slug] : [lang, slug]));
      if (fs.existsSync(dir) || fs.existsSync(`${dir}.html`)) throw new Error(`partners: slug "${slug}" collides with an existing page at ${path.relative(outputRoot, dir)}`);
    }
    if (!partner.active) {
      redirects.push(`/${slug}    /    302`, `/${slug}/*    /    302`, `/ro/${slug}    /ro/    302`, `/ro/${slug}/*    /ro/    302`);
      continue;
    }
    for (const key of ["name", "initials", "whatsapp", "stat", "focus", "en", "ro"]) {
      if (!partner[key]) throw new Error(`partners: ${slug} is missing "${key}"`);
    }
    if (!/^\+[1-9][0-9]{7,14}$/.test(partner.whatsapp)) throw new Error(`partners: ${slug} whatsapp must be E.164 (+40...)`);
    const photo = photoFor(root, slug, partner.photo);
    const clubPhoto = photoFor(root, slug, partner.clubPhoto);
    for (const lang of ["en", "ro"]) {
      const html = renderPage({ lang, slug, partner, photo, clubPhoto });
      if (/—/.test(html)) throw new Error(`partners: ${slug}/${lang} contains an em dash`);
      const dir = path.join(outputRoot, ...(lang === "en" ? [slug] : [lang, slug]));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), html);
      built.push(routeFor(lang, slug));
    }
  }
  if (redirects.length) {
    const file = path.join(outputRoot, "_redirects");
    // Prepended: Netlify uses the first matching rule.
    const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
    fs.writeFileSync(file, `# Inactive partners (partners/partners.json)\n${redirects.join("\n")}\n\n${existing}`);
  }
  return built;
}
