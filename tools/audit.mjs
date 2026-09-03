/**
 * Behaviour audit (dev tooling, not shipped).
 *
 * Checks the things a screenshot cannot: that the whole experience survives
 * prefers-reduced-motion, that the mobile menu traps focus and closes on
 * Escape, that the theme persists across a navigation and a language switch
 * with no flash, and that headings, landmarks and alt text hold up.
 *
 *   npm run qa:audit
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9335;
/* Edge refuses a --user-data-dir that does not exist, and resolves a
   relative one against its own cwd rather than ours. */
const outDir = resolvePath(process.argv[2] ?? '.qa');
mkdirSync(outDir, { recursive: true });
const BASE = 'http://localhost:3100';

const browser = spawn(
  EDGE,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--no-first-run',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + resolvePath(outDir, 'edge-a11y'),
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
const evaluate = async (expression, awaitPromise = false) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + JSON.stringify(r.exceptionDetails.exception?.description));
  return r.result.value;
};

await send('Page.enable');
await send('Runtime.enable');

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};

const goto = async (url, wait = 2200) => {
  await send('Page.navigate', { url });
  await sleep(wait);
};

const media = (features) => send('Emulation.setEmulatedMedia', { features });
const viewport = (width, height) =>
  send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700 });

/* ---------------------------------------------------------------- 1. reduced motion */
await viewport(1440, 900);
await media([
  { name: 'prefers-reduced-motion', value: 'reduce' },
  { name: 'prefers-color-scheme', value: 'dark' },
]);

for (const route of ['/en', '/en/work', '/en/process', '/en/services']) {
  await goto(BASE + route);
  const hidden = await evaluate(`(() => {
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      /* The inert attribute marks the closed mobile sheet: hidden by
         design, out of the a11y tree, not content anyone is waiting on. */
      if (el.closest('[aria-hidden="true"]') || el.closest('[inert]')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const txt = el.textContent.trim();
      if (txt.length < 3) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (parseFloat(cs.opacity) < 0.55) {
        out.push((el.tagName.toLowerCase() + '.' + (el.getAttribute('class')||'').split(' ')[0]) + ' op=' + cs.opacity + ' "' + txt.slice(0,32) + '"');
      }
    }
    return [...new Set(out)].slice(0, 8);
  })()`);
  check(`reduced-motion: nothing hidden on ${route}`, hidden.length === 0, hidden.join(' | '));

  const stats = await evaluate(
    `[...document.querySelectorAll('.stat .v')].map(n => n.textContent.trim()).join(',')`,
  );
  if (route === '/en') check('reduced-motion: stats show real values', stats === '5,5,100%', stats);
}

/* ---------------------------------------------------------------- 2. no-JS-style guarantee */
await media([
  { name: 'prefers-reduced-motion', value: 'no-preference' },
  { name: 'prefers-color-scheme', value: 'dark' },
]);
await goto(BASE + '/en', 3000);
// wait past the safety timeout without ever scrolling
await sleep(2600);
const stillHidden = await evaluate(`
  [...document.querySelectorAll('.rv')].filter(el => !el.classList.contains('rv-in')).length
`);
check('reveal safety net: nothing left armed after 2.5s', stillHidden === 0, String(stillHidden));

/* ---------------------------------------------------------------- 3. mobile menu */
await viewport(390, 844);
await goto(BASE + '/en');

await evaluate(`document.querySelector('.burger').click()`);
await sleep(500);
const openState = await evaluate(`JSON.stringify({
  expanded: document.querySelector('.burger').getAttribute('aria-expanded'),
  sheetInert: document.getElementById('nav-sheet').hasAttribute('inert'),
  locked: document.body.classList.contains('is-locked'),
  focusInSheet: !!document.getElementById('nav-sheet').contains(document.activeElement),
})`);
const o = JSON.parse(openState);
check('menu opens: aria-expanded=true', o.expanded === 'true');
check('menu opens: sheet is not inert', o.sheetInert === false);
check('menu opens: background scroll locked', o.locked === true);
check('menu opens: focus moved into the sheet', o.focusInSheet === true);

// Escape closes and returns focus to the trigger
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await sleep(450);
const closed = JSON.parse(
  await evaluate(`JSON.stringify({
    expanded: document.querySelector('.burger').getAttribute('aria-expanded'),
    inert: document.getElementById('nav-sheet').hasAttribute('inert'),
    locked: document.body.classList.contains('is-locked'),
    focusOnBurger: document.activeElement === document.querySelector('.burger'),
  })`),
);
check('Escape closes the menu', closed.expanded === 'false');
check('closed sheet is inert (out of the tab order)', closed.inert === true);
check('scroll lock released', closed.locked === false);
check('focus returns to the button that opened it', closed.focusOnBurger === true);

/* ---------------------------------------------------------------- 4. theme persistence */
await viewport(1440, 900);
await goto(BASE + '/en');
await evaluate(`document.querySelector('.theme-toggle').click()`);
await sleep(700);
const afterToggle = await evaluate(`document.documentElement.getAttribute('data-theme')`);
check('toggle flips the theme', afterToggle === 'light', String(afterToggle));

