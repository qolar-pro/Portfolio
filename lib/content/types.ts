import type { Locale } from '@/lib/locales';

/**
 * The content model.
 *
 * The old site had one flat `SiteContent` shaped like a single scrolling page
 * — `hero`, `about`, `services`, `work`, `experience`, `stack`, `contact`.
 * That shape cannot serve a route tree, because entities now appear in more
 * than one place: a service is a card on the homepage bento *and* a full page,
 * a case study is a homepage feature *and* its own page.
 *
 * So content is modelled as entities, and pages compose them.
 */

/* ------------------------------------------------------------------ */
/* Entities                                                            */
/* ------------------------------------------------------------------ */

export interface Service {
  /** Matches the route path segment, e.g. 'websites' for /services/websites. */
  id: 'websites' | 'ecommerce' | 'redesign' | 'custom';
  /** Nav and card label. Short. */
  name: string;
  /** One line. Used on the homepage bento. */
  summary: string;
  /** The page's opening statement. */
  lede: string;
  /** What the client actually receives. Concrete nouns, not adjectives. */
  includes: string[];
  /** Who this is wrong for. Disqualifying honestly builds more trust than claiming universality. */
  notFor: string;
}

export interface ProcessStep {
  id: 'forge' | 'cast' | 'temper' | 'finish';
  name: string;
  /** The Greek market's own term for this stage — recognised locally (SPEC §6). */
  greekName: string;
  /** The industry stages this step covers, in the vocabulary clients already know. */
  covers: string[];
  /** What the client has in hand when this step ends. */
  deliverable: string;
}

export interface CaseStudy {
  id: string;
  /** Client or product name. */
  name: string;
  tagline: string;
  /** Short form, for cards. */
  summary: string;
  /** Long form, for the case study page. */
  body: string[];
  /** Verifiable facts only. Never invent a metric. */
  facts: string[];
  stack: string[];
  images: string[];
  /** Live URL, when the work is public. */
  url: string | null;
  /**
   * DD-4 keeps capability proof off the sales path. `work` entries sell;
   * `lab` entries demonstrate range without diluting the pitch.
   */
  surface: 'work' | 'lab';
  /** Flagship gets the homepage slot and the fullest treatment. */
  flagship: boolean;
}

export interface Capability {
  title: string;
  /** Framed as an outcome, not a logo list (SPEC §8). */
  outcome: string;
  tools: string[];
}

export interface Founder {
  name: string;
  role: string;
  /** DD-4: founder-forward. Proof beneath the brand, never the headline. */
  bio: string[];
  /** Required by DD-4. `null` until supplied — a faceless bio gets none of the benefit. */
  photo: string | null;
}

export interface Testimonial {
  /** DD-5: real name, role and company, or it does not ship. */
  quote: string;
  name: string;
  role: string;
  company: string;
}

/* ------------------------------------------------------------------ */
/* Page-level content                                                  */
/* ------------------------------------------------------------------ */

export interface PageMeta {
  title: string;
  description: string;
}

export interface HomeContent {
  /** What is built, for whom. Not a mood statement. */
  headline: string;
  subhead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Above-the-fold credibility. Verifiable claims only. */
  proof: { value: string; label: string }[];
}

export interface Chrome {
  navLabels: Record<string, string>;
  footerNote: string;
  ctaBook: string;
  ctaQuote: string;
}

/* ------------------------------------------------------------------ */
/* The locale bundle                                                   */
/* ------------------------------------------------------------------ */

export interface LocaleContent {
  /**
   * DD-10 forbids a locale silently inheriting English. A bundle declares its
   * own status, and anything not `complete` is excluded from indexing until
   * its copy is written (see DD-15).
   */
  status: 'complete' | 'in-progress' | 'not-started';
  chrome: Chrome;
  home: HomeContent;
  meta: Record<string, PageMeta>;
  services: Service[];
  process: ProcessStep[];
  caseStudies: CaseStudy[];
  capabilities: Capability[];
  founder: Founder;
  /** DD-5: three exist. `null` entries are unsupplied, never placeholder text. */
  testimonials: (Testimonial | null)[];
}

export type ContentRegistry = Record<Locale, LocaleContent | null>;
