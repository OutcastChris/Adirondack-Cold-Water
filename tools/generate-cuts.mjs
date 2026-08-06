import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = JSON.parse(fs.readFileSync(ROOT + '/brand-tokens.json', 'utf8'));

const COLL = {
  firstWater: { label: 'First Water', cls: 'firstwater', anchor: 'first-water', tagline: 'Single Source', img: 'ACW-Collection-FirstWater-1600x600.jpg', desc: T.collections.firstWater.description },
  baseCamp:   { label: 'Base Camp',   cls: 'basecamp',   anchor: 'base-camp',   tagline: 'Blends',        img: 'ACW-Collection-BaseCamp-1600x600.jpg',  desc: T.collections.baseCamp.description },
};

const cuts = T.cuts.map(c => {
  const slug = c.name.toLowerCase().replace(/['’]/g, '').replace(/\s+/g, '-');
  const imgName = c.name.replace(/['’\s]/g, '');
  return { ...c, slug, img: `ACW-Cut-${imgName}-1080x1350.jpg`, coll: COLL[c.collection] };
});

const SITE = 'https://adirondackcoldwater.com';

// ---- shared partials (P = path prefix to repo root; for /cuts/ pages it is "../") ----
const gate = (P) => `
  <div id="age-gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
    <div class="gate-inner">
      <img class="gate-mark" src="${P}assets/brand/logos/ACW-Logo-Icon-White.png" alt="Adirondack Cold Water" />
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

const header = (P) => `
  <header>
    <div class="wrap nav">
      <a class="brand" href="${P}index.html" aria-label="Adirondack Cold Water home">
        <img class="horiz" src="${P}assets/brand/logos/ACW-Logo-Horizontal-Navy.svg" alt="Adirondack Cold Water" />
        <img class="icon" src="${P}assets/brand/logos/ACW-Logo-Icon.svg" alt="Adirondack Cold Water" />
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="links" id="nav-links">
        <a href="${P}index.html#story">Story</a>
        <a href="${P}index.html#values">Values</a>
        <a href="${P}index.html#process">Process</a>
        <a href="index.html">Cuts</a>
        <a href="${P}find/index.html">Find Us</a>
        <a href="${P}index.html#contact">Contact</a>
      </nav>
    </div>
  </header>`;

const footer = (P) => `
  <footer>
    <div class="wrap foot">
      <a class="foot-logo" href="${P}index.html" aria-label="Adirondack Cold Water home">
        <img src="${P}assets/brand/logos/ACW-Logo-Primary-White.png" alt="Adirondack Cold Water" />
      </a>
      <nav class="foot-links">
        <a href="${P}index.html#story">Story</a>
        <a href="${P}index.html#process">Process</a>
        <a href="index.html">Cuts</a>
        <a href="${P}find/index.html">Find Us</a>
        <a href="${P}index.html#contact">Contact</a>
        <a href="https://instagram.com/adirondackcoldwater" rel="noopener">Instagram</a>
      </nav>
    </div>
    <div class="wrap legal">
      <p><strong>For adults 21 and over. Keep out of reach of children.</strong> Licensed by the New York State Office of Cannabis Management, OCM-PROC-25-000317.</p>
      <p>&copy; <span id="year">2026</span> Adirondack Cold Water &middot; Outcast Acres Farm LLC, Granville, New York. Strong. Clean. Solventless.</p>
    </div>
  </footer>`;

const headTags = ({ title, desc, canonical, ogImage, ogType = 'website' }) => `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta name="theme-color" content="#0D1B2A" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="../assets/brand/logos/ACW-Favicon.svg" type="image/svg+xml" />
  <link rel="icon" type="image/png" sizes="32x32" href="../assets/brand/logos/ACW-Favicon-32x32.png" />
  <link rel="apple-touch-icon" href="../assets/brand/logos/ACW-Favicon-512x512.png" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${ogImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${ogImage}" />
  <link rel="stylesheet" href="../assets/site.css" />`;

// ---------- cuts/index.html ----------
function buildIndex() {
  const groups = ['firstWater', 'baseCamp'].map(key => {
    const c = COLL[key];
    const tiles = cuts.filter(x => x.collection === key).map(x => `
          <a class="cut-tile" href="${x.slug}.html">
            <img src="../assets/brand/cuts/${x.img}" alt="${x.name}, ${c.label} live rosin" />
            <span class="cut-name">${x.name}</span>
          </a>`).join('');
    return `
    <section id="${c.anchor}">
      <article class="collection-band">
        <img class="band-img" src="../assets/brand/collections/${c.img}" alt="${c.label}, ${c.tagline} rosin" />
        <div class="wrap">
          <div class="collection-copy ${c.cls}">
            <span class="label">${c.label}</span>
            <h3 class="cond">${c.tagline}</h3>
            <p>${c.desc}</p>
          </div>
        </div>
      </article>
      <div class="wrap">
        <div class="cut-grid">${tiles}
        </div>
      </div>
    </section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>${headTags({
    title: 'Cuts | Adirondack Cold Water Solventless Live Rosin',
    desc: 'The Adirondack Cold Water cuts, by collection. First Water single-source rosin and Base Camp blends. Solventless live rosin. Strong. Clean. Solventless.',
    canonical: `${SITE}/cuts/`,
    ogImage: `${SITE}/assets/brand/banners/ACW-Web-Banner-1200x628.jpg`,
  })}
</head>
<body class="locked">
${gate('../')}
${header('../')}
  <main id="top">
    <div class="wrap">
      <div class="section-head" style="padding-top: clamp(40px,6vw,72px);">
        <span class="eyebrow">The Menu</span>
        <h2 class="cond">Our Cuts</h2>
        <p>Small-batch solventless live rosin, organized by collection. Tap a cut for its nose, palate, and finish.</p>
      </div>
    </div>
${groups}
  </main>
${footer('../')}
  <script src="../assets/site.js"></script>
</body>
</html>
`;
}

// ---------- cuts/<slug>.html ----------
function buildCut(cut, i) {
  const c = cut.coll;
  const prev = cuts[(i - 1 + cuts.length) % cuts.length];
  const next = cuts[(i + 1) % cuts.length];
  const title = `${cut.name} | ${c.label} Live Rosin | Adirondack Cold Water`;
  const desc = `${cut.name}. ${c.label} solventless live rosin from Adirondack Cold Water. Nose: ${cut.nose}. Palate: ${cut.palate}. Finish: ${cut.finish}.`;
  return `<!DOCTYPE html>
<html lang="en">
<head>${headTags({
    title,
    desc,
    canonical: `${SITE}/cuts/${cut.slug}.html`,
    ogImage: `${SITE}/assets/brand/cuts/${cut.img}`,
    ogType: 'article',
  })}
</head>
<body class="locked">
${gate('../')}
${header('../')}
  <main id="top">
    <div class="wrap cut-wrap">
      <h1 class="sr-only">${cut.name}, ${c.label} live rosin</h1>
      <div class="cut-body">
        <img class="cut-card-img" src="../assets/brand/cuts/${cut.img}" alt="${cut.name}, ${c.label} live rosin. Nose: ${cut.nose}. Palate: ${cut.palate}. Finish: ${cut.finish}." />
        <div class="notes">
          <div class="note"><span class="k">Nose</span><span class="v">${cut.nose}</span></div>
          <div class="note"><span class="k">Palate</span><span class="v">${cut.palate}</span></div>
          <div class="note"><span class="k">Finish</span><span class="v">${cut.finish}</span></div>
          <p class="about">${c.desc}</p>
        </div>
      </div>
      <nav class="cut-nav">
        <a href="${prev.slug}.html" rel="prev">&larr; ${prev.name}</a>
        <a class="all" href="index.html">All Cuts</a>
        <a href="${next.slug}.html" rel="next">${next.name} &rarr;</a>
      </nav>
    </div>
  </main>
${footer('../')}
  <script src="../assets/site.js"></script>
</body>
</html>
`;
}

// ---- write files ----
fs.mkdirSync(ROOT + '/cuts', { recursive: true });
fs.writeFileSync(ROOT + '/cuts/index.html', buildIndex());
cuts.forEach((cut, i) => fs.writeFileSync(`${ROOT}/cuts/${cut.slug}.html`, buildCut(cut, i)));
console.log('wrote cuts/index.html and', cuts.length, 'cut pages:');
cuts.forEach(c => console.log('  cuts/' + c.slug + '.html  <- ' + c.name + ' (' + c.coll.label + ')  img=' + c.img));
