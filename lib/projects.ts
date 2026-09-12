/**
 * THE PROJECT REGISTRY — one object per project, one place to edit.
 *
 * Everything about a project that is NOT copy lives here: where it is
 * online, what its screenshots are, what it is built with. The three
 * translations in lib/content.ts supply the title, tagline and description
 * and read the rest off this file, so a link never has to be changed in
 * three languages, and never has to be hunted for inside a component.
 *
 * ── SWAPPING A LIVE URL ───────────────────────────────────────────────
 * Change `liveUrl` here. That is the entire operation. It is what the work
 * tiles link to, what the case studies link to, and what the "why they
 * chose us" logo wall links to — all three read this field.
 *
 * Two of them still point at auto-generated deploy subdomains and are
 * marked `vanityPending`. That flag renders nothing; it exists so this
 * file answers "which links still need a real domain?" without anyone
 * having to recognise a Netlify URL by sight.
 */

export interface ProjectAssets {
  /** Stable id. Also the URL slug and the key into lib/marks. */
  slug: string;

  /**
   * Where the project is live.
   *
   * Empty string means "do not link" — used by the embargo below, where a
   * real URL in this file would be one Ctrl+F away in the RSC payload no
   * matter how carefully the components avoid rendering it.
   */
  liveUrl: string;

  /**
   * TRUE while `liveUrl` is an auto-generated platform subdomain
   * (*.vercel.app, *.netlify.app) rather than a domain the client owns.
   * Purely informational — swap the URL above and delete the line.
   */
  vanityPending?: boolean;

  images: string[];
  features: string[];
  stack: string[];

  /**
   * A short muted clip that sells a genuinely interactive feature better
   * than a still can — the Sneaker Air 3D viewer spinning, the A25 chat
   * answering. Optional, and absent everywhere today: no such capture
   * exists in the repo and inventing one is not on the table.
   *
   * To add one: drop an MP4 (H.264, no audio, ~4s loop, ≤2 MB) in
   * /public/video, point `src` at it, keep `poster` on the still that is
   * already in `images`. <ProjectMedia> handles the rest — it renders the
   * poster first, only loads the clip on a wide viewport with motion
   * allowed, and falls back to the still everywhere else.
   */
  clip?: { src: string; poster: string };

  /** Shown in the Lab strip rather than the main work list. */
  lab?: boolean;

  /**
   * FALSE keeps a project out of the homepage gallery while leaving it in
   * the case studies and on the logo wall. Defaults to true.
   */
  showcase?: boolean;

  /**
   * TRUE takes the project off the site completely — the logo wall, the
   * homepage gallery and the case studies on /work.
   *
   * A flag rather than a deletion, deliberately. The copy, the three
   * translations and the screenshots are work that was done and paid for,
   * and a studio that narrows its public list this month may widen it again
   * next month. Flip the line to bring one back; nothing else has to be
   * rewritten. `showcase: false` is the softer version of this — it hides a
   * project from the homepage gallery but keeps it as proof elsewhere.
   */
  hidden?: boolean;

  /**
   * The client has not launched yet, so the design does not go public.
   * Blurs the screenshots and the mark, drops the outbound link, and puts
   * a "launching soon" badge in its place. The work still counts as proof
   * — it just cannot be read off the page. Delete the day they launch.
   */
  embargo?: boolean;
}

