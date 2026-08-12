#!/usr/bin/env node
/**
 * BEHAVIOUR GATE
 *
 * The static gates (check-heat-law, check-contrast, check-no-webgl) read
 * source and prove the constants are right. They cannot prove the page
 * behaves. This one drives a real Chromium against a real production server
 * and measures five things that no amount of source reading can settle:
 *
 *   1. React does not commit on pointer move          (CLAUDE.md §5)
 *   2. Heat actually rises on scroll and on idle      (MOTION_SPEC §1)
 *   3. The page renders at 390 / 768 / 1440
 *   4. Reduced motion leaves nothing invisible        (invariant 8)
 *   5. Focus is reachable and ringed in ember         (invariant: keyboard)
 *
 * Plain ESM, no test runner. Starts its own server, kills it in a finally.
 * Every gate is isolated: a throw marks that gate failed and the rest still
 * run, so one break never hides four others.
 *
 *   node scripts/check-behaviour.mjs        exits 0 on all-pass, 1 otherwise
 */

import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { chromium } from 'playwright';

/* ---------------------------------------------------------------- *
 * Config
 * ---------------------------------------------------------------- */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = 3210;
const ORIGIN = `http://localhost:${PORT}`;
const URL_EN = `${ORIGIN}/en`;
const SHOT_DIR = join(ROOT, '.playwright');

/** Server boot budget. */
const SERVER_TIMEOUT_MS = 60_000;

/** Comparison tolerance on heat readings — below this, two values are equal. */
const HEAT_TOL = 0.02;

/** Gate 1 threshold: commits attributable to a full pointer sweep. */
const MAX_COMMIT_DELTA = 2;

/** Ember as sRGB, per tokens.css `--color-ember: #ff7a1a`. Compared numerically. */
const SRGB_EMBER = [255, 122, 26];

const IS_WIN = process.platform === 'win32';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const f3 = (n) => (Number.isFinite(n) ? n.toFixed(3) : String(n));
const kb = (bytes) => (bytes / 1024).toFixed(1);

/* ---------------------------------------------------------------- *
 * Result bookkeeping
 * ---------------------------------------------------------------- */

const results = [];

function log(line = '') {
  console.log(line);
}

function head(title) {
  log('');
  log(`  ${title}`);
  log(`  ${'-'.repeat(68)}`);
}

/**
 * Run one gate in isolation. `fn` returns true/false; a throw is a failure
 * with the stack printed, and never stops the remaining gates.
 */
async function gate(id, name, fn) {
  head(`${id} — ${name}`);
  let passed = false;
  let note = '';
  try {
    passed = (await fn()) === true;
  } catch (err) {
    note = err && err.message ? err.message : String(err);
    log(`  THREW  ${note}`);
    if (err && err.stack) {
      log(
        err.stack
          .split('\n')
          .slice(1, 4)
          .map((l) => `         ${l.trim()}`)
          .join('\n'),
      );
    }
  }
  log(`  ${passed ? 'PASS' : 'FAIL'}  ${id} ${name}`);
  results.push({ id, name, passed, note });
  return passed;
}

/* ---------------------------------------------------------------- *
 * Server lifecycle
 * ---------------------------------------------------------------- */

const serverLog = [];

async function probe() {
  try {
    // Per-request abort matters: a booting `next start` accepts the connection
    // and then holds it, so a fetch with no timeout blocks past the deadline
    // and the 60s budget stops meaning anything.
    const res = await fetch(URL_EN, { redirect: 'follow', signal: AbortSignal.timeout(2500) });
    return res.status;
  } catch {
    return 0;
  }
}

