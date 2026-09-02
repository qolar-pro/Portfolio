'use client';

import Lenis from 'lenis';
import { useEffect, type ReactNode } from 'react';
import { ScrollTrigger, gsap, prefersReducedMotion, registerMotion } from '@/lib/motion';

/**
 * Smooth scroll, driven from GSAP's ticker so Lenis and ScrollTrigger share
 * one clock. Without this the pinned process panel drifts against the page.
 *
 * ── POINTER-BASED, NOT VIEWPORT-BASED ────────────────────────────────
 * Lenis runs on mouse and trackpad only. A phone already has momentum
 * scrolling, tuned by the OS, that people have spent years learning the feel
 * of; replacing it with a JS easing curve makes the page feel heavy and
 * slightly broken in a way nobody can name, and it costs a requestAnimationFrame
 * every frame of every scroll on the device least able to spare one. The
 * pinned panel it exists to stabilise is desktop-only anyway.
 *
 * Under prefers-reduced-motion it never starts at all — native scrolling only.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerMotion();
    if (prefersReducedMotion()) return;

    /* `pointer: coarse` is the honest test: it asks what the visitor is
       actually touching the screen with, rather than guessing from a width
       that a small laptop window would also match. */
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse) return;

    const lenis = new Lenis({
      // gentler than the old site: longer glide, no rubber-band overshoot
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.9,
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
