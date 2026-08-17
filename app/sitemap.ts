import type { MetadataRoute } from 'next';
import { articles } from '@/lib/blog';
import { LANGS, ROUTES } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

/**
 * Every URL, in every language, with its translations declared alongside it.
 *
 * The `alternates.languages` block is the sitemap equivalent of hreflang: it
 * tells Google that /en/work, /el/work and /mk/work are the same page in three
 * languages rather than three thin pages competing with each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /** The hreflang set for one path, shared by all three locale entries. */
  const languagesFor = (path: string) =>
    Object.fromEntries(LANGS.map((l) => [l, `${SITE_URL}/${l}${path}`]));

  return LANGS.flatMap((lang) => [
    {
      url: `${SITE_URL}/${lang}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 1,
      alternates: { languages: languagesFor('') },
    },
    ...Object.values(ROUTES).map((path) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: { languages: languagesFor(path) },
    })),
    ...articles[lang].map((a) => ({
      url: `${SITE_URL}/${lang}/blog/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
      // articles share a slug across locales, so they translate cleanly too
      alternates: { languages: languagesFor(`/blog/${a.slug}`) },
    })),
  ]);
}