// a hard navigation to another route, then to another language
await goto(BASE + '/en/work');
const afterRoute = await evaluate(`document.documentElement.getAttribute('data-theme')`);
check('theme survives a route change', afterRoute === 'light', String(afterRoute));

await goto(BASE + '/mk/work');
const afterLang = await evaluate(`document.documentElement.getAttribute('data-theme')`);
check('theme survives a language switch', afterLang === 'light', String(afterLang));

await goto(BASE + '/el/contact');
const afterLang2 = await evaluate(`document.documentElement.getAttribute('data-theme')`);
check('theme survives a second language switch', afterLang2 === 'light', String(afterLang2));

// no flash: data-theme has to be set before the first stylesheet-driven paint,
// which means it is present in the very first evaluation after navigation
await send('Page.navigate', { url: BASE + '/en' });
await sleep(120);
const early = await evaluate(`document.documentElement.getAttribute('data-theme')`).catch(() => null);
check('no flash of wrong theme: data-theme set before paint', early === 'light', String(early));

// system preference is followed when the visitor has made no choice
await evaluate(`localStorage.removeItem('nf-theme')`);
await media([
  { name: 'prefers-color-scheme', value: 'light' },
  { name: 'prefers-reduced-motion', value: 'no-preference' },
]);
await goto(BASE + '/en');
const sysLight = await evaluate(`document.documentElement.getAttribute('data-theme')`);
check('with no stored choice, follows prefers-color-scheme: light', sysLight === 'light', String(sysLight));

await media([
  { name: 'prefers-color-scheme', value: 'dark' },
  { name: 'prefers-reduced-motion', value: 'no-preference' },
]);
await goto(BASE + '/en');
const sysDark = await evaluate(`document.documentElement.getAttribute('data-theme')`);
check('with no stored choice, follows prefers-color-scheme: dark', sysDark === 'dark', String(sysDark));

/* ---------------------------------------------------------------- 5. structure */
for (const route of ['/en', '/en/work', '/en/services', '/en/process', '/en/about', '/en/contact', '/en/blog', '/en/blog/rebuild-or-redesign', '/en/privacy']) {
  await goto(BASE + route, 1800);
  const s = JSON.parse(
    await evaluate(`(() => {
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .filter(h => !h.closest('[aria-hidden="true"]'))
        .map(h => +h.tagName[1]);
      let jumps = [];
      for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i-1] > 1) jumps.push(hs[i-1] + '->' + hs[i]);
      const imgs = [...document.querySelectorAll('img')];
      return JSON.stringify({
        h1: document.querySelectorAll('h1').length,
        jumps,
        main: document.querySelectorAll('main').length,
        skip: !!document.querySelector('.skip-link'),
        noAlt: imgs.filter(i => i.getAttribute('alt') === null).map(i => i.getAttribute('src')).slice(0,4),
        unlabelled: [...document.querySelectorAll('button, a')]
          .filter(el => !el.closest('[inert]') && !el.textContent.trim() && !el.getAttribute('aria-label') && !el.getAttribute('title'))
          .map(el => el.tagName + '.' + (el.getAttribute('class')||'').split(' ')[0]).slice(0,4),
        /* An aria-hidden control is removed from the accessibility tree, so a
           label requirement is meaningless for it — that is exactly what a
           honeypot field is. It is only legitimate while the control is also
           unfocusable, so the focusable case is caught separately below
           rather than quietly exempted with it. */
        inputsNoLabel: [...document.querySelectorAll('input,select,textarea')]
          .filter(el => el.getAttribute('aria-hidden') !== 'true')
          .filter(el => el.type !== 'hidden')
          .filter(el => !el.labels?.length && !el.getAttribute('aria-label')).length,
        ariaHiddenFocusable: [...document.querySelectorAll('[aria-hidden="true"]')]
          .filter(el => el.matches('a[href],button,input,select,textarea,[tabindex]'))
          .filter(el => el.tabIndex >= 0)
          .map(el => el.tagName.toLowerCase() + '[name=' + (el.getAttribute('name')||'') + ']')
          .slice(0, 4),
      });
    })()`),
  );
  check(`${route}: exactly one h1`, s.h1 === 1, 'found ' + s.h1);
  check(`${route}: no heading level skipped`, s.jumps.length === 0, s.jumps.join(','));
  check(`${route}: one <main> with a skip link`, s.main === 1 && s.skip);
  check(`${route}: every img has alt`, s.noAlt.length === 0, s.noAlt.join(','));
  check(`${route}: no unlabelled control`, s.unlabelled.length === 0, s.unlabelled.join(','));
  check(`${route}: every form control labelled`, s.inputsNoLabel === 0, String(s.inputsNoLabel));
  check(
    `${route}: nothing aria-hidden is focusable`,
    s.ariaHiddenFocusable.length === 0,
    s.ariaHiddenFocusable.join(','),
  );
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) {
  console.log('\nFAILURES:');
  for (const f of failed) console.log('  ' + f.name + (f.detail ? '  — ' + f.detail : ''));
}

ws.close();
browser.kill();
process.exit(failed.length ? 1 : 0);
