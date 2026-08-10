import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import { Band, Button, Eyebrow, PageHeader, Tag } from '@/components/ui';

/**
 * `/work` and `/lab`, filtered by surface (DD-4 keeps them apart — a game
 * engine sitting between two client projects makes a prospect wonder whether
 * their site is a side interest).
 *
 * Alternating image side rather than a uniform grid: with three entries a grid
 * looks under-filled, and the zig-zag gives each project the width to be read
 * rather than scanned.
 */
export default function WorkIndex({
  locale,
  surface,
  title,
  lede,
}: {
  locale: Locale;
  surface: 'work' | 'lab';
  title: string;
  lede: string;
}) {
  const c = contentFor(locale);
  const studies = c.caseStudies.filter((s) => s.surface === surface);

  return (
    <>
      <PageHeader
        eyebrow={surface === 'lab' ? 'Lab' : 'Work'}
        title={title}
        lede={lede}
        meta={
          <Tag tone="forge">
            {studies.length} {surface === 'lab' ? 'experiments' : 'projects'}
          </Tag>
        }
      />

      <Band wide>
        <div className="flex flex-col gap-px bg-rule">
          {studies.map((study, i) => (
            <Link
              key={study.id}
              href={href(locale, `${surface}/${study.id}`)}
              data-reveal
              data-reveal-delay={String(i * 90)}
              className={`group grid items-center gap-8 bg-ground p-6 transition-colors hover:bg-surface md:gap-12 md:p-10 ${
                i % 2 === 1 ? 'md:grid-cols-[1fr_1.1fr]' : 'md:grid-cols-[1.1fr_1fr]'
              }`}
            >
              {study.images[0] ? (
                <div
                  className={`relative aspect-[16/10] w-full overflow-hidden bg-surface ${
                    i % 2 === 1 ? 'md:order-2' : ''
                  }`}
                >
                  <Image
                    src={study.images[0]}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 620px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}

              <div className="flex flex-col gap-4">
                <span className="font-mono text-2xs tracking-[0.14em] text-muted tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-3xl transition-colors group-hover:text-ember md:text-4xl">
                  {study.name}
                </h2>
                <p className="text-lg text-ink-soft">{study.tagline}</p>
                <p className="max-w-[52ch] text-ink-soft">{study.summary}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {study.stack.slice(0, 4).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Band>

      <Band tone="forge" glow>
        <div data-reveal className="mx-auto flex max-w-[var(--measure)] flex-col gap-5">
          <h2 className="text-3xl text-forge-ink md:text-4xl">
            {surface === 'lab' ? 'The client work is over here.' : 'Yours could be next.'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {surface === 'lab' ? (
              <Button href={href(locale, 'work')} tone="forge">
                See the work
              </Button>
            ) : (
              <Button href={href(locale, 'contact')} tone="forge">
                {c.chrome.ctaQuote}
              </Button>
            )}
            <Button href={href(locale, 'pricing')} tone="forge" variant="secondary">
              How pricing works
            </Button>
          </div>
        </div>
      </Band>
    </>
  );
}
