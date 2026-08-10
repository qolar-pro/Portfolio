import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import { href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import { Band, Button, Eyebrow, GridRule, PageHeader, Tag } from '@/components/ui';

/**
 * `/studio` — founder-forward (DD-4).
 *
 * On the missing photo: the page renders without substituting an avatar,
 * monogram or stock portrait. A placeholder face on an "about the founder"
 * page reads as an agency performing intimacy, which forfeits exactly the
 * trust this decision exists to buy. An absent photo reads as a page still
 * being finished; a fake one reads as dishonest.
 */
export default function StudioPage({ locale }: { locale: Locale }) {
  const c = contentFor(locale);
  const f = c.founder;

  return (
    <>
      <PageHeader
        eyebrow="Studio"
        title="One person. That is the whole model."
        lede={`NovaFaber is ${f.name} — ${f.role.toLowerCase()}, designer, and the person who answers your email.`}
        meta={
          <>
            <Tag tone="forge">Based in Greece</Tag>
            <Tag tone="forge">Greek · Macedonian · English</Tag>
            <Tag tone="forge">Nothing subcontracted</Tag>
          </>
        }
      />

      <Band>
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr] md:gap-16">
          <div data-reveal className="max-w-[var(--measure)]">
            {f.bio.map((para) => (
              <p key={para.slice(0, 40)} className="mb-6 text-lg last:mb-0">
                {para}
              </p>
            ))}
          </div>

          {f.photo ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
              <Image src={f.photo} alt={f.name} fill sizes="360px" className="object-cover" />
            </div>
          ) : null}
        </div>
      </Band>

      <Band tone="surface">
        <Eyebrow>What that means in practice</Eyebrow>
        <GridRule cols="md:grid-cols-3" className="mt-8">
          <div className="flex flex-col gap-3 bg-ground p-7">
            <h2 className="text-2xl">No handover gap</h2>
            <p className="text-ink-soft">
              The person who heard what you wanted is the person who builds it. Nothing is lost in
              translation between the brief and the build, because there is no translation.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-ground p-7">
            <h2 className="text-2xl">Real start dates</h2>
            <p className="text-ink-soft">
              A limited number of projects run at once. When I say a date is full, it is full —
              that is a constraint, not a closing technique.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-ground p-7">
            <h2 className="text-2xl">You own the result</h2>
            <p className="text-ink-soft">
              Domain, hosting, code and logins are yours at handover. If you never speak to me
              again, the site keeps working and you can still change it.
            </p>
          </div>
        </GridRule>
      </Band>

      <Band tone="forge">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div data-reveal>
            <Eyebrow tone="forge">The name</Eyebrow>
            <h2 className="mt-4 text-4xl text-forge-ink md:text-5xl">
              Nova<span className="text-heat-ember">Faber</span>
            </h2>
          </div>
          <div data-reveal data-reveal-delay="100" className="flex flex-col gap-4">
            <p className="text-lg text-forge-ink-soft">
              <span className="text-forge-ink">Faber</span> is Latin for smith — a maker of
              things. <span className="text-forge-ink">Nova</span> is new, and also a star that
              suddenly brightens.
            </p>
            <p className="text-forge-ink-soft">
              A forge is dark for a working reason: a smith reads steel&rsquo;s temperature by its
              colour, and you cannot do that in a bright room. That is why this site looks the way
              it does. The dark is where the work happens; the daylight is where you see what came
              out of it.
            </p>
          </div>
        </div>
      </Band>

      <Band>
        <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-5">
          <h2 className="text-3xl md:text-4xl">Tell me what you need building.</h2>
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
