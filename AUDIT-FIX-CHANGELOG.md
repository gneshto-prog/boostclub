# Audit fix changelog

## 2026-09-26 — Baseline and booking diagnosis

- Repository: /Users/Gabi/Desktop/boostclub; initial clean branch homepage-concepts at dd4a115; implementation branch codex/audit-implementation-2026-09-26. No unrelated work overwritten.
- Static generator: content/{ro,en,ru,root}/pages.json and shared components. Netlify publishes _site; separate homepage concept/Soft Current experiments are preserved.
- Existing `node scripts/prepare-site.mjs`: PASS (44 pages, DOM parity, site, concept and Soft Current checks). No package-defined lint, typecheck or booking tests existed.
- Generated output backed up outside repo before build.
- Production deploy 6a96871655b4eca6639206fe, CLI upload on 2026-09-01, branch main, no commit_ref. Both functions present.
- Live GET /api/availability?date=2026-09-28 and 2026-09-29: HTTP 503. Request 01M3F8Z5T07Q0M8FT06R400CSK correlated to Netlify log: Supabase server credentials are not configured.
- Netlify environment UI: SUPABASE_URL, SUPABASE_SECRET_KEY and GOOGLE_SERVICE_ACCOUNT_JSON have values only in Deploy Previews; Production is empty. Secret values were not revealed.
- Read-only occupancy query with service_role succeeds. No database changes or real bookings made.

### Batch 1 plan — before implementation

AUDIT FINDING: B01/B02/B04, X04/X05/X06: unavailable booking, weak recovery and unverified end-to-end states.
CURRENT BEHAVIOR: all open-day availability fails due to missing production environment; external requests have no deadline; frontend retry has no inline assisted action; stale requests can affect the current date; submission errors use alert().
CHANGE: fail a production build with incomplete booking configuration; bound upstream requests; validate upstream responses; add translated retry/WhatsApp/call states, request references, preserved inputs and accessible errors; test using isolated mock providers.
EXPECTED RESULT: broken configuration cannot silently ship via the build; failure never becomes false capacity or success; users always have a working contact path.
VERIFY: deterministic backend tests and browser journeys across RO/EN/RU; production repair remains a separate external action until configuration and deployment are authorized.

### Batch 1 verification

- Backend tests: 9 passed, including missing configuration, calendar/CRM overlap, closed/full dates, timeout, invalid request, DST, locale creation, replay/conflict and partial failure. All providers mocked.
- Syntax lint and strict TypeScript check passed. Production build and all existing validators passed; explicit reviewed parity hashes record intended booking HTML differences.
- Browser: RO/EN/RU × 375/430/768/1366/1440, inline failure recovery, no overflow, closed/full/offline, input retention, focused 409 error, success/reload, Netlify archive failure. No real lead created.
- Root cause is external deployment-context configuration. All live production claims remain unverified. Cosmetic work stays gated while that remains unresolved.
