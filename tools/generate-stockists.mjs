/* Generate find/index.html (Where to Buy) from _data/stockists.json.

   PRIVACY: only entries with published === true are rendered, and only their
   public fields (name, town, address, menu_url). Staged accounts and internal
   fields (last_solventless, acw_since) never reach the output. The master
   lives in _data/, which GitHub Pages (Jekyll) does not publish, so the raw
   file with staged shops is never downloadable. Do NOT add a .nojekyll file.

   After editing _data/stockists.json, run:  node tools/generate-stockists.mjs
*/
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = JSON.parse(fs.readFileSync(ROOT + '/_data/stockists.json', 'utf8'));
const SITE = 'https://adirondackcoldwater.com';
const EMAIL = 'hello@adirondackcoldwater.com';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const directions = (addr) => 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(addr);

// Regions that must never render, regardless of any published flag. "Unknown"
// is a data-cleanup bucket; publishing from it would surface an "Unknown"
// heading. Reassign those accounts to a real region before publishing them.
const NEVER_RENDER = new Set(['unknown', '', 'null', 'undefined']);
const ignored = (name) => NEVER_RENDER.has(String(name == null ? '' : name).trim().toLowerCase());

// Warn (build-time only) if anyone published inside an ignored region.
DATA.regions.filter(r => ignored(r.region)).forEach(r => {
  const pub = (r.stockists || []).filter(s => s.published === true);
  if (pub.length) console.warn(`WARNING: ${pub.length} published shop(s) in never-render region "${r.region}" were skipped. Reassign them to a real region.`);
});

// Published entries only, grouped by region, in the file's region order.
const groups = DATA.regions
  .filter(r => !ignored(r.region))
  .map(r => ({ region: r.region, shops: (r.stockists || []).filter(s => s.published === true) }))
  .filter(g => g.shops.length > 0);
const hasAny = groups.length > 0;

const gate = `
  <div id="age-gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
    <div class="gate-inner">
      <img class="gate-mark" src="../assets/brand/logos/ACW-Logo-Icon-White.png" alt="Adirondack Cold Water" />
      <h1 id="gate-title">Are you 21 or older?</h1>
      <hr class="rule" />
      <p>You must be 21 or older to enter. Adirondack Cold Water is intended for adults 21+.</p>
      <div class="gate-actions">
        <button class="btn" id="gate-yes">Yes, I&rsquo;m 21+</button>
        <a class="btn ghost" href="https://www.samhsa.gov" rel="noopener">No, exit</a>
      </div>
      <div class="gate-note">By entering you confirm you are of legal age in your jurisdiction.</div>
    </div>
  </div>`;

const header = `
  <header>
    <div class="wrap nav">
      <a class="brand" href="../index.html" aria-label="Adirondack Cold Water home">
        <img class="horiz" src="../assets/brand/logos/ACW-Logo-Horizontal-Navy.svg" alt="Adirondack Cold Water" />
        <img class="icon" src="../assets/brand/logos/ACW-Logo-Icon.svg" alt="Adirondack Cold Water" />
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="links" id="nav-links">
        <a href="../index.html#story">Story</a>
        <a href="../index.html#process">Process</a>
        <a href="../cuts/index.html">Cuts</a>
        <a href="index.html">Find Us</a>
        <a href="../coa/index.html">Lab Results</a>
        <a href="../index.html#contact">Contact</a>
      </nav>
    </div>
  </header>`;

const footer = `
  <footer>
    <div class="wrap foot">
      <a class="foot-logo" href="../index.html" aria-label="Adirondack Cold Water home">
        <img src="../assets/brand/logos/ACW-Logo-Primary-White.png" alt="Adirondack Cold Water" />
      </a>
      <nav class="foot-links">
        <a href="../index.html#story">Story</a>
        <a href="../index.html#process">Process</a>
        <a href="../cuts/index.html">Cuts</a>
        <a href="index.html">Find Us</a>
        <a href="../coa/index.html">Lab Results</a>
        <a href="../index.html#contact">Contact</a>
        <a href="https://instagram.com/adirondackcoldwater" rel="noopener">Instagram</a>
      </nav>
    </div>
    <div class="wrap legal">
      <p><strong>For adults 21 and over. Keep out of reach of children.</strong> Licensed by the New York State Office of Cannabis Management, OCM-PROC-25-000317.</p>
      <p>&copy; <span id="year">2026</span> Adirondack Cold Water &middot; Outcast Acres Farm LLC, Granville, New York. Strong. Clean. Solventless.</p>
    </div>
  </footer>`;

