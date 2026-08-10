/**
 * The pricing model behind the configurator (Phase 4, governed by DD-1).
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  OWNER REVIEW REQUIRED BEFORE LAUNCH
 *
 *  BASE_RATES below are the studio's actual prices. Everything else in this
 *  file is arithmetic; these six numbers are a business decision.
 *
 *  They are *derived*, not invented: SPEC §7 records the Greek and Macedonian
 *  market anchors, and the positioning ruling sets NovaFaber at 2–3× the local
 *  template market and well under UK agency rates. The rates below sit in that
 *  band. Derived is not confirmed — see the worked comparison under each rate
 *  and change the number if it is wrong.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Why a computed range is not the price list DD-1 forbids: a list is a static
 * claim that can be scanned and compared line-by-line against a template
 * shop's, which is a comparison decided on the one axis such a list exposes.
 * A range is a response to a described project — obtaining it requires the
 * visitor to qualify themselves first, which is the point of the tool.
 */

export type ProjectType = 'website' | 'store' | 'redesign' | 'custom';

/**
 * Base rate in EUR, before any modifier.
 *
 * Local market anchors for comparison (SPEC §7, Greek market, 2026):
 *   corporate 5–10 pages ....... €500–2,000
 *   corporate 10–20 pages ...... €2,000–4,000
 *   small e-shop (≤100 SKU) .... €1,500–3,500
 *   large / custom ............. €8,000–25,000+
 */
export const BASE_RATES: Record<ProjectType, number> = {
  // A simple site lands ~€1,440–2,160 after the ±20% band, against a local
  // €500–2,000 for the same page count. Deliberately the narrowest premium in
  // the table — this is the entry point, and pricing it out of reach loses the
  // enquiries that grow into the others.
  website: 1800,

  // A small store lands ~€7,800–11,600 configured typically, against a local
  // €1,500–3,500. Sits at the 2–3× ruling.
  store: 4000,

  // Lower base than a new build: the content, structure and copy already
  // exist. The audit is what is being bought.
  redesign: 1500,

  // Floor, not a rate. Custom work is scoped, and anything below this is a
  // conversation about whether it should be custom at all.
  custom: 6000,
};

/** ±20% around the computed midpoint. Wide enough to be honest about unknowns. */
export const RANGE_SPREAD = 0.2;

export interface Option<T extends string> {
  value: T;
  label: string;
  /** Multiplier applied to the base rate. */
  factor: number;
  /** Additional weeks contributed to the timeline. */
  weeks: number;
}

export const SCALE: Option<'small' | 'medium' | 'large' | 'xlarge'>[] = [
  { value: 'small', label: 'Up to 5 pages', factor: 1.0, weeks: 2 },
  { value: 'medium', label: '6 to 15 pages', factor: 1.5, weeks: 4 },
  { value: 'large', label: '16 to 30 pages', factor: 2.2, weeks: 7 },
  { value: 'xlarge', label: 'More than 30 pages', factor: 3.0, weeks: 11 },
];

export const CATALOGUE: Option<'c100' | 'c1000' | 'cbig'>[] = [
  { value: 'c100', label: 'Up to 100 products', factor: 1.0, weeks: 1 },
  { value: 'c1000', label: '100 to 1,000 products', factor: 1.6, weeks: 3 },
  { value: 'cbig', label: 'More than 1,000 products', factor: 2.4, weeks: 6 },
];

export const LOCALES_OPT: Option<'l1' | 'l2' | 'l3'>[] = [
  { value: 'l1', label: 'One language', factor: 1.0, weeks: 0 },
  { value: 'l2', label: 'Two languages', factor: 1.25, weeks: 1 },
  { value: 'l3', label: 'Three or more', factor: 1.45, weeks: 2 },
];

export const CMS: Option<'no' | 'yes'>[] = [
  { value: 'no', label: 'No — I will send changes to you', factor: 1.0, weeks: 0 },
  { value: 'yes', label: 'Yes — I want to edit it myself', factor: 1.25, weeks: 2 },
];

