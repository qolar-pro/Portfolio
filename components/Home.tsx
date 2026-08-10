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
        <SectionHeading eyebrow="What we build" reveal>Four ways in.</SectionHeading>
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

        {/* Split CTA by audience. WP Buffs forks "business owners" vs
            "agencies" before the first scroll; the equivalent fork here is
            whether a site already exists, because the two arrive with
            completely different questions. */}
        <div className="mt-10 grid gap-px bg-rule sm:grid-cols-2">
          <Link
            href={href(locale, 'services/websites')}
            className="group flex items-center justify-between gap-4 bg-ground p-6 transition-colors hover:bg-surface"
          >
            <span>
              <span className="block font-display text-xl group-hover:text-ember">
                I need a website
              </span>
              <span className="mt-1 block text-sm text-muted">Starting from nothing</span>
            </span>
            <span aria-hidden className="text-ember">→</span>
          </Link>
          <Link
            href={href(locale, 'services/redesign')}
            className="group flex items-center justify-between gap-4 bg-ground p-6 transition-colors hover:bg-surface"
          >
            <span>
              <span className="block font-display text-xl group-hover:text-ember">
                Mine needs fixing
              </span>
              <span className="mt-1 block text-sm text-muted">Slow, dated, or you cannot edit it</span>
            </span>
            <span aria-hidden className="text-ember">→</span>
          </Link>
        </div>
      </Band>

      {/* 3 — Flagship case study. Forge tone: the second dark beat, and the
             one place a single project is allowed to dominate the page. */}
      {flagship ? (
        <Band tone="forge" glow>
          <div data-reveal className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-end">
            <div>
              <p className="font-mono text-2xs tracking-[0.14em] text-heat-ember uppercase">
                Selected work
              </p>
              <h2 className="mt-4 text-4xl text-forge-ink md:text-5xl">{flagship.name}</h2>
              <p className="mt-5 text-lg text-forge-ink-soft">{flagship.tagline}</p>
            </div>
            <p className="text-forge-ink-soft">{flagship.summary}</p>
          </div>

          <ul
            data-reveal
            data-reveal-delay="120"
            className="mt-10 grid gap-px bg-forge-rule sm:grid-cols-2 lg:grid-cols-3"
          >
            {flagship.facts.map((f) => (
              <li
                key={f}
                className="bg-forge-carbon px-5 py-4 font-mono text-2xs tracking-[0.08em] text-forge-muted uppercase"
              >
                {f}
              </li>
            ))}
          </ul>

          <div data-reveal data-reveal-delay="200" className="mt-10">
            <Link
              href={href(locale, `work/${flagship.id}`)}
              className="inline-flex items-center border border-forge-rule px-6 py-3 font-display text-lg tracking-wide text-forge-ink transition-colors hover:border-heat-ember hover:text-heat-ember"
            >
              Read the case study
            </Link>
          </div>
        </Band>
      ) : null}

      {/* 4 — Process */}
      <Band tone="surface">
        <SectionHeading eyebrow="How it runs" reveal>From first call to live.</SectionHeading>
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

      {/* 6 — Risk reversal, with capabilities folded in as a strip.
             Every teardown in the research put a guarantee or a
             pay-after-approval promise early, before the visitor had decided.
             The handover promise is the strongest one this studio has and it
             was previously only in the footer.

             This replaces a standalone capabilities section rather than adding
             to it: the density budget is seven (SPEC §3.3), and a tech-stack
             list is the weakest section commercially — clients do not buy
             Redis. */}
      <Band tone="surface">
        <SectionHeading eyebrow="What you are not risking" reveal>
          You will own all of it.
        </SectionHeading>
        <div className="mt-10 grid gap-px bg-rule md:grid-cols-3">
          {[
            [
              'The scope comes first',
              'A written scope before any number is agreed. Yours to keep, and to take to another studio if you want to.',
            ],
            [
              'You pay as it appears',
              'Payment staged against the four steps, so you are never far ahead of work you can actually see.',
            ],
            [
              'Domain, hosting, code, logins',
              'All in your name at handover. If you never speak to me again, the site keeps working and you can still change it.',
            ],
          ].map(([title, body], i) => (
            <div
              key={title}
              data-reveal
              data-reveal-delay={String(i * 90)}
              className="flex flex-col gap-3 bg-ground p-7"
            >
              <h3 className="text-xl">{title}</h3>
              <p className="text-ink-soft">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-rule pt-8">
          <Eyebrow>Built with</Eyebrow>
          {c.capabilities.map((cap) => (
            <p key={cap.title} className="font-mono text-2xs tracking-[0.06em] text-muted">
              {cap.tools.join(' · ')}
            </p>
          ))}
        </div>
      </Band>

      {/* 7 — Closing CTA. Final forge beat, so the page ends where it began. */}
      <Band tone="forge" glow>
        <div data-reveal className="flex flex-col gap-6">
          <p className="font-mono text-2xs tracking-[0.14em] text-heat-ember uppercase">
            {c.chrome.ctaQuote}
          </p>
          <h2 className="max-w-[14ch] text-4xl text-forge-ink md:text-6xl">
            Tell me what you need building.
          </h2>
          <p className="max-w-[var(--measure)] text-forge-ink-soft">
            Describe the project and you get a scoped quote back — not a price list, and not a
            discovery call that turns into a pitch.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href={href(locale, 'contact')}
              className="inline-flex items-center bg-heat-ember px-6 py-3 font-display text-lg tracking-wide text-forge-void transition-colors hover:bg-heat-bright"
            >
              {c.chrome.ctaBook}
            </Link>
            <Link
              href={href(locale, 'pricing')}
              className="inline-flex items-center border border-forge-rule px-6 py-3 font-display text-lg tracking-wide text-forge-ink transition-colors hover:border-heat-ember hover:text-heat-ember"
            >
              How pricing works
            </Link>
          </div>
        </div>
      </Band>
    </>
  );
}
