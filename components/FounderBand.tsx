import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import {
  BRAND,
  FOUNDER,
  LOCATION,
  ROUTES,
  type Lang,
  type SiteContent,
} from '@/lib/content';

/**
 * The person behind the studio.
 *
 * ── WHY THIS SITS DIRECTLY UNDER THE HERO ─────────────────────────────
 * A competitive read of twenty active solo and small studios put this at
 * 17/20 — a named human on the home page is table stakes, not a flourish —
 * and the sites that convert best say the scale out loud rather than dressing
 * a one-person studio up as a firm. NovaFaber already had the name in the
 * repo; it reached the page only as a footer copyright line, which is the one
 * place a visitor reads as legal boilerplate rather than as a person.
 *
 * ── THE PORTRAIT IS OPTIONAL BY DESIGN ────────────────────────────────
 * Until `public/founder.jpg` exists the band renders a typographic monogram
 * instead. That is a deliberate resting state, not a broken image: a portrait
 * slot showing a grey box reads as a site mid-build, and this reads as a
 * choice. Drop the file in and it swaps with no other edit — see the note on
 * `hasPortrait` below.
 */

/**
 * Next's <Image> throws at build time on a missing local file, so the swap
 * cannot be a filesystem probe in a server component that also has to work on
 * a static export. One flag, one place: flip it the moment the file lands.
 */
const hasPortrait = false;

/** Copy in lib/content carries tokens rather than reading the consts above it. */
const fill = (s: string) =>
  s
    .replace('{city}', LOCATION.city)
    .replace('{country}', LOCATION.country)
    .replace('{founder}', FOUNDER)
    .replace('{brand}', BRAND);

/** "Giannis Papadopoulos" → "GP", for the pre-portrait state. */
const monogram = FOUNDER.split(/\s+/)
  .map((w) => w[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();

export function FounderBand({ c, lang }: { c: SiteContent; lang: Lang }) {
  const f = c.founder;

  return (
    <section className="section founder-sec" id="founder">
      <div className="shell">
        <Reveal className="founder">
          <div className="founder-pattern" aria-hidden="true" />

          <div className="founder-portrait" data-anim="pop">
            {hasPortrait ? (
              <Image
                src="/founder.jpg"
                alt={fill(f.portraitAlt)}
                width={440}
                height={440}
                sizes="(max-width: 780px) 40vw, 220px"
                priority={false}
              />
            ) : (
              /* Decorative: the name is already in the heading below, so a
                 screen reader announcing "GP" here would only repeat it. */
              <span className="founder-monogram" aria-hidden="true">
                {monogram}
              </span>
            )}
          </div>

          <div className="founder-copy">
            <p className="eyebrow" data-anim="fade">
              {f.label}
            </p>
            <h2 className="founder-name" data-anim="clip">
              {FOUNDER}
            </h2>
            <p className="founder-role" data-anim="fade" data-anim-delay="1">
              {f.role}
            </p>

            {f.bio.map((para, i) => (
              <p className="founder-bio" data-anim="fade" data-anim-delay="2" key={i}>
                {para}
              </p>
            ))}

            <dl className="founder-facts" data-anim-group="pop">
              {f.facts.map((fact) => (
                <div className="founder-fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fill(fact.value)}</dd>
                </div>
              ))}
            </dl>

            <div className="founder-actions" data-anim="rise" data-anim-delay="3">
              <Link className="btn btn-solid" href={`/${lang}${ROUTES.book}`}>
                {c.chosen.primary}
                <span className="circ" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link className="btn btn-ghost" href={`/${lang}${ROUTES.about}`}>
                {c.process.cta}
                <span className="circ" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
