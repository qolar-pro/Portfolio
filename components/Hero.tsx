'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useQuality } from '@/lib/quality';
import { FULL } from '@/lib/grade';
import Counter from '@/components/Counter';
import Marquee from '@/components/Marquee';

/**
 * The homepage hero.
 *
 * Ordering still matters most: the type renders on the server and is the LCP
 * element, and the canvas is dynamically imported after `useQuality` runs on
 * the client. Nothing below changes that — it changes what the type *does*.
 *
 * The headline is split into masked lines that rise out of their own clipping
 * boxes. That is the one typographic move the reference studios all share:
 * the static frame already reads as a poster, and the motion is the type
 * arriving rather than decoration wrapped around it.
 */
const ForgeCanvas = dynamic(() => import('@/components/canvas/ForgeCanvas'), { ssr: false });

const CAPABILITIES = [
  'Custom websites',
  'Online stores',
  'Redesigns',
  'Real-time 3D',
  'Greek · Macedonian · English',
  'On-page SEO',
  'Built from scratch',
];

export default function Hero({
  headline,
  subhead,
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
  const { tier, detail } = useQuality();

  // Break on the comma so each clause gets its own mask. Falls back to one
  // line if the copy has no comma, which keeps this safe across locales.
  const lines = headline.includes(', ')
    ? headline.split(/,\s+/).map((l, i, arr) => (i < arr.length - 1 ? `${l},` : l))
    : [headline];

  return (
    <section className="mesh-forge forge relative isolate overflow-hidden">
      {tier !== 'static' ? (
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-95">
          <ForgeCanvas detail={detail} grade={FULL} />
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-[1320px] flex-col justify-center px-5 pt-28 pb-10 md:min-h-[92vh] md:pt-36">
        <div data-reveal className="is-revealed flex flex-col gap-9">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-heat-ember" />
            <p className="font-mono text-2xs tracking-[0.22em] text-heat-ember uppercase">
              Nova&thinsp;·&thinsp;Faber — the new maker
            </p>
          </div>

          <h1 className="display-xl max-w-[15ch] text-forge-ink">
            {lines.map((line, i) => (
              <span key={line} className="line-mask">
                <span
                  style={{ transitionDelay: `${i * 110}ms` }}
                  className={i === lines.length - 1 ? 'text-heat' : undefined}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="max-w-[var(--measure)] text-lg text-forge-ink-soft md:text-xl">
            {subhead}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={hrefPrimary}
              className="group inline-flex items-center gap-3 bg-heat-ember px-7 py-3.5 font-display text-lg tracking-wide text-forge-void transition-colors hover:bg-heat-bright"
            >
              {ctaPrimary}
              <span aria-hidden className="arrow-slide">
                →
              </span>
            </Link>
            <Link
              href={hrefSecondary}
              className="group corner-mark inline-flex items-center gap-3 border border-forge-rule px-7 py-3.5 font-display text-lg tracking-wide text-forge-ink transition-colors hover:border-heat-ember hover:text-heat-ember"
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
          data-reveal-delay="380"
          className="mt-16 grid gap-px bg-forge-rule sm:grid-cols-3"
        >
          {proof.map((p) => (
            <div key={p.label} className="card-lift corner-mark flex flex-col gap-2 bg-forge-carbon px-6 py-7">
              <Counter
                value={p.value}
                className="font-display text-6xl leading-none text-heat-bright tabular-nums"
              />
              <span className="font-mono text-2xs tracking-[0.1em] text-forge-muted uppercase">
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
