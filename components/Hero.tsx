'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useQuality } from '@/lib/quality';
import { FULL } from '@/lib/grade';

/**
 * The homepage hero.
 *
 * Order of operations matters more than the visual here. The type renders on
 * the server and is the LCP element; the canvas is dynamically imported and
 * only mounts after `useQuality` has run on the client. So the hero is
 * complete and readable before any of three.js is requested, and on the
 * `static` tier it is never requested at all.
 *
 * That ordering is what lets a site selling performance ship a WebGL hero
 * without contradicting itself.
 */
const ForgeCanvas = dynamic(() => import('@/components/canvas/ForgeCanvas'), {
  ssr: false,
});

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

  return (
    <section className="relative isolate overflow-hidden border-b border-rule bg-ground">
      {/* Static tier gets a real hero, not an empty box: a banked-forge glow,
          drawn by the browser at zero cost. SPEC §3.4 requires the no-WebGL
          path be complete rather than degraded. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 55% at 72% 38%, color-mix(in oklab, var(--ember) 26%, transparent) 0%, transparent 70%)',
        }}
      />

      {tier !== 'static' ? (
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-90">
          <ForgeCanvas detail={detail} grade={FULL} />
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1120px] px-5 py-20 md:py-28">
        <div className="flex flex-col gap-8">
          <h1 className="max-w-[20ch] text-5xl md:text-6xl">{headline}</h1>
          <p className="max-w-[var(--measure)] text-lg text-ink-soft">{subhead}</p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={hrefPrimary}
              className="inline-flex items-center justify-center bg-ember px-6 py-3 font-display text-lg tracking-wide text-surface transition-colors hover:bg-ink"
            >
              {ctaPrimary}
            </Link>
            <Link
              href={hrefSecondary}
              className="inline-flex items-center justify-center border border-rule-strong px-6 py-3 font-display text-lg tracking-wide text-ink transition-colors hover:border-ink"
            >
              {ctaSecondary}
            </Link>
          </div>

          <div className="mt-4 grid gap-px bg-rule sm:grid-cols-3">
            {proof.map((p) => (
              <div key={p.label} className="flex flex-col gap-1 bg-surface px-5 py-5">
                <span className="font-display text-4xl leading-none text-ember tabular-nums">
                  {p.value}
                </span>
                <span className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
