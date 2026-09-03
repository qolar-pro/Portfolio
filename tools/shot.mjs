/**
 * Screenshot harness (dev tooling, not shipped).
 *
 * Drives headless Edge over CDP so QA can pin a viewport, force a theme via
 * localStorage, capture full-page rather than just the fold, and read the
 * console back. Node's global WebSocket does the talking, so there is no
 * puppeteer dependency to install.
 *
 *   npm run qa:shots -- <spec.json>
 *
 * spec.json: [{ name, url, w, h, theme?, full?, scrollTo?, click?, eval? }]
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9333;
const [outDir, specPath] = process.argv.slice(2);
const specs = JSON.parse(await import('node:fs').then((f) => f.readFileSync(specPath, 'utf8')));
mkdirSync(outDir, { recursive: true });

const browser = spawn(
  EDGE,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--no-first-run',
    '--disable-extensions',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + outDir + '/edge-profile',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

async function targets() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const j = await r.json();
      if (j.length) return j;
    } catch {}
    await sleep(300);
  }
  throw new Error('browser never came up');
}

const list = await targets();
const page = list.find((t) => t.type === 'page') ?? list[0];

let id = 0;
const ws = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
const events = [];
ws.addEventListener('message', (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  } else if (msg.method) {
    events.push(msg);
  }
});
await new Promise((r) => ws.addEventListener('open', r));

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const i = ++id;
    pending.set(i, { resolve, reject });
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send('Page.enable');
await send('Runtime.enable');
await send('Console.enable');
await send('Network.enable');

const report = [];
let seeded = null;

for (const s of specs) {
  events.length = 0;
  const w = s.w ?? 1440;
  const h = s.h ?? 900;

  await send('Emulation.setDeviceMetricsOverride', {
    width: w,
    height: h,
    deviceScaleFactor: s.dpr ?? 1,
    mobile: w < 700,
  });
  await send('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-color-scheme', value: s.system ?? 'dark' },
      { name: 'prefers-reduced-motion', value: s.reduced ? 'reduce' : 'no-preference' },
    ],
  });

  /* Seed (or clear) the explicit theme choice before the page's blocking
     script reads it. Both branches are always installed and the previous
     one removed, or the profile's localStorage leaks into the next shot. */
  if (seeded) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: seeded });
  const seed = await send('Page.addScriptToEvaluateOnNewDocument', {
    source: s.theme
      ? `try{localStorage.setItem('nf-theme','${s.theme}')}catch(e){}`
      : `try{localStorage.removeItem('nf-theme')}catch(e){}`,
  });
  seeded = seed.identifier;

  await send('Page.navigate', { url: s.url });
  await sleep(s.wait ?? 2600);

  if (s.eval) {
    await send('Runtime.evaluate', { expression: s.eval, awaitPromise: true });
    /* A style injected by `eval` needs a frame to take effect. Screenshotting
       immediately captures the pre-repaint frame, which silently produces a
       shot that looks like the eval never ran. */
    await sleep(300);
  }
  if (s.click) {
    await send('Runtime.evaluate', {
      expression: `document.querySelector(${JSON.stringify(s.click)})?.click()`,
    });
    await sleep(900);
  }
  if (s.scrollTo != null) {
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({top:${s.scrollTo},behavior:'instant'})`,
    });
    await sleep(1400);
  }

  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: !!s.full,
    ...(s.full ? { clip: await fullClip(w) } : {}),
  });
  writeFileSync(`${outDir}/${s.name}.png`, Buffer.from(shot.data, 'base64'));

  // console errors + horizontal overflow audit, per shot
  const audit = await send('Runtime.evaluate', {
    expression: `(() => {
      const de = document.documentElement;
      const over = [];
      /* An element wider than the viewport only causes a scrollbar if nothing
         above it clips. Walking up for overflow:hidden is what separates a
         real bug from a marquee doing its job. */
      /* Stops at <body> rather than <html>: body carries overflow-x:hidden
         site-wide, so walking through it would mark every element on the page
         as clipped and the audit would report nothing, forever. */
      const clipped = (el) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (getComputedStyle(p).overflowX !== 'visible') return true;
        }
        return false;
      };
      const name = (el) => {
        const c = typeof el.className === 'string' ? el.className : (el.getAttribute('class') || '');
        return el.tagName.toLowerCase() + (c ? '.' + c.split(/\s+/).filter(Boolean).slice(0,2).join('.') : '');
      };
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.right <= de.clientWidth + 1.5 && r.left >= -1.5) continue;
        if (clipped(el)) continue;
        over.push(name(el) + ' [' + Math.round(r.left) + '..' + Math.round(r.right) + ']');
      }
      /* scrollWidth alone over-reports: body's overflow-x:hidden propagates
         to the viewport, so content can exceed it without the visitor ever
         being able to scroll sideways. Actually trying to scroll is the only
         test that matches what a thumb can do. */
      window.scrollTo(400, window.scrollY);
      const sx = window.scrollX;
      window.scrollTo(0, window.scrollY);
      return JSON.stringify({
        scrollW: de.scrollWidth,
        clientW: de.clientWidth,
        canScrollX: sx,
        theme: de.getAttribute('data-theme'),
        overflow: [...new Set(over)].slice(0, 12),
      });
    })()`,
    returnByValue: true,
  });

  const errs = events
    .filter((e) => e.method === 'Runtime.exceptionThrown' || (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error'))
    .map((e) =>
      e.method === 'Runtime.exceptionThrown'
        ? e.params.exceptionDetails.text + ' ' + (e.params.exceptionDetails.exception?.description ?? '')
        : e.params.args.map((a) => a.value ?? a.description).join(' '),
    );
  const failed = events
    .filter((e) => e.method === 'Network.loadingFailed')
    .map((e) => e.params.errorText);

  report.push({ name: s.name, ...JSON.parse(audit.result.value), errors: errs, failed });
}

async function fullClip(w) {
  const r = await send('Runtime.evaluate', {
    expression: 'document.documentElement.scrollHeight',
    returnByValue: true,
  });
  return { x: 0, y: 0, width: w, height: Math.min(r.result.value, 16000), scale: 1 };
}

console.log(JSON.stringify(report, null, 1));
ws.close();
browser.kill();
process.exit(0);
