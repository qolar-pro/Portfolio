import type { Locale } from '@/lib/locales';
import { contentFor } from '@/lib/content';
import { CONTACT_EMAIL } from '@/lib/site';
import { Band, Eyebrow } from '@/components/ui';
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
 * JavaScript disabled and survives being forwarded, bookmarked or pasted into
 * an email. That matters more than it sounds: the most common thing a visitor
 * does with a configured quote is send the link to whoever actually decides.
 *
 * ── INTERIM ──────────────────────────────────────────────────────────────
 * SPEC §4 specifies a booking calendar here, not a mailto. That needs a
 * scheduling tool and a transactional email service, and neither has been
 * chosen. Rather than quietly ship the thing the spec rules out, the
 * composed-message path below is marked as interim and the tool choice is
 * logged as an Open Question. Replace this block, not the page.
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
 * Builds a Config from URL params, or returns null if nothing usable is there.
 *
 * Every field is validated against its allowed values rather than trusted —
 * these arrive from a URL a stranger can edit, and an unvalidated value would
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
      )} - ${formatEur(result.high)}\n\nAbout the business:\n\n`
    : 'About the project:\n\n';

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    config ? `Project enquiry — ${(config.type as ProjectType) ?? 'website'}` : 'Project enquiry',
  )}&body=${encodeURIComponent(mailBody)}`;

  return (
    <>
      <Band className="border-b border-rule">
        <div className="flex flex-col gap-6">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="max-w-[18ch] text-4xl md:text-5xl">
            {config ? 'Here is what you described.' : 'Tell me what you need building.'}
          </h1>
          <p className="max-w-[var(--measure)] text-lg text-ink-soft">
            {config
              ? 'Send this over and I will come back with a scoped quote. If anything is wrong, change it before you send — the detail is what makes the quote accurate.'
              : 'The more specific you are, the more useful my reply is. If you would rather answer questions than write a brief, use the configurator first.'}
          </p>
        </div>
      </Band>

      {result ? (
        <Band tone="surface" className="border-b border-rule">
          <div className="grid gap-8 md:grid-cols-[1fr_18rem] md:items-start">
            <div>
              <Eyebrow>Your brief</Eyebrow>
              <ul className="mt-5 flex flex-col gap-2">
                {result.summary.map((s) => (
                  <li key={s} className="flex gap-3">
                    <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0 bg-ember" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 border border-rule-strong bg-ground p-5">
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
            </div>
          </div>
        </Band>
      ) : null}

      <Band>
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-6">
          <h2 className="text-2xl">What to include</h2>
          <ul className="flex flex-col gap-2.5">
            {[
              'What your business does, in a sentence',
              'What is wrong with the current site, if there is one',
              'Whether you have text and photographs ready, or need them written',
              'Any date you are working towards, and why',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0 bg-ember" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a
            href={mailto}
            className="mt-2 inline-flex w-fit items-center justify-center bg-ember px-6 py-3 font-display text-lg tracking-wide text-surface transition-colors hover:bg-ink"
          >
            {config ? 'Send this brief' : c.chrome.ctaQuote}
          </a>

          <p className="text-sm text-muted">
            Or write to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-ember underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            . Replies within one working day.
          </p>
        </div>
      </Band>
    </>
  );
}
