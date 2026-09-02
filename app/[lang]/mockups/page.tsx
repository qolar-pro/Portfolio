import type { Metadata } from 'next';
import { CapabilityLedger } from '@/components/CapabilityLedger';
import { Nav } from '@/components/Nav';
import { ProcessStack } from '@/components/ProcessStack';
import { SiteFooter } from '@/components/SiteFooter';
import {
  CapAccordion,
  CapBento,
  CapLedger,
  CapStickySplit,
} from '@/components/mockups/CapabilityVariants';
import {
  ProcSpine,
  ProcStack,
  ProcStaircase,
  ProcStepper,
} from '@/components/mockups/ProcessVariants';
import { resolveLang } from '@/lib/params';

/**
 * A picking board, not a page of the site.
 *
 * Every variant below renders the REAL content — the same three
 * disciplines, the same four stages, the same descriptions, sub-items and
 * deliverables, unedited and at full length. That is the entire point: a
 * layout that looks decisive holding three short words is a different
 * layout once it is holding "A live site — with the code, the domain and
 * every account in your name."
 *
 * Both themes work here, so use the toggle in the nav on each one — some of
 * these change character completely on the pale ground.
 *
 * NOINDEX, and disallowed in robots.txt. It is linked from nowhere. Delete
 * this route, `components/mockups/`, and the `MOCKUPS` block in globals.css
 * once a choice is made.
 */

export const metadata: Metadata = {
  title: 'Section mockups',
  robots: { index: false, follow: false, nocache: true },
};

const CAPS = [
  {
    id: 'cap-current',
    tag: 'Current',
    name: 'Ledger (chosen, built)',
    note: 'The picked shape, built properly: scroll-linked differential drift, a hairline that draws itself as the row passes, and a teal edge on hover and focus.',
  },
  {
    id: 'cap-ledger',
    tag: 'A',
    name: 'Ledger',
    note: 'Full-width numbered rows; the sub-items run on as one continuous line. The most editorial and the least card-like — it reads like a contents page. Weakest at making individual items feel clickable.',
  },
  {
    id: 'cap-split',
    tag: 'B',
    name: 'Sticky split',
    note: 'The heading pins on the left while the disciplines scroll past. The most common studio-site pattern going, and it earns it — the section keeps its own title in view the whole way down. Needs vertical room.',
  },
  {
    id: 'cap-accordion',
    tag: 'C',
    name: 'Accordion rows',
    note: 'Densest per pixel and the most familiar to a non-designer. Sub-items in a multi-column grid inside. Costs a click before anything is visible.',
  },
  {
    id: 'cap-bento',
    tag: 'D',
    name: 'Bento grid',
    note: 'Lead discipline takes a double cell. The most "product company" of the set and the best at making the section feel built rather than written. Hardest to keep balanced if the item counts drift apart.',
  },
];

const PROCS = [
  {
    id: 'proc-current',
    tag: 'Current',
    name: 'Sticky stack (chosen, built)',
    note: 'The picked shape, built properly: position:sticky so the page keeps the scroll, with scrubbed recession giving the pile real depth.',
  },
  {
    id: 'proc-spine',
    tag: 'A',
    name: 'Spine',
    note: 'One rule down the left, a node per stage. The most literal reading of "four steps in order", and the one that survives best on a phone because underneath it is just a list. Quietest of the set.',
  },
  {
    id: 'proc-stack',
    tag: 'B',
    name: 'Sticky stack',
    note: 'Each stage sticks and the next deals itself over the top. Pure CSS position:sticky — no scroll handler, no pinning, the page keeps control throughout. The most cinematic, and the one that most rewards scrolling slowly.',
  },
  {
    id: 'proc-stepper',
    tag: 'C',
    name: 'Stepper',
    note: 'Numbered rows that open in place, with the deliverable as the payoff. Behaves like a pricing or FAQ section, which is why it reads as informative rather than decorative. Fastest to skim.',
  },
  {
    id: 'proc-stairs',
    tag: 'D',
    name: 'Staircase',
    note: 'The stages step down and across, connected corner to corner. Says "sequence" without a number needing to be read. Most distinctive, most horizontal room, collapses to a column early.',
  },
];

export default async function MockupsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, c } = await resolveLang(params);

  return (
    <>
      <Nav lang={lang} c={c} />

      <main id="main" className="mk">
        <header className="mk-hero shell">
          <p className="eyebrow">Internal · not linked, not indexed</p>
          <h1 className="mk-title">Pick a shape.</h1>
          <p className="lede">
            Every option below is holding your real copy at its real length — the same three
            disciplines, the same four stages, the same deliverables. Try each one in both
            themes; the toggle is in the nav. Tell me the letter and I will build it properly
            and delete the rest.
          </p>

          <nav className="mk-jump" aria-label="Jump to a variant">
            <p className="mk-jump-label">Capabilities</p>
            <ul>
              {CAPS.map((v) => (
                <li key={v.id}>
                  <a href={`#${v.id}`}>
                    <b>{v.tag}</b> {v.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mk-jump-label">How it runs</p>
            <ul>
              {PROCS.map((v) => (
                <li key={v.id}>
                  <a href={`#${v.id}`}>
                    <b>{v.tag}</b> {v.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* ============================ CAPABILITIES ============================ */}
        <Band title="Capabilities" count={CAPS.length} />

        <Slot v={CAPS[0]}>
          <CapabilityLedger c={c} lang={lang} headingLevel={3} />
        </Slot>
        <Slot v={CAPS[1]}>
          <CapLedger c={c} />
        </Slot>
        <Slot v={CAPS[2]}>
          <CapStickySplit c={c} />
        </Slot>
        <Slot v={CAPS[3]}>
          <CapAccordion c={c} />
        </Slot>
        <Slot v={CAPS[4]}>
          <CapBento c={c} />
        </Slot>

        {/* ============================ HOW IT RUNS ============================ */}
        <Band title="How it runs" count={PROCS.length} />

        <Slot v={PROCS[0]} bleed>
          <ProcessStack c={c} lang={lang} />
        </Slot>
        <Slot v={PROCS[1]}>
          <ProcSpine c={c} />
        </Slot>
        <Slot v={PROCS[2]}>
          <ProcStack c={c} />
        </Slot>
        <Slot v={PROCS[3]}>
          <ProcStepper c={c} />
        </Slot>
        <Slot v={PROCS[4]}>
          <ProcStaircase c={c} />
        </Slot>
      </main>

      <SiteFooter c={c} lang={lang} />
    </>
  );
}

function Band({ title, count }: { title: string; count: number }) {
  return (
    <div className="mk-band">
      <div className="shell">
        <h2>{title}</h2>
        <span>{count} options</span>
      </div>
    </div>
  );
}

function Slot({
  v,
  children,
  bleed,
}: {
  v: { id: string; tag: string; name: string; note: string };
  children: React.ReactNode;
  /* the horizontal deck brings its own section padding and background */
  bleed?: boolean;
}) {
  return (
    <section className="mk-slot" id={v.id}>
      <div className="shell mk-slot-head">
        <span className="mk-tag">{v.tag}</span>
        <div>
          <h3>{v.name}</h3>
          <p>{v.note}</p>
        </div>
      </div>
      <div className={bleed ? 'mk-stage-bleed' : 'shell mk-stage'}>{children}</div>
    </section>
  );
}
