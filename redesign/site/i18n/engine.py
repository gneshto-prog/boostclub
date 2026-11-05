"""RO/RU page generator for the concept-6 site.

Reads every generated English page, writes ro/<file> and ru/<file> with text, attributes,
inline-script strings, JSON data and WhatsApp prefills translated from i18n/<lang>.json,
asset URLs prefixed with ../, and the ro-ui.js / ru-ui.js dictionary injected before site.js.
Never edits an English file. Unknown English is listed, never fatal.
"""
import os, re, json, html as _html, urllib.parse as _up

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
LANGS = ("ro", "ru")
PAGES = ["index.html", "business.html", "free-scan.html", "how-it-works.html", "menu.html", "results.html", "reviews.html",
         "gabriel.html", "boost-fit.html", "visit.html", "bring-a-friend.html", "book.html", "404.html"]
ASSET_DIRS = ("img", "cups", "brand", "lab", "anim", "kit", "results", "reviews", "fonts", "video", "media", "bf", "bt")
ASSET_FILES = ("site.css", "site.js")
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr", "param"}
INLINE = {"span", "b", "i", "em", "strong", "a", "br", "small", "sup", "sub", "u", "mark", "abbr", "time", "s", "q", "code"}
ATTRS = ("alt", "aria-label", "placeholder", "title", "aria-valuetext")
WS = re.compile(r"\s+")
LETTER = re.compile(r"[A-Za-z]")
WORD = re.compile(r"[A-Za-z][A-Za-z'’\-]*")


def norm(s):
    return WS.sub(" ", s).strip()


def load_dict(lang):
    p = os.path.join(HERE, lang + ".json")
    d = json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}
    out = {}
    for k, v in d.items():
        if k.startswith("//"):
            continue
        out[norm(k)] = v
    return out


class Keep(set):
    """Set of exact strings + review texts: any passage quoted from a review stays as written."""
    texts = []

    def __contains__(self, s):
        if set.__contains__(self, s):
            return True
        if len(s) > 20:
            return any(s in t for t in self.texts)
        return False


def load_keep():
    """Strings that stay in English on every language: names, brands, review authors."""
    p = os.path.join(HERE, "keep.json")
    keep = Keep(norm(x) for x in (json.load(open(p, encoding="utf-8")) if os.path.exists(p) else []))
    rj = os.path.join(SITE, "reviews", "reviews.json")
    if os.path.exists(rj):
        try:
            for r in json.load(open(rj, encoding="utf-8")):
                keep.add(norm(r.get("name", "")))
                keep.texts.append(norm(_html.unescape(r.get("text", "").replace("<br>", " "))))
        except Exception:
            pass
    return keep


# ---------------------------------------------------------------- tokenizer / tree
TOK = re.compile(r"<!--.*?-->|<(script|style)\b(?:\"[^\"]*\"|'[^']*'|[^'\">])*>.*?</\1\s*>|<(?:\"[^\"]*\"|'[^']*'|[^'\">])*>", re.S | re.I)
TAGNAME = re.compile(r"<\s*(/?)\s*([A-Za-z][A-Za-z0-9\-]*)")


class Node:
    __slots__ = ("kind", "raw", "name", "children", "end", "attrs_raw")

    def __init__(self, kind, raw="", name=None):
        self.kind, self.raw, self.name, self.children, self.end = kind, raw, name, [], ""


def parse(src):
    root = Node("el", "", "#root")
    stack = [root]
    pos = 0
    for m in TOK.finditer(src):
        if m.start() > pos:
            stack[-1].children.append(Node("text", src[pos:m.start()]))
        tok = m.group(0)
        pos = m.end()
        if tok.startswith("<!--") or tok.startswith("<!") or tok.startswith("<?"):
            stack[-1].children.append(Node("raw", tok))
            continue
        if m.group(1):  # script / style block
            stack[-1].children.append(Node("block", tok, m.group(1).lower()))
            continue
        tm = TAGNAME.match(tok)
        if not tm:
            stack[-1].children.append(Node("text", tok))
            continue
        closing, name = tm.group(1) == "/", tm.group(2).lower()
        if closing:
            if any(n.name == name for n in stack[1:]):
                while stack[-1].name != name:
                    stack.pop()
                stack[-1].end = tok
                stack.pop()
            continue
        el = Node("el", tok, name)
        stack[-1].children.append(el)
        if name not in VOID and not tok.endswith("/>"):
            stack.append(el)
    if pos < len(src):
        stack[-1].children.append(Node("text", src[pos:]))
    return root


