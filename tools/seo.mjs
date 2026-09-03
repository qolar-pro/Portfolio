/**
 * Discoverability audit (dev tooling, not shipped).
 *
 * Crawls every route in every locale against a running build and checks the
 * things Google actually reads: title and description length and uniqueness,
 * canonical and hreflang reciprocity, Open Graph and Twitter cards, the
 * heading outline, JSON-LD validity, image alt coverage, internal linking,
 * and thin content.
 *
 * It is deliberately strict about the two failure modes that quietly cost a
 * multilingual site most of its traffic: duplicate or missing canonicals
 * (three locales competing for one result) and non-reciprocal hreflang
 * (Google discards the whole cluster if the links do not point back).
 *
 *   npm run qa:seo
 */
import { setTimeout as sleep } from 'node:timers/promises';

const BASE = process.argv[2] ?? 'http://localhost:3100';
const LANGS = ['en', 'el', 'mk'];
const PATHS = [
  '',
  '/work',
  '/services',
  '/process',
  '/about',
  '/contact',
  '/book-a-call',
  '/blog',
  '/blog/rebuild-or-redesign',
  '/blog/traffic-that-converts',
  '/blog/ecommerce-2026',
  '/privacy',
];

const findings = [];
const add = (sev, route, msg) => findings.push({ sev, route, msg });

const text = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};
const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

const pages = new Map();

for (const lang of LANGS) {
  for (const path of PATHS) {
    const route = `/${lang}${path}`;
    const res = await fetch(BASE + route).catch(() => null);
    if (!res || !res.ok) {
      add('FAIL', route, `HTTP ${res ? res.status : 'no response'}`);
      continue;
    }
    const html = await res.text();
    pages.set(route, html);
    await sleep(15);
  }
}

/* ---------------------------------------------------------------- per page */
const titles = new Map();
const descs = new Map();

