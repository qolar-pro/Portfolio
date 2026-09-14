import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND, EMAIL, FOUNDER, LOCATION, ROUTES } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { JourneyRail } from '@/components/JourneyRail';
import { Reveal } from '@/components/motion/Reveal';

/**
 * "Before you pay" — the studio's giveaway course.
 *
 * ── ONE DOCUMENT, THREE URLS, ONE CANONICAL ──────────────────────────
 * The body is English and not yet translated. It lives under /[lang]
 * anyway, because the root layout — fonts, theme script, nav, consent —
 * lives there, and a top-level route would have to duplicate all of it.
 *
 * So /el/course and /mk/course serve the English text and declare /en/course
 * as their canonical. That is the honest signal: the page exists at those
 * URLs, and search engines are told which one is the original rather than
 * being handed three copies of the same document as if they were
 * translations. When it is translated, each locale takes its own canonical
 * and nothing else changes.
 *
 * ── IT IS NOT GATED ──────────────────────────────────────────────────
 * The signup panel emails a link here; it does not lock the page. Gating
 * genuinely useful writing behind an address means it is never read, never
 * linked to and never found in search — which costs more than the addresses
 * it collects. The email is what makes people give the address; the page
 * being open is what makes anyone recommend it.
 */
const DESCRIPTION =
  'Ten short lessons on commissioning a website, written for the person signing the invoice: what moves a quote, who owns the code, and the questions to ask before you pay.';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'Before you pay for a website — a free course',
    description: DESCRIPTION,
    /* Always the English URL: the body is English whichever locale asked. */
    alternates: { canonical: `${SITE_URL}/en/course` },
    openGraph: {
      title: 'Before you pay for a website',
      description:
        'Ten lessons on commissioning a website — written for the person signing the invoice, not for developers.',
      url: `${SITE_URL}/${lang}/course`,
      type: 'article',
    },
  };
}

interface Lesson {
  n: string;
  h: string;
  core: string;
  p: string[];
  ask: string;
  askNote: string;
  flag?: string;
}

