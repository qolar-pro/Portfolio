'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Device quality tiers.
 *  - high:   full scene, full post-processing, dpr up to 2
 *  - low:    reduced particle counts / lighter post, dpr capped at 1.5
 *  - static: no WebGL at all — CSS/gradient fallbacks, motion minimized
 */
export type QualityTier = 'high' | 'low' | 'static';

export interface Quality {
  tier: QualityTier;
  dpr: [number, number];
  reducedMotion: boolean;
  isTouch: boolean;
}

const DEFAULT_QUALITY: Quality = {
  tier: 'high',
  dpr: [1, 2],
  reducedMotion: false,
  isTouch: false,
};

function detect(): Quality {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  let webgl2 = false;
  try {
    const canvas = document.createElement('canvas');
    webgl2 = !!canvas.getContext('webgl2');
  } catch {
    webgl2 = false;
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;

  if (reducedMotion || !webgl2) {
    return { tier: 'static', dpr: [1, 1], reducedMotion, isTouch };
  }
  if (isTouch && memory <= 2) {
    return { tier: 'static', dpr: [1, 1], reducedMotion, isTouch };
  }
  if (isTouch || memory <= 4 || cores <= 4) {
    return { tier: 'low', dpr: [1, 1.5], reducedMotion, isTouch };
  }
  return { tier: 'high', dpr: [1, 2], reducedMotion, isTouch };
}

const QualityContext = createContext<Quality>(DEFAULT_QUALITY);

export function QualityProvider({ children }: { children: React.ReactNode }) {
  // Start with the optimistic default so SSR markup is stable, then refine on mount.
  const [quality, setQuality] = useState<Quality>(DEFAULT_QUALITY);

  useEffect(() => {
    setQuality(detect());
  }, []);

  return <QualityContext.Provider value={quality}>{children}</QualityContext.Provider>;
}

export function useQuality() {
  return useContext(QualityContext);
}
