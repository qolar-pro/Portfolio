'use client';

import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction, ChromaticAberrationEffect } from 'postprocessing';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { journey } from '@/lib/journey';
import type { QualityTier } from '@/lib/quality';

/**
 * The cinematic grade, applied uniformly over the whole journey:
 * bloom lifts every emissive into neon, chromatic aberration hugs the
 * frame edges and swells with scroll velocity, film grain unifies the
 * image and kills banding, vignette pulls the eye center-frame.
 */
export default function Effects({ tier }: { tier: QualityTier }) {
  const caRef = useRef<ChromaticAberrationEffect>(null);

  useFrame(() => {
    const ca = caRef.current;
    if (!ca) return;
    const base = 0.0012;
    const kick = Math.min(Math.abs(journey.velocity) * 0.008, 0.006);
    ca.offset.set(base + kick, base + kick);
  });

  if (tier === 'low') {
    return (
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.7} luminanceThreshold={1} luminanceSmoothing={0.3} />
        <Vignette eskil={false} offset={0.25} darkness={0.7} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} luminanceSmoothing={0.25} />
      <ChromaticAberration ref={caRef} offset={[0.0012, 0.0012]} radialModulation modulationOffset={0.35} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.45} />
      <Vignette eskil={false} offset={0.22} darkness={0.78} />
    </EffectComposer>
  );
}