export const PROJECTS = {
  a25: {
    slug: 'a25',
    liveUrl: 'https://a25.mk',
    images: ['/images/a25-1.jpg', '/images/a25-2.jpg', '/images/a25-3.jpg'],
    features: [
      '5 languages',
      'Live chat + Telegram',
      'Application flows',
      'Email automation',
      'In production',
    ],
    stack: ['React', 'TypeScript', 'Tailwind', 'Express', 'Redis'],
    // TODO(clip): the live chat answering through Telegram is the differentiator
    // here and a still cannot show it. Capture ~4s and wire it up as `clip`.
  },

  dklaw: {
    slug: 'kd-law',
    /* Off the public site — the studio now shows two clients. Data kept; see `hidden`. */
    hidden: true,
    /* Off the homepage gallery. A card that is blurred, unclickable and
       captioned "launching soon" is the one tile in a portfolio nobody can
       evaluate — it costs a slot and gives a visitor nothing. The case study
       on /work keeps it as proof of the work; the gallery shows what can
       actually be opened. Delete this line the day the firm launches. */
    showcase: false,
    /* Blank on purpose while `embargo` is on — see the field docs above.
       At launch, put the firm's own domain here and drop `embargo`. The
       staging URL it used to hold was a Vercel preview and must not come back. */
    liveUrl: '',
    embargo: true,
    images: ['/images/dklaw-1.jpg', '/images/dklaw-2.jpg', '/images/dklaw-3.jpg'],
    features: [
      'Appointment booking',
      'Six practice areas',
      'Team profiles',
      'Insights, written in-house',
      'Admin article composer',
      'Multi-language',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'GSAP', 'PostgreSQL', 'Resend'],
  },

  dresscode: {
    slug: 'dress-code',
    /* Off the public site — the studio now shows two clients. Data kept; see `hidden`. */
    hidden: true,
    /* NEEDS A REAL DOMAIN — still the Vercel deploy subdomain. */
    liveUrl: 'https://dresscode-rho.vercel.app/',
    vanityPending: true,
    /* Recaptured from the live site. The previous screenshots showed the
       storefront under its old Sneaker Air branding, which has not been at
       this URL for some time — a portfolio shot of a shop that no longer
       exists is worse than no shot. */
    images: [
      '/images/dress-code-1.jpg',
      '/images/dress-code-2.jpg',
      '/images/dress-code-3.jpg',
    ],
    features: [
      'Category catalogue',
      'Stripe + cash checkout',
      'Full admin panel',
      'Per-size inventory',
      'Zero-config database',
    ],
    /* Three.js is gone from this list with the sneaker viewer — see the
       copy note in lib/content.ts. Put it back if the 3D viewer is still
       shipping on a product page. */
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe', 'Supabase'],
  },

  tsopouroglou: {
    slug: 'tsopouroglou',
    /* Live on the client's own domain — verified 200 before the swap. The
       deploy subdomain it used to point at is no longer referenced. */
    liveUrl: 'https://www.xomatourgika-tsopouroglou.gr',
    images: [
      '/images/tsopouroglou-1.jpg',
      '/images/tsopouroglou-2.jpg',
      '/images/tsopouroglou-3.jpg',
    ],
    features: [
      '3 languages',
      'Service areas',
      'Machine fleet',
      'Quote requests',
      'In production',
    ],
    /* Verified from the deployment's own response headers
       (X-Nextjs-Prerender, Server: Vercel), not assumed.
       TODO(stack): fill in the rest — CMS, forms, mail — from the build. */
    stack: ['Next.js', 'Vercel'],
  },

  shift: {
    slug: 'nova-shift',
    /* Off the public site — the studio now shows two clients. Data kept; see `hidden`. */
    hidden: true,
    /* NEEDS A REAL DOMAIN — auto-generated Netlify subdomain. */
    liveUrl: 'https://animated-valkyrie-8d4b67.netlify.app/',
    vanityPending: true,
    /* Filenames read `nova-shift-*`. They used to read `apex-*`, which was
       not a leftover from another project — the app's own in-product
       wordmark still says APEXSHIFT, from before the rename that also took
       Apex Solutions to NovaFaber. The screenshots are correct; only the
       filenames were stale. */
    images: [
      '/images/nova-shift-1.jpg',
      '/images/nova-shift-2.jpg',
      '/images/nova-shift-3.jpg',
    ],
    features: [
      'Radical customization',
      'Earnings engine',
      'Schedule orchestration',
      'Multi-format export',
    ],
    stack: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
  },

  sos: {
    slug: 'surviving-of-souls',
    /* NEEDS A REAL DOMAIN — auto-generated Netlify subdomain. */
    liveUrl: 'https://celadon-crostata-316852.netlify.app/',
    vanityPending: true,
    images: ['/images/sos-1.jpg'],
    features: [
      'Survival mechanics',
      'Expedition system',
      'Procedural worlds',
      'Resource economy',
    ],
    stack: ['TypeScript', 'Canvas', 'Custom engine', 'Pathfinding'],
    lab: true,
  },
} as const satisfies Record<string, ProjectAssets>;

export type ProjectKey = keyof typeof PROJECTS;

/** Every project still pointing at a platform subdomain. Used by the build notes. */
export const PENDING_VANITY_DOMAINS = Object.values(PROJECTS)
  .filter((p): p is (typeof PROJECTS)[ProjectKey] & { vanityPending: true } =>
    'vanityPending' in p && p.vanityPending === true,
  )
  .map((p) => ({ slug: p.slug, liveUrl: p.liveUrl }));