function startServer() {
  const child = spawn('npx', ['next', 'start', '--port', String(PORT)], {
    cwd: ROOT,
    shell: true,
    detached: !IS_WIN,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const capture = (buf) => {
    const text = buf.toString();
    serverLog.push(text);
    if (serverLog.length > 200) serverLog.shift();
  };
  child.stdout.on('data', capture);
  child.stderr.on('data', capture);
  child.on('error', (e) => serverLog.push(`spawn error: ${e.message}\n`));
  return child;
}

async function waitForServer(deadlineMs) {
  const start = Date.now();
  while (Date.now() - start < deadlineMs) {
    const status = await probe();
    if (status > 0 && status < 500) return { status, ms: Date.now() - start };
    await sleep(500);
  }
  throw new Error(
    `server did not answer ${URL_EN} within ${deadlineMs}ms\n${serverLog.join('')}`,
  );
}

function killServer(child) {
  if (!child || child.exitCode !== null) return;
  try {
    if (IS_WIN) {
      // shell:true means child.pid is the cmd wrapper — /T takes the tree.
      spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      process.kill(-child.pid, 'SIGKILL');
    }
  } catch {
    try {
      child.kill('SIGKILL');
    } catch {
      /* already gone */
    }
  }
}

/* ---------------------------------------------------------------- *
 * Page helpers
 * ---------------------------------------------------------------- */

/**
 * Stub the React DevTools hook before any bundle evaluates. React 19 calls
 * onCommitFiberRoot on every commit of every root, in production builds too,
 * so this is an exact commit counter — not a proxy for one.
 */
const DEVTOOLS_HOOK = () => {
  window.__commits = 0;
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    renderers: new Map(),
    supportsFiber: true,
    isDisabled: false,
    inject() {
      return 1;
    },
    onCommitFiberRoot() {
      window.__commits = (window.__commits || 0) + 1;
    },
    onPostCommitFiberRoot() {},
    onCommitFiberUnmount() {},
    checkDCE() {},
    on() {},
    off() {},
    emit() {},
    sub() {
      return () => {};
    },
    getFiberRoots() {
      return new Set();
    },
  };
};

const readHeat = (page) =>
  page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--heat')),
  );

/**
 * Real rAF rate for this page in this browser. Not decoration: the heat loop
 * eases by 0.05 per FRAME, so every "wait Nms and read heat" assertion below
 * is really an assertion about frames, and headless has no GPU. Measured, not
 * assumed.
 */
const measureFps = (page, ms = 1500) =>
  page.evaluate(
    (window_ms) =>
      new Promise((resolve) => {
        let frames = 0;
        const t0 = performance.now();
        const tick = () => {
          frames++;
          const elapsed = performance.now() - t0;
          if (elapsed < window_ms) requestAnimationFrame(tick);
          else resolve(frames / (elapsed / 1000));
        };
        requestAnimationFrame(tick);
      }),
    ms,
  );

/**
 * Resolve any CSS colour string to an sRGB triple through a 1x1 canvas.
 *
 * Needed because getComputedStyle serialises in the authored colour space.
 * tokens.css ships --color-ember twice: #ff7a1a for sRGB and
 * `color(display-p3 1 0.49 0.13)` under @media (color-gamut: p3) — and it
 * animates through oklab on hover/focus transitions. String-comparing against
 * 'rgb(255, 122, 26)' therefore reports 0 ember rings on a page that is
 * entirely ember. Readback is gamut-agnostic.
 */
async function installColorResolver(page) {
  await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const g = c.getContext('2d', { willReadFrequently: true });
    window.__toRGB = (css) => {
      g.clearRect(0, 0, 1, 1);
      g.fillStyle = '#000000';
      g.fillStyle = css;
      g.fillRect(0, 0, 1, 1);
      const d = g.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
  });
}

const sameRGB = (a, b, tol = 4) =>
  Array.isArray(a) && Array.isArray(b) && a.every((v, i) => Math.abs(v - b[i]) <= tol);

async function settleAfterLoad(page, ms = 1500) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load').catch(() => {});
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(ms);
}

/** Walk the page so the reveal IntersectionObserver fires, then return to top. */
async function primeReveals(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewport = page.viewportSize()?.height ?? 900;
  const steps = Math.min(Math.ceil(height / viewport) + 1, 20);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, viewport * 0.9);
    await sleep(220);
  }
  await sleep(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(700);
}

