'use client';

import { useEffect } from 'react';
import { gsap, registerGsap } from '@/lib/motion';
import { journey } from '@/lib/journey';
import { useQuality } from '@/lib/quality';

/**
 * The DOM leans into the scroll: page content shears by a few tenths of a
 * degree per unit of scroll velocity and springs back at rest — the same
 * energy the camera roll and particle flares already carry, applied to type.
 */
export default function VelocitySkew({ targetId = 'site-main' }: { targetId?: string }) {
  const { reducedMotion, isTouch } = useQuality();

  useEffect(() => {
    if (reducedMotion || isTouch) return;
    registerGsap();
    const el = document.getElementById(targetId);
    if (!el) return;

    let current = 0;
    const tick = () => {
      const target = gsap.utils.clamp(-3.2, 3.2, journey.velocity * 7);
      current += (target - current) * 0.12;
      // snap tiny residuals so the page truly rests
      if (Math.abs(current) < 0.002 && Math.abs(target) < 0.002) {
        if (el.style.transform) gsap.set(el, { skewY: 0, clearProps: 'transform' });
        return;
      }
      gsap.set(el, { skewY: current, transformOrigin: '50% 50%', force3D: true });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      gsap.set(el, { clearProps: 'transform' });
    };
  }, [targetId, reducedMotion, isTouch]);

  return null;
}
