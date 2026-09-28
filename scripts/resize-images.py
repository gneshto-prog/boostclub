"""Create responsive derivatives without cropping or replacing originals.

Requires Pillow (development only). Output names include the bytes' SHA-256;
unchanged derivatives remain stable and can be cached immutably.
"""
from pathlib import Path
from PIL import Image
import hashlib
import io
import json
import sys

root = Path(__file__).resolve().parent.parent
images = root / 'images'
destination = images / 'responsive'
destination.mkdir(exist_ok=True)
names = ['before.webp', 'Results1.webp', 'results3.webp', 'results5.webp',
         'results6.webp', 'results7.webp', 'results8.webp', 'results9.webp',
         'results11.webp', 'results12.webp', 'results13.webp',
         'familie-neshto-wellness.webp', 'gabriel-competitie-atletism.webp',
         'gabriel-neshto-mma.webp', 'gabriel-antrenament.webp',
         'consultatie-wellness-boost-club.webp', 'gabriel-neshto-boost-club-bucuresti.webp',
         'gabriel-neshto-consultant-wellness.webp', 'boost-club-community.webp']
manifest = {}

def webp_variant(image, width, stem, quality=85):
    height = round(image.height * width / image.width)
    output = io.BytesIO()
    image.resize((width, height), Image.Resampling.LANCZOS).save(output, 'WEBP', quality=quality, method=6)
    data = output.getvalue()
    filename = f'{stem}.{hashlib.sha256(data).hexdigest()[:12]}.{width}.webp'
    (destination / filename).write_bytes(data)
    return {'width': width, 'height': height, 'src': f'images/responsive/{filename}', 'bytes': len(data)}

for name in names:
    original = images / name
    with Image.open(original) as image:
        variants = []
        for width in ([320, 640, 960] if name == 'boost-club-community.webp' else [320, 640]):
            if width >= image.width:
                continue
            variants.append(webp_variant(image, width, original.stem))
        manifest[f'images/{name}'] = {'width': image.width, 'height': image.height, 'bytes': original.stat().st_size, 'variants': variants}

# Import only the finished, approved cards. Never run the source retouching tools.
# Usage: python scripts/resize-images.py --cards '/path/to/Boost Club Results Wall/cards'
cards_manifest = root / 'content/transformation-cards.json'
if len(sys.argv) > 1:
    if len(sys.argv) != 3 or sys.argv[1] != '--cards':
        raise SystemExit('Usage: resize-images.py [--cards /path/to/cards]')
    sources = Path(sys.argv[2])
    held_back = {'A08', 'A09', 'B07', 'D16', 'E03', 'E06', 'results10'}
    # results10 was never made into A10; its caption belongs to A06.
    approved = sorted({f'{group}{number:02}' for group, count in [('A', 17), ('B', 12), ('C', 7), ('D', 19), ('E', 6)] for number in range(1, count + 1)} - held_back - {'A10'})
    if sorted(p.stem for p in sources.glob('*.png')) != approved:
        raise SystemExit('Card folder must contain exactly the 54 approved PNGs; no held-back cards.')
    cards, seen = [], set()
    for number, code in enumerate(approved, 1):
        source = sources / f'{code}.png'
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        if digest in seen:
            raise SystemExit(f'Duplicate source card: {code}')
        seen.add(digest)
        with Image.open(source) as image:
            if image.size != (1772, 1772):
                raise SystemExit(f'Unexpected card dimensions: {code}')
            variants = [webp_variant(image, width, f'transformation-{code}', quality=90) for width in [480, 800, 1200]]
        cards.append({'code': code, 'number': number, 'source': source.name, 'sourceSha256': digest, 'sourceWidth': 1772, 'sourceHeight': 1772, 'variants': variants})
    cards_manifest.write_text(json.dumps({'source': 'Boost Club Results Wall/cards', 'processing': 'Resize and WebP conversion only; complete artwork preserved.', 'heldBack': sorted(held_back), 'cards': cards}, indent=2) + '\n')
if cards_manifest.exists():
    for card in json.loads(cards_manifest.read_text())['cards']:
        full = card['variants'][-1]
        manifest[full['src']] = {key: full[key] for key in ['width', 'height', 'bytes']}
        manifest[full['src']]['variants'] = card['variants'][:-1]
(root / 'content/responsive-images.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Prepared derivatives for {len(manifest)} images; originals preserved.')
