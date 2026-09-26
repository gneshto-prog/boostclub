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

## 2026-09-26 — Batch 2 plan: shared foundations and factual corrections

AUDIT FINDINGS: B05/B06/B14/B27/B28/B32/B34/B37/B42/B43, X12/X13.
CURRENT BEHAVIOR: dark-section links override primary CTA color; mobile Results is missing and Escape does not close the menu; legal navigation differs; contact directions identify the wrong metro line and conflicting turns; schema uses WellnessCenter and unverified coordinates/hours; old FAQ schema diverges from the booking UI; legal tables lack keyboard scroll regions; Romanian terms incorrectly cite the Labour Code as a nutrition regulation.
CHANGE: shared consumer navigation/footer, accessible menu state, readable CTA/closed labels, M1/M2 and address-based navigation, one localized schema graph with stable business/person identities and no disputed facts, keyboard table regions, corrected irrelevant citation, targeted intent metadata and honest sitemap dates. Preserve all routes, reviews, disclosures and legal scope.
EXPECTED RESULT: accessible discovery and booking CTAs; consistent crawlable identities; no misleading directions or false precision.
VERIFY: local semantic/SEO regression tests, keyboard/contrast/browser checks at all required widths and existing build validators. Ambiguous opening hours, entrance pin and substantive legal wording remain owner/reviewer decisions.

### Batch 2 verification

- 12 backend/SEO/semantic regression tests passed; strict TypeScript, syntax lint, original site/concept/Soft Current validators passed.
- 39 public routes × 375/430/768/1366/1440 passed document-overflow checks. Consumer mobile menus include Results, Escape closes them, aria-expanded resets and focus returns to the toggle.
- Dark primary buttons passed 4.5:1 at both computed gradient stops in normal/hover/focus states. Screenshots inspected for RO contact/mobile, RU home/mobile and EN cookies/desktop; fullpage lazy images require viewport scrolling for final photo comparison.
- Preserved the intentional EN x-default on the international business and Gabi funnels; all alternate links remain reciprocal. Other x-defaults remain RO.
- No review-rich-result or FAQ-rich-result claim. Google’s former FAQ documentation URL currently redirects to Search updates; ordinary FAQs remain visible without duplicated JSON-LD answers.
- Sources: https://schema.org/LocalBusiness; Metrorex map cited in the audit; Romanian Labour Code source linked in compliance notes. No production changes.

## 2026-09-26 — Batch 3 plan: truthful forms and consent contract

AUDIT FINDINGS: B07/B12/B15/B16/B21/B22, X04/X06/X21/X22.
CURRENT BEHAVIOR: attribution automatically stores click IDs and appends tracking references to WhatsApp; duplicate wrappers can emit events without a consent gate; partner forms use placeholders and alert dialogs; invalid confirmation state redirects without explanation; Russian static partner WhatsApp links contain English messages.
CHANGE: one allowlisted, non-PII analytics adapter disabled by default; explicit consent API; no automatic analytics provider; attribution disabled without analytics and marketing consent; no WhatsApp URL mutation; completion only after a real handler success, deduplicated by submission key; accessible partner labels/privacy link/error/success; explanatory confirmation fallback; localized RU links and realistic assisted-contact copy.
EXPECTED RESULT: no optional tracking before consent, no duplicate completion, no false appointment from a contact request, and accessible recovery when session state is unavailable.
VERIFY: isolated browser requests only, consent/revocation/dedup/storage-blocked/confirmation/partner states, then full build and regression suite. Actual analytics destination and durable messaging remain external actions.

### Batch 3 verification

- 16 tests passed (including default denial, explicit consent, revocation, event allowlist/non-PII payloads and unchanged WhatsApp URLs), strict types, syntax lint and full production build validators passed.
- All three booking locales still pass the five-width mock journey. Partner form tests pass for failure, retained input, focused error/success and repeated submissions; concurrent calls share one request and replay does not double-count completion.
- Empty confirmation state stays on-page with a truthful contact path. Blocked sessionStorage still shows a confirmed booking. No-JavaScript form cannot submit a false exact booking and has visible phone/WhatsApp recovery.
- A real browser test caught the form's named `name` input shadowing `form.name`; changed event detection to getAttribute('name') and reran successfully.
- Public production booking-slots.js and lead-pipeline.js exactly match the initial dd4a115 versions (SHA-256 recorded in tool evidence). This confirms the baseline frontend; production deployment has no commit_ref and must still reconcile the server bundle before publication.
- Local partner screenshots saved in evidence/batch3. No live lead, external analytics provider or deployment was created.
