import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import { Band, Eyebrow } from '@/components/ui';

/**
 * `/work` and `/lab` share this component, filtered by surface.
 *
 * DD-4 keeps them apart: client work sells, lab work demonstrates range. A
 * game engine sitting between two client projects makes a prospect wonder
 * whether their site is a side interest.
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
      <Band className="border-b border-rule">
        <div className="flex flex-col gap-6">
          <Eyebrow>{surface === 'lab' ? 'Lab' : 'Work'}</Eyebrow>
          <h1 className="max-w-[20ch] text-4xl md:text-5xl">{title}</h1>
          <p className="max-w-[var(--measure)] text-lg text-ink-soft">{lede}</p>
        </div>
      </Band>

      <Band>
        <div className="flex flex-col gap-px bg-rule">
          {studies.map((study) => (
            <Link
              key={study.id}
              href={href(locale, `${surface === 'lab' ? 'lab' : 'work'}/${study.id}`)}
              className="group grid gap-6 bg-ground p-6 transition-colors hover:bg-surface md:grid-cols-[18rem_1fr] md:items-center"
            >
              {study.images[0] ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
                  <Image
                    src={study.images[0]}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 288px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl group-hover:text-ember">{study.name}</h2>
                <p className="text-ink-soft">{study.tagline}</p>
                <p className="mt-2 font-mono text-2xs tracking-[0.08em] text-muted uppercase">
                  {study.stack.slice(0, 4).join(' · ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Band>
    </>
  );
}
