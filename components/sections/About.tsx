'use client';

import { useEffect, useRef } from 'react';
import SectionShell from './SectionShell';
import { useApp } from '@/components/AppState';
import { gsap, registerGsap } from '@/lib/motion';

export default function About() {
  const { t, lang } = useApp();
  const stmtRef = useRef<HTMLParagraphElement>(null);

  // the statement reads itself in: each word scrubs from ghost to full
  // brightness as the section scrolls through the viewport
  useEffect(() => {
    registerGsap();
    const el = stmtRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const words = el.querySelectorAll<HTMLElement>('.stmt-word');
      const tween = gsap.fromTo(
        words,
        { opacity: 0.13 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 40%', scrub: 0.4 },
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
    <SectionShell id="about" index="01" label={t.about.label} heading={t.about.heading}>
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7 lg:col-start-2">
          <p ref={stmtRef} className="font-display text-xl leading-snug font-medium text-fog md:text-3xl">
            {t.about.p1.split(' ').map((word, i) => (
              <span key={i} className="stmt-word">
                {word}
                {i < t.about.p1.split(' ').length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
          <p data-reveal data-reveal-delay="0.12" className="mt-8 max-w-2xl text-base leading-relaxed text-mist md:text-lg">
            {t.about.p2}
          </p>
        </div>

        <div className="lg:col-span-3 lg:col-start-10">
          <ul data-reveal-group className="border-t border-fog/10">
            {t.about.pillars.map((pillar, i) => (
              <li
                key={pillar}
                data-cursor="link"
                className="group flex items-baseline justify-between gap-4 border-b border-fog/10 py-5 transition-colors duration-300 hover:border-plasma/50"
              >
                <span className="font-mono text-[10px] text-ghost transition-colors duration-300 group-hover:text-plasma">
                  0{i + 1}
                </span>
                <span className="flex-1 text-right font-display text-sm font-medium tracking-wide text-mist uppercase transition-all duration-300 group-hover:translate-x-[-4px] group-hover:text-fog md:text-base">
                  {pillar}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
