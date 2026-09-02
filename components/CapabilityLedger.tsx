'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { SHIFT } from '@/lib/motion';
import { useScrubbed } from '@/lib/scrollMotion';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';

/**
 * Capabilities — the Ledger.
 *
 * ── WHAT IT IS ───────────────────────────────────────────────────────
 * Three full-width entries, numbered, ruled off from one another: the
 * contents page of a monograph rather than three cards in a row. Cards ask
 * you to compare; a contents page asks you to read down. Nothing here is
 * boxed, nothing is elevated, and no two entries have to be the same height
 * — which is the whole reason this shape beat the card grid it replaces.
 *
 * ── THE MOTION, AND WHY IT IS SCRUBBED ───────────────────────────────
 * Every moving part is tied to the row's own scroll position via
 * `useScrubbed`, so it runs forward on the way down and backward on the way
 * up. Two behaviours, deliberately, because a contents page that performs
 * four tricks is a brochure:
 *
 *   1. DIFFERENTIAL DRIFT. The index number travels the full length of the
 *      row's pass; the title/description block travels about a fifth of it.
 *      Crucially both cross zero — their authored position — at the middle
 *      of the pass, so the row is *typographically correct exactly when it
 *      is in the reading position* and drifts only on approach and exit.
 *      That is the difference between parallax and a reveal: it never
 *      finishes, so it never becomes inert.
 *
 *   2. THE RULE DRAWS ITSELF. The ledger's structure IS its hairlines, so
 *      the hairline is what tracks the reader: it draws left to right over
 *      the first half of the row's pass and holds. Scroll back and it
 *      unwrites. This is why the rule is a real element and not a
 *      `border-bottom` — GSAP cannot address a border, and a pseudo-element
 *      is equally out of reach.
 *
 * Rejected, on purpose:
 *   - Progressive reveal of the sub-item run. It makes *copy* a function of
 *     scroll position: park mid-range and the last three items sit at
 *     partial opacity indefinitely, failing the AA contract and, under
 *     DD-5, quietly editing frozen copy by hiding part of it.
 *   - Weight/contrast lifting toward the reading position. Same defect in a
 *     smaller dose — the settled state still has to clear AA, which leaves
 *     the lifted state either imperceptible or an accessibility bug. It
 *     also competes with (1) for the same glance.
 *
 * DD-2 holds throughout: the resting CSS is the finished state — rule at
 * `scaleX(1)`, nothing offset, nothing faded. Under `prefers-reduced-motion`
 * `useScrubbed` registers nothing at all and this renders as authored.
 *
 * ── WHY THE ROWS ARE NOT LINKS ───────────────────────────────────────
 * There is no per-discipline route to send them to; all three would point
 * at `/services`, which is redundant navigation on the homepage and a
 * self-link on `/services` itself. The rows are content, the single CTA
 * below is the navigation. The hover/focus treatment on a row is therefore
 * decoration only — it reveals nothing that is not already on screen — so
 * no information is behind a pointer.
 *
 * Copy is untouched, per DD-5.
 */

type Pillar = SiteContent['services']['pillars'][number];

/**
 * One entry. This is a component rather than a loop body because each row
 * needs its own ScrollTrigger keyed to its own position — a single timeline
 * for the whole section would drift all three rows off one shared progress,
 * which is precisely the canned-effect feel the brief rules out. Hooks
 * cannot be called in a loop, so the loop body has to be a component.
 */
function LedgerRow({ p, n, H }: { p: Pillar; n: number; H: 'h2' | 'h3' }) {
  const ref = useRef<HTMLLIElement>(null);

  useScrubbed(
    ref,
    (tl) => {
      /* Durations are explicit because `registerMotion()` sets a global
         default of 0.9s and the timeline's total duration is what the scrub
         normalises against — leaving them implicit makes "half way through
         the row's pass" mean whatever the last tween happened to be. With
         these numbers total duration is 1, so a position of 0.5 is literally
         the middle of the range.

         `ease: 'none'` on every tween: a scrub already has its own easing
         (the `scrub` catch-up), and stacking expo.out on top of it reads as
         the page lagging behind the wheel rather than as weight. */

      /* The number carries the full drift, the block carries a fraction of
         it. Both pass through 0 at the midpoint. */
      tl.fromTo(
        '.ldg-n',
        { y: SHIFT.drift * 0.55 },
        { y: SHIFT.drift * -0.55, duration: 1, ease: 'none' },
        0,
      );
      tl.fromTo(
        '.ldg-main',
        { y: SHIFT.drift * 0.2 },
        { y: SHIFT.drift * -0.2, duration: 1, ease: 'none' },
        0,
      );

      /* Drawn by the halfway point so the entry is whole while it is being
         read; the second half of the range is the hold. */
      tl.fromTo(
        '.ldg-rule',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: 'none' },
        0,
      );
    },
    /* Starts just before the row clears the fold and ends once its foot has
       passed the reading line, so the midpoint — where everything sits at
       its authored position — lands where the eye actually is. */
    { start: 'top 92%', end: 'bottom 42%', scrub: 0.55 },
  );

  return (
    <li className="ldg-row" ref={ref}>
      {/* The <ol> already carries the ordering; this is the typographic
          expression of it, so it is hidden rather than read out twice. */}
      <span className="ldg-n" aria-hidden="true">
        {String(n + 1).padStart(2, '0')}
      </span>

      <div className="ldg-main">
        <H className="ldg-title">{p.title}</H>
        <p className="ldg-desc">{p.desc}</p>
      </div>

      <ul className="ldg-items">
        {p.items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>

      {/* Decorative: the row's own hairline, and the thing the scrub draws. */}
      <span className="ldg-rule" aria-hidden="true" />
      {/* Decorative: the hover/focus edge. */}
      <span className="ldg-edge" aria-hidden="true" />
    </li>
  );
}

export function CapabilityLedger({
  c,
  lang,
  headingLevel = 3,
}: {
  c: SiteContent;
  lang: Lang;
  headingLevel?: 2 | 3;
}) {
  const H = `h${headingLevel}` as 'h2' | 'h3';

  return (
    <div className="ldg">
      {/* DD-3. Opacity is set in the stylesheet, not left to default: an
          `inset: 0` texture layer with no opacity renders at full strength
          over the copy, which is how the pillar cards shipped once. */}
      <div className="ldg-tex" aria-hidden="true" />

      <ol className="ldg-rows">
        {c.services.pillars.map((p, n) => (
          <LedgerRow key={p.title} p={p} n={n} H={H} />
        ))}
      </ol>

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
