"""Build local, uncropped WebP assets from the saved owner-gallery download.

Usage: python scripts/import-club-photos.py /path/to/download-manifest.json
Requires Pillow. Source downloads remain untouched outside the public site.
"""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib
import io
import json
import sys

root = Path(__file__).resolve().parent.parent
download = json.loads(Path(sys.argv[1]).read_text())
copy = json.loads((root / 'content/club-photo-descriptions.json').read_text())
destination = root / 'images/club-gallery'
destination.mkdir(exist_ok=True)
seen, photos, duplicates = {}, [], []
for source in download['photos']:
    number, digest = source['number'], source['sha256']
    if digest in seen:
        duplicates.append({'number': number, 'duplicateOf': seen[digest]})
        continue
    seen[digest] = number
    image = ImageOps.exif_transpose(Image.open(source['file'])).convert('RGB')
    variants = []
    for width in sorted(set([min(320, image.width), min(640, image.width), image.width])):
        height = round(image.height * width / image.width)
        output = io.BytesIO()
        image.resize((width, height), Image.Resampling.LANCZOS).save(output, 'WEBP', quality=84, method=6)
        data = output.getvalue()
        name = f'boost-club-{number:02}.{hashlib.sha256(data).hexdigest()[:12]}.{width}.webp'
        (destination / name).write_bytes(data)
        variants.append({'src': f'images/club-gallery/{name}', 'width': width, 'height': height, 'bytes': len(data)})
    photos.append({'number': number, 'sourceUrl': source['url'], 'sourceSha256': digest,
                   'alt': copy[str(number)], 'variants': variants})
manifest = {'downloadedAt': download['date'], 'source': download['listing'],
            'gallery': download['gallery'], 'downloadedCount': len(download['photos']),
            'duplicates': duplicates, 'photos': photos}
(root / 'content/club-photos.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(f"Prepared {len(photos)} unique photos; retained all {len(download['photos'])} source downloads.")
