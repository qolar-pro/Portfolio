'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * ONE observer for the whole page.
 *
 * Any element becomes animated by adding a single attribute:
 *
 *     <h2 data-anim="clip">      masked wipe upward — display type
 *     <p  data-anim="fade">      opacity only — copy
 *     <div data-anim="rise">     lift and fade — the default
 *     <div data-anim="left|right">  slide in from the side
 *     <div data-anim="scale">    settle in from 96%
 *     <div data-anim="blur">     focus pulls in
 *     <div data-anim="reveal">   media uncovers, picture settles back
 *     <span data-anim="pop">     icons and small round things
 *     <ul data-anim-group>       children arrive in sequence
 *
 * ── REVERSIBLE, NOT ONE-SHOT ─────────────────────────────────────────
 * This used to reveal an element once and then unobserve it. The result was
 * a page that animated on the way in and was inert for the rest of the
 * visit: scroll back up and nothing moved, because everything had already
 * "played". A visitor moving around the page saw motion exactly once.
 *
 * Elements are now kept under observation and re-armed when they leave.
 * Scroll back and the section arrives again.
 *
 * The reason this does not read as flicker: an element is only ever
 * re-armed once it is COMPLETELY out of the viewport. Nothing the reader
 * can see ever animates away from them — the reset happens off-screen, in
 * the part of the page they are not looking at, and all they experience is
 * that the page keeps greeting them. Anything mid-screen is left alone no
 * matter which direction they are moving.
 *
 * ── THE VISIBILITY GUARANTEE ─────────────────────────────────────────
 * Markup renders visible. The hiding class is added by JS, only to elements
 * genuinely below the fold. The observer removes it, and a timeout removes
 * it regardless. An element that had to be rescued by the timeout is marked
 * `settled` and never armed again — if the observer is not working for that
 * element, re-arming it would hide content that nothing is going to bring
 * back. Under `prefers-reduced-motion` nothing is ever armed at all.
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

    const timers = new WeakMap<Element, number>();

    const show = (el: HTMLElement) => {
      el.classList.add(IN);
      /* The compositor hint is only worth paying for while the transition is
         running; left on, it pins a layer per element for the life of the
         page. It goes back on when the element is re-armed. */
      window.setTimeout(() => {
        if (el.classList.contains(IN)) el.style.willChange = '';
      }, 1400);
    };

    /* Re-arm, so the next approach animates again. Only ever called for an
       element fully outside the viewport — see the observer below. */
    const rearm = (el: HTMLElement) => {
      if (el.dataset.animSettled) return;
      el.classList.remove(IN);
      el.style.willChange = 'opacity, transform';
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;

          if (e.isIntersecting) {
            window.clearTimeout(timers.get(el));
            show(el);
            continue;
          }

          /* Not intersecting is not the same as off-screen: with a negative
             rootMargin an element sitting in the bottom 10% of the viewport
             also reports false. Re-arming that one would animate content out
             from under a reader who is looking straight at it. The bounding
             rect is the only honest test. */
          const r = el.getBoundingClientRect();
          const offScreen = r.bottom <= 0 || r.top >= window.innerHeight;
          if (offScreen) rearm(el);
        }
      },
      /* -10% keeps the reveal from firing on something only a sliver of
         which has entered — the motion should read as the element arriving,
         not as it flinching at the bottom edge. */
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    );

    const arm = (el: HTMLElement) => {
      if (el.dataset.animBound) return;
      el.dataset.animBound = '1';

      const r = el.getBoundingClientRect();
      const onScreen = r.top < window.innerHeight * 0.92 && r.bottom > 0;

      /* Already on screen at mount is not "revealed on scroll", it is just
         there. Arming it would flash it out and back in on every load. It
         still gets observed, so it animates properly next time round. */
      if (onScreen) {
        el.classList.add(IN);
      } else {
        el.classList.add(ARMED);
        el.style.willChange = 'opacity, transform';

        timers.set(
          el,
          window.setTimeout(() => {
            if (!el.classList.contains(IN)) {
              /* The observer never fired for this element. Show it and stop
                 managing it — re-arming something the observer is not
                 tracking would hide content permanently. */
              el.dataset.animSettled = '1';
              show(el);
            }
          }, SAFETY_MS),
        );
      }

      io.observe(el);
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
