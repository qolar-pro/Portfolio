/**
 * Transfer + timing audit (dev tooling, not shipped).
 *
 * Loads a route on an emulated mid-range phone (throttled CPU and network),
 * and reports what actually came down the wire and when the largest paint
 * landed. Source file sizes are not the number that matters — Next serves
 * resized AVIF/WebP — so this measures the bytes a visitor really pays.
 *
 *   npm run qa:perf -- .qa http://localhost:3100/en 390
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9336;
const [outDirArg = '.qa', url = 'http://localhost:3100/en', width = '390'] = process.argv.slice(2);
const outDir = resolvePath(outDirArg);
mkdirSync(outDir, { recursive: true });

const browser = spawn(
  EDGE,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--no-first-run',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + resolvePath(outDir, 'edge-perf'),
    'about:blank',
  ],
  { stdio: 'ignore' },
);

async function targets() {
  for (let i = 0; i < 60; i++) {
    try {
      const j = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      if (j.length) return j;
    } catch {}
    await sleep(300);
  }
  throw new Error('no browser');
}

const page = (await targets()).find((t) => t.type === 'page');
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
  } else if (msg.method) events.push(msg);
});
await new Promise((r) => ws.addEventListener('open', r));
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const i = ++id;
    pending.set(i, { resolve, reject });
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send('Page.enable');
await send('Network.enable');
await send('Runtime.enable');
await send('Performance.enable');

const w = Number(width);
await send('Emulation.setDeviceMetricsOverride', {
  width: w,
  height: w < 700 ? 844 : 900,
  deviceScaleFactor: w < 700 ? 3 : 1,
  mobile: w < 700,
});
// a mid-range phone: 4x CPU slowdown, a real 4G pipe
await send('Emulation.setCPUThrottlingRate', { rate: 4 });
await send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});

const t0 = Date.now();
await send('Page.navigate', { url });
await sleep(9000);

const byType = new Map();
const reqs = new Map();
for (const e of events) {
  if (e.method === 'Network.requestWillBeSent') reqs.set(e.params.requestId, e.params.request.url);
  if (e.method === 'Network.loadingFinished') {
    const u = reqs.get(e.params.requestId) || '?';
    const kind = /\.(png|jpe?g|webp|avif|svg)|_next\/image/.test(u)
      ? 'image'
      : /\.mp4|\.webm/.test(u)
        ? 'video'
        : /\.js/.test(u)
          ? 'js'
          : /\.css/.test(u)
            ? 'css'
            : /fonts?\.|\.woff/.test(u)
              ? 'font'
              : 'other';
    const cur = byType.get(kind) || { bytes: 0, n: 0, top: [] };
    cur.bytes += e.params.encodedDataLength;
    cur.n += 1;
    cur.top.push([e.params.encodedDataLength, u.replace('http://localhost:3100', '').slice(0, 90)]);
    byType.set(kind, cur);
  }
}

const vitals = await send('Runtime.evaluate', {
  expression: `(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const lcp = performance.getEntriesByType('largest-contentful-paint').pop();
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    let cls = 0;
    for (const e of performance.getEntriesByType('layout-shift') || []) if (!e.hadRecentInput) cls += e.value;
    return JSON.stringify({
      fcp: fcp ? Math.round(fcp.startTime) : null,
      lcp: lcp ? Math.round(lcp.startTime) : null,
      lcpEl: lcp ? (lcp.element ? lcp.element.tagName + '.' + (lcp.element.className||'').split(' ')[0] : lcp.url || '?') : null,
      cls: +cls.toFixed(4),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
    });
  })()`,
  returnByValue: true,
});

console.log(`\n${url}  @${w}px  (4x CPU throttle, 1.6 Mbps, 150ms RTT)`);
console.log('vitals:', vitals.result.value);
console.log('\ntransfer:');
let total = 0;
for (const [k, v] of [...byType.entries()].sort((a, b) => b[1].bytes - a[1].bytes)) {
  total += v.bytes;
  console.log(`  ${k.padEnd(6)} ${String(Math.round(v.bytes / 1024)).padStart(6)} KB  (${v.n} requests)`);
  for (const [b, u] of v.top.sort((a, b) => b[0] - a[0]).slice(0, 3)) {
    console.log(`         ${String(Math.round(b / 1024)).padStart(6)} KB  ${u}`);
  }
}
console.log(`  ${'TOTAL'.padEnd(6)} ${String(Math.round(total / 1024)).padStart(6)} KB`);

ws.close();
browser.kill();
process.exit(0);
