/**
 * Contrast guard (SPEC §3.3, Phase 1 DoD).
 *
 * Parses app/globals.css and computes real WCAG ratios for every declared
 * text-on-surface pairing, in BOTH themes. Fails the build below threshold.
 *
 * It parses the shipped stylesheet rather than reading a separate palette
 * module on purpose: a guard that checks a copy of the values can pass while
 * the values that actually ship drift. This checks what ships.
 */

import { readFileSync } from 'node:fs';

const CSS = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

const AA_BODY = 4.5; // body text
const AA_LARGE = 3.0; // WCAG 1.4.11 non-text / large text

/**
 * Not a WCAG figure. A separator at 1.34:1 technically passes every
 * accessibility rule and is still invisible — which is part of why the old
 * site read as undifferentiated mush (SPEC §2). This is a design floor.
 */
const VISIBLE_HAIRLINE = 1.5;

/** Text tokens paired with the surfaces they are allowed to sit on. */
const PAIRINGS = [
  ['ink', 'ground', AA_BODY],
  ['ink', 'surface', AA_BODY],
  ['ink-soft', 'ground', AA_BODY],
  ['ink-soft', 'surface', AA_BODY],
  ['muted', 'ground', AA_BODY],
  ['muted', 'surface', AA_BODY],
  ['ember', 'ground', AA_BODY],
  ['ember', 'surface', AA_BODY],
  ['steel', 'ground', AA_BODY],
  ['steel', 'surface', AA_BODY],
  // Non-text. WCAG 1.4.11 requires 3:1 for boundaries that identify a
  // *control*; a decorative separator is exempt. The two are split into
  // separate tokens so the exemption can't quietly cover a button border.
  ['rule-strong', 'ground', AA_LARGE],
  ['rule-strong', 'surface', AA_LARGE],
  ['rule', 'ground', VISIBLE_HAIRLINE],
];

function extractBlock(startPattern) {
  const i = CSS.indexOf(startPattern);
  if (i === -1) throw new Error(`Could not find block: ${startPattern}`);
  const open = CSS.indexOf('{', i);
  let depth = 0;
  for (let j = open; j < CSS.length; j++) {
    if (CSS[j] === '{') depth++;
    else if (CSS[j] === '}') {
      depth--;
      if (depth === 0) return CSS.slice(open + 1, j);
    }
  }
  throw new Error(`Unbalanced braces after: ${startPattern}`);
}

function parseTokens(block) {
  const out = {};
  for (const m of block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    out[m[1]] = m[2];
  }
  return out;
}

function srgbToLinear(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function ratio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// `:root {` is the light block; `:root[data-theme='dark'] {` is dark.
const light = parseTokens(extractBlock(':root {'));
const dark = parseTokens(extractBlock(":root[data-theme='dark'] {"));

let failures = 0;
let checks = 0;

for (const [themeName, tokens] of [
  ['LIGHT', light],
  ['DARK', dark],
]) {
  console.log(`\n  ${themeName}`);
  console.log('  ' + '-'.repeat(46));
  for (const [fg, bg, min] of PAIRINGS) {
    const fgHex = tokens[fg];
    const bgHex = tokens[bg];
    if (!fgHex || !bgHex) {
      console.log(`  MISSING TOKEN  ${fg} on ${bg}`);
      failures++;
      continue;
    }
    const r = ratio(fgHex, bgHex);
    checks++;
    const pass = r >= min;
    if (!pass) failures++;
    const mark = pass ? 'ok  ' : 'FAIL';
    console.log(
      `  ${mark} ${fg.padEnd(9)} on ${bg.padEnd(13)} ${r.toFixed(2).padStart(6)}:1  (min ${min})`,
    );
  }
}

console.log(`\n  ${checks} pairings checked, ${failures} failing.\n`);

if (failures > 0) {
  console.error(`Contrast guard FAILED: ${failures} pairing(s) below threshold.`);
  console.error('SPEC §3.3 sets the floor. Fix the token, do not lower the threshold.');
  process.exit(1);
}