def ser(n):
    if n.kind != "el":
        return n.raw
    return n.raw + "".join(ser(c) for c in n.children) + n.end


def inner(n):
    return "".join(ser(c) for c in n.children)


ATTR_RE = re.compile(r"([^\s=/>]+)(\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+))?")


def get_attr(tok, name):
    m = re.search(r"\s" + re.escape(name) + r"\s*=\s*(\"([^\"]*)\"|'([^']*)')", tok)
    if not m:
        return None
    return m.group(2) if m.group(2) is not None else m.group(3)


def has_letters_text(n):
    """True if this element (or its subtree) holds visible words."""
    if n.kind == "text":
        return bool(LETTER.search(n.raw))
    if n.kind != "el":
        return False
    return any(has_letters_text(c) for c in n.children)


def plain(s):
    return norm(_html.unescape(re.sub(r"<[^>]+>", " ", s)))


# ---------------------------------------------------------------- translator
class Translator:
    def __init__(self, lang, d, keep):
        self.lang, self.d, self.keep = lang, d, keep
        self.misses = {}   # text -> set(files)
        self.used = set()
        self.file = ""

    def miss(self, s):
        if not s or s in self.keep or len(LETTER.findall(s)) < 2:
            return
        self.misses.setdefault(s, set()).add(self.file)

    def look(self, s):
        """Exact lookup on a whitespace-normalised, entity-decoded string."""
        k = norm(s)
        if k in self.d:
            self.used.add(k)
            return self.d[k]
        ku = norm(_html.unescape(k))
        if ku in self.d:
            self.used.add(ku)
            return self.d[ku]
        return None

    def text(self, raw):
        if not LETTER.search(raw):
            return raw
        s = _html.unescape(raw)
        k = norm(s)
        if k in self.keep:
            return raw
        t = self.look(k)
        if t is None:
            self.miss(k)
            return raw
        lead = raw[: len(raw) - len(raw.lstrip())]
        trail = raw[len(raw.rstrip()):]
        return lead + _html.escape(t, quote=False) + trail

    def attrs(self, tok):
        def rep(m):
            name, q, val = m.group(1), m.group(2), m.group(3)
            if not LETTER.search(val):
                return m.group(0)
            v = _html.unescape(val)
            if norm(v) in self.keep:
                return m.group(0)
            t = self.look(v)
            if t is None:
                self.miss(norm(v))
                return m.group(0)
            return f'{name}={q}{_html.escape(t, quote=True)}{q}'
        return re.sub(r'(?<=\s)(' + "|".join(re.escape(a) for a in ATTRS) + r')=(["\'])(.*?)\2', rep, tok)

    def attr_value(self, tok, name, title=False):
        def rep(m):
            v = _html.unescape(m.group(2))
            if not LETTER.search(v) or norm(v) in self.keep:
                return m.group(0)
            t = self.look(v)
            if t is None and title:
                parts = []
                for p in v.split(" · "):
                    x = p if (p.strip() in self.keep or not LETTER.search(p)) else self.look(p)
                    if x is None:
                        self.miss(norm(p))
                        x = p
                    parts.append(x)
                t = " · ".join(parts)
            if t is None:
                self.miss(norm(v))
                return m.group(0)
            return m.group(1) + _html.escape(t, quote=True) + '"'
        return re.sub(r'(\s' + name + r'=")([^"]*)"', rep, tok)

    def unit_key(self, n):
        """An element whose words are split by inline tags is translated as one unit."""
        kids = n.children
        k = norm(inner(n))
        if "<" in k and k in self.d:
            return k
        if not any(c.kind == "el" and c.name in INLINE and has_letters_text(c) for c in kids):
            return None
        if not any(c.kind == "text" and LETTER.search(c.raw) for c in kids):
            # e.g. <a><span>One</span><span>Two</span></a>: only a unit when the dict says so
            k = norm(inner(n))
            return k if k in self.d else None
        if any(c.kind == "el" and c.name not in INLINE for c in kids):
            return None
        return norm(inner(n))

    def walk(self, n, skip=False):
        out = []
        for c in n.children:
            if c.kind == "text":
                out.append(c.raw if skip else self.text(c.raw))
            elif c.kind == "block":
                out.append(self.block(c.raw) if c.name == "script" else c.raw)
            elif c.kind == "el":
                out.append(self.element(c, skip))
            else:
                out.append(c.raw)
        return "".join(out)

    def element(self, c, skip=False):
        tok = c.raw
        own_lang = get_attr(tok, "lang")
        sk = skip or c.name == "title" or (own_lang is not None and own_lang != self.lang and c.name != "html")
        if c.name in ("svg",):
            # inline icons: only translate aria-label / title
            return (tok if sk else self.attrs(tok)) + inner(c) + c.end
        tok2 = tok if sk else self.attrs(tok)
        if not sk and c.name == "meta" and re.search(r'(name|property)="(description|og:title|og:description|twitter:title|twitter:description)"', tok):
            tok2 = self.attr_value(tok2, "content", title=("title" in tok))
        if not sk and c.name == "input" and re.search(r'type="(radio|checkbox)"', tok):
            tok2 = self.attr_value(tok2, "value")
        if c.name in VOID or not c.end and not c.children:
            return tok2 + self.walk(c, sk) + c.end
        if not sk:
            k = self.unit_key(c)
            if k is not None:
                t = self.look(k)
                if t is not None:
                    return tok2 + t + c.end
                if k not in self.keep:
                    # report the unit as a whole, then still translate any pieces we know
                    self.miss(k)
                    sub = Translator(self.lang, self.d, self.keep)
                    sub.file = self.file
                    body = sub.walk(c, sk)
                    self.used |= sub.used
                    return tok2 + body + c.end
        return tok2 + self.walk(c, sk) + c.end

    # -------- inline <script> blocks: quoted user-facing strings + JSON data
    def block(self, raw):
        m = re.match(r"(<script\b[^>]*>)(.*)(</script\s*>)$", raw, re.S | re.I)
        if not m:
            return raw
        open_, body, close = m.groups()
        if re.search(r"\ssrc\s*=", open_):
            return raw
        if "application/json" in open_ or "application/ld+json" in open_:
            try:
                data = json.loads(body)
            except Exception:
                return raw
            data = self.jsonval(data)
            s = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
            return open_ + s + close
        return open_ + self.js(body) + close

    def jsonval(self, v):
        if isinstance(v, dict):
            return {k: self.jsonval(x) for k, x in v.items()}
        if isinstance(v, list):
            return [self.jsonval(x) for x in v]
        if isinstance(v, str):
            if re.match(r"^(%s)/" % "|".join(ASSET_DIRS), v):
                return "../" + v
            if LETTER.search(v) and " " in v.strip():
                if norm(v) in self.keep:
                    return v
                t = self.look(v)
                if t is None:
                    self.miss(norm(v))
                    return v
                return t
            if LETTER.search(v):
                t = self.look(v)
                return t if t is not None else v
        return v

    def js(self, body):
        def rep(m):
            q, s = m.group(1), m.group(2)
            if not LETTER.search(s) or "\\" in s and not s.replace("\\'", "'").replace('\\"', '"'):
                return m.group(0)
            raw = s.replace("\\'", "'").replace('\\"', '"')
            t = self.look(raw)
            if t is None:
                return m.group(0)
            t = raw[: len(raw) - len(raw.lstrip())] + t + raw[len(raw.rstrip()):]
            t = t.replace("\\", "\\\\").replace(q, "\\" + q)
            return q + t + q
        return re.sub(r"(['\"])((?:\\.|(?!\1)[^\\\n])*)\1", rep, body)


