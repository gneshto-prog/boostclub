# Boost Club Audit Implementation

## Summary

Total audit findings: 68 (consolidated; repeated page/copy recommendations are retained in AUDIT-COVERAGE.md)
Fixed: 2
Verified: 1
Remaining: 65
External: 2
Owner decision: 0
Legal review: 0

VERIFIED means verified in the local implementation unless production evidence is explicitly stated. Nothing has been deployed. Production booking restoration is not marked fixed.

## P0

- [ ] **B01 — 503 availability blocks self-booking** — REQUIRES THIRD PARTY

  Audit reference: Main audit §27 row 1. Area: All booking locales/API.
  Current behavior: Production is missing SUPABASE_URL, SUPABASE_SECRET_KEY and GOOGLE_SERVICE_ACCOUNT_JSON; all are preview-only. 503 correlated with production Netlify log.
  Change: Inspect production requestIds/logs, restore upstream calendar availability, test working/closed/full dates.
  Expected result: Restores primary acquisition route
  Files changed: scripts/check-booking-config.mjs, scripts/prepare-site.mjs
  Verification: Root cause verified; local missing-config regression passes. Live restoration needs production env correction and explicitly authorized deployment; E01.

- [x] **B02 — Failed availability leaves no selectable time** — VERIFIED

  Audit reference: Main audit §27 row 2. Area: Booking error state.
  Current behavior: Previously retry-only availability failure; no inline contact path.
  Change: Show truthful failure plus retry/WhatsApp/call; retain inputs and avoid false success.
  Expected result: Recovers affected enquiries
  Files changed: js/booking-slots.js, js/booking-form.js, css/style.css
  Verification: 9 backend tests; 3 locales × 5 widths. Recovery links, no fake slots, retained inputs, focused conflict and archive failure checked in browser.

## P1

- [ ] **B03 — Public repo differs from live booking system** — TODO

  Audit reference: Main audit §27 row 3. Area: Deployment/source.
  Current behavior: Audit finding pending source comparison.
  Change: Locate authoritative commit/config/backend; reconcile before redeploying.
  Expected result: Prevents loss of current functionality
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B04 — Real calendar/CRM success unverified** — REQUIRES THIRD PARTY

  Audit reference: Main audit §27 row 4. Area: Booking/confirmation.
  Current behavior: Local full handler tested with isolated fake CRM/calendar; production configuration missing.
  Change: Run internal end-to-end test per locale; verify persistence, duplicates, conflicts, timezone and partial archive failure.
  Expected result: Reliable appointments and counts
  Files changed: tests/booking.test.mjs, tests/booking-browser.mjs
  Verification: Local creation/replay/conflict/partial-failure tests pass. Real persistence and protected CRM/attendance reconciliation require E01 internal test workflow.