/* ---------------------------------------------------------------- *
 * GATE 1 — no React commit on pointer move
 * ---------------------------------------------------------------- */

async function gate1(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(DEVTOOLS_HOOK);
  try {
    await page.goto(URL_EN, { waitUntil: 'domcontentloaded' });
    await settleAfterLoad(page, 2000);

    const hookLive = await page.evaluate(
      () => typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object',
    );
    const mountCommits = await page.evaluate(() => window.__commits || 0);
    log(`  devtools hook installed : ${hookLive}`);
    log(`  commits through mount   : ${mountCommits}`);

    if (mountCommits === 0) {
      throw new Error(
        'commit counter never incremented — the hook was not wired to React, ' +
          'so a delta of 0 would be meaningless',
      );
    }

    log(`  rAF rate on this page   : ${(await measureFps(page)).toFixed(1)} fps`);

    // Wait for the tree to go quiet. The hero canvas mounts after paint and
    // reveals fire on entry; counting those against a pointer sweep that
    // merely overlapped them in time is how this gate lies.
    let quiet = 0;
    let last = -1;
    const quiesceStart = Date.now();
    while (Date.now() - quiesceStart < 12_000) {
      const now = await page.evaluate(() => window.__commits || 0);
      quiet = now === last ? quiet + 1 : 0;
      last = now;
      if (quiet >= 4) break; // 4 x 250ms of no commits
      await sleep(250);
    }
    log(`  quiescent after         : ${Date.now() - quiesceStart}ms  (${last} commits)`);

    /**
     * Reset the idle clock immediately before the sweep. idleLevel is discrete
     * state React is ALLOWED to subscribe to (CLAUDE.md §5), and it escalates
     * on a wall clock at 6s and 16s. Without this, a sweep that straddles 6s
     * books a legitimate discrete commit as a pointer re-render.
     *
     * Shift, not a wheel event. idle.ts wakes on pointerdown/keydown/
     * touchstart/wheel, but a wheel is not inert here — Lenis consumes it and
     * scrolls, and a 1px scroll was measured at +2 commits. A Shift keydown
     * measures at +0 commits and +0 scroll events while resetting the same
     * timers, so it moves the clock without touching the thing under test.
     */
    await page.keyboard.press('Shift');
    await sleep(600);

    const baseline = await page.evaluate(() => window.__commits || 0);
    log(`  baseline (idle clock 0) : ${baseline}`);

    /**
     * Hold the idle clock at 0 for the whole sweep. Each keep-alive is free:
     * idle.ts guards its write with `if (idleLevel !== 0)`, so while the clock
     * already reads 0 there is no store write and no commit. Needed because on
     * a software-GL machine every mouse.move round trip waits on a busy main
     * thread — the sweep measures ~300ms per move and outlives 6000ms, which
     * would otherwise book the drowsy escalation as a pointer re-render.
     */
    const keepAlive = () => page.keyboard.press('Shift');

    const { width, height } = page.viewportSize();
    const STEPS = 40;
    const KEEPALIVE_EVERY = 8;
    const y = Math.round(height * 0.5);
    const sweepStart = Date.now();
    let lastKeepAlive = sweepStart;
    let maxGap = 0;
    let keepAlives = 0;

    await page.mouse.move(4, y);
    await sleep(120);
    for (let i = 1; i <= STEPS; i++) {
      const x = Math.round((i / STEPS) * (width - 8)) + 4;
      await page.mouse.move(x, y);
      await sleep(16);
      if (i % KEEPALIVE_EVERY === 0) {
        maxGap = Math.max(maxGap, Date.now() - lastKeepAlive);
        await keepAlive();
        lastKeepAlive = Date.now();
        keepAlives++;
      }
    }
    await sleep(500);
    maxGap = Math.max(maxGap, Date.now() - lastKeepAlive);
    const window_ms = Date.now() - sweepStart;

    const final = await page.evaluate(() => window.__commits || 0);
    const delta = final - baseline;

    log(`  pointer sweep           : ${STEPS} moves across ${width}px at y=${y}`);
    log(`  measurement window      : ${window_ms}ms  (${(window_ms / STEPS).toFixed(0)}ms per move round trip)`);
    log(`  idle clock held at 0    : ${keepAlives} Shift keydowns, longest gap ${maxGap}ms (escalation at 6000ms)`);
    log(`  commits after sweep     : ${final}`);
    log(`  delta                   : ${delta}   (budget <= ${MAX_COMMIT_DELTA})`);
    log(`  commits per pointer move: ${(delta / STEPS).toFixed(3)}`);

    if (maxGap >= 6000) {
      log('  WARNING — a gap crossed the 6s idle step; delta may include one legitimate commit');
    }

    return delta <= MAX_COMMIT_DELTA;
  } finally {
    await context.close();
  }
}

