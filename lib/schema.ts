import { BRAND, ROUTES, content, type Lang, type RouteKey } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

/**
 * Schema.org builders for the page-level graphs.
 *
 * The site-wide Organization / WebSite / Person graph lives in
 * components/StructuredData and is emitted once per page from the layout.
 * Everything here is per-route and links back into it by @id rather than
 * repeating it — a second, slightly different Organization node on an inner
 * page is how a knowledge panel ends up split between two entities.
 *
 * ── THE RULE FOR EVERY NODE IN HERE ───────────────────────────────────
 * Structured data is the one surface where an exaggeration is machine
 * readable and machine punished. Nothing below asserts anything the page
 * does not already say in words to a human: the FAQ nodes are the questions
 * actually rendered on /services, and the breadcrumb is the route the visitor
 * actually walked. There is deliberately no aggregateRating and no review
 * markup — there are no published reviews yet, and inventing them is what
 * gets a site's rich results pulled entirely.
 */

/**
 * FAQPage, built from the same array the accordion renders.
 *
 * Google will only show an FAQ rich result when the answers are visible on
 * the page, which is why this takes the rendered content rather than a
 * separate SEO-only list — they cannot drift apart, because there is only one
 * of them.
 */
export function faqSchema(lang: Lang) {
  const c = content[lang];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/${lang}${ROUTES.services}#faq`,
    inLanguage: lang,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: c.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/**
 * BreadcrumbList for an inner route.
 *
 * Two levels is the whole tree here — the site is flat by design — and a
 * two-item breadcrumb is still worth emitting: it is what puts "novafaber.com
 * › Services" in the result instead of a bare truncated URL.
 */
export function breadcrumbSchema(lang: Lang, route: RouteKey, fallback: string) {
  const c = content[lang];
  /* A crumb is a label, not a headline. Handing it the route's page title
     produced "NovaFaber › Everything a modern studio should carry." in the
     markup — a full sentence where a search result shows one or two words.
     The nav already holds the short name for exactly this route, so use it
     and keep the title only for a route that has no nav entry. */
  const label =
    c.nav.links.find((l) => l.href === ROUTES[route])?.label ?? fallback;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: BRAND,
        item: `${SITE_URL}/${lang}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: `${SITE_URL}/${lang}${ROUTES[route]}`,
      },
    ],
  };
}
