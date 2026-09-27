# Boost Club Audit Implementation

## Summary

Total audit findings: 69 (consolidated; repeated page/copy recommendations are retained in AUDIT-COVERAGE.md)
Fixed: 40
Verified: 40
Remaining: 29 (each assigned an explicit decision/external/legal state)
Unreconciled: 0
External: 11
Owner decision: 9
Legal review: 9

VERIFIED FIXED means verified in the local implementation unless production evidence is explicitly stated. Nothing has been deployed. Production booking restoration is not marked fixed. Each finding has exactly one final state; AUDIT-COVERAGE.md maps repeated source recommendations to these IDs.

## P0

- [ ] **B01 — 503 availability blocks self-booking** — REQUIRES EXTERNAL ACTION

  Audit reference: Main audit §27 row 1. Area: All booking locales/API.
  Current behavior: Production is missing SUPABASE_URL, SUPABASE_SECRET_KEY and GOOGLE_SERVICE_ACCOUNT_JSON; all are preview-only. 503 correlated with production Netlify log.
  Change: Inspect production requestIds/logs, restore upstream calendar availability, test working/closed/full dates.
  Expected result: Restores primary acquisition route
  Files changed: scripts/check-booking-config.mjs, scripts/prepare-site.mjs
  Verification: Root cause verified; local missing-config regression passes. Live restoration needs production env correction and explicitly authorized deployment; E01.

- [x] **B02 — Failed availability leaves no selectable time** — VERIFIED FIXED

  Audit reference: Main audit §27 row 2. Area: Booking error state.
  Current behavior: Previously retry-only availability failure; no inline contact path.
  Change: Show truthful failure plus retry/WhatsApp/call; retain inputs and avoid false success.
  Expected result: Recovers affected enquiries
  Files changed: js/booking-slots.js, js/booking-form.js, css/style.css
  Verification: 9 backend tests; 3 locales × 5 widths. Recovery links, no fake slots, retained inputs, focused conflict and archive failure checked in browser.

## P1

- [x] **B03 — Public repo differs from live booking system** — VERIFIED FIXED

  Audit reference: Main audit §27 row 3. Area: Deployment/source.
  Current behavior: Initial source dd4a115 had older static content but its public booking frontend scripts matched production exactly. Netlify deploy has no commit_ref.
  Change: Locate authoritative commit/config/backend; reconcile before redeploying.
  Expected result: Prevents loss of current functionality
  Files changed: content/ro/pages.json, content/en/pages.json, content/ru/pages.json, css/components/inline-utilities.css
  Verification: 42 live HTML snapshots compared and three-way reconciled; 24 review blocks match exactly; function architecture/config/logs traced; all tests and 3-locale mock browser journeys pass. Before deployment, verify the reviewed new release artifacts; historical deployed commit remains unavailable. The live CLI deploy has no commit_ref. Public scripts matched the initial source; all 42 current live HTML pages were reconciled, including newer reviews. Server deployment linkage remains E01, not a claim of verified deployed commit.

- [ ] **B04 — Real calendar/CRM success unverified** — REQUIRES EXTERNAL ACTION

  Audit reference: Main audit §27 row 4. Area: Booking/confirmation.
  Current behavior: Local full handler tested with isolated fake CRM/calendar; production configuration missing.
  Change: Run internal end-to-end test per locale; verify persistence, duplicates, conflicts, timezone and partial archive failure.
  Expected result: Reliable appointments and counts
  Files changed: tests/booking.test.mjs, tests/booking-browser.mjs
  Verification: Local creation/replay/conflict/partial-failure tests pass. Real persistence and protected CRM/attendance reconciliation require E01 internal test workflow.

- [x] **B05 — Pale text on gold 1.38–1.60:1** — VERIFIED FIXED

  Audit reference: Main audit §27 row 5. Area: Dark-section buttons.
  Current behavior: Original behavior recorded in Batch 2 plan of AUDIT-FIX-CHANGELOG.md.
  Change: Set deep-green primary-button text and test every state against 4.5:1.
  Expected result: Readable primary action
  Files changed: css/style.css
  Verification: 12 regression tests; strict typecheck/syntax lint and all build validators passed. 39 public routes × 5 widths checked in browser, with menu Escape/focus and primary CTA contrast >=4.5:1. Local only; screenshot evidence in batch2. Hours/credentials remain explicitly withheld pending confirmation.

- [x] **B06 — Wrong metroM3** — VERIFIED FIXED

  Audit reference: Main audit §27 row 6. Area: Contact all locales.
  Current behavior: Original behavior recorded in Batch 2 plan of AUDIT-FIX-CHANGELOG.md.
  Change: Correct toM2; validate route/entrance before precise turns.
  Expected result: Fewer arrival errors
  Files changed: content/ro/pages.json, content/en/pages.json, content/ru/pages.json
  Verification: 12 regression tests; strict typecheck/syntax lint and all build validators passed. 39 public routes × 5 widths checked in browser, with menu Escape/focus and primary CTA contrast >=4.5:1. Local only; screenshot evidence in batch2. Hours/credentials remain explicitly withheld pending confirmation.

