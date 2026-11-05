#!/usr/bin/env python3
"""Overlay the 31 Oct 2026 redesign (redesign/site) onto the normal build (_site) and write _deploy/.

The redesign pages take over the live clean URLs (/consultatie-gratuita, /rezultate, ... in EN, /ro/, /ru/),
so links, ads and Google keep working. Everything the redesign does not cover stays exactly as built:
/menu/ (shake ordering to Telegram), /menugen21/, /start/ (Meta ads), /zerohour/, partner pages,
legal pages, /ambasador, /gabi, /multumim, the CRM functions and every redirect.

Run:  python3 scripts/merge-redesign.py      (after the normal build has refreshed _site)
Then: netlify deploy --dir=_deploy --functions=netlify/functions  (draft first, --prod on his OK)
"""
import json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "_site")
NEW = os.path.join(ROOT, "redesign", "site")
OUT = os.path.join(ROOT, "_deploy")
ORIGIN = "https://boostclub.ro"
LANGS = ["en", "ro", "ru"]

# redesign file -> live file (relative to the language root); "dir/" means dir/index.html
PAGES = {
    "index.html": "index.html",
    "free-scan.html": "consultatie-gratuita.html",
    "how-it-works.html": "cum-functioneaza.html",
    "results.html": "rezultate.html",
    "reviews.html": "recenzii.html",
    "visit.html": "contact.html",
    "gabriel.html": "gabriel.html",
    "business.html": "business.html",
    "bring-a-friend.html": "bring-a-friend.html",
    "menu.html": "shake-menu.html",
    "boost-fit.html": "boostfit/",
    "book.html": "book.html",
}
# link targets inside the redesign: file name -> clean URL relative to the language root
LINKS = {
    "free-scan.html": "consultatie-gratuita", "how-it-works.html": "cum-functioneaza",
    "results.html": "rezultate", "reviews.html": "recenzii", "visit.html": "contact",
    "gabriel.html": "gabriel", "business.html": "business", "bring-a-friend.html": "bring-a-friend",
    "menu.html": "shake-menu", "boost-fit.html": "boostfit/", "book.html": "book",
}
NEW_ROUTES = ["bring-a-friend", "shake-menu", "book"]  # clean URLs that did not exist on the live site
ASSETS = ["anim", "bf", "brand", "bt", "cups", "img", "kit", "lab", "results", "reviews", "video",
          "site.css", "site.js"]
I18N_FILES = ["ro-ui.js", "ru-ui.js", "lang.css"]
OG = {"en": "og-image-v2.jpg", "ro": "og-image-ro-v2.jpg", "ru": "og-image-ru-v2.jpg"}

SEO_RE = re.compile(r'\s*(<title>.*?</title>|<meta name="(?:description|theme-color)"[^>]*>|<meta property="og:[^>]*>'
                    r'|<meta name="twitter:[^>]*>|<link rel="(?:canonical|alternate|icon|apple-touch-icon)"[^>]*>'
                    r'|<script type="application/ld\+json">.*?</script>)', re.S)


def rd(p):
    return open(p, encoding="utf-8").read()


