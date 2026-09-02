import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import type { Article } from '@/lib/blog';
import type { Lang } from '@/lib/content';

/**
 * The Notes index, set as an editorial contents page rather than a card grid.
 *
 * Three articles in three equal boxes is the shape every blog on the internet
 * has, and it makes three considered pieces look like a content-marketing
 * quota. A numbered index — big title, metadata above it, excerpt below, a
 * rule between entries — is how a publication lists three long pieces, and it
 * lets the typography do the work the cards were doing with borders.
 *
 * The card grid is still the right shape on the homepage, where these sit
 * inside a section among other sections; that is what ArticleCard is for.
 */
export function ArticleIndex({
  items,
  lang,
  readMore,
}: {
  items: Article[];
  lang: Lang;
  readMore: string;
}) {
  return (
    <ol className="art-index">
      {items.map((a, i) => (
        <Reveal as="li" className="ax-item" key={a.slug} delay={i * 0.06}>
          <Link className="ax-link" href={`/${lang}/blog/${a.slug}`}>
            <span className="ax-n" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="ax-body">
              <span className="ax-meta">
                <span className="ax-tag">{a.tag}</span>
                <span className="ax-dot" aria-hidden="true">
                  ·
                </span>
                <span>{a.readingTime}</span>
                <span className="ax-dot" aria-hidden="true">
                  ·
                </span>
                <time dateTime={a.date}>
                  {new Date(a.date).toLocaleDateString(lang === 'en' ? 'en-GB' : lang, {
                    year: 'numeric',
                    month: 'long',
                  })}
                </time>
              </span>
              <h2 className="ax-title" data-anim="clip">{a.title}</h2>
              <span className="ax-excerpt">{a.excerpt}</span>
              <span className="ax-more">
                {readMore}
                <span aria-hidden="true"> →</span>
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </ol>
  );
}