# ---------------------------------------------------------------- URL rewriting
ASSET_RE = "(?:%s)/|(?:%s)(?=[\"'?#)\\s])" % ("|".join(ASSET_DIRS), "|".join(re.escape(f) for f in ASSET_FILES))


def prefix_urls(src):
    # attributes
    src = re.sub(r'(\s(?:src|href|poster|data-src|srcset|data-srcset|content)\s*=\s*["\'])(?=' + ASSET_RE + ")", r"\1../", src)
    # srcset lists: ", img/x.jpg 2x"
    src = re.sub(r'(srcset\s*=\s*"[^"]*)', lambda m: re.sub(r"(,\s*)(?=" + ASSET_RE + ")", r"\1../", m.group(1)), src)
    # url(...) in style attrs, <style> blocks and inline scripts
    src = re.sub(r"(url\(\s*[\"']?)(?=" + ASSET_RE + ")", r"\1../", src)
    return src


def prefix_script_paths(src):
    """Quoted asset paths inside inline scripts: 'img/x.jpg' -> '../img/x.jpg'."""
    def fix(m):
        open_, body, close = m.group(1), m.group(2), m.group(3)
        if re.search(r"\ssrc\s*=", open_) or "json" in open_:
            return m.group(0)
        body = re.sub(r"(['\"])(?=(?:%s)/)" % "|".join(ASSET_DIRS), r"\1../", body)
        return open_ + body + close
    return re.sub(r"(<script\b[^>]*>)(.*?)(</script\s*>)", fix, src, flags=re.S | re.I)


