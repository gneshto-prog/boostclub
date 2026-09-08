# Boost Club English homepage concept lab

The concept lab lives at `/concepts/` and is intentionally separate from the current English homepage. Every page uses the existing Boost Club color family, photography, offer and contact paths. The concepts are marked `noindex,nofollow` and are not included in the sitemap.

| No. | Direction | Best when the priority is | Route |
| --- | --- | --- | --- |
| 01 | Kinetic Editorial | A distinctive, fashion-led founder brand | `/concepts/kinetic-editorial.html` |
| 02 | Wellness Observatory | Credibility, assessment data and innovation | `/concepts/wellness-observatory.html` |
| 03 | The Morning Club | Warmth, ritual and community belonging | `/concepts/morning-club.html` |
| 04 | Performance Brutalist | Athletic energy and direct conversion | `/concepts/performance-brutalist.html` |
| 05 | Neo Swiss | Clarity, premium restraint and precision | `/concepts/neo-swiss.html` |
| 06 | Cinematic Journey | Emotion, storytelling and visual immersion | `/concepts/cinematic-journey.html` |
| 07 | Organic Flow | Approachable wellness and gentle interaction | `/concepts/organic-flow.html` |
| 08 | Aurora Glass | A modern, intelligent body-data experience | `/concepts/aurora-glass.html` |
| 09 | The Proof Wall | Social proof, transformations and momentum | `/concepts/proof-wall.html` |
| 10 | Quiet Luxury | Founder authority and high-touch service | `/concepts/quiet-luxury.html` |

## Review method

Choose one primary direction and, if useful, one secondary direction for specific elements. The most useful feedback is:

1. Which concept makes the strongest first impression?
2. Which concept feels most credible for the real Boost Club experience?
3. Which concept would make the intended client book a free assessment?
4. Which individual sections or interactions should survive into the final build?

## Build and validation

Run the standard preparation script. It generates the existing 44 pages, the concept gallery and all ten concept pages, then performs the original parity and site validation plus concept-specific checks.

```sh
node scripts/prepare-site.mjs
```

The source of truth is split between:

- `content/homepage-concepts.mjs` for shared content and concept metadata
- `scripts/lib/homepage-concepts.mjs` for semantic page structures
- `concept-lab/styles.css` for the ten visual systems
- `concept-lab/interactions.js` for reveal, motion and goal-picker behavior
