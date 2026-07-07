import type { MetadataRoute } from 'next';

// Single-page studio site — one canonical entry.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://blancographics.xyz',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
