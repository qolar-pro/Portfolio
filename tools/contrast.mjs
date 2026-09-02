/**
 * Contrast audit (dev tooling, not shipped).
 *
 * Walks every text-bearing element on every route, in both themes, resolves
 * the ACTUAL painted background by climbing ancestors until it finds an
 * opaque one, and reports anything below WCAG AA for its size.
 *
 * This exists because a neumorphic dark theme is exactly the kind of design
 * where contrast is assumed rather than measured: soft shadows read as depth
 * and quietly invite text one shade too low. The tokens were chosen against
 * these numbers; this is what keeps them honest.
 *
 *   npm run qa:contrast
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9334;
/* Edge refuses a --user-data-dir that does not exist, and resolves a
   relative one against its own cwd rather than ours. */
const outDir = resolvePath(process.argv[2] ?? '.qa');
mkdirSync(outDir, { recursive: true });

const ROUTES = [
  '/en',
  '/en/work',
  '/en/services',
  '/en/process',
  '/en/about',
  '/en/contact',
  '/en/book-a-call',
  '/en/blog',
  '/en/blog/rebuild-or-redesign',
  '/el',
  '/mk',
  /* the picking board: the variants on it are candidates for the real
     site, so they are held to the same bar before one is chosen */
  '/en/mockups',
];

const browser = spawn(
  EDGE,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--no-first-run',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + resolvePath(outDir, 'edge-contrast'),
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
ws.addEventListener('message', (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
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

const AUDIT = `(() => {
  const parse = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(/[,\\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const L = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const ratio = (a, b) => { const l1 = L(a), l2 = L(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });

  /* The painted background is whatever the nearest opaque ancestor is, with
     every translucent layer between composited on top of it — which is the
     only way to score a token like rgba(accent, 0.09) honestly. */
  /* A gradient fill has no backgroundColor, so an element painted with one
     would otherwise be scored against the page behind it — which is how a
     teal button reads as 1.05:1 against a near-black page it never touches.
     Every colour stop is extracted and the WORST one is used, so a button is
     judged at its least legible point rather than its average. */
  const gradientStops = (bgImage) => {
    if (!bgImage || bgImage === 'none' || bgImage.indexOf('gradient(') === -1) return [];
    /* Split on 'rgb' rather than matching a regex. This whole audit is
       embedded in a template literal, where a lone backslash escape is eaten
       before the regex is ever compiled — which had turned /gradient\(/ into
       /gradient(/ and thrown on every page. String ops cannot lose a level. */
    const out = [];
    for (const part of bgImage.split('rgb').slice(1)) {
      const close = part.indexOf(')');
      if (close === -1) continue;
      const c = parse('rgb' + part.slice(0, close + 1));
      if (c && c.a > 0.5) out.push(c);
    }
    return out;
  };


  const bgOf = (el) => {
    const stack = [];
    let worstStop = null;
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      /* A gradient sized to 0% is not painted — that is how the secondary
         button parks its hover fill off-canvas. Scoring the label against a
         fill it is not sitting on reports a failure that does not exist. */
      const sized = cs.backgroundSize || '';
      const painted = !sized.startsWith('0%') && !sized.startsWith('0px');
      const stops = painted ? gradientStops(cs.backgroundImage) : [];
      if (stops.length) {
        worstStop = stops;
        stack.push({ ...stops[0], a: 1 });
        break;
      }
      const c = parse(cs.backgroundColor);
      if (!c || c.a === 0) continue;
      stack.push(c);
      if (c.a === 1) break;
    }
    let base = stack.pop() || { r: 255, g: 255, b: 255, a: 1 };
    while (stack.length) base = over(stack.pop(), base);
    return { base, stops: worstStop };
  };

  const bad = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('[aria-hidden="true"]')) continue;
    // only elements with their own visible text
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    /* A collapsed disclosure clips its panel to zero height. The rows inside
       still have boxes, so they pass the check above while being genuinely
       invisible — and unreadable text nobody can see is not a contrast bug. */
    let clippedAway = false;
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const nr = n.getBoundingClientRect();
      const ncs = getComputedStyle(n);
      if (nr.height < 2 && ncs.overflow !== 'visible') { clippedAway = true; break; }
      if (ncs.visibility === 'hidden' || ncs.display === 'none') { clippedAway = true; break; }
    }
    if (clippedAway) continue;

    const fg0 = parse(cs.color);
    if (!fg0) continue;
    const opacity = parseFloat(cs.opacity);
    const { base: bg, stops } = bgOf(el);
    // element opacity multiplies the text's own alpha against its background
    const fg = over({ ...fg0, a: fg0.a * (isNaN(opacity) ? 1 : opacity) }, bg);

    const px = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = px >= 24 || (px >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    // a gradient is only as good as its worst stop under the text
    const got = stops
      ? Math.min(...stops.map((st) => ratio(over({ ...fg0, a: fg0.a }, st), st)))
      : ratio(fg, bg);

    if (got < need) {
      const key = el.tagName + '.' + (el.getAttribute('class') || '') + '|' + Math.round(got * 100);
      if (seen.has(key)) continue;
      seen.add(key);
      bad.push({
        sel: el.tagName.toLowerCase() + (el.getAttribute('class') ? '.' + el.getAttribute('class').split(/\\s+/).slice(0, 2).join('.') : ''),
        text: el.textContent.trim().slice(0, 42),
        color: cs.color,
        px: Math.round(px),
        weight,
        ratio: +got.toFixed(2),
        need,
      });
    }
  }
  return JSON.stringify(bad);
})()`;

const findings = [];

for (const theme of ['dark', 'light']) {
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `try{localStorage.setItem('nf-theme','${theme}')}catch(e){}`,
  });
  for (const route of ROUTES) {
    await send('Page.navigate', { url: 'http://localhost:3100' + route });
    await sleep(2200);
    // scroll the whole page so every reveal has fired before measuring
    await send('Runtime.evaluate', {
      expression: `(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,45));}window.scrollTo(0,0);})()`,
      awaitPromise: true,
    });
    /* Settle the motion before measuring.

       The reveal system holds elements at opacity 0 until they are observed,
       and a scroll pass catches plenty of them mid-transition — which the
       audit then reports as 1:1 contrast on perfectly good text. Forcing the
       landed state measures the DESIGN rather than one frame of it. */
    await send('Runtime.evaluate', {
      expression: `(() => {
        const st = document.createElement('style');
        st.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'
          + '.anim-armed{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}'
          + '[data-anim-group].anim-armed > *{opacity:1!important;transform:none!important}';
        document.head.appendChild(st);
        document.querySelectorAll('.anim-armed').forEach(el => el.classList.add('anim-in'));
      })()`,
    });
    await sleep(500);
    const res = await send('Runtime.evaluate', { expression: AUDIT, returnByValue: true });
    if (res.exceptionDetails || typeof res.result.value !== 'string') {
      console.error('AUDIT FAILED on', route, JSON.stringify(res).slice(0, 600));
      process.exit(1);
    }
    for (const f of JSON.parse(res.result.value)) findings.push({ theme, route, ...f });
  }
}

if (!findings.length) {
  console.log('PASS — every text element meets WCAG AA in both themes, all routes.');
} else {
  console.log(`${findings.length} contrast failures:\n`);
  for (const f of findings) {
    console.log(
      `${f.theme.padEnd(5)} ${f.route.padEnd(30)} ${String(f.ratio).padStart(5)}:1 (need ${f.need}) ${f.px}px/${f.weight}  ${f.sel}  "${f.text}"`,
    );
  }
}

ws.close();
browser.kill();
process.exit(0);
