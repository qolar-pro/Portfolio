import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://blancographics.xyz/sitemap.xml',
    host: 'https://blancographics.xyz',
  };
}