def wa_fix(src, tr):
    """Translate the ?text= prefill of every wa.me link."""
    def rep(m):
        url = m.group(0)
        mm = re.search(r"([?&]text=)([^\"'&\s<>]*)", url)
        if not mm:
            return url
        en = _up.unquote(mm.group(2))
        t = tr.look(en)
        if t is None:
            tr.miss("WA prefill: " + en)
            return url
        return url[: mm.start(2)] + _up.quote(t, safe="") + url[mm.end(2):]
    return re.sub(r"https://wa\.me/[0-9]+\?[^\"'\s<>]*", rep, src)


# ---------------------------------------------------------------- page assembly
HEAD_TAGS = ("title", "meta", "link", "style", "base")


def as_document(src, lang):
    """index.html is a fragment (the artifact host wraps it). Give the RO/RU copy a full document."""
    if re.match(r"\s*<!doctype", src, re.I):
        return src
    # leading head-type nodes go into <head>
    pos = 0
    head_re = re.compile(r"\s*(<title>.*?</title>|<meta\b[^>]*>|<link\b[^>]*>|<style\b[^>]*>.*?</style>|<!--.*?-->)", re.S | re.I)
    while True:
        m = head_re.match(src, pos)
        if not m:
            break
        pos = m.end()
    head, body = src[:pos], src[pos:]
    head = re.sub(r'<meta name="claude:[^"]*"[^>]*>\s*', "", head)
    return ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            + head.strip() + "\n</head>\n<body>\n" + body.strip() + "\n</body></html>\n")


def page_css(lang):
    p = os.path.join(HERE, "lang.css")
    css = open(p, encoding="utf-8").read() if os.path.exists(p) else ""
    # blocks marked /*@ru*/ ... /*@end*/ only apply to that language
    def keep_block(m):
        return m.group(2) if m.group(1) == lang else ""
    css = re.sub(r"/\*@(\w+)\*/(.*?)/\*@end\*/", keep_block, css, flags=re.S)
    return '<style id="i18n-css">' + css.strip() + "</style>"


def translate_title(tr, src):
    def rep(m):
        t = _html.unescape(m.group(1))
        full = tr.look(t)
        if full is not None:
            return "<title>" + _html.escape(full, quote=False) + "</title>"
        parts = t.split(" · ")
        outp = []
        for p in parts:
            if p.strip() in tr.keep or not LETTER.search(p):
                outp.append(p)
                continue
            x = tr.look(p)
            if x is None:
                tr.miss(norm(p))
                x = p
            outp.append(x)
        return "<title>" + _html.escape(" · ".join(outp), quote=False) + "</title>"
    return re.sub(r"<title>(.*?)</title>", rep, src, count=1, flags=re.S)


