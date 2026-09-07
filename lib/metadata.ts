import type { Metadata } from 'next';
import { LOCALES, ROOT_REDIRECT_LOCALE, type Locale } from './locales';
import { href } from './routes';
import { SITE_URL } from './site';

/**
 * Canonical + hreflang for a route, derived from the locale list and the route
 * registry rather than hand-written per page.
 *
 * Hand-maintained hreflang is the classic way a multilingual tree rots: a page
 * gets added in two locales, the third is forgotten, and search quietly treats
 * them as unrelated. Generating from LOCALES means a new locale is one edit.
 *
 * `indexable` is passed in rather than imported, because the module that knows
 * which locales are written (`lib/content`) already imports this one. Taking it
 * as an argument keeps this module free of that cycle and free of content.
 *
 * Why it must be filtered at all: an hreflang cluster is a set of mutually
 * substitutable pages. Listing a `noindex` locale in it asks search engines to
 * treat a page it has been told to drop as an alternate of one it should keep,
 * which is a contradiction they resolve by distrusting the cluster. While EL
 * and MK are unwritten they are noindex (DD-10), so they are not alternates of
 * anything and must not appear here.
 */
export function localeAlternates(
  path: string,
  locale: Locale,
  indexable: readonly Locale[] = LOCALES,
): Metadata['alternates'] {
  const canonical = `${SITE_URL}${href(locale, path)}`;

  // One indexable locale is not a cluster — a single-entry hreflang set states
  // only that a page is an alternate of itself, which is no information at all.
  if (indexable.length < 2) return { canonical };

  const languages: Record<string, string> = {};
  for (const l of indexable) {
    languages[l] = `${SITE_URL}${href(l, path)}`;
  }

  const fallback = indexable.includes(ROOT_REDIRECT_LOCALE)
    ? ROOT_REDIRECT_LOCALE
    : indexable[0];
  languages['x-default'] = `${SITE_URL}${href(fallback, path)}`;

  return { canonical, languages };
}
