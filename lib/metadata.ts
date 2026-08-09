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
 */
export function localeAlternates(path: string, locale: Locale): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}${href(l, path)}`;
  }
  languages['x-default'] = `${SITE_URL}${href(ROOT_REDIRECT_LOCALE, path)}`;

  return {
    canonical: `${SITE_URL}${href(locale, path)}`,
    languages,
  };
}
