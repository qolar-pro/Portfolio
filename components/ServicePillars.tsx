'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { useInView } from '@/lib/inview';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';

/**
 * Three capabilities on one rail.
 *
 * ── WHY THE CARDS CHANGED ────────────────────────────────────────────
 * Each card used to print its whole sub-list — seven bullets for
 * Development, five for Design, seven for Digital Marketing. Twenty-one
 * dotted lines is a specification, not a pitch: the eye skips it, the row
 * runs to the height of the longest column, and the one thing a visitor
 * actually needs from this section — what the three disciplines ARE — is
 * buried under the detail of each.
 *
 * The card now leads with the discipline and a count, and the list is one
 * tap away. Open one and the others close, so the section is never taller
 * than one card's worth of detail. Nothing is hidden from a crawler or a
 * screen reader: the list is in the markup, in a region the button owns,
 * collapsed with grid-template-rows rather than removed.
 *
 * ── THE RAIL ─────────────────────────────────────────────────────────
 * The connector used to be an SVG weave in a fixed 1200x420 viewBox,
 * stretched with preserveAspectRatio="none" and three hardcoded node
 * coordinates. It aligned at exactly one aspect ratio; at any other width
 * the nodes drifted off the cards and it read as a stray curve. It is now
 * drawn in CSS off the same three-column grid the cards use, so it cannot
 * come apart — one node per column, centred, at every width.
 */
export function ServicePillars({
  c,
  lang,
  headingLevel = 3,
}: {
  c: SiteContent;
  lang: Lang;
  /* On the homepage the pillars sit under the "Capabilities" section
     heading, so they are h3. On /services they are the first block under
     the page h1, so they are h2. */
  headingLevel?: 2 | 3;
}) {
  const H = `h${headingLevel}` as 'h2' | 'h3';
  const wrapRef = useRef<HTMLDivElement>(null);

  /* The first pillar is the one with production behind it, so it opens by
     default — the section should say something before it is touched. */
  const [open, setOpen] = useState<number | null>(0);

  const arm = useCallback(() => wrapRef.current?.classList.add('rail'), []);
  const enter = useCallback(() => wrapRef.current?.classList.add('rail-in'), []);
  useInView(wrapRef, { onEnter: enter, onArm: arm, rootMargin: '0px 0px -18% 0px' });

  return (
    <div className="pillars-wrap" ref={wrapRef}>
      <div className="pillars-stage">
        {/* The rail: one line, three nodes, laid out by the same grid as the
            cards. Decorative — the numbered headings carry the sequence. */}
        <div className="pillars-rail" aria-hidden="true">
          <span className="rail-line-h" />
          {c.services.pillars.map((p) => (
            <span className="rail-node-h" key={p.title} />
          ))}
        </div>

        <div className="pillars" data-anim-group>
          {c.services.pillars.map((p, i) => {
            const isOpen = open === i;
            const panelId = `pillar-panel-${i}`;

            return (
              <article
                className={`pillar ${isOpen ? 'is-open' : ''}`}
                key={p.title}
                style={{ ['--i' as string]: i }}
              >
                <div className="pillar-pattern" aria-hidden="true" />
                <span className="pillar-ghost" aria-hidden="true">
                  {i + 1}
                </span>

                <div className="pillar-body">
                  <span className="pillar-n">{String(i + 1).padStart(2, '0')}</span>
                  <H>{p.title}</H>
                  <p>{p.desc}</p>

                  <button
                    type="button"
                    className="pillar-toggle"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="pillar-toggle-label">
                      {c.services.expand}
                      <span className="pillar-count">{p.items.length}</span>
                    </span>
                    <span className="pillar-chev" aria-hidden="true" />
                  </button>

                  <div className="pillar-panel" id={panelId} role="region">
                    <ul>
                      {p.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="pillars-cta">
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
