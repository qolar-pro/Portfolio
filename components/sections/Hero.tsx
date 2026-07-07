'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '@/components/AppState';
import Magnetic from '@/components/Magnetic';
import TextRoll from '@/components/TextRoll';
import { journey } from '@/lib/journey';
import { gsap, registerGsap, ScrollTrigger, STAGGER } from '@/lib/motion';

/**
 * The opening frame. Brutalist wordmark stacked over the chrome knot,
 * credentials pinned to the right rail, CTAs at the floor. Every line
 * arrives through a mask once the preloader hands over.
 */
export default function Hero() {
  const { t, loaded } = useApp();
  const rootRef = useRef<HTMLElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (!loaded || played.current || !rootRef.current) return;
    played.current = true;
    registerGsap();

    const q = gsap.utils.selector(rootRef.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(q('.hero-line > *'), { yPercent: 0, y: 0 });
      gsap.set(q('.hero-fade, .hero-cue'), { opacity: 1, y: 0 });
      return;
    }
    const tl = gsap.timeline({ delay: 0.35 });
    // y:0 on both ends — GSAP reads the CSS translateY(115%) resting offset as
    // pixels, which would otherwise survive the yPercent tween and keep lines hidden
    tl.fromTo(
      q('.hero-line > *'),
      { y: 0, yPercent: 115 },
      { y: 0, yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: STAGGER.loose },
    )
      .fromTo(
        q('.hero-fade'),
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: STAGGER.base },
        '-=0.9',
      )
      .fromTo(
        q('.hero-cue'),
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: 'power2.out' },
        '-=0.4',
      );

    // kinetic wordmark: the two lines shear apart as the descent begins,
    // tying the typography to the camera dive
    const lines = q('.hero-line');
    const kinetic = [
      gsap.to(lines[0], {
        xPercent: -16,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
      }),
      gsap.to(lines[1], {
        xPercent: 10,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
      }),
    ];
    ScrollTrigger.refresh();
    return () => kinetic.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  }, [loaded]);

  const scrollDown = () => {
    const el = document.getElementById('section-about');
    if (!el) return;
    if (journey.scrollTo) journey.scrollTo(el);
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={rootRef}
      id="section-hero"
      className="relative flex min-h-screen flex-col justify-end px-5 pt-28 pb-10 md:px-12 lg:px-20"
    >
      <div className="pointer-events-none mx-auto w-full max-w-[1500px]">
        {/* status */}
        <div className="hero-fade mb-6 flex items-center gap-3 opacity-0">
          <span className="h-px w-10 bg-gradient-to-r from-volt to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-mist md:text-[11px]">
            {t.hero.status} · {t.hero.name}
          </span>
        </div>

        {/* the wordmark */}
        <h1 className="font-display leading-[0.88] font-bold tracking-tight uppercase select-none">
          <span className="hero-line line-mask">
            <span className="text-[clamp(3.6rem,14.5vw,15rem)] text-fog">Apex</span>
          </span>
          <span className="hero-line line-mask">
            <span className="text-hollow text-[clamp(3.6rem,14.5vw,15rem)]">
              Solutions<span className="text-neon" style={{ WebkitTextStroke: '0px' }}>.</span>
            </span>
          </span>
        </h1>

        {/* lower deck: tagline left, CTAs right */}
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="hero-fade font-display text-lg font-medium text-fog opacity-0 md:text-2xl">
              {t.hero.tagline}
            </p>
            <p className="hero-fade mt-4 max-w-lg text-sm leading-relaxed text-mist opacity-0 md:text-base">
              {t.hero.desc}
            </p>
          </div>

          <div className="hero-fade pointer-events-auto flex flex-wrap items-center gap-4 opacity-0">
            <Magnetic strength={0.3}>
              <button
                onClick={scrollDown}
                data-cursor="link"
                className="group roll-trigger relative overflow-hidden border border-fog/25 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-fog transition-colors duration-500 hover:border-plasma"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-r from-volt/20 via-plasma/20 to-flare/20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <span className="relative">
                  <TextRoll text={t.hero.ctaWork} /> ↓
                </span>
              </button>
            </Magnetic>
            <a
              href="mailto:yioyiomenyioyiomen@gmail.com"
              data-cursor="link"
              className="group roll-trigger px-2 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-mist transition-colors duration-300 hover:text-fog"
            >
              <TextRoll text={t.hero.ctaTalk} />
              <span className="mt-1 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-volt to-flare transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </a>
          </div>
        </div>

        {/* scroll cue */}
        <div className="hero-cue mt-12 flex items-center justify-center gap-3 opacity-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-ghost">
            {t.hero.scroll}
          </span>
          <span className="relative h-8 w-px overflow-hidden bg-fog/10">
            <span className="absolute inset-x-0 top-0 h-3 animate-[cue-drop_1.8s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-plasma to-transparent" />
          </span>
        </div>
      </div>
    </section>
  );
}
