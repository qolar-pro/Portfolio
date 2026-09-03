import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JetBrains_Mono, Sofia_Sans_Condensed, Source_Serif_4 } from 'next/font/google';
import '../globals.css';
/* Section stylesheets, after globals so they win the cascade without
   !important. See DD-4 in PROGRESS.md — they are separate files so parallel
   work cannot collide in one 3,900-line stylesheet. */
import '../css/ledger.css';
import '../css/stack.css';
import '../css/consent.css';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { MotionScope } from '@/components/motion/MotionScope';
import { CookieConsent } from '@/components/CookieConsent';
import { StructuredData } from '@/components/StructuredData';
import { VisitTracker } from '@/components/VisitTracker';
import { WelcomePanel } from '@/components/WelcomePanel';
import { ThemeScript } from '@/components/ThemeScript';
import { BRAND, FOUNDER, LANGS, content, type Lang } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';
import { THEME_COLOR } from '@/lib/theme';

/* `cyrillic` is required by the Macedonian locale — without it every Cyrillic
   glyph falls back to a system face and the page silently changes typeface
   mid-sentence for company names like "Клинче и Димовски". */
/* Only the weights the stylesheet actually sets. 300 and 500 were declared
   and never used anywhere in globals.css — on a face served across four
   subsets that is two unused files per subset, paid for on first paint. */
const display = Sofia_Sans_Condensed({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const body = Source_Serif_4({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
});

/* The mono face carries labels and eyebrows only, all at 400. */
const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

/**
 * Site-wide metadata only.
 *
 * Deliberately no `alternates` here: Next merges metadata down the tree, so a
 * canonical set at this level would be inherited by every route beneath it and
 * would tell Google that /en/work is a duplicate of /en. Canonicals and
 * hreflang are declared per route via `pageMetadata` in lib/seo.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const c = content[(LANGS as string[]).includes(lang) ? (lang as Lang) : 'en'];

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: c.meta.title, template: `%s — ${BRAND}` },
    description: c.meta.description,
    applicationName: BRAND,
    authors: [{ name: FOUNDER, url: SITE_URL }],
    creator: FOUNDER,
    publisher: BRAND,
    // stops iOS Safari turning numbers in the copy into blue phone links
    formatDetection: { telephone: false, address: false, email: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

/**
 * `themeColor` is declared per colour-scheme so the browser chrome follows
 * the page: a black iOS status bar over a white page is the giveaway that a
 * light theme was bolted on afterwards. Both entries are the `--surface`
 * token of their palette.
 *
 * `colorScheme: 'dark light'` (dark first) tells the UA the site supports
 * both and prefers dark — it is what makes form controls, scrollbars and
 * the caret match before our own CSS gets a look in. The blocking theme
 * script then pins `color-scheme` to the resolved theme on <html>.
 */
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: THEME_COLOR.dark },
    { media: '(prefers-color-scheme: light)', color: THEME_COLOR.light },
  ],
  colorScheme: 'dark light' as const,
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!(LANGS as string[]).includes(lang)) notFound();
  const c = content[lang as Lang];

  return (
    /* `suppressHydrationWarning` is required, not defensive: ThemeScript
       writes data-theme onto this element before React hydrates, and the
       server cannot know the visitor's theme to have rendered it. The
       mismatch is the mechanism, not a bug. */
    <html
      lang={lang}
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        {/* first stop for a keyboard or screen-reader visitor: the nav is
            eight links and a language switcher deep before the content */}
        <a className="skip-link" href="#main">
          {c.nav.skip}
        </a>
        <StructuredData lang={lang as Lang} />
        {/* Reports a visit only after consent is granted — see the note in
            components/VisitTracker. */}
        <VisitTracker />
        {/* the hairline that tracks how far down the page you are */}
        <div className="scroll-progress" aria-hidden="true" />
        <MotionProvider>
          <MotionScope>{children}</MotionScope>
        </MotionProvider>
        {/* Both sit outside MotionScope: neither should be swept up by the
            reveal system, and the consent banner in particular must never
            be waiting on an animation to become readable. */}
        <CookieConsent c={c} lang={lang as Lang} />
        <WelcomePanel c={c} />
      </body>
    </html>
  );
}
