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

## 2026-09-26 — Batch 4A: reconcile live content before homepage work

AUDIT FINDING: B03, preservation of current public reviews and copy.
CURRENT BEHAVIOR: the located source's booking scripts match production, but static content predates the September review refresh and punctuation edits. Initial checkout had 34 reviews; live dated snapshot has 40 and eight different original-language review selections.
CHANGE: saved all 42 localized public HTML endpoints read-only; three-way merged their main content against dd4a115 and current fixes. Converted production inline styles to the existing hashed utility/token system. Inspected conflicts and retained the intentional booking, metro and Russian WhatsApp fixes. No user work reset or overwritten.
EXPECTED RESULT: later publication preserves newer live testimonials, date/count and unrelated copy updates while retaining audit fixes. Production snapshot and word-level change inventory saved in the external evidence folder.
VERIFY: original live review text equality, body integrity, all build checks and booking regression; deployed server commit still cannot be inferred from its null commit_ref.

### Batch 4A verification

- All eight live review blocks match exactly in RO, EN and RU after the merge; original languages/authors and 1 September 2026 date retained.
- Production inline styles reused existing external tokenized components; four newly encountered utility declarations added without introducing inline styles.
- 16 tests, syntax lint, strict typecheck, full build and both complete three-locale mock browser journeys passed after reconciliation.

## 2026-09-26 — Batch 4B plan: homepage booking hierarchy and truthful copy

AUDIT FINDINGS: B07/B10/B11/B26/B30/B31/B37, X01/X02/X03/X08/X22/X24.
CURRENT BEHAVIOR: homepage deliverables are several screens down, recruitment/referral promotions compete with the first visit, four long review quotes and repeated credential counters obscure the offer, copy overstates bioimpedance precision and contact speed.
CHANGE: retain existing green/cream sections and genuine imagery; lead with the audited free-assessment headline, time/location/no-purchase commitment and booking action; move deliverables immediately after hero, explain optional continuation and Herbalife relationship, retain three exact short review excerpts with full originals on /recenzii, concise founder introduction, earlier arrival information and consistent final action. Remove the recruitment billboard and referral block from the first-visit path; dedicated business/legacy offers and referral details on contact remain. Share dated review/after-visit copy across RO/EN/RU. Correct supportive founder wording, neutral progress headings and partner enquiry labels.
EXPECTED RESULT: a shorter, understandable consumer path using the existing design system; no invented business facts, outcomes, new credentials, prices or photography. Broad decorative redesign remains gated on production booking recovery.
VERIFY: semantic content order, current original-review preservation, all requested viewports, hero/LCP image priority, forms and existing build checks. Detailed result captions/prices/credentials remain owner/legal items.

### Batch 4B verification

- 17 automated tests, full build, strict types and syntax lint passed. New hierarchy regression checks assert assessment details follow hero, primary action is booking, hero remains high-priority, three excerpts occur verbatim in the eight full originals, and partner/referral blocks no longer compete on the homepage.
- 39 public routes × five requested widths passed overflow/menu/CTA checks. Shared process FAQs and reviews rerun after final localization updates. Screenshots in evidence/batch4 use fully decoded local images for visual inspection; these screenshot loads are not performance measurements.
- Visual review caught header CTA white-on-gold text and dark review-date text; both corrected. Russian uses a consistent Cyrillic-capable system face for Latin place names and Cyrillic text; no extra font network dependency.
- Existing referral terms were moved from consumer pages into a collapsed section after successful booking. They remain preserved and need L06 review; no rewards or eligibility invented. The earlier plan's contact-placement option was superseded by this final placement.
- Practical FAQ content now exists in all languages. Removed unsubstantiated “few percent” precision/no-electrode claims; operator/device-specific guidance remains L02.
- Detailed photo/result provenance and current prices/qualifications remain owner decisions, so the homepage does not fabricate new evidence or case studies.

## 2026-09-26 — Batch 5 plan: responsive assets and optional maps

