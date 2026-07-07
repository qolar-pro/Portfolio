'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The single motion vocabulary for the entire site.
 * Every animation — GSAP or CSS — draws from these curves and durations
 * so the whole experience moves as one system.
 */

// Signature curve: fast attack, long cinematic settle (expo-out family)
export const EASE_OUT = 'expo.out';
export const EASE_INOUT = 'power2.inOut';
// CSS twin of EASE_OUT for transitions outside GSAP
export const CSS_EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

export const DUR = {
  xs: 0.3,
  sm: 0.6,
  md: 0.9,
  lg: 1.4,
  xl: 2.2,
} as const;

export const STAGGER = {
  tight: 0.045,
  base: 0.09,
  loose: 0.16,
} as const;

let registered = false;
export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: EASE_OUT, duration: DUR.md });
  registered = true;
}

export { gsap, ScrollTrigger };
