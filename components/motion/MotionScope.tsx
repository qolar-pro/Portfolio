'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * ONE observer for the whole page.
 *
 * Any element on the site becomes animated by adding a single attribute:
 *
 *     <h2 data-anim="clip">          masked wipe upward, for display type
 *     <p  data-anim="fade">          opacity only
 *     <div data-anim="rise">         lift and fade — the default
 *     <div data-anim="left|right">   slide in from the side
 *     <div data-anim="scale">        settle in from 96%
 *     <div data-anim="blur">         focus pulls in
 *     <img data-anim="reveal">       image uncovers, scale settles
 *     <ul data-anim-group>           children arrive in sequence
 *
 * WHY AN ATTRIBUTE AND NOT A WRAPPER
 * Animating "everything" by wrapping every element in a component means a
 * component per element, a ref per element and an observer per element. This
 * is one observer, one MutationObserver and no extra DOM: the cost of
 * animating the entire site is the same as animating one thing, and adding
 * motion to a component is a one-word edit rather than a refactor.
 *
 * THE VISIBILITY GUARANTEE IS UNCHANGED
 * Elements render visible. The hiding class is applied by JS, only to
 * elements actually below the fold. The observer removes it, and a timeout
 * removes it regardless. Under prefers-reduced-motion nothing is ever armed.
 * There is no path here that ends with content the visitor cannot read.
 */

const ARMED = 'anim-armed';
const IN = 'anim-in';
/** Nothing stays hidden longer than this, whatever else goes wrong. */
const SAFETY_MS = 2600;

export function MotionScope({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          reveal(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      },
      /* -10% keeps the reveal from firing on something only a sliver of
         which has entered — the motion should read as the element arriving,
         not as it flinching at the bottom edge. */
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    );

    const reveal = (el: HTMLElement) => {
      el.classList.add(IN);
      /* The compositor hint is only worth paying for while the transition is
         actually running; left on, it pins a layer per element forever. */
      window.setTimeout(() => {
        el.style.willChange = '';
      }, 1400);
    };

    const arm = (el: HTMLElement) => {
      if (el.dataset.animBound) return;
      el.dataset.animBound = '1';

      const r = el.getBoundingClientRect();
      const onScreen = r.top < window.innerHeight * 0.92 && r.bottom > 0;

      /* Already on screen at mount is not "revealed on scroll" — it is just
         there. Arming it would flash it out and back in on every load. */
      if (onScreen) {
        el.classList.add(IN);
        return;
      }

      el.classList.add(ARMED);
      el.style.willChange = 'opacity, transform';
      io.observe(el);

      window.setTimeout(() => {
        if (!el.classList.contains(IN)) {
          io.unobserve(el);
          reveal(el);
        }
      }, SAFETY_MS);
    };

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>('[data-anim], [data-anim-group]')
        .forEach(arm);
    };

    scan();

    /* Client-side navigation swaps the tree without remounting this effect,
       and route content arrives after the first scan. */
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return <>{children}</>;
}
