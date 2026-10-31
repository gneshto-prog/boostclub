"""Merge page owners' i18n/new-*.json ({"English": ["Romanian", "Russian"]}) into ro.json / ru.json and log them in NEW-LINES.md."""
import json, glob, os, sys
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site', 'i18n', '')
ro = json.load(open(SITE + 'ro.json')); ru = json.load(open(SITE + 'ru.json'))
log = []
for f in sorted(glob.glob(SITE + 'new-*.json')):
    d = json.load(open(f))
    for en, v in d.items():
        if not isinstance(v, (list, tuple)) or len(v) < 2:
            print('skip', f, en); continue
        if ro.get(en) != v[0] or ru.get(en) != v[1]:
            ro[en], ru[en] = v[0], v[1]; log.append((os.path.basename(f), en, v[0], v[1]))
json.dump(ro, open(SITE + 'ro.json', 'w'), ensure_ascii=False, indent=1)
json.dump(ru, open(SITE + 'ru.json', 'w'), ensure_ascii=False, indent=1)
if log:
    with open(SITE + 'NEW-LINES.md', 'a') as fh:
        fh.write('\n## Merged 31 Oct redesign (page owners, not native-checked)\n' + ''.join(f'- [{s}] {e} · RO: {r} · RU: {u}\n' for s, e, r, u in log))
print(len(log), 'lines merged')
