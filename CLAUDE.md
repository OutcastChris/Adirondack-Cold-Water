# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

The marketing / brand website for **Adirondack Cold Water** — a small-batch,
**solventless live rosin** cannabis brand. Tagline: **Strong. Clean. Solventless.**

It is a static, single-page site with no build step. Open `index.html` in a
browser and it runs.

## Project layout

```
.
├── index.html          # Home page: markup + inline CSS + inline JS
├── assets/
│   └── brand/           # Supplied brand assets — see ASSET-MANIFEST.md
│       ├── logos/  textures/  banners/
│       ├── collections/  cuts/  products/  social/
├── brand-tokens.json    # Source of truth: colors, type, collections, cuts
├── ASSET-MANIFEST.md    # What every supplied image is for
├── CLAUDE.md            # This file
└── README.md            # Human-facing overview + how to run/deploy
```

The site is a no-build static site (plain HTML/CSS/JS) hosted on GitHub Pages.
Per-cut pages under `cuts/` are planned (Phase 2) as separate static HTML files.

**Assets are production-ready. Do not regenerate, recolor, restyle, filter,
stretch, rotate, or overlay text on any supplied image.** Prefer the SVG logo
wherever it scales.

## Brand identity

Colors, type roles, collections, and all cut copy live in `brand-tokens.json` —
pull from there rather than retyping. Key tokens (defined as CSS custom
properties in one place in `index.html`):

| Token       | Value       | Use                                                   |
| ----------- | ----------- | ----------------------------------------------------- |
| `--navy`    | `#0D1B2A`   | Primary ink. Body, headings, First Water collection.  |
| `--green`   | `#1F4D2E`   | **Base Camp collection only.** Never body/nav text.   |
| `--kraft`   | `#E6D6B3`   | Page background — always under the paper texture.      |
| `--gold`    | `#B08D4F`   | Hairline rules and small dividers only. Never type/fill.|
| `--black`   | `#111111`   | Footer.                                               |
| `--white`   | `#FFFFFF`   |                                                       |

- **Background:** the kraft texture (`textures/kraft-1600.jpg`, `-800` on mobile)
  is the page surface. Flat `#E6D6B3` with no texture is wrong. Cards use
  `textures/paper-1600.jpg`.
- **Display / secondary / body font:** Playfair Display (a **placeholder** for the
  licensed face — swap via the single `--font-display` variable). Body copy is
  serif by design.
- **Supporting (labels, eyebrows, nav, buttons):** Inter, uppercase, tracked.
- **Design direction:** heritage outdoor goods (Filson, Orvis, Pendleton), not
  cannabis. Editorial, restrained. **No gradients, no drop shadows on artwork,
  no neon, no smoke/leaves/mountains.**
- Voice: rugged but clean. North Country / Adirondack, honest, solventless-first.
  Never make medical, health, or effect claims — sensory descriptors only.

## Collections & cuts

- **First Water** (navy) — single source, one cultivar per jar.
- **Base Camp** (green) — blends. The collection color is the *only* thing
  signalling the difference, so never swap it.
- **Tier** (Full Melt, Private Reserve, Tier 1/2, Blend) is assigned **per batch
  by grading. Never bind a tier to a cut in site copy** — a cut page saying
  "Private Reserve" becomes wrong on the next run.

## Conventions

- **No framework, no build.** Plain HTML/CSS/JS. Don't introduce npm, bundlers,
  or a framework without a clear reason.
- CSS lives in the `<style>` block in `index.html`, organized top-to-bottom:
  variables → age gate → header → hero → sections → footer → responsive.
  Reuse the CSS custom properties above instead of hard-coding colors.
- JS is a single vanilla IIFE at the bottom of `index.html`. Keep it dependency-free.
- Responsive breakpoints: `860px` (mobile nav + single-column) and a
  `861–1040px` tweak for the process grid.

## Compliance — read before editing content

This is a regulated adult-use cannabis brand. When editing copy:

- Keep the **21+ age gate** (`#age-gate`) functional. It gates entry via
  `localStorage` key `acw-age-verified`.
- Keep the **footer legal line** exactly: "For adults 21 and over. Keep out of
  reach of children. Licensed by the New York State Office of Cannabis
  Management, OCM-PROC-25-000317."
- **Do not** add e-commerce, online ordering, prices, or the ability to buy —
  this is an informational brand site only.
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
