"""Checks every link the rendered pages contain (from an audit JSON): internal files exist, #anchors exist on
the target page, external URLs answer. Prints one line per problem, then a summary."""
import json, os, re, sys, urllib.request, urllib.parse, html
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
data = json.load(open(sys.argv[1]))
seen, internal, external = set(), {}, {}
for r in data:
    if 'links' not in r: continue
    page = r['pg']
    for l in r['links']:
        h = (l.get('h') or '').strip()
        key = (page, h)
        if key in seen: continue
        seen.add(key)
        if not h: internal.setdefault(('EMPTY', page), []).append(l['t']); continue
        if h == '#':
            if not l.get('r'): internal.setdefault(('DEAD #', page), []).append(l['t'])
            continue
        if re.match(r'^(https?:|mailto:|tel:)', h):
            external.setdefault(h, set()).add(page); continue
        base = os.path.dirname(page)
        path, _, frag = h.partition('#')
        path = path.split('?')[0]
        tgt = os.path.normpath(os.path.join(base, path)) if path else page
        fp = os.path.join(SITE, tgt)
        if not os.path.exists(fp):
            internal.setdefault(('MISSING', page), []).append(h); continue
        if frag:
            src = open(fp, encoding='utf-8').read()
            if not re.search(r'id=["\']' + re.escape(frag) + r'["\']', src):
                internal.setdefault(('NO ANCHOR', page), []).append(h)
for (kind, page), v in sorted(internal.items()):
    print(f'✗ {kind:10} {page}: {sorted(set(v))[:6]}')
bad = 0
for u, pages in sorted(external.items()):
    if u.startswith(('mailto:', 'tel:')):
        print(f'· {u}  ({len(pages)} pages)'); continue
    try:
        req = urllib.request.Request(u, method='GET', headers={'User-Agent': 'Mozilla/5.0 (Macintosh) Chrome/130'})
        with urllib.request.urlopen(req, timeout=20) as resp: code = resp.status; final = resp.url
    except urllib.error.HTTPError as e: code, final = e.code, u
    except Exception as e: code, final = 'ERR ' + str(e)[:60], u
    ok = code == 200 or (isinstance(code, int) and code < 400)
    if not ok: bad += 1
    print(f"{'✓' if ok else '✗'} {code} {u[:110]}{'  -> '+final[:80] if final!=u else ''}  ({len(pages)} pages)")
print(f'{len(internal)} internal problem groups, {bad} external failures, {len(external)} external URLs')
