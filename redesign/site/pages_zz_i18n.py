# Romanian + Russian pages: ro/<file> and ru/<file> from every English page, via i18n/engine.py.
# Runs last of the pages_*.py modules (inside build.py's globals). build.py writes 404.html after the
# modules, so the translation runs at interpreter exit, when every English page is final.
# Dictionaries: i18n/ro.json, i18n/ru.json (EN -> translation). Untranslated English is listed, never fatal.
import atexit as _i18n_atexit, importlib.util as _i18n_iu


def _i18n_build():
    _spec = _i18n_iu.spec_from_file_location("bc_i18n_engine", os.path.join(D, "i18n", "engine.py"))
    _eng = _i18n_iu.module_from_spec(_spec)
    _spec.loader.exec_module(_eng)
    try:
        _eng.run(strict_ro=False)
        # Netlify detects forms in the deployed HTML, so each language's page carries its own live form name.
        for _lg, _fnm in (("ro", "consultatie"), ("ru", "consultatie-ru")):
            _fp = os.path.join(D, _lg, "free-scan.html")
            _h = open(_fp, encoding="utf-8").read()
            _h = (_h.replace('name="consultatie-en"', f'name="{_fnm}"')
                    .replace('name="form-name" value="consultatie-en"', f'name="form-name" value="{_fnm}"')
                    .replace('name="lang" value="en"', f'name="lang" value="{_lg}"'))
            open(_fp, "w", encoding="utf-8").write(_h)
    except Exception:
        import traceback
        print("i18n: RO/RU build FAILED (English pages are fine):")
        traceback.print_exc()


_i18n_atexit.register(_i18n_build)
