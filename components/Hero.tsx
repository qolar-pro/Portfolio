'use client';

import Link from 'next/link';
import Counter from '@/components/Counter';
import Marquee from '@/components/Marquee';
import LiquidField from '@/components/LiquidField';

/**
 * The homepage hero.
 *
 * The R3F orb is gone. It cost ~700KB of deferred JavaScript, rendered through
 * software GL where hardware acceleration was unavailable, and measured ~10fps
 * under the behaviour gate. `LiquidField` replaces it with drifting CSS blobs:
 * nothing to download, `transform`-only animation, and the same job done — an
 * ambient sense that the surface is alive.
 *
 * The headline highlights word by word rather than line by line. One phrase
 * carries the ember; the rest stays quiet. That is the reference site's move
 * and it works because the eye lands on the claim, not on the sentence.
 */

const CAPABILITIES = [
  'Custom websites',
  'Online stores',
  'Redesigns',
  'Greek · Macedonian · English',
  'On-page SEO',
  'Built from scratch',
];

/** Words wrapped in [brackets] resolve to ember. Everything else stays quiet. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        const key = part.startsWith('[') && part.endsWith(']');
        return (
          <span key={i} className={key ? 'text-heat' : undefined}>
            {key ? part.slice(1, -1) : part}
          </span>
        );
      })}
    </>
  );
}

export default function Hero({
  ctaPrimary,
  ctaSecondary,
  hrefPrimary,
  hrefSecondary,
  proof,
}: {
  headline: string;
  subhead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  hrefPrimary: string;
  hrefSecondary: string;
  proof: { value: string; label: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-base">
      <LiquidField />

      <div className="mx-auto flex w-full max-w-[1240px] flex-col justify-center px-5 pt-24 pb-12 md:min-h-[88vh] md:pt-32">
        <div data-reveal className="is-revealed flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-ember" />
            <p className="font-mono text-2xs tracking-[0.22em] text-ember uppercase">
              Nova&thinsp;·&thinsp;Faber — the new maker
            </p>
          </div>

          <h1 className="display-xl max-w-[16ch] text-text-primary">
            <span className="line-mask">
              <span>
                <Highlighted text="Websites built" />
              </span>
            </span>
            <span className="line-mask">
              <span style={{ transitionDelay: '110ms' }}>
                <Highlighted text="[from scratch,]" />
              </span>
            </span>
            <span className="line-mask">
              <span style={{ transitionDelay: '220ms' }}>
                <Highlighted text="not from a theme." />
              </span>
            </span>
          </h1>

          <p className="max-w-[58ch] text-lead text-text-secondary">
            Custom sites and online stores for businesses in Greece, North Macedonia and further
            afield — written to a performance budget, in the languages your customers actually
            read, by the person who answers your email.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={hrefPrimary}
              className="group inline-flex items-center gap-2.5 rounded-full bg-ember py-3.5 ps-7 pe-3 font-display text-lg tracking-wide text-base transition-colors hover:bg-ember-hot"
            >
              {ctaPrimary}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-base/15">
                <span aria-hidden className="arrow-slide leading-none">
                  →
                </span>
              </span>
            </Link>
            <Link
              href={hrefSecondary}
              className="group inline-flex items-center gap-2.5 rounded-full border border-rule-strong px-7 py-3.5 font-display text-lg tracking-wide text-text-primary transition-colors hover:border-ember hover:text-ember"
            >
              {ctaSecondary}
              <span aria-hidden className="arrow-slide">
                →
              </span>
            </Link>
          </div>
        </div>

        <div
          data-reveal
          data-reveal-delay="340"
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-forge-rule bg-forge-rule sm:grid-cols-3"
        >
          {proof.map((p) => (
            <div
              key={p.label}
              className="card-lift corner-mark flex flex-col gap-2 bg-surface-1 px-7 py-8"
            >
              <Counter
                value={p.value}
                className="font-display text-6xl leading-none text-ember tabular-nums"
              />
              <span className="font-mono text-2xs tracking-[0.1em] text-text-muted uppercase">
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Marquee items={CAPABILITIES} />
    </section>
  );
}
