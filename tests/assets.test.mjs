import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const manifest=JSON.parse(fs.readFileSync('content/responsive-images.json'));
test('immutable image names match actual bytes and original aspect ratios remain intact',()=>{
  for(const [source,image] of Object.entries(manifest)) {
    assert.ok(fs.existsSync(source));
    for(const variant of image.variants) {
      const bytes=fs.readFileSync(variant.src);
      const hash=createHash('sha256').update(bytes).digest('hex').slice(0,12);
      assert.ok(variant.src.includes(`.${hash}.`));
      assert.equal(bytes.length,variant.bytes);
      assert.ok(Math.abs(variant.height-image.height*variant.width/image.width)<=.5);
    }
  }
  const config=fs.readFileSync('netlify.toml','utf8');
  assert.match(config,/for = "\/images\/responsive\/\*"[\s\S]*?Cache-Control = "public, max-age=31536000, immutable"/);
});
test('hero preload selects the same responsive asset as the rendered image',()=>{
  for(const prefix of ['', 'en/', 'ru/']) {
    const html=fs.readFileSync(`_site/${prefix}index.html`,'utf8');
    const preload=html.match(/<link[^>]+rel="preload"[^>]*>/)?.[0];
    const hero=html.match(/<img[^>]+fetchpriority="high"[^>]*>/)?.[0];
    assert.ok(preload&&hero);
    assert.equal(preload.match(/imagesrcset="([^"]+)"/)?.[1],hero.match(/srcset="([^"]+)"/)?.[1]);
    assert.equal(preload.match(/imagesizes="([^"]+)"/)?.[1],hero.match(/sizes="([^"]+)"/)?.[1]);
    assert.doesNotMatch(hero,/loading="lazy"/);
    assert.doesNotMatch(html,/<iframe[^>]+src="https:\/\/(?:www\.)?google\.com\/maps/);
    assert.match(html,/data-map-src=/);
  }
});