- [x] **B07 — Instant and callback promises contradict actual model** — VERIFIED FIXED

  Audit reference: Main audit §27 row 7. Area: Booking/home.
  Current behavior: Audit finding pending source comparison.
  Change: Use exact confirmed-slot wording and realistic assisted-response expectations.
  Expected result: Clear expectations
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions. Final source sweep removed remaining minutes/seconds promises in booking sidebars and contact pages; all three locales checked.

- [ ] **B08 — Variable hours and mismatched coordinates** — REQUIRES OWNER DECISION

  Audit reference: Main audit §27 row 8. Area: All NAP blocks/schema.
  Current behavior: Audit finding pending source comparison.
  Change: Verify actual staffed hours/entrance; publish one shared data record.
  Expected result: Reliable local information
  Files changed: scripts/lib/structured-data.mjs
  Verification: O02: precise hours/entrance need owner confirmation. Mismatched geo/hours removed from schema; existing booking schedule unchanged.

- [ ] **B09 — Paid continuation and products unclear** — REQUIRES OWNER DECISION

  Audit reference: Main audit §27 row 9. Area: Homepage/process.
  Current behavior: Audit finding pending source comparison.
  Change: Publish actual membership inclusions/costs; explain optional Herbalife purchase relationship near decision.
  Expected result: Informed qualified leads
  Files changed: None yet.
  Verification: See OWNER-DECISIONS.md O03–O08; no missing business fact, permission, transcript or offer status invented.

- [x] **B10 — Offer details too late** — VERIFIED FIXED

  Audit reference: Main audit §27 row 10. Area: Homepage.
  Current behavior: Audit finding pending source comparison.
  Change: Move assessment deliverables immediately below shorter offer-led hero.
  Expected result: Faster comprehension
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [x] **B11 — Secondary business overshadows primary goal** — VERIFIED FIXED

  Audit reference: Main audit §27 row 11. Area: Consumer header/home.
  Current behavior: Audit finding pending source comparison.
  Change: Footer-labelled business link; remove full partner billboard; preserve dedicated landing.
  Expected result: Clearer consumer intent
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [x] **B12 — Absolute no-third-party promise** — VERIFIED FIXED

  Audit reference: Main audit §27 row 12. Area: Forms.
  Current behavior: Audit finding pending source comparison.
  Change: Replace with accurate booking-use summary and privacy link; verify processing inventory.
  Expected result: Truthful data collection
  Files changed: js/booking-form.js, content/ro/pages.json, content/en/pages.json, content/ru/pages.json
  Verification: Batch 3: 16 regression tests and all build checks pass; 3-locale mock booking and partner-browser journeys verify recovery, input retention, success focus, duplicate requests, deduplicated events, blocked storage and no-JavaScript assisted booking. No production submissions.

- [ ] **B13 — Different basis/retention/provider facts** — REQUIRES LEGAL/COMPLIANCE REVIEW

  Audit reference: Main audit §27 row 13. Area: Privacy locales.
  Current behavior: Audit finding pending source comparison.
  Change: Approve current factual master and equivalent translations.
  Expected result: Consistent rights information
  Files changed: None yet.
  Verification: See LEGAL-COMPLIANCE-REVIEW.md L01–L07 for current exact wording, location, audit concern and decision. Technical fixes do not approve the underlying legal content.

- [x] **B14 — Incorrect Law 53/2003 reference** — VERIFIED FIXED

  Audit reference: Main audit §27 row 14. Area: RO terms.
  Current behavior: Original behavior recorded in Batch 2 plan of AUDIT-FIX-CHANGELOG.md.
  Change: Remove and obtain correct service-scope review.
  Expected result: Removes factual legal error
  Files changed: content/ro/pages.json
  Verification: 12 regression tests; strict typecheck/syntax lint and all build validators passed. 39 public routes × 5 widths checked in browser, with menu Escape/focus and primary CTA contrast >=4.5:1. Local only; screenshot evidence in batch2. Hours/credentials remain explicitly withheld pending confirmation.

- [ ] **B15 — Policy and deployment disagree** — REQUIRES LEGAL/COMPLIANCE REVIEW

  Audit reference: Main audit §27 row 15. Area: Storage/cookies.
  Current behavior: Audit finding pending source comparison.
  Change: Audit browser storage/maps/ad IDs, implement required choices and matching policy.
  Expected result: Valid informed choices
  Files changed: None yet.
  Verification: See LEGAL-COMPLIANCE-REVIEW.md L01–L07 for current exact wording, location, audit concern and decision. Technical fixes do not approve the underlying legal content.

- [ ] **B16 — Hooks without observed destination** — REQUIRES EXTERNAL ACTION

  Audit reference: Main audit §27 row 16. Area: Analytics.
  Current behavior: Audit finding pending source comparison.
  Change: Configure approved destination and verify events/consent; no personal/health data in analytics.
  Expected result: Usable acquisition evidence
  Files changed: None yet.
  Verification: See EXTERNAL-ACTIONS.md E02–E06. Consent-gated analytics contract is tested locally; no provider, external account, message delivery, DNS or attendance workflow was changed.

