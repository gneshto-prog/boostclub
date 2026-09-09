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

## Finalist mini-sites

Organic Flow and Cinematic Journey are expanded into complete five-page concept systems. Both now use the exact Boost Club palette from `BOOST-CLUB-BRAND-KIT.md`: brand green, supporting greens, gold, cream, sage, white, ink and slate. The previous blue and orange concept accents are no longer used in either finalist.

| Finalist | Home | Experience | Method | Stories | Visit |
| --- | --- | --- | --- | --- | --- |
| Organic Flow | `/concepts/organic-flow.html` | `/concepts/organic-flow-experience.html` | `/concepts/organic-flow-method.html` | `/concepts/organic-flow-stories.html` | `/concepts/organic-flow-visit.html` |
| Cinematic Journey | `/concepts/cinematic-journey.html` | `/concepts/cinematic-journey-experience.html` | `/concepts/cinematic-journey-method.html` | `/concepts/cinematic-journey-stories.html` | `/concepts/cinematic-journey-visit.html` |

Each finalist includes persistent page tabs, scroll progress, animated visual motifs, responsive layouts, reduced-motion support, free-assessment calls to action, contact information, review content and a visit FAQ.

## Final six

The final selection is available at `/concepts/finalists.html`. It includes two Organic Flow evolutions, two friendlier Morning Club evolutions and two hybrids that combine Morning Club warmth with Organic Flow pacing. All six use the exact Boost Club brand palette.

| No. | Family | Direction | Route |
| --- | --- | --- | --- |
| 01 | Organic Flow | Soft Current | `/concepts/finalist-organic-soft-current.html` |
| 02 | Organic Flow | Botanical Rhythm | `/concepts/finalist-organic-botanical-rhythm.html` |
| 03 | The Morning Club | Sunrise Ritual | `/concepts/finalist-morning-sunrise-ritual.html` |
| 04 | The Morning Club | Neighbourhood Table | `/concepts/finalist-morning-neighbourhood-table.html` |
| 05 | Hybrid | Gentle Momentum | `/concepts/finalist-hybrid-gentle-momentum.html` |
| 06 | Hybrid | The Living Club | `/concepts/finalist-hybrid-living-club.html` |

Each direction is a long-form homepage with persistent section tabs for Welcome, Experience, Method, Stories and Visit. The pages include scroll progress, section-aware navigation, animated art-direction details, pointer depth, responsive layouts and reduced-motion support.

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
