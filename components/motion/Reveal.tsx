'use client';

import { useCallback, useRef, type ElementType, type ReactNode } from 'react';
import { useInView } from '@/lib/inview';

type Kind = 'rise' | 'line' | 'group';

/**
 * The single reveal vocabulary for the site.
 *
 *   rise  — the default: a short lift and fade
 *   line  — masked wipe upward, for display type
 *   group — direct children stagger in as one block
 *
 * The motion is CSS (see `.rv-*` in globals.css); the timing is an
 * IntersectionObserver (see lib/inview). GSAP is not involved: a reveal is a
 * two-keyframe transform, and paying a ScrollTrigger instance per element for
 * that costs measurable scroll performance on a phone and, worse, makes the
 * content's visibility depend on a scroll calculation staying accurate.
 *
 * The visibility guarantee, in order:
 *   1. the markup renders visible — no JS, no problem;
 *   2. the hiding class is added on mount, and only to elements that are
 *      actually below the fold;
 *   3. the observer removes it;
 *   4. a 2.5s timeout removes it regardless.
 * There is no path through this component that ends with hidden content.
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

  const arm = useCallback(() => {
    ref.current?.classList.add('rv', `rv-${kind}`);
  }, [kind]);

  const enter = useCallback(() => {
    ref.current?.classList.add('rv-in');
  }, []);

  useInView(ref, { onEnter: enter, onArm: arm }, [kind]);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className || undefined}
      style={delay ? ({ ['--rv-delay' as string]: `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
