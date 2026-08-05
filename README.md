# Adirondack Cold Water

Brand website for **Adirondack Cold Water**, small-batch, solventless **live rosin**.

> **Strong. Clean. Solventless.**

A static site (a home page plus a page per cut). No build tools, no dependencies. Just open it.

## Preview locally

```bash
# any static server works; for example:
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or simply open `index.html` in a browser.

## What's inside

- `index.html` is the home page (inline styles + a small vanilla-JS age gate + mobile nav)
- `cuts/` is the cuts index plus one page per cut, generated from `brand-tokens.json`
- `assets/site.css` / `assets/site.js` are the shared design system and behavior for the cuts pages
- `assets/brand/` holds the logos, textures, and imagery (see `ASSET-MANIFEST.md`)
- `assets/fonts/` holds the self-hosted Playfair Display and Inter web fonts
- `brand-tokens.json` is the source of truth for colors, type, collections, and cut copy
- `tools/generate-cuts.mjs` regenerates the `cuts/` pages from `brand-tokens.json`
- `CLAUDE.md` holds notes for AI assistants / contributors (brand tokens, conventions, compliance)

## Features

- **21+ age gate** scoped to the browser session (`sessionStorage`), shared across every page
- Responsive layout (mobile nav, fluid type)
- Heritage editorial design on a kraft surface with navy ink (per `brand-tokens.json`)
- Home sections: hero, story, values, process, collections, contact
- Per-cut pages with nose / palate / finish as live text, grouped into First Water and Base Camp
- Footer legal line for the New York Office of Cannabis Management. No online sales or ordering

## Regenerating the cuts pages

After editing cut data in `brand-tokens.json`:

```bash
node tools/generate-cuts.mjs
```

This rewrites `cuts/index.html` and the per-cut pages. Commit the result.

## Deploy

Serve the repository root as static files. GitHub Pages (from the default branch
root) works with no configuration.

---

*This site is informational only. Cannabis products are for adults 21+. Not
evaluated by the FDA. Keep out of reach of children and pets.*
