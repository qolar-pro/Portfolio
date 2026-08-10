/**
 * No-WebGL-on-reading-pages guard (SPEC §3.2, DD-8).
 *
 * Deferred from Phase 1 on purpose: there was no WebGL in the tree then, so
 * the check would have passed trivially and could not have been made to fail.
 * A guard that cannot fail is decorative.
 *
 * Walks the local import graph from every page, and fails if any route other
 * than the homepage can reach three.js or the canvas components. Import
 * tracing rather than a grep of the page file, because the violation that
 * matters is the indirect one — a shared component quietly pulling the canvas
 * onto a pricing page.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const PAGES_DIR = join(ROOT, 'app', '[locale]');

/** Only the homepage is a spectacle surface (DD-14). */
const SPECTACLE_ROUTES = new Set(['']);

const BANNED = [/(^|['"])three(\/|['"])/, /@react-three\//, /components\/canvas\//];

function findPages(dir, rel = '') {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...findPages(full, rel ? `${rel}/${entry}` : entry));
    } else if (entry === 'page.tsx') {
      out.push({ route: rel, file: full });
    }
  }
  return out;
}

function resolveLocal(spec, fromFile) {
  let base;
  if (spec.startsWith('@/')) base = join(ROOT, spec.slice(2));
  else if (spec.startsWith('.')) base = resolve(dirname(fromFile), spec);
  else return null; // bare package — checked by pattern, not walked

  for (const ext of ['.tsx', '.ts', '/index.tsx', '/index.ts']) {
    if (existsSync(base + ext)) return base + ext;
  }
  return existsSync(base) && statSync(base).isFile() ? base : null;
}

/** Returns the import chain that reaches WebGL, or null. */
function reachesWebGL(file, seen = new Set(), chain = []) {
  if (seen.has(file)) return null;
  seen.add(file);

  const src = readFileSync(file, 'utf8');
  const here = [...chain, file.replace(ROOT + '\\', '').replace(ROOT + '/', '')];

  const specs = [...src.matchAll(/from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]/g)].map(
    (m) => m[1] ?? m[2],
  );

  for (const spec of specs) {
    if (BANNED.some((re) => re.test(spec))) return [...here, spec];
    const next = resolveLocal(spec, file);
    if (next) {
      const hit = reachesWebGL(next, seen, here);
      if (hit) return hit;
    }
  }
  return null;
}

let failures = 0;
console.log('\n  WEBGL CONTAINMENT');
console.log('  ' + '-'.repeat(52));

for (const { route, file } of findPages(PAGES_DIR).sort((a, b) => a.route.localeCompare(b.route))) {
  const label = route === '' ? '/ (home)' : `/${route}`;
  const chain = reachesWebGL(file, new Set());
  const spectacle = SPECTACLE_ROUTES.has(route);

  if (chain && !spectacle) {
    failures++;
    console.error(`  FAIL ${label}`);
    console.error(`       reaches WebGL via: ${chain.join(' -> ')}`);
  } else if (chain && spectacle) {
    console.log(`  ok   ${label.padEnd(30)} (spectacle surface — allowed)`);
  } else {
    console.log(`  ok   ${label.padEnd(30)} no WebGL`);
  }
}

console.log('');
if (failures > 0) {
  console.error(`WebGL containment FAILED: ${failures} reading route(s) can reach the canvas.`);
  console.error('SPEC §3.2 keeps reading surfaces free of it. Escalate, do not relax the rule.');
  process.exit(1);
}
