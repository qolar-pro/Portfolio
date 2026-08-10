import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor, type Service } from '@/lib/content';
import { Band, Button, Eyebrow, GridRule, MarkedList, PageHeader, Tag } from '@/components/ui';

/**
 * One template, four services (DD-16).
 *
 * Structure: forge opener → what you get → who it is wrong for → the other
 * three services → close. The `notFor` block gets a forge band of its own
 * rather than a footnote, because naming who a service is wrong for is the
 * cheapest trust signal available while there are no published testimonials
 * (DD-5), and burying it would waste it.
 */
export default function ServicePage({ locale, id }: { locale: Locale; id: Service['id'] }) {
  const c = contentFor(locale);
  const service = c.services.find((s) => s.id === id);
  if (!service) return null;
  const others = c.services.filter((s) => s.id !== id);

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={service.name}
        lede={service.summary}
        meta={
          <>
            <Tag tone="forge">Greek · Macedonian · English</Tag>
            <Tag tone="forge">Fixed scope before a quote</Tag>
            <Tag tone="forge">Full handover</Tag>
          </>
        }
      />

      <Band>
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
          <div data-reveal>
            <Eyebrow>The problem</Eyebrow>
            <p className="mt-5 text-lg">{service.lede}</p>
          </div>
          <div data-reveal data-reveal-delay="100">
            <Eyebrow>What you get</Eyebrow>
            <div className="mt-5">
              <MarkedList items={service.includes} />
            </div>
          </div>
        </div>
      </Band>

      <Band tone="forge">
        <div data-reveal className="mx-auto max-w-[var(--measure)]">
          <Eyebrow tone="forge">When not to hire me</Eyebrow>
          <p className="mt-5 text-2xl text-forge-ink">{service.notFor}</p>
          <p className="mt-6 text-sm text-forge-muted">
            Saying this costs enquiries. It is here because a studio that tells you when to go
            elsewhere is worth more than one that says yes to everything.
          </p>
        </div>
      </Band>

      <Band tone="surface">
        <Eyebrow>Other services</Eyebrow>
        <GridRule cols="md:grid-cols-3" className="mt-8">
          {others.map((s) => (
            <a
              key={s.id}
              href={href(locale, `services/${s.id}`)}
              className="group flex flex-col gap-2 bg-ground p-6 transition-colors hover:bg-surface"
            >
              <h2 className="text-xl group-hover:text-ember">{s.name}</h2>
              <p className="text-sm text-ink-soft">{s.summary}</p>
            </a>
          ))}
        </GridRule>
      </Band>

      <Band tone="forge" glow>
        <div data-reveal className="mx-auto flex max-w-[var(--measure)] flex-col gap-5">
          <h2 className="text-3xl text-forge-ink md:text-4xl">Sound like your project?</h2>
          <p className="text-forge-ink-soft">
            Send the details and you get a scoped quote back. Pricing depends on what the build
            actually needs — see how that is worked out.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button href={href(locale, 'contact')} tone="forge">
              {c.chrome.ctaQuote}
            </Button>
            <Button href={href(locale, 'pricing')} tone="forge" variant="secondary">
              How pricing works
            </Button>
          </div>
        </div>
      </Band>
    </>
  );
}
