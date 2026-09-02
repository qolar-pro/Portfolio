/**
 * Single source of truth for site copy.
 *
 * Everything marked "ported" is lifted verbatim from the old site at
 * D:\apps\portfolio\Portfolio\lib\i18n.ts — four projects, five services,
 * four capability groups, about, trajectory, contact. Both EN and EL.
 *
 * Two deliberate substitutions: the old brand name "Apex Solutions" reads
 * "NovaFaber", and the trajectory heading no longer points at the dead brand.
 * Nothing else in the ported copy was rewritten.
 *
 * New copy (process pipeline, FAQ, form labels, section ledes) is written in
 * the same voice, in both languages, and is flagged in the build notes.
 */

import { PROJECTS, type ProjectAssets } from '@/lib/projects';

export type Lang = 'en' | 'el' | 'mk';

export const LANGS: Lang[] = ['en', 'el', 'mk'];

export const langNames: Record<Lang, string> = {
  en: 'EN',
  el: 'ΕΛ',
  mk: 'МК',
};

/**
 * One project, as the components see it: the registry's language-independent
 * facts spread together with this locale's title, tagline and description.
 */
export interface Project extends ProjectAssets {
  title: string;
  tagline: string;
  desc: string;
}

/**
 * Language-independent project data.
 *
 * This used to hold the URLs, images, features and stack inline. It now
 * re-exports lib/projects.ts, which is the single registry — one object per
 * project with a `liveUrl` field, so swapping a deploy subdomain for a real
 * domain is a one-line change in one file rather than a hunt through
 * components and three translations.
 */
const META = PROJECTS;

export interface SiteContent {
  meta: { title: string; description: string };
  nav: {
    links: { label: string; href: string }[];
    book: string;
    menu: string;
    close: string;
    /** Accessible name for the language switcher — it is a globe glyph otherwise. */
    language: string;
    /** The skip link, first in the tab order on every page. */
    skip: string;
  };
  /**
   * Theme switch copy.
   *
   * `dark`/`light` are the visible labels (what the site IS right now);
   * `toDark`/`toLight` are the accessible names (what pressing it WILL do).
   * Keeping both means the label can stay one short word without the
   * screen-reader announcement becoming ambiguous.
   */
  theme: { dark: string; light: string; toDark: string; toLight: string };
  hero: {
    status: string;
    headA: string;
    headB: string;
    tagline: string;
    desc: string;
    ctaWork: string;
    ctaTalk: string;
    scroll: string;
    stats: { value: string; label: string }[];
  };
  marquee: string[];
  services: {
    label: string;
    heading: string;
    lede: string;
    expand: string;
    cta: string;
    /** Homepage: three cards threaded by the neon line. */
    pillars: { title: string; desc: string; items: string[] }[];
    /** The five ported studio capabilities — used on the /services route. */
    items: { title: string; desc: string; points: string[] }[];
  };
  work: {
    label: string;
    heading: string;
    lede: string;
    cta: string;
    featuresLabel: string;
    stackLabel: string;
    labLabel: string;
    labNote: string;
    /** Badge and caption for a project still under embargo — see Project. */
    embargoLabel: string;
    embargoNote: string;
    projects: Project[];
  };
  process: {
    label: string;
    heading: string;
    lede: string;
    cta: string;
    /** Tells the visitor the stage list scrolls — the old panel had no such cue. */
    scrollHint: string;
    /** Each step ends in something the client physically receives. */
    steps: { title: string; desc: string; deliverable: string }[];
  };
  about: {
    label: string;
    heading: string;
    p1: string;
    p2: string;
    pillars: string[];
    trajectoryLabel: string;
    trajectoryHeading: string;
    jobs: { role: string; company: string; period: string; desc: string }[];
  };
  stack: {
    label: string;
    heading: string;
    lede: string;
    groups: { title: string; desc: string; skills: string[] }[];
  };
  faq: {
    label: string;
    heading: string;
    lede: string;
    items: { q: string; a: string }[];
  };
  contact: {
    label: string;
    headingA: string;
    headingB: string;
    desc: string;
    emailLabel: string;
    form: {
      name: string;
      namePh: string;
      email: string;
      emailPh: string;
      company: string;
      companyPh: string;
      kind: string;
      kinds: string[];
      budget: string;
      budgets: string[];
      message: string;
      messagePh: string;
      submit: string;
      sending: string;
      note: string;
      fallback: string;
    };
  };
  testimonials: {
    label: string;
    heading: string;
    lede: string;
    /** Shown on any quote still marked unapproved. */
    draftBadge: string;
    items: Testimonial[];
  };
  blog: { label: string; heading: string; lede: string; cta: string; readMore: string; all: string };
  /** "Why they chose us" — the client-mark panel on the homepage. */
  chosen: { label: string; heading: string; desc: string; primary: string; secondary: string };
  /** The band above the footer, on every route. */
  ctaBand: { eyebrow: string; heading: string; desc: string; primary: string; secondary: string };
  /** Hero copy for each inner route. */
  routes: Record<RouteKey, { eyebrow: string; title: string; lede: string }>;
  footer: {
    tagline: string;
    note: string;
    rights: string;
    socialsLabel: string;
    navLabel: string;
    servicesLabel: string;
    studioLabel: string;
    studioLinks: { label: string; href: string }[];
    /** The "get in touch" block that opens the footer on every route. */
    contact: {
      eyebrow: string;
      heading: string;
      lede: string;
      email: { title: string; desc: string };
      social: { title: string; desc: string };
      phone: { title: string; desc: string };
      mapLabel: string;
    };
  };
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  project: string;
  /** Project slug — resolves the client's mark for the avatar. See lib/marks. */
  slug: string;
  /**
   * DRAFTS UNTIL THE NAMED PERSON HAS SIGNED OFF.
   *
   * These quotes were written by me, not said by the client. Publishing them
   * as-is would be inventing an endorsement and attributing it to a real
   * business. Send each one to the person named, get a yes (ideally in
   * writing), edit it to whatever they actually want to say, then flip this
   * to true. Anything left false renders with a visible DRAFT badge so it
   * cannot ship unnoticed.
   */
  approved: boolean;
}

export type RouteKey = 'services' | 'work' | 'process' | 'about' | 'contact' | 'book' | 'blog';

/** Route paths, language-prefixed at render time. */
export const ROUTES: Record<RouteKey, string> = {
  services: '/services',
  work: '/work',
  process: '/process',
  about: '/about',
  contact: '/contact',
  book: '/book-a-call',
  blog: '/blog',
};

/* ------------------------------------------------------------------ */
/* ENGLISH                                                             */
/* ------------------------------------------------------------------ */

