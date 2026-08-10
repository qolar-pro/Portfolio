import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import { Band, Button, Eyebrow, GridRule, MarkedList, PageHeader, Panel, Tag } from '@/components/ui';
import Configurator from '@/components/Configurator';

/**
 * `/pricing` — how pricing works, never how much (DD-1).
 *
 * Opens by explaining the absence of a price list rather than hoping nobody
 * notices. A visitor who arrives wanting a number and is refused one without a
 * reason reads it as evasion, which is the opposite of what this positioning
 * needs.
 *
 * The risk-reversal block is deliberately high on the page. Every teardown in
 * the research found the same pattern — guarantees and pay-after-approval
 * appearing early, before the visitor has decided — and the handover promise
 * is the strongest one this studio has.
 */
export default function PricingPage({ locale }: { locale: Locale }) {
  const c = contentFor(locale);

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="There is no price list. Here is why."
        lede="Two sites with the same number of pages can be four weeks apart in work. A price list hides that, and someone always pays for it — either you, in a quote that climbs after you have committed, or me, in work I priced before I understood it."
        meta={
          <>
            <Tag tone="forge">Scope agreed before a number</Tag>
            <Tag tone="forge">Staged payments</Tag>
            <Tag tone="forge">Full handover included</Tag>
          </>
        }
      />

      <Band tone="surface">
        <Eyebrow>What you are not risking</Eyebrow>
        <GridRule cols="md:grid-cols-3" className="mt-8">
          <div className="flex flex-col gap-3 bg-ground p-7">
            <h2 className="text-2xl">The scope comes first</h2>
            <p className="text-ink-soft">
              You get a written scope document before any number is agreed — pages, features,
              timeline. It is yours to keep, and you can take it to another studio.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-ground p-7">
            <h2 className="text-2xl">You pay as it appears</h2>
            <p className="text-ink-soft">
              Payment is staged against the four steps, so you are never far ahead of work you can
              actually see.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-ground p-7">
            <h2 className="text-2xl">You own everything</h2>
            <p className="text-ink-soft">
              Domain, hosting, code and logins in your name at handover. Being locked out of your
              own site by whoever built it is common enough here to be worth stating.
            </p>
          </div>
        </GridRule>
      </Band>

      <Band>
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
          <div data-reveal>
            <Eyebrow>What drives the cost</Eyebrow>
            <ul className="mt-6 flex flex-col gap-5">
              {[
                ['How much is bespoke', 'Adapting an existing brand is faster than designing one. Both are legitimate starting points; they are not the same job.'],
                ['How many languages', 'Not a translation fee — a second language changes layout, typography and URL structure, and every page has to work in both.'],
                ['Whether you edit it yourself', 'A site you can update needs an admin layer built and tested. If you would rather send me changes, that is work nobody needs to pay for.'],
                ['How much moves', 'Considered motion is cheap. Real-time 3D is not, and it is only worth it where it does a job.'],
                ['The catalogue, for a store', 'A hundred products and ten thousand are different systems, not the same system with more rows.'],
              ].map(([t, b]) => (
                <li key={t}>
                  <h3 className="text-xl">{t}</h3>
                  <p className="mt-1 text-ink-soft">{b}</p>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal data-reveal-delay="120" className="flex flex-col gap-8">
            <div>
              <Eyebrow>Included as standard</Eyebrow>
              <p className="mt-4 text-ink-soft">
                Frequently sold as extras in this market. They are not extras — a site without
                them is unfinished, and pricing them separately only makes the first number look
                smaller.
              </p>
              <div className="mt-5">
                <MarkedList
                  items={[
                    'On-page SEO, built in from the first commit',
                    'A performance budget the finished site is measured against',
                    'Mobile and tablet, designed rather than reflowed',
                    'Analytics configured and reporting before launch',
                    'Every asset, password and repository handed over',
                  ]}
                />
              </div>
            </div>

            <Panel>
              <Eyebrow>Charged separately</Eyebrow>
              <p className="mt-4 text-ink-soft">
                Domain and hosting are billed at cost — they are third-party services and I do not
                mark them up. Ongoing maintenance is optional and quoted separately; nothing about
                the build depends on buying it.
              </p>
            </Panel>
          </div>
        </div>
      </Band>

      <Band tone="forge" glow wide>
        <div data-reveal className="flex flex-col gap-4">
          <Eyebrow tone="forge">Configure it</Eyebrow>
          <h2 className="max-w-[22ch] text-3xl text-forge-ink md:text-5xl">
            Describe the project, get a range.
          </h2>
          <p className="max-w-[var(--measure)] text-forge-ink-soft">
            Enough to tell you whether we are in the same territory before either of us spends an
            hour on a call.
          </p>
        </div>
        <div className="mt-12">
          <Configurator locale={locale} />
        </div>
      </Band>

      <Band>
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-5">
          <h2 className="text-3xl md:text-4xl">How a real figure gets made</h2>
          <p className="text-ink-soft">{c.process[0].deliverable}</p>
          <p className="text-ink-soft">
            That document is what a quote is priced against — which is why the number arrives
            after it, not before.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button href={href(locale, 'contact')}>{c.chrome.ctaBook}</Button>
            <Button href={href(locale, 'process')} variant="secondary">
              See the process
            </Button>
          </div>
        </div>
      </Band>
    </>
  );
}
