import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/CtaBand';
import { Nav } from '@/components/Nav';
import { SiteFooter } from '@/components/SiteFooter';
import { Reveal } from '@/components/motion/Reveal';
import { articles, getArticle } from '@/lib/blog';
import { FOUNDER, LANGS, type Lang } from '@/lib/content';
import { resolveLang } from '@/lib/params';
import { SITE_URL, pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return LANGS.flatMap((lang) => articles[lang].map((a) => ({ lang, slug: a.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const a = getArticle(lang as Lang, slug);
  if (!a) return {};

  const base = pageMetadata({
    lang: lang as Lang,
    path: `/blog/${slug}`,
    title: a.title,
    description: a.excerpt,
  });

  return {
    ...base,
    // an article is not a `website`; the dates are what make it eligible for
    // the "published on" treatment in search results
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: a.date,
      authors: [FOUNDER],
      tags: [a.tag],
    },
  };
}

/** Article JSON-LD — one node, only fields we can actually stand behind. */
function ArticleJsonLd({ lang, slug }: { lang: Lang; slug: string }) {
  const a = getArticle(lang, slug);
  if (!a) return null;

  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: lang,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${lang}/blog/${slug}` },
    author: { '@type': 'Person', name: FOUNDER },
    publisher: { '@id': `${SITE_URL}/#organization` },
    keywords: a.tag,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }}
    />
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  const { lang, c } = await resolveLang(params as Promise<{ lang: string }>);
  const a = getArticle(lang, slug);
  if (!a) notFound();

  return (
    <>
      <ArticleJsonLd lang={lang} slug={slug} />
      <Nav lang={lang} c={c} />
      <main id="main">
        <header className="page-hero article-hero">
          <div className="page-hero-pattern" aria-hidden="true" />
          <div className="shell">
            <Reveal>
              <Link className="back-link" href={`/${lang}/blog`}>
                <span aria-hidden="true">←</span> {c.blog.label}
              </Link>
              <div className="art-meta" style={{ marginTop: 20 }}>
                <span className="art-tag">{a.tag}</span>
                <span>{a.readingTime}</span>
              </div>
              <h1 className="article-title">{a.title}</h1>
              <p className="lede">{a.excerpt}</p>
            </Reveal>
          </div>
        </header>

        <article className="section">
          <div className="shell prose">
            {a.body.map((b, i) => {
              if (b.t === 'h') return <h2 key={i}>{b.s}</h2>;
              if (b.t === 'quote') return <blockquote key={i}>{b.s}</blockquote>;
              if (b.t === 'ul')
                return (
                  <ul key={i}>
                    {b.s.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                );
              return <p key={i}>{b.s}</p>;
            })}
          </div>
        </article>
      </main>
      <CtaBand c={c} lang={lang} />
      <SiteFooter c={c} lang={lang} />
    </>
  );
}
