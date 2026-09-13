import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { NextResponse } from 'next/server';
import { XRAY_CHECKS, type XrayCheckId } from '@/lib/content';
import { KIND, sendCard } from '@/lib/discord';
import { placeOf, readRequest } from '@/lib/request';

/**
 * Site X-ray: fetch a page a visitor names and check it against the list the
 * studio runs before a site ships.
 *
 * ── WHY IT DOES NOT USE PAGESPEED ────────────────────────────────────
 * Google's PageSpeed API was the obvious source and returns 429 without a key
 * — the anonymous quota is shared and permanently exhausted. Everything here
 * is measured directly instead: the server response, the markup, the headers.
 * It is less than a Lighthouse run and says so on the page; it is also fast,
 * free, and never down because someone else used the quota.
 *
 * ── THIS ENDPOINT FETCHES URLS STRANGERS TYPE ────────────────────────
 * That is a server-side request forgery surface, so every hop is checked:
 *   - http(s) only, default ports only, no credentials in the URL
 *   - the hostname is resolved and EVERY address must be public — loopback,
 *     private ranges, link-local (cloud metadata lives at 169.254.169.254),
 *     CGNAT and IPv6 unique-local are all refused
 *   - redirects are followed by hand, up to five, re-checking each hop, so a
 *     public page cannot bounce the fetch to an internal one
 *   - short timeout, and the body is capped at 2 MB
 *   - a small per-IP rate limit
 * DNS can in principle change between the check and the connection; for an
 * endpoint that only reads a public HTML page and returns pass/fail flags —
 * never the fetched body — that residual risk is accepted.
 */

export const runtime = 'nodejs';
export const maxDuration = 20;

const MAX_BYTES = 2 * 1024 * 1024;
const TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 5;

/* ---- rate limit: 6 checks a minute per IP, per instance ---- */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 6;
}

/* ---- address screening ---- */
function privateV4(ip: string) {
  const [a, b] = ip.split('.').map(Number);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}
function privateV6(ip: string) {
  const v = ip.toLowerCase();
  if (v === '::' || v === '::1') return true;
  if (v.startsWith('fc') || v.startsWith('fd')) return true;
  if (v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb')) return true;
  const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return mapped ? privateV4(mapped[1]) : false;
}
async function publicHost(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, '');
  if (!host || host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return false;
  const literal = isIP(host);
  const addrs = literal ? [{ address: host, family: literal }] : await lookup(host, { all: true });
  if (!addrs.length) return false;
  return addrs.every(({ address, family }) => (family === 6 ? !privateV6(address) : !privateV4(address)));
}

function normalise(raw: string): URL | null {
  let v = raw.trim();
  if (!v || v.length > 300) return null;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    if (u.username || u.password) return null;
    if (u.port && u.port !== '80' && u.port !== '443') return null;
    if (!u.hostname.includes('.')) return null;
    return u;
  } catch {
    return null;
  }
}

async function readCapped(res: Response) {
  const reader = res.body?.getReader();
  if (!reader) return { text: '', bytes: 0 };
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BYTES) {
      await reader.cancel();
      break;
    }
    chunks.push(value);
  }
  return { text: Buffer.concat(chunks).toString('utf8'), bytes };
}

type Fetched = { res: Response; finalUrl: URL; ttfb: number };

async function fetchChecked(start: URL): Promise<Fetched | null> {
  let url = start;
  const t0 = Date.now();
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!(await publicHost(url.hostname))) return null;
    const res = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        'user-agent': 'NovaFaberSiteXray/1.0 (+https://www.novafaber.com)',
        accept: 'text/html,application/xhtml+xml',
        'accept-encoding': 'br, gzip',
      },
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      await res.body?.cancel();
      const next = normalise(new URL(res.headers.get('location')!, url).toString());
      if (!next) return null;
      url = next;
      continue;
    }
    return { res, finalUrl: url, ttfb: Date.now() - t0 };
  }
  return null;
}

