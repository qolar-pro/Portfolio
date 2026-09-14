'use client';

import { useEffect, useState } from 'react';
import { ScrollTrigger, prefersReducedMotion, registerMotion } from '@/lib/motion';

/**
 * A fixed vertical rail tracking how far down a long page the reader is —
 * literally the "journey" the client asked for, on the page that's the
 * longest single scroll on the site (ten numbered lessons, no other
 * navigation to break it up).
 *
 * Whole-document progress, not a per-lesson one: a per-section version would
 * need a ref to every lesson, and the point here is one continuous read of
 * "how much is left", which is a document-level fact.
 *
 * Reduced motion doesn't get a stalled-at-0% rail — that reads as broken,
 * not as calm. It doesn't render at all; the page is just the page.
 */
export function JourneyRail({ steps }: { steps: number }) {
  const [progress, setProgress] = useState(0);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setEnabled(false);
      return;
    }
    registerMotion();
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setProgress(self.progress),
      onRefresh: (self) => setProgress(self.progress),
    });
    return () => st.kill();
  }, []);

  if (!enabled) return null;

  const active = Math.min(steps, Math.floor(progress * steps) + 1);

  return (
    <div className="journey-rail" aria-hidden="true">
      <span className="journey-n">{String(active).padStart(2, '0')}</span>
      <div className="journey-track">
        <div className="journey-fill" style={{ transform: `scaleY(${progress})` }} />
      </div>
      <span className="journey-n journey-total">{String(steps).padStart(2, '0')}</span>
    </div>
  );
}
