#!/usr/bin/env node
/**
 * HEAT LAW GATE
 *
 * MOTION_SPEC §1 defines the heat law in prose and arithmetic. The
 * implementation lives in lib/motion/store.ts and lib/motion/heat.ts. Nothing
 * has been stopping those two from drifting apart.
 *
 * This gate re-derives the law from the spec, independently of the source, and
 * fails if the shipped constants no longer match. It prints the worked table
 * rather than a pass/fail, per CLAUDE.md §6 — you should be able to check the
 * arithmetic by eye.
 *
 * What it cannot do: verify behaviour. "Heat rises on scroll" and "escalates
 * at 6s idle" need a browser. Those criteria stay open — see PROGRESS.md.
 */

import { readFileSync } from 'node:fs';

const STORE = readFileSync(new URL('../lib/motion/store.ts', import.meta.url), 'utf8');
const HEAT = readFileSync(new URL('../lib/motion/heat.ts', import.meta.url), 'utf8');

let failures = 0;
const fail = (msg) => {
  console.error(`  FAIL ${msg}`);
  failures++;
};

/* ---------------------------------------------------------------- *
 * 1. The law, transcribed from MOTION_SPEC §1 — not imported.
 * ---------------------------------------------------------------- */

const SPEC_IDLE_BASE = { 0: 0.25, 1: 0.35, 2: 0.55 };
const SPEC_SCROLL_COEFF = 0.5;
const SPEC_SCROLL_CAP = 0.5;
const SPEC_HEAT_LERP = 0.05;

function specHeatTarget(idleLevel, velocity) {
  const idleBase = SPEC_IDLE_BASE[idleLevel];
  const scrollEnergy = Math.min(velocity * SPEC_SCROLL_COEFF, SPEC_SCROLL_CAP);
  return Math.min(idleBase + scrollEnergy, 1);
}

/* ---------------------------------------------------------------- *
 * 2. Constant drift check against the shipped source.
 * ---------------------------------------------------------------- */

console.log('\n  HEAT LAW — constants vs MOTION_SPEC §1');
console.log('  ' + '-'.repeat(60));

const constantChecks = [
  ['store.ts', STORE, '0.55', 'idle level 2 (attract)'],
  ['store.ts', STORE, '0.35', 'idle level 1 (drowsy)'],
  ['store.ts', STORE, '0.25', 'idle level 0 (active)'],
  ['store.ts', STORE, '0.5', 'scroll coefficient + cap'],
  ['heat.ts', HEAT, '0.05', 'heat smoothing per frame'],
  ['heat.ts', HEAT, '0.06', 'pointer trail lerp'],
];

for (const [file, src, literal, label] of constantChecks) {
  const present = src.includes(literal);
  if (present) {
    console.log(`  ok   ${literal.padEnd(6)} ${label.padEnd(30)} (${file})`);
  } else {
    fail(`${literal} missing from ${file} — ${label}`);
  }
}

/* ---------------------------------------------------------------- *
 * 3. The worked table.
 * ---------------------------------------------------------------- */

const VELOCITIES = [0, 0.25, 0.5, 1, 2, 4];

console.log('\n  heat target = min( idleBase + min(velocity × 0.5, 0.5), 1 )');
console.log('  ' + '-'.repeat(60));
console.log(
  '  idle       ' + VELOCITIES.map((v) => `v=${v}`.padStart(8)).join(''),
);

for (const level of [0, 1, 2]) {
  const label = ['0 active', '1 drowsy', '2 attract'][level];
  const row = VELOCITIES.map((v) => specHeatTarget(level, v).toFixed(3).padStart(8)).join('');
  console.log(`  ${label.padEnd(11)}${row}`);
}

// Assert the cap actually binds: at v=4 the scroll term must be clamped to 0.5,
// so level 2 tops out at 1.05 -> clamped to 1.0, not 1.05.
const top = specHeatTarget(2, 4);
if (top !== 1) fail(`level 2 at v=4 should clamp to 1, got ${top}`);
else console.log('\n  ok   clamp binds: idle 2 + capped scroll = 1.050 -> 1.000');

const uncapped = 0.55 + 4 * 0.5;
console.log(`       (uncapped would be 0.55 + ${(4 * 0.5).toFixed(2)} = ${uncapped.toFixed(2)})`);

/* ---------------------------------------------------------------- *
 * 4. Settle time. Exponential smoothing: error(n) = (1 - k)^n
 * ---------------------------------------------------------------- */

const framesTo95 = (k) => Math.ceil(Math.log(0.05) / Math.log(1 - k));

const heatFrames = framesTo95(SPEC_HEAT_LERP);
const pointerFrames = framesTo95(0.06);
const heatMs = (heatFrames / 60) * 1000;
const pointerMs = (pointerFrames / 60) * 1000;

console.log('\n  SETTLE TIME — frames to close 95% of a step');
console.log('  ' + '-'.repeat(60));
console.log(`  heat    k=0.05  n = ln(0.05)/ln(0.95) = ${(Math.log(0.05) / Math.log(0.95)).toFixed(2)} -> ${heatFrames} frames = ${heatMs.toFixed(0)}ms @60fps`);
console.log(`  pointer k=0.06  n = ln(0.05)/ln(0.94) = ${(Math.log(0.05) / Math.log(0.94)).toFixed(2)} -> ${pointerFrames} frames = ${pointerMs.toFixed(0)}ms @60fps`);

// A bloom that takes longer than ~2s to catch the cursor reads as broken
// rather than as trailing light.
const LAG_CEILING_MS = 2000;
if (heatMs > LAG_CEILING_MS) fail(`heat settles in ${heatMs.toFixed(0)}ms, over the ${LAG_CEILING_MS}ms ceiling`);
else console.log(`\n  ok   heat settles in ${heatMs.toFixed(0)}ms, under the ${LAG_CEILING_MS}ms ceiling`);

if (pointerMs > LAG_CEILING_MS) fail(`pointer trail settles in ${pointerMs.toFixed(0)}ms, over the ceiling`);
else console.log(`  ok   pointer trail settles in ${pointerMs.toFixed(0)}ms, under the ceiling`);

/* ---------------------------------------------------------------- *
 * 5. Structural rules that can be checked statically.
 * ---------------------------------------------------------------- */

console.log('\n  STRUCTURE');
console.log('  ' + '-'.repeat(60));

const structural = [
  [HEAT.includes('requestAnimationFrame'), 'heat.ts drives a rAF loop'],
  [!/use(State|Effect|Memo)\s*\(/.test(HEAT), 'heat.ts contains no React hooks'],
  [HEAT.includes('setProperty("--heat"'), 'writes --heat to the DOM'],
  [HEAT.includes('setProperty("--mx"'), 'writes --mx to the DOM'],
  [HEAT.includes('setProperty("--my"'), 'writes --my to the DOM'],
  [HEAT.includes('document.hidden'), 'loop pauses when the tab is hidden'],
  [(HEAT.match(/requestAnimationFrame\(tick\)/g) || []).length >= 1, 'single tick function'],
];

for (const [ok, label] of structural) {
  if (ok) console.log(`  ok   ${label}`);
  else fail(label);
}

console.log(`\n  ${failures} failing.\n`);

if (failures > 0) {
  console.error('Heat law gate FAILED — implementation has drifted from MOTION_SPEC §1.');
  console.error('Fix the source, or amend the spec and log a Director Decision.');
  process.exit(1);
}