AUDIT FINDINGS: B35/B36/B40/X11.
CURRENT BEHAVIOR: small result tiles download 960px originals (results13: 160,360 bytes); map libraries load near the viewport; Google iframes connect as the visitor scrolls; mutable asset filenames cannot safely use immutable caching.
CHANGE: generate uncropped 320/640 WebP derivatives with content hashes, preserve original full images/dimensions and high-priority hero loading; add sizes/srcset at build time. Immutable caching applies only to hashed derivatives. Google Maps and the partner country map load on an explicit button press; plain directions and fallback enquiry routes remain available. Keep map libraries/data self-hosted.
EXPECTED RESULT: fewer initial/thumbnail bytes, no involuntary map connection, accurate image layout and no stale mutable-asset cache.
VERIFY: actual selected image resources at mobile DPR 1/2 and desktop, before/after byte totals, map network absence before click and function after click/failure, visual legibility, regression suite and build.

### Final accessibility plan

AUDIT FINDING: X25/B30 keyboard/reflow and preservation of usable FAQs.
CURRENT BEHAVIOR: FAQ answers use a visual zero-height grid without removing their links from keyboard/screen-reader navigation; without JavaScript the answers stay collapsed. A partner brand link's accessible name omits its visible name.
CHANGE: hide collapsed FAQ panels semantically after JavaScript initializes, keep answers expanded in static HTML/CSS, synchronize aria-controls/expanded, and include Boost Club in the partner brand label.
EXPECTED RESULT: keyboard users cannot enter invisible answers, no-JavaScript visitors can read them, and speech-control users can identify the brand link by visible text.
VERIFY: keyboard Enter/Space, no-JavaScript content visibility, five-width regression plus 320px reflow and 200% text enlargement, local confirmation and UTC calendar download.

### Batch 5 and final acceptance verification

- Responsive derivatives preserve all 18 originals, aspect ratios and content hashes. At 375px, the results grid transfers 192,230 bytes instead of 788,680 (75.6% less) at DPR 1 and 2. Desktop DPR 1/2 also verified; original files remain available when that is the correct resolution. Hero preload and actual source agree with no duplicate download.
- Google embeds and D3/topology load only after an explicit visitor action. Real self-hosted country-map rendering, simulated Google embed load and failed-library fallback pass in every locale. Independent directions and enquiry links survive.
- Closed label is 9.06:1; 16px earnings disclosure is 6.37:1. Full axe 4.13 scan found remaining partner small-blue labels and nested table scrolling; corrected in shared CSS and actual focusable scroll regions, then all 39 public routes passed.
- FAQ answers now stay readable without JavaScript and leave the accessibility/keyboard tree when collapsed with JavaScript. Russian metric cards no longer overflow at 320px. All 42 localized routes passed 320px reflow and 200% root text; confirmation passed all five widths with keyboard .ics download, UTC dates, expired/missing storage and noindex recovery.
- Final preservation comparison confirms all 24 full review quotes exactly match newer live selections, original files/URLs remain, founder video controls/preload and existing contacts/sticky bars survive, robots/route redirects are unchanged. No tracked file deleted.
- Final copy sweep corrected remaining “few minutes” WhatsApp/“30 seconds” contact promises and unverified “no preparation” statements in process copy. This narrows unsupported claims; actual device guidance remains L02.
- Final syntax lint (52 scripts), strict typecheck, 19 tests and full 44+16+7-page production-artifact build passed. Build must finish before tests that read `_site`; one parallel local check raced against output regeneration, then the correctly ordered run passed. Browser tests use synthetic intercepted responses, never real customer bookings.
- Lighthouse 13.5 with Brotli preview: home 99 / booking 98 / business 93 performance; SEO and automated accessibility 100 each. LCP is 1.8s / 1.8s / 2.6s versus original 1.5s / 1.4s / 2.1s. These are different local-preview versus public-CDN runs, not evidence of universal speed improvement. Confirm field metrics after publication. Exact measurements and limits are in FINAL-IMPLEMENTATION-REPORT.md.
- 69 findings reconciled: 40 VERIFIED FIXED locally, 11 REQUIRES EXTERNAL ACTION, 9 REQUIRES OWNER DECISION, 9 REQUIRES LEGAL/COMPLIANCE REVIEW. X26 explicitly records actual device/assistive-technology acceptance; X23 remains gated on live P0 repair. No silent TODOs, invented facts, secret values, production changes or deployment.

## 2026-09-27 — Owner-requested Google Maps photo import

