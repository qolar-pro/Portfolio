import type { Metadata } from 'next';
import { BRAND, LANGS, type Lang } from '@/lib/content';

/**
 * Everything Google needs to file this site correctly, in one place.
 *
 * `SITE_URL` is the canonical origin. It can be overridden per environment
 * with NEXT_PUBLIC_SITE_URL — set that on Vercel previews so a preview build
 * never publishes canonicals pointing at production (or vice versa).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novafaber.com').replace(
  /\/$/,
  '',
);

/** Open Graph wants full locales, not the two-letter codes the routes use. */
export const OG_LOCALE: Record<Lang, string> = {
  en: 'en_US',
  el: 'el_GR',
  mk: 'mk_MK',
};

/**
 * hreflang for one path, in every language it exists in.
 *
 * `x-default` points at English: it is what a searcher in a language we do not
 * publish should land on, and without it Google picks for us.
 *
 * `path` is the part AFTER the language segment — '' for a locale home page,
 * '/work' for the work route.
 */
export function alternatesFor(lang: Lang, path = ''): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of LANGS) languages[l] = `${SITE_URL}/${l}${path}`;
  languages['x-default'] = `${SITE_URL}/en${path}`;

  return { canonical: `${SITE_URL}/${lang}${path}`, languages };
}

/**
 * Per-page metadata.
 *
 * This exists because Next merges metadata down the tree: a canonical set once
 * in the layout is inherited by every route under it, which would tell Google
 * that /en/work, /en/about and the rest are all duplicates of /en. Each route
 * therefore declares its own, and this keeps that to one call.
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
  images,
}: {
  lang: Lang;
  path?: string;
  title: string;
  description: string;
  images?: NonNullable<NonNullable<Metadata['openGraph']>['images']>;
}): Metadata {
  const url = `${SITE_URL}/${lang}${path ?? ''}`;

  /**
   * The generated card at app/[lang]/opengraph-image.tsx is only attached
   * automatically to the segment it sits in — /en picks it up, /en/work does
   * not. Naming it here gives every route the locale's card instead of a bare
   * grey box in WhatsApp and Slack.
   */
  const card = images ?? [
    {
      url: `${SITE_URL}/${lang}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: `${BRAND} — ${lang}`,
    },
  ];

  return {
    title,
    description,
    alternates: alternatesFor(lang, path),
    openGraph: {
      title,
      description,
      url,
      siteName: BRAND,
      locale: OG_LOCALE[lang],
      type: 'website',
      images: card,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: card,
    },
  };
}
