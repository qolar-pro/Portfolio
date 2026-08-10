import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import { Band, Button, Eyebrow } from '@/components/ui';
import { ReadingSurface } from '@/components/Surface';

/**
 * A case study page.
 *
 * There are no outcome metrics anywhere on these pages, and that is a
 * constraint rather than an oversight — the studio has no analytics access to
 * either client, and an invented conversion figure would make every other
 * claim on the site suspect.
 *
 * So these are built on what was made and *why*. The reasoning has to carry
 * what a statistic normally would, which is why the body is prose rather than
 * a feature list: a prospect learns that the studio thinks about their
 * business before it thinks about code, which is the thing they are shopping
 * for.
 */
export default function CaseStudyPage({ locale, id }: { locale: Locale; id: string }) {
  const c = contentFor(locale);
  const study = c.caseStudies.find((s) => s.id === id);
  if (!study) return null;

  return (
    <>
      <Band className="border-b border-rule">
        <div className="flex flex-col gap-6">
          <Eyebrow>{study.surface === 'lab' ? 'Lab' : 'Selected work'}</Eyebrow>
          <h1 className="max-w-[18ch] text-4xl md:text-5xl">{study.name}</h1>
          <p className="max-w-[var(--measure)] text-lg text-ink-soft">{study.tagline}</p>
          {study.url ? (
            <a
              href={study.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-2xs tracking-[0.1em] text-ember uppercase underline underline-offset-4"
            >
              Visit the live site ↗
            </a>
          ) : null}
        </div>
      </Band>

      {study.images.length > 0 ? (
        <div className="mx-auto w-full max-w-[1120px] px-5 py-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
            <Image
              src={study.images[0]}
              alt={`${study.name} — screenshot`}
              fill
              sizes="(max-width: 1120px) 100vw, 1120px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      ) : null}

      <ReadingSurface>
        {study.body.map((para) => (
          <p key={para.slice(0, 40)} className="mb-5 last:mb-0">
            {para}
          </p>
        ))}
      </ReadingSurface>

      <Band tone="surface" className="border-y border-rule">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Eyebrow>What it does</Eyebrow>
            <ul className="mt-5 flex flex-col gap-2.5">
              {study.facts.map((f) => (
                <li key={f} className="flex gap-3">
                  <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0 bg-ember" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Built with</Eyebrow>
            <p className="mt-5 font-mono text-sm text-ink-soft">{study.stack.join(' · ')}</p>
          </div>
        </div>
      </Band>

      {study.images.length > 1 ? (
        <div className="mx-auto grid w-full max-w-[1120px] gap-5 px-5 py-10 sm:grid-cols-2">
          {study.images.slice(1).map((src) => (
            <div key={src} className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
              <Image
                src={src}
                alt={`${study.name} — screenshot`}
                fill
                sizes="(max-width: 640px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}

      <Band className="border-t border-rule">
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-5">
          <h2 className="text-3xl">Want something built like this?</h2>
          <div className="flex flex-wrap gap-3">
            <Button href={href(locale, 'contact')}>{c.chrome.ctaQuote}</Button>
            <Link
              href={href(locale, 'work')}
              className="inline-flex items-center px-2 py-3 text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              See the other work
            </Link>
          </div>
        </div>
      </Band>
    </>
  );
}
