#!/usr/bin/env node
/**
 * CONTRAST GATE
 *
 * Parses the shipped stylesheet and computes WCAG 2.1 ratios for every
 * declared pairing. Exits non-zero on a violation.
 *
 * It reads `app/tokens.css` rather than a duplicated table on purpose: a gate
 * that checks a copy of the values can pass while the values that actually
 * ship drift away from it. This checks what ships.
 *
 * Two sections:
 *   PAIRINGS  — the 25 from the kit's design spec, against the canonical
 *               `--color-*` tokens.
 *   ALIASES   — the repo's older token names, which DD-39 keeps as aliases.
 *               Asserted equal to their canonical counterpart, so an alias
 *               cannot silently drift and leave ~20 components pointing at a
 *               colour nobody measured.
 */

import { readFileSync } from 'node:fs';

const CSS = readFileSync(new URL('../app/tokens.css', import.meta.url), 'utf8');

/** Pull every `--color-x: #hex` from the stylesheet. */
function parseTokens(css) {
  const out = {};
  for (const m of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    out[m[1]] = m[2].toLowerCase();
  }
  return out;
}

const T = parseTokens(CSS);
T.white = '#ffffff'; // not a token; present only as a regression guard

const PAIRS = [
  // body text on every ground
  ['text-primary', 'base', 'normal'],
  ['text-primary', 'surface-1', 'normal'],
  ['text-primary', 'surface-2', 'normal'],
  ['text-secondary', 'base', 'normal'],
  ['text-secondary', 'surface-1', 'normal'],
  ['text-secondary', 'surface-2', 'normal'],
  ['text-muted', 'base', 'normal'],
  ['text-muted', 'surface-1', 'normal'],
  ['text-muted', 'surface-2', 'normal'],

  // ember as text / accent
  ['ember', 'base', 'normal'],
  ['ember', 'surface-1', 'normal'],
  ['ember', 'surface-2', 'normal'],
  ['ember-hot', 'base', 'normal'],
  ['ember-dull', 'base', 'large'],
  ['ember-white', 'base', 'normal'],

  // labels on ember fills — kit DD-3 / DD-30 here
  ['base', 'ember', 'normal'],
  ['base', 'ember-hot', 'normal'],
  ['white', 'ember', 'normal'], // MUST FAIL — regression guard

  // meaningful non-text — kit DD-2 / DD-29 here
  ['ember', 'base', 'nontext'],
  ['ember', 'surface-2', 'nontext'],
  ['rule-strong', 'base', 'none'],

  // status
  ['success', 'base', 'large'],
  ['error', 'base', 'large'],

  // decorative, reported only
  ['rule', 'base', 'none'],
  ['text-disabled', 'base', 'none'],
];

const THRESHOLD = { normal: 4.5, large: 3.0, nontext: 3.0, none: 0 };

/** Pairs asserted to FAIL, so nobody "fixes" them by loosening the palette. */
const MUST_FAIL = new Set(['white/ember']);

/** DD-39 aliases: [aliasToken, canonicalToken] must hold identical values. */
const ALIASES = [
  ['ground', 'base'],
  ['surface', 'surface-1'],
  ['surface-sunk', 'void'],
  ['ink', 'text-primary'],
  ['ink-soft', 'text-secondary'],
  ['muted', 'text-muted'],
  ['forge-void', 'void'],
  ['forge-carbon', 'surface-1'],
  ['forge-steel', 'surface-2'],
  ['forge-ink', 'text-primary'],
  ['forge-ink-soft', 'text-secondary'],
  ['forge-muted', 'text-muted'],
  ['forge-rule', 'rule'],
  ['heat-dull', 'ember-dull'],
  ['heat-ember', 'ember'],
  ['heat-bright', 'ember-hot'],
  ['heat-white', 'ember-white'],
];

function srgbChannel(v) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const h = hex.replace('#', '');
  const R = srgbChannel(parseInt(h.slice(0, 2), 16));
  const G = srgbChannel(parseInt(h.slice(2, 4), 16));
  const B = srgbChannel(parseInt(h.slice(4, 6), 16));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function ratio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

let failures = 0;

console.log('\n  CONTRAST — WCAG 2.1, computed from app/tokens.css');
console.log('  ' + '-'.repeat(62));

for (const [fg, bg, standard] of PAIRS) {
  const fgHex = T[fg];
  const bgHex = T[bg];
  if (!fgHex || !bgHex) {
    console.error(`  MISSING TOKEN  ${fg} on ${bg}`);
    failures++;
    continue;
  }

  const r = ratio(fgHex, bgHex);
  const min = THRESHOLD[standard];
  const key = `${fg}/${bg}`;
  const mustFail = MUST_FAIL.has(key);
  const meets = r >= min;

  let mark;
  if (mustFail) {
    // Inverted: this pair is supposed to be unusable.
    mark = meets ? 'FAIL' : 'ok  ';
    if (meets) {
      failures++;
      console.error(`  FAIL ${key} now passes at ${r.toFixed(2)}:1 — it must not.`);
      continue;
    }
  } else if (standard === 'none') {
    mark = 'note';
  } else {
    mark = meets ? 'ok  ' : 'FAIL';
    if (!meets) failures++;
  }

  const label = mustFail ? `${key} (must fail)` : key;
  console.log(
    `  ${mark} ${label.padEnd(34)} ${r.toFixed(2).padStart(6)}:1  ${standard} (min ${min})`,
  );
}

console.log('\n  ALIAS INTEGRITY (DD-39)');
console.log('  ' + '-'.repeat(62));
let aliasBad = 0;
for (const [alias, canonical] of ALIASES) {
  if (!T[alias] || !T[canonical]) {
    console.error(`  MISSING  ${alias} → ${canonical}`);
    aliasBad++;
    failures++;
    continue;
  }
  if (T[alias] !== T[canonical]) {
    console.error(`  DRIFT    --color-${alias} (${T[alias]}) != --color-${canonical} (${T[canonical]})`);
    aliasBad++;
    failures++;
  }
}
console.log(`  ${ALIASES.length} aliases checked, ${aliasBad} drifted.`);

console.log(`\n  ${PAIRS.length} pairings + ${ALIASES.length} aliases checked, ${failures} failing.\n`);

if (failures > 0) {
  console.error('Contrast gate FAILED.');
  console.error('DESIGN_SPEC §4 sets the floor. Fix the token, do not lower the threshold.');
  process.exit(1);
}
