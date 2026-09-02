'use client';

import { useState } from 'react';
import type { SiteContent } from '@/lib/content';

/**
 * Process-section layouts to choose between.
 *
 * Same rule as the capability variants: recognisable patterns, rendered in
 * NovaFaber's tokens, holding the real four stages with their real
 * descriptions and their real deliverables. No lorem, no shortened copy —
 * the deliverable lines are long, and a layout that only works when they are
 * short is not a layout that works.
 *
 * These live under /mockups and are not part of the site.
 */

type Props = { c: SiteContent };

/* ------------------------------------------------------------------ *
 * A — SPINE
 * A vertical timeline: one continuous rule down the left, a node per
 * stage, deliverable set apart at each. The most literal reading of
 * "four steps in order", and the one that survives best on a phone
 * because it is fundamentally just a list. Quietest of the four.
 * ------------------------------------------------------------------ */
export function ProcSpine({ c }: Props) {
  return (
    <ol className="mk-spine">
      {c.process.steps.map((s, i) => (
        <li className="mkp-step" key={s.title}>
          <span className="mkp-node" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <div className="mkp-body">
            <h3>{s.title}</h3>
            <p className="mkp-desc">{s.desc}</p>
            <p className="mkp-out">
              <span aria-hidden="true">→</span>
              {s.deliverable}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ *
 * B — STACK
 * Each stage is a card that sticks as you scroll, so they pile up one
 * over the next and the section deals itself out like a hand. Pure CSS
 * `position: sticky` — no scroll handler, no pinning, and the page keeps
 * control of the scroll the whole time. The most cinematic option, and
 * the one that most rewards scrolling slowly.
 * ------------------------------------------------------------------ */
export function ProcStack({ c }: Props) {
  return (
    <ol className="mk-stack">
      {c.process.steps.map((s, i) => (
        <li className="mkst-item" key={s.title} style={{ ['--i' as string]: i }}>
          <article className="mkst-card">
            <header>
              <span className="mkst-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
            </header>
            <p className="mkst-desc">{s.desc}</p>
            <p className="mkst-out">
              <span className="mkst-tag">{c.process.youGet}</span>
              {s.deliverable}
            </p>
          </article>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ *
 * C — STEPPER
 * Numbered full-width rows that open in place, with the deliverable as
 * the payoff of each. Closest to how a pricing or FAQ section behaves,
 * which is exactly why it reads as informative rather than decorative.
 * The densest and the fastest to skim.
 * ------------------------------------------------------------------ */
export function ProcStepper({ c }: Props) {
  const [open, setOpen] = useState(0);

  return (
    <ol className="mk-stepper">
      {c.process.steps.map((s, i) => {
        const isOpen = open === i;
        return (
          <li className={`mkx-row ${isOpen ? 'on' : ''}`} key={s.title}>
            <h3 className="mkx-h">
              <button
                type="button"
                className="mkx-btn"
                aria-expanded={isOpen}
                aria-controls={`mkx-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="mkx-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="mkx-title">{s.title}</span>
                <span className="mkx-chev" aria-hidden="true" />
              </button>
            </h3>
            <div className="mkx-panel" id={`mkx-${i}`} role="region">
              <div>
                <p className="mkx-desc">{s.desc}</p>
                <p className="mkx-out">
                  <span className="mkx-tag">{c.process.youGet}</span>
                  {s.deliverable}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ *
 * D — STAIRCASE
 * The four stages step down and across the page, connected corner to
 * corner. Says "sequence" without a single number needing to be read,
 * and is the most distinctive of the four. Costs the most horizontal
 * room, so it collapses to a plain column early on narrow screens.
 * ------------------------------------------------------------------ */
export function ProcStaircase({ c }: Props) {
  return (
    <ol className="mk-stairs">
      {c.process.steps.map((s, i) => (
        <li className="mkr-step" key={s.title} style={{ ['--i' as string]: i }}>
          <article className="mkr-card">
            <span className="mkr-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.title}</h3>
            <p className="mkr-desc">{s.desc}</p>
            <p className="mkr-out">{s.deliverable}</p>
          </article>
        </li>
      ))}
    </ol>
  );
}
