#!/usr/bin/env python3
"""PNG originals -> WebP for the /menutest drink photos. Same pipeline as the shake images:
480 x 720, LANCZOS, WebP quality 82, alpha quality 60, method 6, fully transparent pixels get
their RGB blanked so they cost no bytes.

    python3 scripts/build-drink-images.py            # convert every PNG
    python3 scripts/build-drink-images.py --check    # convert to memory and report size diffs only

Reads  future-assets/drink-photos-original/*.png (1024 x 1536 RGBA, same cup position as the shakes)
Writes menu/images/drinks/web/<name>.webp
"""
import glob, io, os, sys
from PIL import Image
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "future-assets", "drink-photos-original")
OUT = os.path.join(ROOT, "menu", "images", "drinks", "web")
CHECK = "--check" in sys.argv

def convert(path):
    im = Image.open(path).convert("RGBA").resize((480, 720), Image.LANCZOS)
    a = np.asarray(im).copy()
    a[a[..., 3] == 0, :3] = 0
    buf = io.BytesIO()
    Image.fromarray(a).save(buf, "WEBP", quality=82, alpha_quality=60, method=6)
    return buf.getvalue()

files = sorted(glob.glob(os.path.join(SRC, "*.png")))
if not files:
    sys.exit("no PNGs in " + SRC)
os.makedirs(OUT, exist_ok=True)
total = 0
for f in files:
    name = os.path.basename(f)[:-4] + ".webp"
    data = convert(f)
    total += len(data)
    dest = os.path.join(OUT, name)
    if CHECK:
        old = os.path.getsize(dest) if os.path.exists(dest) else 0
        print(f"{name:34} {len(data):7d} B  existing {old:7d} B  diff {len(data)-old:+d}")
    else:
        with open(dest, "wb") as w:
            w.write(data)
        print(f"{name:34} {len(data):7d} B")
print(f"{len(files)} files, {total/1024:.0f} KB total", "(check only, nothing written)" if CHECK else "")
