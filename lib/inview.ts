'use client';

import { useEffect, type RefObject } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * One IntersectionObserver helper, shared by every reveal on the site.
 *
 * WHY NOT ScrollTrigger FOR THIS
 * Reveals used to be `gsap.from(el, { opacity: 0, scrollTrigger })`. That has
 * a failure mode a content site cannot afford: GSAP writes opacity:0 onto the
 * element the moment the component mounts, and the ONLY thing that ever
 * writes it back is the trigger firing. If ScrollTrigger's cached positions
 * go stale — a webfont swapping and reflowing the page, the pinned process
 * panel changing the document height, a refresh that never runs — the section
 * stays invisible. Blank content is a far worse bug than an un-animated
 * reveal, and it is silent.
 *
 * This inverts the guarantee:
 *   - the element renders visible, in the markup, always;
 *   - JS hides it only if it is genuinely below the fold at mount;
 *   - an IntersectionObserver shows it again;
 *   - and a timeout shows everything regardless, so no failure of the
 *     observer, the callback or the browser can leave content hidden.
 *
 * It is also cheaper: one observer entry per element and no scroll handler,
 * versus a ScrollTrigger instance per element recalculating on every resize.
 */

/** Nothing stays hidden longer than this, whatever else goes wrong. */
const SAFETY_MS = 2500;

export interface InViewOptions {
  /** Fires once when the element first enters. */
  onEnter: () => void;
  /** Applied before observing, but ONLY if the element starts below the fold. */
  onArm?: () => void;
  /** How far below the viewport to start. Matches the old `top 85%` trigger. */
  rootMargin?: string;
  /** Skip everything and just call onEnter — used for reduced motion. */
  disabled?: boolean;
}

export function useInView(
  ref: RefObject<HTMLElement | null>,
  { onEnter, onArm, rootMargin = '0px 0px -12% 0px', disabled }: InViewOptions,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Reduced motion, or no observer at all: show the finished state now.
       There is no in-between worth building — the information is the point. */
    if (disabled || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      onEnter();
      return;
    }

    /* Anything already on screen at mount is not "revealed on scroll", it is
       just there. Arming it would flash it out and back in. */
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    if (alreadyVisible) {
      onEnter();
      return;
    }

    onArm?.();

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      io.disconnect();
      window.clearTimeout(safety);
      onEnter();
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) finish();
      },
      { rootMargin, threshold: 0 },
    );
    io.observe(el);

    /* The guarantee. If the observer never fires — a browser bug, a
       display:none ancestor, a container query that never resolves — the
       content appears anyway, animated or not. */
    const safety = window.setTimeout(finish, SAFETY_MS);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