- [ ] **B17 — Attendance/client outcomes unmeasured** — REQUIRES EXTERNAL ACTION

  Audit reference: Main audit §27 row 17. Area: CRM/operations.
  Current behavior: Audit finding pending source comparison.
  Change: Add due/attended/cancelled/client statuses and protected lead reconciliation.
  Expected result: Optimise real business outcome
  Files changed: None yet.
  Verification: See EXTERNAL-ACTIONS.md E02–E06. Consent-gated analytics contract is tested locally; no provider, external account, message delivery, DNS or attendance workflow was changed.

- [ ] **B18 — Unsubstantiated provenance/context** — REQUIRES OWNER DECISION

  Audit reference: Main audit §27 row 18. Area: Results/home.
  Current behavior: Audit finding pending source comparison.
  Change: Audit origin/permission; caption every retained image; build 3 real cases.
  Expected result: Credible proof
  Files changed: None yet.
  Verification: See OWNER-DECISIONS.md O03–O08; no missing business fact, permission, transcript or offer status invented.

- [ ] **B19 — Credential/experience facts insufficiently evidenced** — REQUIRES OWNER DECISION

  Audit reference: Main audit §27 row 19. Area: Founder claims.
  Current behavior: Audit finding pending source comparison.
  Change: Publish exact verified qualification; source/date material statistics; separate family and personal experience.
  Expected result: Accountable expertise
  Files changed: None yet.
  Verification: See OWNER-DECISIONS.md O03–O08; no missing business fact, permission, transcript or offer status invented.

- [ ] **B20 — Earnings certainty and selective comparisons** — REQUIRES LEGAL/COMPLIANCE REVIEW

  Audit reference: Main audit §27 row 20. Area: Business.
  Current behavior: Audit finding pending source comparison.
  Change: Remove absolute claims/caricature table; show work, cost categories and current-market typical outcomes.
  Expected result: Better informed prospects
  Files changed: None yet.
  Verification: See LEGAL-COMPLIANCE-REVIEW.md L01–L07 for current exact wording, location, audit concern and decision. Technical fixes do not approve the underlying legal content.

- [x] **B21 — Tiny English earnings disclosure** — VERIFIED FIXED

  Audit reference: Main audit §27 row 21. Area: Business RO/RU.
  Current behavior: Audit finding pending source comparison.
  Change: Translate, enlarge/darken and place beside related claims; validate market document.
  Expected result: Readable disclosure
  Files changed: content/en/pages.json, content/ro/pages.json, content/ru/pages.json, css/business-phase2.css, css/components/7ec7fdeb08.css, css/components/8247048a39.css, tests/axe-browser.mjs
  Verification: Disclosure is 16px with measured 6.37:1 contrast in all locales; remaining small blue labels/links darkened. Axe 4.13 passes all 39 public routes. Market/legal substance remains B20/X19.

- [x] **B22 — English WhatsApp payloads** — VERIFIED FIXED

  Audit reference: Main audit §27 row 22. Area: RU business.
  Current behavior: Audit finding pending source comparison.
  Change: Localise every static and dynamically built message; compose-only test.
  Expected result: Consistent contact journey
  Files changed: content/ru/pages.json, content/site.mjs
  Verification: Batch 3: 16 regression tests and all build checks pass; 3-locale mock booking and partner-browser journeys verify recovery, input retention, success focus, duplicate requests, deduplicated events, blocked storage and no-JavaScript assisted booking. No production submissions.

- [ ] **B23 — Insufficient actual-club evidence** — REQUIRES OWNER DECISION

  Audit reference: Main audit §27 row 23. Area: Homepage/contact.
  Current behavior: Audit finding pending source comparison.
  Change: Photograph entrance, wide room, real assessment and consented daily activity.
  Expected result: Makes visit tangible
  Files changed: content/{ro,en,ru}/pages.json, content/club-photo-descriptions.json, content/club-photos.json, scripts/lib/club-gallery.mjs, scripts/import-club-photos.py, scripts/build-site.mjs, css/club-gallery.css, images/club-gallery/.
  Verification: 2026-09-27 owner-requested follow-up downloaded all 24 owner-gallery files and integrated 23 unique images into all three languages. Build/lint/typecheck and 19 tests pass; six routes × five widths have no horizontal overflow; gallery expands with Enter in all locales; all 23 images loaded. Interior and daily activity now covered. Entrance/assessment and separate partner-location imagery remain outstanding; status/counts therefore stay unchanged. See OWNER-DECISIONS.md O06.

