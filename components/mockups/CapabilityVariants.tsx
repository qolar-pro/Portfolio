'use client';

import { useState } from 'react';
import type { SiteContent } from '@/lib/content';

/**
 * Capability-section layouts to choose between.
 *
 * Each of these is a pattern you will recognise from studio and agency sites
 * rather than an invention — the point is to see the well-worn options
 * rendered in NovaFaber's own tokens, with NovaFaber's own copy, at the real
 * length the real content runs to. A pattern that looks great holding three
 * words often falls apart holding "Wholesale / B2B portals".
 *
 * Every variant below uses the same three disciplines, the same
 * descriptions and the same sub-items, unedited. Nothing here is a
 * placeholder, so what you are judging is the layout and only the layout.
 *
 * These live under /mockups and are not part of the site.
 */

type Props = { c: SiteContent };

/* ------------------------------------------------------------------ *
 * A — LEDGER
 * Full-width numbered rows, sub-items set as one continuous run rather
 * than a list. The most editorial option and the least "cards": it reads
 * like a contents page. Scales to any number of items because the run
 * simply wraps. Weakest at making individual items feel clickable.
 * ------------------------------------------------------------------ */
export function CapLedger({ c }: Props) {
  return (
    <div className="mk-ledger">
      {c.services.pillars.map((p, i) => (
        <article className="mkl-row" key={p.title}>
          <span className="mkl-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <div className="mkl-main">
            <h3 className="mkl-title">{p.title}</h3>
            <p className="mkl-desc">{p.desc}</p>
          </div>
          <p className="mkl-items">
            {p.items.map((it, n) => (
              <span key={it}>
                {it}
                {n < p.items.length - 1 && <i aria-hidden="true"> / </i>}
              </span>
            ))}
          </p>
        </article>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * B — STICKY SPLIT
 * The heading pins on the left while the disciplines scroll past on the
 * right. Probably the single most common studio-site pattern of the last
 * few years, and it earns it: the section keeps its own title in view the
 * whole way down. Needs vertical room — on a short viewport the sticky
 * column has nothing to hold onto.
 * ------------------------------------------------------------------ */
export function CapStickySplit({ c }: Props) {
  return (
    <div className="mk-split">
      <div className="mks-side">
        <p className="eyebrow">{c.services.label}</p>
        <h3 className="mks-h">{c.services.heading}</h3>
        <p className="mks-lede">{c.services.lede}</p>
      </div>
      <div className="mks-flow">
        {c.services.pillars.map((p, i) => (
          <article className="mks-block" key={p.title}>
            <span className="mks-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h4>{p.title}</h4>
            <p className="mks-desc">{p.desc}</p>
            <ul className="mks-items">
              {p.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * C — ACCORDION ROWS
 * Full-width rows, one open at a time, sub-items in a multi-column grid
 * inside. The most information-dense per pixel and the most familiar to
 * a non-designer. Costs a click to see anything, which is the trade.
 * ------------------------------------------------------------------ */
export function CapAccordion({ c }: Props) {
  const [open, setOpen] = useState(0);

  return (
    <div className="mk-acc">
      {c.services.pillars.map((p, i) => {
        const isOpen = open === i;
        return (
          <div className={`mka-row ${isOpen ? 'on' : ''}`} key={p.title}>
            <h3 className="mka-h">
              <button
                type="button"
                className="mka-btn"
                aria-expanded={isOpen}
                aria-controls={`mka-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="mka-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="mka-title">{p.title}</span>
                <span className="mka-count" aria-hidden="true">{p.items.length}</span>
                <span className="mka-plus" aria-hidden="true" />
              </button>
            </h3>
            <div className="mka-panel" id={`mka-${i}`} role="region">
              <div>
                <p className="mka-desc">{p.desc}</p>
                <ul className="mka-items">
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * D — BENTO
 * An asymmetric tile grid: the lead discipline takes a double cell, the
 * other two sit beside it, and the sub-items become tiles in their own
 * right. The most "product company" of the four and the best at making
 * the section feel built rather than written. Hardest to keep balanced
 * if the three disciplines ever have very different item counts.
 * ------------------------------------------------------------------ */
export function CapBento({ c }: Props) {
  const [lead, ...rest] = c.services.pillars;

  return (
    <div className="mk-bento">
      <article className="mkb-lead">
        <span className="mkb-n" aria-hidden="true">01</span>
        <h3>{lead.title}</h3>
        <p>{lead.desc}</p>
        <ul className="mkb-chips">
          {lead.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      </article>

      {rest.map((p, i) => (
        <article className="mkb-cell" key={p.title}>
          <span className="mkb-n" aria-hidden="true">{String(i + 2).padStart(2, '0')}</span>
          <h3>{p.title}</h3>
          <p>{p.desc}</p>
          <ul className="mkb-chips">
            {p.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
