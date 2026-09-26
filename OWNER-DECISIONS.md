# Owner decisions

These are business facts or permissions, not implementation tasks silently dropped. Refer to the stable finding IDs in IMPLEMENTATION-STATUS.md. Existing claims are not evidence of their truth. No external change or deployment has been authorized so far.

## O01 — Production recovery and publication (B01/B04)

QUESTION: May the existing booking configuration be assigned to Production and the tested booking commit deployed?
CURRENT STATE: Production has no Supabase URL/key or Google service-account value; Deploy Previews does. Booking returns 503. Booking code is recorded in commit 1bb5089; the reviewed branch also reconciles newer live content. Publishing that early commit alone would restore older static reviews, so use the final reviewed branch or extract the booking changes onto verified current production source.
AUDIT RECOMMENDATION: Restore booking before cosmetic work.
OPTIONS: Keep local and have the owner follow E01; authorize the isolated booking deployment after source/config reconciliation.
IMPLICATIONS: Local fixes cannot restore the public service. A deployment changes the live website.
TECHNICAL RECOMMENDATION: Repair Production configuration, verify read-only availability, then test persistence using designated internal data. The in-chat approval question remains pending; elapsed time is not approval.

## O02 — Staffed hours and entrance (B08)

QUESTION: Which weekdays end at 20:00 versus 21:00, and what is the exact public entrance/map pin?
CURRENT STATE: Visible hours say 07:00–20:00/21:00; booking defaults end at 20:00; old schema coordinates 44.4625,26.0832 differ from embedded map 44.449508,26.0856474.
AUDIT RECOMMENDATION: One verified source for NAP, hours, arrival instructions and schema.
OPTIONS: Publish precise hours per weekday; publish regular hours plus explicitly defined appointment-only extensions.
IMPLICATIONS: Changing booking hours affects actual availability. A wrong map pin sends visitors to the wrong location.
TECHNICAL RECOMMENDATION: Confirm with club operations and a street-level entrance photo; then update shared configuration, visible blocks and GBP together. Disputed precise coordinates/hours have been omitted from structured data; address and M1/M2 directions remain.

## O03 — Paid continuation and actual inclusions (B09)

QUESTION: What does continued participation cost, what is included, and which Herbalife purchases are optional or required for each offer?
CURRENT STATE: Free initial assessment is explicit; ongoing club/program/product costs and inclusions are not sufficiently clear.
AUDIT RECOMMENDATION: Explain the club model, optional paid continuation, membership inclusions and an honest price range.
OPTIONS: Publish verified prices/packages; publish an approved explanation of individually priced options and how a quote is provided.
IMPLICATIONS: Pricing is a business decision; invented prices or a blanket claim that all products are optional could misrepresent an offer.
TECHNICAL RECOMMENDATION: Provide an approved offer table with price, frequency, inclusions, cancellation and product relationship. Keep the verified free initial visit and no purchase obligation clear.

## O04 — Credentials and family history (B19)

QUESTION: What exact qualification, issuing body, completion date and permitted scope can be evidenced, and is the family-history start year 1989 verified?
CURRENT STATE: ISSA/accredited/36-year and family-history statements appear in founder and other pages without accessible evidence.
AUDIT RECOMMENDATION: Show verifiable qualifications in plain language; distinguish wellness guidance from regulated clinical care; use a stable year only if evidenced.
OPTIONS: Supply evidence and approved precise wording; remove or narrow unsupported claims after owner review.
IMPLICATIONS: No professional credential, date or medical authority will be invented.
TECHNICAL RECOMMENDATION: Use a consented credential image/link and exact qualification name. Metadata/schema no longer amplify unsupported credentials.

## O05 — Result stories and permission (B18/X18)

