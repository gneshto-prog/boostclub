#!/usr/bin/env python3
"""Boost Team lockup SVGs, built from the Boost Team brand board.

Source: scripts/assets/boost-team-brand-board-original.pdf (page 1, PRIMARY
LOGO), the board as it was before the tagline changed. The Desktop copy now
says BUILD YOUR BEST, so it can no longer feed this script.
The wordmark glyphs (B, st Team, gold dot) and the tagline letters are the
board's own Montserrat outlines, lifted straight out of the PDF. The leaves
are the site's leaf path (same leaf as Boost Club), placed where the board
puts its leaf images, in Boost Team blue.

Tagline is "BUILD YOUR BEST" (Gabi, 17 Oct 2026), not the board's
"BE YOUR BEST" (that one belongs to Boost Club). B, U, Y, O, R, E, S, T come
from the board's tagline; I, L and D are not on the board, so they are built
from its strokes: stem and bar widths of the E, bowl of the O. The Desktop
board was updated to BUILD YOUR BEST on 18 Oct 2026 with these same letters.

Usage: python3 scripts/make-boost-team-logo.py   (needs PyMuPDF)
Writes images/boost-team/boost-team-lockup.svg and -on-dark.svg.
"""
import os
import sys

import fitz

BOARD = os.path.join(os.path.dirname(__file__), "assets", "boost-team-brand-board-original.pdf")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "images", "boost-team")

NAVY = "#061A2F"
WHITE = "#FFFFFF"
BLUE = "#1098D4"
BLUE_ON_DARK = "#4FB0E2"
GOLD = "#C8A24A"
CREAM = "#F5F3EE"

# The board's tagline is ~16% of the wordmark's cap height, which is
# unreadable at header size. Scale it up for the web lockup.
TAG_SCALE = 1.5
TAG_GAP = 22.0  # board: 20pt from wordmark baseline to tagline cap top

LEAF_D = "M18.62 0h2.56C23.06 0 24 5.98 24 9.22v2.48c0 7.94-6.92 14-18.62 14H2.82C.85 25.7 0 19.64 0 17.08v-3.59C0 5.98 6.83 0 18.62 0Z"
# Leaf images on the board (670x717 px, leaf drawn inside px 8..662 x 8..709).
LEAF_IMAGES = [(101.25, 89.25, 133.5, 124.5), (148.5, 89.25, 180.75, 124.5)]
# Slash, measured on the board's leaf image in px: centre, unit axis, half length, width.
SLASH = dict(cx=258.5, cy=447.5, ux=0.64339, uy=-0.76554, half=225.76, width=31.5)

K = 10.0  # output units per PDF point


def fmt(v):
    s = f"{v:.1f}"
    return "0" if s in ("0.0", "-0.0") else s.rstrip("0").rstrip(".")


def drawings_in(page, rect):
    r = fitz.Rect(rect)
    return [d for d in page.get_drawings() if d["rect"] in r]


def items_to_d(items, tf):
    out, cur = [], None
    for it in items:
        op = it[0]
        if op == "l":
            a, b = it[1], it[2]
            if cur is None or abs(cur[0] - a.x) > 1e-3 or abs(cur[1] - a.y) > 1e-3:
                out.append("M" + " ".join(fmt(v) for v in tf(a.x, a.y)))
            out.append("L" + " ".join(fmt(v) for v in tf(b.x, b.y)))
            cur = (b.x, b.y)
        elif op == "c":
            a, b, c, e = it[1:5]
            if cur is None or abs(cur[0] - a.x) > 1e-3 or abs(cur[1] - a.y) > 1e-3:
                out.append("M" + " ".join(fmt(v) for v in tf(a.x, a.y)))
            pts = tf(b.x, b.y) + tf(c.x, c.y) + tf(e.x, e.y)
            out.append("C" + " ".join(fmt(v) for v in pts))
            cur = (e.x, e.y)
        elif op == "re":
            q = it[1]
            pts = [tf(q.x0, q.y0), tf(q.x1, q.y0), tf(q.x1, q.y1), tf(q.x0, q.y1)]
            out.append("M" + " L".join(" ".join(fmt(v) for v in p) for p in pts) + "Z")
            cur = None
        else:
            raise SystemExit(f"unexpected path op {op!r}")
    return "".join(out)


