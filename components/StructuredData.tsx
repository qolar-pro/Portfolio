import {
  BRAND,
  EMAIL,
  FOUNDER,
  LANGS,
  LOCATION,
  PHONE,
  SOCIALS,
  STUDIO_SOCIALS,
  content,
  type Lang,
} from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

/**
 * JSON-LD for the search engines.
 *
 * Two nodes, linked by @id: the Organization (who we are, how to reach us,
 * where we work) and the WebSite (this site, and which languages it exists
 * in). Google reads these for the knowledge panel and for sitelinks.
 *
 * Every claim in here has to be true — structured data is the one place where
 * an exaggeration is machine-readable. There is deliberately no `address`
 * and no `aggregateRating`: there is no walk-in office and there are no
 * published reviews yet, and inventing either is exactly what gets a site
 * flagged for spammy structured markup.
 */
export function StructuredData({ lang }: { lang: Lang }) {
  const c = content[lang];

  const graph = [
    /* The founder as a first-class node rather than an inline blob.
       An @id-addressable Person is what lets a search engine connect the
       studio, the article bylines and the social profiles to one human —
       which is the entire proposition of a one-person studio, and previously
       the graph only hinted at it. */
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#founder`,
      name: FOUNDER,
      jobTitle: c.founder.role,
      worksFor: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/${lang}`,
      knowsLanguage: ['en', 'el', 'mk'],
      sameAs: SOCIALS.filter((s) => !s.studio).map((s) => s.url),
    },
    {
      /* ProfessionalService alongside Organization: the same entity, but the
         narrower type is the one that carries areaServed and opening hours in
         a local result. Both, not one, because the knowledge panel reads
         Organization. */
      '@type': ['Organization', 'ProfessionalService'],
      '@id': `${SITE_URL}/#organization`,
      name: BRAND,
      url: SITE_URL,
      email: EMAIL,
      telephone: PHONE.tel,
      description: c.meta.description,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
      },
      founder: { '@id': `${SITE_URL}/#founder` },
      areaServed: [
        { '@type': 'Country', name: 'Greece' },
        { '@type': 'Country', name: 'North Macedonia' },
      ],
      location: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: LOCATION.city,
          addressRegion: LOCATION.region,
          addressCountry: LOCATION.countryCode,
        },
      },
      knowsLanguage: ['en', 'el', 'mk'],
      sameAs: STUDIO_SOCIALS.map((s) => s.url),
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: EMAIL,
          telephone: PHONE.tel,
          availableLanguage: ['English', 'Greek', 'Macedonian'],
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND,
      description: c.meta.description,
      inLanguage: LANGS,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ];

  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });

  return (
    <script
      type="application/ld+json"
      /* `<` is the only character that can break out of a script element;
         escaping it keeps this safe even if copy ever contains markup. */
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  );
}
