import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor, type Service } from '@/lib/content';
import { Band, Button, Eyebrow } from '@/components/ui';
import { ReadingSurface } from '@/components/Surface';

/**
 * One template, four services (DD-16).
 *
 * The `notFor` block is not a design flourish. Naming who a service is wrong
 * for is the cheapest trust signal available to a studio with no published
 * testimonials yet (DD-5), and it filters enquiries that waste both sides'
 * time. It is given real weight on the page for that reason.
 */
export default function ServicePage({ locale, id }: { locale: Locale; id: Service['id'] }) {
  const c = contentFor(locale);
  const service = c.services.find((s) => s.id === id);
  if (!service) return null;

  return (
    <>
      <Band className="border-b border-rule">
        <div className="flex flex-col gap-6">
          <Eyebrow>Services</Eyebrow>
          <h1 className="max-w-[18ch] text-4xl md:text-5xl">{service.name}</h1>
          <p className="max-w-[var(--measure)] text-lg text-ink-soft">{service.summary}</p>
        </div>
      </Band>

      <ReadingSurface>
        <p className="text-lg">{service.lede}</p>

        <h2 className="mt-12 text-2xl">What you get</h2>
        <ul className="mt-5 flex flex-col gap-3">
          {service.includes.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0 bg-ember" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </ReadingSurface>

      <Band tone="surface" className="border-y border-rule">
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-3">
          <Eyebrow>When not to hire me</Eyebrow>
          <p className="text-lg text-ink">{service.notFor}</p>
        </div>
      </Band>

      <Band>
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-5">
          <h2 className="text-3xl">Sound like your project?</h2>
          <p className="text-ink-soft">
            Send the details and you get a scoped quote back. Pricing depends on what the build
            actually needs — see how that is worked out.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={href(locale, 'contact')}>{c.chrome.ctaQuote}</Button>
            <Button href={href(locale, 'pricing')} variant="secondary">
              How pricing works
            </Button>
          </div>
        </div>
      </Band>
    </>
  );
}
