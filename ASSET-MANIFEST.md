# Adirondack Cold Water - Web Asset Manifest

All paths are relative to the repo root (assets live under `assets/brand/`). Every file is production ready. Do not
regenerate, recolor, restyle or filter any of these images.

## Logos - `assets/brand/logos/`

| File | Use |
| --- | --- |
| ACW-Logo-Primary-Navy.svg / .png | Stacked logo. Hero and footer. Transparent. |
| ACW-Logo-Primary-White.png | Stacked logo on navy or photography only. |
| ACW-Logo-Horizontal-Navy.svg / .png | Header navigation lockup. |
| ACW-Logo-Icon.svg / .png | Drop mark alone. Small sizes, mobile header. |
| ACW-Logo-Icon-White.png | Drop mark on navy. |
| ACW-Logo-Badge.svg / .png | Circular badge. Stamps, section marks. |
| ACW-Favicon.svg, -512x512.png, -32x32.png | Favicon set. |

Prefer the SVG anywhere it will scale. All type in the SVGs is outlined.

## Textures - `assets/brand/textures/`

| File | Use |
| --- | --- |
| kraft-1600.jpg | Page background. Tiles or covers. This is the default page surface. |
| kraft-800.jpg | Mobile background, lighter payload. |
| paper-1600.jpg | Lighter surface for cards and panels. |

The kraft texture is the site background. Flat `#E6D6B3` with no texture is
wrong and reads cheap. Layer content over the texture.

## Banners - `assets/brand/banners/`

| File | Dimensions | Use |
| --- | --- | --- |
| ACW-Web-Banner-1920x600.jpg | 1920x600 | Desktop page header |
| ACW-Web-Banner-Mobile-1080x1920.jpg | 1080x1920 | Mobile header |
| ACW-Web-Banner-1200x628.jpg | 1200x628 | Open graph and Twitter card |
| ACW-Square-1080x1080.jpg | 1080x1080 | Square brand panel |
| ACW-MenuTile-600x600.jpg | 600x600 | Badge tile |

## Collections - `assets/brand/collections/`

| File | Use |
| --- | --- |
| ACW-Collection-FirstWater-1600x600.jpg | First Water section header. Navy. |
| ACW-Collection-BaseCamp-1600x600.jpg | Base Camp section header. Green. |

## Cuts - `assets/brand/cuts/`

Eight 1080x1350 profile cards, one per cut. File name carries the cut name.
Boreas, Colden, GuidesBlend, Marcy, Raquette, Schroon, Skylight, Tupper.
Each card already contains the cut name, collection and the three sensory
lines. Do not overlay text on these.

## Products - `assets/brand/products/`

Three 1080x1350 product cards. These carry a tier badge and are tied to a
specific offering, unlike the cut cards. Use only where the tier is accurate.

## Social - `assets/brand/social/`

Available Now, New Drop, Story. Optional, for a social or news section.

## Training illustrations - `assets/brand/training/`

Navy line engravings on the flat kraft token (`#E6D6B3`), used only by the
staff training page (`training/index.html`). Twelve are planned; the approved
ones live here as 800px and 1600px WebP pairs (`NN-name-800.webp` /
`NN-name-1600.webp`) served via `srcset`. They render **flush on the page** —
no card, border, frame, radius, or shadow — with `mix-blend-mode: darken` so
the kraft paper texture shows through their flat background.

| # | File base | Subject | Status |
| --- | --- | --- | --- |
| 01 | `01-hero` | Water over stones, cover. Upper third open for the logo/title | In place |
| 02 | `02-fresh-frozen` | Walk-in freezer, process step 1 | In place |
| 03 | `03-ice-water-wash` | Wash paddle, process step 2 | Awaiting art |
| 04 | `04-screen-separation` | Nested mesh bags, process step 3 | Awaiting art |
| 05 | `05-freeze-dry` | Vacuum chamber, process step 4 | In place |
| 06 | `06-rosin-press` | Rosin press, process step 5 | In place |
| 07 | `07-two-finishes` | Fresh press and cold cure jars, step 6 | Awaiting art |
| 08 | `08-trichome-cross-section` | Trichome cross section, education | Awaiting art |
| 09 | `09-trichome-field` | Magnified trichome field, education | Awaiting art |
| 10 | `10-protected-culture` | Greenhouse, How We Grow (equal pair with 11) | Awaiting art |
| 11 | `11-outdoor` | Full-season field, How We Grow (equal pair with 10) | Awaiting art |
| 12 | `12-cairn` | Cairn, decorative section marker | Awaiting art |

**Dropping in a newly approved illustration:** run the artist-side
`normalize.py` on the 2048px master first (backgrounds drift per delivery and
must land exactly on `#E6D6B3`), then export the two WebP sizes:

```bash
python3 -c "
from PIL import Image
im = Image.open('NN-name.png').convert('RGB')
for s in (800, 1600):
    im.resize((s, s), Image.LANCZOS).save(f'assets/brand/training/NN-name-{s}.webp', 'WEBP', quality=80, method=6)
"
```

Then uncomment the matching, already-written `<figure>` block in
`training/index.html` (search for the file base name). Missing files degrade
gracefully — slots are commented out until the art exists.
