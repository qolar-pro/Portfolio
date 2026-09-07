import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Deleted in the Phase 0 rebrand and never restored — the build has been
 * shipping without a robots.txt since, so the sitemap had nothing pointing at
 * it. Restored, with the two faults of the previous production file removed.
 *
 * No `Disallow: /_next/`. That rule reads as "keep crawlers out of build
 * internals" but it also blocks `/_next/image`, which is how every optimised
 * image on the site is served, plus the CSS and JS chunks Googlebot needs to
 * render a page at all. Blocking it costs image indexing and rendering
 * fidelity and buys nothing: `/_next/` holds no content worth withholding, and
 * hashed asset URLs are not going to rank against the pages that embed them.
 *
 * `host` is a Yandex-only directive that Google ignores. It is kept because
 * this market includes readers Yandex serves, and pinned to SITE_URL so it
 * cannot drift away from the canonical host the way the old one did — that
 * file named the apex while the site answered on www.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