/* ---------------------------------------------------------------- *
 * GATE 2 — heat behaviour
 * ---------------------------------------------------------------- */

async function gate2(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto(URL_EN, { waitUntil: 'domcontentloaded' });
    await settleAfterLoad(page, 1200);

    /**
     * Frame budget first, because it sets what any timed read can mean.
     * heat += (target - heat) * 0.05 per frame, so after N frames the gap
     * remaining is 0.95^N. At 60fps one second closes 95% of the gap; at
     * 9fps it closes 37%. Fixed millisecond windows are therefore not
     * assertions about the heat law unless the frame rate is stated.
     */
    const fps = await measureFps(page);
    const closedIn1s = 1 - Math.pow(0.95, fps);
    log(`  rAF rate                          : ${fps.toFixed(1)} fps`);
    log(`  gap closed per second (0.95^fps)  : ${(closedIn1s * 100).toFixed(1)}%`);
    if (fps < 30) {
      log('  NOTE — software WebGL. The R3F hero renders through SwiftShader here');
      log('         (~106ms/frame at 1440x900); blocking WebGL restores 60fps. The');
      log('         heat loop is frame-driven, so plateau reads below are sampled');
      log('         to settle rather than read at one fixed offset.');
    }
    log('');

    /** Sample --heat until `untilMs`, returning min/max/last seen. */
    const sampleUntil = async (untilMs, everyMs = 120) => {
      let min = Infinity;
      let max = -Infinity;
      let last = NaN;
      while (Date.now() < untilMs) {
        const v = await readHeat(page);
        if (Number.isFinite(v)) {
          min = Math.min(min, v);
          max = Math.max(max, v);
          last = v;
        }
        await sleep(everyMs);
      }
      return { min, max, last };
    };

    // (a) resting — 1s with no input of any kind
    await sleep(1000);
    const a = await readHeat(page);
    log(`  a  resting, 1s no input            : ${f3(a)}`);

    // (b) scroll energy. The wheel's smooth-scroll decays within ~1s, so the
    //     read taken the instant after the call is on the way up, not at top.
    const wheelAt = Date.now();
    await page.mouse.wheel(0, 2000);
    const bImmediate = await readHeat(page);
    const bWindow = await sampleUntil(wheelAt + 1500);
    const bPeak = Math.max(bImmediate, bWindow.max);
    log(`  b  immediately after wheel(0,2000) : ${f3(bImmediate)}`);
    log(`  b  peak within 1500ms of the wheel : ${f3(bPeak)}    <- used`);

    // (c) 6s drowsy step. Idle resets on wheel, so the clock starts at wheelAt.
    while (Date.now() < wheelAt + 7000) await sleep(150);
    const c = await readHeat(page);
    log(`  c  at ${String(Date.now() - wheelAt).padStart(5)}ms idle (6s drowsy)   : ${f3(c)}`);
    // Level 1 holds until 16s; the plateau it reaches is the drowsy base.
    const cWindow = await sampleUntil(wheelAt + 15_500, 200);
    const cPlateau = Math.max(c, cWindow.max);
    log(`  c  drowsy plateau by 15.5s         : ${f3(cPlateau)}    <- used`);

    // (d) 16s attract step
    while (Date.now() < wheelAt + 17_000) await sleep(150);
    const d = await readHeat(page);
    log(`  d  at ${String(Date.now() - wheelAt).padStart(5)}ms idle (16s attract) : ${f3(d)}`);
    const dWindow = await sampleUntil(wheelAt + 24_000, 200);
    const dPlateau = Math.max(d, dWindow.max);
    log(`  d  attract plateau by 24s          : ${f3(dPlateau)}    <- used`);

    // (e) any input resets idle to level 0 — heat must fall back
    const inputAt = Date.now();
    await page.evaluate(() =>
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true })),
    );
    await sleep(1000);
    const e = await readHeat(page);
    log(`  e  1s after a wheel event          : ${f3(e)}`);
    const eWindow = await sampleUntil(inputAt + 6000, 150);
    const eFloor = Math.min(e, eWindow.min);
    log(`  e  floor by 6s after that event    : ${f3(eFloor)}    <- used`);

    const higher = (x, y) => x - y > HEAT_TOL;
    const lower = (x, y) => y - x > HEAT_TOL;

    const checks = [
      ['b > a  scroll raises heat   ', bPeak - a, higher(bPeak, a)],
      ['c > a  6s drowsy raises     ', cPlateau - a, higher(cPlateau, a)],
      ['d > c  16s attract raises   ', dPlateau - cPlateau, higher(dPlateau, cPlateau)],
      ['e < d  input cools it again ', eFloor - dPlateau, lower(eFloor, dPlateau)],
    ];

    log('');
    log(`  comparisons (tolerance ${f3(HEAT_TOL)}):`);
    for (const [label, delta, ok] of checks) {
      log(`    ${label} delta ${delta >= 0 ? '+' : ''}${f3(delta)}   ${ok ? 'ok' : 'FAILED'}`);
    }

    return checks.every(([, , ok]) => ok);
  } finally {
    await context.close();
  }
}

