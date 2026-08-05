# Adirondack Cold Water

Brand website for **Adirondack Cold Water**, small-batch, solventless **live rosin**.

> **Strong. Clean. Solventless.**

A static, single-page site. No build tools, no dependencies. Just open it.

## Preview locally

```bash
# any static server works; for example:
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or simply open `index.html` in a browser.

## What's inside

- `index.html` contains the whole site (markup, styles, and a small vanilla-JS age gate + mobile nav)
- `assets/brand/` holds the logos, textures, and imagery (see `ASSET-MANIFEST.md`)
- `assets/fonts/` holds the self-hosted Playfair Display and Inter web fonts
- `brand-tokens.json` is the source of truth for colors, type, collections, and cut copy
- `CLAUDE.md` holds notes for AI assistants / contributors (brand tokens, conventions, compliance)

## Features

- **21+ age gate** stored in `localStorage`
- Responsive layout (mobile nav, fluid type)
- Heritage editorial design on a kraft surface with navy ink (per `brand-tokens.json`)
- Sections: hero, story, values, process, collections, contact
- Footer legal line for the New York Office of Cannabis Management. No online sales or ordering

## Deploy

Serve the repository root as static files. GitHub Pages (from the default branch
root) works with no configuration.

---

*This site is informational only. Cannabis products are for adults 21+. Not
evaluated by the FDA. Keep out of reach of children and pets.*
