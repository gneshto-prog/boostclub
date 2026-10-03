import { localeContent, navigation } from "../../content/site.mjs";

const leaf = '<svg class="logo-leaf" viewBox="0 0 24 25.7" aria-hidden="true" focusable="false"><path class="leaf-body" d="M18.62 0h2.56C23.06 0 24 5.98 24 9.22v2.48c0 7.94-6.92 14-18.62 14H2.82C.85 25.7 0 19.64 0 17.08v-3.59C0 5.98 6.83 0 18.62 0Z"/><path class="leaf-slash" d="M3.5 22.8 14.94 9.48"/></svg>';
const logoVisual = `B${leaf}${leaf}st&nbsp;Club<span class="dot">.</span>`;
const whatsappIcon = '<svg class="wa-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
const phoneIcon = '<svg class="icon-phone" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function languageHref(from, to, slug) {
  const page = slug === "index" ? "" : slug;
  if (from === "ro") return to === "ro" ? page || "./" : `${to}/${page}`;
  if (to === "ro") return page ? `../${page}` : "../";
  if (from === to) return page || "./";
  return page ? `../${to}/${page}` : `../${to}/`;
}

function renderLanguageSwitcher(lang, slug) {
  return ["ro", "en", "ru"].map((code) => {
    const label = code.toUpperCase();
    if (code === lang) return `<span class="lang-active">${label}</span>`;
    return `<a href="${languageHref(lang, code, slug)}" lang="${code}" hreflang="${code}">${label}</a>`;
  }).join('<span class="lang-sep">|</span>');
}

const applyLabels = { ro: "Aplică acum", en: "Apply now", ru: "Подать заявку" };

function navItems({ lang, slug, mobile }) {
  return navigation
    .filter((item) => item.slug !== "business")
    .map((item) => ({
      href: slug === "ambasador" && item.slug === "business" ? "ambasador" : item.slug,
      label: item.labels[lang],
      current: item.slug === slug || (slug === "ambasador" && item.slug === "business"),
    }));
}

export function nav({ lang, slug, mobile = false }) {
  const copy = localeContent[lang];
  const items = navItems({ lang, slug, mobile });
  const links = items.map((item) => `<a href="${item.href}"${item.current ? ' aria-current="page"' : ""}>${item.label}</a>`).join("\n    ");
  if (slug === "program-trainee") {
    const identity = mobile ? ' id="mobile-navigation"' : "";
    const className = mobile ? "mobile-menu" : "nav";
    const label = mobile ? copy.mobileNavLabel : copy.navLabel;
    const cta = mobile ? "" : `\n      <a href="consultatie-gratuita" class="btn btn-primary">${copy.book}</a>`;
    return `<nav class="${className}"${identity} aria-label="${label}">\n    ${links}${cta}\n  </nav>`;
  }
  const switcher = renderLanguageSwitcher(lang, slug);
  if (mobile) {
    return `<nav id="mobile-navigation" class="mobile-menu" aria-label="${copy.mobileNavLabel}">\n    ${links}\n    <div class="lang-switcher" aria-label="Language">${switcher}</div>\n  </nav>`;
  }
  const ctaHref = slug === "ambasador" ? "#cerere" : slug === "consultatie-gratuita" ? (lang === "ro" ? "#formular" : "#form") : "consultatie-gratuita";
  const ctaLabel = slug === "ambasador" ? applyLabels[lang] : copy.book;
  return `<nav class="nav" aria-label="${copy.navLabel}">\n      ${links}\n      <a href="${ctaHref}" class="btn btn-primary">${ctaLabel}</a>\n      <div class="lang-switcher" aria-label="Language">${switcher}</div>\n    </nav>`;
}

export function header({ lang, slug }) {
  const copy = localeContent[lang];
  const controls = ' aria-controls="mobile-navigation"';
  return `<header class="site-header">
  <div class="container header-inner">
    <a href="./" class="logo"><span class="sr-only">Boost Club</span><span class="logo-visual" aria-hidden="true">${logoVisual}</span></a>
    ${nav({ lang, slug })}
    <button class="menu-toggle"${controls} aria-expanded="false" aria-label="${copy.menuLabel}"><span></span></button>
  </div>
  ${nav({ lang, slug, mobile: true })}
</header>`;
}

export function footer({ lang }) {
  const copy = localeContent[lang];
  const wa = `https://wa.me/40726205752?text=${copy.whatsappText}`;
  const navLinks = navigation;
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <h3 class="sr-only">Boost Club</h3>
        <div class="footer-brand">
        <div class="logo footer-logo" role="img" aria-label="Boost Club">${logoVisual}</div>
        <p class="brand-tagline">Be your best</p>
        </div>
        <address class="footer-nap">
          ${copy.location}<br>
          <a href="tel:+40726205752">+40 726 205 752</a><br>
          <a href="${wa}">WhatsApp</a>
        </address>
        <p class="small mt-2">${copy.hours}</p>
      </div>
      <div>
        <h3>${copy.navigate}</h3>
        ${navLinks.map((item, index) => `<a href="${item.slug}">${item.labels[lang]}</a>${index < navLinks.length - 1 ? "<br>" : ""}`).join("\n        ")}
      </div>
      <div>
        <h3>${copy.legal}</h3>
        <a href="confidentialitate">${copy.privacy}</a><br>
        <a href="termeni">${copy.terms}</a><br>
        <a href="cookies">${copy.cookies}</a>
      </div>
    </div>
    <div class="footer-legal">
      <p>${copy.disclosure}</p>
      <p class="mt-2">© <span id="year">2026</span> Boost Club. ${copy.rights}</p>
    </div>
  </div>
</footer>`;
}

export function documentTemplate({ doctype, htmlOpen, head, bodyOpen, body }) {
  return `${doctype}\n${htmlOpen}\n<head>${head}</head>\n${bodyOpen}${body}</body>\n</html>\n`;
}

export function hero(markup) { return markup; }
export function ctaBlock(markup) { return markup; }
export function reviewCard(markup) { return markup; }
export function faqBlock(markup) { return markup; }
export function form(markup) { return markup; }

export function renderRegisteredComponents(markup) {
  let output = markup;
  output = output.replace(/<form\b[^>]*>/gi, (match) => form(match));
  output = output.replace(/<(?:section|header)\b[^>]*class="[^"]*\bhero\b[^"]*"[^>]*>/gi, (match) => hero(match));
  output = output.replace(/<(?:div|section)\b[^>]*class="[^"]*\b(?:hero-ctas|cta-row)\b[^"]*"[^>]*>/gi, (match) => ctaBlock(match));
  output = output.replace(/<blockquote\b[^>]*class="[^"]*\bquote\b[^"]*"[^>]*>/gi, (match) => reviewCard(match));
  output = output.replace(/<(?:div|section)\b[^>]*class="[^"]*\bfaq(?:-item|-list)?\b[^"]*"[^>]*>/gi, (match) => faqBlock(match));
  return output;
}

export function stickyActions({ lang }) {
  const copy = localeContent[lang];
  const wa = `https://wa.me/40726205752?text=${copy.whatsappText}`;
  return `<div class="sticky-bar">
  <a href="tel:+40726205752" class="btn btn-secondary btn-icon" aria-label="${copy.callLabel}">${phoneIcon}<span class="sr-only">${copy.callLabel}</span></a>
  <a href="${wa}" class="btn btn-whatsapp btn-icon">${whatsappIcon}<span class="sr-only">WhatsApp</span></a>
  <a href="consultatie-gratuita" class="btn btn-primary">${copy.book}</a>
</div>`;
}
