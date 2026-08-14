/* Generate coa/index.html (Lab Results / Certificates of Analysis) from
   _data/coas.json.

   Only entries with published === true render, and only public fields. Staged
   COAs stay in the file hidden. The master lives in _data/, which GitHub Pages
   (Jekyll) does not publish. Do NOT add a .nojekyll file.

   After editing _data/coas.json, run:  node tools/generate-coas.mjs
*/
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = JSON.parse(fs.readFileSync(ROOT + '/_data/coas.json', 'utf8'));
const TOKENS = JSON.parse(fs.readFileSync(ROOT + '/brand-tokens.json', 'utf8'));
const SITE = 'https://adirondackcoldwater.com';
const EMAIL = 'hello@adirondackcoldwater.com';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const collClass = (c) => (c === 'baseCamp' ? 'basecamp' : 'firstwater');
const cutOrder = TOKENS.cuts.map(c => c.name);
const collForCut = (name) => {
  const c = TOKENS.cuts.find(x => x.name === name);
  return c ? c.collection : 'firstWater';
};

// Published only, grouped by cut in brand-tokens order, newest test first.
const published = (DATA.coas || []).filter(c => c.published === true);
const byCut = new Map();
for (const c of published) {
  if (!byCut.has(c.cut)) byCut.set(c.cut, []);
  byCut.get(c.cut).push(c);
}
const groups = cutOrder
  .filter(name => byCut.has(name))
  .map(name => ({
    cut: name,
    coll: collClass(byCut.get(name)[0].collection || collForCut(name)),
    coas: byCut.get(name).slice().sort((a, b) => String(b.tested).localeCompare(String(a.tested))),
  }));
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
        <a href="../find/index.html">Find Us</a>
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
        <a href="../index.html#process">Process</a>
        <a href="../cuts/index.html">Cuts</a>
        <a href="../find/index.html">Find Us</a>
        <a href="index.html">Lab Results</a>
        <a href="../index.html#contact">Contact</a>
        <a href="https://instagram.com/adirondackcoldwater" rel="noopener">Instagram</a>
      </nav>
    </div>
    <div class="wrap legal">
      <p><strong>For adults 21 and over. Keep out of reach of children.</strong> Licensed by the New York State Office of Cannabis Management, OCM-PROC-25-000317.</p>
      <p>&copy; <span id="year">2026</span> Adirondack Cold Water &middot; Outcast Acres Farm LLC, Granville, New York. Strong. Clean. Solventless.</p>
    </div>
  </footer>`;

const viewLink = (c) => {
  const href = c.file ? esc(c.file) : (c.url ? esc(c.url) : '');
  if (!href) return '';
  return `<a class="coa-view" href="${href}" target="_blank" rel="noopener">View COA <span aria-hidden="true">&#8599;</span></a>`;
};

const intro = hasAny
  ? `
        <span class="eyebrow">Lab Results</span>
        <h1 class="cond">Certificates of Analysis</h1>
        <p>Every batch is third-party tested. Find the batch code on your jar label, then look it up below.</p>`
  : `
        <span class="eyebrow">Lab Results</span>
        <h1 class="cond">Certificates of Analysis</h1>
        <p>Every batch is third-party tested. Results are posted here as each batch is released. Check back soon, or ask for the batch COA at your dispensary.</p>`;

const searchBox = hasAny ? `
      <div class="coa-search-wrap">
        <input id="coa-search" type="search" placeholder="Search by batch code (e.g. BOR-2607-A)" aria-label="Search certificates by batch code" autocomplete="off" />
      </div>` : '';

const listHtml = hasAny ? `
    <div class="wrap coa-results">
${groups.map(g => `      <section class="coa-cut" data-cut="${esc(g.cut)}">
        <h3 class="coa-cut-name cond ${g.coll}">${esc(g.cut)}</h3>
        <ul class="coa-list">
${g.coas.map(c => `          <li class="coa-entry" data-batch="${esc(String(c.batch).toLowerCase())}" data-cut="${esc(String(c.cut).toLowerCase())}">
            <div class="coa-id">
              <span class="coa-batch">Batch ${esc(c.batch)}</span>
              ${c.tested ? `<span class="coa-date">Tested ${esc(c.tested)}</span>` : ''}
            </div>
            ${viewLink(c)}
          </li>`).join('\n')}
        </ul>
      </section>`).join('\n')}
      <p id="coa-noresults" class="coa-noresults" hidden>No certificate matches that batch code. Check the code on your jar label.</p>
    </div>` : '';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lab Results | Certificates of Analysis | Adirondack Cold Water</title>
  <meta name="description" content="Certificates of Analysis for Adirondack Cold Water solventless live rosin. Every batch is third-party tested. Look up a batch code from your jar label." />
  <meta name="theme-color" content="#0D1B2A" />
  <link rel="canonical" href="${SITE}/coa/" />
  <link rel="icon" href="../assets/brand/logos/ACW-Favicon.svg" type="image/svg+xml" />
  <link rel="icon" type="image/png" sizes="32x32" href="../assets/brand/logos/ACW-Favicon-32x32.png" />
  <link rel="apple-touch-icon" href="../assets/brand/logos/ACW-Favicon-512x512.png" />
  <meta property="og:title" content="Lab Results | Adirondack Cold Water" />
  <meta property="og:description" content="Every batch third-party tested. Look up a Certificate of Analysis by batch code." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${SITE}/coa/" />
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
      <div class="section-head coa-intro">${intro}
      </div>${searchBox}
    </div>
${listHtml}

    <section class="coa-cta band">
      <div class="wrap contact-inner">
        <span class="eyebrow">Our Standard</span>
        <h2 class="cond">Tested, every batch.</h2>
        <hr class="rule" />
        <p>Solventless means nothing to hide. Questions about a result? Reach out.</p>
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

fs.mkdirSync(ROOT + '/coa', { recursive: true });
fs.writeFileSync(ROOT + '/coa/index.html', html);
console.log('wrote coa/index.html');
console.log('published COAs:', published.length, hasAny ? ('across ' + groups.length + ' cut(s): ' + groups.map(g => g.cut).join(', ')) : '(none, empty state)');
