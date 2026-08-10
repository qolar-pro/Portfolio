import type { Locale } from '@/lib/locales';
import { contentFor } from '@/lib/content';
import { CONTACT_EMAIL, FOUNDER_NAME } from '@/lib/site';
import { Band, Eyebrow, GridRule, PageHeader, Panel, Tag } from '@/components/ui';
import {
  CATALOGUE,
  CMS,
  DESIGN,
  LOCALES_OPT,
  MOTION,
  SCALE,
  estimate,
  formatEur,
  type Config,
  type ProjectType,
} from '@/lib/pricing';

/**
 * `/contact` — the other end of the configurator.
 *
 * The brief arrives in the URL and is read on the server, so it renders with
 * JavaScript disabled and survives being forwarded, bookmarked or pasted. That
 * matters more than it sounds: the most common thing a visitor does with a
 * configured quote is send the link to whoever actually decides.
 *
 * ── INTERIM ──────────────────────────────────────────────────────────────
 * SPEC §4 specifies a booking calendar. That needs a scheduling tool and a
 * transactional email service, neither chosen (OQ-7). The page is built as a
 * booking flow — what the call is, how long, what happens after — with the
 * message-compose path standing in for the embed. Drop the calendar into the
 * panel marked below; nothing else needs to change.
 * ─────────────────────────────────────────────────────────────────────────
 */

const VALID: Record<keyof Config, readonly string[]> = {
  type: ['website', 'store', 'redesign', 'custom'],
  scale: SCALE.map((o) => o.value),
  catalogue: CATALOGUE.map((o) => o.value),
  locales: LOCALES_OPT.map((o) => o.value),
  cms: CMS.map((o) => o.value),
  design: DESIGN.map((o) => o.value),
  motion: MOTION.map((o) => o.value),
};

/**
 * Every field is validated against its allowed values rather than trusted.
 * These arrive from a URL a stranger can edit, and an unvalidated value would
 * reach `estimate()` and produce a nonsense figure that looks authoritative.
 */
function parseConfig(sp: Record<string, string | string[] | undefined>): Config | null {
  if (!sp.type) return null;
  const out: Record<string, string> = {};
  for (const [key, allowed] of Object.entries(VALID)) {
    const raw = sp[key];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (!v || !allowed.includes(v)) return null;
    out[key] = v;
  }
  return out as unknown as Config;
}

export default function ContactPage({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const c = contentFor(locale);
  const config = parseConfig(searchParams);
  const result = config ? estimate(config) : null;

  const mailBody = result
    ? `My project:\n\n${result.summary.map((s) => `- ${s}`).join('\n')}\n\nIndicative range shown: ${formatEur(
        result.low,
      )} - ${formatEur(result.high)}\n\nAbout the business:\n\n\nWhat I already have (text, photos, logo):\n\n\nAny date I am working towards:\n\n`
    : `About the project:\n\n\nWhat my business does:\n\n\nWhat I already have (text, photos, logo):\n\n\nAny date I am working towards:\n\n`;

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    config ? `Project enquiry — ${(config.type as ProjectType) ?? 'website'}` : 'Project enquiry',
  )}&body=${encodeURIComponent(mailBody)}`;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={config ? 'Here is what you described.' : 'Book a meeting.'}
        lede={
          config
            ? 'Send this over and you get a scoped quote back. If anything is wrong, change it before you send — the detail is what makes the quote accurate.'
            : 'A first call costs nothing, runs about thirty minutes, and ends with a written scope you can take anywhere.'
        }
        meta={
          <>
            <Tag tone="forge">Replies within one working day</Tag>
            <Tag tone="forge">Greek · Macedonian · English</Tag>
          </>
        }
      />

      {result ? (
        <Band tone="surface">
          <div className="grid gap-10 md:grid-cols-[1fr_20rem] md:items-start">
            <div data-reveal>
              <Eyebrow>Your brief</Eyebrow>
              <ul className="mt-5 flex flex-col gap-2.5">
                {result.summary.map((s) => (
                  <li key={s} className="flex gap-3">
                    <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0 bg-ember" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Panel className="flex flex-col gap-3">
              <p className="font-mono text-2xs tracking-[0.12em] text-muted uppercase">
                Indicative range
              </p>
              <p className="font-display text-3xl leading-none tabular-nums">
                {formatEur(result.low)} – {formatEur(result.high)}
              </p>
              <p className="text-sm text-ink-soft">
                Still a range, not a quote. The figure firms up once I have seen the detail.
              </p>
              <p className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">
                Roughly {result.weeksLow}–{result.weeksHigh} weeks
              </p>
            </Panel>
          </div>
        </Band>
      ) : null}

      <Band>
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
          <div data-reveal>
            <Eyebrow>What the call is</Eyebrow>
            <h2 className="mt-4 text-3xl">Thirty minutes, no pitch</h2>
            <ol className="mt-6 flex flex-col gap-5">
              {[
                ['You describe the business', 'What it does, who buys from it, what the site has to achieve.'],
                ['I ask the awkward questions', 'Budget range, deadline, who approves, what content exists.'],
                ['You get a written scope', 'Pages, features, timeline. Yours to keep, and to take elsewhere.'],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-1 font-mono text-2xs text-ember tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-xl">{title}</h3>
                    <p className="mt-1 text-ink-soft">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Calendar embed goes here when OQ-7 is decided ── */}
          <div data-reveal data-reveal-delay="120" className="flex flex-col gap-6">
            <Panel className="flex flex-col gap-5">
              <Eyebrow>Start here</Eyebrow>
              <p className="text-ink-soft">
                Send the details and I will reply with times. Include whatever you have — a rough
                idea is enough to start from.
              </p>
              <a
                href={mailto}
                className="inline-flex w-fit items-center justify-center bg-ember px-6 py-3 font-display text-lg tracking-wide text-surface transition-colors hover:bg-ink"
              >
                {config ? 'Send this brief' : c.chrome.ctaBook}
              </a>
              <p className="text-sm text-muted">
                Or write directly to{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-ember underline underline-offset-4"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </Panel>

            <Panel>
              <Eyebrow>Who you will be talking to</Eyebrow>
              <p className="mt-4 text-ink-soft">
                {FOUNDER_NAME}. Not a salesperson, not an account manager — the person who would
                design and build it.
              </p>
            </Panel>
          </div>
        </div>
      </Band>

      <Band tone="forge">
        <Eyebrow tone="forge">Before you write</Eyebrow>
        <h2 className="mt-4 max-w-[20ch] text-3xl text-forge-ink md:text-4xl">
          The four things that make a reply useful
        </h2>
        <GridRule cols="md:grid-cols-2 lg:grid-cols-4" tone="forge" className="mt-10">
          {[
            ['What your business does', 'One sentence is plenty.'],
            ['What is wrong now', 'If there is an existing site, what fails about it.'],
            ['What you already have', 'Text, photographs, logo — or none of it.'],
            ['Any date you are working to', 'And why, if there is a reason.'],
          ].map(([t, b]) => (
            <div key={t} className="flex flex-col gap-2 bg-forge-carbon p-6">
              <h3 className="text-lg text-forge-ink">{t}</h3>
              <p className="text-sm text-forge-muted">{b}</p>
            </div>
          ))}
        </GridRule>
      </Band>
    </>
  );
}
