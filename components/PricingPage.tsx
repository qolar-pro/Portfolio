import type { Locale } from '@/lib/locales';
import { contentFor } from '@/lib/content';
import { Band, Eyebrow } from '@/components/ui';
import { ReadingSurface } from '@/components/Surface';
import Configurator from '@/components/Configurator';

/**
 * `/pricing` — how pricing works, never how much (DD-1).
 *
 * The page opens by explaining the absence of a price list rather than hoping
 * nobody notices it. A visitor arriving here wants a number; refusing to give
 * one without saying why reads as evasion, which is the opposite of the trust
 * this positioning depends on.
 */
export default function PricingPage({ locale }: { locale: Locale }) {
  const c = contentFor(locale);

  return (
    <>
      <Band className="border-b border-rule">
        <div className="flex flex-col gap-6">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="max-w-[16ch] text-4xl md:text-5xl">
            There is no price list. Here is why.
          </h1>
          <p className="max-w-[var(--measure)] text-lg text-ink-soft">
            Two sites with the same number of pages can be four weeks apart in work. A price list
            hides that difference, and someone always pays for it — either you, in a quote that
            climbs after you have committed, or me, in work I priced before I understood it.
          </p>
        </div>
      </Band>

      <ReadingSurface>
        <h2 className="text-2xl">What actually drives the cost</h2>
        <ul className="mt-5 flex flex-col gap-4">
          <li>
            <strong>How much of it is bespoke.</strong> Adapting an existing brand is faster than
            designing one. Both are legitimate starting points; they are not the same job.
          </li>
          <li>
            <strong>How many languages.</strong> Not a translation fee — a second language changes
            layout, typography and URL structure, and every page has to work in both.
          </li>
          <li>
            <strong>Whether you edit it yourself.</strong> A site you can update needs an admin
            layer built and tested. If you would rather send me changes, that layer is work nobody
            needs to pay for.
          </li>
          <li>
            <strong>How much moves.</strong> Considered motion is cheap. Real-time 3D is not, and
            it is only worth it where it does a job.
          </li>
          <li>
            <strong>The catalogue, for a store.</strong> A hundred products and ten thousand are
            different systems, not the same system with more rows.
          </li>
        </ul>

        <h2 className="mt-12 text-2xl">Included as standard</h2>
        <p className="mt-4">
          These are frequently sold as extras in this market. They are not extras — a site
          without them is unfinished, and pricing them separately only makes the first number
          look smaller.
        </p>
        <ul className="mt-5 flex flex-col gap-2">
          {[
            'On-page SEO, built in from the first commit',
            'A performance budget the finished site is measured against',
            'Mobile and tablet, designed rather than reflowed',
            'Analytics configured and reporting before launch',
            'Every asset, password and repository handed over',
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0 bg-ember" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl">Charged separately</h2>
        <p className="mt-4">
          Domain registration and hosting are billed at cost — they are third-party services and I
          do not mark them up. Ongoing maintenance is optional and quoted separately; nothing about
          the build depends on buying it.
        </p>
      </ReadingSurface>

      <Band tone="surface" className="border-t border-rule">
        <div className="flex flex-col gap-4">
          <Eyebrow>Configure it</Eyebrow>
          <h2 className="max-w-[22ch] text-3xl md:text-4xl">
            Describe the project, get a range.
          </h2>
          <p className="max-w-[var(--measure)] text-ink-soft">
            Enough to tell you whether we are in the same territory before either of us spends an
            hour on a call.
          </p>
        </div>
        <div className="mt-10">
          <Configurator locale={locale} />
        </div>
      </Band>

      <Band>
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-4">
          <h2 className="text-2xl">How a real figure gets made</h2>
          <p className="text-ink-soft">
            {c.process[0].deliverable} That document is what a quote is priced against — which is
            why the number arrives after it, not before.
          </p>
        </div>
      </Band>
    </>
  );
}
