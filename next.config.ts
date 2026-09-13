import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // the root layout lives under /[lang], so / sends visitors to the default locale
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }];
  },
  /* Baseline security headers. Site X-ray flags a site without HSTS and nosniff,
     and this site failed its own check — so they are set here for every route.
     HSTS deliberately has no includeSubDomains or preload: both are hard to take
     back, and nothing needs them yet. A full Content-Security-Policy is left out
     on purpose; a wrong one breaks GSAP, analytics and the inline theme script. */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  // pin file-tracing to this project so a lockfile in a parent dir can't hijack the root
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
};

export default nextConfig;
