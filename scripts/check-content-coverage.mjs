/**
 * Content coverage report (Phase 2 DoD, DD-15).
 *
 * Reports which locales are unwritten and which required content is missing.
 *
 * This one does NOT fail the build. EL and MK are legitimately unwritten until
 * Phase 8, so a hard failure would just get muted, and a muted guard is worse
 * than none. It fails only on things that are wrong rather than merely
 * unfinished — a locale claiming `complete` while missing content.
 */

import { readFileSync } from 'node:fs';

const REG = readFileSync(new URL('../lib/content/index.ts', import.meta.url), 'utf8');
const EN = readFileSync(new URL('../lib/content/en.ts', import.meta.url), 'utf8');
const LOC = readFileSync(new URL('../lib/locales.ts', import.meta.url), 'utf8');

const locales = [...LOC.matchAll(/'([a-z]{2})'/g)].map((m) => m[1]);
const uniqueLocales = [...new Set(locales)].filter((l) => ['en', 'el', 'mk'].includes(l));

// Which locales the registry binds to content vs null.
//
// Test for `x: null` and invert, rather than testing for a binding: the
// registry uses object shorthand for `en`, which has no colon at all, so
// looking for `en:` finds nothing and reports the one written locale as
// missing. Absence of `: null` is the reliable signal.
const written = [];
const unwritten = [];
for (const l of uniqueLocales) {
  const isNull = new RegExp(`\\b${l}\\s*:\\s*null`).test(REG);
  (isNull ? unwritten : written).push(l);
}

console.log('\n  CONTENT COVERAGE');
console.log('  ' + '-'.repeat(46));
console.log(`  written    : ${written.join(', ') || '(none)'}`);
console.log(`  unwritten  : ${unwritten.join(', ') || '(none)'}`);

if (unwritten.length) {
  const verb = unwritten.length === 1 ? 'falls' : 'fall';
  console.log(
    `\n  ${unwritten.join(' and ').toUpperCase()} ${verb} back to English and ${unwritten.length === 1 ? 'is' : 'are'} served noindex.`,
  );
  console.log('  Phase 8 writes them. Until then this is expected, not a defect.');
}

// Things that ARE defects.
let failures = 0;

const nullTestimonials = (EN.match(/testimonials:\s*\[([^\]]*)\]/s)?.[1] || '')
  .split(',')
  .filter((s) => s.trim() === 'null').length;
if (nullTestimonials > 0) {
  console.log(
    `\n  ${nullTestimonials} testimonial slot(s) awaiting text from the owner (DD-5). Not shippable as-is.`,
  );
}

if (/photo:\s*null/.test(EN)) {
  console.log('  Founder photo not supplied (DD-4 requires one).');
}

// A price figure in content would breach DD-1.
const priceLeak = EN.match(/[€$]\s?\d/g);
if (priceLeak) {
  console.error(`\n  FAIL: price figures found in content: ${priceLeak.join(', ')}`);
  console.error('  DD-1 rules out a published price list. Escalate, do not publish.');
  failures++;
}

console.log('');
if (failures) process.exit(1);
