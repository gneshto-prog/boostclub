import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const collection = JSON.parse(fs.readFileSync('content/transformation-cards.json', 'utf8'));
const excluded = new Set(['A08', 'A09', 'A10', 'B07', 'D16', 'E03', 'E06']);
const expected = Object.entries({ A: 17, B: 12, C: 7, D: 19, E: 6 })
  .flatMap(([set, count]) => Array.from({ length: count }, (_, index) => `${set}${String(index + 1).padStart(2, '0')}`))
  .filter(code => !excluded.has(code));

test('results wall includes every approved card once, with intact square responsive assets', () => {
  assert.equal(expected.length, 54);
  assert.deepEqual(collection.cards.map(card => card.code), expected);
  assert.equal(new Set(collection.cards.map(card => card.sourceSha256)).size, 54);
  for (const [index, card] of collection.cards.entries()) {
    assert.equal(card.number, index + 1);
    assert.equal(card.sourceWidth, 1772);
    assert.equal(card.sourceHeight, 1772);
    assert.deepEqual(card.variants.map(variant => variant.width), [480, 800, 1200]);
    for (const variant of card.variants) {
      const bytes = fs.readFileSync(variant.src);
      assert.equal(variant.height, variant.width);
      assert.equal(bytes.length, variant.bytes);
      assert.ok(variant.src.includes(`.${createHash('sha256').update(bytes).digest('hex').slice(0, 12)}.`));
    }
  }
});

test('all locales render 54 numbered cards, exact owner copy, lazy loading and the disclaimer', () => {
  const copy = {
    ro: ['Transformări din comunitatea noastră extinsă, publicate cu acordul lor. Rezultatele variază de la o persoană la alta.', 'Înainte și după, transformarea', 'Rezultatele variază de la persoană la persoană'],
    en: ['Transformations from our wider community, published with their consent. Results may vary from person to person.', 'Before and after, transformation', 'Results vary from person to person'],
    ru: ['Трансформации из нашего расширенного сообщества, опубликованы с их согласия. Результаты у каждого разные.', 'До и после, трансформация', 'Результаты варьируются от человека к человеку'],
  };
  for (const [lang, [intro, alt, disclaimer]] of Object.entries(copy)) {
    const prefix = lang === 'ro' ? '' : `${lang}/`;
    const html = fs.readFileSync(`_site/${prefix}rezultate.html`, 'utf8');
    assert.ok(html.includes(`<p class="lead mt-2">${intro}</p>`));
    const cards = [...html.matchAll(/<figure data-card="([^"]+)">([\s\S]*?)<\/figure>/g)];
    assert.deepEqual(cards.map(match => match[1]), expected);
    for (const [index, match] of cards.entries()) {
      assert.ok(match[2].includes(`alt="${alt} ${index + 1}"`));
      assert.match(match[2], /srcset="[^"]+480w, [^"]+800w, [^"]+1200w"/);
      assert.match(match[2], index === 0 ? /loading="eager"/ : /loading="lazy"/);
    }
    assert.ok(html.indexOf(`<strong>${disclaimer}</strong>`) > html.indexOf('data-card="E05"'));
    assert.doesNotMatch(html, /<img[^>]+(?:before|[Rr]esults\d+)\.webp/);
    const home = fs.readFileSync(`_site/${prefix}index.html`, 'utf8');
    assert.deepEqual([...home.matchAll(/data-card="([^"]+)"/g)].map(match => match[1]), expected.slice(0, 3));
    assert.doesNotMatch(home + html, /(?:Transformare membru Boost Club|Boost Club member transformation|Трансформация участника Boost Club)/);
  }
});