- [ ] **B05 — Pale text on gold 1.38–1.60:1** — TODO

  Audit reference: Main audit §27 row 5. Area: Dark-section buttons.
  Current behavior: Audit finding pending source comparison.
  Change: Set deep-green primary-button text and test every state against 4.5:1.
  Expected result: Readable primary action
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B06 — Wrong metroM3** — TODO

  Audit reference: Main audit §27 row 6. Area: Contact all locales.
  Current behavior: Audit finding pending source comparison.
  Change: Correct toM2; validate route/entrance before precise turns.
  Expected result: Fewer arrival errors
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B07 — Instant and callback promises contradict actual model** — TODO

  Audit reference: Main audit §27 row 7. Area: Booking/home.
  Current behavior: Audit finding pending source comparison.
  Change: Use exact confirmed-slot wording and realistic assisted-response expectations.
  Expected result: Clear expectations
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B08 — Variable hours and mismatched coordinates** — TODO

  Audit reference: Main audit §27 row 8. Area: All NAP blocks/schema.
  Current behavior: Audit finding pending source comparison.
  Change: Verify actual staffed hours/entrance; publish one shared data record.
  Expected result: Reliable local information
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B09 — Paid continuation and products unclear** — TODO

  Audit reference: Main audit §27 row 9. Area: Homepage/process.
  Current behavior: Audit finding pending source comparison.
  Change: Publish actual membership inclusions/costs; explain optional Herbalife purchase relationship near decision.
  Expected result: Informed qualified leads
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B10 — Offer details too late** — TODO

  Audit reference: Main audit §27 row 10. Area: Homepage.
  Current behavior: Audit finding pending source comparison.
  Change: Move assessment deliverables immediately below shorter offer-led hero.
  Expected result: Faster comprehension
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B11 — Secondary business overshadows primary goal** — TODO

  Audit reference: Main audit §27 row 11. Area: Consumer header/home.
  Current behavior: Audit finding pending source comparison.
  Change: Footer-labelled business link; remove full partner billboard; preserve dedicated landing.
  Expected result: Clearer consumer intent
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B12 — Absolute no-third-party promise** — TODO

  Audit reference: Main audit §27 row 12. Area: Forms.
  Current behavior: Audit finding pending source comparison.
  Change: Replace with accurate booking-use summary and privacy link; verify processing inventory.
  Expected result: Truthful data collection
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B13 — Different basis/retention/provider facts** — TODO

  Audit reference: Main audit §27 row 13. Area: Privacy locales.
  Current behavior: Audit finding pending source comparison.
  Change: Approve current factual master and equivalent translations.
  Expected result: Consistent rights information
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B14 — Incorrect Law 53/2003 reference** — TODO

  Audit reference: Main audit §27 row 14. Area: RO terms.
  Current behavior: Audit finding pending source comparison.
  Change: Remove and obtain correct service-scope review.
  Expected result: Removes factual legal error
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B15 — Policy and deployment disagree** — TODO

  Audit reference: Main audit §27 row 15. Area: Storage/cookies.
  Current behavior: Audit finding pending source comparison.
  Change: Audit browser storage/maps/ad IDs, implement required choices and matching policy.
  Expected result: Valid informed choices
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B16 — Hooks without observed destination** — TODO

  Audit reference: Main audit §27 row 16. Area: Analytics.
  Current behavior: Audit finding pending source comparison.
  Change: Configure approved destination and verify events/consent; no personal/health data in analytics.
  Expected result: Usable acquisition evidence
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B17 — Attendance/client outcomes unmeasured** — TODO

  Audit reference: Main audit §27 row 17. Area: CRM/operations.
  Current behavior: Audit finding pending source comparison.
  Change: Add due/attended/cancelled/client statuses and protected lead reconciliation.
  Expected result: Optimise real business outcome
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B18 — Unsubstantiated provenance/context** — TODO

  Audit reference: Main audit §27 row 18. Area: Results/home.
  Current behavior: Audit finding pending source comparison.
  Change: Audit origin/permission; caption every retained image; build 3 real cases.
  Expected result: Credible proof
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B19 — Credential/experience facts insufficiently evidenced** — TODO

  Audit reference: Main audit §27 row 19. Area: Founder claims.
  Current behavior: Audit finding pending source comparison.
  Change: Publish exact verified qualification; source/date material statistics; separate family and personal experience.
  Expected result: Accountable expertise
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B20 — Earnings certainty and selective comparisons** — TODO

  Audit reference: Main audit §27 row 20. Area: Business.
  Current behavior: Audit finding pending source comparison.
  Change: Remove absolute claims/caricature table; show work, cost categories and current-market typical outcomes.
  Expected result: Better informed prospects
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B21 — Tiny English earnings disclosure** — TODO

  Audit reference: Main audit §27 row 21. Area: Business RO/RU.
  Current behavior: Audit finding pending source comparison.
  Change: Translate, enlarge/darken and place beside related claims; validate market document.
  Expected result: Readable disclosure
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B22 — English WhatsApp payloads** — TODO

  Audit reference: Main audit §27 row 22. Area: RU business.
  Current behavior: Audit finding pending source comparison.
  Change: Localise every static and dynamically built message; compose-only test.
  Expected result: Consistent contact journey
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B23 — Insufficient actual-club evidence** — TODO

  Audit reference: Main audit §27 row 23. Area: Homepage/contact.
  Current behavior: Audit finding pending source comparison.
  Change: Photograph entrance, wide room, real assessment and consented daily activity.
  Expected result: Makes visit tangible
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X01 — Publish optional paid continuation and independent Herbalife relationship without inventing prices** — TODO

  Audit reference: §§5,8,22.4,23.14. Area: Offer disclosure.
  Current behavior: Pending source comparison.
  Change: Publish optional paid continuation and independent Herbalife relationship without inventing prices
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X16 — Health-data legal basis, documented consent, retention, withdrawal and access** — TODO

  Audit reference: §19. Area: Sensitive data.
  Current behavior: Pending source comparison.
  Change: Health-data legal basis, documented consent, retention, withdrawal and access
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X17 — Confirm trader identity, service/product terms and processor/transfer inventory** — TODO

  Audit reference: §19. Area: Operator legal facts.
  Current behavior: Pending source comparison.
  Change: Confirm trader identity, service/product terms and processor/transfer inventory
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X18 — Review numerical weight/health claims and permission per image** — TODO

  Audit reference: §19. Area: Results compliance.
  Current behavior: Pending source comparison.
  Change: Review numerical weight/health claims and permission per image
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X19 — Review certainty, expenses, typical earnings, bonuses and market eligibility** — TODO

  Audit reference: §19. Area: Partner earnings compliance.
  Current behavior: Pending source comparison.
  Change: Review certainty, expenses, typical earnings, bonuses and market eligibility
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

