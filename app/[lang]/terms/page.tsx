import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand } from '@/components/CtaBand';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { SiteFooter } from '@/components/SiteFooter';
import { EMAIL, LOCATION, PRICING, ROUTES } from '@/lib/content';
import { resolveLang } from '@/lib/params';
import { pageMetadata } from '@/lib/seo';

/**
 * Terms of service.
 *
 * ── WHAT THIS IS AND IS NOT ──────────────────────────────────────────
 * These restate, as terms, the promises the site already makes out loud:
 * a fixed price agreed before work starts, a written brief either way, and
 * the code, domain and accounts ending up in the client's name. A terms page
 * that contradicts the sales copy is worse than none, so every clause here
 * traces back to something on /process or /contact.
 *
 * It is NOT legal advice and it has not been reviewed by a lawyer. For a
 * one-person studio doing fixed-price web work in Greece that is a normal
 * and proportionate position, but it is stated on the page rather than
 * quietly assumed.
 *
 * ── THE TWO COMMERCIAL TERMS ─────────────────────────────────────────
 * The deposit split (50/50, on signing and on launch) and the revision
 * allowance (two rounds at the design stage) were left as TODOs here for
 * days, because they are the only clauses on the page a client could hold
 * the studio to that are not already stated somewhere else on the site.
 * They were set on the studio's explicit instruction; they are ordinary for
 * fixed-price work at this size, and changing either is an edit to one
 * string below — but it is a commercial decision, not a copy tweak.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang, c } = await resolveLang(params);
  return pageMetadata({
    lang,
    path: ROUTES.terms,
    title: c.routes.terms.title,
    description: c.routes.terms.seoDesc ?? c.routes.terms.lede,
  });
}

/** A figure the studio has published is quoted; one it has not is not invented. */
const priceFloor = PRICING.approved && PRICING.from
  ? `${PRICING.currency}${PRICING.from.toLocaleString('en-US')}`
  : null;

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, c } = await resolveLang(params);

  const sections: { h: string; p: string[] }[] = [
    {
      h: 'Who you are contracting with',
      p: [
        `NovaFaber is a one-person studio operated by Giannis Papadopoulos from ${LOCATION.city}, ${LOCATION.country}. There is no agency behind it and no subcontracted team: the person who answers your email is the person who writes the code.`,
        `These terms apply to design, development and marketing work commissioned through this site or by direct agreement. They are written in plain language on purpose. If anything here is unclear, ask before you pay anything — that is what the first call is for.`,
      ],
    },
    {
      h: 'Price, and when it is fixed',
      p: [
        `Every project is quoted to its actual scope. After the first call you receive a written scope document listing everything that will be built and one fixed price against it${priceFloor ? `, with most projects starting from ${priceFloor}` : ''}. That number does not change unless the scope changes, and the scope only changes with your written approval.`,
        `If you ask for something outside the agreed scope mid-project, you get a price for that addition before it is built — never an invoice for it afterwards.`,
        `Projects run on a 50/50 split: half on signing the scope document, half on launch. Nothing starts before the first payment clears, and the site goes live when the second does. For projects over ${PRICING.currency}10,000 the balance can be staged across agreed milestones instead — ask, and it goes in the scope document.`,
      ],
    },
    {
      h: 'What you own at the end',
      p: [
        `The code, the domain and every third-party account created for the project are registered in your name and handed over at launch. You are not renting your own website, and you do not need this studio to keep it running.`,
        `Anything you supply — text, images, logos, product data — stays yours throughout. Anything built specifically for you becomes yours on final payment.`,
        `The studio keeps the right to show the finished work in its portfolio and to describe how it was built, unless you ask in writing that it stays private. If a project is under embargo before launch, it is not shown until you say so.`,
      ],
    },
    {
      h: 'What you need to provide',
      p: [
        `Content is the usual reason a project slips: text, images, product information and access to whatever already exists. Delivery dates in the scope document assume that material arrives when agreed, and shift by the same amount if it does not.`,
        `You confirm you have the right to use anything you send. The studio cannot check the licensing of images or text you supply, and does not take responsibility for material it did not source.`,
      ],
    },
    {
      h: 'Revisions',
      p: [
        `Design is reviewed and revised before production code is written — that is the point of showing you clickable screens first. Revisions inside the agreed direction are part of the price.`,
        `Two rounds of revisions are included at the design stage, which is where changes are cheap. Starting again on a new direction after a design has been signed off is new work, and is quoted before anything is built — never invoiced afterwards.`,
      ],
    },
    {
      h: 'If either of us wants to stop',
      p: [
        `You can end a project at any point in writing. You pay for the work completed to that date, and you receive everything produced so far — files, code, and any accounts already in your name. Nothing is held hostage.`,
        `The studio may end a project if agreed material does not arrive, if payment is overdue, or if the work turns out to be something it should not have taken on. The same applies in reverse: completed work is handed over and only completed work is charged for.`,
      ],
    },
    {
      h: 'What is not promised',
      p: [
        `No search ranking, traffic level, conversion rate or revenue figure is promised, by this studio or by anyone honest. What is promised is that the work is built to do the job described in the scope document, and that it is measured rather than guessed at.`,
        `Third-party services a project depends on — hosting, payment providers, mail delivery, analytics — are run by other companies under their own terms. The studio configures them properly and is not liable for their outages.`,
        `Liability for any project is limited to the amount paid for that project.`,
      ],
    },
    {
      h: 'After launch',
      p: [
        `Sites are handed over working. Faults in the delivered work are fixed at no cost — that is not support, it is finishing the job.`,
        `Ongoing changes, new features and maintenance after handover are separate work, quoted separately or covered by a care plan if you have one.`,
      ],
    },
    {
      h: 'Law, and changes to these terms',
      p: [
        `These terms are governed by the law of ${LOCATION.country}, and any dispute is dealt with in the courts of ${LOCATION.city}.`,
        `If these terms change, the version that applies to your project is the one in force when you approved its scope document. Changes here do not reach backwards into work already agreed.`,
      ],
    },
  ];

  return (
    <>
      <Nav lang={lang} c={c} />
      <main id="main">
        <PageHero c={c} route="terms" />

        <section className="section">
          <div className="shell">
            <div className="prose-wide">
              {sections.map((sec) => (
                <div key={sec.h}>
                  <h2 className="h2" data-anim="clip">
                    {sec.h}
                  </h2>
                  {sec.p.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ))}

              <h2 className="h2" data-anim="clip">
                Questions
              </h2>
              <p>
                Anything here you want changed for your project, say so before the scope document
                is signed and it can be. Write to{' '}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, or read{' '}
                <Link href={`/${lang}${ROUTES.privacy}`}>what the site collects</Link> if that is
                what you were looking for.
              </p>
              <p>
                <strong>These terms are not legal advice</strong> and have not been reviewed by a
                lawyer. They describe how this studio works. For a contract covering something
                larger or more unusual than a website, get your own advice.
              </p>
            </div>
          </div>
        </section>
      </main>

      <CtaBand c={c} lang={lang} />
      <SiteFooter c={c} lang={lang} />
    </>
  );
}
