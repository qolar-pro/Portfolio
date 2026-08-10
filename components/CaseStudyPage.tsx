import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import { Band, Button, Eyebrow, GridRule, PageHeader, Tag } from '@/components/ui';
import LivePreview from '@/components/LivePreview';

/**
 * A case study page.
 *
 * No outcome metrics anywhere (DD-24) — there is no analytics access to these
 * clients, and an invented figure would poison every other claim on a site
 * whose positioning rests on things a visitor cannot verify. So the pages are
 * built on what was made and *why*, and the live preview does the work a
 * statistic normally would: the visitor can go and look.
 */
export default function CaseStudyPage({ locale, id }: { locale: Locale; id: string }) {
  const c = contentFor(locale);
  const study = c.caseStudies.find((s) => s.id === id);
  if (!study) return null;

  const isLab = study.surface === 'lab';
  const siblings = c.caseStudies.filter((s) => s.surface === study.surface && s.id !== study.id);

  return (
    <>
      <PageHeader
        eyebrow={isLab ? 'Lab' : 'Selected work'}
        title={study.name}
        lede={study.tagline}
        meta={study.stack.map((t) => (
          <Tag key={t} tone="forge">
            {t}
          </Tag>
        ))}
      />

      {study.url ? (
        <div className="forge">
          <div className="mx-auto w-full max-w-[1120px] px-5 pb-20">
            <div data-reveal>
              <LivePreview url={study.url} name={study.name} />
            </div>
          </div>
        </div>
      ) : null}

      <Band>
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr] md:gap-16">
          <div data-reveal className="max-w-[var(--measure)]">
            {study.body.map((para) => (
              <p key={para.slice(0, 40)} className="mb-6 text-lg last:mb-0">
                {para}
              </p>
            ))}
          </div>

          <aside data-reveal data-reveal-delay="120" className="flex flex-col gap-8">
            <div>
              <Eyebrow>What it does</Eyebrow>
              <ul className="mt-4 flex flex-col gap-2.5">
                {study.facts.map((f) => (
                  <li key={f} className="flex gap-3 text-sm">
                    <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-ember" />
                    <span className="text-ink-soft">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow>Built with</Eyebrow>
              <p className="mt-4 font-mono text-sm text-ink-soft">{study.stack.join(' · ')}</p>
            </div>
            {study.url ? (
              <div>
                <Eyebrow>Live at</Eyebrow>
                <a
                  href={study.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block font-mono text-sm text-ember underline underline-offset-4"
                >
                  {study.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
                </a>
              </div>
            ) : null}
          </aside>
        </div>
      </Band>

      {study.images.length > 0 ? (
        <Band tone="surface" wide>
          <Eyebrow>Screens</Eyebrow>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {study.images.map((src, i) => (
              <div
                key={src}
                data-reveal
                data-reveal-delay={String(i * 80)}
                className={`relative aspect-[16/10] w-full overflow-hidden bg-ground ${
                  i === 0 ? 'sm:col-span-2 sm:aspect-[16/8]' : ''
                }`}
              >
                <Image
                  src={src}
                  alt={`${study.name} — screen ${i + 1}`}
                  fill
                  sizes={i === 0 ? '(max-width: 1320px) 100vw, 1280px' : '(max-width: 640px) 100vw, 640px'}
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </Band>
      ) : null}

      {siblings.length > 0 ? (
        <Band>
          <Eyebrow>{isLab ? 'More from the lab' : 'More work'}</Eyebrow>
          <GridRule cols="md:grid-cols-2" className="mt-8">
            {siblings.map((s) => (
              <a
                key={s.id}
                href={href(locale, `${isLab ? 'lab' : 'work'}/${s.id}`)}
                className="group flex flex-col gap-2 bg-ground p-6 transition-colors hover:bg-surface"
              >
                <h2 className="text-xl group-hover:text-ember">{s.name}</h2>
                <p className="text-sm text-ink-soft">{s.tagline}</p>
              </a>
            ))}
          </GridRule>
        </Band>
      ) : null}

      <Band tone="forge" glow>
        <div data-reveal className="mx-auto flex max-w-[var(--measure)] flex-col gap-5">
          <h2 className="text-3xl text-forge-ink md:text-4xl">Want something built like this?</h2>
          <div className="flex flex-wrap gap-3">
            <Button href={href(locale, 'contact')} tone="forge">
              {c.chrome.ctaQuote}
            </Button>
            <Button href={href(locale, 'work')} tone="forge" variant="secondary">
              See the other work
            </Button>
          </div>
        </div>
      </Band>
    </>
  );
}