- [x] **X01 — Publish optional paid continuation and independent Herbalife relationship without inventing prices** — VERIFIED FIXED

  Audit reference: §§5,8,22.4,23.14. Area: Offer disclosure.
  Current behavior: Pending source comparison.
  Change: Publish optional paid continuation and independent Herbalife relationship without inventing prices
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [ ] **X16 — Health-data legal basis, documented consent, retention, withdrawal and access** — REQUIRES LEGAL/COMPLIANCE REVIEW

  Audit reference: §19. Area: Sensitive data.
  Current behavior: Pending source comparison.
  Change: Health-data legal basis, documented consent, retention, withdrawal and access
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: See LEGAL-COMPLIANCE-REVIEW.md L01–L07 for current exact wording, location, audit concern and decision. Technical fixes do not approve the underlying legal content.

- [ ] **X17 — Confirm trader identity, service/product terms and processor/transfer inventory** — REQUIRES LEGAL/COMPLIANCE REVIEW

  Audit reference: §19. Area: Operator legal facts.
  Current behavior: Pending source comparison.
  Change: Confirm trader identity, service/product terms and processor/transfer inventory
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: See LEGAL-COMPLIANCE-REVIEW.md L01–L07 for current exact wording, location, audit concern and decision. Technical fixes do not approve the underlying legal content.

- [ ] **X18 — Review numerical weight/health claims and permission per image** — REQUIRES LEGAL/COMPLIANCE REVIEW

  Audit reference: §19. Area: Results compliance.
  Current behavior: Pending source comparison.
  Change: Review numerical weight/health claims and permission per image
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: See LEGAL-COMPLIANCE-REVIEW.md L01–L07 for current exact wording, location, audit concern and decision. Technical fixes do not approve the underlying legal content.

- [ ] **X19 — Review certainty, expenses, typical earnings, bonuses and market eligibility** — REQUIRES LEGAL/COMPLIANCE REVIEW

  Audit reference: §19. Area: Partner earnings compliance.
  Current behavior: Pending source comparison.
  Change: Review certainty, expenses, typical earnings, bonuses and market eligibility
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: See LEGAL-COMPLIANCE-REVIEW.md L01–L07 for current exact wording, location, audit concern and decision. Technical fixes do not approve the underlying legal content.

## P2

- [ ] **B24 — Conflicting old programme/form** — REQUIRES OWNER DECISION

  Audit reference: Main audit §27 row 24. Area: Legacy ambassador.
  Current behavior: Audit finding pending source comparison.
  Change: Confirm status; merge and 301 locale URLs to current business; update sitemap.
  Expected result: One coherent partner offer
  Files changed: None yet.
  Verification: See OWNER-DECISIONS.md O03–O08; no missing business fact, permission, transcript or offer status invented.

- [ ] **B25 — Overlapping biographies** — REQUIRES OWNER DECISION

  Audit reference: Main audit §27 row 25. Area: Gabi/Gabriel.
  Current behavior: Audit finding pending source comparison.
  Change: Decide distinct social/partner role using traffic/link evidence; otherwise merge with redirects.
  Expected result: Less content drift
  Files changed: None yet.
  Verification: See OWNER-DECISIONS.md O03–O08; no missing business fact, permission, transcript or offer status invented.

- [x] **B26 — Referral pitch before membership understanding** — VERIFIED FIXED

  Audit reference: Main audit §27 row 26. Area: Home/booking/contact.
  Current behavior: Audit finding pending source comparison.
  Change: Move full incentive to member programme with complete conditions.
  Expected result: Less acquisition distraction
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [x] **B27 — Results omission and state/Escape inconsistency** — VERIFIED FIXED

  Audit reference: Main audit §27 row 27. Area: Mobile navigation.
  Current behavior: Original behavior recorded in Batch 2 plan of AUDIT-FIX-CHANGELOG.md.
  Change: Generate same links; synchronise expanded state and close/focus behaviour.
  Expected result: Predictable navigation
  Files changed: content/site.mjs, scripts/lib/components.mjs, js/main.js
  Verification: 12 regression tests; strict typecheck/syntax lint and all build validators passed. 39 public routes × 5 widths checked in browser, with menu Escape/focus and primary CTA contrast >=4.5:1. Local only; screenshot evidence in batch2. Hours/credentials remain explicitly withheld pending confirmation.

- [x] **B28 — Keyboard access missing** — VERIFIED FIXED

  Audit reference: Main audit §27 row 28. Area: Legal/business scroll regions.
  Current behavior: Original behavior recorded in Batch 2 plan of AUDIT-FIX-CHANGELOG.md.
  Change: Focusable labelled wrapper or readable reflow; test Safari/keyboard.
  Expected result: Accessible content
  Files changed: content/en/pages.json, content/ro/pages.json, content/ru/pages.json, css/style.css, tests/accessibility-browser.mjs
  Verification: Final axe scan caught nested scrolling tables and production-merge loss of business scroll attributes; fixed the actual scrolling element. All 39 routes pass axe; keyboard focus checked in every locale.

- [ ] **B29 — Captions/transcript absent in markup** — REQUIRES OWNER DECISION

  Audit reference: Main audit §27 row 29. Area: Founder video.
  Current behavior: Audit finding pending source comparison.
  Change: Add reviewed captions and transcript in available languages.
  Expected result: Accessible founder story
  Files changed: None yet.
  Verification: See OWNER-DECISIONS.md O03–O08; no missing business fact, permission, transcript or offer status invented.

