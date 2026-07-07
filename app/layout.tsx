import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const clash = localFont({
  src: './fonts/ClashDisplay-Variable.woff2',
  variable: '--font-clash',
  weight: '200 700',
  display: 'swap',
});

const general = localFont({
  src: './fonts/GeneralSans-Variable.woff2',
  variable: '--font-general',
  weight: '200 700',
  display: 'swap',
});

const jbmono = localFont({
  src: [
    { path: './fonts/JetBrainsMono-Regular.woff2', weight: '400' },
    { path: './fonts/JetBrainsMono-Medium.woff2', weight: '500' },
  ],
  variable: '--font-jbmono',
  display: 'swap',
});

const SITE_URL = 'https://blancographics.xyz';
const DESCRIPTION =
  'Apex Solutions is the independent digital studio of Giannis Papadopoulos — designing and engineering cinematic, high-performance software end to end.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Apex Solutions — Independent Digital Studio',
    template: '%s · Apex Solutions',
  },
  description: DESCRIPTION,
  applicationName: 'Apex Solutions',
  authors: [{ name: 'Giannis Papadopoulos', url: SITE_URL }],
  creator: 'Giannis Papadopoulos',
  publisher: 'Apex Solutions',
  category: 'technology',
  keywords: [
    'Apex Solutions',
    'Giannis Papadopoulos',
    'digital studio',
    'creative developer',
    'web design',
    'WebGL',
    'three.js',
    'React',
    'Next.js',
    'interaction design',
    'frontend engineering',
    'portfolio',
    'blancographics',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Apex Solutions',
    url: SITE_URL,
    title: 'Apex Solutions — Independent Digital Studio',
    description: 'Software with the precision of engineering and the presence of cinema.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apex Solutions — Independent Digital Studio',
    description: 'Software with the precision of engineering and the presence of cinema.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
};

// JSON-LD: identify the person, the studio, and the site for rich results.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Giannis Papadopoulos',
      url: SITE_URL,
      email: 'mailto:yioyiomenyioyiomen@gmail.com',
      jobTitle: 'Digital Designer & Software Engineer',
      worksFor: { '@id': `${SITE_URL}/#studio` },
      sameAs: [
        'https://github.com/qolar-pro',
        'https://www.linkedin.com/in/blanco-xd-06313b268',
        'https://instagram.com/Giannispdl._',
        'https://tiktok.com/@thyswedishguy',
      ],
    },
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${SITE_URL}/#studio`,
      name: 'Apex Solutions',
      alternateName: 'Blanco Graphics',
      url: SITE_URL,
      email: 'mailto:yioyiomenyioyiomen@gmail.com',
      description: DESCRIPTION,
      founder: { '@id': `${SITE_URL}/#person` },
      sameAs: [
        'https://github.com/qolar-pro',
        'https://www.linkedin.com/in/blanco-xd-06313b268',
        'https://instagram.com/Giannispdl._',
        'https://tiktok.com/@thyswedishguy',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Apex Solutions',
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#studio` },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: '#030309',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${clash.variable} ${general.variable} ${jbmono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
