'use client';

import { Canvas } from '@react-three/fiber';
import ForgeObject from './ForgeObject';
import { FULL, type GradeProfile } from '@/lib/grade';

/**
 * The canvas wrapper. Kept in its own module so the whole three.js dependency
 * sits behind one dynamic import and never reaches a reading page
 * (SPEC §3.2, enforced by scripts/check-no-webgl.mjs).
 *
 * The vignette is a CSS radial gradient rather than a post-processing pass.
 * `lib/grade.ts` specifies one, and adding @react-three/postprocessing to draw
 * a darkened edge would be a large dependency for something the browser
 * already does for free.
 */
export default function ForgeCanvas({
  detail,
  grade = FULL,
}: {
  detail: number;
  grade?: GradeProfile;
}) {
  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ForgeObject detail={detail} grade={grade} />
      </Canvas>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent ${
            grade.vignetteOffset * 100
          }%, rgba(0,0,0,${grade.vignetteDarkness}) 100%)`,
        }}
      />
    </div>
  );
}
