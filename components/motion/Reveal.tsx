'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { DUR, SHIFT, STAGGER, gsap, prefersReducedMotion, registerMotion } from '@/lib/motion';

type Kind = 'rise' | 'line' | 'group';

/**
 * The single reveal vocabulary for the site.
 *
 *   rise  — the default: a short lift and fade
 *   line  — masked wipe upward, for display type
 *   group — direct children stagger in as one block
 *
 * Nothing here starts at opacity 0 in the markup: GSAP sets the from-state
 * on mount, so a JS failure leaves the content visible rather than blank.
 */
export function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  kind = 'rise',
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  kind?: Kind;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    registerMotion();

    const ctx = gsap.context(() => {
      const trigger = { trigger: el, start: 'top 85%', once: true } as const;

      if (kind === 'group') {
        gsap.from(Array.from(el.children), {
          y: SHIFT.y,
          opacity: 0,
          duration: DUR.lg,
          delay,
          stagger: STAGGER.normal,
          scrollTrigger: trigger,
        });
        return;
      }

      if (kind === 'line') {
        gsap.from(el, {
          yPercent: 100,
          opacity: 0,
          duration: DUR.xl,
          delay,
          scrollTrigger: trigger,
        });
        return;
      }

      gsap.from(el, {
        y: SHIFT.y,
        opacity: 0,
        duration: DUR.lg,
        delay,
        scrollTrigger: trigger,
      });
    }, el);

    return () => ctx.revert();
  }, [kind, delay]);

  return (
    <Tag ref={ref} id={id} className={className || undefined}>
      {children}
    </Tag>
  );
}
