'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollProgress, useScrubbed } from '@/lib/scrollMotion';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';

/**
 * How it runs — the sticky stack.
 *
 * ── WHAT IT IS ───────────────────────────────────────────────────────
 * Four cards that stick as you descend, so each stage comes to rest and the
 * next deals itself over the top. By the foot of the section the four are a
 * pile with every stage's header still showing down the left edge — the
 * whole process visible at once, in order, as an object.
 *
 * ── THE ONE CONSTRAINT THAT SHAPED EVERYTHING ────────────────────────
 * Two earlier versions of this section pinned the page and drove a track
 * with the scroll. Both were rejected, and for the right reason: pinning
 * takes over the one gesture a reader relies on, and nothing you put on
 * screen makes that comfortable.
 *
 * So the stacking here is `position: sticky` and nothing else. That is the
 * browser's own mechanism, running on the compositor, and the page keeps
 * control of the scroll throughout — you can flick past this section exactly
 * like any other. There is no `pin`, no scroll capture, no wheel handler.
 * Do not add one.
 *
 * ── WHAT IS SCRUBBED, AND WHAT IS NOT ────────────────────────────────
 * The pile is CSS. What GSAP adds is the depth the pile would otherwise
 * lack, tied to each card's own scroll range so it runs forward going down
 * and backward coming up (DD-1):
 *
 *   1. RECESSION. As a card is covered it scales down a little and its lit
 *      edge fades. That is what makes the pile read as depth rather than as
 *      four rectangles that happen to overlap. Transform and shadow only —
 *      never text opacity, see below.
 *
 *   2. THE STAGE RAIL. A readout of which stage the reader is in, driven by
 *      the section's own progress. It is information, not decoration, so it
 *      keeps working with motion off — `useScrollProgress` deliberately does
 *      not opt out under reduced motion.
 *
 * Rejected, deliberately:
 *   - Fading the covered card's text. The header of every covered card stays
 *     visible down the left edge of the pile — that is the point of the
 *     shape. Text that is on screen has to clear AA at every scroll
 *     position, and a scrubbed opacity means parking mid-range leaves it
 *     permanently at whatever value the wheel stopped on. Depth is carried
 *     by scale and shadow, both of which are free of that problem.
 *   - Revealing the deliverable within the card's range. Same defect: it
 *     makes frozen copy (DD-5) a function of scroll position, and a reader
 *     who stops half way gets half a sentence.
 *
 * DD-2 holds: the resting CSS is the finished state. Every card is full
 * size, full contrast, fully readable with no JavaScript at all; the scrub
 * animates away from that and back.
 */
