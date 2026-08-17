import { ChosenPanel } from '@/components/ChosenPanel';
import { HeroTitle } from '@/components/HeroTitle';
import { HeroVideo } from '@/components/HeroVideo';
import { CtaBand } from '@/components/CtaBand';
import { Marquee } from '@/components/Marquee';
import { Nav } from '@/components/Nav';
import { ProcessPanel } from '@/components/ProcessPanel';
import { ServicePillars } from '@/components/ServicePillars';
import { ArticleCard } from '@/components/ArticleCard';
import { SiteFooter } from '@/components/SiteFooter';
import { WorkMarks } from '@/components/WorkMarks';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { WordHighlight } from '@/components/motion/WordHighlight';
import { articles } from '@/lib/blog';
import { ROUTES } from '@/lib/content';
import { resolveLang } from '@/lib/params';
import { pageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';

/* The locale home page declares its own canonical and hreflang set. Without
   this it would inherit the layout's, and every locale would compete for the
   same URL in search. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang, c } = await resolveLang(params);
  return {
    ...pageMetadata({ lang, title: c.meta.title, description: c.meta.description }),
    // the home page title is already complete — do not append the brand twice
    title: { absolute: c.meta.title },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, c } = await resolveLang(params);

  return (
    <>
      <Nav lang={lang} c={c} />

      <main>
        {/* ---------------- HERO ---------------- */}
        {/* Split: the statement holds the left column, one live project holds
            the right. The grid runs behind both and dissolves before the
            marquee, so the two nav islands sit on the quiet part of it. */}
        <section className="hero">
          <HeroVideo />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
          <div className="shell">
            <div className="hero-copy">
              <HeroTitle a={c.hero.headA} b={c.hero.headB} />

              <Reveal delay={0.16}>
                <p className="hero-tag">{c.hero.tagline}</p>
                <div className="hero-cta">
                  <Link className="btn btn-solid" href={`/${lang}${ROUTES.work}`}>
                    {c.hero.ctaWork}
                    <span className="circ" aria-hidden="true">
                      →
                    </span>
                  </Link>
                  <Link className="btn btn-ghost" href={`/${lang}${ROUTES.contact}`}>
                    {c.hero.ctaTalk}
                    <span className="circ" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </Reveal>
            </div>

          </div>
          <span className="scroll-hint">{c.hero.scroll}</span>
        </section>

        <Marquee items={c.marquee} />

        {/* the positioning line and the numbers sit between the hero and the
            process panel, on the page ground rather than over the code wall */}
        <section className="hero-under">
          <div className="shell">
            <WordHighlight text={c.hero.desc} className="hero-desc" />
            <div className="hero-stats">
              {c.hero.stats.map((s) => (
                <CountUp key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- WHY THEY CHOSE US ---------------- */}
        {/* Compact proof, high on the page. The work section further down is
            the same four clients at full size. */}
        <section className="section chosen-sec">
          <div className="shell">
            <ChosenPanel c={c} lang={lang} />
          </div>
        </section>

        {/* ---- process sits directly under the hero, per the plan ---- */}
        <ProcessPanel c={c} />

        {/* ---------------- SERVICES ---------------- */}
        <section className="section" id="services">
          <div className="shell">
            <Reveal className="sec-head">
              <p className="eyebrow">{c.services.label}</p>
              <h2 className="h2">{c.services.heading}</h2>
              <p className="lede">{c.services.lede}</p>
            </Reveal>
            <ServicePillars c={c} lang={lang} />
          </div>
        </section>

        {/* ---------------- WORK ---------------- */}
        <section className="section" id="work">
          <div className="shell">
            <Reveal className="sec-head">
              <p className="eyebrow">{c.work.label}</p>
              <h2 className="h2">{c.work.heading}</h2>
              <p className="lede">{c.work.lede}</p>
            </Reveal>
            <WorkMarks c={c} lang={lang} />
          </div>
        </section>

        {/* ---------------- TESTIMONIALS — OFF ---------------- */}
        {/* Unmounted for launch. Every quote in lib/content was written here
            rather than said by the client, so there is nothing to publish yet.
            The component, the styles and the copy are all still in the repo:
            once real quotes come back signed off, flip `approved` on each and
            put this section back.

            <section className="section">
              <div className="shell">
                <Reveal className="sec-head">
                  <p className="eyebrow">{c.testimonials.label}</p>
                  <h2 className="h2">{c.testimonials.heading}</h2>
                  <p className="lede">{c.testimonials.lede}</p>
                </Reveal>
                <Testimonials c={c} />
              </div>
            </section> */}

        {/* ---------------- NOTES ---------------- */}
        <section className="section">
          <div className="shell">
            <Reveal className="sec-head">
              <p className="eyebrow">{c.blog.label}</p>
              <h2 className="h2">{c.blog.heading}</h2>
              <p className="lede">{c.blog.lede}</p>
            </Reveal>
            <div className="art-grid">
              {articles[lang].map((a) => (
                <ArticleCard key={a.slug} a={a} lang={lang} readMore={c.blog.readMore} />
              ))}
            </div>
            <div className="pillars-cta">
              <Link className="btn btn-ghost" href={`/${lang}${ROUTES.blog}`}>
                {c.blog.all}
                <span className="circ" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <CtaBand c={c} lang={lang} />
      <SiteFooter c={c} lang={lang} />
    </>
  );
}
