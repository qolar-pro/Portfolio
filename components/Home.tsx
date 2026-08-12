import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import Hero from '@/components/Hero';
import { Eyebrow, Highlighted } from '@/components/ui';

/**
 * The homepage.
 *
 * Seven blocks, holding the density budget. Every section heading carries one
 * bracketed phrase in the heat gradient and nothing else — which is how the
 * "one white-hot moment per section" rule stays enforceable rather than
 * aspirational.
 *
 * There is no WebGL anywhere on this page any more. The ambient life comes
 * from `LiquidField` inside the hero, which is CSS.
 */
export default function Home({ locale }: { locale: Locale }) {
  const c = contentFor(locale);
  const flagship = c.caseStudies.find((s) => s.flagship);
  const testimonials = c.testimonials.filter((t) => t !== null);

  return (
    <>
      <Hero
        headline={c.home.headline}
        subhead={c.home.subhead}
        ctaPrimary={c.home.ctaPrimary}
        ctaSecondary={c.home.ctaSecondary}
        hrefPrimary={href(locale, 'contact')}
        hrefSecondary={href(locale, 'work')}
        proof={c.home.proof}
      />

      {/* 2 — Services. Bento with unequal weight; `websites` takes the wide
             cell because it is the highest-volume service (DD-16). */}
      <Section>
        <SectionHead eyebrow="What we build" title="Four ways [in.]" />

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-forge-rule bg-forge-rule md:grid-cols-2">
          {c.services.map((s, i) => (
            <Link
              key={s.id}
              href={href(locale, `services/${s.id}`)}
              data-reveal
              data-reveal-delay={String(i * 70)}
              className={`card-lift corner-mark group flex flex-col gap-3 bg-surface-1 p-8 ${
                s.id === 'websites' ? 'md:col-span-2' : ''
              }`}
            >
              <span className="font-mono text-2xs tracking-[0.14em] text-text-muted tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-3xl text-text-primary transition-colors group-hover:text-ember">
                {s.name}
              </h3>
              <p className="max-w-[46ch] text-text-secondary">{s.summary}</p>
              <span className="mt-2 inline-flex items-center gap-2 font-mono text-2xs tracking-[0.12em] text-ember uppercase">
                See what you get
                <span aria-hidden className="arrow-slide">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* Split by intent. The two arrive with completely different
            questions, so they get different doors. */}
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-forge-rule bg-forge-rule sm:grid-cols-2">
          <SplitCta
            href={href(locale, 'services/websites')}
            title="I need a website"
            hint="Starting from nothing"
          />
          <SplitCta
            href={href(locale, 'services/redesign')}
            title="Mine needs fixing"
            hint="Slow, dated, or you cannot edit it"
          />
        </div>
      </Section>

      {/* 3 — Flagship */}
      {flagship ? (
        <Section tone="sunk">
          <div data-reveal className="grid gap-10 md:grid-cols-[1fr_1.15fr] md:items-end">
            <div>
              <Eyebrow>Selected work</Eyebrow>
              <h2 className="mt-5 font-display text-4xl leading-[0.95] text-text-primary md:text-6xl">
                <Highlighted text="A25 — [in production.]" />
              </h2>
            </div>
            <p className="text-lead text-text-secondary">{flagship.summary}</p>
          </div>

          <div
            data-reveal
            data-reveal-delay="120"
            className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-forge-rule bg-forge-rule sm:grid-cols-2 lg:grid-cols-3"
          >
            {flagship.facts.map((f) => (
              <p
                key={f}
                className="bg-surface-1 px-6 py-5 font-mono text-2xs tracking-[0.1em] text-text-secondary uppercase"
              >
                {f}
              </p>
            ))}
          </div>

          <div data-reveal data-reveal-delay="200" className="mt-10">
            <Link
              href={href(locale, `work/${flagship.id}`)}
              className="group inline-flex items-center gap-2.5 rounded-full border border-rule-strong px-7 py-3.5 font-display text-lg tracking-wide text-text-primary transition-colors hover:border-ember hover:text-ember"
            >
              Read the case study
              <span aria-hidden className="arrow-slide">
                →
              </span>
            </Link>
          </div>
        </Section>
      ) : null}

      {/* 4 — Process */}
      <Section>
        <SectionHead eyebrow="How it runs" title="Four steps. [Something real] at the end of each." />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-forge-rule bg-forge-rule sm:grid-cols-2 lg:grid-cols-4">
          {c.process.map((step, i) => (
            <li
              key={step.id}
              data-reveal
              data-reveal-delay={String(i * 70)}
              className="card-lift group flex flex-col gap-3 bg-surface-1 p-7"
            >
              <span className="h-px w-full bg-forge-rule transition-colors duration-500 group-hover:bg-ember" />
              <span className="mt-2 font-mono text-2xs tracking-[0.14em] text-text-muted tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-3xl text-text-primary">{step.name}</h3>
              <span className="font-display text-lg text-ember">{step.greekName}</span>
              <p className="mt-1 text-sm text-text-secondary">{step.deliverable}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 5 — Testimonials. Renders nothing until real quotes exist (DD-18). */}
      {testimonials.length > 0 ? (
        <Section tone="sunk">
          <SectionHead eyebrow="Clients" title="In [their words.]" />
          <div className="mt-12 flex flex-col gap-10">
            {testimonials.map((t) => (
              <figure key={t!.name} className="max-w-[var(--measure)]">
                <blockquote className="font-display text-3xl text-text-primary">
                  &ldquo;{t!.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 font-mono text-2xs tracking-[0.1em] text-text-muted uppercase">
                  {t!.name} — {t!.role}, {t!.company}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      {/* 6 — Risk reversal. Early, per the research: guarantees land before the
             visitor has decided, not after. */}
      <Section tone="sunk">
        <SectionHead eyebrow="What you are not risking" title="You will [own all of it.]" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-forge-rule bg-forge-rule md:grid-cols-3">
          {[
            ['The scope comes first', 'A written scope before any number is agreed. Yours to keep, and to take to another studio if you want to.'],
            ['You pay as it appears', 'Payment staged against the four steps, so you are never far ahead of work you can actually see.'],
            ['Domain, hosting, code, logins', 'All in your name at handover. Being locked out of your own site by whoever built it is common enough here to be worth stating.'],
          ].map(([title, body], i) => (
            <div
              key={title}
              data-reveal
              data-reveal-delay={String(i * 70)}
              className="card-lift corner-mark flex flex-col gap-3 bg-surface-1 p-8"
            >
              <h3 className="font-display text-2xl text-text-primary">{title}</h3>
              <p className="text-text-secondary">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-forge-rule pt-8">
          <Eyebrow>Built with</Eyebrow>
          {c.capabilities.map((cap) => (
            <p key={cap.title} className="font-mono text-2xs tracking-[0.08em] text-text-muted">
              {cap.tools.join(' · ')}
            </p>
          ))}
        </div>
      </Section>

      {/* 7 — Closing CTA */}
      <Section>
        <div data-reveal className="flex flex-col items-start gap-6">
          <Eyebrow>{c.chrome.ctaQuote}</Eyebrow>
          <h2 className="display-xl max-w-[14ch] text-text-primary">
            <Highlighted text="Tell me what you need [building.]" />
          </h2>
          <p className="max-w-[var(--measure)] text-lead text-text-secondary">
            Describe the project and you get a scoped quote back — not a price list, and not a
            discovery call that turns into a pitch.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href={href(locale, 'contact')}
              className="group inline-flex items-center gap-2.5 rounded-full bg-ember py-3.5 ps-7 pe-3 font-display text-lg tracking-wide text-base transition-colors hover:bg-ember-hot"
            >
              {c.chrome.ctaBook}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-base/15">
                <span aria-hidden className="arrow-slide leading-none">
                  →
                </span>
              </span>
            </Link>
            <Link
              href={href(locale, 'pricing')}
              className="group inline-flex items-center gap-2.5 rounded-full border border-rule-strong px-7 py-3.5 font-display text-lg tracking-wide text-text-primary transition-colors hover:border-ember hover:text-ember"
            >
              How pricing works
              <span aria-hidden className="arrow-slide">
                →
              </span>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Section({
  children,
  tone = 'base',
}: {
  children: React.ReactNode;
  tone?: 'base' | 'sunk';
}) {
  return (
    <section className={tone === 'sunk' ? 'bg-void' : 'bg-base'}>
      <div className="mx-auto w-full max-w-[1240px] px-5 py-20 md:py-28">{children}</div>
    </section>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div data-reveal className="flex flex-col gap-5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="max-w-[20ch] font-display text-4xl leading-[0.95] text-text-primary md:text-6xl">
        <Highlighted text={title} />
      </h2>
    </div>
  );
}

function SplitCta({ href: to, title, hint }: { href: string; title: string; hint: string }) {
  return (
    <Link
      href={to}
      className="card-lift group flex items-center justify-between gap-4 bg-surface-1 p-7"
    >
      <span>
        <span className="block font-display text-2xl text-text-primary transition-colors group-hover:text-ember">
          {title}
        </span>
        <span className="mt-1 block text-sm text-text-muted">{hint}</span>
      </span>
      <span
        aria-hidden
        className="arrow-slide flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule-strong text-ember transition-colors group-hover:border-ember"
      >
        →
      </span>
    </Link>
  );
}
