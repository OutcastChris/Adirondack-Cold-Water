# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

The marketing / brand website for **Adirondack Cold Water**, a small-batch,
**solventless live rosin** cannabis brand. Tagline: **Strong. Clean. Solventless.**

It is a static, single-page site with no build step. Open `index.html` in a
browser and it runs.

## Project layout

```
.
├── index.html            # Home page (inline CSS + inline JS)
├── cuts/
│   ├── index.html         # Cuts index, grouped by collection
│   └── <cut>.html         # One page per cut (generated from brand-tokens.json)
├── find/
│   └── index.html         # Where to Buy (generated from _data/stockists.json)
├── coa/
│   └── index.html         # Lab Results / COAs (generated from _data/coas.json)
├── _data/
│   ├── stockists.json     # Stockist master (NOT served by Pages; see below)
│   └── coas.json          # COA master (NOT served by Pages; same rules)
├── assets/
│   ├── site.css           # Shared design system for the cuts + find pages
│   ├── site.js            # Shared age gate + nav for the cuts + find pages
│   ├── fonts/             # Self-hosted Playfair Display + Inter (woff2)
│   └── brand/             # Supplied brand assets. See ASSET-MANIFEST.md
│       ├── logos/  textures/  banners/
│       ├── collections/  cuts/  products/  social/
├── tools/
│   ├── generate-cuts.mjs      # Regenerates cuts/ from brand-tokens.json
│   ├── generate-stockists.mjs # Regenerates find/ from _data/stockists.json
│   └── generate-coas.mjs      # Regenerates coa/ from _data/coas.json
├── brand-tokens.json      # Source of truth: colors, type, collections, cuts
├── ASSET-MANIFEST.md      # What every supplied image is for
├── CLAUDE.md              # This file
└── README.md              # Human-facing overview + how to run/deploy
```

The site is a no-build static site (plain HTML/CSS/JS) hosted on GitHub Pages.
The home page keeps its CSS/JS inline; the `cuts/` pages share `assets/site.css`
and `assets/site.js`. **Cut pages are generated** from `brand-tokens.json` by
`tools/generate-cuts.mjs` and committed as static HTML, so after editing cut data
run `node tools/generate-cuts.mjs` and commit the result. Never bind a tier to a
cut (see below); the generator does not, and hand-edits must not either.

**Assets are production-ready. Do not regenerate, recolor, restyle, filter,
stretch, rotate, or overlay text on any supplied image.** Prefer the SVG logo
wherever it scales.

## Brand identity

Colors, type roles, collections, and all cut copy live in `brand-tokens.json`.
Pull from there rather than retyping. Key tokens (defined as CSS custom
properties in one place in `index.html`):

| Token       | Value       | Use                                                   |
| ----------- | ----------- | ----------------------------------------------------- |
| `--navy`    | `#0D1B2A`   | Primary ink. Body, headings, First Water collection.  |
| `--green`   | `#1F4D2E`   | **Base Camp collection only.** Never body/nav text.   |
| `--kraft`   | `#E6D6B3`   | Page background, always under the paper texture.       |
| `--gold`    | `#B08D4F`   | Hairline rules and small dividers only. Never type/fill.|
| `--black`   | `#111111`   | Footer.                                               |
| `--white`   | `#FFFFFF`   |                                                       |

- **Background:** the kraft texture (`textures/kraft-1600.jpg`, `-800` on mobile)
  is the page surface. Flat `#E6D6B3` with no texture is wrong. Cards use
  `textures/paper-1600.jpg`.
- **Display / secondary / body font:** Playfair Display (a **placeholder** for the
  licensed face, swap via the single `--font-display` variable). Body copy is
  serif by design.
- **Supporting (labels, eyebrows, nav, buttons):** Inter, uppercase, tracked.
- **Design direction:** heritage outdoor goods (Filson, Orvis, Pendleton), not
  cannabis. Editorial, restrained. **No gradients, no drop shadows on artwork,
  no neon, no smoke/leaves/mountains.**