## P2

- [ ] **B24 — Conflicting old programme/form** — TODO

  Audit reference: Main audit §27 row 24. Area: Legacy ambassador.
  Current behavior: Audit finding pending source comparison.
  Change: Confirm status; merge and 301 locale URLs to current business; update sitemap.
  Expected result: One coherent partner offer
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B25 — Overlapping biographies** — TODO

  Audit reference: Main audit §27 row 25. Area: Gabi/Gabriel.
  Current behavior: Audit finding pending source comparison.
  Change: Decide distinct social/partner role using traffic/link evidence; otherwise merge with redirects.
  Expected result: Less content drift
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B26 — Referral pitch before membership understanding** — TODO

  Audit reference: Main audit §27 row 26. Area: Home/booking/contact.
  Current behavior: Audit finding pending source comparison.
  Change: Move full incentive to member programme with complete conditions.
  Expected result: Less acquisition distraction
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B27 — Results omission and state/Escape inconsistency** — TODO

  Audit reference: Main audit §27 row 27. Area: Mobile navigation.
  Current behavior: Audit finding pending source comparison.
  Change: Generate same links; synchronise expanded state and close/focus behaviour.
  Expected result: Predictable navigation
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B28 — Keyboard access missing** — TODO

  Audit reference: Main audit §27 row 28. Area: Legal/business scroll regions.
  Current behavior: Audit finding pending source comparison.
  Change: Focusable labelled wrapper or readable reflow; test Safari/keyboard.
  Expected result: Accessible content
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B29 — Captions/transcript absent in markup** — TODO

  Audit reference: Main audit §27 row 29. Area: Founder video.
  Current behavior: Audit finding pending source comparison.
  Change: Add reviewed captions and transcript in available languages.
  Expected result: Accessible founder story
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B30 — Important process/FAQ parity gaps** — TODO

  Audit reference: Main audit §27 row 30. Area: Locale content.
  Current behavior: Audit finding pending source comparison.
  Change: Share key offer/confirmation/continuation facts, then native-edit EN/RU.
  Expected result: Equal service understanding
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B31 — Hardcoded counts repeated** — TODO

  Audit reference: Main audit §27 row 31. Area: Reviews.
  Current behavior: Audit finding pending source comparison.
  Change: Shared rating/count/source/verifiedAt record; monthly review or authorised API sync.
  Expected result: No stale contradictory proof
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B32 — Unsupported WellnessCenter type** — TODO

  Audit reference: Main audit §27 row 32. Area: Schema.
  Current behavior: Audit finding pending source comparison.
  Change: Use truthful valid LocalBusiness type, stable IDs and verified location data.
  Expected result: Machine-readable entity clarity
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B33 — Duplicate 200 homepage on romnutriclub.ro** — TODO

  Audit reference: Main audit §27 row 33. Area: Legacy domain.
  Current behavior: Audit finding pending source comparison.
  Change: If owned/retired,301 mapped paths to Boost; verify alternatives before switch.
  Expected result: Clear domain consolidation
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B34 — Service/brand/process overlap** — TODO

  Audit reference: Main audit §27 row 34. Area: Page targeting.
  Current behavior: Audit finding pending source comparison.
  Change: Use keyword-intent map; refine titles/internal anchors and content roles.
  Expected result: Relevant organic landing paths
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B35 — 960 px thumbnails, `results13.webp`, largest at 156.6 KiB** — TODO

  Audit reference: Main audit §27 row 35. Area: Image gallery.
  Current behavior: Audit finding pending source comparison.
  Change: Add 320/640/960 srcset and accurate sizes/dimensions; retain proof readability.
  Expected result: Lower mobile transfer
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B36 — Large D3/map and locale loading drift** — TODO

  Audit reference: Main audit §27 row 36. Area: Business map.
  Current behavior: Audit finding pending source comparison.
  Change: Use optional country selector; lazy-load map consistently if retained.
  Expected result: Simpler faster interaction
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B37 — Manual template/fact duplication** — TODO

  Audit reference: Main audit §27 row 37. Area: Shared components.
  Current behavior: Audit finding pending source comparison.
  Change: Shared static templates and locale data for nav, hours, proof and legal facts.
  Expected result: Lower future drift
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B38 — Intro/portal and decorative repetition** — TODO

  Audit reference: Main audit §27 row 38. Area: Motion.
  Current behavior: Audit finding pending source comparison.
  Change: Remove entry/transition delay; retain content-visible reduced-motion behaviour.
  Expected result: More direct access
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X02 — Replace exact-measurement language with estimates without adding medical advice** — TODO

  Audit reference: §§9,23.4. Area: BIA wording.
  Current behavior: Pending source comparison.
  Change: Replace exact-measurement language with estimates without adding medical advice
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X03 — Replace judgmental systems paragraph with supportive concrete wording** — TODO

  Audit reference: §§9,23.16. Area: Founder copy.
  Current behavior: Pending source comparison.
  Change: Replace judgmental systems paragraph with supportive concrete wording
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X04 — Date/time first, optional goal, persistent input, accessible submit error, no false success** — FIXED

  Audit reference: §§7,8,16; page-by-page booking. Area: Booking form.
  Current behavior: Date after contact, required goal, alert errors, no provider deadlines or stale-response guard.
  Change: Date/time first, optional goal, persistent input, accessible submit error, no false success
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: js/booking-slots.js, js/booking-form.js, js/lead-pipeline.js, netlify/functions/_shared/upstream.mts, content/ro/pages.json, content/en/pages.json, content/ru/pages.json
  Verification: Backend and five-width browser checks pass. Extended duplicate/date-race/timeout tests still to run.

