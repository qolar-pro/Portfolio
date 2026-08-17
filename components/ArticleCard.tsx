import Link from 'next/link';
import type { Article } from '@/lib/blog';
import type { Lang } from '@/lib/content';

export function ArticleCard({ a, lang, readMore }: { a: Article; lang: Lang; readMore: string }) {
  return (
    <Link className="art-card" href={`/${lang}/blog/${a.slug}`}>
      <div className="art-pattern" aria-hidden="true" />
      <div className="art-body">
        <div className="art-meta">
          <span className="art-tag">{a.tag}</span>
          <span>{a.readingTime}</span>
        </div>
        <h3>{a.title}</h3>
        <p>{a.excerpt}</p>
        <span className="art-more">
          {readMore}
          <span aria-hidden="true"> →</span>
        </span>
      </div>
    </Link>
  );
}
