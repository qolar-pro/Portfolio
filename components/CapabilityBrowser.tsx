'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';

/**
 * Capabilities, rebuilt on a different mechanism.
 *
 * ── WHY THE CARDS FAILED, TWICE ──────────────────────────────────────
 * Three columns of a bulleted list is a specification. Collapsing the lists
 * behind a disclosure made the columns shorter without making them better:
 * it was still three boxes, still asking the visitor to read three things in
 * parallel and hold them in their head, and the sub-items were still a dotted
 * list — just a hidden one.
 *
 * ── WHAT THIS IS INSTEAD ─────────────────────────────────────────────
 * One thing at a time. The three disciplines are a stacked index down the
 * left; selecting one fills a single detail panel on the right. Nothing is
 * compared side by side, so nothing has to be the same height, and the
 * section is exactly as tall as its tallest discipline rather than as tall
 * as all three.
 *
 * The sub-items are no longer a list. They are a grid of tiles — each one a
 * discrete thing the studio does, sized to be scanned rather than read in
 * order, because "Shopify" and "Hosting & domain" have no sequence between
 * them and a numbered or bulleted list implies one.
 *
 * ── HOW IT BEHAVES ───────────────────────────────────────────────────
 * A real tablist: roving tabindex, arrow keys, Home/End, `aria-selected`,
 * and a panel wired with `aria-labelledby`. Hover previews on a pointer;
 * hover is never the only way in. On a phone the index becomes a row of
 * three and the panel sits under it, so the same one-at-a-time reading holds
 * at every width.
 *
 * Copy is unchanged: the three disciplines, their descriptions and every
 * sub-item are exactly as written.
 */
export function CapabilityBrowser({
  c,
  lang,
  headingLevel = 3,
}: {
  c: SiteContent;
  lang: Lang;
  headingLevel?: 2 | 3;
}) {
  const H = `h${headingLevel}` as 'h2' | 'h3';
  const [i, setI] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const pillars = c.services.pillars;
  const active = pillars[i];

  const focusTab = useCallback((n: number) => {
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[n]?.focus();
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const last = pillars.length - 1;
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (i >= last ? 0 : i + 1)
      : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (i <= 0 ? last : i - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setI(next);
    focusTab(next);
  };

  return (
    <div className="cb">
      <div className="cb-grid">
        {/* ---------------- the index ---------------- */}
        <div
          className="cb-list"
          role="tablist"
          aria-label={c.services.label}
          aria-orientation="vertical"
          ref={listRef}
          onKeyDown={onKey}
        >
          {pillars.map((p, n) => (
            <button
              key={p.title}
              type="button"
              role="tab"
              id={`cb-tab-${n}`}
              aria-selected={n === i}
              aria-controls="cb-panel"
              tabIndex={n === i ? 0 : -1}
              className={`cb-item ${n === i ? 'on' : ''}`}
              onClick={() => setI(n)}
              onMouseEnter={() => setI(n)}
              onFocus={() => setI(n)}
            >
              <span className="cb-n" aria-hidden="true">
                {String(n + 1).padStart(2, '0')}
              </span>
              <span className="cb-title">{p.title}</span>
              <span className="cb-meta" aria-hidden="true">
                {p.items.length}
              </span>
              <span className="cb-edge" aria-hidden="true" />
            </button>
          ))}
        </div>

        {/* ---------------- the detail ---------------- */}
        <div
          className="cb-panel"
          id="cb-panel"
          role="tabpanel"
          aria-labelledby={`cb-tab-${i}`}
          key={active.title}
        >
          <div className="cb-panel-head">
            <H className="cb-h">{active.title}</H>
            <p className="cb-desc">{active.desc}</p>
          </div>

          <p className="cb-label">{c.services.expand}</p>
          <ul className="cb-tiles">
            {active.items.map((it) => (
              <li key={it}>
                <span className="cb-tile-dot" aria-hidden="true" />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pillars-cta" data-anim="rise">
        <Link className="btn btn-solid" href={`/${lang}${ROUTES.services}`}>
          {c.services.cta}
          <span className="circ" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
