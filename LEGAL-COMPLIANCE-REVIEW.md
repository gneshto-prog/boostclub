# Legal and compliance review queue

Status for every item below: REQUIRES LEGAL/COMPLIANCE REVIEW. This file records implementation facts and questions, not legal conclusions. Local code improvements do not approve the underlying offers or policies. Review the RO master first, then approve equivalent EN/RU text.

## L01 — Privacy bases, retention and processors (B13/X16/X17)

- Current wording/location: `/confidentialitate` calls booking “Contract / solicitare (art. 6(1)(b))” and retention “12 luni sau până la retragerea consimțământului”; `/en/confidentialitate` calls booking “legitimate interest”. RO says body data are kept for the relationship plus 12 months; EN/RU describe a different duration.
- Why flagged: the translations state different legal bases/retention. RO also says technical data cannot identify a person; that assertion needs correction in the approved master. Actual booking passes through a Netlify Function to Supabase CRM and Google Calendar, with a Netlify Forms archive. Existing processor descriptions omit parts of this flow and differ on geography.
- Decision required: controller's legal identity/contact, appropriate basis per purpose, exact retention/deletion policy, processor/subprocessor inventory, applicable transfer safeguards, and handling of access/deletion requests across all systems. Confirm actual service settings rather than assuming a geographic guarantee.
- Implementation: optional goal is no longer required; form summaries explain booking/enquiry use and link to policy. No new legal basis or transfer conclusion was invented. Existing policy substantive wording remains for review before publication.

## L02 — Health/body data and assessment scope (X15/X16/X17)

- Current wording: RO privacy says body composition is processed with explicit consent “exprimat verbal înainte de evaluare”; device and preparation/contraindication instructions are not evidenced in source.
- Why flagged: the audit asks whether consent records, sensitive-data handling, device limitations and professional scope are adequate. Website code cannot establish these operational facts.
- Decision required: qualified review of consent method/documentation, operator qualification, manufacturer instructions, suitability/contraindications and escalation to a clinician when appropriate.
- Implementation: no diagnosis or new medical advice added. Exact device-specific guidance must come from the device instructions and qualified operator, not invented generic contraindications.

## L03 — Cookies, consent and browser storage (B15/B16)

- Current wording: EN privacy promises consent “via the cookie banner” and “14 months (Google Analytics default)”; all cookie policies describe GA4 and anonymised visitor statistics. No approved destination or banner is present in the audited deployment.
- Why flagged: these factual statements do not match the current implementation. Masking an IP is not a blanket anonymisation conclusion.
- Current local inventory: `boost_booking_confirmation` in sessionStorage contains booking start/end, timezone and saved timestamp, valid for 24 hours in that tab; no customer name/phone. `bc-attribution-v1` is removed by default and only populated after explicit analytics AND marketing consent. No WhatsApp reference is appended. Google map embeds now request Google only after the visitor presses the explicit load button; the separate directions link is an ordinary external navigation. The optional country map uses self-hosted assets. The old intro/portal storage is no longer set by consumer navigation. Optional event adapter is disabled by default and installs no provider, cookie or network request.
- Decision required: approve the final cookie/storage notice and any CMP/provider/retention settings. Remove obsolete banner/GA assertions or implement an approved setup before publishing the policies. Do not call sessionStorage a cookie or assume all storage requires the same legal treatment.
- Implementation: technical consent gating and revocation tests pass. No provider ID copied from unrelated work. See E03 for activation instructions.

## L04 — Earnings, comparisons and independent business opportunity (B20/X19)

- Current wording: RO partner page says “E un venit recurent și crește direct…” and “Aici nu există un plafon…”, while comparison content includes franchise costs over €100,000. RU says “всё зависит только от тебя”. Other country/model scale claims remain unsupported by source evidence.
- Why flagged: these can imply certainty, typical earnings or overly simple comparisons despite a later disclaimer.
- Decision required: substantiation, current Herbalife/company-approved presentation, expenses/risks, typical net outcomes where required, country eligibility, qualifications and no employment ambiguity. Review the entire comparison and related visuals, not only the small print.
- Implementation: partnership remains a secondary footer destination; contact submission is an enquiry, not an appointment. Existing no-guarantee wording and official hrbl.me/STE_WW link preserved. RO/RU translations of the existing attributions disclaimer added and made legible; exact commercial claims were not silently rewritten.

## L05 — Reviews, photographs and result stories (B18/X18/X24)

- Current wording/location: before/after and personal transformations on `/rezultate` and homepage; original named customer quotations on `/recenzii`; “results vary” disclosure.
- Why flagged: source does not establish image/quote consent, dates, duration, typicality or health-data permission.
- Decision required: documented publication permission, approved captions, contextual factors and acceptable claims; retain accurate quotation attribution and original source.
- Implementation: preserve original quotations. Do not manufacture three case studies, client outcomes or permission records. No self-serving aggregate rating markup was added.

## L06 — Referral/ambassador offers (B24/B26/X20)

- Current wording/location: “Adu-ți prietenii — câștigați amândoi”, free month and free sample/reward language in referral sections; historical ambassador/trainee routes.
- Why flagged: eligibility, actual reward, redemption limits, duration, product relationship and full terms are not sufficiently specified.
- Decision required: current offer status and approved promotional terms before improving its prominence. Coordinate owner O07/O10.
- Implementation: preserve the route and current offer record; do not invent expiry dates or rewards. Primary booking should not depend on participation.

## L07 — Incorrect statutory reference (B14)

- Former wording: “Consultație nutrițională clinică în sensul Legii nr. 53/2003 sau al legislației medicale aplicabile” within a list of services the club does not provide.
- Fix: removed the irrelevant statutory reference, retaining “Consultație nutrițională clinică” in that negative list.
- Evidence: [Law 53/2003 is the Romanian Labour Code](https://legislatie.just.ro/Public/DetaliiDocument/128646).
- Remaining decision: reviewer should still approve service-scope wording; the factual citation fix does not validate the whole terms document.