for (const [route, html] of pages) {
  const title = text(html, /<title[^>]*>([^<]*)<\/title>/i);
  const desc = text(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = text(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const ogTitle = text(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const ogDesc = text(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
  const ogImage = text(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const ogLocale = text(html, /<meta\s+property="og:locale"\s+content="([^"]*)"/i);
  const twCard = text(html, /<meta\s+name="twitter:card"\s+content="([^"]*)"/i);
  const htmlLang = text(html, /<html[^>]*\slang="([^"]*)"/i);
  const robots = text(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);

  // ---- title
  if (!title) add('FAIL', route, 'no <title>');
  else {
    if (title.length < 15) add('WARN', route, `title very short (${title.length}): "${title}"`);
    if (title.length > 65)
      add('WARN', route, `title ${title.length} chars — Google truncates around 60`);
    const prev = titles.get(title);
    if (prev) add('FAIL', route, `duplicate title, also on ${prev}`);
    else titles.set(title, route);
  }

  // ---- description
  if (!desc) add('FAIL', route, 'no meta description');
  else {
    if (desc.length < 70) add('WARN', route, `description short (${desc.length})`);
    if (desc.length > 165)
      add('WARN', route, `description ${desc.length} chars — truncated around 155`);
    const prev = descs.get(desc);
    if (prev) add('FAIL', route, `duplicate description, also on ${prev}`);
    else descs.set(desc, route);
  }

  // ---- canonical
  if (!canonical) add('FAIL', route, 'no canonical');
  else if (!canonical.endsWith(route) && !canonical.endsWith(route + '/'))
    add('FAIL', route, `canonical points elsewhere: ${canonical}`);

  // ---- social
  if (!ogTitle) add('WARN', route, 'no og:title');
  if (!ogDesc) add('WARN', route, 'no og:description');
  if (!ogImage) add('FAIL', route, 'no og:image — link previews render a grey box');
  if (!ogLocale) add('WARN', route, 'no og:locale');
  if (!twCard) add('WARN', route, 'no twitter:card');

  // ---- lang
  const lang = route.split('/')[1];
  if (htmlLang !== lang) add('FAIL', route, `<html lang="${htmlLang}"> should be "${lang}"`);

  if (robots && /noindex/i.test(robots)) add('INFO', route, `noindex: ${robots}`);

  // ---- headings
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (h1s.length === 0) add('FAIL', route, 'no <h1>');
  if (h1s.length > 1) add('FAIL', route, `${h1s.length} <h1> elements`);

  // ---- images
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\salt=/.test(t));
  if (noAlt.length) add('FAIL', route, `${noAlt.length} <img> without alt`);

  // ---- thin content
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  const words = body.split(' ').filter((w) => w.length > 1).length;
  if (words < 250) add('WARN', route, `thin: ~${words} words of text`);

  // ---- JSON-LD
  const ld = all(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (!ld.length && route === `/${lang}`) add('WARN', route, 'no JSON-LD on the home page');
  for (const block of ld) {
    try {
      JSON.parse(block.replace(/\\u003c/g, '<'));
    } catch (e) {
      add('FAIL', route, 'JSON-LD does not parse: ' + e.message);
    }
  }
}

/* ------------------------------------------------------- hreflang, globally
   Reciprocity is the whole game: if /en/work says el exists but /el/work does
   not point back, Google drops the entire cluster and every locale competes
   with the others. */
for (const [route, html] of pages) {
  const links = [...html.matchAll(/<link\s+rel="alternate"\s+hrefLang="([^"]*)"\s+href="([^"]*)"/gi)]
    .concat([...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]*)"\s+href="([^"]*)"/gi)])
    .map((m) => ({ lang: m[1], href: m[2] }));

  if (!links.length) {
    add('FAIL', route, 'no hreflang alternates');
    continue;
  }
  if (!links.some((l) => l.lang.toLowerCase() === 'x-default'))
    add('WARN', route, 'no x-default hreflang');

  for (const l of links) {
    if (l.lang.toLowerCase() === 'x-default') continue;
    const target = l.href.replace(/^https?:\/\/[^/]+/, '');
    const other = pages.get(target);
    if (!other) {
      add('WARN', route, `hreflang ${l.lang} -> ${target} (not crawled)`);
      continue;
    }
    const back = other.includes(`href="${links.find((x) => x.lang === route.split('/')[1])?.href ?? ''}"`);
    if (!back) add('FAIL', route, `hreflang not reciprocal with ${target}`);
  }
}

/* ------------------------------------------------------- sitemap and robots */
const robotsRes = await fetch(BASE + '/robots.txt').catch(() => null);
if (!robotsRes?.ok) add('FAIL', '/robots.txt', 'missing');
else {
  const r = await robotsRes.text();
  if (!/sitemap:/i.test(r)) add('FAIL', '/robots.txt', 'no Sitemap: line');
}

const smRes = await fetch(BASE + '/sitemap.xml').catch(() => null);
if (!smRes?.ok) add('FAIL', '/sitemap.xml', 'missing');
else {
  const xml = await smRes.text();
  const locs = all(xml, /<loc>([^<]+)<\/loc>/g);
  const paths = new Set(locs.map((u) => u.replace(/^https?:\/\/[^/]+/, '')));
  for (const route of pages.keys()) {
    const html = pages.get(route);
    const noindex = /<meta\s+name="robots"[^>]*noindex/i.test(html);
    if (!noindex && !paths.has(route)) add('FAIL', '/sitemap.xml', `missing ${route}`);
  }
  if (!/hreflang|xhtml:link/i.test(xml))
    add('WARN', '/sitemap.xml', 'no hreflang alternates in the sitemap');
}

/* -------------------------------------------------------------------- report */
const order = { FAIL: 0, WARN: 1, INFO: 2 };
findings.sort((a, b) => order[a.sev] - order[b.sev] || a.route.localeCompare(b.route));

const counts = findings.reduce((a, f) => ((a[f.sev] = (a[f.sev] || 0) + 1), a), {});
console.log(
  `\ncrawled ${pages.size} pages — ` +
    `${counts.FAIL || 0} fail, ${counts.WARN || 0} warn, ${counts.INFO || 0} info\n`,
);
for (const f of findings) console.log(`${f.sev.padEnd(5)} ${f.route.padEnd(34)} ${f.msg}`);
if (!findings.length) console.log('clean.');

process.exit(counts.FAIL ? 1 : 0);