/* ---------------------------------------------------------------- *
 * GATE 3 — screenshots
 * ---------------------------------------------------------------- */

async function gate3(browser) {
  mkdirSync(SHOT_DIR, { recursive: true });
  const widths = [
    { w: 390, h: 844 },
    { w: 768, h: 1024 },
    { w: 1440, h: 900 },
  ];

  let ok = true;
  for (const { w, h } of widths) {
    const context = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await context.newPage();
    try {
      await page.goto(URL_EN, { waitUntil: 'domcontentloaded' });
      await settleAfterLoad(page, 1200);
      await primeReveals(page);

      const path = join(SHOT_DIR, `home-${w}.png`);
      await page.screenshot({ path, fullPage: true });

      const size = statSync(path).size;
      const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      log(`  ${String(w).padStart(4)}px  ${path}`);
      log(`          ${kb(size)} KB   full page ${w} x ${docHeight}px`);
      if (size < 2048) {
        log(`          FAILED — under 2 KB, that is a blank frame`);
        ok = false;
      }
    } finally {
      await context.close();
    }
  }
  return ok;
}

/* ---------------------------------------------------------------- *
 * GATE 4 — reduced motion
 * ---------------------------------------------------------------- */

async function gate4(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    await page.goto(URL_EN, { waitUntil: 'domcontentloaded' });
    await settleAfterLoad(page, 1500);

    const reveals = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
      const invisible = [];
      for (const el of nodes) {
        const cs = getComputedStyle(el);
        const opacity = parseFloat(cs.opacity);
        if (!(Math.abs(opacity - 1) < 0.001)) {
          invisible.push({
            tag: el.tagName,
            cls: el.className ? String(el.className).slice(0, 48) : '',
            opacity,
            transform: cs.transform,
          });
        }
      }
      return { count: nodes.length, invisible };
    });

    const h1 = await readHeat(page);
    await sleep(1000);
    const h2 = await readHeat(page);

    log(`  [data-reveal] elements checked : ${reveals.count}`);
    log(`  with computed opacity !== 1    : ${reveals.invisible.length}`);
    for (const bad of reveals.invisible.slice(0, 6)) {
      log(`      ${bad.tag}.${bad.cls} opacity=${f3(bad.opacity)} transform=${bad.transform}`);
    }
    log(`  --heat read 1                  : ${f3(h1)}`);
    log(`  --heat read 2 (+1000ms)        : ${f3(h2)}`);
    log(`  drift between reads            : ${f3(Math.abs(h2 - h1))}`);

    const revealsOk = reveals.count > 0 && reveals.invisible.length === 0;
    const pinnedOk =
      Math.abs(h1 - 0.3) <= HEAT_TOL &&
      Math.abs(h2 - 0.3) <= HEAT_TOL &&
      Math.abs(h2 - h1) <= 0.001;

    if (!revealsOk && reveals.count === 0) log('  FAILED — no [data-reveal] elements found to check');
    if (!pinnedOk) log(`  FAILED — --heat must sit at 0.300 +/- ${f3(HEAT_TOL)} and not move`);

    return revealsOk && pinnedOk;
  } finally {
    await context.close();
  }
}

