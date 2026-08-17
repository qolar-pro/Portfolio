import { Reveal } from '@/components/motion/Reveal';
import type { RouteKey, SiteContent } from '@/lib/content';

/**
 * Inner-route hero. Same type scale and pattern language as the homepage
 * hero, at about half the height — a landing page announces, a section page
 * orients.
 */
export function PageHero({ c, route }: { c: SiteContent; route: RouteKey }) {
  const r = c.routes[route];

  return (
    <header className="page-hero">
      <div className="page-hero-pattern" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{r.eyebrow}</p>
          <h1 className="page-title">{r.title}</h1>
          <p className="lede">{r.lede}</p>
        </Reveal>
      </div>
    </header>
  );
}