- [ ] **X05 — Timeouts, stale date races, schema errors, duplicate submit, replay and archive failure** — FIXED

  Audit reference: §8. Area: Booking reliability.
  Current behavior: Date after contact, required goal, alert errors, no provider deadlines or stale-response guard.
  Change: Timeouts, stale date races, schema errors, duplicate submit, replay and archive failure
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: js/booking-slots.js, js/booking-form.js, js/lead-pipeline.js, netlify/functions/_shared/upstream.mts, content/ro/pages.json, content/en/pages.json, content/ru/pages.json
  Verification: Backend and five-width browser checks pass. Extended duplicate/date-race/timeout tests still to run.

- [ ] **X06 — Invalid/expired session, ICS, local place names, modification request wording** — TODO

  Audit reference: §23.25; page-by-page confirmation. Area: Confirmation.
  Current behavior: Pending source comparison.
  Change: Invalid/expired session, ICS, local place names, modification request wording
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X07 — Deliver confirmation and reminders through a verified contact channel** — TODO

  Audit reference: page-by-page confirmation. Area: Durable confirmation.
  Current behavior: Pending source comparison.
  Change: Deliver confirmation and reminders through a verified contact channel
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X08 — Neutral provenance heading and translated-review labels; no fabricated captions** — TODO

  Audit reference: §§17,23.17; page-by-page results. Area: Results copy.
  Current behavior: Pending source comparison.
  Change: Neutral provenance heading and translated-review labels; no fabricated captions
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X09 — Verify listing, categories, holiday hours, photos, appointment link and honest review requests** — TODO

  Audit reference: §13. Area: GBP.
  Current behavior: Pending source comparison.
  Change: Verify listing, categories, holiday hours, photos, appointment link and honest review requests
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X10 — Search Console intent validation and booking/attendance funnel baseline** — TODO

  Audit reference: §§8,12,18. Area: Measurement baseline.
  Current behavior: Pending source comparison.
  Change: Search Console intent validation and booking/attendance funnel baseline
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X11 — Load third-party map only on explicit visitor action with independent directions link** — TODO

  Audit reference: §§15,19. Area: Maps.
  Current behavior: Pending source comparison.
  Change: Load third-party map only on explicit visitor action with independent directions link
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X12 — Shared LocalBusiness/Person IDs and reciprocal locale markup, no review-star claims** — TODO

  Audit reference: §§12–14. Area: Schema entities.
  Current behavior: Pending source comparison.
  Change: Shared LocalBusiness/Person IDs and reciprocal locale markup, no review-star claims
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X13 — Retain proper 404 and noindex; provide locale-aware home/booking links** — TODO

  Audit reference: page-by-page /404.html. Area: 404 recovery.
  Current behavior: Pending source comparison.
  Change: Retain proper 404 and noindex; provide locale-aware home/booking links
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X14 — Preserve working routes, contacts, reviews, HTML, sticky bar, video controls and free nonmedical scope** — TODO

  Audit reference: §26. Area: Preservation.
  Current behavior: Pending source comparison.
  Change: Preserve working routes, contacts, reviews, HTML, sticky bar, video controls and free nonmedical scope
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X15 — Confirm analyser identity, suitability/preparation and outputs with operator/manufacturer** — TODO

  Audit reference: §§20,22.2,22.9; process pages. Area: Device guidance.
  Current behavior: Pending source comparison.
  Change: Confirm analyser identity, suitability/preparation and outputs with operator/manufacturer
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X20 — Approve full referral/sample terms before promoting to members** — TODO

  Audit reference: §19. Area: Referral conditions.
  Current behavior: Pending source comparison.
  Change: Approve full referral/sample terms before promoting to members
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X21 — Visible labels, privacy link, contact validation and separate accepted-enquiry state** — TODO

  Audit reference: §8; page-by-page business. Area: Partner form.
  Current behavior: Pending source comparison.
  Change: Visible labels, privacy link, contact validation and separate accepted-enquiry state
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X22 — Replace booked-call and no-form promises with truthful conversation wording** — TODO

  Audit reference: §23.21–22. Area: Partner copy.
  Current behavior: Pending source comparison.
  Change: Replace booked-call and no-form promises with truthful conversation wording
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X24 — Keep original quotes and dates; individual links/translated labels where supported** — TODO

  Audit reference: §11; page-by-page reviews. Area: Review sources.
  Current behavior: Pending source comparison.
  Change: Keep original quotes and dates; individual links/translated labels where supported
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X25 — Five requested widths, zoom/reflow, keyboard and console checks for affected pages** — TODO

  Audit reference: §§7,16; implementation request. Area: Responsive QA.
  Current behavior: Pending source comparison.
  Change: Five requested widths, zoom/reflow, keyboard and console checks for affected pages
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.

