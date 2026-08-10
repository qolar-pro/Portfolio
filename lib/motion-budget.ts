/**
 * The motion budget (SPEC §3.1, §3.3 — Phase 1).
 *
 * The old site's problem was never any single effect. It was eight running at
 * once, everywhere, over body copy, under a film grade. This module states
 * which effects a given surface may run, so "one interaction idea per section"
 * is something a component reads rather than something a person remembers.
 *
 * Adding an effect to a surface means removing one. That is the budget.
 */

/**
 * `spectacle` — hero, case-study openers, /lab. No body copy lives here, so
 *   the full treatment is safe.
 * `reading`   — services, pricing, process, case-study bodies, contact.
 *   Where people decide whether to pay. Motion here costs comprehension.
 * `chrome`    — header, footer, nav. Persistent, so effects must be cheap and
 *   must never fire while someone is reading something else.
 */
export type Surface = 'spectacle' | 'reading' | 'chrome';

export type Effect =
  | 'cursor'
  | 'magnetic'
  | 'tilt'
  | 'velocitySkew'
  | 'textRoll'
  | 'marquee'
  | 'reveal'
  | 'cameraScroll'
  | 'grade';

export const BUDGET: Record<Surface, readonly Effect[]> = {
  spectacle: ['cursor', 'magnetic', 'velocitySkew', 'reveal', 'cameraScroll', 'grade'],
  reading: ['cursor', 'reveal'],
  chrome: ['cursor', 'textRoll'],
} as const;

export function allows(surface: Surface, effect: Effect): boolean {
  return BUDGET[surface].includes(effect);
}

/**
 * Why each effect landed where it did. Kept in code rather than a document
 * because the reasoning is what stops a later session quietly re-enabling
 * something on a reading surface "because it looks flat".
 */
export const RATIONALE: Record<Effect, string> = {
  cursor:
    'The one global flourish. For a design studio it signals capability before anyone reads a word, and it costs no legibility.',
  magnetic:
    'Primary CTAs only. It is a "this matters" signal; applying it to every link spends the signal for nothing.',
  tilt: 'Cut from reading surfaces. Card tilt actively fights scanning when someone is comparing four services.',
  velocitySkew:
    'Spectacle only, and reduced. Shearing the page up to 3.2 degrees while scrolling was the most reading-hostile effect on the old site.',
  textRoll: 'Nav links. Hover-only, so it never fires while someone is reading.',
  marquee:
    'Earns its place on the "live in production" client strip, where continuous motion carries meaning. Not as decoration.',
  reveal:
    'Allowed everywhere. Fires once, on entry, then the content is static — it does not compete with reading.',
  cameraScroll:
    'Homepage hero only (DD-7). It is what makes the hero, and what makes a pricing table unreadable.',
  grade:
    'Post-processing. Never behind body text (DD-8): chromatic aberration offsets colour channels at edges, and letterforms are edges.',
};

/** Cut entirely — recorded so the absence reads as a decision, not an oversight. */
export const RETIRED = {
  preloader:
    'Delays LCP on a site whose pitch is speed (SPEC §7 sets LCP <= 2.0s). A preloader sets a mood on a portfolio; on a business site it is a toll booth.',
  ghostNumeral:
    'The clamp(6rem,18vw,15rem) numeral drifting behind every H2. Two things occupied one spot and neither won.',
} as const;