- [x] **B30 — Important process/FAQ parity gaps** — VERIFIED FIXED

  Audit reference: Main audit §27 row 30. Area: Locale content.
  Current behavior: Audit finding pending source comparison.
  Change: Share key offer/confirmation/continuation facts, then native-edit EN/RU.
  Expected result: Equal service understanding
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions. FAQ panels now hide semantically with synchronized controls; answers remain expanded without JavaScript.

- [x] **B31 — Hardcoded counts repeated** — VERIFIED FIXED

  Audit reference: Main audit §27 row 31. Area: Reviews.
  Current behavior: Audit finding pending source comparison.
  Change: Shared rating/count/source/verifiedAt record; monthly review or authorised API sync.
  Expected result: No stale contradictory proof
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [x] **B32 — Unsupported WellnessCenter type** — VERIFIED FIXED

  Audit reference: Main audit §27 row 32. Area: Schema.
  Current behavior: Original behavior recorded in Batch 2 plan of AUDIT-FIX-CHANGELOG.md.
  Change: Use truthful valid LocalBusiness type, stable IDs and verified location data.
  Expected result: Machine-readable entity clarity
  Files changed: scripts/lib/structured-data.mjs
  Verification: 12 regression tests; strict typecheck/syntax lint and all build validators passed. 39 public routes × 5 widths checked in browser, with menu Escape/focus and primary CTA contrast >=4.5:1. Local only; screenshot evidence in batch2. Hours/credentials remain explicitly withheld pending confirmation.

- [ ] **B33 — Duplicate 200 homepage on romnutriclub.ro** — REQUIRES EXTERNAL ACTION

  Audit reference: Main audit §27 row 33. Area: Legacy domain.
  Current behavior: Audit finding pending source comparison.
  Change: If owned/retired,301 mapped paths to Boost; verify alternatives before switch.
  Expected result: Clear domain consolidation
  Files changed: None yet.
  Verification: See EXTERNAL-ACTIONS.md E02–E06. Consent-gated analytics contract is tested locally; no provider, external account, message delivery, DNS or attendance workflow was changed.

- [x] **B34 — Service/brand/process overlap** — VERIFIED FIXED

  Audit reference: Main audit §27 row 34. Area: Page targeting.
  Current behavior: Original behavior recorded in Batch 2 plan of AUDIT-FIX-CHANGELOG.md.
  Change: Use keyword-intent map; refine titles/internal anchors and content roles.
  Expected result: Relevant organic landing paths
  Files changed: content/ro/pages.json, content/en/pages.json, content/ru/pages.json
  Verification: 12 regression tests; strict typecheck/syntax lint and all build validators passed. 39 public routes × 5 widths checked in browser, with menu Escape/focus and primary CTA contrast >=4.5:1. Local only; screenshot evidence in batch2. Hours/credentials remain explicitly withheld pending confirmation.

- [x] **B35 — 960 px thumbnails, `results13.webp`, largest at 156.6 KiB** — VERIFIED FIXED

  Audit reference: Main audit §27 row 35. Area: Image gallery.
  Current behavior: Audit finding pending source comparison.
  Change: Add 320/640/960 srcset and accurate sizes/dimensions; retain proof readability.
  Expected result: Lower mobile transfer
  Files changed: content/responsive-images.json, images/responsive/, scripts/lib/responsive-images.mjs, scripts/resize-images.py, tests/assets.test.mjs, tests/performance-browser.mjs
  Verification: 18 original assets preserved; content-hashed 320/640 variants. Mobile result images: 788,680 to 192,230 bytes (75.6% reduction), DPR 1/2. Full originals remain linked; hero preload matches srcset.

- [x] **B36 — Large D3/map and locale loading drift** — VERIFIED FIXED

  Audit reference: Main audit §27 row 36. Area: Business map.
  Current behavior: Audit finding pending source comparison.
  Change: Use optional country selector; lazy-load map consistently if retained.
  Expected result: Simpler faster interaction
  Files changed: js/components/1c780d7082.js, js/components/95fd94c780.js, js/components/a436a2e6c4.js, tests/performance-browser.mjs, tests/reliability-browser.mjs
  Verification: D3/topology/country data make no request until explicit map button; actual self-hosted map renders in RO/EN/RU. Failed library load retains enquiry fallback.

- [x] **B37 — Manual template/fact duplication** — VERIFIED FIXED

  Audit reference: Main audit §27 row 37. Area: Shared components.
  Current behavior: Audit finding pending source comparison.
  Change: Shared static templates and locale data for nav, hours, proof and legal facts.
  Expected result: Lower future drift
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions. Hours, approved legal master and unsupported business facts remain B08/B13/B19 owner/legal decisions; shared code does not manufacture them.

