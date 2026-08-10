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
    <section className="forge forge-glow relative isolate min-h-[86vh] overflow-hidden">
      {/* The shader is emissive — fresnel rim, glowing core — so it needs a
          dark ground to exist at all. On the light ground it previously sat on,
          it was fighting the page rather than lighting it (DD-26). */}
      {tier !== 'static' ? (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <ForgeCanvas detail={detail} grade={FULL} />
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-[1120px] flex-col justify-center px-5 py-24 md:min-h-[86vh] md:py-32">
        <div className="flex flex-col gap-8">
          <p
            data-reveal
            className="font-mono text-2xs tracking-[0.2em] text-heat-ember uppercase"
          >
            Nova&thinsp;·&thinsp;Faber — the new maker
          </p>

          <h1
            data-reveal
            data-reveal-delay="80"
            className="max-w-[18ch] text-5xl text-forge-ink md:text-6xl"
          >
            {headline}
          </h1>

          <p
            data-reveal
            data-reveal-delay="160"
            className="max-w-[var(--measure)] text-lg text-forge-ink-soft"
          >
            {subhead}
          </p>

          <div data-reveal data-reveal-delay="240" className="flex flex-wrap gap-3">
            <Link
              href={hrefPrimary}
              className="inline-flex items-center justify-center bg-heat-ember px-6 py-3 font-display text-lg tracking-wide text-forge-void transition-colors hover:bg-heat-bright"
            >
              {ctaPrimary}
            </Link>
            <Link
              href={hrefSecondary}
              className="inline-flex items-center justify-center border border-forge-rule px-6 py-3 font-display text-lg tracking-wide text-forge-ink transition-colors hover:border-heat-ember hover:text-heat-ember"
            >
              {ctaSecondary}
            </Link>
          </div>

          <div
            data-reveal
            data-reveal-delay="320"
            className="mt-6 grid gap-px bg-forge-rule sm:grid-cols-3"
          >
            {proof.map((p) => (
              <div key={p.label} className="flex flex-col gap-1 bg-forge-carbon px-5 py-5">
                <span className="font-display text-4xl leading-none text-heat-bright tabular-nums">
                  {p.value}
                </span>
                <span className="font-mono text-2xs tracking-[0.08em] text-forge-muted uppercase">
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
