import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';

/** The "have a project waiting?" band. Sits above the footer on every route. */
export function CtaBand({ c, lang }: { c: SiteContent; lang: Lang }) {
  return (
    <section className="cta-band">
      <div className="cta-pattern" aria-hidden="true" />
      <div className="shell">
        <Reveal className="cta-inner">
          <div>
            <p className="eyebrow">{c.ctaBand.eyebrow}</p>
            <h2 className="cta-h">{c.ctaBand.heading}</h2>
            <p className="cta-desc">{c.ctaBand.desc}</p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-solid" href={`/${lang}${ROUTES.book}`}>
              {c.ctaBand.primary}
              <span className="circ" aria-hidden="true">
                →
              </span>
            </Link>
            <Link className="btn btn-ghost" href={`/${lang}${ROUTES.contact}`}>
              {c.ctaBand.secondary}
              <span className="circ" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
