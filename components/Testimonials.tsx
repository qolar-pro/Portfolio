import Image from 'next/image';
import { Reveal } from '@/components/motion/Reveal';
import type { SiteContent, Testimonial } from '@/lib/content';
import { MARKS } from '@/lib/marks';

/**
 * Client quotes.
 *
 * Anything still marked `approved: false` renders with a loud DRAFT badge.
 * That is deliberate: these were drafted here, not spoken by the client, and
 * an unmarked invented quote attributed to a real firm is a fabricated
 * endorsement. The badge makes it impossible to ship one by accident — and
 * removing the badge without getting the approval is the same lie, quieter.
 *
 * The avatar is the client's own mark, which is the one piece of identity on
 * these cards that is real today. Personal names are still placeholders, so
 * the attribution falls back to the business rather than printing "[name]" at
 * a visitor — see `attribution` below.
 */

/** Placeholder copy is written in brackets throughout lib/content. */
const isPlaceholder = (v: string) => v.trim().startsWith('[');

function attribution(t: Testimonial) {
  const namePending = isPlaceholder(t.name);
  return {
    // the business is real even while the person is not
    primary: namePending ? t.company : t.name,
    // With no real role yet there is nothing true to put on the second line —
    // the internal project key ("dklaw", "nova-shift") is not a job title, and
    // printing it just leaked a slug at the visitor. Once a real role lands it
    // pairs with the company as normal.
    secondary: isPlaceholder(t.role) ? null : `${t.role} · ${t.company}`,
  };
}

export function Testimonials({ c }: { c: SiteContent }) {
  return (
    <div className="quotes">
      {c.testimonials.items.map((t, i) => {
        const mark = MARKS[t.slug];
        const who = attribution(t);

        return (
          <Reveal
            className={`quote-card ${t.approved ? '' : 'is-draft'}`}
            key={t.company}
            delay={i * 0.05}
          >
            <span className="quote-pattern" aria-hidden="true" />
            <span className="quote-glyph" aria-hidden="true">
              &rdquo;
            </span>

            {!t.approved && <span className="draft-badge">{c.testimonials.draftBadge}</span>}

            <blockquote>{t.quote}</blockquote>

            <footer className="quote-by">
              <span className="quote-avatar" style={{ background: mark?.bg }}>
                {mark && <Image src={mark.src} alt="" width={80} height={80} sizes="80px" />}
              </span>
              <span className="quote-who">
                <span className="quote-name">{who.primary}</span>
                {who.secondary && <span className="quote-role">{who.secondary}</span>}
              </span>
            </footer>
          </Reveal>
        );
      })}
    </div>
  );
}
