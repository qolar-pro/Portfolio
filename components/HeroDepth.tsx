'use client';

import { useRef } from 'react';
import { useScrubbed } from '@/lib/scrollMotion';

/**
 * Parallax between the hero's depth planes.
 *
 * The contour field already draws two layers at different scales; this makes
 * them move at different rates as the hero scrolls away, which is the only
 * thing that turns a texture into a space. The far plane travels least — a
 * distant object subtends less movement, and inverting that reads instantly
 * as wrong even to someone who could not say why.
 *
 * ── WHY THIS IS A COMPONENT AND NOT A CSS ANIMATION ───────────────────
 * Scroll-linked, not time-linked: the planes must sit still when the reader
 * does. `animation-timeline: scroll()` would do it in CSS but is not Baseline
 * (DD-1), so this goes through the same GSAP scrub every other scroll-linked
 * section on the site uses — one motion system, one place to kill it.
 *
 * Reduced motion is handled inside useScrubbed: it registers nothing and
 * writes no from-state, so the planes simply stay where the CSS puts them.
 * That is why the resting CSS has to be the finished look, never a start
 * frame waiting to be animated.
 *
 * Amplitude raised for the "Hard Impact" pass: the separation between planes
 * is now big enough to read as the hero physically pulling apart as you
 * leave it, not just a texture drifting a few pixels.
 */
export function HeroDepth({ target }: { target: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrubbed(
    ref,
    (tl, root) => {
      const host = root.closest(target) ?? root.parentElement;
      if (!host) return;

      const far = host.querySelector('.hero-contours-far');
      const near = host.querySelector('.hero-contours');
      const glow = host.querySelector('.hero-glow');

      /* Positions are fractions of the hero's own scroll range, so all three
         start together and separate as it leaves — the separation is the
         effect, not the distance any one of them covers. */
      if (far) tl.to(far, { yPercent: 12, scale: 1.06, ease: 'none' }, 0);
      if (near) tl.to(near, { yPercent: 30, rotate: 1.2, ease: 'none' }, 0);
      /* The glow is the nearest plane and the only one that also fades: a
         light source leaving frame dims, it does not just slide. */
      if (glow) tl.to(glow, { yPercent: 44, scale: 1.2, opacity: 0.3, ease: 'none' }, 0);
    },
    { start: 'top top', end: 'bottom top', scrub: 0.6 },
  );

  /* Nothing is rendered — this only exists to own a ref inside the hero and
     hang a scroll trigger off it. */
  return <div ref={ref} aria-hidden="true" style={{ display: 'contents' }} />;
}
