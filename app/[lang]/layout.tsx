import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JetBrains_Mono, Sofia_Sans_Condensed, Source_Serif_4 } from 'next/font/google';
import '../globals.css';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { StructuredData } from '@/components/StructuredData';
import { BRAND, FOUNDER, LANGS, content, type Lang } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

/* `cyrillic` is required by the Macedonian locale — without it every Cyrillic
   glyph falls back to a system face and the page silently changes typeface
   mid-sentence for company names like "Клинче и Димовски". */
const display = Sofia_Sans_Condensed({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const body = Source_Serif_4({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  weight: ['400', '500'],
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

export const viewport = {
  themeColor: '#141416',
  colorScheme: 'dark' as const,
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

  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <StructuredData lang={lang as Lang} />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