QUESTION: Which three stories have permission, reliable duration/context, and approved names/photos for publication in each locale?
CURRENT STATE: Transformation images have limited context; consent, timelines and representativeness cannot be established from code.
AUDIT RECOMMENDATION: Three documented cases with initial situation, duration, routine/support, person’s own words and individual-results caveat; accessible text equivalents.
OPTIONS: Supply complete approved cases; keep a neutral progress gallery while evidence is reviewed; withdraw specific images if permission is absent.
IMPLICATIONS: Do not fabricate outcomes, durations, testimonials or permission. Health/weight information may require additional legal review.
TECHNICAL RECOMMENDATION: Maintain an asset-to-permission register and approved factual captions. Original quotations are preserved.

## O06 — Real club and arrival photographs (B23)

QUESTION: Which original, current photographs can be published with permission?
CURRENT STATE: Seven partner-club photo slots are empty; consumer pages need stronger entrance, interior and consultation context.
AUDIT RECOMMENDATION: Real local imagery rather than stock or generated people.
OPTIONS: Supply selected photos; arrange a short shoot; leave explicit empty states until available.
IMPLICATIONS: No fake venue/customer photographs will be created. Photography can materially change page trust.
TECHNICAL RECOMMENDATION: Entrance/sign, room, assessment setup, founder at work, consented community moments; responsive crops after rights confirmation. Existing useful photos remain.

## O07 — Legacy route strategy (B24/B25)

QUESTION: Does /ambasador still describe a current offer, and should /gabi and /gabriel remain distinct?
CURRENT STATE: All localized routes are live; /program-trainee redirects to /ambasador; /gabi and /gabriel contain different founder/business contexts.
AUDIT RECOMMENDATION: Clarify legacy offer status and consolidate only with traffic/backlink and business evidence.
OPTIONS: Keep distinct current content; mark historical content clearly; approve per-locale 301 redirects to genuinely equivalent pages.
IMPLICATIONS: Blind consolidation could lose search traffic or misrepresent a different offer.
TECHNICAL RECOMMENDATION: Review Search Console landing pages/backlinks and offer ownership first. Existing URLs/redirects remain intact.

## O08 — Founder video captions and transcript (B29)

QUESTION: Is an accurate original transcript available, or may a reviewed transcription/translation be produced?
CURRENT STATE: Founder video has no verified captions/transcript. Written biography is not a transcript of spoken audio.
AUDIT RECOMMENDATION: Accurate captions in the spoken language and reviewed RO/EN/RU text alternatives.
OPTIONS: Supply an approved transcript; authorize transcription and review; replace the video with an approved equivalent text presentation.
IMPLICATIONS: Invented captions would be misleading and inaccessible.
TECHNICAL RECOMMENDATION: Time-aligned WebVTT after listening and human review; use an accessible transcript beside the existing video. Do not mark this complete from a placeholder track.

## O09 — Measurement destination and baseline (B16/B17/X10)

QUESTION: Which analytics property and consent policy should be used, and who owns lead-to-attendance reporting?
CURRENT STATE: Tracking wrappers exist but no verified collection destination or consent setup. CRM attendance reconciliation is not available from public pages.
AUDIT RECOMMENDATION: Consent-respecting events, one destination and baseline by language/source/device; distinguish booking from attendance.
OPTIONS: Approve a GA4 property/CMP; use another approved measurement provider; leave optional analytics disabled.
IMPLICATIONS: Adding an arbitrary ID or firing before consent would be inappropriate. Browser booking confirmation is not an attendance metric.
TECHNICAL RECOMMENDATION: Keep provider disabled until owner/CMP approval, test non-PII event contracts locally, then validate destination and CRM reports with internal test data.

## O10 — Partner commercial strategy and referral offer (B20/B26/X20)

QUESTION: Which partnership model, required costs, eligibility and referral reward terms are current and approved?
CURRENT STATE: Partner/ambassador/referral material contains commercial claims and offer details that cannot be verified from source.
AUDIT RECOMMENDATION: A separate secondary funnel with clear independent-distributor relationship, realistic expectations and referral terms.
OPTIONS: Approve precise current offer; revise with qualified reviewer; retire a specific offer only after an owner decision.
IMPLICATIONS: This is not permission to invent earnings, employment status, rewards or eligibility.
TECHNICAL RECOMMENDATION: Retain access in the footer, present no income guarantee, and publish the reviewed terms beside the relevant action.
