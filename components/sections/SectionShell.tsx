'use client';

import { useEffect, useRef } from 'react';
import { useReveal } from '@/lib/reveal';
import { useApp } from '@/components/AppState';
import { gsap, registerGsap } from '@/lib/motion';
import type { SectionId } from '@/lib/journey';

interface SectionShellProps {
  id: SectionId;
  index: string;
  label: string;
  heading?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * The shared section skeleton: brutalist left-rail header — mono index,
 * oversized display heading behind a ghost number — content below.
 * Deliberately asymmetric; nothing is centered.
 */
export default function SectionShell({ id, index, label, heading, children, className = '' }: SectionShellProps) {
  const ref = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const { lang } = useApp();
  useReveal(ref, [lang]);

  // ghost numeral drifts on its own layer — slower than the content,
  // with a hint of rotation, so the header reads as depth-stacked
  useEffect(() => {
    registerGsap();
    if (!ref.current || !ghostRef.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.fromTo(
        ghostRef.current,
        { yPercent: 26, rotate: -2.5, opacity: 0.1 },
        {
          yPercent: -30,
          rotate: 2,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, [lang]);

  return (
    <section
      ref={ref}
      id={`section-${id}`}
      className={`relative px-5 py-[16vh] md:px-12 lg:px-20 ${className}`}
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="relative mb-14 md:mb-20">
          {/* ghost index looming behind the heading */}
          <span
            ref={ghostRef}
            aria-hidden
            className="text-hollow pointer-events-none absolute -top-[0.35em] -left-2 font-display text-[clamp(6rem,18vw,15rem)] leading-none font-bold opacity-[0.14] select-none md:-left-6"
          >
            {index}
          </span>

          <div className="relative flex items-baseline gap-4 pt-10 md:pt-16" data-reveal>
            <span className="h-px w-8 translate-y-[-0.4em] bg-gradient-to-r from-plasma to-transparent md:w-14" />
            <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-mist">
              {index} — {label}
            </span>
          </div>

          {heading && (
            <h2 className="relative mt-5 font-display text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[0.95] font-semibold tracking-tight text-fog uppercase">
              <span className="line-mask">
                <span>{heading}</span>
              </span>
            </h2>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
