'use client';

import { useEffect, type RefObject } from 'react';
import { ScrollTrigger, gsap, prefersReducedMotion, registerMotion } from '@/lib/motion';

/**
 * SCROLL-LINKED MOTION.
 *
 * ── HOW THIS DIFFERS FROM lib/inview.ts ──────────────────────────────
 * `useInView` fires once: an element enters, a class goes on, the transition
 * runs, and that is the end of it. Scroll back up and nothing happens —
 * the page animates on arrival and is then inert for the rest of the visit.
 *
 * This is the other kind. Every tween built here is *scrubbed*: its playhead
 * is tied to scroll position, so the motion runs forward as you descend and
 * backward as you climb. Nothing is ever "already played". The page keeps
 * responding for as long as someone is moving through it, which is the
 * difference between a site that animates and a site that feels alive under
 * the hand.
 *
 * Use `useInView` for a one-shot arrival (a card appearing). Use this for
 * anything whose state should track where the reader is.
 *
 * ── WHY GSAP AND NOT CSS animation-timeline ──────────────────────────
 * CSS scroll-driven animations (`animation-timeline: view()` / `scroll()`)
 * express exactly this and cost no JavaScript — but as of 2026 they are
 * still not Baseline: Firefox ships them behind
 * `layout.css.scroll-driven-animations.enabled` in stable, which is roughly
 * a sixth of the desktop audience getting a static page. Building the
 * signature motion of two sections on a feature that silently does nothing
 * in a major browser is not a trade worth making, and maintaining both
 * paths doubles the surface for no gain. ScrollTrigger is already a
 * dependency, runs one shared scroll listener for every trigger on the
 * page, and works everywhere.
 *
 * Revisit if Firefox ships it unflagged: the CSS version would let these
 * run off the main thread entirely.
 */

export interface ScrubOptions {
  /** Where the timeline starts. GSAP syntax, e.g. 'top 80%'. */
  start?: string;
  /** Where it ends, e.g. 'bottom 40%' or '+=600'. */
  end?: string;
  /**
   * Seconds of catch-up between scroll and playhead. `true` is instant.
   * ~0.6 reads as weight; above ~1.2 it starts to feel like lag.
   */
  scrub?: number | boolean;
  /** Pins the trigger for the timeline's duration. Use sparingly. */
  pin?: boolean | Element;
  /** Only run inside this media query — e.g. '(min-width: 900px)'. */
  media?: string;
  /** Draws the trigger's start/end markers. Development only. */
  markers?: boolean;
}

type Build = (tl: gsap.core.Timeline, root: HTMLElement) => void;

/**
 * Binds a scrubbed GSAP timeline to an element's scroll progress.
 *
 * `build` receives an empty timeline and the root element; add tweens to it
 * with positions in the 0..1 range you want them to occupy — the timeline's
 * total duration is normalised, so `tl.to(x, {...}, 0.2)` means "a fifth of
 * the way through this element's scroll range", not "after 0.2 seconds".
 *
 * REDUCED MOTION IS A HARD STOP. Nothing is registered, no from-state is
 * ever written, and the markup renders exactly as authored. That is only
 * safe if the component's resting CSS is its finished state — so build the
 * section to look right with no JS at all, then animate away from that.
 * Never author a from-state in CSS and rely on this to undo it.
 */
export function useScrubbed(
  ref: RefObject<HTMLElement | null>,
  build: Build,
  opts: ScrubOptions = {},
  deps: unknown[] = [],
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    registerMotion();

    const {
      start = 'top 85%',
      end = 'bottom 35%',
      scrub = 0.6,
      pin = false,
      media,
      markers = false,
    } = opts;

    /* gsap.context scopes every selector used inside `build` to this root and
       gives one revert() that undoes every tween AND every inline style they
       wrote — which is what makes a route change leave nothing behind. */
    const make = () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start,
            end,
            scrub,
            pin,
            markers,
            invalidateOnRefresh: true,
          },
        });
        build(tl, root);
      }, root);
      return () => ctx.revert();
    };

    if (!media) return make();

    /* matchMedia so a desktop-only effect is torn down on resize rather than
       left running against a layout it was never measured for. */
    const mm = gsap.matchMedia();
    mm.add(`${media} and (prefers-reduced-motion: no-preference)`, make);
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * A scrubbed timeline that also reports normalised progress back to React.
 *
 * For anything the DOM cannot express on its own — a counter, an index, an
 * aria-current — where a component needs to know how far through its own
 * scroll range the reader is. Costs a React render per frame of scroll, so
 * `onProgress` should be cheap and should set state only when the value it
 * derives actually changes.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number, self: ScrollTrigger) => void,
  opts: ScrubOptions = {},
  deps: unknown[] = [],
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    registerMotion();

    /* Reduced motion still gets the readout — the counter and the current
       marker are information, not decoration, and they keep working. What it
       does not get is a scrub. */
    const { start = 'top 80%', end = 'bottom 60%', media } = opts;

    const make = () => {
      const st = ScrollTrigger.create({
        trigger: root,
        start,
        end,
        onUpdate: (self) => onProgress(self.progress, self),
        onRefresh: (self) => onProgress(self.progress, self),
        invalidateOnRefresh: true,
      });
      return () => st.kill();
    };

    if (!media) return make();
    const mm = gsap.matchMedia();
    mm.add(media, make);
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Refreshes every trigger once the webfonts have settled.
 *
 * ScrollTrigger caches each trigger's start/end in pixels on creation. A
 * display face swapping in after that reflows the page underneath those
 * cached numbers, and every animation on the route fires at the wrong
 * scroll position — subtly on a short page, catastrophically on a long one.
 * Call once from a component that mounts on every route.
 */
export function refreshOnFontsReady() {
  if (typeof document === 'undefined') return;
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (!fonts?.ready) return;
  fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
}
