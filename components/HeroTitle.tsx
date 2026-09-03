/**
 * The title card.
 *
 * ── THE ENTRANCE IS CSS, AND THAT IS THE POINT ───────────────────────
 * The two lines arrive from opposite sides at the same moment — "BUILT
 * FROM" from the right, "SCRATCH." from the left — and pop as they meet in
 * the middle. All of it lives in `@keyframes hero-in-*` in globals.css.
 *
 * It was built in GSAP first, and measuring it is what moved it:
 *
 *   - The travel was real (953px in from each side, both landing at 0) but
 *     it did not START until ~2.3s after the page painted, because a GSAP
 *     timeline inside an effect cannot run until React has hydrated. So the
 *     visitor saw the finished headline, watched it jump off-screen, and
 *     watched it come back. An entrance that plays after the thing has
 *     already arrived is worse than no entrance at all.
 *   - `expo.out` put the lines 97% of the way home inside the first half of
 *     the duration. The travel was over before the eye found it, and all
 *     anyone registered was the pop.
 *   - The pop itself peaked at scale 1.019. Under two percent is not a pop,
 *     it is a rounding error.
 *
 * A CSS animation with `both` fill starts at first paint. No hydration on
 * the critical path for the site's signature moment, no JavaScript at all,
 * and it runs on the compositor. The curve is power3-shaped rather than
 * exponential so the lines spend real time crossing the frame, and the
 * overshoot is 4%, which can actually be seen.
 *
 * ── DD-2 HOLDS, MORE STRONGLY THAN BEFORE ────────────────────────────
 * The resting state is the finished state. The from-state exists only
 * inside the keyframes, so there is no path that leaves the heading
 * hidden: no JS is involved, and if the stylesheet loaded then the
 * animation loaded with it. `prefers-reduced-motion` cancels it in the
 * same file.
 *
 * ── WHY THE CHARACTERS ARE SPLIT ─────────────────────────────────────
 * Each character is its own element so the letters can float at rest and
 * react individually to the pointer (see `.ch` in globals.css). There is no
 * CSS way to address a character, so the split happens here. `--i` carries
 * the index, which is what gives each letter its own phase — without it the
 * whole line would bob as one rigid block.
 */
function split(text: string) {
  return text.split('').map((ch, i) => {
    if (ch === ' ') return <span className="sp" key={i}>&nbsp;</span>;
    return (
      <span className="ch" key={i} style={{ ['--i' as string]: i }}>
        {ch}
      </span>
    );
  });
}

export function HeroTitle({ a, b }: { a: string; b: string }) {
  return (
    <h1>
      <span className="title-line">
        <span className="line-a">{split(a)}</span>
      </span>
      <span className="title-line">
        <em className="line-b">{split(b)}</em>
      </span>
    </h1>
  );
}
