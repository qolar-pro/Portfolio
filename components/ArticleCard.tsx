import Link from 'next/link';
import type { Article } from '@/lib/blog';
import { formatDate, type Lang } from '@/lib/content';

/**
 * `headingLevel` exists because the same card appears in two different
 * outlines: on /blog the articles ARE the page's content and sit directly
 * under the h1, so they are h2; on the homepage they sit under the "Notes"
 * section heading, so they are h3. Hardcoding either one puts a gap in the
 * heading outline of the other page, which is how a screen-reader user loses
 * the shape of a page while it looks perfectly fine.
 */
export function ArticleCard({
  a,
  lang,
  readMore,
  headingLevel = 3,
}: {
  a: Article;
  lang: Lang;
  readMore: string;
  headingLevel?: 2 | 3;
}) {
  const H = `h${headingLevel}` as 'h2' | 'h3';

  return (
    <Link className="art-card" data-anim="rise" href={`/${lang}/blog/${a.slug}`}>
      <div className="art-pattern" aria-hidden="true" />
      <div className="art-body">
        {/* The date was in lib/blog all along and never reached the page, so a
            visitor had no way to tell whether the studio shipped last month or
            two years ago. A <time datetime> is also what a crawler reads, so
            this is the same edit for a person and for Google. */}
        <div className="art-meta" data-anim="fade">
          <span className="art-tag">{a.tag}</span>
          <time dateTime={a.date}>{formatDate(a.date, lang)}</time>
          <span>{a.readingTime}</span>
        </div>
        <H>{a.title}</H>
        <p>{a.excerpt}</p>
        <span className="art-more">
          {readMore}
          <span aria-hidden="true"> →</span>
        </span>
      </div>
    </Link>
  );
}
