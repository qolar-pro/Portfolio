'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '@/components/AppState';
import { gsap, registerGsap } from '@/lib/motion';
import { journey } from '@/lib/journey';

/**
 * The capability ticker between hero and about. Loops forever;
 * scroll velocity feeds its speed so it surges as you move.
 */
export default function Marquee() {
  const { t } = useApp();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const track = trackRef.current;
    if (!track) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
      const speed = () => {
        tween.timeScale(1 + Math.min(Math.abs(journey.velocity) * 6, 5));
      };
      gsap.ticker.add(speed);
      return () => {
        gsap.ticker.remove(speed);
        tween.kill();
      };
    });
    return () => mm.revert();
  }, [t]);

  const items = [...t.marquee, ...t.marquee];

  return (
    <div className="relative overflow-hidden border-y border-fog/8 py-5" aria-hidden>
      <div ref={trackRef} className="flex w-max items-center whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6 font-display text-sm font-medium tracking-[0.2em] text-mist uppercase md:text-base">
              {item}
            </span>
            <span className={`text-lg ${i % 3 === 0 ? 'text-volt' : i % 3 === 1 ? 'text-plasma' : 'text-flare'}`}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
