import fs from 'node:fs';

export const transformationCards = JSON.parse(fs.readFileSync(new URL('../../content/transformation-cards.json', import.meta.url), 'utf8')).cards;
export const transformationCopy = {
  ro: { title: 'Transformări', intro: 'Transformări din comunitatea noastră extinsă, publicate cu acordul lor. Rezultatele variază de la o persoană la alta.', alt: 'Înainte și după, transformarea', open: 'Deschide cardul integral' },
  en: { title: 'Transformations', intro: 'Transformations from our wider community, published with their consent. Results may vary from person to person.', alt: 'Before and after, transformation', open: 'Open the full card' },
  ru: { title: 'Трансформации', intro: 'Трансформации из нашего расширенного сообщества, опубликованы с их согласия. Результаты у каждого разные.', alt: 'До и после, трансформация', open: 'Открыть карточку полностью' },
};

export function transformationGallery(lang, preview = false) {
  const copy = transformationCopy[lang];
  const cards = preview ? transformationCards.slice(0, 3) : transformationCards;
  return `<div class="results-grid transformation-grid">${cards.map((card, index) => {
    const full = card.variants.at(-1);
    return `<figure data-card="${card.code}"><a href="/${full.src}" target="_blank" rel="noopener" title="${copy.open}"><img src="/${full.src}" width="1200" height="1200" alt="${copy.alt} ${card.number}" loading="${!preview && index === 0 ? 'eager' : 'lazy'}" decoding="async"></a></figure>`;
  }).join('\n')}</div>`;
}
