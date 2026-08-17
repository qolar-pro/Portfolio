import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';
import { MARKS } from '@/lib/marks';

/**
 * "Why they chose us" — the argument on the left, the receipts on the right.
 *
 * A logo wall this early only works if the logos are clickable proof, so each
 * mark links to the live site rather than sitting there as decoration. The
 * same four projects get their full treatment further down the page; this is
 * the compact claim, that is the evidence.
 */
export function ChosenPanel({ c, lang }: { c: SiteContent; lang: Lang }) {
  const projects = c.work.projects.filter((p) => !p.lab);

  return (
    <Reveal className="chosen">
      <div className="chosen-pattern" aria-hidden="true" />

      <div className="chosen-copy">
        <p className="eyebrow">{c.chosen.label}</p>
        <h2 className="chosen-h">{c.chosen.heading}</h2>
        <p className="chosen-desc">{c.chosen.desc}</p>
        <div className="chosen-actions">
          <Link className="btn btn-solid" href={`/${lang}${ROUTES.book}`}>
            {c.chosen.primary}
            <span className="circ" aria-hidden="true">
              →
            </span>
          </Link>
          <Link className="btn btn-ghost" href={`/${lang}${ROUTES.work}`}>
            {c.chosen.secondary}
            <span className="circ" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>

      <ul className="chosen-logos">
        {projects.map((p) => {
          const mark = MARKS[p.slug];
          const hidden = Boolean(p.embargo);

          const plate = (
            <>
              <span className={`chosen-plate ${hidden ? 'is-embargoed' : ''}`} style={{ background: mark?.bg }}>
                {mark && <Image src={mark.src} alt="" width={72} height={72} sizes="72px" />}
              </span>
              <span className="chosen-name">{p.title}</span>
            </>
          );

          /* Embargoed clients stay on the wall — they are still receipts —
             but the mark is blurred and it does not link anywhere yet. */
          return (
            <li key={p.slug} className={hidden ? 'is-embargoed' : undefined}>
              {hidden ? (
                <span>{plate}</span>
              ) : (
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  {plate}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
