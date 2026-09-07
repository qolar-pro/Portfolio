import type { MetadataRoute } from 'next';
import { ROUTES, href } from '@/lib/routes';
import { indexableLocales } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

/**
 * The sitemap `lib/routes.ts` has always claimed to feed.
 *
 * It was deleted in the Phase 0 rebrand along with the old single-entry
 * blancographics one and never rebuilt, so the route registry's promise —
 * "a route cannot exist without being reachable and cannot be reachable
 * without being indexed" — had no second consumer behind it. This restores it,
 * generated rather than hand-listed, so a new route in ROUTES is a new sitemap
 * entry with no further edit.
 *
 * Two rules this file exists to keep:
 *
 * 1. Every URL here must return 200 on the canonical host. A sitemap is a list
 *    of pages offered for indexing; a redirect is not a page. The previous
 *    production sitemap listed 36 apex URLs that each 308'd to www, which is
 *    why they were reported as "Page with redirect" rather than indexed.
 *
 * 2. Untranslated locales are excluded. They are served `noindex` (DD-10), and
 *    submitting a URL for indexing while telling search engines not to index it
 *    is a contradiction — it spends crawl budget to be refused.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const locales = indexableLocales();
  const lastModified = new Date();

  return locales.flatMap((locale) =>
    ROUTES.map((route) => {
      const entry: MetadataRoute.Sitemap[number] = {
        url: `${SITE_URL}${href(locale, route.path)}`,
        lastModified,
      };

      // hreflang belongs here only when there is a cluster to describe. With a
      // single written locale the alternates block would repeat the loc and
      // say nothing, matching the same rule in `localeAlternates`.
      if (locales.length > 1) {
        entry.alternates = {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}${href(l, route.path)}`]),
          ),
        };
      }

      return entry;
    }),
  );
}