- [x] **B38 — Entry/portal delays and reduced-motion access** — VERIFIED FIXED

  Audit reference: Main audit §27 row 38. Area: Motion.
  Current behavior: Audit finding pending source comparison.
  Change: Remove entry/transition delay; retain content-visible reduced-motion behaviour.
  Expected result: More direct access
  Files changed: js/main.js, scripts/lib/components.mjs, tests/accessibility-browser.mjs
  Verification: Entry curtain and navigation portal delay removed. Reduced-motion/browser/no-JavaScript checks preserve content. Remaining broad decorative simplification is explicitly tracked separately under X23 and gated on B01.

- [x] **X02 — Replace exact-measurement language with estimates without adding medical advice** — VERIFIED FIXED

  Audit reference: §§9,23.4. Area: BIA wording.
  Current behavior: Pending source comparison.
  Change: Replace exact-measurement language with estimates without adding medical advice
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [x] **X03 — Replace judgmental systems paragraph with supportive concrete wording** — VERIFIED FIXED

  Audit reference: §§9,23.16. Area: Founder copy.
  Current behavior: Pending source comparison.
  Change: Replace judgmental systems paragraph with supportive concrete wording
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [x] **X04 — Date/time first, optional goal, persistent input, accessible submit error, no false success** — VERIFIED FIXED

  Audit reference: §§7,8,16; page-by-page booking. Area: Booking form.
  Current behavior: Date after contact, required goal, alert errors, no provider deadlines or stale-response guard.
  Change: Date/time first, optional goal, persistent input, accessible submit error, no false success
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [x] **X05 — Timeouts, stale date races, schema errors, duplicate submit, replay and archive failure** — VERIFIED FIXED

  Audit reference: §8. Area: Booking reliability.
  Current behavior: Date after contact, required goal, alert errors, no provider deadlines or stale-response guard.
  Change: Timeouts, stale date races, schema errors, duplicate submit, replay and archive failure
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: content/en/pages.json, content/ro/pages.json, content/ru/pages.json, js/booking-form.js, js/booking-slots.js, js/lead-pipeline.js, netlify/functions/_shared/upstream.mts, tests/booking-browser.mjs, tests/booking.test.mjs, tests/reliability-browser.mjs
  Verification: 19 tests include provider bounds, malformed responses, DST, conflict, replay, partial failure and no real writes. Browser tests verify stale-response rejection, client timeout, duplicate requests, archive failure, Back/Forward and storage failure in all languages.

- [x] **X06 — Invalid/expired session, ICS, local place names, modification request wording** — VERIFIED FIXED

  Audit reference: §23.25; page-by-page confirmation. Area: Confirmation.
  Current behavior: Pending source comparison.
  Change: Invalid/expired session, ICS, local place names, modification request wording
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: js/booking-confirmation.js, content/ro/pages.json, content/en/pages.json, content/ru/pages.json
  Verification: Batch 3: 16 regression tests and all build checks pass; 3-locale mock booking and partner-browser journeys verify recovery, input retention, success focus, duplicate requests, deduplicated events, blocked storage and no-JavaScript assisted booking. No production submissions.

- [ ] **X07 — Deliver confirmation and reminders through a verified contact channel** — REQUIRES EXTERNAL ACTION

  Audit reference: page-by-page confirmation. Area: Durable confirmation.
  Current behavior: Pending source comparison.
  Change: Deliver confirmation and reminders through a verified contact channel
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: See EXTERNAL-ACTIONS.md E02–E06. Consent-gated analytics contract is tested locally; no provider, external account, message delivery, DNS or attendance workflow was changed.

- [ ] **X08 — Neutral provenance heading and translated-review labels; no fabricated captions** — REQUIRES OWNER DECISION

  Audit reference: §§17,23.17; page-by-page results. Area: Results copy.
  Current behavior: Pending source comparison.
  Change: Neutral provenance heading and translated-review labels; no fabricated captions
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: content/ro/pages.json, content/en/pages.json, content/ru/pages.json
  Verification: Neutral progress headings and localized metadata implemented. Approved case captions, durations, image permissions and relationship to Boost Club remain O05/L05; not fabricated.

- [ ] **X09 — Verify listing, categories, holiday hours, photos, appointment link and honest review requests** — REQUIRES EXTERNAL ACTION

  Audit reference: §13. Area: GBP.
  Current behavior: Pending source comparison.
  Change: Verify listing, categories, holiday hours, photos, appointment link and honest review requests
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: See EXTERNAL-ACTIONS.md E02–E06. Consent-gated analytics contract is tested locally; no provider, external account, message delivery, DNS or attendance workflow was changed.

- [ ] **X10 — Search Console intent validation and booking/attendance funnel baseline** — REQUIRES EXTERNAL ACTION

  Audit reference: §§8,12,18. Area: Measurement baseline.
  Current behavior: Pending source comparison.
  Change: Search Console intent validation and booking/attendance funnel baseline
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: See EXTERNAL-ACTIONS.md E02–E06. Consent-gated analytics contract is tested locally; no provider, external account, message delivery, DNS or attendance workflow was changed.

