import 'server-only';

/**
 * What the server can tell about a request, and what it cannot.
 *
 * ── WHAT IS ACTUALLY AVAILABLE ───────────────────────────────────────
 * The IP arrives in `x-forwarded-for`. Vercel adds geo headers derived from
 * it — country, region, city — so location does not require a third-party
 * lookup or a database. Everything else (browser, language, screen,
 * timezone, referrer) comes from the client and is therefore *claimed*
 * rather than observed: any of it can be spoofed by anyone who wants to.
 * Treat it as reporting, never as identity.
 *
 * ── WHAT IS NOT AVAILABLE, AT ALL ────────────────────────────────────
 * An email address. There is no browser API that exposes one, on any
 * platform, with or without consent. A visitor's email is knowable only
 * because they typed it into a form — which is why the welcome panel
 * exists and why `nf_email` is set from it and read back here on later
 * visits. Any product claiming to "identify anonymous visitors by email"
 * is matching your IP against a purchased database and guessing.
 */

export interface RequestFacts {
  ip: string;
  country: string;
  region: string;
  city: string;
  ua: string;
  referer: string;
}

export function readRequest(req: Request): RequestFacts {
  const h = req.headers;
  const get = (k: string) => h.get(k)?.trim() || '';

  /* `x-forwarded-for` is a chain: client, then each proxy that touched it.
     The client is the first entry. Behind Vercel the rest are Vercel's own
     hops and are not interesting. */
  const fwd = get('x-forwarded-for');
  const ip = fwd ? fwd.split(',')[0].trim() : get('x-real-ip') || '';

  return {
    ip: ip || 'unknown',
    /* Vercel sets these at the edge from the same IP. They are absent in
       local development, which is why every one falls back rather than
       throwing — a missing header is normal, not an error. */
    country: get('x-vercel-ip-country'),
    region: get('x-vercel-ip-country-region'),
    city: decodeURIComponent(get('x-vercel-ip-city') || ''),
    ua: get('user-agent'),
    referer: get('referer'),
  };
}

/** "Thessaloniki, 54, GR" — whatever of it exists, in order. */
export function placeOf(f: RequestFacts) {
  const parts = [f.city, f.region, f.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'unknown';
}

/**
 * A readable browser and platform from the user-agent string.
 *
 * Deliberately shallow. Full UA parsing needs a library with a database
 * that goes stale, and the answer is only ever "roughly which browser" —
 * nothing here is load-bearing, so a handful of ordered checks is the right
 * amount of machinery. Order matters: Edge advertises Chrome, Chrome
 * advertises Safari, and every one of them advertises Mozilla.
 */
export function describeAgent(ua: string) {
  if (!ua) return { browser: 'unknown', os: 'unknown', bot: false };

  const bot = /\b(bot|crawler|spider|crawl|slurp|facebookexternalhit|headless|lighthouse|preview)\b/i.test(ua);

  const browser =
    /\bEdg\//.test(ua) ? 'Edge'
    : /\bOPR\/|\bOpera/.test(ua) ? 'Opera'
    : /\bSamsungBrowser/.test(ua) ? 'Samsung Internet'
    : /\bFirefox\//.test(ua) ? 'Firefox'
    : /\bChrome\//.test(ua) ? 'Chrome'
    : /\bSafari\//.test(ua) ? 'Safari'
    : 'other';

  const os =
    /\bWindows NT 10/.test(ua) ? 'Windows'
    : /\bWindows/.test(ua) ? 'Windows'
    : /\bAndroid/.test(ua) ? 'Android'
    : /\b(iPhone|iPad|iPod)/.test(ua) ? 'iOS'
    : /\bMac OS X/.test(ua) ? 'macOS'
    : /\bLinux/.test(ua) ? 'Linux'
    : 'other';

  return { browser, os, bot };
}
