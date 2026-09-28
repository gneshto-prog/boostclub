# Transformation gallery release status — 2026-09-28

Branch: `codex/audit-implementation-2026-09-26`. Starting commit: `9d6641d`.

## Implemented locally

- Replaced the results galleries in Romanian, English and Russian with all 54 approved finished cards from `~/Desktop/Boost Club Results Wall/cards/`, in filename order. Read the README in the parent Results Wall folder first.
- Imported A01–A07/A11–A17, B01–B06/B08–B12, C01–C07, D01–D15/D17–D19 and E01/E02/E04/E05. No A08, A09, B07, D16, E03, E06 or unprocessed results10/A10 added.
- Used the existing Pillow image pipeline to create 480/800/1200 WebP versions, at quality 90, with content hashes. All 54 source PNG hashes still match the import manifest. No retouching, AI generation, cropping, artwork translation or other artwork edits.
- Uniform square cards: one column below 700px, two from 700px, three from 1000px. Only the first card is eager; all subsequent cards use native lazy loading, including the visible first-row cards on larger screens. Full-card links open the 1200px version.
- Used the owner's exact RO/EN/RU introduction, neutral localized “Transformations” headings, and numbered before/after alt text without names. Updated result-page metadata too.
- Kept the results-vary disclaimer below each gallery. Changed only its attribution from members to people in the wider community.
- Homepage result previews now show the first three approved cards with the same community wording. Corrected stale member attribution in the preserved concept templates and replaced their old held-back results9 reference with the existing results8 image. The separate customer quotations remain unchanged.

The 162 WebP files total 10,523,890 bytes: 1,542,342 at 480px, 3,271,016 at 800px and 5,710,532 at 1200px. These are asset totals, not a page-speed measurement; browsers select a responsive size and lazy-load the gallery.

## Verification

- Full production-artifact build: 44 pages, 16 concept pages and seven Soft Current pages. DOM parity, HTML/CSS token policy, SEO, forms and concept validators pass.
- Syntax lint: 55 scripts. Strict TypeScript check passes.
- Full automated test suite: 21/21 pass, including two gallery tests for the approved set, uniqueness, hashes, localized copy, numbering, responsive markup, lazy loading and the retained disclaimer.
- RO/EN/RU at 375/768/1440px: 54 cards each, 1/2/3 columns, equal square dimensions and no horizontal overflow. Scrolled through all 54 images: all loaded; no broken images or console errors/warnings observed.
- Desktop and phone screenshots plus browser results saved in `/Users/Gabi/boostclub-transformation-gallery-2026-09-28/`.

## Booking gate: failed, deployment withheld

Started the actual local Netlify runtime on port 8888, serving the built site and the branch's `availability` and `lead` functions with `--context production`. No mocked route responses were used for this check.

All three booking pages requested actual availability for 2026-09-28. The availability function returned HTTP 503 and logged `Supabase server credentials are not configured`:

| Language | Request ID | Result |
| --- | --- | --- |
| RO | `01M3K4ZNNXQHGAWPQ9TMFQ5MZD` | No slots; localized recovery shown |
| EN | `01M3K50N62JDKPD46RWF5XA2MK` | No slots; localized recovery shown |
| RU | `01M3K50NB5KJZ1HYFFXHTQVMH3` | No slots; localized recovery shown |

The form therefore cannot proceed to the lead function or a real confirmation screen. The automated successful-booking tests use simulated providers and do not satisfy the owner's real-booking deployment condition. No booking was created. Internal test contact details and permission to release test slots were requested but not supplied during this run.

Restore valid production booking configuration in Netlify (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `GOOGLE_CALENDAR_ID`; Functions scope and Builds scope for preflight), then rerun the three real form-to-confirmation journeys using the designated internal test contact. Keep secret values out of chat and source control.

### Configuration follow-up — 28 Sep

- Restored the existing Deploy Preview `SUPABASE_URL` and `GOOGLE_CALENDAR_ID` values to Production, preserving their existing scopes. Verified the calendar against the connected owner's primary calendar and existing Boost Club booking events before the successful calendar update.
- Read back the Netlify environment configuration: those two Production values are present; `SUPABASE_SECRET_KEY` and `GOOGLE_SERVICE_ACCOUNT_JSON` remain empty in Production. Existing Deploy Preview values remain present, and secrets remain marked secret. No masked value was copied as a credential.
- At the owner's request, consulted Claude in a separate conversation, “BoostClub booking credentials audit.” Its non-secret findings are saved at `/Users/Gabi/Desktop/boostclub-booking-credential-handoff.md`. Neither lookup found an original service-account JSON or a relevant PEM private key in the checked local locations. No secret values were shared in either chat.
- Located the existing Google service account `website-lead-calendar@boost-club-calendar-leads.iam.gserviceaccount.com` in project `boost-club-calendar-leads`. Its active key is marked uploaded/user-provided, created 24 Aug. Prepared the JSON key-creation dialog for the owner; no key has been created, removed, or rotated, and no permissions have changed.
- The Supabase dashboard redirects to GitHub sign-in. The connected Supabase tools can inspect the project but do not expose its server key. Owner sign-in is required to retrieve that existing key.
- No further real booking attempt can pass until the two credentials are available. No customer or booking records were changed during this configuration follow-up.

**Nothing was deployed or pushed.** The full branch remains local. A later whole-branch deployment would include the earlier booking recovery, SEO/navigation, accessible forms, consent handling, reconciled live reviews, consumer copy/hierarchy, responsive assets/deferred maps, owner-photo gallery and community homepage work, as well as this transformation gallery. It must be reported as that full release, not as a gallery-only deployment.
