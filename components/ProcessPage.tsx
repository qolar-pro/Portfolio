import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import { Band, Button, Eyebrow, GridRule, PageHeader, Panel, Tag } from '@/components/ui';

/**
 * `/process` (SPEC §6).
 *
 * Four steps is what a client holds in their head; the nine industry stages
 * underneath are what make the four credible to a Greek or Macedonian buyer
 * who already knows there are nine. Four alone reads as glib, nine alone reads
 * as work. Four *containing* nine is the point.
 */
export default function ProcessPage({ locale }: { locale: Locale }) {
  const c = contentFor(locale);

  return (
    <>
      <PageHeader
        eyebrow="Process"
        title="Four steps. Something real at the end of each."
        lede="Not status updates — deliverables you can hold, judge and reject. If a step produces nothing you can look at, you have no way of knowing whether it happened."
        meta={
          <>
            <Tag tone="forge">You approve before we proceed</Tag>
            <Tag tone="forge">Nine stages, four conversations</Tag>
          </>
        }
      />

      <Band wide>
        <ol className="flex flex-col gap-px bg-rule">
          {c.process.map((step, i) => (
            <li
              key={step.id}
              data-reveal
              data-reveal-delay={String(i * 80)}
              className="grid gap-8 bg-ground p-7 md:grid-cols-[16rem_1fr_1fr] md:gap-12 md:p-10"
            >
              <div className="flex flex-col gap-1">
                <span className="font-mono text-2xs tracking-[0.16em] text-muted tabular-nums">
                  Step {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-4xl">{step.name}</h2>
                <span className="font-display text-xl text-ember">{step.greekName}</span>
              </div>

              <div>
                <Eyebrow>What happens</Eyebrow>
                <ul className="mt-4 flex flex-col gap-2">
                  {step.covers.map((stage) => (
                    <li key={stage} className="flex gap-3 text-sm text-ink-soft">
                      <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-ember" />
                      <span>{stage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Eyebrow>What you get</Eyebrow>
                <p className="mt-4 text-ink-soft">{step.deliverable}</p>
              </div>
            </li>
          ))}
        </ol>
      </Band>

      <Band tone="surface">
        <Eyebrow>What I need from you</Eyebrow>
        <GridRule cols="md:grid-cols-2" className="mt-8">
          <div className="flex flex-col gap-3 bg-ground p-7">
            <h2 className="text-2xl">Material</h2>
            <p className="text-ink-soft">
              Text for each page, photographs you want used, and your logo in a vector format if
              one exists. If the text does not exist yet, say so early — writing it is the step
              that delays projects most often, and it is far easier to plan around than to
              discover halfway through.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-ground p-7">
            <h2 className="text-2xl">One decider</h2>
            <p className="text-ink-soft">
              One person on your side who can approve things. Not a committee. Approval by
              committee is the second most common reason a build runs long, and unlike missing
              copy it is not something I can fix from my end.
            </p>
          </div>
        </GridRule>
      </Band>

      <Band>
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
          <div data-reveal>
            <Eyebrow>The part most people worry about</Eyebrow>
            <h2 className="mt-4 text-3xl md:text-4xl">What happens at the end</h2>
          </div>
          <Panel>
            <p>
              Everything is transferred to you: the domain in your name, hosting in your account,
              the code, and every login. Documentation for anything you will maintain yourself.
            </p>
            <p className="mt-4 text-ink-soft">
              If you never speak to me again, the site keeps working and you can still change it.
              Being locked out of your own website by whoever built it is common enough in this
              market that it is worth stating plainly.
            </p>
          </Panel>
        </div>
      </Band>

      <Band tone="forge" glow>
        <div data-reveal className="mx-auto flex max-w-[var(--measure)] flex-col gap-5">
          <h2 className="text-3xl text-forge-ink md:text-4xl">Start at step one.</h2>
          <p className="text-forge-ink-soft">
            The first conversation costs nothing and produces the scope document. You can take
            that document elsewhere if you want to.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button href={href(locale, 'contact')} tone="forge">
              {c.chrome.ctaBook}
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
