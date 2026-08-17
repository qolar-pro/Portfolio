'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * One file owns every curve and duration on the site.
 *
 * Carried over from D:\apps\portfolio\Portfolio\lib\motion.ts and
 * D:\apps\again\lawfirm\src\lib\motion.ts, which agreed on the vocabulary.
 * The change here is amplitude, not language: the old site moved things far
 * and fast enough to read as shake. Travel distances are roughly halved and
 * the settle is longer, so motion registers as weight rather than jitter.
 */

/** Signature curve: fast attack, long settle. */
export const EASE = 'expo.out';
export const EASE_INOUT = 'power2.inOut';

/** CSS twin of EASE, for transitions GSAP does not drive. */
export const EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';

export const DUR = {
  /** micro — hovers, small state flips */
  xs: 0.3,
  sm: 0.55,
  /** the workhorse */
  md: 0.9,
  lg: 1.3,
  /** hero entrances, long settles */
  xl: 2.0,
} as const;

export const STAGGER = {
  tight: 0.045,
  normal: 0.085,
  loose: 0.15,
} as const;

/** Travel distances. Deliberately short — this is the anti-shake dial. */
export const SHIFT = {
  /** default reveal rise */
  y: 24,
  /** display type, masked line wipes */
  line: 34,
  /** parallax drift over a full section pass */
  drift: 40,
} as const;

let registered = false;

/** Registers plugins and applies the vocabulary globally. Safe to call repeatedly. */
export function registerMotion() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: EASE, duration: DUR.md });
  registered = true;
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export { gsap, ScrollTrigger };