const en: SiteContent = {
  meta: {
    title: 'NovaFaber — Websites, online stores and custom software',
    description:
      'Independent digital studio. Websites, commerce systems and custom platforms, engineered end to end. Built in production for real clients.',
  },
  nav: {
    links: [
      { label: 'Work', href: '/work' },
      { label: 'Services', href: '/services' },
      { label: 'Process', href: '/process' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    book: 'Book a call',
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
    skip: 'Skip to content',
  },
  theme: {
    dark: 'Dark',
    light: 'Light',
    toDark: 'Switch to dark theme',
    toLight: 'Switch to light theme',
  },
  hero: {
    status: 'Independent digital studio', // ported
    headA: 'Built from',
    headB: 'scratch.',
    // ported verbatim
    tagline: 'Software with the precision of engineering and the presence of cinema.',
    // ported, brand name substituted
    desc: 'NovaFaber designs and engineers digital products end to end — from system architecture to the last frame of motion. Nothing templated. Nothing accidental.',
    ctaWork: 'See the work', // ported: 'Enter the work'
    ctaTalk: 'Start a conversation', // ported
    scroll: 'Scroll',
    stats: [
      { value: '5', label: 'Shipped platforms' },
      { value: '5', label: 'Languages live' },
      { value: '100%', label: 'Written, not templated' },
    ],
  },
  // ported
  marquee: [
    'FULL-STACK ENGINEERING',
    'INTERFACE DESIGN',
    'COMMERCE SYSTEMS',
    'REAL-TIME EXPERIENCES',
    'CREATIVE DEVELOPMENT',
    'PERFORMANCE',
  ],
  services: {
    label: 'Capabilities', // ported
    heading: 'What the studio does.', // ported
    lede: 'Three disciplines under one roof. Most projects need two of them at once, which is the reason they are not three different invoices.',
    expand: 'What you get',
    cta: 'All services',
    // Development leads deliberately: it is the pillar the portfolio proves.
    pillars: [
      {
        title: 'Development',
        desc: 'The part with the receipts — five platforms in production, one of them running a licensed agency in five languages.',
        items: [
          'Website builds',
          'E-shop builds',
          'Custom applications',
          'Shopify',
          'Wholesale / B2B portals',
          'Hosting & domain',
          'Site support',
        ],
      },
      {
        title: 'Design',
        desc: 'Interface, identity and motion designed as one system, starting from your content rather than a template.',
        items: [
          'UI / UX design',
          'Brand identity',
          'Storefront design',
          'Design systems',
          'Motion & interaction',
        ],
      },
      {
        title: 'Digital Marketing',
        desc: 'Getting the traffic there and turning it into orders. Measured, not guessed.',
        items: [
          'SEO',
          'Google Ads',
          'Google Shopping',
          'Email marketing',
          'CRO',
          'Google Analytics',
          'Conversion-gain calculator',
        ],
      },
    ],
    items: [
      {
        // ported
        title: 'Full-Stack Platforms',
        desc: 'End-to-end product engineering — resilient architecture, clean APIs, and frontends tuned to the millisecond.',
        points: [
          'Business websites and multi-page marketing sites',
          'Custom application logic, not plugin stacks',
          'Multi-language from the first commit',
          'Hosting, domain and deployment handled',
        ],
      },
      {
        // ported
        title: 'Commerce Systems',
        desc: 'Storefronts engineered for conversion: secure payment pipelines, living product databases, and a purchase path with zero friction.',
        points: [
          'Card payments and cash on delivery',
          'Per-variant stock and order management',
          'An admin panel your staff can actually use',
          'Checkout measured and tuned, not assumed',
        ],
      },
      {
        // ported
        title: 'Internal Tooling',
        desc: 'Bespoke dashboards and operational systems that make complex data legible, fast, and safe to act on.',
        points: [
          'Booking, scheduling and shift systems',
          'Role-based access for teams',
          'Exports to the formats your accountant wants',
          'Replaces the spreadsheet that is holding the business together',
        ],
      },
      {
        // ported
        title: 'Data & Security',
        desc: 'Database architecture built to scale, with privacy and security treated as design constraints — never afterthoughts.',
        points: [
          'Schema designed for the next three years',
          'GDPR-aware data handling',
          'Backups and recovery that have been tested',
          'No credentials in the frontend, ever',
        ],
      },
      {
        // ported
        title: 'Experience Systems',
        desc: 'Interfaces where hierarchy, motion, and interaction are designed as one continuous system — not decorated afterwards.',
        points: [
          'Design that starts from the content, not a template',
          'Real-time 3D and WebGL where it earns its weight',
          'Fast on a mid-range phone on mobile data',
          'Accessible contrast, focus states and keyboard paths',
        ],
      },
    ],
  },
  work: {
    label: 'Selected work', // ported
    heading: 'Built. Shipped. Live.', // ported
    lede: 'Every one of these is online right now. Open them.',
    cta: 'Visit live site', // ported: 'Live preview'
    featuresLabel: 'What it does',
    stackLabel: 'Built with',
    labLabel: 'Lab',
    labNote: 'Not client work — the place where the engine gets written from nothing.',
    embargoLabel: 'Launching soon',
    embargoNote: 'Built and signed off. Under wraps until the client opens the doors.',
    projects: [
      {
        title: 'A25 — The Agency',
        tagline: 'Production platform for a licensed recruitment agency.',
        desc: 'The live, five-language platform of A25 — a licensed agency connecting North Macedonian businesses with verified workforce from Asia. Employer and candidate application flows, a custom live-chat widget answered through Telegram, and automated email pipelines. Running in production at a25.mk.',
        ...META.a25,
      },
      {
        title: 'KD Law — Клинче и Димовски',
        tagline: 'A Skopje law firm, online without the stock photography.',
        desc: 'A bilingual practice site for an advocacy office in Skopje: six practice areas, partner and team profiles, and an appointment request that lands as a real booking rather than a form email. Articles are written and published through an in-house composer, so the firm publishes without waiting on a developer.',
        ...META.dklaw,
      },
      {
        /* Renamed: the storefront at this URL trades as Dress Code, not as
           Sneaker Air. The 3D viewer claim came off with the sneakers —
           it is not on the live site, and a differentiator you cannot point
           at is not a differentiator. Everything else is the same build. */
        title: 'Dress Code',
        tagline: 'A luxury fashion storefront, engineered end to end.',
        desc: 'Premium fashion commerce, end to end: a catalogue split by category with live item counts, Stripe and cash checkout, and per-size inventory that stays accurate. A full admin panel — product, order and campaign control behind layered auth — rides on a Supabase backend that falls back to a local store so it runs zero-config.',
        ...META.dresscode,
      },
      {
        title: 'Tsopouroglou — Χωματουργικά',
        tagline: 'A Halkidiki earthworks firm, working since 1987.',
        desc: 'The site of a family earthworks business in Halkidiki: excavations, plot clearing, cesspits and rock breaking, with the service areas and the machine fleet each given a page of their own. Published in Greek, English and Serbian — the three languages its customers actually call in — with a quote request and a phone number answered around the clock.',
        ...META.tsopouroglou,
      },
      {
        // renamed from "Apex Shift" — the old brand is gone
        title: 'Nova Shift',
        tagline: 'Shift intelligence for people who bill by the hour.',
        desc: 'A scheduling and earnings platform for individuals and teams — hours, rates, and complex rotations orchestrated in one place. Built radically personal: every field, rule, and view bends to its user.',
        ...META.shift,
      },
      {
        title: 'Surviving of Souls',
        tagline: 'A 2D survival expedition engine.',
        desc: 'A top-down survival game on a custom canvas engine — procedurally generated expeditions, resource economies, crafting and shelter systems in hostile pixel worlds.',
        ...META.sos,
      },
    ],
  },
  process: {
    label: 'How it runs',
    heading: 'Four steps. Something real at the end of each.',
    lede: 'No stage ends with a promise. Every one of them ends with a thing you can open, read or click.',
    cta: 'More about the studio',
    scrollHint: 'Scroll the stages',
    steps: [
      {
        title: 'Conversation',
        desc: 'Thirty minutes on what the business needs the site to do. No pitch deck, no jargon, no obligation.',
        deliverable: 'A written brief. One page, plain language, yours to keep whether or not we work together.',
      },
      {
        title: 'Scope and fixed price',
        desc: 'Everything that gets built, listed. The number does not move unless the scope does — and if the scope moves, you approve it first.',
        deliverable: 'A fixed price and a delivery date, in writing.',
      },
      {
        title: 'Design',
        desc: 'Layout and identity built around your real content — your text, your photos, your products. Never a template with your logo dropped in.',
        deliverable: 'Screens you can click through, before a line of production code exists.',
      },
      {
        title: 'Build and launch',
        desc: 'Engineered, not assembled. A live staging link from the first week, so you watch it fill in instead of waiting in the dark.',
        deliverable: 'A live site — with the code, the domain and every account in your name.',
      },
    ],
  },
  about: {
    label: 'About', // ported
    heading: 'Engineering, with intent.', // ported
    // ported
    p1: 'Every product here is built twice — once as a system, once as an experience. The discipline is refusing to compromise either.',
    // ported
    p2: 'From secure backend architecture to the easing curve of a single transition, nothing ships by default. The result is software that performs under load and feels inevitable in the hand.',
    // ported
    pillars: ['Systems Architecture', 'Interface Engineering', 'Data Design', 'Motion & Interaction'],
    trajectoryLabel: 'Trajectory', // ported
    trajectoryHeading: 'The road here.', // ported heading pointed at the dead brand
    jobs: [
      {
        role: 'Founder & Lead Engineer',
        company: 'NovaFaber',
        period: '2024 — Present',
        desc: 'Directing the studio: technical strategy, full-stack architecture, and production delivery for clients who need software that holds.',
      },
      {
        role: 'Senior Full-Stack Developer',
        company: 'Independent',
        period: '2021 — 2024',
        desc: 'Designed and shipped e-commerce platforms, payment integrations, and administrative systems for businesses across Europe.',
      },
      {
        role: 'Frontend Engineer',
        company: 'Digital Agency',
        period: '2018 — 2021',
        desc: 'Built interactive, accessible interfaces at agency pace — where craft met deadlines daily.',
      },
    ],
  },
  stack: {
    label: 'Instruments', // ported
    heading: 'The instrument set.', // ported
    lede: 'The tools are not the point, but you should know what your site is standing on.',
    // ported
    groups: [
      {
        title: 'Frontend Architecture',
        desc: 'Interfaces engineered for fluidity — real-time 3D included.',
        skills: ['React', 'Next.js', 'Three.js / R3F', 'GSAP', 'Tailwind'],
      },
      {
        title: 'Backend & Data',
        desc: 'Scalable logic, hardened databases, and APIs that stay fast under pressure.',
        skills: ['Node.js', 'PostgreSQL', 'Redis', 'Express', 'GraphQL'],
      },
      {
        title: 'DevOps & Cloud',
        desc: 'Infrastructure and pipelines for shipping continuously, without drama.',
        skills: ['AWS', 'Docker', 'Vercel', 'Linux', 'GitHub Actions'],
      },
      {
        title: 'Ecosystem',
        desc: 'The daily toolchain — versioned, tested, designed.',
        skills: ['Git', 'Figma', 'Jest', 'Vite', 'Webpack'],
      },
    ],
  },
  faq: {
    label: 'Straight answers',
    heading: 'The questions everyone asks first.',
    lede: 'Including the one about money.',
    items: [
      {
        q: 'What does a site cost?',
        // NOTE: cactusweb publishes "from €700 / from €2,000" here. Drop your
        // own numbers into this answer when you decide them — Question 8.
        a: 'It depends on three things: how many pages, how many languages, and whether anything has to be built rather than laid out. A brochure site for a local business and a storefront with payments and stock are different orders of magnitude. Tell me the scope and you get one fixed number before anything starts — not an hourly rate that drifts.',
      },
      {
        q: 'How long does it take?',
        a: 'A straightforward business site is usually two to four weeks from approved design. Commerce and custom platforms run longer, and the scope document says exactly how long before you commit.',
      },
      {
        q: 'Can I edit the content myself?',
        a: 'Yes, if you want it. Text, images and products can sit behind an admin panel you log into. Some clients would rather send me the changes — that works too, and it is cheaper to build.',
      },
      {
        q: 'Do you work in Greek and English?',
        a: 'Both, and more. A25 runs live in five languages. Multi-language is designed in from the start rather than bolted on, so adding a language later is a content job, not a rebuild.',
      },
      {
        q: 'What happens after launch?',
        a: 'A month of support is included — fixes, tweaks, anything that is not new scope. After that you can take it in-house, or keep me on a small monthly retainer for updates and monitoring. You own the code and the domain either way.',
      },
      {
        q: 'Can you take over a site someone else built?',
        a: 'Usually. Send me the URL and I will tell you honestly whether it is worth repairing or worth replacing — those are genuinely different answers and I will not pretend otherwise to win the bigger job.',
      },
    ],
  },
  contact: {
    label: 'Contact', // ported
    headingA: 'Make it', // ported
    headingB: 'inevitable.', // ported
    desc: 'If your product deserves more than a template, the inbox is open.', // ported
    emailLabel: 'Direct line', // ported
    form: {
      name: 'Your name',
      namePh: 'Giannis Papadopoulos',
      email: 'Email',
      emailPh: 'you@company.com',
      company: 'Company',
      companyPh: 'Optional',
      kind: 'What do you need?',
      kinds: ['A website', 'An online store', 'A redesign of an existing site', 'Custom software or a platform', 'Not sure yet'],
      budget: 'Budget range',
      budgets: ['Up to €1,500', '€1,500 — €5,000', '€5,000 — €10,000', 'Over €10,000', 'Tell me what it should cost'],
      message: 'The project',
      messagePh: 'What the business does, and what the site needs to do for it.',
      submit: 'Send it',
      sending: 'Opening your email…',
      note: 'The budget question is there so neither of us wastes an hour finding out we are in different rooms.',
      fallback: 'This opens your email app with the message filled in. If nothing happens, write to',
    },
  },
  testimonials: {
    label: 'Why they trusted us',
    heading: 'The people who went first.',
    lede: 'Four projects, four people who took the risk before there was a portfolio to point at.',
    draftBadge: 'Draft — awaiting approval',
    items: [
      {
        quote:
          'Five languages, live before the season started. The chat comes to my Telegram, so I answer candidates from the car.',
        name: '[client name]',
        role: '[role]',
        company: 'A25 — The Agency',
        project: 'a25.mk',
        slug: 'a25',
        approved: false,
      },
      {
        quote:
          'I have published four articles since launch without emailing anyone about it. That was the part I did not believe would work.',
        name: '[client name]',
        role: '[role]',
        company: 'KD Law — Клинче и Димовски',
        project: 'dklaw',
        slug: 'kd-law',
        approved: false,
      },
      {
        quote:
          'Everyone mentions the 3D viewer. The thing that mattered was stock per size — I had been refunding people for shoes I did not have.',
        name: '[name]',
        role: '[role]',
        company: 'Sneaker Air',
        project: 'sneaker-air',
        slug: 'dress-code',
        approved: false,
      },
      {
        quote:
          'Three rates, tracked in a notebook. Now the accountant gets a file.',
        name: '[name]',
        role: '[role]',
        company: 'Nova Shift',
        project: 'nova-shift',
        slug: 'nova-shift',
        approved: false,
      },
    ],
  },
  blog: {
    label: 'Notes',
    heading: 'The questions that come up every time.',
    lede: 'Written down properly, so the answer is the same whether you ask me on a Tuesday or read it at midnight.',
    cta: 'All notes',
    readMore: 'Read',
    all: 'Read all notes',
  },
  chosen: {
    label: 'Why they chose us',
    heading: 'Four businesses picked a studio over an agency.',
    desc: 'A fixed price before anything starts, the code and the domain in your name, and a live link from the first week.',
    primary: 'Book a call',
    secondary: 'See the work',
  },
  ctaBand: {
    eyebrow: 'Next step',
    heading: 'Have a project waiting?',
    desc: 'Thirty minutes, no pitch deck. You leave with a written brief whether or not we work together.',
    primary: 'Book a call',
    secondary: 'Send a message',
  },
  routes: {
    services: {
      eyebrow: 'Services',
      title: 'Everything a modern studio should carry.',
      lede: 'Three disciplines, one team, one invoice. Development is the one with four platforms in production behind it — the other two exist because a site that nobody finds, or nobody trusts, is not finished work.',
    },
    work: {
      eyebrow: 'Our work',
      title: 'Built. Shipped. Live.',
      lede: 'Every project below is online right now, serving real users. Open them and judge for yourself.',
    },
    process: {
      eyebrow: 'How it runs',
      title: 'Four steps. Something real at the end of each.',
      lede: 'The whole process, written out — what happens, what you receive, and what it costs you if you walk away at any stage.',
    },
    about: {
      eyebrow: 'The studio',
      title: 'Engineering, with intent.',
      lede: 'One engineer, four production platforms, and a refusal to ship anything by default.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Make it inevitable.',
      lede: 'Tell me what the business does and what the site needs to do for it. The budget question is there so neither of us wastes an hour.',
    },
    book: {
      eyebrow: 'Book a call',
      title: 'Thirty minutes, no obligation.',
      lede: 'A conversation about what you need — not a sales call. You leave with a one-page brief you can take to anyone.',
    },
    blog: {
      eyebrow: 'Notes',
      title: 'Straight answers, written down.',
      lede: 'The questions that come up in every first call, answered properly instead of over the phone each time.',
    },
  },
  footer: {
    tagline: 'Software with the precision of engineering and the presence of cinema.',
    note: 'Designed & engineered in-house.', // ported
    rights: 'All rights reserved.',
    socialsLabel: 'Elsewhere',
    navLabel: 'Index',
    servicesLabel: 'Services',
    studioLabel: 'Studio',
    studioLinks: [
      { label: 'About', href: '/about' },
      { label: 'How it runs', href: '/process' },
      { label: 'Notes', href: '/blog' },
      { label: 'Book a call', href: '/book-a-call' },
    ],
    contact: {
      eyebrow: 'Contact',
      heading: 'Get in touch',
      lede: 'Tell me what the business does. The reply comes from the person who would build it.',
      email: { title: 'Email', desc: 'Straight to the person writing the code.' },
      social: { title: 'Instagram', desc: 'A DM works just as well as an email.' },
      phone: { title: 'Phone', desc: 'Mon–Fri, 9:00 to 18:00.' },
      mapLabel: 'NovaFaber works out of Thessaloniki, Greece',
    },
  },
};

/* ------------------------------------------------------------------ */
/* ΕΛΛΗΝΙΚΑ                                                            */
/* ------------------------------------------------------------------ */

const el: SiteContent = {
  meta: {
    title: 'NovaFaber — Ιστοσελίδες, e-shop και custom λογισμικό',
    description:
      'Ανεξάρτητο ψηφιακό στούντιο. Ιστοσελίδες, συστήματα e-commerce και custom πλατφόρμες, κατασκευασμένα από άκρη σε άκρη.',
  },
  nav: {
    links: [
      { label: 'Έργα', href: '/work' },
      { label: 'Υπηρεσίες', href: '/services' },
      { label: 'Διαδικασία', href: '/process' },
      { label: 'Σχετικά', href: '/about' },
      { label: 'Επικοινωνία', href: '/contact' },
    ],
    book: 'Κλείστε κλήση',
    menu: 'Μενού',
    close: 'Κλείσιμο',
    language: 'Γλώσσα',
    skip: 'Μετάβαση στο περιεχόμενο',
  },
  theme: {
    dark: 'Σκούρο',
    light: 'Φωτεινό',
    toDark: 'Εναλλαγή σε σκούρο θέμα',
    toLight: 'Εναλλαγή σε φωτεινό θέμα',
  },
  hero: {
    status: 'Ανεξάρτητο ψηφιακό στούντιο', // ported
    headA: 'Χτισμένο από',
    headB: 'το μηδέν.',
    // ported verbatim
    tagline: 'Λογισμικό με την ακρίβεια της μηχανικής και την αίσθηση του κινηματογράφου.',
    // ported, brand name substituted
    desc: 'Η NovaFaber σχεδιάζει και κατασκευάζει ψηφιακά προϊόντα από άκρη σε άκρη — από την αρχιτεκτονική του συστήματος μέχρι το τελευταίο καρέ της κίνησης. Τίποτα έτοιμο. Τίποτα τυχαίο.',
    ctaWork: 'Δείτε τη δουλειά', // ported
    ctaTalk: 'Ας μιλήσουμε', // ported
    scroll: 'Κύλιση',
    stats: [
      { value: '5', label: 'Πλατφόρμες σε παραγωγή' },
      { value: '5', label: 'Γλώσσες live' },
      { value: '100%', label: 'Γραμμένο, όχι έτοιμο' },
    ],
  },
  // ported
  marquee: [
    'FULL-STACK ENGINEERING',
    'ΣΧΕΔΙΑΣΜΟΣ ΔΙΕΠΑΦΩΝ',
    'ΣΥΣΤΗΜΑΤΑ E-COMMERCE',
    'REAL-TIME ΕΜΠΕΙΡΙΕΣ',
    'CREATIVE DEVELOPMENT',
    'ΕΠΙΔΟΣΕΙΣ',
  ],
  services: {
    label: 'Δυνατότητες', // ported
    heading: 'Τι κάνει το στούντιο.', // ported
    lede: 'Τρία αντικείμενα κάτω από την ίδια στέγη. Τα περισσότερα έργα χρειάζονται δύο ταυτόχρονα — γι’ αυτό δεν είναι τρία διαφορετικά τιμολόγια.',
    expand: 'Τι παίρνετε',
    cta: 'Όλες οι υπηρεσίες',
    // Πρώτο το Development: είναι ο πυλώνας που αποδεικνύει το portfolio.
    pillars: [
      {
        title: 'Development',
        desc: 'Το κομμάτι με τις αποδείξεις — πέντε πλατφόρμες σε παραγωγή, η μία τρέχει αδειοδοτημένο γραφείο σε πέντε γλώσσες.',
        items: [
          'Κατασκευή ιστοσελίδων',
          'Κατασκευή E-Shop',
          'Custom εφαρμογές',
          'Shopify',
          'Υπηρεσίες χονδρικής / B2B',
          'Φιλοξενία & κατοχύρωση domain',
          'Υποστήριξη ιστοσελίδων',
        ],
      },
      {
        title: 'Design',
        desc: 'Διεπαφή, ταυτότητα και κίνηση σχεδιασμένα ως ένα σύστημα, με αφετηρία το περιεχόμενό σας και όχι ένα template.',
        items: [
          'Σχεδιασμός UI / UX',
          'Εταιρική ταυτότητα',
          'Σχεδιασμός καταστήματος',
          'Design systems',
          'Κίνηση & αλληλεπίδραση',
        ],
      },
      {
        title: 'Digital Marketing',
        desc: 'Να έρθει η επισκεψιμότητα και να γίνει παραγγελία. Με μέτρηση, όχι με εικασίες.',
        items: [
          'SEO',
          'Καμπάνιες Google Ads',
          'Google Shopping Ads',
          'Email marketing',
          'CRO',
          'Google Analytics',
          'Υπολογιστής κέρδους αύξησης CR',
        ],
      },
    ],
    items: [
      {
        // ported
        title: 'Full-Stack Πλατφόρμες',
        desc: 'Ολοκληρωμένη κατασκευή προϊόντων — ανθεκτική αρχιτεκτονική, καθαρά APIs και frontends ρυθμισμένα στο χιλιοστό του δευτερολέπτου.',
        points: [
          'Εταιρικές ιστοσελίδες και πολυσέλιδα site',
          'Custom λογική, όχι στοίβα από plugins',
          'Πολυγλωσσικό από το πρώτο commit',
          'Hosting, domain και δημοσίευση από εμάς',
        ],
      },
      {
        // ported
        title: 'Συστήματα E-Commerce',
        desc: 'Καταστήματα σχεδιασμένα για μετατροπές: ασφαλείς ροές πληρωμών, ζωντανές βάσεις προϊόντων και διαδρομή αγοράς χωρίς καμία τριβή.',
        points: [
          'Πληρωμές με κάρτα και αντικαταβολή',
          'Απόθεμα ανά παραλλαγή και διαχείριση παραγγελιών',
          'Admin panel που το προσωπικό σας μπορεί όντως να χρησιμοποιήσει',
          'Το checkout μετριέται και ρυθμίζεται, δεν το υποθέτουμε',
        ],
      },
      {
        // ported
        title: 'Εσωτερικά Εργαλεία',
        desc: 'Custom dashboards και λειτουργικά συστήματα που κάνουν τα σύνθετα δεδομένα ευανάγνωστα, γρήγορα και ασφαλή στη χρήση.',
        points: [
          'Συστήματα κρατήσεων, ραντεβού και βαρδιών',
          'Πρόσβαση ανά ρόλο για ομάδες',
          'Εξαγωγές στις μορφές που ζητάει ο λογιστής σας',
          'Αντικαθιστά το excel που κρατάει την επιχείρηση όρθια',
        ],
      },
      {
        // ported
        title: 'Δεδομένα & Ασφάλεια',
        desc: 'Αρχιτεκτονική βάσεων φτιαγμένη για κλιμάκωση, με το απόρρητο και την ασφάλεια ως σχεδιαστικές αρχές — ποτέ ως δεύτερη σκέψη.',
        points: [
          'Σχεδιασμός βάσης για την επόμενη τριετία',
          'Διαχείριση δεδομένων με GDPR στο μυαλό',
          'Backup και επαναφορά που έχουν δοκιμαστεί',
          'Ποτέ κωδικοί στο frontend',
        ],
      },
      {
        // ported
        title: 'Συστήματα Εμπειρίας',
        desc: 'Διεπαφές όπου ιεραρχία, κίνηση και αλληλεπίδραση σχεδιάζονται ως ένα ενιαίο σύστημα — όχι ως διακόσμηση εκ των υστέρων.',
        points: [
          'Σχεδιασμός που ξεκινά από το περιεχόμενο, όχι από template',
          'Real-time 3D και WebGL όπου αξίζει το βάρος του',
          'Γρήγορο σε μεσαίο κινητό με δεδομένα',
          'Προσβάσιμη αντίθεση, focus και πλοήγηση με πληκτρολόγιο',
        ],
      },
    ],
  },
  work: {
    label: 'Επιλεγμένα έργα', // ported
    heading: 'Χτισμένα. Παραδομένα. Live.', // ported
    lede: 'Όλα είναι online αυτή τη στιγμή. Ανοίξτε τα.',
    cta: 'Δείτε το live', // ported: 'Ζωντανή προεπισκόπηση'
    featuresLabel: 'Τι κάνει',
    stackLabel: 'Κατασκευασμένο με',
    labLabel: 'Lab',
    labNote: 'Δεν είναι δουλειά για πελάτη — εδώ γράφεται η μηχανή από το μηδέν.',
    embargoLabel: 'Έρχεται σύντομα',
    embargoNote: 'Έτοιμο και εγκεκριμένο. Κλειδωμένο μέχρι ο πελάτης να ανοίξει τις πόρτες.',
    projects: [
      {
        title: 'A25 — The Agency',
        tagline: 'Πλατφόρμα παραγωγής για αδειοδοτημένο γραφείο εύρεσης προσωπικού.',
        desc: 'Η ζωντανή, πεντάγλωσση πλατφόρμα της A25 — ενός αδειοδοτημένου γραφείου που συνδέει επιχειρήσεις της Βόρειας Μακεδονίας με πιστοποιημένο εργατικό δυναμικό από την Ασία. Ροές αιτήσεων για εργοδότες και υποψηφίους, custom live chat με απαντήσεις μέσω Telegram και αυτοματοποιημένα email. Σε παραγωγή στο a25.mk.',
        ...META.a25,
      },
      {
        title: 'KD Law — Клинче и Димовски',
        tagline: 'Δικηγορικό γραφείο στα Σκόπια, online χωρίς stock φωτογραφίες.',
        desc: 'Δίγλωσσο site για δικηγορικό γραφείο στα Σκόπια: έξι τομείς δικαίου, προφίλ εταίρων και ομάδας, και αίτημα ραντεβού που καταλήγει σε πραγματική κράτηση αντί για ένα ακόμη email. Τα άρθρα γράφονται και δημοσιεύονται μέσα από in-house composer, ώστε το γραφείο να δημοσιεύει χωρίς να περιμένει προγραμματιστή.',
        ...META.dklaw,
      },
      {
        title: 'Dress Code',
        tagline: 'Βιτρίνα luxury μόδας, φτιαγμένη από άκρη σε άκρη.',
        desc: 'Premium fashion commerce από άκρη σε άκρη: κατάλογος χωρισμένος σε κατηγορίες με ζωντανή καταμέτρηση προϊόντων, checkout μέσω Stripe και αντικαταβολής, και inventory ανά νούμερο που μένει σωστό. Ένα πλήρες admin panel — έλεγχος προϊόντων, παραγγελιών και καμπανιών πίσω από πολυεπίπεδο auth — πάνω σε Supabase backend που πέφτει σε τοπικό store ώστε να τρέχει zero-config.',
        ...META.dresscode,
      },
      {
        title: 'Τσοπούρογλου — Χωματουργικά',
        tagline: 'Χωματουργικά στη Χαλκιδική, από το 1987.',
        desc: 'Το site μιας οικογενειακής χωματουργικής επιχείρησης στη Χαλκιδική: εκσκαφές, καθαρισμοί οικοπέδων, βόθροι και εκβραχισμοί, με τις περιοχές εξυπηρέτησης και τον στόλο μηχανημάτων να έχουν η καθεμία τη δική της σελίδα. Δημοσιευμένο στα ελληνικά, τα αγγλικά και τα σερβικά — τις τρεις γλώσσες στις οποίες όντως τηλεφωνούν οι πελάτες του — με αίτημα προσφοράς και τηλέφωνο που απαντά όλο το εικοσιτετράωρο.',
        ...META.tsopouroglou,
      },
      {
        // μετονομάστηκε από «Apex Shift» — το παλιό brand έφυγε
        title: 'Nova Shift',
        tagline: 'Ευφυΐα βαρδιών για όσους χρεώνουν με την ώρα.',
        desc: 'Πλατφόρμα προγραμματισμού και υπολογισμού εσόδων για άτομα και ομάδες — ώρες, αμοιβές και σύνθετες ροτάσιες, ενορχηστρωμένες σε ένα μέρος. Ριζικά προσωπική: κάθε πεδίο, κανόνας και προβολή προσαρμόζεται στον χρήστη της.',
        ...META.shift,
      },
      {
        title: 'Surviving of Souls',
        tagline: 'Μια 2D μηχανή επιβίωσης και αποστολών.',
        desc: 'Top-down παιχνίδι επιβίωσης σε custom canvas engine — διαδικαστικά παραγόμενες αποστολές, οικονομίες πόρων, crafting και συστήματα καταφυγίου σε εχθρικούς pixel κόσμους.',
        ...META.sos,
      },
    ],
  },
  process: {
    label: 'Η προσέγγισή μας',
    heading: 'Τέσσερα βήματα. Κάτι πραγματικό στο τέλος του καθενός.',
    lede: 'Κανένα στάδιο δεν τελειώνει με υπόσχεση. Το καθένα τελειώνει με κάτι που μπορείτε να ανοίξετε, να διαβάσετε ή να πατήσετε.',
    cta: 'Περισσότερα για το στούντιο',
    scrollHint: 'Κυλήστε τα στάδια',
    steps: [
      {
        title: 'Κουβέντα',
        desc: 'Μισή ώρα για το τι χρειάζεται η επιχείρηση να κάνει το site. Χωρίς παρουσιάσεις, χωρίς ορολογία, χωρίς δέσμευση.',
        deliverable: 'Ένα γραπτό brief. Μία σελίδα, σε απλά ελληνικά, δικό σας είτε συνεργαστούμε είτε όχι.',
      },
      {
        title: 'Πλάνο και σταθερή τιμή',
        desc: 'Ό,τι κατασκευάζεται, γραμμένο. Ο αριθμός δεν κουνιέται αν δεν κουνηθεί το πλάνο — κι αν κουνηθεί, το εγκρίνετε πρώτοι εσείς.',
        deliverable: 'Σταθερή τιμή και ημερομηνία παράδοσης, γραπτώς.',
      },
      {
        title: 'Σχεδιασμός',
        desc: 'Διάταξη και ταυτότητα πάνω στο πραγματικό σας περιεχόμενο — τα κείμενά σας, τις φωτογραφίες σας, τα προϊόντα σας. Ποτέ template με το λογότυπό σας πάνω.',
        deliverable: 'Οθόνες που μπορείτε να πατήσετε, πριν υπάρξει γραμμή κώδικα παραγωγής.',
      },
      {
        title: 'Κατασκευή και παράδοση',
        desc: 'Κατασκευάζεται, δεν συναρμολογείται. Ζωντανό link από την πρώτη βδομάδα, ώστε να το βλέπετε να γεμίζει αντί να περιμένετε στο σκοτάδι.',
        deliverable: 'Ζωντανό site — με τον κώδικα, το domain και κάθε λογαριασμό στο όνομά σας.',
      },
    ],
  },
  about: {
    label: 'Σχετικά', // ported
    heading: 'Μηχανική, με πρόθεση.', // ported
    // ported
    p1: 'Κάθε προϊόν εδώ χτίζεται δύο φορές — μία ως σύστημα, μία ως εμπειρία. Η πειθαρχία είναι να μη θυσιάζεται κανένα από τα δύο.',
    // ported
    p2: 'Από την ασφαλή backend αρχιτεκτονική μέχρι την καμπύλη μιας και μόνο μετάβασης, τίποτα δεν φεύγει «όπως ήρθε». Το αποτέλεσμα: λογισμικό που αντέχει υπό φορτίο και μοιάζει αναπόφευκτο στο χέρι.',
    // ported
    pillars: ['Αρχιτεκτονική Συστημάτων', 'Interface Engineering', 'Σχεδιασμός Δεδομένων', 'Κίνηση & Αλληλεπίδραση'],
    trajectoryLabel: 'Πορεία', // ported
    trajectoryHeading: 'Ο δρόμος μέχρι εδώ.', // ported heading pointed at the dead brand
    jobs: [
      {
        role: 'Ιδρυτής & Lead Engineer',
        company: 'NovaFaber',
        period: '2024 — Σήμερα',
        desc: 'Διεύθυνση του στούντιο: τεχνική στρατηγική, full-stack αρχιτεκτονική και παράδοση σε παραγωγή, για πελάτες που χρειάζονται λογισμικό που αντέχει.',
      },
      {
        role: 'Senior Full-Stack Developer',
        company: 'Ανεξάρτητος',
        period: '2021 — 2024',
        desc: 'Σχεδιασμός και παράδοση πλατφορμών e-commerce, ενσωματώσεων πληρωμών και διαχειριστικών συστημάτων για επιχειρήσεις σε όλη την Ευρώπη.',
      },
      {
        role: 'Frontend Engineer',
        company: 'Digital Agency',
        period: '2018 — 2021',
        desc: 'Κατασκευή διαδραστικών, προσβάσιμων διεπαφών σε ρυθμούς agency — εκεί όπου η λεπτομέρεια συναντούσε καθημερινά τις προθεσμίες.',
      },
    ],
  },
  stack: {
    label: 'Όργανα', // ported
    heading: 'Τα εργαλεία της δουλειάς.', // ported
    lede: 'Τα εργαλεία δεν είναι το ζητούμενο, αλλά αξίζει να ξέρετε πάνω σε τι στέκεται το site σας.',
    // ported
    groups: [
      {
        title: 'Frontend Αρχιτεκτονική',
        desc: 'Διεπαφές κατασκευασμένες για ρευστότητα — μαζί με real-time 3D.',
        skills: ['React', 'Next.js', 'Three.js / R3F', 'GSAP', 'Tailwind'],
      },
      {
        title: 'Backend & Δεδομένα',
        desc: 'Κλιμακούμενη λογική, θωρακισμένες βάσεις και APIs που μένουν γρήγορα υπό πίεση.',
        skills: ['Node.js', 'PostgreSQL', 'Redis', 'Express', 'GraphQL'],
      },
      {
        title: 'DevOps & Cloud',
        desc: 'Υποδομές και pipelines για συνεχή παράδοση, χωρίς δράματα.',
        skills: ['AWS', 'Docker', 'Vercel', 'Linux', 'GitHub Actions'],
      },
      {
        title: 'Οικοσύστημα',
        desc: 'Η καθημερινή εργαλειοθήκη — versioned, tested, σχεδιασμένη.',
        skills: ['Git', 'Figma', 'Jest', 'Vite', 'Webpack'],
      },
    ],
  },
  faq: {
    label: 'Καθαρές απαντήσεις',
    heading: 'Οι ερωτήσεις που έρχονται πρώτες.',
    lede: 'Μαζί με αυτή για τα λεφτά.',
    items: [
      {
        q: 'Πόσο κοστίζει ένα site;',
        // NOTE: cactusweb publishes "from €700 / from €2,000" here. Drop your
        // own numbers into this answer when you decide them — Question 8.
        a: 'Εξαρτάται από τρία πράγματα: πόσες σελίδες, πόσες γλώσσες, και αν κάτι πρέπει να κατασκευαστεί αντί απλώς να στηθεί. Ένα site παρουσίασης για τοπική επιχείρηση και ένα κατάστημα με πληρωμές και απόθεμα είναι άλλης τάξης μεγέθους. Πείτε μου το πλάνο και παίρνετε έναν σταθερό αριθμό πριν ξεκινήσει οτιδήποτε — όχι χρέωση με την ώρα που τρέχει.',
      },
      {
        q: 'Πόσο χρόνο θέλει;',
        a: 'Ένα κανονικό εταιρικό site είναι συνήθως δύο έως τέσσερις εβδομάδες από την έγκριση του σχεδιασμού. Τα e-shop και οι custom πλατφόρμες θέλουν περισσότερο, και το πλάνο λέει ακριβώς πόσο πριν δεσμευτείτε.',
      },
      {
        q: 'Μπορώ να αλλάζω μόνος μου το περιεχόμενο;',
        a: 'Ναι, αν το θέλετε. Κείμενα, φωτογραφίες και προϊόντα μπορούν να μπουν πίσω από ένα admin panel στο οποίο συνδέεστε. Κάποιοι πελάτες προτιμούν να μου στέλνουν τις αλλαγές — δουλεύει κι αυτό, και κοστίζει λιγότερο στην κατασκευή.',
      },
      {
        q: 'Δουλεύετε σε ελληνικά και αγγλικά;',
        a: 'Και στα δύο, και σε περισσότερα. Το A25 τρέχει live σε πέντε γλώσσες. Η πολυγλωσσία σχεδιάζεται από την αρχή αντί να προστίθεται μετά, οπότε μια νέα γλώσσα αργότερα είναι δουλειά περιεχομένου, όχι ξαναχτίσιμο.',
      },
      {
        q: 'Τι γίνεται μετά την παράδοση;',
        a: 'Ένας μήνας υποστήριξης είναι μέσα — διορθώσεις, μικροαλλαγές, ό,τι δεν είναι νέα δουλειά. Μετά, το παίρνετε εσωτερικά ή με κρατάτε με ένα μικρό μηνιαίο για ενημερώσεις και παρακολούθηση. Ο κώδικας και το domain είναι δικά σας ούτως ή άλλως.',
      },
      {
        q: 'Αναλαμβάνετε site που έφτιαξε άλλος;',
        a: 'Συνήθως ναι. Στείλτε μου το URL και θα σας πω ειλικρινά αν αξίζει να επισκευαστεί ή να αντικατασταθεί — είναι πραγματικά διαφορετικές απαντήσεις και δεν θα προσποιηθώ το αντίθετο για να πάρω τη μεγαλύτερη δουλειά.',
      },
    ],
  },
  contact: {
    label: 'Επικοινωνία', // ported
    headingA: 'Κάντε το', // ported
    headingB: 'αναπόφευκτο.', // ported
    desc: 'Αν το προϊόν σας αξίζει κάτι παραπάνω από ένα template, το inbox είναι ανοιχτό.', // ported
    emailLabel: 'Απευθείας γραμμή', // ported
    form: {
      name: 'Το όνομά σας',
      namePh: 'Γιάννης Παπαδόπουλος',
      email: 'Email',
      emailPh: 'you@company.com',
      company: 'Επιχείρηση',
      companyPh: 'Προαιρετικό',
      kind: 'Τι χρειάζεστε;',
      kinds: ['Ιστοσελίδα', 'Ηλεκτρονικό κατάστημα', 'Ανασχεδιασμό υπάρχοντος site', 'Custom λογισμικό ή πλατφόρμα', 'Δεν είμαι σίγουρος ακόμα'],
      budget: 'Προϋπολογισμός',
      budgets: ['Έως €1.500', '€1.500 — €5.000', '€5.000 — €10.000', 'Πάνω από €10.000', 'Πείτε μου εσείς τι κοστίζει'],
      message: 'Το έργο',
      messagePh: 'Τι κάνει η επιχείρηση, και τι πρέπει να κάνει το site γι’ αυτήν.',
      submit: 'Στείλτε το',
      sending: 'Ανοίγει το email σας…',
      note: 'Η ερώτηση για τον προϋπολογισμό υπάρχει ώστε να μη χάσει κανείς μας μια ώρα για να ανακαλύψει ότι είμαστε σε διαφορετικά δωμάτια.',
      fallback: 'Αυτό ανοίγει την εφαρμογή email σας με το μήνυμα συμπληρωμένο. Αν δεν γίνει τίποτα, γράψτε στο',
    },
  },
  testimonials: {
    label: 'Γιατί μας εμπιστεύτηκαν',
    heading: 'Αυτοί που το ρίσκαραν πρώτοι.',
    lede: 'Τέσσερα έργα, τέσσερις άνθρωποι που είπαν ναι πριν υπάρξει portfolio για να δείξουμε.',
    draftBadge: 'Πρόχειρο — εκκρεμεί έγκριση',
    items: [
      {
        quote:
          'Πέντε γλώσσες, live πριν αρχίσει η σεζόν. Το chat έρχεται στο Telegram μου, οπότε απαντάω στους υποψηφίους από το αυτοκίνητο.',
        name: '[όνομα πελάτη]',
        role: '[ιδιότητα]',
        company: 'A25 — The Agency',
        project: 'a25.mk',
        slug: 'a25',
        approved: false,
      },
      {
        quote:
          'Έχω ανεβάσει τέσσερα άρθρα από την παράδοση χωρίς να στείλω email σε κανέναν. Αυτό ήταν που δεν πίστευα ότι θα δουλέψει.',
        name: '[όνομα πελάτη]',
        role: '[ιδιότητα]',
        company: 'KD Law — Клинче и Димовски',
        project: 'dklaw',
        slug: 'kd-law',
        approved: false,
      },
      {
        quote:
          'Όλοι σχολιάζουν τον 3D viewer. Αυτό που μετρούσε ήταν το απόθεμα ανά νούμερο — έκανα επιστροφές για παπούτσια που δεν είχα.',
        name: '[όνομα]',
        role: '[ιδιότητα]',
        company: 'Sneaker Air',
        project: 'sneaker-air',
        slug: 'dress-code',
        approved: false,
      },
      {
        quote:
          'Τρεις τιμές, σε ένα τετράδιο. Τώρα ο λογιστής παίρνει ένα αρχείο.',
        name: '[όνομα]',
        role: '[ιδιότητα]',
        company: 'Nova Shift',
        project: 'nova-shift',
        slug: 'nova-shift',
        approved: false,
      },
    ],
  },
  blog: {
    label: 'Σημειώσεις',
    heading: 'Οι ερωτήσεις που έρχονται κάθε φορά.',
    lede: 'Γραμμένες σωστά, ώστε η απάντηση να είναι η ίδια είτε με ρωτήσετε Τρίτη είτε τη διαβάσετε μεσάνυχτα.',
    cta: 'Όλες οι σημειώσεις',
    readMore: 'Διαβάστε',
    all: 'Διαβάστε όλες τις σημειώσεις',
  },
  chosen: {
    label: 'Γιατί μας επέλεξαν',
    heading: 'Τέσσερις επιχειρήσεις προτίμησαν στούντιο αντί για agency.',
    desc: 'Σταθερή τιμή πριν ξεκινήσει οτιδήποτε, ο κώδικας και το domain στο όνομά σας, και ζωντανό link από την πρώτη βδομάδα.',
    primary: 'Κλείστε κλήση',
    secondary: 'Δείτε τη δουλειά',
  },
  ctaBand: {
    eyebrow: 'Επόμενο βήμα',
    heading: 'Έχετε ένα έργο που περιμένει;',
    desc: 'Μισή ώρα, χωρίς παρουσιάσεις. Φεύγετε με γραπτό brief είτε συνεργαστούμε είτε όχι.',
    primary: 'Κλείστε κλήση',
    secondary: 'Στείλτε μήνυμα',
  },
  routes: {
    services: {
      eyebrow: 'Υπηρεσίες',
      title: 'Ό,τι πρέπει να έχει ένα σύγχρονο στούντιο.',
      lede: 'Τρία αντικείμενα, μία ομάδα, ένα τιμολόγιο. Το Development είναι αυτό με τέσσερις πλατφόρμες σε παραγωγή από πίσω — τα άλλα δύο υπάρχουν επειδή ένα site που δεν το βρίσκει ή δεν το εμπιστεύεται κανείς, δεν είναι τελειωμένη δουλειά.',
    },
    work: {
      eyebrow: 'Τα έργα μας',
      title: 'Χτισμένα. Παραδομένα. Live.',
      lede: 'Κάθε έργο παρακάτω είναι online αυτή τη στιγμή, με πραγματικούς χρήστες. Ανοίξτε τα και κρίνετε μόνοι σας.',
    },
    process: {
      eyebrow: 'Η προσέγγισή μας',
      title: 'Τέσσερα βήματα. Κάτι πραγματικό στο τέλος του καθενός.',
      lede: 'Όλη η διαδικασία, γραμμένη — τι γίνεται, τι παραλαμβάνετε, και τι σας κοστίζει αν φύγετε σε οποιοδήποτε στάδιο.',
    },
    about: {
      eyebrow: 'Το στούντιο',
      title: 'Μηχανική, με πρόθεση.',
      lede: 'Ένας μηχανικός, τέσσερις πλατφόρμες σε παραγωγή, και η άρνηση να φύγει οτιδήποτε «όπως ήρθε».',
    },
    contact: {
      eyebrow: 'Επικοινωνία',
      title: 'Κάντε το αναπόφευκτο.',
      lede: 'Πείτε μου τι κάνει η επιχείρηση και τι πρέπει να κάνει το site γι’ αυτήν. Η ερώτηση για τον προϋπολογισμό υπάρχει για να μη χάσει κανείς μας μια ώρα.',
    },
    book: {
      eyebrow: 'Κλείστε κλήση',
      title: 'Μισή ώρα, χωρίς δέσμευση.',
      lede: 'Μια κουβέντα για το τι χρειάζεστε — όχι τηλεφωνική πώληση. Φεύγετε με ένα μονοσέλιδο brief που μπορείτε να πάτε σε οποιονδήποτε.',
    },
    blog: {
      eyebrow: 'Σημειώσεις',
      title: 'Καθαρές απαντήσεις, γραμμένες.',
      lede: 'Οι ερωτήσεις που έρχονται σε κάθε πρώτη κουβέντα, απαντημένες σωστά αντί για κάθε φορά στο τηλέφωνο.',
    },
  },
  footer: {
    tagline: 'Λογισμικό με την ακρίβεια της μηχανικής και την αίσθηση του κινηματογράφου.',
    note: 'Σχεδιασμένο & κατασκευασμένο in-house.', // ported
    rights: 'Με επιφύλαξη παντός δικαιώματος.',
    socialsLabel: 'Αλλού',
    navLabel: 'Ευρετήριο',
    servicesLabel: 'Υπηρεσίες',
    studioLabel: 'Στούντιο',
    studioLinks: [
      { label: 'Σχετικά', href: '/about' },
      { label: 'Η προσέγγισή μας', href: '/process' },
      { label: 'Σημειώσεις', href: '/blog' },
      { label: 'Κλείστε κλήση', href: '/book-a-call' },
    ],
    contact: {
      eyebrow: 'Επικοινωνία',
      heading: 'Ας μιλήσουμε',
      lede: 'Πείτε μου τι κάνει η επιχείρηση. Απαντά ο άνθρωπος που θα το κατασκευάσει.',
      email: { title: 'Email', desc: 'Απευθείας σε αυτόν που γράφει τον κώδικα.' },
      social: { title: 'Instagram', desc: 'Ένα DM δουλεύει το ίδιο καλά με ένα email.' },
      phone: { title: 'Τηλέφωνο', desc: 'Δευτέρα–Παρασκευή, 9:00 έως 18:00.' },
      mapLabel: 'Η NovaFaber δουλεύει από τη Θεσσαλονίκη',
    },
  },
};

/* ------------------------------------------------------------------ */
/* МАКЕДОНСКИ                                                          */
/* ------------------------------------------------------------------ */

const mk: SiteContent = {
  meta: {
    title: 'NovaFaber — Веб-страници, онлајн продавници и custom софтвер',
    description:
      'Независно дигитално студио. Веб-страници, системи за е-трговија и custom платформи, изградени од крај до крај. Во продукција за вистински клиенти.',
  },
  nav: {
    links: [
      { label: 'Проекти', href: '/work' },
      { label: 'Услуги', href: '/services' },
      { label: 'Процес', href: '/process' },
      { label: 'За нас', href: '/about' },
      { label: 'Контакт', href: '/contact' },
    ],
    book: 'Закажете разговор',
    menu: 'Мени',
    close: 'Затвори',
    language: 'Јазик',
    skip: 'Оди на содржината',
  },
  theme: {
    dark: 'Темно',
    light: 'Светло',
    toDark: 'Префрли на темна тема',
    toLight: 'Префрли на светла тема',
  },
  hero: {
    status: 'Независно дигитално студио',
    headA: 'Изградено од',
    headB: 'нула.',
    tagline: 'Софтвер со прецизноста на инженерството и присуството на филмот.',
    desc: 'NovaFaber дизајнира и гради дигитални производи од крај до крај — од архитектурата на системот до последниот кадар од движењето. Ништо шаблонско. Ништо случајно.',
    ctaWork: 'Погледнете ја работата',
    ctaTalk: 'Започнете разговор',
    scroll: 'Скролајте',
    stats: [
      { value: '5', label: 'Испорачани платформи' },
      { value: '5', label: 'Јазици во живо' },
      { value: '100%', label: 'Пишано, не шаблон' },
    ],
  },
  marquee: [
    'FULL-STACK ENGINEERING',
    'ДИЗАЈН НА ИНТЕРФЕЈСИ',
    'СИСТЕМИ ЗА Е-ТРГОВИЈА',
    'REAL-TIME ИСКУСТВА',
    'CREATIVE DEVELOPMENT',
    'ПЕРФОРМАНСИ',
  ],
  services: {
    label: 'Можности',
    heading: 'Што работи студиото.',
    lede: 'Три дисциплини под еден покрив. Повеќето проекти бараат две од нив одеднаш, и токму затоа не се три различни фактури.',
    expand: 'Што добивате',
    cta: 'Сите услуги',
    pillars: [
      {
        title: 'Development',
        desc: 'Делот со доказите — пет платформи во продукција, една од нив води лиценцирана агенција на пет јазици.',
        items: [
          'Изработка на веб-страници',
          'Изработка на E-Shop',
          'Custom апликации',
          'Shopify',
          'Големопродажба / B2B портали',
          'Хостинг и домен',
          'Поддршка на страници',
        ],
      },
      {
        title: 'Design',
        desc: 'Интерфејс, идентитет и движење дизајнирани како еден систем, тргнувајќи од вашата содржина наместо од шаблон.',
        items: [
          'UI / UX дизајн',
          'Бренд идентитет',
          'Дизајн на продавница',
          'Дизајн системи',
          'Движење и интеракција',
        ],
      },
      {
        title: 'Digital Marketing',
        desc: 'Сообраќајот да дојде и да се претвори во нарачки. Мерено, не претпоставено.',
        items: [
          'SEO',
          'Google Ads',
          'Google Shopping',
          'Email маркетинг',
          'CRO',
          'Google Analytics',
          'Калкулатор за добивка од конверзии',
        ],
      },
    ],
    items: [
      {
        title: 'Full-Stack платформи',
        desc: 'Изработка на производи од крај до крај — издржлива архитектура, чисти API-ја и frontend наместен до милисекунда.',
        points: [
          'Деловни страници и повеќестранични сајтови',
          'Custom логика, не купишта plugin-и',
          'Повеќејазичност од првиот commit',
          'Хостинг, домен и објавување од нас',
        ],
      },
      {
        title: 'Системи за е-трговија',
        desc: 'Продавници направени за конверзија: безбедни текови на плаќање, живи бази на производи и пат до купување без триење.',
        points: [
          'Плаќање со картичка и со поштарина',
          'Залиха по варијанта и управување со нарачки',
          'Admin panel што вашиот тим навистина може да го користи',
          'Checkout што се мери и се дотерува, не се претпоставува',
        ],
      },
      {
        title: 'Внатрешни алатки',
        desc: 'Наменски контролни табли и оперативни системи што прават сложените податоци читливи, брзи и безбедни за работа.',
        points: [
          'Системи за резервации, распореди и смени',
          'Пристап по улога за тимови',
          'Извоз во форматите што ги бара вашиот сметководител',
          'Го заменува excel-от што ја држи фирмата на нозе',
        ],
      },
      {
        title: 'Податоци и безбедност',
        desc: 'Архитектура на бази направена да расте, со приватноста и безбедноста како услови на дизајнот — никогаш како дополнување.',
        points: [
          'Шема осмислена за следните три години',
          'Ракување со податоци со GDPR на ум',
          'Бекап и враќање што се тестирани',
          'Никогаш лозинки во frontend-от',
        ],
      },
      {
        title: 'Системи на искуство',
        desc: 'Интерфејси каде хиерархијата, движењето и интеракцијата се дизајнираат како еден систем — не се украсуваат потоа.',
        points: [
          'Дизајн што тргнува од содржината, не од шаблон',
          'Real-time 3D и WebGL таму каде што си ја заслужува тежината',
          'Брзо на среден телефон со мобилен интернет',
          'Пристапен контраст, focus состојби и навигација со тастатура',
        ],
      },
    ],
  },
  work: {
    label: 'Избрани проекти',
    heading: 'Изградено. Испорачано. Во живо.',
    lede: 'Сите се онлајн во моментов. Отворете ги.',
    cta: 'Посетете ја страницата',
    featuresLabel: 'Што прави',
    stackLabel: 'Изградено со',
    labLabel: 'Lab',
    labNote: 'Не е клиентска работа — тука моторот се пишува од ништо.',
    embargoLabel: 'Наскоро',
    embargoNote: 'Изградено и одобрено. Затворено додека клиентот не отвори.',
    projects: [
      {
        title: 'A25 — The Agency',
        tagline: 'Продукциска платформа за лиценцирана агенција за вработување.',
        desc: 'Живата, петјазична платформа на A25 — лиценцирана агенција што поврзува македонски компании со проверена работна сила од Азија. Текови за апликации за работодавци и кандидати, custom live chat со одговори преку Telegram и автоматизирани email пораки. Во продукција на a25.mk.',
        ...META.a25,
      },
      {
        title: 'KD Law — Клинче и Димовски',
        tagline: 'Адвокатска канцеларија во Скопје, онлајн без stock фотографии.',
        desc: 'Двојазична страница за адвокатска канцеларија во Скопје: шест правни области, профили на партнерите и тимот, и барање за состанок што завршува како вистинска резервација наместо како уште еден email. Статиите се пишуваат и објавуваат преку внатрешен composer, за да објавува канцеларијата без да чека програмер.',
        ...META.dklaw,
      },
      {
        title: 'Dress Code',
        tagline: 'Продавница за луксузна мода, изградена од крај до крај.',
        desc: 'Premium продажба на мода од крај до крај: каталог поделен по категории со жива бројка на артикли, Stripe и плаќање при достава, и залиха по број што останува точна. Целосен admin panel — контрола на производи, нарачки и кампањи зад повеќеслоен auth — врз Supabase backend што паѓа на локална база за да работи без конфигурација.',
        ...META.dresscode,
      },
      {
        title: 'Цопороглу — Земјени работи',
        tagline: 'Фирма за земјени работи во Халкидики, од 1987.',
        desc: 'Страницата на семејна фирма за земјени работи во Халкидики: ископи, чистење парцели, септички јами и разбивање карпи, со подрачјата на работа и возниот парк на машини на свои посебни страници. Објавена на грчки, англиски и српски — трите јазици на кои навистина се јавуваат нејзините клиенти — со барање понуда и телефон што се јавува деноноќно.',
        ...META.tsopouroglou,
      },
      {
        title: 'Nova Shift',
        tagline: 'Интелигенција за смени за оние што наплаќаат по час.',
        desc: 'Платформа за распоред и заработка за поединци и тимови — часови, тарифи и сложени ротации, водени на едно место. Направена радикално лична: секое поле, правило и приказ се сврзува со својот корисник.',
        ...META.shift,
      },
      {
        title: 'Surviving of Souls',
        tagline: '2D мотор за преживување и експедиции.',
        desc: 'Top-down игра за преживување на custom canvas мотор — процедурално генерирани експедиции, економии на ресурси, crafting и системи за засолниште во непријателски pixel светови.',
        ...META.sos,
      },
    ],
  },
  process: {
    label: 'Како тече',
    heading: 'Четири чекори. Нешто вистинско на крајот од секој.',
    lede: 'Ниту еден чекор не завршува со ветување. Секој завршува со нешто што можете да го отворите, прочитате или кликнете.',
    cta: 'Повеќе за студиото',
    scrollHint: 'Лизгајте низ фазите',
    steps: [
      {
        title: 'Разговор',
        desc: 'Триесет минути за тоа што ѝ треба на фирмата од страницата. Без презентации, без жаргон, без обврска.',
        deliverable: 'Пишан brief. Една страница, на јасен јазик, ваш без разлика дали ќе соработуваме.',
      },
      {
        title: 'Обем и фиксна цена',
        desc: 'Сѐ што се гради, наведено. Бројката не мрда ако не мрдне обемот — а ако мрдне, вие го одобрувате прво.',
        deliverable: 'Фиксна цена и датум на испорака, во писмена форма.',
      },
      {
        title: 'Дизајн',
        desc: 'Распоред и идентитет околу вашата вистинска содржина — вашите текстови, вашите фотографии, вашите производи. Никогаш шаблон со ваше лого врз него.',
        deliverable: 'Екрани низ кои можете да кликате, пред да постои ред продукциски код.',
      },
      {
        title: 'Изработка и објава',
        desc: 'Се гради, не се составува. Жив линк од првата недела, за да гледате како се полни наместо да чекате во мрак.',
        deliverable: 'Жива страница — со кодот, доменот и секоја сметка на ваше име.',
      },
    ],
  },
  about: {
    label: 'За нас',
    heading: 'Инженерство, со намера.',
    p1: 'Секој производ овде се гради двапати — еднаш како систем, еднаш како искуство. Дисциплината е да не се жртвува ниту едното.',
    p2: 'Од безбедната backend архитектура до кривата на една единствена транзиција, ништо не заминува „како што дошло“. Резултатот е софтвер што издржува под оптоварување и се чувствува неизбежно во раката.',
    pillars: ['Архитектура на системи', 'Interface Engineering', 'Дизајн на податоци', 'Движење и интеракција'],
    trajectoryLabel: 'Патека',
    trajectoryHeading: 'Патот до овде.',
    jobs: [
      {
        role: 'Основач и Lead Engineer',
        company: 'NovaFaber',
        period: '2024 — денес',
        desc: 'Водење на студиото: техничка стратегија, full-stack архитектура и испорака во продукција, за клиенти на кои им треба софтвер што издржува.',
      },
      {
        role: 'Senior Full-Stack Developer',
        company: 'Независен',
        period: '2021 — 2024',
        desc: 'Дизајн и испорака на платформи за е-трговија, интеграции за плаќање и административни системи за фирми низ Европа.',
      },
      {
        role: 'Frontend Engineer',
        company: 'Digital Agency',
        period: '2018 — 2021',
        desc: 'Изработка на интерактивни, пристапни интерфејси со агенциско темпо — таму каде занаетот се судираше со роковите секој ден.',
      },
    ],
  },
  stack: {
    label: 'Инструменти',
    heading: 'Алатите на работата.',
    lede: 'Алатите не се поентата, но вреди да знаете врз што стои вашата страница.',
    groups: [
      {
        title: 'Frontend архитектура',
        desc: 'Интерфејси направени за течност — вклучувајќи real-time 3D.',
        skills: ['React', 'Next.js', 'Three.js / R3F', 'GSAP', 'Tailwind'],
      },
      {
        title: 'Backend и податоци',
        desc: 'Скалабилна логика, зацврстени бази и API-ја што остануваат брзи под притисок.',
        skills: ['Node.js', 'PostgreSQL', 'Redis', 'Express', 'GraphQL'],
      },
      {
        title: 'DevOps и Cloud',
        desc: 'Инфраструктура и pipeline-и за постојана испорака, без драми.',
        skills: ['AWS', 'Docker', 'Vercel', 'Linux', 'GitHub Actions'],
      },
      {
        title: 'Екосистем',
        desc: 'Секојдневната алатница — верзионирана, тестирана, дизајнирана.',
        skills: ['Git', 'Figma', 'Jest', 'Vite', 'Webpack'],
      },
    ],
  },
  faq: {
    label: 'Јасни одговори',
    heading: 'Прашањата што секогаш доаѓаат први.',
    lede: 'Вклучувајќи го она за парите.',
    items: [
      {
        q: 'Колку чини една страница?',
        a: 'Зависи од три работи: колку страници, колку јазици, и дали нешто мора да се гради наместо само да се постави. Презентациска страница за локална фирма и продавница со плаќања и залиха се различен ред на големина. Кажете ми го обемот и добивате една фиксна бројка пред да почне што било — не наплата по час што бега.',
      },
      {
        q: 'Колку време бара?',
        a: 'Обична деловна страница обично е две до четири недели од одобрен дизајн. Продавниците и custom платформите траат подолго, а документот за обем кажува точно колку пред да се обврзете.',
      },
      {
        q: 'Може ли сам да ја менувам содржината?',
        a: 'Да, ако сакате. Текстови, фотографии и производи може да стојат зад admin panel во кој се најавувате. Некои клиенти повеќе сакаат да ми ги испратат промените — и тоа работи, и е поевтино за изработка.',
      },
      {
        q: 'Работите на македонски и англиски?',
        a: 'И на двата, и на повеќе. A25 работи во живо на пет јазици. Повеќејазичноста се дизајнира од почеток наместо да се додава подоцна, па нов јазик покасно е работа на содржина, не преправање.',
      },
      {
        q: 'Што се случува по објавата?',
        a: 'Еден месец поддршка е вклучен — поправки, ситни измени, сѐ што не е нов обем. Потоа го земате внатре, или ме држите на мал месечен износ за ажурирања и следење. Кодот и доменот се ваши во секој случај.',
      },
      {
        q: 'Преземате страница што ја правел друг?',
        a: 'Обично да. Испратете ми го URL-от и ќе ви кажам искрено дали вреди да се поправи или да се замени — тоа се навистина различни одговори и нема да се преправам за да ја добијам поголемата работа.',
      },
    ],
  },
  contact: {
    label: 'Контакт',
    headingA: 'Направете го',
    headingB: 'неизбежно.',
    desc: 'Ако вашиот производ заслужува повеќе од шаблон, инбоксот е отворен.',
    emailLabel: 'Директна линија',
    form: {
      name: 'Вашето име',
      namePh: 'Марко Марковски',
      email: 'Email',
      emailPh: 'vie@firma.com',
      company: 'Фирма',
      companyPh: 'По желба',
      kind: 'Што ви треба?',
      kinds: ['Веб-страница', 'Онлајн продавница', 'Редизајн на постоечка страница', 'Custom софтвер или платформа', 'Сѐ уште не сум сигурен'],
      budget: 'Буџет',
      budgets: ['До 1.500 €', '1.500 € — 5.000 €', '5.000 € — 10.000 €', 'Над 10.000 €', 'Кажете ми вие колку чини'],
      message: 'Проектот',
      messagePh: 'Што работи фирмата, и што треба страницата да прави за неа.',
      submit: 'Испратете',
      sending: 'Се отвора вашиот email…',
      note: 'Прашањето за буџетот е тука за да не изгуби ниту еден од нас час откривајќи дека сме во различни соби.',
      fallback: 'Ова ја отвора вашата email апликација со пополнета порака. Ако ништо не се случи, пишете на',
    },
  },
  testimonials: {
    label: 'Зошто ни веруваа',
    heading: 'Луѓето што тргнаа први.',
    lede: 'Четири фирми што рекоа да пред да има портфолио да им се покаже.',
    draftBadge: 'Нацрт — чека одобрување',
    items: [
      {
        quote:
          'Пет јазици, во живо пред да почне сезоната. Chat-от ми доаѓа на Telegram, па им одговарам на кандидатите од кола.',
        name: '[име на клиент]',
        role: '[позиција]',
        company: 'A25 — The Agency',
        project: 'a25.mk',
        slug: 'a25',
        approved: false,
      },
      {
        quote:
          'Објавив четири статии од објавувањето без да пишам email на никого. Тоа беше делот за кој не верував дека ќе проработи.',
        name: '[име на клиент]',
        role: '[позиција]',
        company: 'KD Law — Клинче и Димовски',
        project: 'dklaw',
        slug: 'kd-law',
        approved: false,
      },
      {
        quote:
          'Сите го спомнуваат 3D приказот. Она што беше важно е залихата по број — им враќав пари на луѓе за патики што ги немав.',
        name: '[име]',
        role: '[позиција]',
        company: 'Sneaker Air',
        project: 'sneaker-air',
        slug: 'dress-code',
        approved: false,
      },
      {
        quote: 'Три тарифи, во тетратка. Сега сметководителот добива фајл.',
        name: '[име]',
        role: '[позиција]',
        company: 'Nova Shift',
        project: 'nova-shift',
        slug: 'nova-shift',
        approved: false,
      },
    ],
  },
  blog: {
    label: 'Белешки',
    heading: 'Прашањата што се појавуваат секој пат.',
    lede: 'Запишани како треба, за одговорот да е ист без разлика дали ме прашувате во вторник или го читате на полноќ.',
    cta: 'Сите белешки',
    readMore: 'Прочитајте',
    all: 'Прочитајте ги сите белешки',
  },
  chosen: {
    label: 'Зошто нѐ избраа',
    heading: 'Четири фирми избраа студио наместо агенција.',
    desc: 'Фиксна цена пред да почне што било, кодот и доменот на ваше име, и жив линк од првата недела.',
    primary: 'Закажете разговор',
    secondary: 'Погледнете ја работата',
  },
  ctaBand: {
    eyebrow: 'Следен чекор',
    heading: 'Имате проект што чека?',
    desc: 'Триесет минути, без презентации. Заминувате со пишан brief без разлика дали ќе соработуваме.',
    primary: 'Закажете разговор',
    secondary: 'Испратете порака',
  },
  routes: {
    services: {
      eyebrow: 'Услуги',
      title: 'Сѐ што треба да носи едно современо студио.',
      lede: 'Три дисциплини, еден тим, една фактура. Development е оној со четири платформи во продукција зад себе — другите две постојат затоа што страница што никој не ја наоѓа, или на која никој не ѝ верува, не е завршена работа.',
    },
    work: {
      eyebrow: 'Нашите проекти',
      title: 'Изградено. Испорачано. Во живо.',
      lede: 'Секој проект подолу е онлајн во моментов, со вистински корисници. Отворете ги и оценете сами.',
    },
    process: {
      eyebrow: 'Како тече',
      title: 'Четири чекори. Нешто вистинско на крајот од секој.',
      lede: 'Целиот процес, запишан — што се случува, што добивате, и што ве чини ако си заминете во која било фаза.',
    },
    about: {
      eyebrow: 'Студиото',
      title: 'Инженерство, со намера.',
      lede: 'Еден инженер, четири платформи во продукција, и одбивање да замине било што „како што дошло“.',
    },
    contact: {
      eyebrow: 'Контакт',
      title: 'Направете го неизбежно.',
      lede: 'Кажете ми што работи фирмата и што треба страницата да прави за неа. Прашањето за буџетот е тука за да не изгуби ниту еден од нас час.',
    },
    book: {
      eyebrow: 'Закажете разговор',
      title: 'Триесет минути, без обврска.',
      lede: 'Разговор за тоа што ви треба — не продажен повик. Заминувате со едностраничен brief што можете да го однесете кај кого сакате.',
    },
    blog: {
      eyebrow: 'Белешки',
      title: 'Јасни одговори, запишани.',
      lede: 'Прашањата што доаѓаат во секој прв разговор, одговорени како треба наместо секој пат по телефон.',
    },
  },
  footer: {
    tagline: 'Софтвер со прецизноста на инженерството и присуството на филмот.',
    note: 'Дизајнирано и изградено внатре.',
    rights: 'Сите права задржани.',
    socialsLabel: 'Друго',
    navLabel: 'Индекс',
    servicesLabel: 'Услуги',
    studioLabel: 'Студио',
    studioLinks: [
      { label: 'За нас', href: '/about' },
      { label: 'Како тече', href: '/process' },
      { label: 'Белешки', href: '/blog' },
      { label: 'Закажете разговор', href: '/book-a-call' },
    ],
    contact: {
      eyebrow: 'Контакт',
      heading: 'Јавете се',
      lede: 'Кажете ми што работи фирмата. Одговара човекот што би ја градел.',
      email: { title: 'Email', desc: 'Директно до оној што го пишува кодот.' },
      social: { title: 'Instagram', desc: 'Порака овде вреди исто колку и email.' },
      phone: { title: 'Телефон', desc: 'Пон–Пет, 9:00 до 18:00.' },
      mapLabel: 'NovaFaber работи од Солун, Грција',
    },
  },
};

export const content: Record<Lang, SiteContent> = { en, el, mk };

/* ------------------------------------------------------------------ */
/* Identity — ported                                                   */
/* ------------------------------------------------------------------ */

export const BRAND = 'NovaFaber';
export const FOUNDER = 'Giannis Papadopoulos';
/**
 * THE contact address. One constant, referenced everywhere it appears:
 * the contact page, book-a-call, the footer card, the footer mail link,
 * the form's mailto and the Organization JSON-LD. Nothing hardcodes it.
 *
 * ── SWITCHING TO THE BRANDED INBOX ────────────────────────────────────
 * Two ways, both one line:
 *   1. Set NEXT_PUBLIC_CONTACT_EMAIL=hello@novafaber.com in the Vercel
 *      project (and .env.local for dev). No code change, no redeploy of
 *      the source — just a rebuild.
 *   2. Or change the fallback below.
 *
 * The env var wins so the branded address can be staged on a preview
 * deployment before it goes to production.
 */
export const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'yioyiomenyioyiomen@gmail.com';

/**
 * Where the studio works from.
 *
 * No street address is published — there is no office to walk into, and
 * inventing one to fill a card is how a portfolio starts lying. The city is
 * real, it is what the footer map pins, and it is what the structured data
 * hands Google as the service area.
 */
export const LOCATION = {
  city: 'Thessaloniki',
  region: 'Central Macedonia',
  country: 'Greece',
  countryCode: 'GR',
  /** Anything Google Maps can resolve. */
  mapQuery: 'Thessaloniki, Greece',
};

export const PHONE = {
  display: '+30 698 576 5541',
  /** E.164, no spaces — this is what the tel: link dials. */
  tel: '+306985765541',
};

export const INSTAGRAM = {
  handle: 'giannis.pdl',
  url: 'https://instagram.com/giannis.pdl',
};

export interface Social {
  label: string;
  handle: string;
  url: string;
  /**
   * Whether this account reads as the STUDIO speaking.
   *
   * The footer's "Elsewhere" block sits inside studio-branded copy, and a
   * handle is read as a signature. Three of these are defensible there —
   * a personal GitHub is normal for a one-person studio and is the
   * strongest technical credential on the page; LinkedIn is where the
   * founder is the product; Instagram is already published elsewhere in
   * the footer as a real contact channel, so hiding it here would be
   * inconsistent.
   *
   * TikTok is the odd one out and is flagged rather than deleted: it is a
   * real account, but `thyswedishguy` next to "Software with the
   * precision of engineering" is the one line on the page written in a
   * different voice, and it is the only handle here with no visible
   * connection to the work. Set to true the moment it becomes a studio
   * channel — the data stays, only the rendering changes.
   */
  studio: boolean;
}

export const SOCIALS: Social[] = [
  { label: 'GitHub', handle: 'qolar-pro', url: 'https://github.com/qolar-pro', studio: true },
  {
    label: 'LinkedIn',
    handle: 'blanco-xd',
    url: 'https://www.linkedin.com/in/blanco-xd-06313b268',
    studio: true,
  },
  { label: 'Instagram', handle: INSTAGRAM.handle, url: INSTAGRAM.url, studio: true },
  { label: 'TikTok', handle: 'thyswedishguy', url: 'https://tiktok.com/@thyswedishguy', studio: false },
];

/** What the footer and the structured data publish. See `studio` above. */
export const STUDIO_SOCIALS = SOCIALS.filter((s) => s.studio);
