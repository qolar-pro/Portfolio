import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import { Band, Button, Eyebrow } from '@/components/ui';

/**
 * `/process` (SPEC §6).
 *
 * Four steps is what a client can hold in their head; the nine industry
 * stages underneath are what makes the four credible in a market that already
 * has a settled vocabulary for how a site gets built. Showing only four reads
 * as glib to a Greek buyer who knows there are nine. Showing only nine reads
 * as work. Showing four *containing* nine is the point.
 */
export default function ProcessPage({ locale }: { locale: Locale }) {
  const c = contentFor(locale);

  return (
    <>
      <Band className="border-b border-rule">
        <div className="flex flex-col gap-6">
          <Eyebrow>Process</Eyebrow>
          <h1 className="max-w-[18ch] text-4xl md:text-5xl">
            Four steps. You get something at the end of each one.
          </h1>
          <p className="max-w-[var(--measure)] text-lg text-ink-soft">
            Not status updates — actual deliverables you can hold, judge and reject. If a step
            produces nothing you can look at, you have no way of knowing whether it happened.
          </p>
        </div>
      </Band>

      <Band>
        <ol className="flex flex-col gap-px bg-rule">
          {c.process.map((step, i) => (
            <li key={step.id} className="grid gap-6 bg-ground p-7 md:grid-cols-[14rem_1fr]">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-2xs tracking-[0.14em] text-muted tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-3xl">{step.name}</h2>
                <span className="font-mono text-sm text-ember">{step.greekName}</span>
              </div>
              <div className="flex flex-col gap-4">
                <p className="max-w-[var(--measure)]">{step.deliverable}</p>
                <div>
                  <p className="font-mono text-2xs tracking-[0.12em] text-muted uppercase">
                    Covers
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {step.covers.map((stage) => (
                      <li key={stage} className="text-sm text-ink-soft">
                        {stage}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Band>

      <Band tone="surface" className="border-y border-rule">
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-4">
          <h2 className="text-2xl">What I need from you</h2>
          <p className="text-ink-soft">
            Text for each page, any photographs you want used, and your logo in a vector format
            if one exists. If the text does not exist yet, say so early — writing it is the step
            that delays projects most often, and it is easier to plan around than to discover.
          </p>
          <p className="text-ink-soft">
            One person on your side who can approve things. Not a committee. Approval by
            committee is the second most common reason a build runs long.
          </p>
        </div>
      </Band>

      <Band>
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-5">
          <h2 className="text-3xl">Start at step one.</h2>
          <p className="text-ink-soft">
            The first conversation costs nothing and produces the scope document. You can take
            that document elsewhere if you want to.
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