## P3

- [ ] **B39 — Multiple subsets/weights, Cyrillic fallback** — TODO

  Audit reference: Main audit §27 row 39. Area: Fonts.
  Current behavior: Audit finding pending source comparison.
  Change: Confirm used weights and intentional Cyrillic font metrics before changing files.
  Expected result: Consistent multilingual typography
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B40 — Assets revalidate every request** — TODO

  Audit reference: Main audit §27 row 40. Area: Caching.
  Current behavior: Audit finding pending source comparison.
  Change: Fingerprint assets then long-cache immutable; keep HTML fresh.
  Expected result: Faster repeat visits
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B41 — HTTPwww two-hop chain** — TODO

  Audit reference: Main audit §27 row 41. Area: Redirects.
  Current behavior: Audit finding pending source comparison.
  Change: Consolidate to one canonical hop when adjusting hosting rules.
  Expected result: Minor crawl/navigation efficiency
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B42 — Contrast 4.41:1** — TODO

  Audit reference: Main audit §27 row 42. Area: Contact closed tag.
  Current behavior: Audit finding pending source comparison.
  Change: Slightly darken foreground and retest.
  Expected result: Small readability improvement
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **B43 — Uniform stale lastmod** — TODO

  Audit reference: Main audit §27 row 43. Area: Sitemap dates.
  Current behavior: Audit finding pending source comparison.
  Change: Use real significant modification dates.
  Expected result: Accurate crawl hints
  Files changed: None yet.
  Verification: Not yet run.

- [ ] **X23 — Reduce decorative shadows/cards/icons only after P0 is verified; preserve brand** — TODO

  Audit reference: §10. Area: Polish.
  Current behavior: Pending source comparison.
  Change: Reduce decorative shadows/cards/icons only after P0 is verified; preserve brand
  Expected result: Resolve the referenced audit recommendation without unsupported facts.
  Files changed: None yet.
  Verification: Not yet run.
