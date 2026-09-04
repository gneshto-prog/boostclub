# Boost Club build-system report

Date: 4 September 2026  
Branch: `build-system`  
Clean baseline: `c33b72b`  
Preview deploy: [6a9b352dc93d98127004c36c](https://6a9b352dc93d98127004c36c--resplendent-starlight-5bdd62.netlify.app)  
Deploy logs: [Netlify deploy 6a9b352dc93d98127004c36c](https://app.netlify.com/projects/resplendent-starlight-5bdd62/deploys/6a9b352dc93d98127004c36c)

## Outcome

The 44-page site now builds with plain Node from language content records and shared component renderers. The generated site lives in `_site`, which is ignored by Git and is the only Netlify publish directory. No framework, bundler, or package dependency was added.

The inherited 1 to 3 September work was first preserved on `content-pass-sep3` in commit `492d903`, exactly as requested. `build-system` was then created from clean `main` at `c33b72b`. The content branch was not merged. No branch was pushed, and production was not deployed.

Checkpoint commits before this report:

- `4e3445d` `refactor: add tokenized component build pipeline`
- `52cab01` `test: enforce generated site parity and token policy`
- `789325c` `refactor: remove hand-maintained html pages`
- `a9218e8` `test: verify baseline and inline style parity`

## Build architecture

- `scripts/build-site.mjs` reads source records, renders templates, and copies static assets into `_site`.
- `scripts/prepare-site.mjs` runs the build, parity comparison, and site validation in that order.
- `content/ro/pages.json`, `content/en/pages.json`, `content/ru/pages.json`, and `content/root/pages.json` hold page content separately from the build markup.
- `scripts/lib/components.mjs` owns the document shell plus shared header, navigation, footer, hero, CTA, review, FAQ, and form renderers.
- `content/site.mjs` owns global navigation labels and shared locale strings.
- `netlify.toml` runs `node scripts/prepare-site.mjs` and publishes `_site`.
- The 43 tracked legacy page files were removed after migration. The previously ignored `program-trainee.html` was also migrated into the content source, bringing the generated total to 44.

Deliverable C one-line proof: add one object line to the `navigation` array in `content/site.mjs`. That line carries the RO, EN, and RU label and is rendered in all three language trees.

## Design tokens and extraction counts

| Measure | Before | After |
|---|---:|---:|
| Eligible hardcoded design-value occurrences | 3,541 | 0 in CSS declaration values outside `tokens.css` |
| Unique primitive values | n/a | 464 primitive tokens |
| Semantic aliases | n/a | 99 aliases |
| Total custom properties in the token layer | n/a | 563 |
| Inline style blocks | 36 | 0 |
| Physical lines inside inline style blocks | 2,620 | 0 |
| Extracted style bundles | n/a | 27 deduplicated component sheets |
| Inline style attributes | 294 | 0 |
| Generated inline-style utility classes | n/a | 76 |
| Executable inline scripts | 18 | 0 |
| Deduplicated external component scripts | n/a | 11 |

The brief lists 2,539 inline CSS lines. The extraction audit counts 2,620 physical lines between all `<style>` tags. This is a counting-method discrepancy only; the source count of 36 blocks agrees, every block was extracted, and generated HTML contains no `<style>` block or `style` attribute.

`css/tokens.css` is the single token layer. The validator rejects hardcoded colors, lengths, spacing, font sizes, line heights, radii, shadows, durations, and easing values in CSS declarations outside that file. Numeric media-query thresholds remain literal because standard CSS custom properties are not valid in media-query conditions; this exception is listed under known gaps.

Per-page inline style precedence was preserved deliberately. The 76 generated utility rules use `!important` to match the cascade priority that the original `style` attributes had. Browser comparison confirmed this on the business page.

## Components and dormant scaffolding

The build has one shared renderer for each requested component category: header, footer, navigation, hero, CTA block, review card, FAQ block, and form. Existing page variants remain data-driven so the rendered baseline is unchanged.

`css/scaffolding.css` supplies:

- `.u-scroll-reveal`
- `.u-page-transition`
- `.u-fluid-type`
- `.u-layout-grid`
- reduced-motion overrides

Motion hooks require `data-motion-scaffold="on"` on the root element, and no generated page sets it. The scaffolding therefore ships switched off.

## Validation and runtime checks

`node scripts/prepare-site.mjs` passes with:

- 44 generated pages
- 42 localized public routes
- token policy
- SEO and hreflang checks
- internal-link and referenced-asset checks
- form and compliance checks
- zero inline style blocks, inline style attributes, and executable inline scripts
- seven defined business-photo empty states in each language

Parity compares normalized DOM against clean baseline source. It reads 43 tracked pages directly from `c33b72b`. `program-trainee.html` was ignored and never existed in that commit, so its migration-time baseline hash is used. Normalization permits only the structural refactor: extracted CSS links, extracted component-script links, removed inline style attributes with matching utility classes, and template metadata. Visitor content and ordinary DOM remain part of the hash.

Browser QA results:

- Homepage desktop comparison matched computed styles across 477 body elements; the only DOM identity swap was the expected external stylesheet link in place of the inline style block.
- Business page comparison matched all computed style and geometry fields across 460 body elements.
- Mobile homepage was checked at 390 by 844. The menu opened with one button and updated `aria-expanded`; the FAQ opened and updated `aria-expanded`.
- English and Russian homepage and business smoke tests loaded the correct locale, title, H1, and external styles, with no browser errors.
- The booking form retained its Netlify name, hidden `form-name`, `bot-field`, `requested_start`, POST method, and JavaScript submit contract. No form was submitted during QA.
- On the deploy preview, a future Monday returned 15 bookable time slots and the page reported that an available time could be chosen.
- The deploy preview loaded with zero inline style blocks and no browser errors.

## Parity diff table

| Page | DOM result | Intentional difference or reason |
|---|---|---|
| `index.html` | Equivalent | None |
| `ambasador.html` | Equivalent | None |
| `business.html` | Equivalent | None |
| `confidentialitate.html` | Equivalent | None |
| `consultatie-gratuita.html` | Equivalent | None |
| `contact.html` | Equivalent | None |
| `cookies.html` | Equivalent | None |
| `cum-functioneaza.html` | Equivalent | None |
| `gabi.html` | Equivalent | None |
| `gabriel.html` | Equivalent | None |
| `multumim.html` | Equivalent | None |
| `recenzii.html` | Equivalent | None |
| `rezultate.html` | Equivalent | None |
| `termeni.html` | Equivalent | None |
| `en/index.html` | Equivalent | None |
| `en/ambasador.html` | Equivalent | None |
| `en/business.html` | Equivalent | None |
| `en/confidentialitate.html` | Equivalent | None |
| `en/consultatie-gratuita.html` | Equivalent | None |
| `en/contact.html` | Equivalent | None |
| `en/cookies.html` | Equivalent | None |
| `en/cum-functioneaza.html` | Equivalent | None |
| `en/gabi.html` | Equivalent | None |
| `en/gabriel.html` | Equivalent | None |
| `en/multumim.html` | Equivalent | None |
| `en/recenzii.html` | Equivalent | None |
| `en/rezultate.html` | Equivalent | None |
| `en/termeni.html` | Equivalent | None |
| `ru/index.html` | Equivalent | None |
| `ru/ambasador.html` | Equivalent | None |
| `ru/business.html` | Equivalent | None |
| `ru/confidentialitate.html` | Equivalent | None |
| `ru/consultatie-gratuita.html` | Equivalent | None |
| `ru/contact.html` | Equivalent | None |
| `ru/cookies.html` | Equivalent | None |
| `ru/cum-functioneaza.html` | Equivalent | None |
| `ru/gabi.html` | Equivalent | None |
| `ru/gabriel.html` | Equivalent | None |
| `ru/multumim.html` | Equivalent | None |
| `ru/recenzii.html` | Equivalent | None |
| `ru/rezultate.html` | Equivalent | None |
| `ru/termeni.html` | Equivalent | None |
| `404.html` | Equivalent | None |
| `program-trainee.html` | Equivalent | None |

All 44 rows are equivalent. The structural transformations allowed by the comparison are the requested refactor itself and do not change rendered intent.

## Deploy preview

Preview URL: [https://6a9b352dc93d98127004c36c--resplendent-starlight-5bdd62.netlify.app](https://6a9b352dc93d98127004c36c--resplendent-starlight-5bdd62.netlify.app)

This is deploy ID `6a9b352dc93d98127004c36c` on Netlify site `89a7e4c0-2f1b-4e1c-8c88-b7e829bb04d2`. It was created with `netlify deploy --dir=_site` and no production flag. Production was not touched.

## Parked questions

1. Which Monday to Friday closing time should become canonical: 20:00 or 21:00? The clean baseline visibly contains both the combined 20:00/21:00 wording and 20:00 in structured data. This build preserves that exact disagreement.
2. Should Netlify snippet injection be re-enabled or repaired? Runtime checks on both `https://boostclub.ro` and the deploy preview returned `typeof window.gtag === "undefined"` and no `dataLayer`, even though the brief says GA4 and Google Ads are injected at the edge. No analytics or Consent Mode code was added or changed here.
3. Which source should the morning content review treat as authoritative? During this task, production served the September review count and update note while still requesting `css/style.css?v=13`, whereas the instructed clean Git baseline `c33b72b` contains the earlier review content. This refactor follows `c33b72b` as instructed.

## Known gaps not fixed

- `images/clubs/` still contains only its README. The missing files are `romania.jpg`, `israel.jpg`, `uzbekistan.jpg`, `kazakhstan.jpg`, `mexico.jpg`, `puerto-rico.jpg`, and `usa.jpg`. The seven defined navy empty states remain visible; no images were invented.
- Numeric media-query thresholds remain literal in component CSS because browser CSS cannot resolve custom properties in media-query conditions. All targeted design values inside declarations are tokenized and enforced.
- Netlify edge analytics injection was absent at runtime. This was reported, not modified.
- The clean baseline and current production content no longer fully agree. No attempt was made to merge, cherry-pick, or reconcile the September content pass.
