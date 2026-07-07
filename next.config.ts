import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three/drei/postprocessing ship modern ESM; keep them out of the server bundle transform path
  transpilePackages: ['three'],
  // pin file-tracing to this project so a lockfile in a parent dir can't hijack the root
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
};

export default nextConfig;
