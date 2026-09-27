import fs from 'node:fs';

const collection = JSON.parse(fs.readFileSync(new URL('../../content/club-photos.json', import.meta.url), 'utf8'));
const copy = {
  ro: { title: 'O privire în Boost Club', intro: 'Spațiul, oamenii și momentele de zi cu zi din clubul nostru din București.', preview: 'Vezi toate cele 23 de imagini din club', more: 'Mai multe imagini (17)', source: 'Imagini publicate de Boost Club pe Google Maps.', open: 'Deschide imaginea integrală într-o filă nouă', captions: ['În interiorul clubului', 'În jurul mesei', 'La tejgheaua Boost Club'] },
  en: { title: 'A look inside Boost Club', intro: 'The space, the people and everyday moments at our Bucharest club.', preview: 'See all 23 club images', more: 'More images (17)', source: 'Images published by Boost Club on Google Maps.', open: 'Open the full image in a new tab', captions: ['Inside the club', 'Around the table', 'At the Boost Club counter'] },
  ru: { title: 'Загляните в Boost Club', intro: 'Пространство, люди и повседневные моменты нашего клуба в Бухаресте.', preview: 'Все 23 изображения клуба', more: 'Ещё изображения (17)', source: 'Изображения, опубликованные Boost Club в Google Maps.', open: 'Открыть полное изображение в новой вкладке', captions: ['Внутри клуба', 'За общим столом', 'У стойки Boost Club'] },
};
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

function photo(number) { return collection.photos.find(item => item.number === number); }
function image(item, lang, className = '', sizes = '(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc((100vw - 72px) / 2), 357px') {
  const full = item.variants.at(-1);
  return `<img src="/${full.src}" srcset="${item.variants.map(v => `/${v.src} ${v.width}w`).join(', ')}" sizes="${sizes}" width="${full.width}" height="${full.height}" alt="${escape(item.alt[lang])}"${className ? ` class="${className}"` : ''} loading="lazy" decoding="async">`;
}
function figure(item, lang, caption = '') {
  return `<figure><a href="/${item.variants.at(-1).src}" target="_blank" rel="noopener" title="${copy[lang].open}">${image(item, lang)}</a>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
}

export function clubPhotoPreview(lang) {
  return `<div class="club-photo-preview"><div class="club-photo-highlights">${[2, 5, 18].map((n, i) => figure(photo(n), lang, copy[lang].captions[i])).join('')}</div><p class="mt-3"><a href="contact#club-gallery">${copy[lang].preview} →</a></p></div>`;
}

export function clubContactPhoto(lang) {
  return image(photo(2), lang, 'entrance-photo', '(max-width: 767px) calc(100vw - 48px), 560px');
}

export function clubGallery(lang) {
  const text = copy[lang];
  const featured = [2, 5, 18, 24, 6, 11].map(photo);
  const remaining = collection.photos.filter(item => !featured.includes(item));
  return `<section class="section section-sage" id="club-gallery" aria-labelledby="club-gallery-title"><div class="container">
    <div class="section-head"><h2 id="club-gallery-title">${text.title}</h2><p>${text.intro}</p></div>
    <div class="club-photo-grid">${featured.map(item => figure(item, lang)).join('')}</div>
    <details class="club-photo-more"><summary>${text.more}</summary><div class="club-photo-grid">${remaining.map(item => figure(item, lang)).join('')}</div></details>
    <p class="small mt-3"><a href="${collection.source}" target="_blank" rel="noopener">${text.source}</a></p>
  </div></section>`;
}