export function ProcessStack({ c, lang }: { c: SiteContent; lang: Lang }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const steps = c.process.steps;
  const total = steps.length;

  /**
   * How much scroll each card gets before the next one covers it.
   *
   * This one number drives both the layout and the motion, so it is computed
   * once here and handed to CSS as a custom property rather than written
   * down in two places that can drift apart: the pile uses it to size each
   * card's scroll distance, and each card's scrub uses it as its end offset.
   *
   * Viewport-relative because the right amount of travel is "about a third
   * of a screen" — a fixed pixel value that feels considered on a laptop
   * feels interminable on a tall monitor. Clamped at both ends so a very
   * short window does not make the stack fire instantly, and a very tall one
   * does not turn the section into a scroll marathon.
   */
  const [step, setStep] = useState(260);

  useEffect(() => {
    const measure = () =>
      setStep(Math.round(Math.min(320, Math.max(170, window.innerHeight * 0.32))));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* Which stage the reader is in. Derived from the section's own progress
     and clamped, rather than from a trigger per card, so the readout can
     never disagree with itself. setState only fires on an actual change —
     this runs on every frame of scroll. */
  const onProgress = useCallback(
    (p: number) => {
      const i = Math.min(total - 1, Math.max(0, Math.floor(p * total)));
      setActive((prev) => (prev === i ? prev : i));
    },
    [total],
  );

  useScrollProgress(sectionRef, onProgress, { start: 'top 60%', end: 'bottom 90%' }, [total]);

  return (
    <section className="stk" id="process" ref={sectionRef}>
      {/* DD-3. Opacity is set in the stylesheet, never left to default: an
          inset:0 texture layer with no opacity renders at full strength
          straight over the copy. That has shipped here once already. */}
      <div className="stk-tex" aria-hidden="true" />

      <div className="shell stk-inner">
        <header className="stk-head">
          <p className="eyebrow" data-anim="fade">
            {c.process.label}
          </p>
          <h2 className="h2" data-anim="clip">
            {c.process.heading}
          </h2>
          <p className="lede" data-anim="fade" data-anim-delay="1">
            {c.process.lede}
          </p>

          {/* The rail is a readout, not a control — there is nothing to
              click, because the stack is scrolled, not navigated. It is
              `aria-hidden` because the ordered list below already announces
              "3 of 4" to a screen reader; saying it twice is noise. */}
          <div className="stk-rail" aria-hidden="true">
            <p className="stk-count">
              <span>{String(active + 1).padStart(2, '0')}</span>
              <i>/</i>
              {String(total).padStart(2, '0')}
            </p>
            <ol className="stk-ticks">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className={`stk-tick ${i === active ? 'on' : ''} ${i < active ? 'done' : ''}`}
                >
                  <span className="stk-tick-rule" />
                  <span className="stk-tick-name">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </header>

        <ol
          className="stk-pile"
          style={
            {
              '--stk-n': total,
              '--stk-step': `${step}px`,
            } as React.CSSProperties
          }
        >
          {steps.map((s, i) => (
            <StackCard
              key={s.title}
              step={s}
              i={i}
              total={total}
              scrollStep={step}
              youGet={c.process.youGet}
            />
          ))}
        </ol>

        <div className="stk-cta" data-anim="rise">
          <Link className="btn btn-ghost" href={`/${lang}${ROUTES.about}`}>
            {c.process.cta}
            <span className="circ" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * One stage.
 *
 * A component rather than a loop body because each card needs a
 * ScrollTrigger keyed to its own position — one timeline for the whole pile
 * would drive all four off a single shared progress, which is exactly the
 * canned, everything-moves-together feel this is meant to avoid. Hooks
 * cannot be called in a loop, so the loop body has to be a component.
 */
function StackCard({
  step,
  i,
  total,
  scrollStep,
  youGet,
}: {
  step: SiteContent['process']['steps'][number];
  i: number;
  total: number;
  /** Pixels of scroll this card gets before the next covers it. */
  scrollStep: number;
  youGet: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const isLast = i === total - 1;

  useScrubbed(
    ref,
    (tl, root) => {
      const card = root.querySelector('.stk-card');
      if (!card || isLast) return;

      /* Recession, over the part of the range where this card is actually
         being covered. Scale is the honest cue — a receding thing gets
         smaller — and it is a compositor property, so four of these
         scrubbing at once costs nothing per frame.

         0.94 is as far as it goes: past roughly 0.9 the covered card's
         header stops lining up with the ones above it and the pile reads as
         crooked rather than deep.

         `ease: 'none'` because the scrub has its own easing (the catch-up);
         stacking a curve on top reads as the page lagging the wheel. */
      tl.fromTo(
        card,
        { scale: 1, filter: 'brightness(1)' },
        { scale: 0.94, filter: 'brightness(0.82)', duration: 1, ease: 'none' },
        0,
      );
    },
    /* Exactly one step: the window between this card settling into its
       sticky position and the next one arriving over it. Then it holds.

       This has to be a fixed distance rather than something like
       `bottom 20%`, because the cards have deliberately unequal heights —
       the first card's box extends all the way to the foot of the pile.
       A proportional end would make the first card recede over the whole
       remaining section while the third receded over a fraction of it, so
       at any given moment a card deeper in the pile would be LESS receded
       than one above it, and the depth would read backwards. */
    { start: 'top 22%', end: `+=${scrollStep}`, scrub: 0.5 },
    [isLast, scrollStep],
  );

  return (
    <li className="stk-item" ref={ref} style={{ ['--i' as string]: i }}>
      <article className="stk-card">
        <header className="stk-card-head">
          <span className="stk-n" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3>{step.title}</h3>
        </header>

        <div className="stk-body">
          <p className="stk-desc">{step.desc}</p>

          <div className="stk-out">
            <p className="stk-out-tag">{youGet}</p>
            <p className="stk-out-text">{step.deliverable}</p>
          </div>
        </div>

        {/* Decorative: the hover/focus edge, and the lit top rail that
            separates one card from the one it is sitting on. */}
        <span className="stk-edge" aria-hidden="true" />
      </article>
    </li>
  );
}
