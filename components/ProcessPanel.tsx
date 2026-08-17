'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger, gsap, registerMotion } from '@/lib/motion';
import type { SiteContent } from '@/lib/content';

/**
 * The page pins here and the panel scrolls internally instead.
 *
 * The section is the pin target; the panel fills the viewport; the track
 * inside it is taller than the panel and is driven by scroll progress. When
 * the track reaches its end the pin releases and the page resumes.
 *
 * Pinning hijacks scroll, which is hostile on a phone and on a trackpad with
 * momentum, so it is desktop-only — below 900px the track is simply tall and
 * scrolls with the page like any other section. Reduced motion gets the same
 * unpinned treatment.
 */
export function ProcessPanel({ c }: { c: SiteContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerMotion();
    const section = sectionRef.current;
    const panel = panelRef.current;
    const track = trackRef.current;
    if (!section || !panel || !track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      // measured in a callback so a resize or font swap recomputes it
      const distance = () => Math.max(0, track.scrollHeight - panel.clientHeight);

      const tween = gsap.to(track, {
        y: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.5}`,
          pin: panel,
          pinSpacing: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      // the step counter tracks progress through the track, not the page
      const steps = gsap.utils.toArray<HTMLElement>('.step', track);
      steps.forEach((step) => {
        gsap.to(step, {
          opacity: 1,
          duration: 0.4,
          scrollTrigger: { trigger: step, start: 'top 78%', end: 'bottom 30%', toggleActions: 'play none none reverse' },
        });
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="process-pin" id="process" ref={sectionRef}>
      <div className="pin-panel" ref={panelRef}>
        <div className="pin-pattern" aria-hidden="true" />
        <div className="pin-inner shell">
          <header className="pin-head">
            <p className="eyebrow">{c.process.label}</p>
            <h2 className="h2">{c.process.heading}</h2>
            <p className="lede">{c.process.lede}</p>
          </header>

          <div className="pin-viewport">
            <div className="pin-track" ref={trackRef}>
              {c.process.steps.map((s, i) => (
                <article className="step" key={s.title}>
                  <div className="step-n">
                    <span>0{i + 1}</span>
                    <i />
                  </div>
                  <div className="step-body">
                    <h3>{s.title}</h3>
                    <p className="step-desc">{s.desc}</p>
                    <p className="step-out">
                      <span className="step-out-label">→</span>
                      {s.deliverable}
                    </p>
                  </div>
                </article>
              ))}

              <div className="step step-cta">
                <a className="btn btn-ghost" href="#about">
                  {c.process.cta}
                  <span className="circ" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