- Voice: rugged but clean. North Country / Adirondack, honest, solventless-first.
  Never make medical, health, or effect claims. Sensory descriptors only.

## Collections & cuts

- **First Water** (navy). Single source, one cultivar per jar.
- **Base Camp** (green), blends. The collection color is the *only* thing
  signalling the difference, so never swap it.
- **Tier** (Full Melt, Private Reserve, Tier 1/2, Blend) is assigned **per batch
  by grading. Never bind a tier to a cut in site copy**. A cut page saying
  "Private Reserve" becomes wrong on the next run.

## Where to Buy (stockists)

`find/index.html` is generated from `_data/stockists.json` by
`tools/generate-stockists.mjs`. Rules baked into the generator:

- **Only `published: true` entries render**, and only their public fields
  (name, town, address, menu_url). Staged accounts and internal fields
  (`last_solventless`, `acw_since`) never reach the output.
- **Privacy:** the master lives in `_data/`, which GitHub Pages (Jekyll)
  does not publish, so the raw file with staged shops is never downloadable.
  **Do not add a `.nojekyll` file** or the master would become public.
- Regions render in file order; a region with no published shops does not
  render. The empty/near-empty state is intentional (list and map omitted).
- **Never show a stockist count.** No prices, inventory, or in-stock claims.
- Menu links (when present) open in a new tab and are the shop's own menu.
- Map is currently omitted (too few pins). Add it only when there are enough
  published shops, and only if it is responsive and does not hijack touch scroll.

To add a shop: set `published: true` (and `acw_since`) in `_data/stockists.json`,
run `node tools/generate-stockists.mjs`, and commit the regenerated `find/`.

## Lab Results (COA)

`coa/index.html` is generated from `_data/coas.json` by
`tools/generate-coas.mjs`. Same pattern as stockists:

- **Only `published: true` entries render.** Certificates are grouped by cut
  (brand-tokens order), newest test date first, with a client-side batch-code
  search (`assets/site.js`).
- Each entry links to **either** a PDF committed under `coa/files/` (`file`) or
  a lab's public result page (`url`), opening in a new tab as the lab's own doc.
- **Do not invent potency figures, batch codes, or test dates.** Only real COAs.
- Empty state is intentional (no list, "posted per batch" copy). A cut with no
  published COAs does not render.
- To add a COA: add an entry to `_data/coas.json` with the cut, batch code, test
  date, and a `file` or `url`; set `published: true`; run
  `node tools/generate-coas.mjs`; commit.

## Conventions

- **No framework, no build.** Plain HTML/CSS/JS. Don't introduce npm, bundlers,
  or a framework without a clear reason.
- CSS lives in the `<style>` block in `index.html`, organized top-to-bottom:
  variables → age gate → header → hero → sections → footer → responsive.
  Reuse the CSS custom properties above instead of hard-coding colors.
- JS is a single vanilla IIFE at the bottom of `index.html`. Keep it dependency-free.
- Responsive breakpoints: `860px` (mobile nav + single-column) and a
  `861–1040px` tweak for the process grid.

## Compliance (read before editing content)

This is a regulated adult-use cannabis brand. When editing copy:

- Keep the **21+ age gate** (`#age-gate`) functional. It gates entry via
  `sessionStorage` key `acw-age-verified` (active only for the current browser
  session; reappears on the next visit).
- Keep the **footer legal line** exactly: "For adults 21 and over. Keep out of
  reach of children. Licensed by the New York State Office of Cannabis
  Management, OCM-PROC-25-000317."
- **Do not** add e-commerce, online ordering, prices, or the ability to buy.
  This is an informational brand site only.
- **Do not** add health, medical, or therapeutic claims.
- Product/menu content is illustrative; treat strain names and availability as
  placeholders unless given real data.

## Running / deploying

No build. To preview locally:

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

Deploy by serving the repo root as static files (GitHub Pages from the default
branch root works out of the box).