export const DESIGN: Option<'adapt' | 'scratch'>[] = [
  { value: 'adapt', label: 'I have a brand to work from', factor: 1.0, weeks: 0 },
  { value: 'scratch', label: 'Design it from scratch', factor: 1.35, weeks: 2 },
];

export const MOTION: Option<'none' | 'considered' | 'showpiece'>[] = [
  { value: 'none', label: 'Keep it plain and fast', factor: 1.0, weeks: 0 },
  { value: 'considered', label: 'Considered movement', factor: 1.15, weeks: 1 },
  { value: 'showpiece', label: 'A showpiece — real-time 3D', factor: 1.4, weeks: 3 },
];

export interface Config {
  type: ProjectType;
  scale: (typeof SCALE)[number]['value'];
  catalogue: (typeof CATALOGUE)[number]['value'];
  locales: (typeof LOCALES_OPT)[number]['value'];
  cms: (typeof CMS)[number]['value'];
  design: (typeof DESIGN)[number]['value'];
  motion: (typeof MOTION)[number]['value'];
}

/**
 * Deliberately the cheapest valid configuration, not a typical one.
 *
 * This is the figure that server-renders, so it is what an unconfigured
 * visitor sees and what a crawler indexes. A mid-range default put
 * €4,200–6,300 in front of someone whose actual project is €1,440–2,160,
 * which loses the enquiry before they touch a control.
 *
 * Starting at the floor and building up is also just how a configurator is
 * supposed to behave: every choice the visitor makes adds something they
 * asked for.
 */
export const DEFAULT_CONFIG: Config = {
  type: 'website',
  scale: 'small',
  catalogue: 'c100',
  locales: 'l1',
  cms: 'no',
  design: 'adapt',
  motion: 'none',
};

function find<T extends string>(opts: Option<T>[], value: T): Option<T> {
  return opts.find((o) => o.value === value) ?? opts[0];
}

export interface Estimate {
  low: number;
  high: number;
  weeksLow: number;
  weeksHigh: number;
  /** Plain-language summary — the actual deliverable for the studio. */
  summary: string[];
}

export function estimate(config: Config): Estimate {
  const base = BASE_RATES[config.type];
  const isStore = config.type === 'store';

  // A store is sized by its catalogue; everything else by its page count.
  // Charging a store for both double-counts the same work.
  const sizeOpt = isStore
    ? find(CATALOGUE, config.catalogue)
    : find(SCALE, config.scale);

  const parts = [
    sizeOpt,
    find(LOCALES_OPT, config.locales),
    find(CMS, config.cms),
    find(DESIGN, config.design),
    find(MOTION, config.motion),
  ];

  const factor = parts.reduce((acc, p) => acc * p.factor, 1);
  const mid = base * factor;

  const round = (n: number) => Math.round(n / 100) * 100;
  const low = round(mid * (1 - RANGE_SPREAD));
  const high = round(mid * (1 + RANGE_SPREAD));

  const weeks = parts.reduce((acc, p) => acc + p.weeks, 2); // 2 weeks scope + design kickoff

  const typeLabel: Record<ProjectType, string> = {
    website: 'A website',
    store: 'An online store',
    redesign: 'A redesign of an existing site',
    custom: 'A custom build',
  };

  const summary = [
    typeLabel[config.type],
    sizeOpt.label,
    find(LOCALES_OPT, config.locales).label,
    find(CMS, config.cms).value === 'yes' ? 'Self-editable content' : 'Content managed by NovaFaber',
    find(DESIGN, config.design).label,
    find(MOTION, config.motion).label,
  ];

  return { low, high, weeksLow: weeks, weeksHigh: weeks + Math.ceil(weeks * 0.4), summary };
}

export function formatEur(n: number): string {
  return `€${n.toLocaleString('en-GB')}`;
}

/** Encodes a config for the /contact handoff. */
export function toQuery(config: Config): string {
  return new URLSearchParams(config as unknown as Record<string, string>).toString();
}
