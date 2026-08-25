# Boost Club — Launch Verification Checklist

Work through this top to bottom. Tick each box as you go.

---

## 1. Deploy to Netlify

- [ ] Go to https://app.netlify.com and log in
- [ ] Open your Boost Club site (currently `resplendent-starlight-5bdd62`)
- [ ] **If deploying by drag & drop:** go to the **Deploys** tab, then drag the entire `boostclub` folder from your Desktop onto the page
- [ ] **If deploying by Git:** commit and push — but first check `git status`; your staging looked unusual earlier (EN files marked deleted). If unsure, use drag & drop, it always works
- [ ] Wait for "Published" status (green)
- [ ] Open the live site and hard-refresh: **Cmd + Shift + R** (Mac)
- [ ] Quick look: new design loads, logo correct, founder photo now visible

### Booking hours: 20:00/21:00 dependent schedule

The booking calendar has no maximum advance-booking horizon. It defaults to a
conservative weekday close of 20:00, then accepts recurring weekday rules and
one-off date changes through the Netlify environment variable
`BOOST_BOOKING_HOURS_JSON`. ISO weekdays are `1` Monday through `7` Sunday.

Example — Mondays and Wednesdays close at 21:00, one exceptional Tuesday also
closes at 21:00, and one date is closed:

```json
{
  "weekday": { "open": "07:00", "close": "20:00" },
  "sunday": { "open": "10:00", "close": "18:00" },
  "byWeekday": {
    "1": { "close": "21:00" },
    "3": { "close": "21:00" }
  },
  "overrides": {
    "2026-09-01": { "close": "21:00" },
    "2026-12-25": { "closed": true }
  }
}
```

After changing this value in **Netlify → Site configuration → Environment
variables**, redeploy so the function uses the new schedule. Only slots returned
by the live calendar can be booked, and the database enforces one active booking
per exact slot even if two people submit at the same moment.

---

## 2. Verify all 4 forms appear in Netlify

Netlify only detects forms during a deploy, so do this right after step 1.

- [ ] In your Netlify site dashboard, click **Forms** in the left menu
- [ ] You should see exactly these 4 form names:
  - [ ] `consultatie`
  - [ ] `consultatie-en`
  - [ ] `ambasador`
  - [ ] `ambasador-en`
- [ ] If any are missing: make sure the latest deploy succeeded, then redeploy. If still missing, tell Claude — do not launch until all 4 appear.

---

## 3. Enable email notifications

So every booking lands in your inbox:

- [ ] In Netlify: **Site configuration → Notifications** (or Forms → Settings → Form notifications)
- [ ] Click **Add notification → Email notification**
- [ ] Event: **New form submission** · Form: `consultatie` · Email: your address
- [ ] Repeat for `consultatie-en`, `ambasador`, `ambasador-en` (4 notifications total)
- [ ] Optional: also add your phone's email-to-SMS or keep the Netlify app installed for push alerts

---

## 4. Test each form (on the LIVE site, not the local files)

**Booking form (RO):**
- [ ] Open `/consultatie-gratuita` on the live site
- [ ] Fill in: Prenume `Test`, your real phone, a future date, one available exact time, and any goal
- [ ] Press **Confirmă rezervarea →**
- [ ] You should reach `/multumim` with the confirmed date and time
- [ ] Check Netlify **Forms → consultatie** — the submission must be listed there
- [ ] Check your email for the notification

**Booking form (EN):** same steps on `/en/consultatie-gratuita` → check form `consultatie-en`

**Ambassador form (RO):** open `/ambasador`, click **Începe part-time** (it should scroll to the form with Part-time pre-selected), fill name + phone, submit → check form `ambasador`

**Ambassador form (EN):** same on `/en/ambasador` → check form `ambasador-en`

- [ ] Delete your test submissions in Netlify afterwards (open each, click Delete) so they don't mix with real leads

> If a form shows an error popup instead of success: the deploy didn't register the form. Redeploy and retest. Do not launch with a failing form.

---

## 5. WhatsApp links

- [ ] On your **phone**, open the live homepage
- [ ] Tap the WhatsApp button in the hero → WhatsApp must open with the message "Bună! Vreau să rezerv o consultație gratuită." pre-filled, to +40 726 205 752
- [ ] Tap the WhatsApp icon in the bottom sticky bar → same result
- [ ] On **desktop**, click the floating green circle (bottom-right) → WhatsApp Web opens with the same message
- [ ] Spot-check one EN page — message should be the English one

---

## 6. Phone links

- [ ] On your phone, tap the phone icon in the bottom sticky bar → dialer opens with **+40 726 205 752**
- [ ] Tap the phone number in the footer → same
- [ ] Tap "Sună: +40 726 205 752" on the booking page sidebar → same

---

## 7. OG image (link preview)

- [ ] Send the live site link to yourself on WhatsApp → the preview should show the green Boost Club card (photo + logo + "Evaluare corporală gratuită")
- [ ] If it shows nothing or an old preview: WhatsApp caches previews. Test with `?v=2` added to the URL, or use https://www.opengraph.xyz and paste your URL to see the fresh preview
- [ ] Note: the OG tags point to `romnutriclub.ro`. **If the site is still on the netlify.app address, previews will not load the image until the real domain is connected** — that's expected, not a bug

---

## 8. Needs GA4 Measurement ID (later)

The site already tracks `whatsapp_click`, `phone_click` and `form_submit` events — they just need somewhere to go.

- [ ] Create a GA4 property at https://analytics.google.com → copy the Measurement ID (looks like `G-XXXXXXXXXX`)
- [ ] Send it to Claude → one snippet gets added to all pages, events start flowing
- [ ] Quick alternative with zero setup: enable **Netlify Analytics** in the dashboard (paid, no cookie banner needed, but no click events)

---

## 9. Still needs real photos (later)

Send these and Claude drops them in (filenames already wired):

**Homepage gallery:**
- [ ] `evaluare-corporala-bioimpedanta-bucuresti.jpg` — body composition test in action
- [ ] `boost-club-interior-sector-1.jpg` — club interior
- [ ] `comunitate-wellness-boost-club.jpg` — community / morning crowd
- [ ] `boost-club-intrare-strada-sevastopol-24.jpg` — entrance (also used on Contact page)
- [ ] `ruta-piata-victoriei-1.jpg` — route from Piața Victoriei (also Contact page)

**About page:**
- [x] `gabriel-antrenament.jpg` — DONE (delivered, compressed, live on the page)
- [x] `gabriel-competitie-atletism.jpg` — DONE (delivered, compressed, live on the page)

**Ambassador page:**
- [ ] `echipa-boost-club.jpg` — team photo

**Also pending (not photos):**
- [ ] Founder video, 45–60 sec, captioned (slot exists on About page)
- [x] Testimonial first names added (Ionuț, Alexandru, Andrei, Alex) — keep their WhatsApp messages as consent proof

---

## Final pre-launch sweep

- [ ] Open every page once on your phone — no broken layouts, no console of red errors (on desktop: right-click → Inspect → Console)
- [ ] Booking flow end-to-end one more time: homepage → "Rezervă consultația gratuită" → form → submit → success → notification email received
- [ ] Connect the real domain `romnutriclub.ro` in Netlify (Site configuration → Domain management) when ready

When every box above is ticked — you're live. 🟢
