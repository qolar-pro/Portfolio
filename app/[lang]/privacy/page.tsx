import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { SiteFooter } from '@/components/SiteFooter';
import { EMAIL, LOCATION, ROUTES } from '@/lib/content';
import { resolveLang } from '@/lib/params';
import { pageMetadata } from '@/lib/seo';

/**
 * What the site collects, written out.
 *
 * This page exists because the consent banner has room for three sentences
 * and the honest answer is longer. Every row in the table below corresponds
 * to something the code actually does — if a field is added to
 * `app/api/track` or `app/api/lead`, it belongs here on the same commit.
 *
 * It is deliberately not a template privacy policy. A generic one covers
 * things this site does not do (advertising networks, third-party pixels,
 * profiling) and omits the one thing it does that is worth stating plainly:
 * an address given to the welcome panel is stored in the browser and
 * attached to later visit reports.
 */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang, c } = await resolveLang(params);
  return pageMetadata({
    lang,
    path: ROUTES.privacy,
    title: c.routes.privacy.title,
    description: c.routes.privacy.lede,
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, c } = await resolveLang(params);

  const collected: { what: string; when: string; why: string }[] = [
    {
      what: 'IP address',
      when: 'Every visit, if you accept',
      why: 'Identifies where a visit came from and separates real people from crawlers.',
    },
    {
      what: 'Approximate location (city, region, country)',
      when: 'Every visit, if you accept',
      why: 'Derived from the IP address by our host. Tells us which markets the site reaches.',
    },
    {
      what: 'Browser, operating system, screen size, language, timezone',
      when: 'Every visit, if you accept',
      why: 'Reported by your browser. Tells us what to build and test against.',
    },
    {
      what: 'The page you landed on, and the site you came from',
      when: 'Every visit, if you accept',
      why: 'Shows which pages and which channels bring people here.',
    },
    {
      what: 'Your email address',
      when: 'Only when you type it into a form',
      why: 'To reply to you, and — if you tick the box — to send updates, news and offers. There is no way for a website to read your email address from your browser; we only ever have it because you gave it to us.',
    },
    {
      what: 'Anything you write in a form',
      when: 'Only when you send it',
      why: 'To answer you.',
    },
  ];

  /* The three standard categories. Necessary is the only one that runs
     without a decision; the other two are what the banner is asking about,
     and they are listed separately because "accept all" means nothing to
     someone who cannot see what the all is. */
  const categories: {
    key: string;
    name: string;
    consent: string;
    what: string;
    rows: { name: string; purpose: string; life: string }[];
  }[] = [
    {
      key: 'necessary',
      name: 'Necessary',
      consent: 'Always on',
      what: 'Makes the site work and remembers the choices you have already made. These cannot be switched off, and they are not used to learn anything about you.',
      rows: [
        { name: 'nf-theme', purpose: 'Remembers dark or light mode.', life: 'Until you clear it' },
        { name: 'nf-consent', purpose: 'Remembers your cookie choice, so you are not asked again.', life: 'Until you clear it' },
        { name: 'nf-welcome-dismissed', purpose: 'Stops the welcome panel reappearing.', life: 'Until you clear it' },
      ],
    },
    {
      key: 'analytics',
      name: 'Analytics',
      consent: 'Only if you accept',
      what: 'Tells us how many people visit, which pages they land on and where they came from, so we know what to build and what to fix.',
      rows: [
        { name: 'nf_seen', purpose: 'Marks this session as already counted, so one visit is not counted many times.', life: 'Until you close the browser' },
      ],
    },
    {
      key: 'marketing',
      name: 'Marketing',
      consent: 'Only if you accept',
      what: 'Lets us recognise a returning visitor and send the updates, news and offers you asked for. Nothing here is shared with an advertising network, and there are no third-party tracking pixels on this site.',
      rows: [
        { name: 'nf-email', purpose: 'The address you gave the welcome panel, so return visits are recognised.', life: 'Until you clear it' },
      ],
    },
  ];

  return (
    <>
      <Nav lang={lang} c={c} />
      <main id="main">
        <PageHero c={c} route="privacy" />

        <section className="section">
          <div className="shell prose-wide">
            <h2 className="h2" data-anim="clip">What we collect</h2>
            <p className="lede" data-anim="fade">
              Nothing in the first four rows is recorded unless you accept in the cookie banner. If
              you decline, no request is made at all — the data is not gathered and discarded, it is
              never gathered.
            </p>

            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th scope="col">What</th>
                    <th scope="col">When</th>
                    <th scope="col">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {collected.map((r) => (
                    <tr key={r.what}>
                      <th scope="row">{r.what}</th>
                      <td>{r.when}</td>
                      <td>{r.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="h2" data-anim="clip">Where it goes</h2>
            <p>
              Visit records and form submissions are delivered to a private Discord channel used by
              the studio, hosted by Discord Inc. in the United States. They are not sold, not shared
              with advertisers, and not fed into any third-party advertising or profiling network.
              There are no tracking pixels on this site.
            </p>
            <p>
              The site is hosted on Vercel, which processes requests and derives the approximate
              location from the IP address. Fonts are served from Google Fonts.
            </p>

            <h2 className="h2" data-anim="clip">Cookie categories</h2>
            <p>
              Everything this site stores in your browser falls into one of three groups. Only the
              first runs before you have made a choice.
            </p>

            {categories.map((cat) => (
              <div className="ck-cat" key={cat.key}>
                <div className="ck-head">
                  <h3 className="ck-name">{cat.name}</h3>
                  <span className={`ck-flag ck-flag-${cat.key === 'necessary' ? 'on' : 'opt'}`}>
                    {cat.consent}
                  </span>
                </div>
                <p className="ck-what">{cat.what}</p>
                <div className="tbl-wrap">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Purpose</th>
                        <th scope="col">Kept</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.rows.map((r) => (
                        <tr key={r.name}>
                          <th scope="row"><code>{r.name}</code></th>
                          <td>{r.purpose}</td>
                          <td>{r.life}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <h2 className="h2" data-anim="clip">Changing your mind</h2>
            <p>
              Use <strong>{c.consent.reset}</strong> at the bottom of any page to be asked again, and
              to decline. Clearing this site&rsquo;s data in your browser removes everything in the
              table above.
            </p>
            <p>
              To ask what is held about you, to have it corrected, or to have it deleted, email{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. The studio operates from {LOCATION.city},{' '}
              {LOCATION.country}.
            </p>
          </div>
        </section>
      </main>
      <CtaBand c={c} lang={lang} />
      <SiteFooter c={c} lang={lang} />
    </>
  );
}
