"""Create responsive derivatives without cropping or replacing originals.

Requires Pillow (development only). Output names include the bytes' SHA-256;
unchanged derivatives remain stable and can be cached immutably.
"""
from pathlib import Path
from PIL import Image
import hashlib
import io
import json

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
for name in names:
    original = images / name
    with Image.open(original) as image:
        variants = []
        for width in ([320, 640, 960] if name == 'boost-club-community.webp' else [320, 640]):
            if width >= image.width:
                continue
            height = round(image.height * width / image.width)
            output = io.BytesIO()
            image.resize((width, height), Image.Resampling.LANCZOS).save(output, 'WEBP', quality=85, method=6)
            data = output.getvalue()
            filename = f'{original.stem}.{hashlib.sha256(data).hexdigest()[:12]}.{width}.webp'
            (destination / filename).write_bytes(data)
            variants.append({'width': width, 'height': height, 'src': f'images/responsive/{filename}', 'bytes': len(data)})
        manifest[f'images/{name}'] = {'width': image.width, 'height': image.height, 'bytes': original.stat().st_size, 'variants': variants}
(root / 'content/responsive-images.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Prepared derivatives for {len(manifest)} images; originals preserved.')