class Glyph:
    """A tagline letter in board points, left edge at x=0."""

    def __init__(self, items=None, x0=0.0, width=0.0, polys=None, evenodd=False):
        self.items, self.x0, self.width, self.polys, self.evenodd = items, x0, width, polys, evenodd

    def d(self, tf):
        if self.items is not None:
            return items_to_d(self.items, lambda x, y: tf(x - self.x0, y))
        parts = []
        for poly in self.polys:
            seg = []
            for i, cmd in enumerate(poly):
                if cmd[0] == "C":
                    pts = tf(*cmd[1]) + tf(*cmd[2]) + tf(*cmd[3])
                    seg.append("C" + " ".join(fmt(v) for v in pts))
                else:
                    seg.append(("M" if i == 0 else "L") + " ".join(fmt(v) for v in tf(*cmd)))
            parts.append("".join(seg) + "Z")
        return "".join(parts)


def board_glyph(drawing):
    r = drawing["rect"]
    return Glyph(items=drawing["items"], x0=r.x0, width=r.width)


def build_tagline(page):
    tag = drawings_in(page, (195, 140, 335, 160))
    if len(tag) != 10:
        raise SystemExit(f"expected 10 tagline glyphs (BE YOUR BEST), found {len(tag)}")
    B, E, Y, O, U, R, B2, E2, S, T = tag
    top, base = 146.756, 154.5
    cap = base - top

    # Stroke weights read off the board's E.
    e_items = E["items"]
    xs = sorted({round(p.x, 3) for it in e_items for p in it[1:3]})
    stem = xs[1] - xs[0]  # 1.43
    bar = 1.208

    I = Glyph(polys=[[(0, top), (stem, top), (stem, base), (0, base)]], width=stem)
    l_w = 5.30
    L = Glyph(polys=[[(0, top), (stem, top), (stem, base - bar), (l_w, base - bar), (l_w, base), (0, base)]], width=l_w)

    # D = stem + right half of the board's O, squashed to cap height (no overshoot).
    o_r = O["rect"]
    cx = (o_r.x0 + o_r.x1) / 2
    sy = cap / o_r.height

    def oy(y):
        return top + (y - o_r.y0) * sy

    contours, cur = [], []
    for it in O["items"]:
        if cur and (abs(cur[-1][4].x - it[1].x) > 1e-3 or abs(cur[-1][4].y - it[1].y) > 1e-3):
            contours.append(cur)
            cur = []
        cur.append(it)
    contours.append(cur)
    outer = max(contours, key=lambda c: max(p.x for it in c for p in it[1:]) - min(p.x for it in c for p in it[1:]))
    inner = [c for c in contours if c is not outer][0]

    def right_half(contour):
        segs = [it for it in contour if min(it[1].x, it[4].x) >= cx - 0.02]
        segs = [(it[1], it[2], it[3], it[4]) if it[1].y < it[4].y else (it[4], it[3], it[2], it[1]) for it in segs]
        return sorted(segs, key=lambda s: s[0].y)

    d_w = 7.45
    half = o_r.x1 - cx
    xc = d_w - half

    def bowl(segs, x_from):
        first = segs[0][0]
        last = segs[-1][3]
        poly = [(x_from, oy(first.y)), (xc, oy(first.y))]
        for p0, c1, c2, p3 in segs:
            poly.append(("C", (c1.x - cx + xc, oy(c1.y)), (c2.x - cx + xc, oy(c2.y)), (p3.x - cx + xc, oy(p3.y))))
        poly.append((x_from, oy(last.y)))
        return poly

    D = Glyph(polys=[bowl(right_half(outer), 0), bowl(right_half(inner), stem)], width=d_w, evenodd=True)

    # BUILD: board gaps between letter edges (straight-to-straight 5.78, round-to-straight 5.3, open-to-straight 4.6).
    seq, x = [], 0.0
    for glyph, gap in ((board_glyph(B), 5.3), (board_glyph(U), 5.78), (I, 5.78), (L, 4.6), (D, 11.0)):
        seq.append((glyph, x))
        x += glyph.width + gap
    # YOUR BEST keeps the board's own spacing.
    y_x0 = Y["rect"].x0
    for g in (Y, O, U, R, B2, E2, S, T):
        seq.append((board_glyph(g), x + g["rect"].x0 - y_x0))
    width = x + T["rect"].x1 - y_x0
    return seq, width, top, base


