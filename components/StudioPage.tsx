import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import { Band, Button, Eyebrow } from '@/components/ui';
import { ReadingSurface } from '@/components/Surface';

/**
 * `/studio` — founder-forward (DD-4).
 *
 * On the missing photo: the page renders without pretending otherwise. It does
 * not substitute an avatar, a monogram or a stock portrait, because a
 * placeholder face on an "about the founder" page is worse than none — it
 * reads as an agency performing intimacy, which forfeits exactly the trust
 * this decision exists to buy. An absent photo reads as a page still being
 * finished. A fake one reads as dishonest.
 */
export default function StudioPage({ locale }: { locale: Locale }) {
  const c = contentFor(locale);
  const f = c.founder;

  return (
    <>
      <Band className="border-b border-rule">
        <div className="grid gap-10 md:grid-cols-[1fr_18rem] md:items-start">
          <div className="flex flex-col gap-6">
            <Eyebrow>Studio</Eyebrow>
            <h1 className="max-w-[18ch] text-4xl md:text-5xl">
              One person. That is the whole model.
            </h1>
            <p className="max-w-[var(--measure)] text-lg text-ink-soft">
              NovaFaber is {f.name} — {f.role.toLowerCase()}, designer, and the person who answers
              your email.
            </p>
          </div>

          {f.photo ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
              <Image
                src={f.photo}
                alt={f.name}
                fill
                sizes="288px"
                className="object-cover"
                priority
              />
            </div>
          ) : null}
        </div>
      </Band>

      <ReadingSurface>
        {f.bio.map((para) => (
          <p key={para.slice(0, 40)} className="mb-5 last:mb-0">
            {para}
          </p>
        ))}
      </ReadingSurface>

      <Band tone="surface" className="border-y border-rule">
        <Eyebrow>What that means in practice</Eyebrow>
        <div className="mt-8 grid gap-px bg-rule md:grid-cols-3">
          <div className="flex flex-col gap-2 bg-ground p-6">
            <h2 className="text-xl">No handover gap</h2>
            <p className="text-sm text-ink-soft">
              The person who heard what you wanted is the person who builds it. Nothing is lost
              in translation, because there is no translation.
            </p>
          </div>
          <div className="flex flex-col gap-2 bg-ground p-6">
            <h2 className="text-xl">Real start dates</h2>
            <p className="text-sm text-ink-soft">
              A limited number of projects run at once. When I say a date is full, it is full —
              that is a constraint, not a closing technique.
            </p>
          </div>
          <div className="flex flex-col gap-2 bg-ground p-6">
            <h2 className="text-xl">You own the result</h2>
            <p className="text-sm text-ink-soft">
              Domain, hosting, code and logins are yours at handover. If you never speak to me
              again, the site keeps working and you can still change it.
            </p>
          </div>
        </div>
      </Band>

      <Band>
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-5">
          <h2 className="text-3xl">Tell me what you need building.</h2>
          <div className="flex flex-wrap gap-3">
            <Button href={href(locale, 'contact')}>{c.chrome.ctaBook}</Button>
            <Button href={href(locale, 'work')} variant="secondary">
              See the work
            </Button>
          </div>
        </div>
      </Band>
    </>
  );
}