const LESSONS: Lesson[] = [
  {
    n: '01',
    h: 'Why two quotes for the same site differ by ten times',
    core: 'You are almost never comparing the same thing. You are comparing different amounts of work, wearing the same word.',
    p: [
      'Ask three people for “a website for my business” and you can get €400, €3,000 and €25,000 — all honestly quoted. The €400 is a theme, installed, with your logo on it. The €3,000 is a site designed around what you actually sell, built to be edited. The €25,000 has software in it: bookings, stock, accounts, something that has to be built rather than laid out.',
      'None of those is a rip-off. The rip-off is when the €400 job is sold at the €3,000 price, and you have no way to tell because both proposals say “custom design” and “mobile responsive” — phrases that mean nothing and cost nothing to write.',
      'What actually moves the price: how many distinct page layouts exist (not how many pages), how many languages, whether anything needs to be built rather than arranged, whether someone else has to be able to update it afterwards, and whether the content already exists.',
    ],
    ask: 'Which parts of this are being built for me, and which are being configured from something that already exists?',
    askNote: 'Both answers are fine. A quote where everything is “custom” is usually either very expensive or not true.',
  },
  {
    n: '02',
    h: 'Nobody should show you a design in the first meeting',
    core: 'A design produced before anyone understands the business is decoration. It might be beautiful decoration. It is still a guess.',
    p: [
      'The first conversation should be almost entirely about your business: what you sell, who buys it, what usually goes wrong, what happens when someone calls instead of clicking. If it is mostly about colours, fonts and “the vibe”, you are buying a look, and the look is the cheap part.',
      'The reason this matters commercially: a site designed without that conversation will be pretty and will fail to do the one job you needed it to do — and you will not find out until it is live, when changing it is expensive.',
      'A good sign: they push back on something you asked for and explain why. Somebody who agrees with everything in a first meeting is selling, not planning.',
    ],
    ask: 'What do you think this site’s main job is, in one sentence?',
    askNote:
      'If the answer is “to represent your brand online”, keep looking. If it is “to get people to phone you, because that is where you close” — they were listening.',
  },
  {
    n: '03',
    h: 'Find out who owns it before you fall out, not after',
    core: 'The domain, the hosting, the code and the accounts can all end up in somebody else’s name. That is the single most expensive mistake in this list.',
    p: [
      'It usually is not malicious. Someone registers the domain on their own account because it is faster, sets up hosting under their reseller plan because it is cheaper, and builds on a platform licensed to them. Everything works. Then the relationship ends — they get busy, they raise the price, they stop answering — and you discover you cannot move your own website, and in the worst version cannot even receive your own email.',
      'What you want, in writing, before any money moves: the domain is registered to you or your company; you have the login to the registrar; hosting is on an account in your name; and you receive the source code at launch. If a platform is involved, the project sits in your workspace, not theirs.',
      '“We’ll handle all that for you” is a fine service and a terrible ownership arrangement. You can have both — someone managing it, on accounts that belong to you.',
    ],
    ask: 'If I stopped working with you tomorrow, what exactly would I walk away with, and what would I lose?',
    askNote:
      'A straight answer takes about fifteen seconds. Hesitation here is the most useful signal in this whole document.',
    flag: 'Anyone who cannot immediately tell you whose name the domain will be in.',
  },
  {
    n: '04',
    h: 'Template or custom is the wrong question',
    core: 'The real question is whether the thing you are buying can change later without going back to the person who built it.',
    p: [
      'A well-chosen template, set up properly, beats a bad custom build every time — and costs a fraction. Templates get a bad name because of how they are usually sold: as “custom”, at custom prices, with the parts that would have made them work left undone.',
      'Custom earns its price in two situations. One: your business does something the standard shapes do not fit — unusual products, unusual bookings, a process nobody else has. Two: the site is a real part of how you make money, so a few percent of performance is worth paying for.',
      'If neither is true, a template is not a compromise. It is the correct decision, and the money saved is better spent on photography, on writing, or on getting anyone to visit at all.',
    ],
    ask: 'Show me how I add a new product or page myself, after launch.',
    askNote:
      'Watch the demo. If it takes fifteen fields and a phone call, your catalogue will rot, whatever the site cost.',
  },
  {
    n: '05',
    h: 'How to read a scope document',
    core: 'The quote is the least informative page. What matters is the list of what is being built, and what happens when that list changes.',
    p: [
      'A scope worth signing names the specific pages and features, says who supplies the content, gives a delivery date, and states what happens if you want something added halfway through. If the document is one paragraph and a number, the number is not really fixed — it is an opening position.',
      'The clause that matters most is the change clause. “Additional work charged at our hourly rate” with no ceiling is how a €3,000 project becomes €7,000 one small request at a time. Better: any addition is quoted and approved in writing before it is built. Then you are never surprised by an invoice.',
      'Also check what is excluded. Not because exclusions are sinister — every scope has them — but because reading them is the fastest way to discover the two things you assumed were included and are not. It is usually content writing and photography.',
    ],
    ask: 'What is the most likely reason this project goes over budget, and how does the document handle it?',
    askNote: 'Everyone experienced has an answer. It is almost always content arriving late or scope creeping.',
  },
  {
    n: '06',
    h: 'Your project will be late because of content',
    core: 'Not code. Not design. Text, photographs and product information that only you can supply.',
    p: [
      'This is the most reliable pattern in the business, and it catches people who have done everything else right. The build finishes, and the site sits waiting on the About page nobody wrote and the photographs nobody took. Weeks pass. Momentum dies.',
      'What to do about it: agree who writes what on day one, in the scope document. Start gathering before design begins, not after. And if writing is not something you or anyone in the business will realistically do, pay someone — a half-finished site is worth less than a smaller one that launched.',
      'One practical trick: write the content badly and quickly first, in a document, before anyone designs anything. Bad real content beats good placeholder text, because it shows everyone how much space things actually need.',
    ],
    ask: 'What exactly do you need from me, and by when, for this date to hold?',
    askNote: 'Get the list before you sign. Then be honest with yourself about whether you will do it.',
  },
  {
    n: '07',
    h: 'What “SEO included” almost always means',
    core: 'It usually means the site is built so as not to be actively broken for search. That is worth having. It is not marketing, and it will not bring you traffic on its own.',
    p: [
      'The technical part — proper headings, real page titles, descriptions, a sitemap, fast loading, working on phones — should simply be how a site is built. Charging extra for it is like charging extra for doors that close. Fine to list it; be suspicious if it is a line item with a big number.',
      'What actually moves search results is separate ongoing work: understanding what your customers type, writing pages that answer it, and earning other sites’ links. That is a service with a monthly cost, and anyone selling it as a one-off box tick is selling you the doors again.',
      'Be especially careful with ranking promises. Nobody controls Google’s results. A promise of “page one” is either about a phrase nobody searches for, or it is not a promise at all.',
    ],
    ask: 'Which searches should this site show up for, and how will we know in three months whether it does?',
    askNote: 'The second half of the question is the important one.',
    flag: 'A guaranteed ranking, a guaranteed traffic number, or “we have a relationship with Google”.',
  },
  {
    n: '08',
    h: 'Test it on the phone your customer actually has',
    core: 'Not your laptop, on office wifi, next to the person who built it.',
    p: [
      'Most sites are approved in the best possible conditions and used in the worst. Your customers are on three-year-old phones, on mobile data, one-handed, in a hurry, often outdoors where they cannot see a low-contrast grey. A site that feels instant in the meeting can feel broken in the wild.',
      'Before you sign it off: open it on the oldest phone in the office, with wifi turned off. Try to do the one thing the site exists for — buy, book, call, enquire. Time it. If that takes more than a few seconds to even start, nothing else on the page matters.',
      'Speed is not vanity. It is the difference between someone finishing a checkout and giving up, and it compounds against every other thing you paid for.',
    ],
    ask: 'What does this score on a Lighthouse or PageSpeed test on mobile, and can I see it?',
    askNote: 'It is a free test anyone can run in a browser. A builder who has never run it on your site has not finished.',
  },
  {
    n: '09',
    h: 'Ask what happens the day after launch',
    core: 'Websites are not finished objects. They are things that quietly decay unless someone maintains them.',
    p: [
      'Certificates expire. Platforms release updates. Plugins break each other. A site left alone for two years is not the same site — it is slower, less secure, and increasingly likely to break on a Tuesday for no visible reason.',
      'You have three honest options, and you should pick one deliberately rather than drift into the fourth. Pay a monthly care plan. Learn to do the updates yourself. Or accept that you will pay someone to fix it reactively, at a worse rate, when it breaks. The fourth option — nobody is responsible — is the one most sites end up on.',
      'Whatever you choose, know now what the emergency looks like: who to call, how fast, and roughly what it costs. Discovering there is no answer while your checkout is down is expensive in a way that is hard to describe.',
    ],
    ask: 'If the site goes down on a Saturday, what happens?',
    askNote: '“Nothing, it’s not covered” is a perfectly acceptable answer. Not knowing is not.',
  },
  {
    n: '10',
    h: 'Decide how you will know it worked',
    core: 'Before it is built. Otherwise the only available verdict is whether you like the way it looks, and that is the least important thing about it.',
    p: [
      'Pick one or two numbers that mean something to your business — enquiries a month, orders a week, calls from the site, quote requests. Write down what they are today, even roughly, even if the honest answer is zero. Then you have a before.',
      'Without a before, there is no after. Six months on you will be looking at a nicer website with no idea whether it earned its money, and the conversation about spending more will be based entirely on taste.',
      'Make sure the site can actually count the thing you care about: that form submissions are recorded somewhere, that phone taps are tracked, that orders are attributed. This is a small job during the build and an awkward one afterwards.',
    ],
    ask: 'What will we measure, and where will I see it without asking you?',
    askNote: 'A dashboard you can open yourself beats a monthly report you have to request.',
  },
];

