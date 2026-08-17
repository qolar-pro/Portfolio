'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, registerMotion } from '@/lib/motion';

/**
 * Counts a stat up when it scrolls into view, then marks itself done.
 *
 * The final value is what renders on the server, so the number is correct
 * without JS; the effect resets it to zero before the tween starts. Percent
 * values get a track that fills in step with the count and a flare on
 * completion — the difference between "a number" and "a number that landed".
 */
export function CountUp({ value, label }: { value: string; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const isPercent = suffix.includes('%');

  useEffect(() => {
    const root = rootRef.current;
    const num = numRef.current;
    if (!root || !num || !match) return;

    if (prefersReducedMotion()) {
      root.classList.add('is-done');
      return;
    }

    registerMotion();
    num.textContent = '0';

    const ctx = gsap.context(() => {
      const counter = { n: 0 };
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 88%', once: true },
        onComplete: () => root.classList.add('is-done'),
      });

      tl.to(counter, {
        n: target,
        duration: isPercent ? 1.9 : 1.35,
        ease: 'power2.out',
        snap: { n: 1 },
        onUpdate: () => {
          num.textContent = String(Math.round(counter.n));
        },
      });

      if (isPercent && fillRef.current) {
        tl.fromTo(fillRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.9, ease: 'power2.out' }, 0);
      }
    }, root);

    return () => ctx.revert();
  }, [target, suffix, isPercent, match]);

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
