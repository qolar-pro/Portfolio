'use client';

import { useCallback, useMemo, useRef } from 'react';
import { useInView } from '@/lib/inview';

/**
 * Lights the sentence word by word as it enters the viewport.
 *
 * TWO CHANGES FROM THE SCRUBBED VERSION
 *
 * It is no longer scrub-linked. A scrub ties the text's legibility to scroll
 * position, so a visitor who lands with the line already mid-screen, or whose
 * viewport is tall enough that the scrub range never completes, reads a
 * half-lit sentence indefinitely. It now runs once, on entry, and ends lit.
 *
 * And the unlit state is 0.62 rather than 0.3. At 0.3 the not-yet-lit half of
 * the sentence sat around 3:1 against the page — below AA, on the one line
 * that states what the studio does. 0.62 still reads as unlit and still
 * clears AA on its own, which is the rule the whole site is held to.
 *
 * The stagger is CSS `transition-delay` off an index custom property, so no
 * JS runs per word.
 */
export function WordHighlight({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => text.split(' '), [text]);

  const arm = useCallback(() => ref.current?.classList.add('wh'), []);
  const enter = useCallback(() => ref.current?.classList.add('wh-in'), []);

  useInView(ref, { onEnter: enter, onArm: arm }, [text]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          className="w"
          key={`${word}-${i}`}
          style={{ ['--w' as string]: i }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
