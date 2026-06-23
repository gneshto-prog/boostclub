# Boost Club — Project Context & Handoff

## Your role
Act as my senior **UX designer, CRO (conversion rate optimization) consultant, Local SEO specialist, Google Business Profile expert, and launch consultant**. I'm Gabriel — non-technical. Read the current files before changing anything, tell me the state, and confirm before destructive actions. Be concise and direct.

## The business
- **Boost Club** — a nutrition / wellness coaching club. Community-first: people with shared goals (weight loss, energy, muscle) who show up regularly and keep their rhythm together.
- **Location:** Strada Sevastopol 24, 010992 București, Sector 1 — a few minutes from Piața Victoriei.
- **Founder:** Gabriel (ISSA-accredited consultant, ~36 years family heritage in the field, ~30,000 social followers). IG reel + TikTok @gabi.neshto + FB gabriel.neshto.
- **Positioning:** free body-composition scan + consultation as the entry offer; WhatsApp-first contact (I reply instantly); membership + an Ambassador/business-opportunity program.
- **Google profile:** "Boost Club", 7 reviews, 5/5, verified. Grand opening posted June 20th (entrance must be booked first).

## Brand identity (DO NOT change)
- Colors: green `#0D5645`, gold `#C9A24B`, plus sage/cream. Font: Poppins. Leaf logo.

## Tech stack
- Static HTML/CSS/JS, no build tools. Single shared `css/style.css` ("v3 ALIVE" design system).
- **Bilingual:** Romanian at root, English under `/en/`. EVERY change must be applied to both RO + EN.
- Hosted on **Netlify** (project slug `resplendent-starlight-5bdd62`), auto-deploys from GitHub repo `gneshto-prog/boostclub` on push to `main`.
- **Deploy workaround:** the mounted `.git` is read-only for some ops, so deploy via a `/tmp` copy: copy repo to `/tmp/bcdeploy`, `git fetch origin`, `git reset --mixed origin/main`, `git add -A`, commit, `git push origin main`.
- **CSS/JS cache-busting:** stylesheet linked as `style.css?v=N`. MUST bump N on every style.css change (currently around v5). Pure HTML copy changes don't need a bump.
- Interactivity via page-scoped inline `<script>` (avoids JS caching). `main.js` handles reveal-on-scroll animations, counters, card tilt, FAQ, mobile menu (reduced-motion aware).

## Site pages (RO root + EN /en/)
- `index.html` — homepage (hero, results teaser, reviews, referral)
- `gabriel.html` — founder story (self-hosted video `videos/gabriel-story.mp4`, poster, "Povestea mea", credibility counters, 5-step timeline, 3-S philosophy)
- `rezultate.html` — Results page (own nav tab; 11-image transformation gallery + 4 pull-quote testimonial cards)
- `cum-functioneaza.html` — How it works (interactive 5-step stepper + animated body-scan infographic)
- `consultatie-gratuita.html` — free consultation booking (WhatsApp-first + form + referral)
- `contact.html`, `ambasador.html` — contact + Ambassador/business-opportunity program
- `recenzii.html` — full reviews page (8 real Google reviews)

## What's been done
- Removed all "private/privat" wording from the SITE (community-first instead).
- WhatsApp-first booking flow (WhatsApp primary, form secondary).
- Real Google reviews placed on homepage + dedicated reviews page (no fabricated reviews — ever).
- Results page built as its own nav tab; long testimonials moved there as pull-quotes.
- Founder story video compressed (4K→720p, ~4.5MB) and self-hosted.
- Interactive how-it-works stepper + scan infographic.
- Referral mechanism added: "bring 2 friends who start a 1-month membership → you get 1 free month"; "bring a friend to a consultation → free sample"; plus a business-opportunity referral on the Ambassador page.
- Hero redesigned and copy de-slopped (see latest hero below).
- Output docs in the working folder (not in repo): Launch Audit, Citations Pack, Attention-Leak Audit, Redesign Plan, Copy Audit.

## Latest homepage hero copy (live)
- **H1 (RO):** "Un club de nutriție în București. Îți atingi obiectivele alături de o comunitate."
- **H1 (EN):** "A nutrition club in Bucharest. Reach your goals alongside a community."
- **Lead (RO):** "Oameni cu aceleași obiective — slăbire, mai multă energie, masă musculară — care vin regulat la club, se susțin și își țin ritmul împreună. Lângă Piața Victoriei."
- **Lead (EN):** "People with the same goals — weight loss, more energy, muscle — who come to the club regularly, support each other and keep their rhythm together. Near Victoria Square."
- Proof row: ISSA accredited consultant · 36 years of family heritage · ~30,000 followers. (Removed "No obligations".)
- Community card kept: "Aceiași oameni, în fiecare dimineață" / "The same faces, every morning".

