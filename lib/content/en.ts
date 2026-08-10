import type { LocaleContent } from './types';

/**
 * English content.
 *
 * Voice note, because it is the whole point of this phase: the old copy sold
 * a sensibility ("Software with the precision of engineering and the presence
 * of cinema"). It is good writing and it sells nothing, because a business
 * owner comparing three quotes cannot act on it.
 *
 * This copy leads with what the client receives. Where a claim appears, it is
 * checkable — no invented metrics, no borrowed statistics, no testimonials
 * that were not given to us.
 */
export const en: LocaleContent = {
  status: 'complete',

  chrome: {
    navLabels: {
      'services.websites': 'Websites',
      'services.ecommerce': 'Online stores',
      'services.redesign': 'Redesign',
      'services.custom': 'Custom builds',
      pricing: 'Pricing',
      work: 'Work',
      process: 'Process',
      studio: 'Studio',
      lab: 'Lab',
      contact: 'Contact',
    },
    // Made in Greece. NovaFaber serves North Macedonia (A25 is a Macedonian
    // client) but is not based there — see DD-19. Serving a market and being
    // established in it are different claims, and only one of them is true.
    footerNote: 'Designed and built in-house, in Greece.',
    ctaBook: 'Book a call',
    ctaQuote: 'Get a quote',
  },

  home: {
    headline: 'Websites built from scratch, not from a theme.',
    subhead:
      'NovaFaber builds custom sites and online stores for businesses in Greece, North Macedonia and further afield. Every one is written to a performance budget, ships in the languages your customers actually read, and is built by the person who answers your email.',
    ctaPrimary: 'Get a quote',
    ctaSecondary: 'See the work',
    proof: [
      { value: '5', label: 'languages shipped on one client platform' },
      { value: '0', label: 'themes, page builders or templates used' },
      { value: '3', label: 'markets served — Greek, Macedonian, English' },
    ],
  },

  meta: {
    home: {
      title: 'NovaFaber',
      description:
        'Custom websites and online stores for businesses in Greece, North Macedonia and beyond. Built from scratch, to a performance budget.',
    },
    'services.websites': {
      title: 'Websites',
      description:
        'Custom business websites, designed and built from scratch — no themes, no page builders. Greek, Macedonian and English.',
    },
    'services.ecommerce': {
      title: 'Online stores',
      description:
        'Online stores built end to end: storefront, product database, order pipeline and an admin panel your staff can actually use.',
    },
    'services.redesign': {
      title: 'Redesign',
      description:
        'Rebuilding sites that have become slow, dated, or impossible to update. Keeps what works, replaces what does not.',
    },
    'services.custom': {
      title: 'Custom builds',
      description:
        'Platforms, internal tools and real-time interfaces for businesses whose problem does not fit an off-the-shelf product.',
    },
    pricing: {
      title: 'Pricing',
      description:
        'How pricing works at NovaFaber: what drives the cost of a website, what is included as standard, and how to get a figure for your project.',
    },
    work: {
      title: 'Work',
      description:
        'Selected projects, including A25 — a five-language recruitment platform running in production.',
    },
    'work.a25': {
      title: 'A25 — The Agency',
      description:
        'A five-language platform for a licensed recruitment agency in North Macedonia, with employer and candidate application flows and a live chat answered through Telegram.',
    },
    'work.dresscode': {
      title: 'Dresscode',
      description:
        'A fashion commerce platform built end to end: storefront, order pipeline, admin tooling and a custom database layer.',
    },
    process: {
      title: 'Process',
      description:
        'Four steps from first conversation to a live site — and the nine stages they cover, so you know exactly what happens when.',
    },
    studio: {
      title: 'Studio',
      description:
        'NovaFaber is a small studio. You work with the person who builds your site, not an account manager.',
    },
    lab: {
      title: 'Lab',
      description:
        'Experiments, real-time graphics and a custom game engine. Where the techniques used on client work get developed.',
    },
    contact: {
      title: 'Contact',
      description: 'Book a call, or send the details of your project and get a quote back.',
    },
  },

  services: [
    {
      id: 'websites',
      name: 'Websites',
      summary: 'A site your business is judged by, built to order.',
      lede: 'Most business websites are a purchased theme with the colours changed. They look acceptable for about two years, load slowly because they carry code for features you never use, and become impossible to change once the person who set them up moves on. This is the alternative.',
      includes: [
        'Design drawn for your business, not adapted from a template',
        'Every page written and built by hand',
        'Greek, Macedonian or English — or all three',
        'On-page SEO built in from the first commit, not sold as an extra',
        'A performance budget the finished site is measured against',
        'An admin area for the parts you need to change yourself',
      ],
      notFor:
        'If you need a single page online this week and cost is the deciding factor, a template shop will serve you better and I will say so.',
    },
    {
      id: 'ecommerce',
      name: 'Online stores',
      summary: 'Storefront, orders and admin — the whole pipeline.',
      lede: 'An online store is not a website with a basket bolted on. It is a product database, a payment path, an order pipeline and an admin panel your staff use every day — and the last of those is the one most builds neglect.',
      includes: [
        'Storefront designed around how your products actually sell',
        'Product database structured for your catalogue, not a generic one',
        'Order pipeline from checkout through fulfilment',
        'Admin panel your staff can operate without training',
        'Secure payment integration',
        'Stock, pricing and promotional controls you manage yourself',
      ],
      notFor:
        'If you are testing whether a product sells at all, start on a hosted platform. Come back when the fees and the limits start costing you more than a build would.',
    },
    {
      id: 'redesign',
      name: 'Redesign',
      summary: 'For a site that has aged out of usefulness.',
      lede: 'Slow, dated, unmaintainable, or invisible in search. A redesign starts by working out which of those you actually have — because the fix for a slow site and the fix for an invisible one are different pieces of work.',
      includes: [
        'An audit of what is wrong, with measurements rather than opinions',
        'Everything worth keeping carried across — content, URLs, search rankings',
        'Redirects so existing links and search results keep working',
        'A rebuild you can update without calling anyone',
        'Before-and-after performance figures',
      ],
      notFor:
        'If the site is under two years old and the real problem is the copy, you need a writer before you need me.',
    },
    {
      id: 'custom',
      name: 'Custom builds',
      summary: 'When the problem does not fit a product you can buy.',
      lede: 'Platforms, internal tools, booking and scheduling systems, real-time interfaces. The work that starts with a spreadsheet somebody has outgrown, or a process that only exists in one person’s head.',
      includes: [
        'System design before code — what it stores, who touches it, what it must never lose',
        'Databases built for the data you actually have',
        'Internal dashboards that make complex information legible',
        'Real-time and 3D interfaces where they earn their place',
        'Security and privacy treated as design constraints',
      ],
      notFor:
        'If off-the-shelf software covers ninety per cent of what you need, buy it. Custom work is worth it when the last ten per cent is the part that makes you money.',
    },
  ],

  process: [
    {
      id: 'forge',
      name: 'Forge',
      greekName: 'Σχέδιο',
      covers: ['Needs analysis and strategy', 'Architecture and sitemap'],
      deliverable:
        'A written scope: what the site is for, who it speaks to, every page it will have, and what each one has to do. You sign this off before anything is drawn.',
    },
    {
      id: 'cast',
      name: 'Cast',
      greekName: 'Μορφή',
      covers: ['UI/UX design', 'Wireframes and mockups'],
      deliverable:
        'Designed screens for every page type, on desktop and phone. You see the site before a line of it is built, and changes at this stage cost nothing.',
    },
    {
      id: 'temper',
      name: 'Temper',
      greekName: 'Κατασκευή',
      covers: ['Front-end development', 'Back-end and CMS', 'Content integration'],
      deliverable:
        'The working site on a private link, with your real content in it — not placeholder text. You use it and tell me what is wrong while it is still cheap to fix.',
    },
    {
      id: 'finish',
      name: 'Finish',
      greekName: 'Παράδοση',
      covers: ['On-page SEO', 'Testing and QA', 'Launch and monitoring'],
      deliverable:
        'Live, tested across real devices and browsers, with analytics running and performance measured. Plus the passwords, the documentation, and no dependency on me.',
    },
  ],

  caseStudies: [
    {
      id: 'a25',
      name: 'A25 — The Agency',
      tagline: 'A recruitment platform running in production, in five languages.',
      summary:
        'A licensed agency connecting North Macedonian businesses with verified workforce from Asia. Five languages, two separate application flows, and a live chat answered through Telegram.',
      body: [
        'A25 is a licensed recruitment agency in North Macedonia. Their work connects local businesses with verified workers from Asia, which means the platform has to serve two audiences who share almost nothing — employers looking for staff, and candidates looking for work — in languages neither side has in common.',
        'That shaped the build. Five languages, because the platform is read by Macedonian employers and by candidates across several Asian markets. Two distinct application flows rather than one form with a dropdown, because an employer posting a vacancy and a candidate applying for one need different questions, different validation, and different follow-up.',
        'The live chat is answered through Telegram. A25 are not sitting in a browser dashboard waiting for enquiries, so messages arrive where they already are — on their phones — and replies go back to the website visitor. Email pipelines handle the rest automatically.',
        'It has been running in production at a25.mk since launch.',
      ],
      facts: [
        'Five languages',
        'Employer and candidate application flows',
        'Custom live chat, answered through Telegram',
        'Automated email pipelines',
        'Live in production at a25.mk',
      ],
      stack: ['React', 'TypeScript', 'Tailwind', 'Express', 'Redis'],
      images: ['/images/a25-1.jpg', '/images/a25-2.jpg', '/images/a25-3.jpg'],
      url: 'https://a25.mk',
      surface: 'work',
      flagship: true,
    },
    {
      id: 'dresscode',
      name: 'Dresscode',
      tagline: 'Fashion commerce, built end to end.',
      summary:
        'A complete fashion store: storefront with dynamic campaign banners, full order pipeline, admin tooling, and a custom database layer underneath.',
      body: [
        'Dresscode is a fashion store built from the ground up rather than assembled from a hosted platform — storefront, order pipeline, admin panel and database layer, all designed together.',
        'The storefront carries dynamic campaign banners the client controls themselves, so a sale does not require a developer. Behind it, the order pipeline tracks a purchase from checkout through fulfilment, and the admin panel exposes exactly the controls staff need without the surrounding clutter of a general-purpose system.',
        'The database layer is custom because the catalogue is: sizes, variants and stock behave differently in fashion than in the generic product model most platforms assume.',
      ],
      facts: [
        'Storefront with client-controlled campaign banners',
        'Order pipeline from checkout to fulfilment',
        'Admin panel built for daily use by staff',
        'Custom database layer for a fashion catalogue',
      ],
      stack: ['React', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL'],
      images: ['/images/dresscode-1.jpg', '/images/dresscode-2.jpg', '/images/dresscode-3.jpg'],
      url: 'https://dresscode-rho.vercel.app/',
      surface: 'work',
      flagship: false,
    },
    {
      id: 'nova-shift',
      name: 'Nova Shift',
      tagline: 'Scheduling and earnings for people who bill by the hour.',
      summary:
        'A scheduling platform where hours, rates and rotations are orchestrated in one place — and where every field, rule and view bends to the individual using it.',
      body: [
        'Nova Shift is a scheduling and earnings tool for individuals and teams who bill by the hour. Hours, rates and complex rotations live in one place, and the calculations that usually sit in a personal spreadsheet happen automatically.',
        'The unusual part is how far the customisation goes. Rather than assuming one way of working, every field, rule and view can be reshaped by the person using it — because a nurse on rotating shifts, a contractor on day rates, and a team lead approving both need genuinely different tools.',
      ],
      facts: [
        'Per-user customisation of fields, rules and views',
        'Earnings engine over variable rates',
        'Rotation and schedule orchestration',
        'Multi-format export',
      ],
      stack: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
      images: ['/images/apex-1.jpg', '/images/apex-2.jpg', '/images/apex-3.jpg'],
      url: 'https://animated-valkyrie-8d4b67.netlify.app/',
      surface: 'work',
      flagship: false,
    },
    {
      id: 'surviving-of-souls',
      name: 'Surviving of Souls',
      tagline: 'A 2D survival engine, written from nothing.',
      summary:
        'A top-down survival game on a custom canvas engine — procedural expeditions, resource economies, crafting and shelter systems.',
      body: [
        'A top-down survival game running on a canvas engine written from scratch: no game framework, no physics library. Procedurally generated expeditions, a resource economy, crafting and shelter systems.',
        'It sits in the Lab rather than the client work because nobody commissions a game engine. It is here because it is the clearest evidence of what "built from scratch" means — pathfinding, collision, world generation and a render loop, all authored rather than imported.',
      ],
      facts: [
        'Custom canvas engine, no game framework',
        'Procedurally generated expeditions',
        'Resource economy and crafting systems',
        'Pathfinding written from scratch',
      ],
      stack: ['TypeScript', 'Canvas', 'Custom engine'],
      images: ['/images/sos-1.jpg'],
      url: 'https://celadon-crostata-316852.netlify.app/',
      surface: 'lab',
      flagship: false,
    },
  ],

  capabilities: [
    {
      title: 'Interfaces',
      outcome: 'Sites that stay responsive under load and on a mid-range phone.',
      tools: ['React', 'Next.js', 'Three.js', 'GSAP', 'Tailwind'],
    },
    {
      title: 'Systems and data',
      outcome: 'Databases and APIs that hold their shape as the business grows.',
      tools: ['Node.js', 'PostgreSQL', 'Redis', 'Express'],
    },
    {
      title: 'Infrastructure',
      outcome: 'Deployments that are boring, repeatable, and quick to roll back.',
      tools: ['Vercel', 'Docker', 'Linux', 'GitHub Actions'],
    },
  ],

  founder: {
    name: 'Giannis Papadopoulos',
    role: 'Founder',
    bio: [
      'NovaFaber is small on purpose. The person who scopes your project is the person who designs it, builds it, and answers the phone afterwards — there is no account manager between you and the work, and nothing is subcontracted out.',
      'That has a cost and I would rather be straight about it: I take on a limited number of projects at once, so start dates are real constraints rather than a sales tactic. What you get in return is that nothing is lost in translation between the brief and the build, because there is no translation.',
    ],
    photo: null,
  },

  // DD-5: three testimonials exist. Text not yet supplied by the owner.
  // Nulls stay until real quotes with real attribution arrive — placeholder
  // testimonials are worse than none.
  testimonials: [null, null, null],
};
