'use client';

import dynamic from 'next/dynamic';
import StaticBackdrop from '@/components/StaticBackdrop';
import { useQuality } from '@/lib/quality';

// The entire three.js payload stays out of the initial bundle —
// it loads only when a WebGL-capable tier asks for it.
const Scene = dynamic(() => import('./Scene'), { ssr: false });

export default function CanvasRoot() {
  const { tier } = useQuality();

  if (tier === 'static') return <StaticBackdrop />;

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Scene />
    </div>
  );
}
