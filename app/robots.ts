import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Next's build artefacts are not pages and have no business in an index
        // /_next/ is build output; /mockups is the internal picking board
        disallow: ['/_next/', '/en/mockups', '/el/mockups', '/mk/mockups'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
