'use client';

import { useEffect } from 'react';

/**
 * Scroll reveal, mounted once per page.
 *
 * DD-14 allows `reveal` on every surface including reading ones, because it
 * fires on entry and then stops — it never competes with someone actually
 * reading. That allowance was written in Phase 1 and never spent.
 *
 * One IntersectionObserver for the whole document rather than a hook per
 * component, and no animation library: DD-25 made three.js the largest
 * dependency here, and adding GSAP to fade things in would be a poor trade on
 * a site whose pitch is speed.
 *
 * Elements are revealed permanently once seen. Re-animating on scroll-up is
 * the thing that makes reveal effects tiring.
 */
export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (nodes.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.revealDelay ?? 0);
          window.setTimeout(() => el.classList.add('is-revealed'), delay);
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    // Anything already on screen at mount reveals immediately — otherwise the
    // hero sits invisible until the first scroll, which reads as broken.
    for (const node of nodes) {
      const r = node.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9) node.classList.add('is-revealed');
      else io.observe(node);
    }

    return () => io.disconnect();
  }, []);

  return null;
}
