'use client';

import { useEffect, useRef } from 'react';
import { EASE, gsap, prefersReducedMotion, registerMotion } from '@/lib/motion';

/**
 * Title card. Each line rises out of its own mask rather than fading in —
 * a fade says "content loaded", a masked rise says the shot has started.
 *
 * Every character is its own element so the letters can float at rest and
 * react individually to the pointer (see .ch in globals.css). The split is
 * done here rather than in CSS because there is no CSS way to address a
 * character. `--i` carries the index so each letter can be given its own
 * phase — without it the whole line would bob as one rigid block.
 *
 * The lines ship in place; GSAP sets the from-state on mount, so without JS
 * this is simply a heading.
 */
function split(text: string) {
  return text.split('').map((ch, i) => {
    if (ch === ' ') return <span className="sp" key={i}>&nbsp;</span>;
    return (
      <span className="ch" key={i} style={{ ['--i' as string]: i }}>
        {ch}
      </span>
    );
  });
}

export function HeroTitle({ a, b }: { a: string; b: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    registerMotion();

    const ctx = gsap.context(() => {
      // rise out of the mask while the lens pulls focus — the blur is what
      // makes it read as a shot starting rather than an element appearing
      gsap.from('.title-line > span, .title-line > em', {
        yPercent: 112,
        scale: 1.06,
        filter: 'blur(14px)',
        opacity: 0,
        duration: 1.7,
        ease: EASE,
        stagger: 0.16,
        delay: 0.15,
        clearProps: 'filter,opacity,scale',
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <h1 ref={ref}>
      <span className="title-line">
        <span>{split(a)}</span>
      </span>
      <span className="title-line">
        <em>{split(b)}</em>
      </span>
    </h1>
  );
}
