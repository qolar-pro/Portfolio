import type { Metadata } from 'next';
import { ArticleIndex } from '@/components/ArticleIndex';
import { CtaBand } from '@/components/CtaBand';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { SiteFooter } from '@/components/SiteFooter';
import { articles } from '@/lib/blog';
import { ROUTES } from '@/lib/content';
import { resolveLang } from '@/lib/params';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang, c } = await resolveLang(params);
  return pageMetadata({
    lang,
    path: ROUTES.blog,
    title: c.routes.blog.title,
    description: c.routes.blog.lede,
  });
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, c } = await resolveLang(params);

  return (
    <>
      <Nav lang={lang} c={c} />
      <main id="main">
        <PageHero c={c} route="blog" />
        <section className="section">
          <div className="shell">
            <ArticleIndex items={articles[lang]} lang={lang} readMore={c.blog.readMore} />
          </div>
        </section>
      </main>
      <CtaBand c={c} lang={lang} />
      <SiteFooter c={c} lang={lang} />
    </>
  );
}
