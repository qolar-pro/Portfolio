'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/motion';
import { journey } from '@/lib/journey';
import { useApp } from '@/components/AppState';
import { useQuality } from '@/lib/quality';

/**
 * Lenis ↔ GSAP bridge. Lenis produces the scroll, GSAP's ticker drives it,
 * ScrollTrigger listens to it. Also feeds journey.velocity for the scene.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const { loaded, brandKitOpen, previewUrl } = useApp();
  const { reducedMotion } = useQuality();

  useEffect(() => {
    if (reducedMotion) return;
    registerGsap();

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', () => {
      ScrollTrigger.update();
      // lenis velocity is px/frame-ish; normalize to a workable -1..1 band
      const v = gsap.utils.clamp(-1, 1, lenis.velocity / 60);
      journey.velocity += (v - journey.velocity) * 0.2;
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    journey.scrollTo = (target) => lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });

    return () => {
      gsap.ticker.remove(raf);
      journey.scrollTo = undefined;
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Freeze the page while the preloader or a modal owns the screen
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (!loaded || brandKitOpen || previewUrl) lenis.stop();
    else lenis.start();
  }, [loaded, brandKitOpen, previewUrl]);

  return <>{children}</>;
}
