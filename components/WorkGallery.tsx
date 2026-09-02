'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { hostOf } from '@/components/ProjectShot';
import { ROUTES, type Lang, type Project, type SiteContent } from '@/lib/content';
import { MARKS } from '@/lib/marks';

/**
 * The work gallery.
 *
 * ── WHAT THIS IS ─────────────────────────────────────────────────────
 * A stage and an index, not a grid of equal boxes. One project is shown
 * large — its real screenshot in browser chrome carrying its real domain —
 * and the rest sit under it as a strip you can move through. Hovering,
 * focusing, clicking, or pressing an arrow key changes which one is on the
 * stage, and the shot cross-fades rather than swapping.
 *
 * The point is that a portfolio should be something you BROWSE. A grid asks
 * you to read four cards and pick; a stage shows you one project properly
 * and makes the next one one keystroke away. It also means the primary shot
 * gets real size — which is what a screenshot needs to be evidence rather
 * than decoration.
 *
 * ── ACCESSIBILITY ────────────────────────────────────────────────────
 * The strip is a real tablist: arrow keys, Home/End, roving tabindex, and
 * `aria-selected`. The stage is the panel. Every project is reachable and
 * announced whether or not a pointer is involved, and the "Visit live site"
 * action on the stage is a normal link with a descriptive accessible name.
 *
 * Nothing here depends on hover: hover is a shortcut, not the mechanism.
 */
export function WorkGallery({ c, lang }: { c: SiteContent; lang: Lang }) {
  /* `showcase: false` keeps an embargoed project out of the gallery while
     leaving it in the case studies — see lib/projects.ts. */
  const projects = useMemo(
    () => c.work.projects.filter((p) => !p.lab && p.showcase !== false),
    [c.work.projects],
  );

  const [i, setI] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const active = projects[i];

  const focusTab = useCallback((n: number) => {
    const tabs = tabsRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs?.[n]?.focus();
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const last = projects.length - 1;
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? i >= last ? 0 : i + 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? i <= 0 ? last : i - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1;
    if (next < 0) return;
    e.preventDefault();
    setI(next);
    focusTab(next);
  };

  return (
    <div className="gal">
      {/* ---------------- the stage ---------------- */}
      <div className="gal-stage" role="tabpanel" id="gal-panel" aria-live="polite">
        <div className="gal-shot" data-anim="reveal">
          <div className="shot">
            <div className="shot-bar" aria-hidden="true">
              <span className="shot-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="shot-host">{hostOf(active.liveUrl)}</span>
              <span className="shot-state">
                <span className="dot" /> Live
              </span>
            </div>

            <div className="shot-view">
              {/* Every shot is mounted; only the active one is opaque. A
                  cross-fade between two decoded images is instant, where
                  swapping the `src` makes the visitor watch a load. */}
              {projects.map((p, n) => (
                <Image
                  key={p.slug}
                  className={n === i ? 'on' : ''}
                  src={p.images[0]}
                  alt={n === i ? `${p.title} — ${p.tagline}` : ''}
                  aria-hidden={n === i ? undefined : true}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 900px) 100vw, 62vw"
                  priority={n === 0}
                  loading={n === 0 ? undefined : 'lazy'}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="gal-copy" key={active.slug}>
          <div className="gal-head">
            {MARKS[active.slug] && (
              <span
                className="gal-mark"
                style={{ background: MARKS[active.slug].bg }}
                aria-hidden="true"
              >
                <Image src={MARKS[active.slug].src} alt="" width={48} height={48} sizes="48px" />
              </span>
            )}
            <div>
              <p className="gal-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </p>
              <h3 className="gal-name">{active.title}</h3>
            </div>
          </div>

          <p className="gal-tag">{active.tagline}</p>
          <p className="gal-desc">{active.desc}</p>

          <ul className="gal-stack" aria-label={c.work.stackLabel}>
            {active.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <a
            className="btn btn-solid gal-go"
            href={active.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${active.title} — ${c.work.cta}`}
          >
            {c.work.cta}
            <span className="circ" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>

      {/* ---------------- the index ---------------- */}
      <div
        className="gal-strip"
        data-anim-group
        role="tablist"
        aria-label={c.work.label}
        ref={tabsRef}
        onKeyDown={onKey}
      >
        {projects.map((p, n) => (
          <button
            key={p.slug}
            type="button"
            role="tab"
            aria-selected={n === i}
            aria-controls="gal-panel"
            tabIndex={n === i ? 0 : -1}
            className={`gal-tab ${n === i ? 'on' : ''}`}
            onClick={() => setI(n)}
            onMouseEnter={() => setI(n)}
            onFocus={() => setI(n)}
          >
            <span className="gal-thumb" aria-hidden="true">
              <Image src={p.images[0]} alt="" width={320} height={200} sizes="220px" loading="lazy" />
            </span>
            <span className="gal-tab-body">
              <span className="gal-tab-name">{p.title}</span>
              <span className="gal-tab-tag">{p.tagline}</span>
            </span>
            <span className="gal-tab-bar" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="pillars-cta" data-anim="rise">
        <Link className="btn btn-ghost" href={`/${lang}${ROUTES.work}`}>
          {c.routes.work.eyebrow}
          <span className="circ" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

export type { Project };