## ACTIVE BLOCKER — domain / SSL (this is where we stopped)
Goal: make **boostclub.ro** the primary domain. It's stuck and retrying the "Set as primary domain" dialog never works.

Root cause found in Netlify Domain management: the project has 4 domains and 3 are **"Pending DNS verification"** because they still point at the old host, not Netlify:
- `romnutriclub.com` (currently PRIMARY) — pending
- `www.romnutriclub.com` — pending
- `romnutriclub.ro` — pending
- `boostclub.ro` — OK (not pending)

Netlify issues ONE Let's Encrypt cert covering all attached domains. The 3 failing `romnutriclub` domains kill the whole cert ("We could not provision a Let's Encrypt certificate…"), and with no cert, Netlify blocks changing the primary domain. Catch-22.

**Proposed fix (awaiting Gabriel's go-ahead):** remove the 3 stale `romnutriclub.com` / `www.romnutriclub.com` / `romnutriclub.ro` entries from the Netlify project (they're not pointing here so they do nothing today). Then Netlify issues a clean cert for boostclub.ro, and we set boostclub.ro as primary. Re-wire any romnutriclub→boostclub redirect later at the registrar (Rackhost for .ro; .com is Cloudflare-fronted). NOTE: removing domains is an account-settings change — confirm before doing it.

After flipping primary: update the site's canonical tags, `og:url`, and sitemap to boostclub.ro.

## Google Business Profile — state & remaining
- Verified, reviews answered, **services already added by Gabriel.**
- Editing GBP via the Google Search owner overlay was unreliable in-session (the editor panel renders at 0 height / screenshots of heavy Google + Netlify pages time out — a local Chrome rendering quirk; light pages screenshot fine; text/DOM reads work).
- **Still to do on GBP:**
  - Fix business **description** — it still says "hub privat de wellness coaching" (the old "private" wording I removed from the site). Edit profile → Description.
  - Add **Q&A** (6 owner-posted, no products/prices) — see drafts below.
  - Set **booking link** to `https://boostclub.ro/consultatie-gratuita.html`.
  - Swap main photo (shake-cup → the room or me with members).
- GBP rule: **NO products, NO prices shown.**

### Q&A drafts (RO)
1. Unde vă aflați? → "Pe Strada Sevastopol 24, la câteva minute de Piața Victoriei, Sector 1, București."
2. Evaluarea corporală e chiar gratuită? → "Da, complet gratuită și fără obligații. Vii, te măsori, pleci cu o direcție clară."
3. Trebuie să fiu membru ca să vin? → "Nu. Prima vizită și evaluarea sunt deschise oricui — devii membru doar dacă vrei să continui."
4. Ce se întâmplă la prima vizită? → "Faci evaluarea corporală, discutăm obiectivele tale și pleci cu un plan simplu. Durează ~30 de minute."
5. Vorbiți engleză? → "Da, te putem ajuta în română și engleză."
6. Cum mă programez? → "Cel mai rapid pe WhatsApp — răspundem aproape instant. Sau prin formularul de pe boostclub.ro."

## Other pending / backlog
- **Add analytics** (Google Analytics or Plausible) — currently zero measurement; we're optimizing blind.
- **P1 visuals:** real interior/community photos, a body-scan screenshot, separate before/after photos for true sliders.
- **Remaining copy cleanups** (from Copy Audit, inner pages): "Libertate reală, muncă reală"; "Un loc prietenos, nu o clinică"; "Un spațiu unde…" subhead; Herbalife superlatives; shorten reviews disclosure. (I previously scoped to only the picks I approved — these are optional.)
- **Security:** a GitHub personal access token is exposed in the git remote — rotate it.

## Hard rules / constraints
- Apply every site change to BOTH RO (root) and EN (/en/).
- Bump `style.css?v=N` on any CSS change.
- Never fabricate reviews, results, testimonials, or before/afters.
- No medical claims or guaranteed weight-loss claims; "results vary" where relevant.
- GBP: no products, no prices.
- I (Claude) cannot enter passwords/2FA or my CNP (government ID) into forms — Gabriel does those.
- Don't change brand identity (colors/font/logo).
- Confirm before destructive/account-settings actions (e.g., removing Netlify domains).

## Current status (where to resume)
Waiting on Gabriel's yes to remove the 3 stale romnutriclub domains in Netlify so the SSL cert can provision and boostclub.ro can be set as primary. After that: update canonicals/og:url/sitemap to boostclub.ro, then GBP description fix + Q&A, then analytics.