def wr(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8").write(s)


def lroot(lang):
    return "" if lang == "en" else lang + "/"


def relink(s):
    """Point redesign file names at the live clean URLs (relative, so they resolve inside the language)."""
    s = re.sub(r'(?<=["\'/])\.\./index\.html(?=[?#"\'])', "../", s)
    s = re.sub(r'(?<=["\'])index\.html(?=[?#"\'])', "./", s)
    for f, u in LINKS.items():
        s = re.sub(r'(?<=["\'/])' + re.escape(f) + r'(?=[?#"\'])', u, s)
    return s


def as_document(src, lang):
    """The EN index.html is a fragment (the artifact preview host wraps it). Same wrapper as redesign i18n/engine.py."""
    if re.match(r"\s*<!doctype", src, re.I):
        return src
    pos = 0
    head_re = re.compile(r"\s*(<title>.*?</title>|<meta\b[^>]*>|<link\b[^>]*>|<style\b[^>]*>.*?</style>|<!--.*?-->)", re.S | re.I)
    while True:
        m = head_re.match(src, pos)
        if not m:
            break
        pos = m.end()
    head, body = src[:pos], src[pos:]
    return ('<!doctype html>\n<html lang="%s"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            % lang + head.strip() + "\n</head>\n<body>\n" + body.strip() + "\n</body></html>\n")


def url_of(lang, dst):
    p = "/" + lroot(lang) + ("" if dst == "index.html" else dst.replace(".html", ""))
    return ORIGIN + p


def seo_block(lang, dst, page_html):
    """Live counterpart's SEO head (title, description, previews, canonical, hreflang, JSON-LD) when there is one."""
    live = os.path.join(SITE, lroot(lang), dst if not dst.endswith("/") else dst + "index.html")
    keep_title = dst == "business.html"  # the Boost Team page keeps its own title + description
    tags = []
    if os.path.exists(live) and dst not in ("boostfit/", "404.html"):
        head = rd(live).split("</head>")[0]
        tags = [m.group(1) for m in SEO_RE.finditer(head)]
        if keep_title:
            tags = [t for t in tags if not t.startswith("<title") and 'name="description"' not in t]
    if not tags or keep_title or dst == "boostfit/":
        if not any(t.startswith('<link rel="canonical"') for t in tags):
            tags += ['<link rel="canonical" href="%s">' % url_of(lang, dst)]
            tags += ['<link rel="alternate" hreflang="%s" href="%s">' % (l, url_of(l, dst)) for l in LANGS]
            tags += ['<link rel="alternate" hreflang="x-default" href="%s">' % url_of("en", dst)]
        if not any("og:image" in t for t in tags):
            tags += ['<meta property="og:image" content="%s/images/%s">' % (ORIGIN, OG[lang]),
                     '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">',
                     '<meta name="twitter:card" content="summary_large_image">']
        if not any("icon" in t for t in tags):
            tags += ['<link rel="icon" href="/favicon.ico" sizes="any">', '<link rel="apple-touch-icon" href="/apple-touch-icon.png">']
    return tags


def head_fix(s, lang, dst, depth_base):
    tags = seo_block(lang, dst, s)
    if any(t.startswith("<title") for t in tags):
        s = re.sub(r"<title>.*?</title>", "", s, count=1, flags=re.S)
    if any('name="description"' in t for t in tags):
        s = re.sub(r'<meta name="description"[^>]*>', "", s, count=1)
        s = re.sub(r'<meta property="og:(?:title|description)"[^>]*>', "", s)
    if any('name="theme-color"' in t for t in tags):
        s = re.sub(r'<meta name="theme-color"[^>]*>', "", s)
    s = re.sub(r'<meta name="claude:[^"]*"[^>]*>', "", s)
    pre = ('<base href="%s">' % depth_base) if depth_base else ""
    pre += '<script src="/js/lang-route.js?v=1"></script>'
    s = re.sub(r"(<head[^>]*>)", lambda m: m.group(1) + pre, s, count=1)
    s = s.replace("</head>", "\n".join(tags) + "\n</head>", 1)
    return s


def fix_anchor_links(s, here):
    """With <base>, href="#x" would leave the page: anchor it to the page's own path."""
    return re.sub(r'href="#([^"]*)"', lambda m: 'href="%s#%s"' % (here, m.group(1)), s)


def main():
    for need in (SITE, NEW):
        if not os.path.isdir(need):
            sys.exit("missing " + need)
    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    shutil.copytree(SITE, OUT)

    for a in ASSETS:
        src, dst = os.path.join(NEW, a), os.path.join(OUT, a)
        if os.path.exists(dst):
            sys.exit("asset name clash with the live site: " + a)
        (shutil.copytree if os.path.isdir(src) else shutil.copy2)(src, dst)
    os.makedirs(os.path.join(OUT, "i18n"), exist_ok=True)
    for f in I18N_FILES:
        shutil.copy2(os.path.join(NEW, "i18n", f), os.path.join(OUT, "i18n", f))

    # shared scripts: clean URLs, and a page in a folder (/boostfit/) knows its own name for the language switch
    for js in ("site.js", "kit/kit.js", "bt/boost-team-page.js"):
        p = os.path.join(OUT, js); s = relink(rd(p))
        if js == "site.js":
            old = "var file=(location.pathname.split('/').pop()||'./');"
            assert old in s, "site.js file line changed"
            s = s.replace(old, "var segs=location.pathname.split('/'), file=segs.pop()||(segs.length>1&&!/^(ro|ru|)$/.test(segs[segs.length-1])?segs[segs.length-1]+'/':'./');")
        if js == "kit/kit.js":
            old = "h.indexOf('.html')<0) return;"
            assert old in s, "kit.js link test changed"
            s = s.replace(old, "a.origin!==location.origin||/\\.(pdf|ics|jpe?g|png|webp|svg|mp4|zip)$/i.test(a.pathname)) return;")
        wr(p, s)
    for f in I18N_FILES[:2]:
        p = os.path.join(OUT, "i18n", f); wr(p, relink(rd(p)))

    written = []
    for lang in LANGS:
        for src, dst in PAGES.items():
            sp = os.path.join(NEW, lroot(lang), src)
            if not os.path.exists(sp):
                sys.exit("missing redesign page " + sp)
            s = as_document(relink(rd(sp)), lang)
            base = None
            if dst.endswith("/"):
                base = "/" + lroot(lang)
                s = fix_anchor_links(s, "/" + lroot(lang) + dst)
            s = head_fix(s, lang, dst, base)
            out = os.path.join(OUT, lroot(lang), dst + ("index.html" if dst.endswith("/") else ""))
            wr(out, s); written.append(out)
    # one 404 per language, at the root of the language (paths resolve from there)
    for lang in LANGS:
        s = relink(rd(os.path.join(NEW, lroot(lang), "404.html")))
        s = head_fix(s, lang, "404.html", "/" + lroot(lang))
        s = fix_anchor_links(s, "/" + lroot(lang))
        s = re.sub(r'<link rel="(?:canonical|alternate)"[^>]*>\n?', "", s)
        s = s.replace("</head>", '<meta name="robots" content="noindex">\n</head>', 1)
        wr(os.path.join(OUT, lroot(lang), "404.html"), s)

    # redirects: new clean URLs, old redesign file names, per-language 404s
    rules = ["", "# Redesign 31 Oct 2026 (scripts/merge-redesign.py)"]
    for lang in LANGS:
        pre = "/" + lroot(lang)
        for r in NEW_ROUTES:
            rules.append("%s%s.html  %s%s  301!" % (pre, r, pre, r))
            rules.append("%s%s  %s%s.html  200" % (pre, r, pre, r))
        for f, u in LINKS.items():
            if f.replace(".html", "") != u.rstrip("/"):
                rules.append("%s%s  %s%s  301!" % (pre, f, pre, u))
    red = rd(os.path.join(OUT, "_redirects"))
    marker = "# Canonical clean URLs -> static source files"
    assert marker in red
    red = red.replace(marker, "\n".join(rules) + "\n\n" + marker, 1)
    red += "\n/ro/*  /ro/404.html  404\n/ru/*  /ru/404.html  404\n"
    wr(os.path.join(OUT, "_redirects"), red)

    # sitemap: add the two new pages in each language
    sm = os.path.join(OUT, "sitemap.xml")
    if os.path.exists(sm):
        x = rd(sm)
        add = "".join("  <url><loc>%s</loc></url>\n" % url_of(l, r + ".html") for r in NEW_ROUTES for l in LANGS
                      if url_of(l, r + ".html") not in x)
        x = x.replace("</urlset>", add + "</urlset>", 1)
        wr(sm, x)

    leftovers = [p for p in written if re.search(r'(?:href|src)="(?!https?:|/|#|\.\./|mailto:|tel:|data:)[^"]*\.html', rd(p))]
    print("pages written:", len(written), "| _deploy ready", "| pages still linking a .html file:", len(leftovers))
    for p in leftovers[:10]:
        print("  ", os.path.relpath(p, OUT))


if __name__ == "__main__":
    main()
