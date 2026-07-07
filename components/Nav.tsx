'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '@/components/AppState';
import Magnetic from '@/components/Magnetic';
import TextRoll from '@/components/TextRoll';
import { ACTIVE_LOCALES, languageNames, type LanguageCode } from '@/lib/i18n';
import { journey, SECTION_ORDER } from '@/lib/journey';
import { gsap } from '@/lib/motion';

/**
 * Navigation as instrument panel: a fixed wordmark strip up top, and a
 * journey-progress rail on the right edge — a vertical line that fills as
 * the camera descends, with a labeled, magnetic tick per section.
 */
export default function Nav() {
  const { t, lang, setLang, setBrandKitOpen, loaded } = useApp();
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!loaded || !barRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(barRef.current, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      barRef.current,
      { y: -32, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.9 },
    );
  }, [loaded]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (!el) return;
    if (journey.scrollTo) journey.scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  const railLabels = [
    'Intro',
    t.about.label,
    t.services.label,
    t.work.label,
    t.experience.label,
    t.stack.label,
    t.contact.label,
  ];

  return (
    <>
      <header
        ref={barRef}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 opacity-0 md:px-10"
      >
        <button
          onClick={() => scrollToSection('hero')}
          data-cursor="link"
          className="font-display text-sm font-semibold whitespace-nowrap uppercase tracking-[0.3em] text-fog"
        >
          Apex<span className="text-plasma">*</span>
          <span className="hidden sm:inline">Solutions</span>
        </button>

        <div className="flex items-center gap-3 md:gap-7">
          <div className="hidden items-center gap-2.5 md:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-volt" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist">
              {t.nav.available}
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em]">
            {ACTIVE_LOCALES.map((code: LanguageCode, i) => (
              <span key={code} className="flex items-center">
                {i > 0 && <span className="mx-1 text-ghost">/</span>}
                <button
                  onClick={() => setLang(code)}
                  data-cursor="link"
                  className={`px-1 py-1 transition-colors duration-300 ${
                    lang === code ? 'text-fog' : 'text-ghost hover:text-mist'
                  }`}
                  aria-label={languageNames[code]}
                >
                  {code === 'el' ? 'ΕΛ' : code.toUpperCase()}
                </button>
              </span>
            ))}
          </div>

          <button
            onClick={() => setBrandKitOpen(true)}
            data-cursor="link"
            className="roll-trigger group font-mono text-[11px] whitespace-nowrap uppercase tracking-[0.2em] text-mist transition-colors duration-300 hover:text-fog"
          >
            <TextRoll text={t.nav.identity} />
            <span className="ml-1 inline-block text-plasma transition-transform duration-300 group-hover:rotate-90">
              *
            </span>
          </button>

          <Magnetic strength={0.3} className="hidden sm:block">
            <button
              onClick={() => scrollToSection('contact')}
              data-cursor="link"
              className="roll-trigger border border-fog/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fog transition-all duration-300 hover:border-plasma hover:bg-plasma/10 hover:shadow-[0_0_24px_rgba(138,92,255,0.25)]"
            >
              <TextRoll text={t.nav.contact} />
            </button>
          </Magnetic>
        </div>
      </header>

      <ProgressRail onJump={scrollToSection} labels={railLabels} />
    </>
  );
}

function ProgressRail({ onJump, labels }: { onJump: (id: string) => void; labels: string[] }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const { loaded } = useApp();
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${journey.progress})`;
      if (dotRef.current) dotRef.current.style.top = `${journey.progress * 100}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!loaded || !railRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(railRef.current, { opacity: 1, x: 0 });
      return;
    }
    gsap.fromTo(
      railRef.current,
      { x: 24, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 1.3 },
    );
  }, [loaded]);

  return (
    <div
      ref={railRef}
      className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 opacity-0 lg:block"
    >
      <div className="relative flex h-[38vh] flex-col items-center">
        <div className="relative h-full w-px bg-fog/10">
          <div
            ref={fillRef}
            className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-volt via-plasma to-flare"
            style={{ transform: 'scaleY(0)' }}
          />
          <div
            ref={dotRef}
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fog shadow-[0_0_12px_rgba(138,92,255,0.9)]"
            style={{ top: '0%' }}
          />
        </div>
        <div className="absolute inset-y-0 -left-3 flex flex-col justify-between">
          {SECTION_ORDER.map((id, i) => (
            <button
              key={id}
              onClick={() => onJump(id)}
              data-cursor="link"
              className="group pointer-events-auto relative flex items-center gap-2"
              aria-label={labels[i]}
            >
              <span className="pointer-events-none absolute right-full mr-3 translate-x-1 font-mono text-[9px] whitespace-nowrap uppercase tracking-[0.25em] text-mist opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                {labels[i]}
              </span>
              <span className="h-px w-2 bg-fog/25 transition-all duration-300 group-hover:w-3.5 group-hover:bg-plasma" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
