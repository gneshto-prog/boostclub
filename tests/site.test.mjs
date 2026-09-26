import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { header } from '../scripts/lib/components.mjs';
import { structuredHead } from '../scripts/lib/structured-data.mjs';

const pages = ['ro','en','ru'].flatMap(lang => JSON.parse(fs.readFileSync(`content/${lang}/pages.json`)));
test('localized canonicals, reciprocal alternates and schema identities remain consistent', () => {
  for (const page of pages) {
    const html = fs.readFileSync(`_site/${page.output}`, 'utf8');
    const prefix = page.lang === 'ro' ? '/' : `/${page.lang}/`;
    const expected = `https://boostclub.ro${prefix}${page.slug === 'index' ? '' : page.slug}`;
    assert.ok(html.includes(`rel="canonical" href="${expected}"`), page.output);
    assert.ok(html.includes(`lang="${page.lang}"`));
    for (const lang of ['ro','en','ru','x-default']) {
      const defaultLang = ['business','gabi'].includes(page.slug) ? 'en' : 'ro';
      const target = lang === 'x-default' ? defaultLang : lang;
      const base = target === 'ro' ? '/' : `/${target}/`;
      assert.ok(html.includes(`hreflang="${lang}" href="https://boostclub.ro${base}${page.slug === 'index' ? '' : page.slug}"`), `${page.output}: ${lang}`);
    }
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (page.slug === 'multumim') { assert.match(html, /noindex/); continue; }
    assert.equal(scripts.length, 1, page.output);
    const schema = JSON.parse(scripts[0][1]);
    const business = schema['@graph'].find(item => item['@type'] === 'LocalBusiness');
    assert.equal(business['@id'], 'https://boostclub.ro/#business');
    assert.equal(business.telephone, '+40726205752');
    assert.equal(business.address.streetAddress, 'Strada Sevastopol 24');
    assert.equal(business.geo, undefined);
    assert.equal(business.openingHoursSpecification, undefined);
    assert.doesNotMatch(scripts[0][1], /WellnessCenter|AggregateRating|FAQPage/);
  }
});
test('consumer navigation is consistent on legal pages and both viewports', () => {
  for (const lang of ['ro','en','ru']) for (const slug of ['index','contact','cookies','termeni','confidentialitate']) {
    const html = header({ lang, slug });
    assert.equal((html.match(/href="rezultate"/g) || []).length, 2);
    assert.doesNotMatch(html, /href="business"/);
    assert.match(html, /aria-controls="mobile-navigation"/);
    assert.equal((html.match(/id="mobile-navigation"/g)||[]).length, 1);
  }
});
test('contact, terms and scroll regions implement factual and keyboard corrections', () => {
  for (const lang of ['ro','en','ru']) {
    const contact = fs.readFileSync(`_site/${lang==='ro'?'':lang+'/'}contact.html`, 'utf8');
    assert.match(contact, /M1 \/ M2/); assert.doesNotMatch(contact, /M3/);
    assert.match(contact, /destination=Strada\+Sevastopol\+24\+Bucuresti/);
    const cookies = pages.find(p => p.lang === lang && p.slug === 'cookies');
    assert.match(cookies.body, /class="table-scroll" tabindex="0" role="region" aria-label=/);
  }
  assert.doesNotMatch(pages.find(p=>p.lang==='ro'&&p.slug==='termeni').body, /53\/2003/);
  assert.ok(structuredHead(pages[0]).includes('https://boostclub.ro/#gabriel'));
});