- [x] **X11 — Load third-party map only on explicit visitor action with independent directions link** — VERIFIED FIXED

  Audit reference: §§15,19. Area: Maps.
  Current behavior: Pending source comparison.
  Change: Load third-party map only on explicit visitor action with independent directions link
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: js/maps.js, scripts/build-site.mjs, tests/performance-browser.mjs
  Verification: No Google iframe or request before explicit map action; iframe request tested after click. Independent directions links preserved.

- [x] **X12 — Shared LocalBusiness/Person IDs and reciprocal locale markup, no review-star claims** — VERIFIED FIXED

  Audit reference: §§12–14. Area: Schema entities.
  Current behavior: Original behavior recorded in Batch 2 plan of AUDIT-FIX-CHANGELOG.md.
  Change: Shared LocalBusiness/Person IDs and reciprocal locale markup, no review-star claims
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: scripts/lib/structured-data.mjs
  Verification: 12 regression tests; strict typecheck/syntax lint and all build validators passed. 39 public routes × 5 widths checked in browser, with menu Escape/focus and primary CTA contrast >=4.5:1. Local only; screenshot evidence in batch2. Hours/credentials remain explicitly withheld pending confirmation.

- [x] **X13 — Retain proper 404 and noindex; provide locale-aware home/booking links** — VERIFIED FIXED

  Audit reference: page-by-page /404.html. Area: 404 recovery.
  Current behavior: Original behavior recorded in Batch 2 plan of AUDIT-FIX-CHANGELOG.md.
  Change: Retain proper 404 and noindex; provide locale-aware home/booking links
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: content/root/pages.json
  Verification: 12 regression tests; strict typecheck/syntax lint and all build validators passed. 39 public routes × 5 widths checked in browser, with menu Escape/focus and primary CTA contrast >=4.5:1. Local only; screenshot evidence in batch2. Hours/credentials remain explicitly withheld pending confirmation.

- [x] **X14 — Preserve working routes, contacts, reviews, HTML, sticky bar, video controls and free nonmedical scope** — VERIFIED FIXED

  Audit reference: §26. Area: Preservation.
  Current behavior: Pending source comparison.
  Change: Preserve working routes, contacts, reviews, HTML, sticky bar, video controls and free nonmedical scope
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: AUDIT-COVERAGE.md, scripts/validate-site.mjs, tests/site.test.mjs
  Verification: 42 locale routes retained; 24 complete original live review quotations match; existing phone/WhatsApp, sticky bars and native founder video preserved. robots/_redirects unchanged, confirmation noindex retained, no tracked file deleted. Evidence final/preservation.json and full build validators.

- [ ] **X15 — Confirm analyser identity, suitability/preparation and outputs with operator/manufacturer** — REQUIRES LEGAL/COMPLIANCE REVIEW

  Audit reference: §§20,22.2,22.9; process pages. Area: Device guidance.
  Current behavior: Pending source comparison.
  Change: Confirm analyser identity, suitability/preparation and outputs with operator/manufacturer
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: See LEGAL-COMPLIANCE-REVIEW.md L01–L07 for current exact wording, location, audit concern and decision. Technical fixes do not approve the underlying legal content.

- [ ] **X20 — Approve full referral/sample terms before promoting to members** — REQUIRES LEGAL/COMPLIANCE REVIEW

  Audit reference: §19. Area: Referral conditions.
  Current behavior: Pending source comparison.
  Change: Approve full referral/sample terms before promoting to members
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: See LEGAL-COMPLIANCE-REVIEW.md L01–L07 for current exact wording, location, audit concern and decision. Technical fixes do not approve the underlying legal content.

- [x] **X21 — Visible labels, privacy link, contact validation and separate accepted-enquiry state** — VERIFIED FIXED

  Audit reference: §8; page-by-page business. Area: Partner form.
  Current behavior: Pending source comparison.
  Change: Visible labels, privacy link, contact validation and separate accepted-enquiry state
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: js/partner-form.js, content/ro/pages.json, content/en/pages.json, content/ru/pages.json
  Verification: Batch 3: 16 regression tests and all build checks pass; 3-locale mock booking and partner-browser journeys verify recovery, input retention, success focus, duplicate requests, deduplicated events, blocked storage and no-JavaScript assisted booking. No production submissions.

- [x] **X22 — Replace booked-call and no-form promises with truthful conversation wording** — VERIFIED FIXED

  Audit reference: §23.21–22. Area: Partner copy.
  Current behavior: Pending source comparison.
  Change: Replace booked-call and no-form promises with truthful conversation wording
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [x] **X24 — Keep original quotes and dates; individual links/translated labels where supported** — VERIFIED FIXED

  Audit reference: §11; page-by-page reviews. Area: Review sources.
  Current behavior: Pending source comparison.
  Change: Keep original quotes and dates; individual links/translated labels where supported
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [x] **X25 — Five requested widths, zoom/reflow, keyboard and console checks for affected pages** — VERIFIED FIXED

  Audit reference: §§7,16; implementation request. Area: Responsive QA.
  Current behavior: Pending source comparison.
  Change: Five requested widths, zoom/reflow, keyboard and console checks for affected pages
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: tests/accessibility-browser.mjs, tests/axe-browser.mjs, tests/forms-browser.mjs, tests/site-browser.mjs
  Verification: All 39 content routes × 375/430/768/1366/1440; all 42 locale routes at 320px and 200% root text; confirmation at five widths; keyboard menu/FAQ/table and UTC ICS; no-JS FAQ/booking fallback; no uncaught page errors. Actual hardware and assistive-tech review is separately X26.