// Intro copy differs for the empty state so it reads as intentional.
const intro = hasAny
  ? `
        <span class="eyebrow">Where to Buy</span>
        <h1 class="cond">Ask for Adirondack Cold Water at these New York dispensaries.</h1>
        <p>Availability rotates by drop. It is worth checking the shop&rsquo;s menu before making the trip.</p>`
  : `
        <span class="eyebrow">Where to Buy</span>
        <h1 class="cond">We&rsquo;re rolling out to New York dispensaries now.</h1>
        <p>Ask for Adirondack Cold Water by name at your local shop, or check back here as accounts come online.</p>`;

const regionsHtml = groups.map(g => `
      <section class="region">
        <h2 class="region-name cond">${esc(g.region)}</h2>
        <ul class="shop-list">
${g.shops.map(s => `          <li class="shop">
            <div class="shop-id">
              <span class="shop-name">${esc(s.name)}</span>
              <span class="shop-town">${esc(s.town)}</span>
            </div>
            <div class="shop-links">
              <a href="${esc(directions(s.address))}" target="_blank" rel="noopener">Directions</a>${s.menu_url ? `
              <a class="menu" href="${esc(s.menu_url)}" target="_blank" rel="noopener">Shop menu &#8599;</a>` : ''}
            </div>
          </li>`).join('\n')}
        </ul>
      </section>`).join('\n');

const listBlock = hasAny ? `
    <div class="wrap stockists">
${regionsHtml}
    </div>` : '';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Where to Buy | Adirondack Cold Water Solventless Live Rosin</title>
  <meta name="description" content="Where to find Adirondack Cold Water solventless live rosin. Ask for us by name at New York dispensaries. Availability rotates, so check the shop's menu before your trip." />
  <meta name="theme-color" content="#0D1B2A" />
  <link rel="canonical" href="${SITE}/find/" />
  <link rel="icon" href="../assets/brand/logos/ACW-Favicon.svg" type="image/svg+xml" />
  <link rel="icon" type="image/png" sizes="32x32" href="../assets/brand/logos/ACW-Favicon-32x32.png" />
  <link rel="apple-touch-icon" href="../assets/brand/logos/ACW-Favicon-512x512.png" />
  <meta property="og:title" content="Where to Buy | Adirondack Cold Water" />
  <meta property="og:description" content="Ask for Adirondack Cold Water by name at New York dispensaries." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${SITE}/find/" />
  <meta property="og:image" content="${SITE}/assets/brand/banners/ACW-Web-Banner-1200x628.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${SITE}/assets/brand/banners/ACW-Web-Banner-1200x628.jpg" />
  <link rel="stylesheet" href="../assets/site.css" />
</head>
<body class="locked">
${gate}
${header}
  <main id="top">
    <div class="wrap">
      <div class="section-head find-intro">${intro}
      </div>
    </div>
${listBlock}

    <section class="find-cta band">
      <div class="wrap contact-inner">
        <span class="eyebrow">Carry Us</span>
        <h2 class="cond">Don&rsquo;t see a shop near you?</h2>
        <hr class="rule" />
        <p>Ask your local dispensary to carry Adirondack Cold Water, or reach out about wholesale.</p>
        <div class="hero-cta" style="justify-content:center;">
          <a class="btn" href="mailto:${EMAIL}">Get in Touch</a>
        </div>
        <div class="contact-meta"><a href="mailto:${EMAIL}">${EMAIL}</a></div>
      </div>
    </section>
  </main>
${footer}
  <script src="../assets/site.js"></script>
</body>
</html>
`;

fs.mkdirSync(ROOT + '/find', { recursive: true });
fs.writeFileSync(ROOT + '/find/index.html', html);
console.log('wrote find/index.html');
console.log('published regions rendered:', groups.length, groups.map(g => `${g.region}(${g.shops.length})`).join(', ') || '(none, empty state)');
