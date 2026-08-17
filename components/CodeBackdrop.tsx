'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, registerMotion } from '@/lib/motion';

/**
 * The hero's moving backdrop: a wall of source scrolling behind the type.
 *
 * This replaces a stock video deliberately — a few KB of markup instead of a
 * multi-megabyte download, no licence, and the code on screen is the site's
 * own rather than a stranger's. Tokenised by hand (the approach carried over
 * from the old site's heroCode.ts) so there is no highlighter dependency and
 * the output is stable between server and client.
 *
 * Depth is the whole trick. A flat wall of evenly-lit text reads as
 * wallpaper; a lens does not resolve everything at once. So the field is
 * built in three planes — a far plane scaled up and thrown out of focus, a
 * mid plane softened, a near plane nearly sharp — each drifting at its own
 * rate, with the headline the only genuinely sharp thing on screen.
 *
 * Swap in a real clip by dropping an MP4 at /public/video/hero.mp4 and
 * rendering it in place of .code-field — the lighting, vignette and grain
 * layers sit on top and are independent of what is behind them.
 */

type Kind = 'kw' | 'comp' | 'attr' | 'str' | 'punct' | 'cm' | 'num';
type Tok = [Kind, string];

const LINES: Tok[][] = [
  [['cm', '// novafaber — studio platform']],
  [['kw', 'export function '], ['comp', 'Studio'], ['punct', '() {']],
  [['kw', '  const '], ['attr', 'work'], ['punct', ' = ['], ['str', "'a25'"], ['punct', ', '], ['str', "'kd-law'"], ['punct', ', '], ['str', "'sneaker-air'"], ['punct', '];']],
  [['kw', '  return '], ['punct', '(']],
  [['punct', '    <'], ['comp', 'Platform'], ['attr', ' locale'], ['punct', '={['], ['str', "'el'"], ['punct', ', '], ['str', "'en'"], ['punct', ']}>']],
  [['punct', '      <'], ['comp', 'Commerce'], ['attr', ' checkout'], ['punct', '='], ['str', '"stripe | cash"'], ['punct', ' />']],
  [['punct', '      <'], ['comp', 'Inventory'], ['attr', ' perVariant'], ['punct', ' />']],
  [['punct', '    </'], ['comp', 'Platform'], ['punct', '>']],
  [['punct', '  );']],
  [['punct', '}']],
  [['cm', '']],
  [['kw', 'async function '], ['comp', 'deploy'], ['punct', '() {']],
  [['kw', '  await '], ['attr', 'build'], ['punct', '({ '], ['attr', 'target'], ['punct', ': '], ['str', "'edge'"], ['punct', ' });']],
  [['kw', '  await '], ['attr', 'migrate'], ['punct', '(); '], ['cm', '// zero downtime']],
  [['kw', '  return '], ['attr', 'ship'], ['punct', '('], ['str', "'production'"], ['punct', ');']],
  [['punct', '}']],
  [['cm', '']],
  [['cm', '// per-size stock, resolved at request time']],
  [['kw', 'const '], ['attr', 'sizes'], ['punct', ' = '], ['kw', 'await '], ['comp', 'db'], ['punct', '.'], ['attr', 'query'], ['punct', '(']],
  [['str', '  `select size, qty from stock where sku = $1`'], ['punct', ', [sku]);']],
  [['cm', '']],
  [['kw', 'server'], ['punct', '.'], ['attr', 'listen'], ['punct', '('], ['num', '3000'], ['punct', ', () => {']],
  [['comp', '  log'], ['punct', '('], ['str', "'listening'"], ['punct', ', { '], ['attr', 'region'], ['punct', ': '], ['str', "'fra1'"], ['punct', ' });']],
  [['punct', '});']],
  [['cm', '']],
  [['kw', 'type '], ['comp', 'Lead'], ['punct', ' = { '], ['attr', 'budget'], ['punct', ': '], ['comp', 'Range'], ['punct', '; '], ['attr', 'scope'], ['punct', ': '], ['comp', 'Brief'], ['punct', ' };']],
  [['kw', 'function '], ['comp', 'qualify'], ['punct', '(lead: '], ['comp', 'Lead'], ['punct', ') {']],
  [['kw', '  return '], ['attr', 'lead'], ['punct', '.'], ['attr', 'budget'], ['punct', '.'], ['attr', 'min'], ['punct', ' >= '], ['num', '1500'], ['punct', ';']],
  [['punct', '}']],
  [['cm', '']],
  [['cm', '// three languages, one content tree']],
  [['kw', 'export const '], ['attr', 'content'], ['punct', ': '], ['comp', 'Record'], ['punct', '<'], ['comp', 'Lang'], ['punct', ', '], ['comp', 'Site'], ['punct', '> = { el, en };']],
];

function Block() {
  return (
    <div className="code-block">
      {LINES.map((line, i) => (
        <div className="code-line" key={i}>
          {line.map(([kind, text], j) => (
            <span className={`t-${kind}`} key={j}>
              {text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Two columns of duplicated source — wide enough to cover the frame. */
function Wall() {
  return (
    <div className="code-wall">
      <div className="code-column">
        <Block />
        <Block />
      </div>
      <div className="code-column alt">
        <Block />
        <Block />
      </div>
    </div>
  );
}

export function CodeBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    registerMotion();

    const ctx = gsap.context(() => {
      // planes part company as the hero leaves — the far one barely moves,
      // which is what sells the distance between them
      gsap.to('.plane-far', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
      gsap.to('.plane-mid', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
      gsap.to('.plane-near', {
        yPercent: 24,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="code-backdrop" ref={rootRef} aria-hidden="true">
      <div className="code-field">
        {/* Every plane fills the frame edge to edge — a single column left the
            right side empty and the composition lopsided. The vignette, not
            the absence of content, is what makes the edges fall away. */}

        {/* far — scaled up and thrown out of focus */}
        <div className="plane plane-far">
          <Wall />
        </div>

        {/* mid — the body of the field, softened */}
        <div className="plane plane-mid">
          <Wall />
        </div>

        {/* near — closest to camera, fastest */}
        <div className="plane plane-near">
          <Wall />
        </div>
      </div>

      {/* two-point lighting: warm key upper right, cool fill lower left */}
      <div className="hero-key" />
      <div className="hero-fill" />
      <div className="code-scrim" />
      <div className="hero-grain" />
    </div>
  );
}
