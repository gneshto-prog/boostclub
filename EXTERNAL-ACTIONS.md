# External actions

## E01 — Restore production booking configuration (B01/B04)

Status: REQUIRES THIRD PARTY / REQUIRES EXTERNAL ACTION. Root cause verified; live repair not performed.

1. Open Netlify project resplendent-starlight-5bdd62 → Project configuration → Environment variables.
2. For SUPABASE_URL, SUPABASE_SECRET_KEY and GOOGLE_SERVICE_ACCOUNT_JSON, set the correct existing values in **Production**, retaining Functions scope (and Builds scope for preflight validation). Values currently exist only for Deploy Previews. Keep secrets out of source control and chat. Confirm GOOGLE_CALENDAR_ID identifies the intended calendar.
3. Verify the Google service account has the intended calendar access and the Calendar API is enabled. No wider permissions are needed.
4. After review and explicit deployment authorization, run the production build with production context and deploy the reviewed source. Environment updates require a new deploy. Do not upload the old audit source snapshot or publish the preserved concept routes as a new homepage.
5. Read-only checks: /api/availability?date=2026-09-27, 2026-09-28, 2026-09-29; Saturday 2026-10-03 must be closed. Repeat using current future dates if action is later. Verify genuine slots against calendar/CRM; do not fabricate availability.
6. Use a designated internal test contact and test calendar/database to verify accepted booking, replay, conflict, partial archive failure and attendance handoff in every locale. Never use customer data for tests.
7. Recheck production function logs by requestId, without logging tokens, names, phones or upstream response bodies.

Evidence: production request 01M3F8Z5T07Q0M8FT06R400CSK; Netlify log reports missing Supabase credentials. Read-only service_role occupancy query passed. Google production credential is also missing.

References: [Netlify environment scope/deployment guidance](https://docs.netlify.com/build/functions/environment-variables/), [Supabase server keys](https://supabase.com/docs/guides/getting-started/api-keys).

## E02 — Durable confirmation and actual attendance (B04/B17/X07)

1. Select an approved transactional confirmation channel and sender; the booking form currently collects a phone number, not email.
2. Define delivery consent/legal basis with the reviewer and configure credentials on the server only. Never place a messaging token in browser code.
3. Trigger a single transactional message after successful CRM/calendar reconciliation, keyed by idempotencyKey; retry delivery separately from booking creation.
4. Use designated internal data to verify delivery, reschedule/cancel instructions, duplicates and failed delivery. A delivered message is not attendance.
5. Map CRM booking ID → confirmed → attended/cancelled/no-show with club operations; validate totals and define the reporting owner. Browser events contain none of those identifiers.

## E03 — Approved analytics and consent manager (B16/X10)

1. Owner selects the existing intended property/provider and responsible account; do not create duplicate installations or use an unrelated ID.
2. Reviewer approves the notice/CMP and retention. In the CMP callback call `BoostConsent.update({analytics: true|false, marketing: true|false})` from the user's explicit choices; default is false. Reapply choices on each page from the CMP's approved persistence.
3. After consent, load the approved provider and call `BoostAnalytics.setSink((event, payload) => approvedAdapter(event, payload))`. The interface sends only an allowlisted event name, language and known page path. Do not add names, phones, goals, messages, booking IDs, query strings or WhatsApp text.
4. Test refusal, later grant, withdrawal and revisits. Completion is deduplicated by submission key inside the page. No backfill of events that happened before consent.
5. Verify the 11 requested events in the destination's debugging tools with internal test data. Measure booking completion separately from partner enquiries and CRM attendance. Record at least a representative baseline before claiming conversion lift.

## E04 — Google Business Profile and entrance consistency (B08/X09)

Owner/authorized manager: open the verified GBP; confirm business name/category, actual staffed hours, phone, address, entrance pin and booking URL against O02. Upload approved entrance/interior photos. Add the canonical RO booking URL and relevant attributes only when true. Check mobile directions from Piața Victoriei. Do not create fake reviews or promise ranking improvements.

## E05 — Search Console baseline and sitemap (X10/B43)

Authorized owner: inspect the correct domain property; export 28/90-day performance by page/query/country/device, index coverage, canonicals and inbound links for /gabi and /ambasador before consolidation. After authorized publication, submit https://boostclub.ro/sitemap.xml and inspect changed canonical routes. Keep lastmod tied to significant published content changes; never advance every date on every build.

## E06 — Legacy domain and one-hop canonical routing (B33/B41)

Confirm ownership of romnutriclub.ro and its hosting/DNS first. If it is a true retired mirror, create server-side permanent per-path redirects to equivalent https://boostclub.ro routes, retaining language. Check HTTPS certificate and HTTP/WWW variations. Do not redirect unrelated pages blindly to the homepage. Hostname/HTTP canonicalization is partly Netlify/domain configuration; validate status and Location using read-only requests after authorized changes. Current source route redirects remain intact.

## E07 — Qualification/photo/story/video evidence (B18/B19/B23/B29)

Supply the approved materials described in O04–O08. Video needs a faithful time-aligned transcript, spoken-language captions and reviewed translations; a biography is not an audio transcript. No callable speech-transcription tool was available in this session. Publish VTT tracks only after verifying them against the actual audio. Preserve originals and a permission register outside public assets.
