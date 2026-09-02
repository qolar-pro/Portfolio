'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';

/**
 * The process, rebuilt from scratch on a different mechanism.
 *
 * ── WHY THE PREVIOUS TWO FAILED ──────────────────────────────────────
 * Both were scroll-driven: the page pinned and a track moved inside it.
 * That mechanism has one unavoidable problem — the visitor's scroll stops
 * meaning "move down the page" for a while, and nothing on screen can fully
 * explain that. Adding a rail and a progress bar made it legible; it did not
 * make it comfortable, and it still hijacked the one gesture people rely on.
 *
 * ── WHAT THIS IS INSTEAD ─────────────────────────────────────────────
 * A horizontal deck of four stages that the page never takes control of.
 * Scrolling past the section does what scrolling always does. Moving through
 * the stages is a separate, explicit act:
 *
 *   - Next / Previous buttons, always visible, disabled at the ends
 *   - a segmented bar naming all four stages, any of which is one click away
 *   - native horizontal scroll with snap points — so a phone swipes it and a
 *     trackpad flicks it, using the platform's own physics rather than ours
 *   - arrow keys, Home and End
 *
 * The active stage is read back from an IntersectionObserver watching the
 * panels inside the scroller, so the controls stay truthful no matter which
 * of those four inputs moved it.
 *
 * ── THE CONTENT LEADS WITH THE DELIVERABLE ───────────────────────────
 * The section's own claim is "four steps, something real at the end of each".
 * So each panel ends in the thing you receive, set as a document rather than
 * as another paragraph — the one element on the card that looks like an
 * object you could be handed.
 *
 * Copy is unchanged: the four stages, their descriptions and their
 * deliverables are exactly as written.
 */
export function ProcessFlow({ c, lang }: { c: SiteContent; lang: Lang }) {
  const scrollerRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  const steps = c.process.steps;
  const total = steps.length;

  /* Which panel is centred, observed rather than calculated — four different
     inputs can move this scroller and only the DOM knows where it ended up. */
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const panels = Array.from(root.querySelectorAll<HTMLElement>('.pf-panel'));
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const i = panels.indexOf(best.target as HTMLElement);
        if (i >= 0) setActive(i);
      },
      { root, threshold: [0.5, 0.75, 1] },
    );
    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [total]);

  const goTo = useCallback((i: number) => {
    const root = scrollerRef.current;
    const panel = root?.querySelectorAll<HTMLElement>('.pf-panel')[i];
    if (!root || !panel) return;
    root.scrollTo({
      left: panel.offsetLeft - root.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const next =
      e.key === 'ArrowRight' ? Math.min(total - 1, active + 1)
      : e.key === 'ArrowLeft' ? Math.max(0, active - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? total - 1
      : -1;
    if (next < 0) return;
    e.preventDefault();
    goTo(next);
  };

  return (
    <section className="pf" id="process">
      <div className="pf-pattern" aria-hidden="true" />

      <div className="shell pf-inner">
        <header className="pf-head">
          <div>
            <p className="eyebrow" data-anim="fade">{c.process.label}</p>
            <h2 className="h2" data-anim="clip">{c.process.heading}</h2>
            <p className="lede" data-anim="fade" data-anim-delay="1">{c.process.lede}</p>
          </div>

          {/* Controls sit with the heading, not under the deck — so they are
              on screen before the visitor has any reason to wonder how this
              thing moves. */}
          <div className="pf-nav" data-anim="rise" data-anim-delay="2">
            <button
              type="button"
              className="pf-arrow"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label={c.process.prev}
            >
              <Chevron dir="left" />
            </button>
            <p className="pf-count" aria-hidden="true">
              <span>{String(active + 1).padStart(2, '0')}</span>
              <i>/</i>
              {String(total).padStart(2, '0')}
            </p>
            <button
              type="button"
              className="pf-arrow"
              onClick={() => goTo(active + 1)}
              disabled={active === total - 1}
              aria-label={c.process.next}
            >
              <Chevron dir="right" />
            </button>
          </div>
        </header>

        {/* ---------------- the deck ---------------- */}
        <ol
          className="pf-deck"
          ref={scrollerRef}
          tabIndex={0}
          role="group"
          aria-label={c.process.heading}
          onKeyDown={onKey}
        >
          {steps.map((s, i) => (
            <li
              className={`pf-panel ${i === active ? 'on' : ''}`}
              key={s.title}
              aria-current={i === active ? 'step' : undefined}
            >
              <span className="pf-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="pf-body">
                <h3>{s.title}</h3>
                <p className="pf-desc">{s.desc}</p>

                {/* the deliverable, set as an object rather than a sentence */}
                <div className="pf-out">
                  <span className="pf-out-tag">{c.process.youGet}</span>
                  <p>{s.deliverable}</p>
                  <span className="pf-out-fold" aria-hidden="true" />
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* ---------------- the segmented bar ---------------- */}
        <div className="pf-bar" role="tablist" aria-label={c.process.label}>
          {steps.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              className={`pf-seg ${i === active ? 'on' : ''} ${i < active ? 'done' : ''}`}
              onClick={() => goTo(i)}
              onKeyDown={onKey}
            >
              <span className="pf-seg-rule" aria-hidden="true" />
              <span className="pf-seg-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="pf-seg-name">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="pf-cta" data-anim="rise">
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

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