- [ ] **X26 — Physical iOS/Android, screen keyboard and screen-reader acceptance** — REQUIRES EXTERNAL ACTION

  Audit reference: Main audit §7 and §16 extended manual acceptance checks. Area: Accessibility / mobile.
  Current behavior: Browser automation on macOS Chromium covers layout, semantics and keyboard; it is not a test on actual mobile hardware or a screen-reader certification.
  Change: Supply a concrete device/assistive-technology acceptance script in E08.
  Expected result: Confirm real touchscreen, virtual keyboard and spoken date/error announcements before publication.
  Files changed: EXTERNAL-ACTIONS.md
  Verification: Automated scope and limitations are explicit. Physical devices/assistive-technology user acceptance remains external.

## P3

- [x] **B39 — Multiple subsets/weights, Cyrillic fallback** — VERIFIED FIXED

  Audit reference: Main audit §27 row 39. Area: Fonts.
  Current behavior: Audit finding pending source comparison.
  Change: Confirm used weights and intentional Cyrillic font metrics before changing files.
  Expected result: Consistent multilingual typography
  Files changed: content/consumer-copy.mjs, content/ro/pages.json, content/en/pages.json, content/ru/pages.json, scripts/build-site.mjs
  Verification: Batch 4B: 17 tests plus strict types, lint and production validators pass. All 39 public page families × 5 widths tested in RO/EN/RU; revised shared process FAQ/reviews retested. Hero and header CTA contrast checked; visual review corrected review-date contrast and Cyrillic/Latin font inconsistency. Current original reviews retained. Offer pricing, qualifications and legal evidence remain separate decisions.

- [x] **B40 — Assets revalidate every request** — VERIFIED FIXED

  Audit reference: Main audit §27 row 40. Area: Caching.
  Current behavior: Audit finding pending source comparison.
  Change: Fingerprint assets then long-cache immutable; keep HTML fresh.
  Expected result: Faster repeat visits
  Files changed: content/responsive-images.json, netlify.toml, tests/assets.test.mjs
  Verification: Immutable one-year cache limited to hashed derivatives. Byte hashes verified automatically; HTML and mutable URLs keep revalidation. Actual CDN headers need post-deployment E01 verification.

- [ ] **B41 — HTTPwww two-hop chain** — REQUIRES EXTERNAL ACTION

  Audit reference: Main audit §27 row 41. Area: Redirects.
  Current behavior: Audit finding pending source comparison.
  Change: Consolidate to one canonical hop when adjusting hosting rules.
  Expected result: Minor crawl/navigation efficiency
  Files changed: None yet.
  Verification: See EXTERNAL-ACTIONS.md E02–E06. Consent-gated analytics contract is tested locally; no provider, external account, message delivery, DNS or attendance workflow was changed.

- [x] **B42 — Contrast 4.41:1** — VERIFIED FIXED

  Audit reference: Main audit §27 row 42. Area: Contact closed tag.
  Current behavior: Audit finding pending source comparison.
  Change: Slightly darken foreground and retest.
  Expected result: Small readability improvement
  Files changed: css/components/inline-utilities.css, tests/axe-browser.mjs, tests/performance-browser.mjs
  Verification: Closed-day label measured 9.06:1. Final axe scan passes all contact locales.

- [x] **B43 — Uniform stale lastmod** — VERIFIED FIXED

  Audit reference: Main audit §27 row 43. Area: Sitemap dates.
  Current behavior: Original behavior recorded in Batch 2 plan of AUDIT-FIX-CHANGELOG.md.
  Change: Use real significant modification dates.
  Expected result: Accurate crawl hints
  Files changed: sitemap.xml
  Verification: 12 regression tests; strict typecheck/syntax lint and all build validators passed. 39 public routes × 5 widths checked in browser, with menu Escape/focus and primary CTA contrast >=4.5:1. Local only; screenshot evidence in batch2. Hours/credentials remain explicitly withheld pending confirmation.

- [ ] **X23 — Remaining decorative repetition, shadows, cards, counters, icons and visual polish after P0** — REQUIRES EXTERNAL ACTION

  Audit reference: §10. Area: Polish.
  Current behavior: Pending source comparison.
  Change: Reduce decorative shadows/cards/icons only after P0 is verified; preserve brand
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: AUDIT-COVERAGE.md, EXTERNAL-ACTIONS.md
  Verification: Functional motion/access fixes and homepage hierarchy are complete. Broad shadow/card/icon/spacing/counter redesign is deliberately unstarted because the user explicitly requires live booking verification first. E01 production restoration is the prerequisite, then carry out the original audit design specification without new business claims.
