import { ChosenPanel } from '@/components/ChosenPanel';
import { HeroTitle } from '@/components/HeroTitle';
import { CtaBand } from '@/components/CtaBand';
import { Marquee } from '@/components/Marquee';
import { Nav } from '@/components/Nav';
import { ProcessFlow } from '@/components/ProcessFlow';
import { CapabilityBrowser } from '@/components/CapabilityBrowser';
import { ArticleCard } from '@/components/ArticleCard';
import { SiteFooter } from '@/components/SiteFooter';
import { WorkGallery } from '@/components/WorkGallery';
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

      <main id="main">
        {/* ---------------- HERO ---------------- */}
        {/* Split: the statement holds the left column, one live project holds
            the right. The grid runs behind both and dissolves before the
            marquee, so the two nav islands sit on the quiet part of it. */}
        <section className="hero">
          {/* The backdrop is the contour field, drawn in the studio accent —
              the same topographic tile that runs under every panel on the
              page, so the hero is made of the site's own material rather
              than of footage sitting behind it. */}
          <div className="hero-field" aria-hidden="true">
            <div className="hero-contours" />
            <div className="hero-glow" />
            <div className="hero-vignette" />
            <div className="hero-grain" />
          </div>
          <div className="shell">
            <div className="hero-copy">
              <HeroTitle a={c.hero.headA} b={c.hero.headB} />

              <Reveal delay={0.16}>
                <p className="hero-tag" data-anim="fade" data-anim-delay="1">{c.hero.tagline}</p>
                <div className="hero-cta" data-anim="rise" data-anim-delay="2">
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
            <div className="hero-stats" data-anim-group>
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
        <ProcessFlow c={c} lang={lang} />

        {/* ---------------- SERVICES ---------------- */}
        <section className="section" id="services">
          <div className="shell">
            <Reveal className="sec-head">
              <p className="eyebrow" data-anim="fade">{c.services.label}</p>
              <h2 className="h2" data-anim="clip">{c.services.heading}</h2>
              <p className="lede">{c.services.lede}</p>
            </Reveal>
            <CapabilityBrowser c={c} lang={lang} />
          </div>
        </section>

        {/* ---------------- WORK ---------------- */}
        <section className="section" id="work">
          <div className="shell">
            <Reveal className="sec-head">
              <p className="eyebrow" data-anim="fade">{c.work.label}</p>
              <h2 className="h2" data-anim="clip">{c.work.heading}</h2>
              <p className="lede">{c.work.lede}</p>
            </Reveal>
            <WorkGallery c={c} lang={lang} />
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
                  <p className="eyebrow" data-anim="fade">{c.testimonials.label}</p>
                  <h2 className="h2" data-anim="clip">{c.testimonials.heading}</h2>
                  <p className="lede">{c.testimonials.lede}</p>
                </Reveal>
                <Testimonials c={c} />
              </div>
            </section> */}

        {/* ---------------- NOTES ---------------- */}
        <section className="section">
          <div className="shell">
            <Reveal className="sec-head">
              <p className="eyebrow" data-anim="fade">{c.blog.label}</p>
              <h2 className="h2" data-anim="clip">{c.blog.heading}</h2>
              <p className="lede">{c.blog.lede}</p>
            </Reveal>
            <div className="art-grid" data-anim-group>
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
