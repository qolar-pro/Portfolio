'use client';

import { useCallback, useRef } from 'react';
import { useInView } from '@/lib/inview';
import { gsap, registerMotion } from '@/lib/motion';

/**
 * Counts a stat up when it scrolls into view, then marks itself done.
 *
 * THE NUMBER IS NEVER WRONG.
 * The final value is what the server renders and what stays in the DOM. It is
 * only zeroed at the moment the tween starts, and only for a stat that is
 * actually below the fold. The previous version zeroed every stat on mount
 * and relied on a ScrollTrigger to put the real number back — so a trigger
 * that did not fire left the page publishing "0 shipped platforms" and "0%
 * written, not templated", which is worse than no animation: it is a false
 * claim about the studio, rendered confidently.
 */
export function CountUp({ value, label }: { value: string; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const isPercent = suffix.includes('%');

  const enter = useCallback(() => {
    const root = rootRef.current;
    const num = numRef.current;
    if (!root || !num) return;

    /* A value the regex could not read (or reduced motion) has nothing to
       count — it is already correct on screen. */
    if (!match) {
      root.classList.add('is-done');
      return;
    }

    /* Reduced motion means the number does not count — it is simply
       correct. useInView calls this immediately in that case, so without the
       guard the tween ran anyway and the stat animated for someone who asked
       the whole site not to. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      num.textContent = String(target);
      root.classList.add('is-done');
      return;
    }

    registerMotion();
    const counter = { n: 0 };
    num.textContent = '0';

    const tl = gsap.timeline({ onComplete: () => root.classList.add('is-done') });
    tl.to(counter, {
      n: target,
      duration: isPercent ? 1.9 : 1.35,
      ease: 'power2.out',
      snap: { n: 1 },
      onUpdate: () => {
        num.textContent = String(Math.round(counter.n));
      },
      /* Whatever interrupts the tween — a route change, a reduced-motion
         flip, GSAP being killed — the DOM is left holding the real number. */
      onInterrupt: () => {
        num.textContent = String(target);
      },
    });

    if (isPercent && fillRef.current) {
      tl.fromTo(fillRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.9, ease: 'power2.out' }, 0);
    }
  }, [match, target, isPercent]);

  /* No `onArm`: nothing is hidden or zeroed in advance. The stat sits at its
     true value until the instant it animates. */
  useInView(rootRef, { onEnter: enter, rootMargin: '0px 0px -8% 0px' }, [target, isPercent]);

  return (
    <div className={`stat ${isPercent ? 'is-percent' : ''}`} ref={rootRef}>
      <div className="v">
        <span ref={numRef}>{target}</span>
        {suffix}
      </div>
      {isPercent && (
        <span className="stat-track" aria-hidden="true">
          <span className="stat-fill" ref={fillRef} />
        </span>
      )}
      <div className="l">{label}</div>
    </div>
  );
}
