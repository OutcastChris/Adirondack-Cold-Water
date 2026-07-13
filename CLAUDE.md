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
├── index.html        # The entire site: markup + inline CSS + inline JS
├── assets/
│   └── logo.jpg       # Brand seal ("Adirondack Cold Water — Live Rosin")
├── CLAUDE.md          # This file
└── README.md          # Human-facing overview + how to run/deploy
```

Everything lives in `index.html` on purpose — it keeps the site trivial to host
(GitHub Pages, Netlify, any static host) with zero tooling.

## Brand identity

Pull these from the logo; keep them consistent across any new work.

| Token          | Value       | Use                                  |
| -------------- | ----------- | ------------------------------------ |
| `--ink`        | `#22303d`   | Primary navy (text, dark bands)      |
| `--ink-soft`   | `#35485a`   | Secondary text                       |
| `--cream`      | `#f6f2ea`   | Page background                      |
| `--cream-deep` | `#ece5d8`   | Alternate section background         |
| `--paper`      | `#fbf9f4`   | Cards                                |

- **Display font:** Cinzel (falls back to Cormorant Garamond / Georgia) — used
  for the "COLD WATER" wordmark feel.
- **Serif:** Cormorant Garamond — for elegant body accents and "Live Rosin".
- **Sans:** Inter — for UI, labels, and eyebrows.
- Voice: rugged but clean. North Country / Adirondack, honest, solventless-first.
  Never make medical or health claims.

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
  `sessionStorage` key `acw-age-verified`.
- Keep the **compliance disclaimer** in the footer.
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
