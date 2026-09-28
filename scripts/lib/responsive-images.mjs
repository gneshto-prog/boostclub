import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync(new URL('../../content/responsive-images.json', import.meta.url), 'utf8'));

export function responsiveImages(body) {
  return body.replace(/<img\b[^>]*>/g, tag => {
    if (/\bsrcset=/.test(tag)) return tag;
    const source=tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (!source) return tag;
    const key=source.replace(/^(?:\.\.\/|\/)/,'');
    const image=manifest[key];
    if (!image) return tag;
    const prefix=source.startsWith('../')?'../':source.startsWith('/')?'/':'';
    const srcset=[...image.variants.map(v=>`${prefix}${v.src} ${v.width}w`),`${source} ${image.width}w`].join(', ');
    const hero=/fetchpriority="high"/.test(tag);
    const gallery=/(?:before|[Rr]esults\d+)\.webp$/.test(source);
    const community=key==='images/boost-club-community.webp';
    const card=key.startsWith('images/responsive/transformation-');
    const sizes=card?'(max-width: 699px) calc(100vw - 48px), (max-width: 999px) calc((100vw - 72px) / 2), (max-width: 1180px) calc((100vw - 96px) / 3), 362px':community?'(max-width: 899px) calc(100vw - 48px), (max-width: 1199px) 50vw, 580px':hero?'(max-width: 767px) calc(100vw - 48px), (max-width: 1199px) 42vw, 460px':gallery?'(max-width: 639px) calc((100vw - 64px) / 2), (max-width: 1023px) 30vw, 300px':'(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) 45vw, 560px';
    return tag.replace(/>$/,` srcset="${srcset}" sizes="${sizes}">`);
  });
}

export function responsivePreloads(head, body) {
  return head.replace(/<link\b[^>]*rel="preload"[^>]*>/g, tag => {
    if (!/as="image"/.test(tag)) return tag;
    const source=tag.match(/href="([^"]+)"/)?.[1];
    const img=[...body.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]).find(img=>img.includes(`src="${source}"`));
    const srcset=img?.match(/srcset="([^"]+)"/)?.[1];
    const sizes=img?.match(/sizes="([^"]+)"/)?.[1];
    return srcset ? tag.replace(/>$/,` imagesrcset="${srcset}" imagesizes="${sizes}">`) : tag;
  });
}
