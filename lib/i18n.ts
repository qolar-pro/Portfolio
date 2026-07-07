export type LanguageCode = 'en' | 'el' | 'de' | 'fr' | 'mk' | 'it';

/**
 * Locales currently shipping with a full premium copy pass.
 * DE / FR / MK / IT keep their slots in the architecture and fall back to EN
 * until their rewrites land — re-adding one is a content change, not a rebuild.
 */
export const ACTIVE_LOCALES: LanguageCode[] = ['en', 'el'];

export const languageNames: Record<LanguageCode, string> = {
  en: 'English',
  el: 'Ελληνικά',
  de: 'Deutsch',
  fr: 'Français',
  mk: 'Македонски',
  it: 'Italiano',
};

export interface Project {
  title: string;
  tagline: string;
  desc: string;
  features: string[];
  stack: string[];
  images: string[];
  url: string;
}

export interface SiteContent {
  nav: {
    available: string;
    identity: string;
    contact: string;
    menuSections: string;
  };
  hero: {
    status: string;
    name: string;
    tagline: string;
    desc: string;
    ctaWork: string;
    ctaTalk: string;
    scroll: string;
  };
  marquee: string[];
  about: {
    label: string;
    heading: string;
    p1: string;
    p2: string;
    pillars: string[];
  };
  services: {
    label: string;
    heading: string;
    items: { title: string; desc: string }[];
  };
  work: {
    label: string;
    heading: string;
    cta: string;
    projects: Project[];
  };
  experience: {
    label: string;
    heading: string;
    jobs: { role: string; company: string; period: string; desc: string }[];
  };
  stack: {
    label: string;
    heading: string;
    groups: { title: string; desc: string; skills: string[] }[];
  };
  contact: {
    label: string;
    headingA: string;
    headingB: string;
    desc: string;
    emailLabel: string;
    footerNote: string;
  };
  brand: {
    title: string;
    logomark: string;
    typography: string;
    palette: string;
    displayName: string;
    displayDesc: string;
    bodyName: string;
    bodyDesc: string;
    colors: { name: string; hex: string }[];
  };
  preview: {
    loading: string;
    hint: string;
    open: string;
    close: string;
  };
}

