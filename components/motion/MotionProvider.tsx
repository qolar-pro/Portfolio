'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { ScrollTrigger, gsap, prefersReducedMotion, registerMotion } from '@/lib/motion';
import { refreshOnFontsReady } from '@/lib/scrollMotion';

/**
 * Smooth scroll, plus the two ScrollTrigger housekeeping jobs that every
 * scroll-linked section on the site depends on being done exactly once.
 *
 * ── 1. REFRESH AFTER THE FONTS LAND ──────────────────────────────────
 * ScrollTrigger resolves each trigger's start and end to PIXEL values when
 * the trigger is created, and caches them. The display face is loaded with
 * `display: swap`, so it arrives after first paint and reflows the whole
 * page underneath those cached numbers. Every scroll-linked animation then
 * fires at the wrong scroll position — a few pixels out on a short page,
 * and badly out by the footer of a long one. One refresh once
 * `document.fonts.ready` settles fixes all of them.
 *
 * ── 2. REFRESH AFTER A CLIENT NAVIGATION ─────────────────────────────
 * App Router swaps the tree without a document load. Triggers created by
 * the new route measure against a document that is still mid-swap, so they
 * cache positions for a layout that no longer exists a frame later.
 *
 * Both live here rather than in each section because they are page-level
 * facts, and because a refresh is global — every section paying for its own
 * would mean N refreshes for one reflow.
 *
 * ── SMOOTH SCROLL IS POINTER-BASED, NOT VIEWPORT-BASED ───────────────
 * Lenis runs on mouse and trackpad only. A phone already has momentum
 * scrolling, tuned by the OS, that people have spent years learning the feel
 * of; replacing it with a JS easing curve makes the page feel heavy in a way
 * nobody can name, and it costs a requestAnimationFrame every frame of every
 * scroll on the device least able to spare one.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    registerMotion();
    refreshOnFontsReady();
  }, []);

  /* A client navigation replaces the content under every trigger. Two frames
     of slack lets the new tree lay out before anything is measured. */
  useEffect(() => {
    const id = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => ScrollTrigger.refresh()),
    );
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    /* `pointer: coarse` is the honest test: it asks what the visitor is
       actually touching the screen with, rather than guessing from a width
       that a small laptop window would also match. */
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      // gentler than the old site: longer glide, no rubber-band overshoot
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.9,
    });

    /* Lenis and ScrollTrigger have to share one clock. Driving Lenis from
       GSAP's ticker rather than its own rAF is what stops a scrubbed
       timeline drifting a frame behind the scroll that drives it. */
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
