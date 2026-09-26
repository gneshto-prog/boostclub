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
