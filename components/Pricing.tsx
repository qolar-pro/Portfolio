import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { PRICING, ROUTES, showPricing, type Lang, type SiteContent } from '@/lib/content';

/**
 * The published price band.
 *
 * Two of twenty studios in the competitive read put a money figure on the
 * home page, which is exactly why it is worth doing: it is the rarest trust
 * signal in the segment, and this site already promises "a fixed price before
 * anything starts" without ever showing one. A promise with no number behind
 * it is the part a skeptical owner discounts first.
 *
 * ── THE DRAFT GATE ────────────────────────────────────────────────────
 * `PRICING.approved` is false until the studio sets its own figures. While it
 * is false this section renders ONLY on a local build, behind a loud badge —
 * the same rule the testimonial cards use for quotes that were drafted rather
 * than said. A price is a number someone will hold the studio to; inventing
 * one to fill a layout is the one mistake here that costs money rather than
 * credibility. `showPricing()` is what enforces it, not a comment.
 */
export function Pricing({ c, lang }: { c: SiteContent; lang: Lang }) {
  if (!showPricing()) return null;

  const p = c.pricing;
  const draft = !PRICING.approved;
  const money = (n: number) =>
    draft || !n ? '—' : `${PRICING.currency}${n.toLocaleString('en-US')}`;

  /* With no care plan priced, one card is left and a stretch-to-fit grid
     hands it the full width — a €200–€1,000 figure floating in half an empty
     plane. The component knows the count, so it says so rather than leaving
     the grid to guess. */
  const single = !draft && PRICING.care <= 0;

  return (
    <section className="section pricing-sec" id="pricing">
      <div className="shell">
        <Reveal className="sec-head">
          <p className="eyebrow" data-anim="fade">
            {p.label}
          </p>
          <h2 className="h2" data-anim="clip">
            {p.heading}
          </h2>
          <p className="lede">{p.lede}</p>
        </Reveal>

        <div
          className={`price-grid ${draft ? 'is-draft' : ''} ${single ? 'is-single' : ''}`.trim()}
          data-anim-group
        >
          <article className="price-card" data-anim="rise">
            {draft && <span className="draft-badge">{p.draftBadge}</span>}
            <span className="price-pattern" aria-hidden="true" />
            <p className="price-tier">{p.projectTier}</p>
            <p className="price-figure">
              <span className="price-n">{money(PRICING.from)}</span>
              <span className="price-dash" aria-hidden="true">
                –
              </span>
              <span className="price-n">{money(PRICING.to)}</span>
            </p>
            <ul className="price-list">
              {p.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          {/* A care plan the studio has not priced is not a product yet, so the
              tile stays off rather than showing an empty second column. */}
          {(draft || PRICING.care > 0) && (
            <article className="price-card price-care" data-anim="rise" data-anim-delay="1">
              {draft && <span className="draft-badge">{p.draftBadge}</span>}
              <span className="price-pattern" aria-hidden="true" />
              <p className="price-tier">{p.careTier}</p>
              <p className="price-figure">
                <span className="price-n">{money(PRICING.care)}</span>
                <span className="price-per">{p.perMonth}</span>
              </p>
              <ul className="price-list">
                {p.careIncludes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          )}
        </div>

        <div className="price-foot" data-anim="fade">
          <p className="price-note">{p.note}</p>
          <Link className="btn btn-solid" href={`/${lang}${ROUTES.book}`}>
            {p.cta}
            <span className="circ" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
