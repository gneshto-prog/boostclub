# Rebuilds every image the shake menu uses from the original PNGs in this folder.
# Run: python3 build-menu-images.py  -> writes menu/images/shakes/web/
# Layers are cut by diffing a signature photo against its plain flavour photo;
# all photos share the same cup position (±3 px), so layers stack on any flavour.
from PIL import Image, ImageFilter
import numpy as np, glob, os
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, "..", "..", "menu", "images", "shakes", "web")
os.makedirs(out, exist_ok=True)
L = lambda f: Image.open(os.path.join(here, f + ".png")).convert("RGBA")
def save(im, name):
    im = im.resize((480, 720), Image.LANCZOS)
    a = np.asarray(im).copy(); a[a[..., 3] == 0, :3] = 0  # hidden pixels cost bytes: blank them
    Image.fromarray(a).save(os.path.join(out, name + ".webp"), "WEBP", quality=82, alpha_quality=60, method=6)

def inside(*ims):
    a = np.minimum.reduce([np.asarray(i)[..., 3] for i in ims]).astype(np.uint8)
    return np.asarray(Image.fromarray(a).filter(ImageFilter.MinFilter(15))).astype(int)

def syrup(sigf, basef, thr=60, open_=0):
    s, b = L(sigf), L(basef)
    S, B = np.asarray(s).astype(int), np.asarray(b).astype(int)
    m = np.clip((np.abs(S[..., :3] - B[..., :3]).sum(-1) - thr) * 3, 0, 255)
    m = np.minimum(m, inside(s, b)); m[:200] = 0
    im = Image.fromarray(m.astype(np.uint8))
    if open_: im = im.filter(ImageFilter.MinFilter(open_)).filter(ImageFilter.MaxFilter(open_))
    s.putalpha(im.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(1.2)))
    return s

def recolor(layer, rgb):
    a = np.asarray(layer).astype(float)
    lum = a[..., :3].mean(-1); ref = np.percentile(lum[a[..., 3] > 200], 60)
    c = np.clip(np.array(rgb, float)[None, None, :] * (lum / ref)[..., None], 0, 255)
    return Image.fromarray(np.dstack([c, a[..., 3]]).astype(np.uint8))

def topping(sigf, y0, y1):
    s = L(sigf); A = np.asarray(s)[..., 3].astype(int)
    ys = np.arange(A.shape[0])[:, None]
    band = np.clip((y1 - ys) / 14, 0, 1) * np.clip((ys - y0) / 4, 0, 1) * 255
    s.putalpha(Image.fromarray(np.minimum(band.repeat(A.shape[1], 1), A).astype(np.uint8)))
    return s

# flavour + signature photos
for f in glob.glob(os.path.join(here, "*.png")):
    save(Image.open(f).convert("RGBA"), os.path.basename(f)[:-4])

# syrup layers (hazelnut has no source photo yet: strawberry drizzle shape, hazelnut colour)
straw = syrup("sig-strawberry-cheesecake", "cookie")
save(syrup("sig-caramel-macchiato", "latte"), "layer-scar")
save(syrup("sig-after-eight", "mint", thr=90, open_=7), "layer-schoc")
save(straw, "layer-sstraw")
save(recolor(straw, (128, 80, 38)), "layer-shaz")

# topping layers: the crust strip under the lid
save(topping("sig-bounty", 70, 165), "layer-tcoco")
save(topping("sig-ferrero", 70, 150), "layer-thaz")
save(topping("sig-snickers", 70, 152), "layer-talm")
save(topping("sig-dubai", 70, 162), "layer-tpist")

def alpha_png(m, name):  # CSS masks read alpha, not brightness
    im = Image.new("RGBA", m.size, (255, 255, 255, 0)); im.putalpha(m); im.resize((240, 360), Image.LANCZOS).save(os.path.join(out, name + ".png"), optimize=True)

# masks (opaque = show): swirl for the 2nd flavour of a mix, patches for the 2nd topping
W, H = 480, 720
x = np.arange(W)[None, :]; y = np.arange(H)[:, None]
edge = 330 + 34 * np.sin(x / 46) + 18 * np.sin(x / 17 + 1.3)
swirl = (y > edge).astype(float)
swirl = np.maximum(swirl, ((np.abs(y - (215 + 26 * np.sin(x / 38 + 2))) < 11) & (x > 90) & (x < 400)).astype(float))
swirl = np.minimum(swirl, 1 - ((np.abs(y - (505 + 22 * np.sin(x / 33))) < 10) & (x > 70) & (x < 410)).astype(float))
alpha_png(Image.fromarray((swirl * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5)), "mask-mix")
rng = np.random.default_rng(7); p = np.zeros((H, W))
for _ in range(70):
    cx, cy, r = rng.integers(0, W), rng.integers(0, 120), rng.integers(10, 22)
    p[(x - cx) ** 2 + ((y - cy) * 1.8) ** 2 < r * r] = 1
alpha_png(Image.fromarray((p * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2)), "mask-top2")
print("built", len(glob.glob(os.path.join(out, "*"))), "files")
