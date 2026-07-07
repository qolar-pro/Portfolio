'use client';

import { useEffect, useRef } from 'react';
import SectionShell from './SectionShell';
import { useApp } from '@/components/AppState';
import { gsap, registerGsap, ScrollTrigger } from '@/lib/motion';

/**
 * The trajectory: a ledger of years with a neon spine that draws itself
 * as you scroll through it — the corridor moment in the 3D scene runs
 * alongside this section.
 */
export default function Experience() {
  const { t, lang } = useApp();
  const spineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const spine = spineRef.current;
    const list = listRef.current;
    if (!spine || !list) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.fromTo(
        spine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: list, start: 'top 75%', end: 'bottom 45%', scrub: 0.6 },
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
    <SectionShell id="experience" index="04" label={t.experience.label} heading={t.experience.heading}>
      <div ref={listRef} className="relative lg:ml-[8.333%]">
        {/* the drawing spine */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-fog/10">
          <div
            ref={spineRef}
            className="h-full w-full origin-top bg-gradient-to-b from-volt via-plasma to-flare"
            style={{ transform: 'scaleY(0)' }}
          />
        </div>

        <div className="flex flex-col">
          {t.experience.jobs.map((job) => (
            <div
              key={`${job.role}-${job.period}`}
              data-reveal
              data-cursor="link"
              className="group grid grid-cols-1 gap-3 border-b border-fog/10 py-10 pl-8 transition-colors duration-500 hover:border-plasma/40 md:grid-cols-12 md:gap-6 md:pl-12"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-plasma uppercase md:col-span-3">
                {job.period}
              </span>
              <div className="md:col-span-4">
                <h3 className="font-display text-lg font-semibold tracking-tight text-fog uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-2xl">
                  {job.role}
                </h3>
                <span className="mt-1 block font-mono text-[10px] tracking-[0.2em] text-ghost uppercase">
                  {job.company}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-mist md:col-span-5 md:text-[15px]">{job.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
