// One identity across localized pages. Hours, precise coordinates and credentials
// are intentionally withheld until the owner resolves the audit discrepancies.
const origin = 'https://boostclub.ro';
const businessId = `${origin}/#business`;
const personId = `${origin}/#gabriel`;
const copy = {
  ro: { home: 'Acasă', description: 'Club de nutriție în București, pe Strada Sevastopol 24, lângă Piața Victoriei. Shake-uri proteice, evaluare corporală prin bioimpedanță și ghidare educațională.' },
  en: { home: 'Home', description: 'Nutrition club in Bucharest at Strada Sevastopol 24, near Victoria Square. Protein shakes, bioimpedance body assessment and educational guidance.' },
  ru: { home: 'Главная', description: 'Клуб питания в Бухаресте на Strada Sevastopol 24, рядом с площадью Виктории. Протеиновые коктейли, оценка состава тела методом биоимпеданса и образовательные консультации.' },
};

export function structuredHead(page) {
  if (!copy[page.lang] || ['program-trainee', '404', 'multumim'].includes(page.slug)) return page.head;
  const locale = copy[page.lang];
  const home = `${origin}/${page.lang === 'ro' ? '' : `${page.lang}/`}`;
  const url = home + (page.slug === 'index' ? '' : page.slug);
  const title = page.head.match(/<title>(.*?)<\/title>/s)?.[1].replace(/&amp;/g, '&') || 'Boost Club';
  const graph = [
    { '@type': 'WebSite', '@id': `${origin}/#website`, url: `${origin}/`, name: 'Boost Club', inLanguage: ['ro', 'en', 'ru'] },
    { '@type': 'LocalBusiness', '@id': businessId, name: 'Boost Club', url: `${origin}/`, telephone: '+40726205752',
      address: { '@type': 'PostalAddress', streetAddress: 'Strada Sevastopol 24', addressLocality: 'București', addressRegion: 'Sector 1', addressCountry: 'RO' },
      description: locale.description, image: `${origin}/images/og-image.jpg`,
      hasMap: 'https://www.google.com/maps/search/?api=1&query=Strada+Sevastopol+24+Bucuresti',
      founder: { '@id': personId } },
    { '@type': 'Person', '@id': personId, name: 'Gabriel Neshto', url: `${origin}/gabriel`,
      sameAs: ['https://gabrielneshto.com/', 'https://www.instagram.com/gabineshto'] },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, inLanguage: page.lang,
      isPartOf: { '@id': `${origin}/#website` }, about: { '@id': ['gabriel','gabi','business'].includes(page.slug) ? personId : businessId } },
  ];
  if (page.slug !== 'index') graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
    { '@type': 'ListItem', position: 1, name: locale.home, item: home },
    { '@type': 'ListItem', position: 2, name: title.split('|')[0].trim(), item: url },
  ] });
  // Remove duplicated/stale FAQ answers and unsupported WellnessCenter markup.
  // Visible FAQs and original customer quotations remain in the page body.
  const head = page.head.replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
  return `${head}\n  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>\n`;
}
