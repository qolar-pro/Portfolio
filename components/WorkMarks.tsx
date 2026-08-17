import Image from 'next/image';
import Link from 'next/link';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';
import { MARKS } from '@/lib/marks';

/**
 * The homepage work section: each project as its own big mark.
 *
 * The detailed case-study layout still exists — it is the /work route.
 */

export function WorkMarks({ c, lang }: { c: SiteContent; lang: Lang }) {
  const projects = c.work.projects.filter((p) => !p.lab);

  return (
    <>
      <div className="marks">
        {projects.map((p, i) => {
          const mark = MARKS[p.slug];
          const hidden = Boolean(p.embargo);

          const inner = (
            <>
              <span className="tile-pattern" aria-hidden="true" />
              <span className={`mark-plate ${hidden ? 'is-embargoed' : ''}`} style={{ background: mark?.bg }}>
                {mark && (
                  <Image
                    src={mark.src}
                    alt={hidden ? '' : `${p.title} logo`}
                    aria-hidden={hidden || undefined}
                    width={160}
                    height={160}
                    sizes="160px"
                  />
                )}
              </span>
              <span className="mark-name">{p.title}</span>
              <span className="mark-tag">{p.tagline}</span>
              <span className={`mark-go ${hidden ? 'is-soon' : ''}`}>
                {hidden ? (
                  c.work.embargoLabel
                ) : (
                  <>
                    {c.work.cta}
                    <span aria-hidden="true"> ↗</span>
                  </>
                )}
              </span>
            </>
          );

          /* No anchor while a project is embargoed — a link here would send
             visitors straight to the design the blur is protecting. */
          return hidden ? (
            <div className="mark-tile is-embargoed" key={p.slug} style={{ ['--i' as string]: i }}>
              {inner}
            </div>
          ) : (
            <a
              className="mark-tile"
              key={p.slug}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ['--i' as string]: i }}
            >
              {inner}
            </a>
          );
        })}
      </div>

      <div className="pillars-cta">
        <Link className="btn btn-solid" href={`/${lang}${ROUTES.work}`}>
          {c.routes.work.eyebrow}
          <span className="circ" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </>
  );
}
