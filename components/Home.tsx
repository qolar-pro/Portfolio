import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import Hero from '@/components/Hero';
import { Band, Button, Eyebrow, SectionHeading } from '@/components/ui';

/**
 * The homepage.
 *
 * SPEC §5 lists ten sections; SPEC §3.3 caps a page at roughly seven blocks.
 * Both cannot hold, so the proof strip is composed into the hero band rather
 * than standing alone, and the closing CTA carries the contact section. That
 * lands at seven. Resolving this at build time rather than shipping ten and
 * calling it dense is the entire point of having the budget.
 *
 * The hero is the site's only spectacle surface (DD-14). Everything below it
 * is a reading surface — no canvas, no camera choreography, no grade. That
 * separation is enforced by scripts/check-no-webgl.mjs rather than trusted.
 */
export default function Home({ locale }: { locale: Locale }) {
  const c = contentFor(locale);
  const flagship = c.caseStudies.find((s) => s.flagship);
  const testimonials = c.testimonials.filter((t) => t !== null);

  return (
    <>
      {/* 1 — Hero + proof. The only spectacle surface on the site (DD-14). */}
      <Hero
        headline={c.home.headline}
        subhead={c.home.subhead}
        ctaPrimary={c.home.ctaPrimary}
        ctaSecondary={c.home.ctaSecondary}
        hrefPrimary={href(locale, 'contact')}
        hrefSecondary={href(locale, 'work')}
        proof={c.home.proof}
      />

      {/* 2 — Services, bento with unequal weight */}
      <Band tone="surface">
        <SectionHeading eyebrow="What we build">Four ways in.</SectionHeading>
        <div className="mt-10 grid gap-px bg-rule md:grid-cols-2">
          {c.services.map((s) => (
            <Link
              key={s.id}
              href={href(locale, `services/${s.id}`)}
              /* `websites` spans both columns: it is the highest-volume service
                 (DD-16) and a uniform grid would give it the same weight as the
                 narrowest one. Unequal weight is the point of a bento. */
              className={`group flex flex-col gap-3 bg-ground p-7 transition-colors hover:bg-surface ${
                s.id === 'websites' ? 'md:col-span-2' : ''
              }`}
            >
              <h3 className="text-2xl group-hover:text-ember">{s.name}</h3>
              <p className="text-ink-soft">{s.summary}</p>
            </Link>
          ))}
        </div>
      </Band>

      {/* 3 — Flagship case study */}
      {flagship ? (
        <Band className="border-t border-rule">
          <SectionHeading eyebrow="Selected work">{flagship.name}</SectionHeading>
          <p className="mt-6 max-w-[var(--measure)] text-lg text-ink-soft">{flagship.tagline}</p>
          <p className="mt-4 max-w-[var(--measure)]">{flagship.summary}</p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {flagship.facts.map((f) => (
              <li key={f} className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={href(locale, `work/${flagship.id}`)} variant="secondary">
              Read the case study
            </Button>
          </div>
        </Band>
      ) : null}

      {/* 4 — Process */}
      <Band tone="surface">
        <SectionHeading eyebrow="How it runs">From first call to live.</SectionHeading>
        <ol className="mt-10 grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {c.process.map((step) => (
            <li key={step.id} className="flex flex-col gap-3 bg-ground p-6">
              <div className="flex items-baseline gap-3">
                <h3 className="text-2xl">{step.name}</h3>
                <span className="font-mono text-2xs text-muted">{step.greekName}</span>
              </div>
              <p className="text-sm text-ink-soft">{step.deliverable}</p>
            </li>
          ))}
        </ol>
      </Band>

      {/* 5 — Testimonials.
          DD-5: designed for three, each substantial. Renders nothing at all
          while the quotes are unsupplied — a placeholder testimonial costs
          more trust than an absent one, and an empty section styled to look
          intentional is just a slower way of lying. */}
      {testimonials.length > 0 ? (
        <Band className="border-t border-rule">
          <SectionHeading eyebrow="Clients">In their words.</SectionHeading>
          <div className="mt-10 flex flex-col gap-10">
            {testimonials.map((t) => (
              <figure key={t!.name} className="flex max-w-[var(--measure)] flex-col gap-4">
                <blockquote className="text-xl text-ink">&ldquo;{t!.quote}&rdquo;</blockquote>
                <figcaption className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">
                  {t!.name} — {t!.role}, {t!.company}
                </figcaption>
              </figure>
            ))}
          </div>
        </Band>
      ) : null}

      {/* 6 — Capabilities */}
      <Band tone="surface">
        <SectionHeading eyebrow="Under the hood">What it is made of.</SectionHeading>
        <div className="mt-10 grid gap-px bg-rule md:grid-cols-3">
          {c.capabilities.map((cap) => (
            <div key={cap.title} className="flex flex-col gap-3 bg-ground p-6">
              <h3 className="text-xl">{cap.title}</h3>
              <p className="text-sm text-ink-soft">{cap.outcome}</p>
              <p className="mt-2 font-mono text-2xs tracking-[0.06em] text-muted">
                {cap.tools.join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </Band>

      {/* 7 — Closing CTA, carrying the contact section */}
      <Band className="border-t border-rule">
        <div className="flex flex-col gap-6">
          <Eyebrow>{c.chrome.ctaQuote}</Eyebrow>
          <h2 className="max-w-[16ch] text-4xl md:text-5xl">
            Tell me what you need building.
          </h2>
          <p className="max-w-[var(--measure)] text-ink-soft">
            Describe the project and you get a scoped quote back — not a price list, and not a
            discovery call that turns into a pitch.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={href(locale, 'contact')}>{c.chrome.ctaBook}</Button>
            <Button href={href(locale, 'pricing')} variant="secondary">
              How pricing works
            </Button>
          </div>
        </div>
      </Band>
    </>
  );
}