const CHECKLIST = [
  'The domain is registered in my name, and I have the login.',
  'Hosting and every third-party account are in my name.',
  'I get the source code at launch.',
  'The scope document lists what is being built, page by page.',
  'Extra work is quoted and approved in writing before it is done.',
  'I know exactly what content I owe, and by when.',
  'I have seen it on an old phone, off wifi, doing the main task.',
  'I know who fixes it when it breaks, and what that costs.',
  'I wrote down the numbers as they are today, before launch.',
];

export default async function CoursePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  /* Course schema, because that is what this is — and the FAQ-style "ask
     them" lines are genuinely on the page, so nothing here claims more than
     the document contains. */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Before you pay for a website',
    description: DESCRIPTION,
    url: `${SITE_URL}/en/course`,
    inLanguage: 'en',
    isAccessibleForFree: true,
    provider: { '@id': `${SITE_URL}/#organization` },
    author: { '@id': `${SITE_URL}/#founder` },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT35M',
    },
  };

  return (
    <>
      <JsonLd data={schema} />
      <JourneyRail steps={LESSONS.length} />
      <main id="main" className="course">
        <div className="shell">
          <header className="course-top">
            <Reveal>
              <Link className="eyebrow" href={`/${lang}`}>
                {BRAND}
              </Link>
              <h1 className="course-h1" data-anim="clip" data-anim-delay="1">
                Before
                <br />
                you <em>pay.</em>
              </h1>
              <p className="course-stand" data-anim="fade" data-anim-delay="2">
                Ten things worth knowing before you commission a website — written for the person
                signing the invoice, not for developers.
              </p>
              <div className="course-meta" data-anim-group>
                <span>10 lessons</span>
                <span>~35 min read</span>
                <span>No jargon</span>
                <span>Free</span>
              </div>
            </Reveal>
          </header>

          <div className="course-intro" data-anim="fade">
            <p>
              <strong>This is not a sales brochure.</strong> Most of it will help you buy a website
              from someone else just as well as from me. That is deliberate: a client who knows what
              to ask is easier to work with, and the ones who do not are the ones who end up angry
              two years later at somebody.
            </p>
            <p>
              Every lesson ends with <strong>a literal question to put to whoever is quoting you</strong>.
              You do not need to understand the answer technically. You need to notice whether they
              can answer it plainly, and whether the answer matches what ends up in writing.
            </p>
            <p>
              If you read only one, read <strong>03</strong>. It is the one that costs people real
              money.
            </p>
          </div>

          {LESSONS.map((l) => (
            <section className="lesson" data-anim="rise" id={`l${l.n}`} key={l.n}>
              <div className="lesson-head">
                <span className="lesson-n">{l.n}</span>
                <h2>{l.h}</h2>
              </div>
              <p className="lesson-core">{l.core}</p>
              {l.p.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <div className="lesson-ask">
                <b>Ask them</b>
                <q>{l.ask}</q>
                <p>{l.askNote}</p>
              </div>
              {l.flag && (
                <div className="lesson-flag">
                  <b>Red flag</b>
                  <p>{l.flag}</p>
                </div>
              )}
            </section>
          ))}

          <section className="course-close" data-anim="rise">
            <span className="eyebrow" data-anim="fade">Take this with you</span>
            <h2 data-anim="clip" data-anim-delay="1">The one-page version</h2>
            <p data-anim="fade" data-anim-delay="2">
              If you only take a checklist from all of this, take this one. It is the part that
              protects you.
            </p>
            <ul className="course-check" data-anim-group>
              {CHECKLIST.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="course-by">
              <strong>Written by {FOUNDER}</strong> — {BRAND}, a one-person studio in{' '}
              {LOCATION.city}. Nothing in here is specific to working with me, and it is not legal
              advice. It is what I would want a friend to know before they spent the money.
            </p>
            <p>
              <Link className="btn btn-ghost" href={`/${lang}${ROUTES.contact}`}>
                Talk to the studio
                <span className="circ" aria-hidden="true">
                  →
                </span>
              </Link>
            </p>
          </section>

          <footer className="course-foot">
            {BRAND} · Before You Pay · Free to share, no attribution needed ·{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </footer>
        </div>
      </main>
    </>
  );
}
