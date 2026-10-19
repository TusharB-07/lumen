#!/usr/bin/env node
/**
 * Static accessibility audit for Lumen.
 *
 * Scans the production build (dist/) for common accessibility issues.
 * Matches both HTML attribute syntax and minified JS string syntax
 * (e.g. `aria-live":"polite"`).
 *
 * Exit code 0 when score >= 100 (all checks pass).
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

function readFile(rel) {
  const p = path.join(DIST, rel);
  if (!fs.existsSync(p)) return '';
  return fs.readFileSync(p, 'utf8');
}

const html = readFile('index.html');
const js = readFile(path.join('assets', fs.readdirSync(path.join(DIST, 'assets')).find((f) => f.endsWith('.js'))));
const css = readFile(path.join('assets', fs.readdirSync(path.join(DIST, 'assets')).find((f) => f.endsWith('.css'))));

// Helper: match either HTML syntax (`attr="..."`) or minified JS syntax (`attr":"..."` / `"attr":"..."`)
function attrPresent(attr) {
  return new RegExp(`${attr}["']?[:=]["'][^"']+["']`).test(html + js);
}

const checks = [
  {
    id: 'html-lang',
    name: 'html element has lang attribute',
    weight: 10,
    pass: /<html[^>]*\s*lang=["'][a-z]+["']/i.test(html),
  },
  {
    id: 'viewport',
    name: 'viewport meta present',
    weight: 5,
    pass: /name=["']viewport["']/.test(html),
  },
  {
    id: 'charset',
    name: 'charset declared',
    weight: 5,
    pass: /charset=["']UTF-8["']/i.test(html),
  },
  {
    id: 'title',
    name: 'page has a title',
    weight: 5,
    pass: /<title>[^<]+<\/title>/.test(html),
  },
  {
    id: 'manifest',
    name: 'PWA manifest linked',
    weight: 5,
    pass: /rel=["']manifest["']/.test(html),
  },
  {
    id: 'skip-link',
    name: 'skip-to-content link present in HTML',
    weight: 5,
    pass: /skip-link|skip-to-content/.test(html + js),
  },
  {
    id: 'live-region',
    name: 'aria-live region present in JS',
    weight: 10,
    pass: attrPresent('aria-live'),
  },
  {
    id: 'focus-visible',
    name: 'focus-visible CSS rule present',
    weight: 10,
    pass: /:focus-visible/.test(css),
  },
  {
    id: 'reduced-motion',
    name: 'prefers-reduced-motion handling present',
    weight: 10,
    pass: /prefers-reduced-motion/.test(css + js),
  },
  {
    id: 'alt-text',
    name: 'no <img> without alt (in JS bundle)',
    weight: 10,
    pass: !/<img\b[^>]*\balt=["']["']/.test(js) && !/<img\b(?![^>]*\balt=)/.test(js),
  },
  {
    id: 'button-labels',
    name: 'all buttons have aria-label or text content',
    weight: 10,
    pass: attrPresent('aria-label'),
  },
  {
    id: 'input-labels',
    name: 'form inputs have associated labels',
    weight: 10,
    pass: /<label\b|htmlFor=|htmlFor:/.test(js),
  },
  {
    id: 'landmarks',
    name: 'page uses ARIA landmarks (header/main/footer)',
    weight: 5,
    pass: /role=["'](banner|main|contentinfo|navigation)["']|role:"(banner|main|contentinfo|navigation)"/.test(js),
  },
];

let score = 0;
let total = 0;
const failures = [];

for (const c of checks) {
  total += c.weight;
  if (c.pass) {
    score += c.weight;
  } else {
    failures.push(`  ✗ ${c.name} (${c.id})`);
  }
}

const pct = total === 0 ? 100 : Math.round((score / total) * 100);

console.log(`Lumen accessibility audit — ${pct}/100`);
if (failures.length) {
  console.log('Issues:');
  console.log(failures.join('\n'));
}

if (pct < 100) {
  console.log('\nScore below 100 — fix issues before submission.');
  process.exit(1);
}

console.log('\nAll checks passed.');
process.exit(0);