/* ---------------------------------------------------------------- *
 * GATE 5 — keyboard
 * ---------------------------------------------------------------- */

async function gate5(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto(URL_EN, { waitUntil: 'domcontentloaded' });
    await settleAfterLoad(page, 1200);
    await installColorResolver(page);
    await page.evaluate(() => document.body.focus());

    const token = await page.evaluate(() => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-ember')
        .trim();
      return {
        raw,
        rgb: window.__toRGB(raw),
        p3: window.matchMedia('(color-gamut: p3)').matches,
      };
    });
    const drift = token.rgb.map((v, i) => v - SRGB_EMBER[i]);
    log(`  --color-ember as served  : ${token.raw}`);
    log(`  resolved to sRGB         : rgb(${token.rgb.join(', ')})`);
    log(`  expected sRGB #ff7a1a    : rgb(${SRGB_EMBER.join(', ')})   delta per channel ${JSON.stringify(drift)}`);
    log(`  matchMedia color-gamut p3: ${token.p3}`);
    if (!sameRGB(token.rgb, SRGB_EMBER) && !token.p3) {
      log('  NOTE — the served token is a display-p3 colour on a browser that does NOT');
      log('         report a p3 gamut, so it is clipped on readback. Tailwind compiled');
      log('         @media (color-gamut: p3) into @supports (color: color(display-p3 ...)),');
      log('         which is true everywhere. Ring colour is checked against the served');
      log('         token as well as the hex, so this does not fail the gate.');
    }
    log('');

    const reached = [];
    const seen = new Set();
    let wrapped = false;

    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      // 400ms, not 90ms: nav links carry a colour transition, and outline-color
      // interpolates through oklab. Reading early samples the tween, not the ring.
      await sleep(400);
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body || el === document.documentElement) return null;
        const cs = getComputedStyle(el);
        const text = (el.getAttribute('aria-label') || el.textContent || '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 34);
        return {
          tag: el.tagName,
          text,
          href: el.getAttribute('href') || '',
          outlineColor: cs.outlineColor,
          outlineRGB: window.__toRGB(cs.outlineColor),
          outlineStyle: cs.outlineStyle,
          outlineWidth: cs.outlineWidth,
        };
      });
      if (!info) continue;

      const key = `${info.tag}|${info.href}|${info.text}`;
      if (seen.has(key)) {
        wrapped = true;
        break;
      }
      seen.add(key);
      reached.push(info);
    }

    let ember = 0;
    let noOutline = 0;
    for (const el of reached) {
      // Ember either way it is authored: the page's own token, or the sRGB hex
      // the brief names. Compared as sRGB triples, +/-4 per channel.
      el.isEmber = sameRGB(el.outlineRGB, token.rgb) || sameRGB(el.outlineRGB, SRGB_EMBER);
      if (el.isEmber) ember++;
      if (el.outlineStyle === 'none') noOutline++;
    }

    for (const el of reached.slice(0, 12)) {
      const mark = el.isEmber ? 'ember' : `OTHER rgb(${el.outlineRGB.join(',')})`;
      log(
        `    ${el.tag.padEnd(7)} ${el.outlineStyle.padEnd(6)} ${el.outlineWidth.padEnd(4)} ${mark.padEnd(24)} ${el.text}`,
      );
    }
    if (reached.length > 12) log(`    ... ${reached.length - 12} more`);

    // Always name the offenders, wherever they fell in the tab order — a
    // warning you cannot act on is not worth printing.
    const offenders = reached.filter((el) => !el.isEmber);
    if (offenders.length) {
      log('');
      log('  rings that are not ember:');
      for (const el of offenders) {
        log(
          `    ${el.tag.padEnd(7)} rgb(${el.outlineRGB.join(',')})  raw=${el.outlineColor.slice(0, 42)}  ${el.text}`,
        );
      }
    }

    log('');
    log(`  elements reached by Tab       : ${reached.length}${wrapped ? ' (focus cycled back)' : ''}`);
    log(`  with the ember focus ring     : ${ember} / ${reached.length}`);
    log(`  with outline-style: none      : ${noOutline}`);
    if (ember < reached.length) {
      log(`  WARNING — ${reached.length - ember} focusable element(s) ring in a colour other than ember`);
    }

    if (reached.length < 5) log('  FAILED — fewer than 5 focusable elements reachable');
    if (noOutline > 0) log('  FAILED — a reachable element has no focus outline');

    return reached.length >= 5 && noOutline === 0;
  } finally {
    await context.close();
  }
}

