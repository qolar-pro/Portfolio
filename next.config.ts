import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Phase 9 owns the blancographics.xyz -> novafaber.com 301s (DD-6, SPEC §7).
  // Nothing here yet; the old domain must stay live until then.
};

export default nextConfig;