def leaf_geometry(rect):
    x0, y0, x1, y1 = rect
    px = (x1 - x0) / 670
    py = (y1 - y0) / 717
    lx0, ly0 = x0 + 8 * px, y0 + 8 * py
    sx, sy = (654 * px) / 24, (701 * py) / 25.7
    s = SLASH
    a = (x0 + (s["cx"] - s["ux"] * s["half"]) * px, y0 + (s["cy"] - s["uy"] * s["half"]) * py)
    b = (x0 + (s["cx"] + s["ux"] * s["half"]) * px, y0 + (s["cy"] + s["uy"] * s["half"]) * py)
    return lx0, ly0, sx, sy, a, b, s["width"] * (px + py) / 2


def build(page, dark):
    word = drawings_in(page, (30, 55, 510, 132))
    if len(word) != 8:
        raise SystemExit(f"expected 8 wordmark shapes (B s t T e a m dot), found {len(word)}")
    X0 = min(d["rect"].x0 for d in word)
    X1 = max(d["rect"].x1 for d in word)
    Y0 = min(d["rect"].y0 for d in word)
    is_gold = lambda d: d["fill"][0] > 0.5 and d["fill"][2] < 0.5
    baseline = next(d["rect"].y1 for d in word if is_gold(d))  # the gold dot sits on the baseline

    def tf(x, y):
        return ((x - X0) * K, (y - Y0) * K)

    ink = WHITE if dark else NAVY
    parts = []
    for d in word:
        fill = GOLD if is_gold(d) else ink
        parts.append(f'<path fill="{fill}" d="{items_to_d(d["items"], tf)}"/>')

    for rect in LEAF_IMAGES:
        lx0, ly0, sx, sy, a, b, w = leaf_geometry(rect)
        tx, ty = tf(lx0, ly0)
        parts.append(
            f'<path fill="{BLUE}" transform="translate({fmt(tx)} {fmt(ty)}) scale({sx * K:.4f} {sy * K:.4f})" d="{LEAF_D}"/>'
        )
        (ax, ay), (bx, by) = tf(*a), tf(*b)
        parts.append(
            f'<path stroke="{CREAM}" stroke-width="{fmt(w * K)}" d="M{fmt(ax)} {fmt(ay)}L{fmt(bx)} {fmt(by)}"/>'
        )

    seq, t_w, t_top, t_base = build_tagline(page)
    t_left = (X0 + X1) / 2 - t_w * TAG_SCALE / 2
    t_cap_top = baseline + TAG_GAP

    def ttf(x_off):
        def f(x, y):
            return tf(t_left + (x_off + x) * TAG_SCALE, t_cap_top + (y - t_top) * TAG_SCALE)
        return f

    tag_fill = BLUE_ON_DARK if dark else BLUE
    tag_paths = []
    for glyph, x_off in seq:
        rule = ' fill-rule="evenodd"' if glyph.evenodd else ""
        tag_paths.append(f'<path{rule} d="{glyph.d(ttf(x_off))}"/>')
    parts.append(f'<g fill="{tag_fill}">{"".join(tag_paths)}</g>')

    vb_w = (X1 - X0) * K
    vb_h = (t_cap_top + (154.61 - t_top) * TAG_SCALE - Y0) * K
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(vb_w)} {fmt(vb_h)}" role="img" aria-label="Boost Team. Build your best">'
        + "".join(parts)
        + "</svg>\n"
    ), vb_w, vb_h


def main():
    if not os.path.exists(BOARD):
        sys.exit(f"brand board not found: {BOARD}")
    page = fitz.open(BOARD)[0]
    os.makedirs(OUT_DIR, exist_ok=True)
    for dark, name in ((False, "boost-team-lockup.svg"), (True, "boost-team-lockup-on-dark.svg")):
        svg, w, h = build(page, dark)
        path = os.path.join(OUT_DIR, name)
        with open(path, "w") as fh:
            fh.write(svg)
        print(f"{os.path.relpath(path)}  viewBox {fmt(w)} x {fmt(h)}  {len(svg)} bytes")


if __name__ == "__main__":
    main()