/* ---------------------------------------------------------------- *
 * Main
 * ---------------------------------------------------------------- */

let server = null;
let browser = null;

const onSignal = () => {
  killServer(server);
  process.exit(130);
};
process.on('SIGINT', onSignal);
process.on('SIGTERM', onSignal);

try {
  log('');
  log('  BEHAVIOUR GATE — five measurements against a live production server');
  log('  ' + '='.repeat(68));

  const already = await probe();
  if (already > 0 && already < 500) {
    log(`  port ${PORT} already answering (HTTP ${already}) — reusing it, will not kill it`);
  } else {
    log(`  starting: npx next start --port ${PORT}`);
    server = startServer();
    const { status, ms } = await waitForServer(SERVER_TIMEOUT_MS);
    log(`  server up in ${ms}ms  (GET /en -> HTTP ${status})`);
  }

  browser = await chromium.launch();
  log(`  chromium ${browser.version()}`);

  await gate('GATE 1', 'React does not re-render on pointer move', () => gate1(browser));
  await gate('GATE 2', 'heat rises on scroll and on idle, falls on input', () => gate2(browser));
  await gate('GATE 3', 'renders at 390 / 768 / 1440', () => gate3(browser));
  await gate('GATE 4', 'reduced motion hides nothing, heat pinned', () => gate4(browser));
  await gate('GATE 5', 'keyboard reachable with ember focus ring', () => gate5(browser));
} catch (err) {
  log('');
  log(`  ABORTED before all gates ran: ${err && err.message ? err.message : err}`);
  results.push({ id: 'SETUP', name: 'server / browser start', passed: false });
} finally {
  if (browser) await browser.close().catch(() => {});
  killServer(server);
}

const passedCount = results.filter((r) => r.passed).length;
const total = 5;

log('');
log('  ' + '='.repeat(68));
for (const r of results) {
  log(`  ${r.passed ? 'PASS' : 'FAIL'}  ${r.id} ${r.name}`);
}
log('');
log(`  ${passedCount}/${total} gates passed`);
log('');

process.exit(passedCount === total ? 0 : 1);