def build_page(fn, tr):
    src = open(os.path.join(SITE, fn), encoding="utf-8").read()
    src = as_document(src, tr.lang)
    tr.file = fn
    src = translate_title(tr, src)
    # the body (and everything else) through the tree translator; <title> already done
    root = parse(src)
    out = tr.walk(root)
    out = re.sub(r'<html lang="[^"]*"', '<html lang="%s"' % tr.lang, out, count=1)
    out = wa_fix(out, tr)
    out = prefix_urls(out)
    out = prefix_script_paths(out)
    ui = '<script src="../i18n/%s-ui.js"></script>\n' % tr.lang
    out = re.sub(r'(<script src="\.\./site\.js"></script>)', ui + r"\1", out, count=1)
    out = out.replace("</head>", page_css(tr.lang) + "</head>", 1)
    os.makedirs(os.path.join(SITE, tr.lang), exist_ok=True)
    open(os.path.join(SITE, tr.lang, fn), "w", encoding="utf-8").write(out)


# ---------------------------------------------------------------- runtime dictionary for site.js etc.
RUNTIME_JS = ["site.js", "results/results.js", "reviews/reviews.js", "anim/anim.js", "kit/kit.js"]


def js_strings(path):
    try:
        s = open(path, encoding="utf-8").read()
    except Exception:
        return set()
    found = set()
    for m in re.finditer(r"(['\"])((?:\\.|(?!\1)[^\\\n])*)\1", s):
        v = m.group(2).replace("\\'", "'")
        if LETTER.search(v) and "<" not in v:
            found.add(norm(v))
    return found


def build_ui(lang, d, tr):
    keys = set()
    for f in RUNTIME_JS:
        keys |= js_strings(os.path.join(SITE, f))
    extra = json.load(open(os.path.join(HERE, "runtime-keys.json"), encoding="utf-8")) if os.path.exists(os.path.join(HERE, "runtime-keys.json")) else []
    ui = {}
    for k in sorted(keys | set(extra)):
        if k in d:
            ui[k] = d[k]
            tr.used.add(k)
    # shake descriptions and other T() strings live in site.js already; patterns for dynamic strings
    rt = open(os.path.join(HERE, "runtime.js"), encoding="utf-8").read() if os.path.exists(os.path.join(HERE, "runtime.js")) else ""
    js = ("/* generated by pages_zz_i18n.py from i18n/%s.json: do not edit by hand */\n" % lang
          + "window.BC_T=" + json.dumps(ui, ensure_ascii=False, indent=0) + ";\n"
          + rt.replace("__LANG__", lang))
    open(os.path.join(HERE, lang + "-ui.js"), "w", encoding="utf-8").write(js)
    return len(ui)


def run(pages=None, strict_ro=False, quiet=False):
    keep = load_keep()
    report = {}
    for lang in LANGS:
        d = load_dict(lang)
        tr = Translator(lang, d, keep)
        done = []
        for fn in (pages or PAGES):
            if os.path.exists(os.path.join(SITE, fn)):
                build_page(fn, tr)
                done.append(fn)
        n_ui = build_ui(lang, d, tr)
        multi = {k: v for k, v in tr.misses.items() if len(WORD.findall(plain(k))) >= 2}
        single = {k: v for k, v in tr.misses.items() if k not in multi}
        report[lang] = (multi, single)
        if not quiet:
            print("i18n %s: %d pages, %d dictionary entries (%d used), %d in %s-ui.js, %d untranslated (2+ words), %d single words"
                  % (lang, len(done), len(d), len(tr.used), n_ui, lang, len(multi), len(single)))
            for k, v in sorted(multi.items(), key=lambda x: (sorted(x[1]), x[0])):
                print("   [%s] UNTRANSLATED %s: %s" % (lang, ",".join(sorted(v)), k[:220]))
            for k, v in sorted(single.items()):
                print("   [%s] single word %s: %s" % (lang, ",".join(sorted(v)), k[:80]))
    if report["ro"][0]:
        msg = "i18n: %d Romanian strings untranslated (listed above)" % len(report["ro"][0])
        if strict_ro:
            raise SystemExit(msg)
        print("WARNING " + msg)
    return report


if __name__ == "__main__":
    import sys
    run(strict_ro="--strict" in sys.argv)