const PROJECT_META = {
  a25: {
    features: ['5 languages', 'Live chat + Telegram', 'Application flows', 'Email automation', 'In production'],
    stack: ['React', 'TypeScript', 'Tailwind', 'Express', 'Redis'],
    images: ['/images/a25-1.jpg', '/images/a25-2.jpg', '/images/a25-3.jpg'],
    url: 'https://a25.mk',
  },
  shift: {
    features: ['Radical customization', 'Earnings engine', 'Schedule orchestration', 'Multi-format export'],
    stack: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
    images: ['/images/apex-1.jpg', '/images/apex-2.jpg', '/images/apex-3.jpg'],
    url: 'https://animated-valkyrie-8d4b67.netlify.app/',
  },
  dresscode: {
    features: ['Storefront + sale engine', 'Order pipeline', 'Admin panel', 'Custom database', 'Dynamic banners'],
    stack: ['React', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL'],
    images: ['/images/dresscode-1.jpg', '/images/dresscode-2.jpg', '/images/dresscode-3.jpg'],
    url: 'https://dresscode-rho.vercel.app/',
  },
  sos: {
    features: ['Survival mechanics', 'Expedition system', 'Procedural worlds', 'Resource economy'],
    stack: ['TypeScript', 'Canvas', 'Custom engine', 'Pathfinding'],
    images: ['/images/sos-1.jpg'],
    url: 'https://celadon-crostata-316852.netlify.app/',
  },
};

const en: SiteContent = {
  nav: {
    available: 'Accepting select projects',
    identity: 'Identity',
    contact: 'Contact',
    menuSections: 'Index',
  },
  hero: {
    status: 'Independent digital studio',
    name: 'Giannis Papadopoulos',
    tagline: 'Software with the precision of engineering and the presence of cinema.',
    desc: 'Apex Solutions designs and engineers digital products end to end — from system architecture to the last frame of motion. Nothing templated. Nothing accidental.',
    ctaWork: 'Enter the work',
    ctaTalk: 'Start a conversation',
    scroll: 'Scroll to descend',
  },
  marquee: [
    'FULL-STACK ENGINEERING',
    'INTERFACE DESIGN',
    'COMMERCE SYSTEMS',
    'REAL-TIME EXPERIENCES',
    'CREATIVE DEVELOPMENT',
    'PERFORMANCE',
  ],
  about: {
    label: 'About',
    heading: 'Engineering, with intent.',
    p1: 'Every product here is built twice — once as a system, once as an experience. The discipline is refusing to compromise either.',
    p2: 'From secure backend architecture to the easing curve of a single transition, nothing ships by default. The result is software that performs under load and feels inevitable in the hand.',
    pillars: ['Systems Architecture', 'Interface Engineering', 'Data Design', 'Motion & Interaction'],
  },
  services: {
    label: 'Capabilities',
    heading: 'What the studio does.',
    items: [
      {
        title: 'Full-Stack Platforms',
        desc: 'End-to-end product engineering — resilient architecture, clean APIs, and frontends tuned to the millisecond.',
      },
      {
        title: 'Commerce Systems',
        desc: 'Storefronts engineered for conversion: secure payment pipelines, living product databases, and a purchase path with zero friction.',
      },
      {
        title: 'Internal Tooling',
        desc: 'Bespoke dashboards and operational systems that make complex data legible, fast, and safe to act on.',
      },
      {
        title: 'Data & Security',
        desc: 'Database architecture built to scale, with privacy and security treated as design constraints — never afterthoughts.',
      },
      {
        title: 'Experience Systems',
        desc: 'Interfaces where hierarchy, motion, and interaction are designed as one continuous system — not decorated afterwards.',
      },
    ],
  },
  work: {
    label: 'Selected work',
    heading: 'Built. Shipped. Live.',
    cta: 'Live preview',
    projects: [
      {
        title: 'A25 — The Agency',
        tagline: 'Production platform for a licensed recruitment agency.',
        desc: 'The live, five-language platform of A25 — a licensed agency connecting North Macedonian businesses with verified workforce from Asia. Employer and candidate application flows, a custom live-chat widget answered through Telegram, and automated email pipelines. Running in production at a25.mk.',
        ...PROJECT_META.a25,
      },
      {
        title: 'Apex Shift',
        tagline: 'Shift intelligence for people who bill by the hour.',
        desc: 'A scheduling and earnings platform for individuals and teams — hours, rates, and complex rotations orchestrated in one place. Built radically personal: every field, rule, and view bends to its user.',
        ...PROJECT_META.shift,
      },
      {
        title: 'Dresscode',
        tagline: 'A complete fashion commerce platform.',
        desc: 'Fashion e-commerce, end to end: a polished storefront with dynamic hero banners, a full order pipeline, admin tooling, and a custom database layer carrying it all.',
        ...PROJECT_META.dresscode,
      },
      {
        title: 'Surviving of Souls',
        tagline: 'A 2D survival expedition engine.',
        desc: 'A top-down survival game on a custom canvas engine — procedurally generated expeditions, resource economies, crafting and shelter systems in hostile pixel worlds.',
        ...PROJECT_META.sos,
      },
    ],
  },
  experience: {
    label: 'Trajectory',
    heading: 'The road to Apex.',
    jobs: [
      {
        role: 'Founder & Lead Engineer',
        company: 'Apex Solutions',
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
    label: 'Instruments',
    heading: 'The instrument set.',
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
  contact: {
    label: 'Contact',
    headingA: 'Make it',
    headingB: 'inevitable.',
    desc: 'If your product deserves more than a template, the inbox is open.',
    emailLabel: 'Direct line',
    footerNote: 'Designed & engineered in-house.',
  },
  brand: {
    title: 'Brand Identity',
    logomark: 'Logomark',
    typography: 'Typography',
    palette: 'Palette',
    displayName: 'Display / Clash Display',
    displayDesc: 'Headlines and hero statements. Oversized, high-contrast, unapologetic.',
    bodyName: 'Body / General Sans',
    bodyDesc: 'Body copy and interface text. Geometric, quiet, precise.',
    colors: [
      { name: 'Void', hex: '#030309' },
      { name: 'Volt', hex: '#4D7CFF' },
      { name: 'Plasma', hex: '#8A5CFF' },
      { name: 'Flare', hex: '#FF4FD8' },
    ],
  },
  preview: {
    loading: 'Loading live site…',
    hint: 'If the site refuses to connect inside a frame, open it directly.',
    open: 'Open in new tab',
    close: 'Close',
  },
};

const el: SiteContent = {
  nav: {
    available: 'Δεκτά επιλεγμένα projects',
    identity: 'Ταυτότητα',
    contact: 'Επικοινωνία',
    menuSections: 'Ευρετήριο',
  },
  hero: {
    status: 'Ανεξάρτητο ψηφιακό στούντιο',
    name: 'Γιάννης Παπαδόπουλος',
    tagline: 'Λογισμικό με την ακρίβεια της μηχανικής και την αίσθηση του κινηματογράφου.',
    desc: 'Η Apex Solutions σχεδιάζει και κατασκευάζει ψηφιακά προϊόντα από άκρη σε άκρη — από την αρχιτεκτονική του συστήματος μέχρι το τελευταίο καρέ της κίνησης. Τίποτα έτοιμο. Τίποτα τυχαίο.',
    ctaWork: 'Δείτε τη δουλειά',
    ctaTalk: 'Ας μιλήσουμε',
    scroll: 'Κύλιση για κάθοδο',
  },
  marquee: [
    'FULL-STACK ENGINEERING',
    'ΣΧΕΔΙΑΣΜΟΣ ΔΙΕΠΑΦΩΝ',
    'ΣΥΣΤΗΜΑΤΑ E-COMMERCE',
    'REAL-TIME ΕΜΠΕΙΡΙΕΣ',
    'CREATIVE DEVELOPMENT',
    'ΕΠΙΔΟΣΕΙΣ',
  ],
  about: {
    label: 'Σχετικά',
    heading: 'Μηχανική, με πρόθεση.',
    p1: 'Κάθε προϊόν εδώ χτίζεται δύο φορές — μία ως σύστημα, μία ως εμπειρία. Η πειθαρχία είναι να μη θυσιάζεται κανένα από τα δύο.',
    p2: 'Από την ασφαλή backend αρχιτεκτονική μέχρι την καμπύλη μιας και μόνο μετάβασης, τίποτα δεν φεύγει «όπως ήρθε». Το αποτέλεσμα: λογισμικό που αντέχει υπό φορτίο και μοιάζει αναπόφευκτο στο χέρι.',
    pillars: ['Αρχιτεκτονική Συστημάτων', 'Interface Engineering', 'Σχεδιασμός Δεδομένων', 'Κίνηση & Αλληλεπίδραση'],
  },
  services: {
    label: 'Δυνατότητες',
    heading: 'Τι κάνει το στούντιο.',
    items: [
      {
        title: 'Full-Stack Πλατφόρμες',
        desc: 'Ολοκληρωμένη κατασκευή προϊόντων — ανθεκτική αρχιτεκτονική, καθαρά APIs και frontends ρυθμισμένα στο χιλιοστό του δευτερολέπτου.',
      },
      {
        title: 'Συστήματα E-Commerce',
        desc: 'Καταστήματα σχεδιασμένα για μετατροπές: ασφαλείς ροές πληρωμών, ζωντανές βάσεις προϊόντων και διαδρομή αγοράς χωρίς καμία τριβή.',
      },
      {
        title: 'Εσωτερικά Εργαλεία',
        desc: 'Custom dashboards και λειτουργικά συστήματα που κάνουν τα σύνθετα δεδομένα ευανάγνωστα, γρήγορα και ασφαλή στη χρήση.',
      },
      {
        title: 'Δεδομένα & Ασφάλεια',
        desc: 'Αρχιτεκτονική βάσεων φτιαγμένη για κλιμάκωση, με το απόρρητο και την ασφάλεια ως σχεδιαστικές αρχές — ποτέ ως δεύτερη σκέψη.',
      },
      {
        title: 'Συστήματα Εμπειρίας',
        desc: 'Διεπαφές όπου ιεραρχία, κίνηση και αλληλεπίδραση σχεδιάζονται ως ένα ενιαίο σύστημα — όχι ως διακόσμηση εκ των υστέρων.',
      },
    ],
  },
  work: {
    label: 'Επιλεγμένα έργα',
    heading: 'Χτισμένα. Παραδομένα. Live.',
    cta: 'Ζωντανή προεπισκόπηση',
    projects: [
      {
        title: 'A25 — The Agency',
        tagline: 'Πλατφόρμα παραγωγής για αδειοδοτημένο γραφείο εύρεσης προσωπικού.',
        desc: 'Η ζωντανή, πεντάγλωσση πλατφόρμα της A25 — ενός αδειοδοτημένου γραφείου που συνδέει επιχειρήσεις της Βόρειας Μακεδονίας με πιστοποιημένο εργατικό δυναμικό από την Ασία. Ροές αιτήσεων για εργοδότες και υποψηφίους, custom live chat με απαντήσεις μέσω Telegram και αυτοματοποιημένα email. Σε παραγωγή στο a25.mk.',
        ...PROJECT_META.a25,
      },
      {
        title: 'Apex Shift',
        tagline: 'Ευφυΐα βαρδιών για όσους χρεώνουν με την ώρα.',
        desc: 'Πλατφόρμα προγραμματισμού και υπολογισμού εσόδων για άτομα και ομάδες — ώρες, αμοιβές και σύνθετες ροτάσιες, ενορχηστρωμένες σε ένα μέρος. Ριζικά προσωπική: κάθε πεδίο, κανόνας και προβολή προσαρμόζεται στον χρήστη της.',
        ...PROJECT_META.shift,
      },
      {
        title: 'Dresscode',
        tagline: 'Μια ολοκληρωμένη πλατφόρμα fashion commerce.',
        desc: 'E-commerce μόδας από άκρη σε άκρη: γυαλισμένη βιτρίνα με δυναμικά hero banners, πλήρης ροή παραγγελιών, εργαλεία διαχείρισης και custom βάση δεδομένων που τα στηρίζει όλα.',
        ...PROJECT_META.dresscode,
      },
      {
        title: 'Surviving of Souls',
        tagline: 'Μια 2D μηχανή επιβίωσης και αποστολών.',
        desc: 'Top-down παιχνίδι επιβίωσης σε custom canvas engine — διαδικαστικά παραγόμενες αποστολές, οικονομίες πόρων, crafting και συστήματα καταφυγίου σε εχθρικούς pixel κόσμους.',
        ...PROJECT_META.sos,
      },
    ],
  },
  experience: {
    label: 'Πορεία',
    heading: 'Ο δρόμος προς το Apex.',
    jobs: [
      {
        role: 'Ιδρυτής & Lead Engineer',
        company: 'Apex Solutions',
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
    label: 'Όργανα',
    heading: 'Τα εργαλεία της δουλειάς.',
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
  contact: {
    label: 'Επικοινωνία',
    headingA: 'Κάντε το',
    headingB: 'αναπόφευκτο.',
    desc: 'Αν το προϊόν σας αξίζει κάτι παραπάνω από ένα template, το inbox είναι ανοιχτό.',
    emailLabel: 'Απευθείας γραμμή',
    footerNote: 'Σχεδιασμένο & κατασκευασμένο in-house.',
  },
  brand: {
    title: 'Ταυτότητα',
    logomark: 'Λογότυπο',
    typography: 'Τυπογραφία',
    palette: 'Παλέτα',
    displayName: 'Display / Clash Display',
    displayDesc: 'Τίτλοι και δηλώσεις ήρωα. Υπερμεγέθεις, υψηλής αντίθεσης, χωρίς απολογίες.',
    bodyName: 'Body / General Sans',
    bodyDesc: 'Κείμενο και στοιχεία διεπαφής. Γεωμετρικό, ήσυχο, ακριβές.',
    colors: [
      { name: 'Void', hex: '#030309' },
      { name: 'Volt', hex: '#4D7CFF' },
      { name: 'Plasma', hex: '#8A5CFF' },
      { name: 'Flare', hex: '#FF4FD8' },
    ],
  },
  preview: {
    loading: 'Φόρτωση ζωντανού site…',
    hint: 'Αν το site αρνηθεί τη σύνδεση μέσα σε πλαίσιο, ανοίξτε το απευθείας.',
    open: 'Άνοιγμα σε νέα καρτέλα',
    close: 'Κλείσιμο',
  },
};

/** DE/FR/MK/IT intentionally alias EN until their premium copy pass — see ACTIVE_LOCALES. */
export const content: Record<LanguageCode, SiteContent> = {
  en,
  el,
  de: en,
  fr: en,
  mk: en,
  it: en,
};

export const EMAIL = 'yioyiomenyioyiomen@gmail.com';

export const SOCIALS = [
  { label: 'GitHub', handle: 'qolar-pro', url: 'https://github.com/qolar-pro' },
  { label: 'LinkedIn', handle: 'blanco-xd', url: 'https://www.linkedin.com/in/blanco-xd-06313b268' },
  { label: 'Instagram', handle: 'Giannispdl._', url: 'https://instagram.com/Giannispdl._' },
  { label: 'TikTok', handle: 'thyswedishguy', url: 'https://tiktok.com/@thyswedishguy' },
];
