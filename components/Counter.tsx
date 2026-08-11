'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A stat that counts up when it enters view.
 *
 * Only animates numeric values — a label like "Live" is rendered as-is rather
 * than being tortured into a count. Starts at the final value and only winds
 * back once the observer fires, so with JavaScript off or reduced motion on,
 * the correct number is what renders.
 */
export default function Counter({ value, className = '' }: { value: string; className?: string }) {
  const target = Number(value.replace(/[^\d.]/g, ''));
  const numeric = value.trim() !== '' && !Number.isNaN(target);
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!numeric || done.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();

        const suffix = value.replace(/[\d.,\s]/g, '');
        const duration = 900;
        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutExpo — fast arrival, long settle, matching the site's curve.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay(String(Math.round(target * eased)) + suffix);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [numeric, target, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
