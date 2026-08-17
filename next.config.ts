import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // the root layout lives under /[lang], so / sends visitors to the default locale
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }];
  },
  // pin file-tracing to this project so a lockfile in a parent dir can't hijack the root
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
};

export default nextConfig;