AUDIT FINDING: B23 — the website needs more evidence of the real physical club.
CURRENT BEHAVIOR: The homepage had no club gallery and the Romanian contact page reused a founder portrait; English/Russian contact pages had no venue photo.
CHANGE: Downloaded all 24 files exposed by Google Maps’ “By owner” gallery, preserved all source downloads and metadata outside the public build, and generated 23 byte-unique WebP images at up to three widths (63 assets). Added three homepage highlights, a contact interior image, and a 23-image contact gallery in RO/EN/RU. Six photos are initially visible; native details/summary exposes the other 17. Full gallery images retain their original framing and link to the full downloaded-resolution WebP. No added JavaScript, remote image requests or new dependency in the production build.
EXPECTED RESULT: Visitors can see the actual room and everyday club activity before booking.
FILES: content/{ro,en,ru}/pages.json; content/club-photo-descriptions.json; content/club-photos.json; scripts/import-club-photos.py; scripts/lib/club-gallery.mjs; scripts/build-site.mjs; css/club-gallery.css; images/club-gallery/; approved parity snapshots and generated metrics.
VERIFY: Production build, DOM parity, SEO/form/token validation, syntax lint, typecheck, 19 regression tests. Browser checked six routes at 375/430/768/1366/1440 pixels: zero horizontal overflow. Native gallery expansion works with Enter in each locale; all 23 images loaded without failures, no console errors/warnings observed. Mobile gallery and desktop gallery inspected visually.
PERFORMANCE: 24 source downloads total 3,059,888 bytes. The 23 full-size WebP versions total 1,463,390 bytes; their 320px variants total 377,408 bytes. This is an asset-size comparison, not a measured page-speed or conversion gain. All new images are lazy-loaded with explicit dimensions.
OUTSTANDING: Customer-uploaded photos await reuse permission; exterior/entrance, assessment and independent partner-location photos remain missing. Google Maps downloads are the resolutions exposed by the gallery (not the camera originals). Production deployment and the existing booking configuration issue remain separate, unchanged tasks.

## 2026-09-27 — Owner-requested community homepage

REQUEST: Replace the opening founder portrait with an attractive landscape community photo and welcoming text.
CHANGE: The RO/EN/RU homepages now lead with a real group photograph from the owner gallery and localized “Mai bine, împreună” copy. Desktop places the group beside the headline; phones show the headline and landscape image before supporting copy. Removed the portrait frame and orbit from this opening. Retained the first-visit booking action, WhatsApp, free-assessment details, dated reviews and founder story farther down the page.
ASSETS: Retrieved the same group photo at 1536×2048, retained the uncropped WebP and added hashed 320/640/960 derivatives. CSS creates the landscape framing. Hero preload and responsive image source agree; the image has explicit dimensions and high fetch priority. Source provenance is in content/community-hero-image.json.
VERIFY: Full build and parity/SEO/form/token validation, syntax lint, strict typecheck and all 19 tests pass. Browser checked RO/EN/RU at 375/430/768/1366/1440 pixels: no horizontal overflow, landscape framing, correct booking/WhatsApp links and matching preload/srcset. Desktop and phone appearance inspected; no console errors/warnings observed. No page-speed or conversion uplift claimed.
SCOPE: This targeted change implements the owner's explicit visual preference. Audit totals and unresolved photography requirements remain unchanged. Local only; no push or deployment.

## 2026-09-28 — Approved transformation cards and release check

Replaced the three results galleries with all 54 approved finished cards, plus 162 uncropped responsive WebP assets produced by the existing image pipeline. Added a 1/2/3-column square grid, exact owner-supplied community introductions, anonymous numbered alt text and neutral metadata. Preserved the disclaimer block, correcting its member attribution. Homepage previews use approved cards; old transformation-member labels in concept templates were corrected too. Original PNG hashes are unchanged; all seven held-back sources excluded.

Full build and validators, lint, typecheck and 21 tests pass. Three locales at phone/tablet/desktop sizes have correct columns and no overflow; all 54 images loaded. Real local Netlify booking checks in production context fail at availability with HTTP 503 and missing Supabase server credentials in all three languages. No lead submission or real confirmation was possible; no deployment or push. See TRANSFORMATION-GALLERY-RELEASE.md for precise scope, evidence and the remaining release gate.
