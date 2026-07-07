# Apex Solutions — blancographics.xyz

The portfolio site of Giannis Papadopoulos / Apex Solutions: a single continuous 3D
environment the camera descends through as you scroll — chrome hero object, neon nebula
backdrop, per-section set pieces, and a cinematic post-processing grade.

## Stack

- **Next.js 15** (App Router, TypeScript, static export-ready)
- **React Three Fiber + drei** — 3D scene, procedural neon studio lighting
- **GSAP + ScrollTrigger + Lenis** — smooth scroll, master camera timeline, reveals
- **@react-three/postprocessing** — bloom, chromatic aberration, film grain, vignette
- **Tailwind CSS 4** — DOM layout and design tokens

## Architecture

- `lib/journey.ts` — frame-rate-hot shared state bridging DOM scroll and the WebGL camera
- `lib/motion.ts` — the single motion vocabulary (easings/durations) used site-wide
- `lib/quality.tsx` — device tiers: `high` / `low` / `static` (no-WebGL CSS fallback)
- `lib/i18n.ts` — EN + EL content (DE/FR/MK/IT slots scaffolded, falling back to EN)
- `components/canvas/` — scene, camera rig, hero object, nebula shader, set pieces, post
- `components/sections/` — the six content sections choreographed to camera stations

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint    # typecheck
```

Fonts (Clash Display, General Sans, JetBrains Mono) are bundled locally in `app/fonts/`
via `next/font/local` — no external font requests.
