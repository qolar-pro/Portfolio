'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger, gsap, registerMotion } from '@/lib/motion';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';

/**
 * The process, as a stage sequence you can actually navigate.
 *
 * ── WHAT WAS WRONG WITH THE OLD ONE ──────────────────────────────────
 * The page pinned, and a tall track of text moved inside it. That was the
 * whole mechanism, and it was invisible: there was no indication that the
 * section had four stages, no indication of which one you were on, no
 * indication that the pin had started or when it would let go, and no way
 * to jump. It read as "some text that scrolls oddly sometimes", which is
 * exactly the wrong impression for the section describing how the studio
 * works.
 *
 * ── WHAT IT DOES NOW ─────────────────────────────────────────────────
 * The pin stays, because a pinned stage sequence is genuinely the right
 * form for four ordered steps. Everything that was implicit is now on
 * screen:
 *
 *   - a numbered rail down the left, one node per stage, with the current
 *     one filled and named;
 *   - a progress line that fills as you move through the section, so how
 *     far in you are and how much is left are both readable at a glance;
 *   - clickable nodes — the rail is a real tablist, so a visitor who wants
 *     stage 4 can go straight to it with a pointer or with arrow keys;
 *   - a live "02 / 04" counter, because a progress bar alone never tells
 *     you how many.
 *
 * ── WHAT SURVIVES WITH THE MOTION OFF ────────────────────────────────
 * All of it except the pinning. Below 900px, and under reduced motion, the
 * section is a plain numbered list with the rail alongside — the stages,
 * the numbers, the deliverables and the CTA are all still there and all
 * still in order. Nothing is dimmed at any point, so nothing depends on
 * being the "current" stage to be legible.
 */
export function ProcessPanel({ c, lang }: { c: SiteContent; lang: Lang }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const scrubRef = useRef<ScrollTrigger | null>(null);

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(false);

  const steps = c.process.steps;
  const total = steps.length;

  useEffect(() => {
    registerMotion();
    const section = sectionRef.current;
    const panel = panelRef.current;
    const track = trackRef.current;
    if (!section || !panel || !track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, track.scrollHeight - panel.clientHeight);

      const tween = gsap.to(track, {
        y: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.55}`,
          pin: panel,
          pinSpacing: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onToggle: (self) => setPinned(self.isActive),
          onUpdate: (self) => {
            setProgress(self.progress);
            /* Which stage the reader is on, measured rather than guessed.

               Mapping progress linearly onto the step count assumes every
               step is the same height. They are not — "Scope and fixed
               price" is twice the depth of "Design" — so the counter drifted
               ahead of the content and the rail highlighted stage 4 while
               stage 2 was on screen. This asks the DOM which step is nearest
               the middle of the panel, which is by definition the one being
               read. */
            const items = track.querySelectorAll<HTMLElement>('.step:not(.step-cta)');
            const mid = panel.getBoundingClientRect().top + panel.clientHeight / 2;
            let best = 0;
            let bestD = Infinity;
            items.forEach((el, n) => {
              const r = el.getBoundingClientRect();
              const d = Math.abs(r.top + r.height / 2 - mid);
              if (d < bestD) {
                bestD = d;
                best = n;
              }
            });
            setActive(best);
          },
        },
      });

      scrubRef.current = tween.scrollTrigger ?? null;

      return () => {
        scrubRef.current = null;
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [total]);

  /**
   * Jumping to a stage scrolls the PAGE to the point in the pinned range
   * where that stage is centred — the panel is fixed while pinned, so
   * scrolling the panel itself would do nothing.
   */
  const goTo = useCallback(
    (i: number) => {
      const st = scrubRef.current;
      if (!st) {
        // unpinned (mobile, reduced motion): the stage is just an element
        trackRef.current
          ?.querySelectorAll('.step')
          [i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      /* Aim at the scroll position where this step's midpoint reaches the
         middle of the panel — the same measurement `onUpdate` reads back,
         so pressing a node lands on exactly the stage it names. */
      const track = trackRef.current;
      const panel = panelRef.current;
      const el = track?.querySelectorAll<HTMLElement>('.step:not(.step-cta)')[i];
      if (!track || !panel || !el) return;

      const distance = Math.max(0, track.scrollHeight - panel.clientHeight);
      const wanted = el.offsetTop + el.offsetHeight / 2 - panel.clientHeight / 2;
      const p = distance ? Math.min(1, Math.max(0, wanted / distance)) : 0;
      window.scrollTo({ top: st.start + (st.end - st.start) * p, behavior: 'smooth' });
    },
    [],
  );

  const onRailKey = (e: React.KeyboardEvent, i: number) => {
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? Math.min(total - 1, i + 1)
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? Math.max(0, i - 1)
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? total - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    goTo(next);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <section
      className={`process-pin ${pinned ? 'is-pinned' : ''}`}
      id="process"
      ref={sectionRef}
    >
      <div className="pin-panel" ref={panelRef}>
        <div className="pin-pattern" aria-hidden="true" />

        <div className="pin-inner shell">
          <header className="pin-head" data-anim="rise">
            <p className="eyebrow">{c.process.label}</p>
            <h2 className="h2" data-anim="clip">{c.process.heading}</h2>
            <p className="lede">{c.process.lede}</p>
          </header>

          <div className="pin-stage">
            {/* ---------- the rail ---------- */}
            <div className="rail">
              <p className="rail-count" aria-hidden="true">
                <span className="rail-now">{String(active + 1).padStart(2, '0')}</span>
                <span className="rail-sep">/</span>
                <span>{String(total).padStart(2, '0')}</span>
              </p>

              <div
                className="rail-track"
                role="tablist"
                aria-label={c.process.label}
                aria-orientation="vertical"
              >
                <span className="rail-line" aria-hidden="true">
                  <span
                    className="rail-fill"
                    style={{ transform: `scaleY(${pinned ? progress : 0})` }}
                  />
                </span>

                {steps.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    tabIndex={i === active ? 0 : -1}
                    className={`rail-node ${i === active ? 'on' : ''} ${i < active ? 'done' : ''}`}
                    onClick={() => goTo(i)}
                    onKeyDown={(e) => onRailKey(e, i)}
                  >
                    <span className="rail-dot" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="rail-name">{s.title}</span>
                  </button>
                ))}
              </div>

              {/* the affordance the old version had none of */}
              <p className="rail-hint" aria-hidden="true">
                <span className="rail-hint-arrow">↓</span>
                {c.process.scrollHint}
              </p>
            </div>

            {/* ---------- the stages ---------- */}
            <div className="pin-viewport">
              <ol className="pin-track" ref={trackRef}>
                {steps.map((s, i) => (
                  <li
                    className={`step ${i === active ? 'is-current' : ''}`}
                    key={s.title}
                    id={`stage-${i}`}
                  >
                    <div className="step-body">
                      <p className="step-kicker" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')} — {c.process.label}
                      </p>
                      <h3>{s.title}</h3>
                      <p className="step-desc">{s.desc}</p>
                      <p className="step-out">
                        <span className="step-out-label" aria-hidden="true">
                          →
                        </span>
                        {s.deliverable}
                      </p>
                    </div>
                  </li>
                ))}

                <li className="step step-cta">
                  <Link className="btn btn-ghost" href={`/${lang}${ROUTES.about}`}>
                    {c.process.cta}
                    <span className="circ" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
