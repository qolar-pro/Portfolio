'use client';

import Lenis from 'lenis';
import { useEffect, type ReactNode } from 'react';
import { ScrollTrigger, gsap, prefersReducedMotion, registerMotion } from '@/lib/motion';

/**
 * Smooth scroll, driven from GSAP's ticker so Lenis and ScrollTrigger share
 * one clock. Without this the pinned process panel drifts against the page.
 *
 * Under prefers-reduced-motion Lenis never starts — native scrolling only.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      // gentler than the old site: longer glide, no rubber-band overshoot
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // hash links and the nav both scroll through Lenis so nothing fights it
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
