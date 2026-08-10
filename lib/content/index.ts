import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { localeAlternates } from '@/lib/metadata';
import { en } from './en';
import type { ContentRegistry, LocaleContent } from './types';

export * from './types';

/**
 * EL and MK are written in Phase 8 (DD-2: copy per market, not translation).
 * They are `null` here rather than aliases of `en`, because DD-10 exists
 * precisely to stop a locale quietly pretending to be finished — that is what
 * the old build did with four locales at once.
 */
export const content: ContentRegistry = {
  en,
  el: null,
  mk: null,
};

/**
 * Content for a locale, falling back to English where a locale is unwritten.
 *
 * The fallback is a deliberate, temporary compromise and it is the one thing
 * in this module worth being suspicious of. The routes exist and must render,
 * so something has to come back. What keeps this honest is that the fallback
 * is not silent: `isTranslated()` gates indexing, `pageMetadata()` marks
 * untranslated locales `noindex`, and `scripts/check-content-coverage.mjs`
 * reports them on every run.
 *
 * When Phase 8 lands, delete the fallback and make the return type non-null.
 */
export function contentFor(locale: Locale): LocaleContent {
  return content[locale] ?? en;
}

export function isTranslated(locale: Locale): boolean {
  return content[locale]?.status === 'complete';
}

export function untranslatedLocales(): Locale[] {
  return (Object.keys(content) as Locale[]).filter((l) => !isTranslated(l));
}

/**
 * Page metadata from content, plus canonical/hreflang, plus a `noindex` on any
 * locale whose copy is not written.
 *
 * The noindex matters commercially, not just tidily: an English page served at
 * a Greek URL competes with the real Greek page for the same queries once that
 * page exists, and search engines are slow to forgive that.
 */
export function pageMetadata(key: string, path: string, locale: Locale): Metadata {
  const meta = contentFor(locale).meta[key];
  const base: Metadata = {
    alternates: localeAlternates(path, locale),
  };

  if (meta) {
    base.title = key === 'home' ? { absolute: meta.title } : meta.title;
    base.description = meta.description;
  }

  if (!isTranslated(locale)) {
    base.robots = { index: false, follow: true };
  }

  return base;
}
