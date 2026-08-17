'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, registerMotion } from '@/lib/motion';

/**
 * Lights the sentence word by word as it passes through the viewport.
 *
 * The dim state is applied by GSAP rather than by CSS, so the text ships
 * fully legible: without JS, or under reduced motion, it is simply a
 * paragraph. The tween is scrubbed, so scrolling back up unlights it again.
 */
export function WordHighlight({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    registerMotion();

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll('.w');
      gsap.fromTo(
        words,
        // 0.18 was low enough that the unlit half of the sentence was hard to
        // read at all; at this size the effect still reads and the words stay
        // legible before they light
        { opacity: 0.3 },
        {
          opacity: 1,
          ease: 'none',
          // stagger > duration is what makes it read word-by-word rather
          // than as one fade with a slight offset
          stagger: 0.6,
          duration: 0.4,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'bottom 62%',
            scrub: 0.5,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((word, i) => (
        <span className="w" key={`${word}-${i}`}>
          {word}
          {i < text.split(' ').length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
