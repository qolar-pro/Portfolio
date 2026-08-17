import type { MetadataRoute } from 'next';
import { BRAND, content } from '@/lib/content';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND} — ${content.en.hero.tagline}`,
    short_name: BRAND,
    description: content.en.meta.description,
    start_url: '/en',
    display: 'standalone',
    background_color: '#141416',
    theme_color: '#141416',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