/* ---- the checks ---- */
const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))?.slice(2).find((x) => x != null);

function metaContent(html: string, key: string, value: string) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if ((attr(tag, key) ?? '').toLowerCase() === value) return attr(tag, 'content') ?? '';
  }
  return null;
}

function run(html: string, bytes: number, f: Fetched): Record<XrayCheckId, boolean> {
  const h = f.res.headers;
  const head = html.slice(0, 200_000);
  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].replace(/\s+/g, ' ').trim() ?? '';
  const description = metaContent(head, 'name', 'description');
  const robots = `${metaContent(head, 'name', 'robots') ?? ''} ${h.get('x-robots-tag') ?? ''}`;
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const described = imgs.filter((t) => attr(t, 'alt') !== undefined).length;
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? '';

  return {
    https: f.finalUrl.protocol === 'https:',
    speed: f.ttfb < 1000,
    weight: bytes < 250_000,
    compression: /br|gzip|zstd/i.test(h.get('content-encoding') ?? ''),
    title: title.length >= 10 && title.length <= 60,
    description: (description ?? '').trim().length >= 50,
    viewport: /width\s*=\s*device-width/i.test(metaContent(head, 'name', 'viewport') ?? ''),
    lang: Boolean(attr(htmlTag, 'lang')),
    h1: (html.match(/<h1\b/gi) ?? []).length === 1,
    alt: imgs.length === 0 || described / imgs.length >= 0.9,
    social: Boolean(metaContent(head, 'property', 'og:image') || metaContent(head, 'name', 'og:image')),
    indexable: !/noindex/i.test(robots),
    security: Boolean(h.get('strict-transport-security')) && /nosniff/i.test(h.get('x-content-type-options') ?? ''),
  };
}

export async function POST(req: Request) {
  const facts = readRequest(req);
  if (limited(facts.ip)) return NextResponse.json({ ok: false, error: 'busy' }, { status: 429 });

  let body: { url?: unknown; consent?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  const target = normalise(String(body.url ?? ''));
  if (!target) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });

  let fetched: Fetched | null = null;
  let page = { text: '', bytes: 0 };
  try {
    fetched = await fetchChecked(target);
    if (fetched && fetched.res.ok) page = await readCapped(fetched.res);
  } catch {
    fetched = null;
  }
  if (!fetched || !fetched.res.ok) {
    return NextResponse.json({ ok: false, error: 'failed' }, { status: 200 });
  }

  const results = run(page.text, page.bytes, fetched);
  const passed = XRAY_CHECKS.filter((k) => results[k]).length;
  const failing = XRAY_CHECKS.filter((k) => !results[k]);

  /* The page tells the visitor their address goes to the studio. Location is
     attached only when they have also accepted analytics — checking a site is
     not a request to be located. */
  const consented = body.consent === 'granted';
  await sendCard({
    author: 'novafaber.com · Site X-ray',
    title: `🔎 ${fetched.finalUrl.hostname} — ${passed}/${XRAY_CHECKS.length}`,
    url: fetched.finalUrl.toString(),
    description: failing.length ? `Failing: ${failing.join(', ')}` : 'Everything passes.',
    color: passed >= 11 ? KIND.newsletter : passed >= 7 ? KIND.lead : KIND.leadBig,
    fields: [
      { name: '⏱️ First byte', value: `${fetched.ttfb} ms`, inline: true },
      { name: '📦 HTML', value: `${Math.round(page.bytes / 1024)} KB`, inline: true },
      { name: '📍 Where', value: consented ? placeOf(facts) : 'not shared', inline: true },
    ],
    footer: passed <= 8 ? 'Plenty to fix — a warm lead if they get in touch' : 'Site X-ray',
  });

  return NextResponse.json({
    ok: true,
    url: fetched.finalUrl.toString(),
    passed,
    total: XRAY_CHECKS.length,
    ttfb: fetched.ttfb,
    kb: Math.round(page.bytes / 1024),
    results,
  });
}
