'use client';

import { useEffect, useState } from 'react';

/**
 * Device quality tiers.
 *
 * `static` is not a degraded mode — it is a complete, deliberate rendering of
 * the hero with no WebGL at all. SPEC §3.4 requires this because a site whose
 * pitch is performance cannot ship a homepage that is blank on a mid-range
 * phone or for someone who has asked for reduced motion.
 */
export type QualityTier = 'high' | 'low' | 'static';

export interface Quality {
  tier: QualityTier;
  reducedMotion: boolean;
  /** Icosahedron subdivision. Vertex count scales roughly 4x per level. */
  detail: number;
}

function detectTier(): { tier: QualityTier; reducedMotion: boolean } {
  if (typeof window === 'undefined') return { tier: 'static', reducedMotion: false };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return { tier: 'static', reducedMotion };

  // No WebGL2 means no shader hero. Fall back rather than half-render.
  try {
    const canvas = document.createElement('canvas');
    if (!canvas.getContext('webgl2')) return { tier: 'static', reducedMotion };
  } catch {
    return { tier: 'static', reducedMotion };
  }

  // Coarse pointer plus low core count is a reasonable proxy for a phone that
  // will thermally throttle on a full-rate shader. Not exact, but the cost of
  // being wrong is one tier, not a broken page.
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse || cores <= 4) return { tier: 'low', reducedMotion };

  return { tier: 'high', reducedMotion };
}

const DETAIL: Record<QualityTier, number> = { high: 6, low: 4, static: 0 };

/**
 * Starts at `static` on every render, including the server, and only upgrades
 * after mount. That ordering is deliberate: the first paint is always the
 * no-WebGL hero, so nothing about the canvas can delay LCP or cause a
 * hydration mismatch.
 */
export function useQuality(): Quality {
  const [state, setState] = useState<{ tier: QualityTier; reducedMotion: boolean }>({
    tier: 'static',
    reducedMotion: false,
  });

  useEffect(() => {
    setState(detectTier());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setState(detectTier());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return { ...state, detail: DETAIL[state.tier] };
}
