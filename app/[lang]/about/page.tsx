import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { SiteFooter } from '@/components/SiteFooter';
import { ROUTES } from '@/lib/content';
import { resolveLang } from '@/lib/params';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang, c } = await resolveLang(params);
  return pageMetadata({
    lang,
    path: ROUTES.about,
    title: c.routes.about.title,
    description: c.routes.about.lede,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, c } = await resolveLang(params);

  return (
    <>
      <Nav lang={lang} c={c} />
      <main id="main">
        <PageHero c={c} route="about" />

        <section className="section">
          <div className="shell">
            <Reveal className="about-grid">
              <div>
                <p>{c.about.p1}</p>
                <p>{c.about.p2}</p>
              </div>
              <ul className="pillars">
                {c.about.pillars.map((p, i) => (
                  <li key={p}>
                    <span>0{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="timeline">
              <p className="eyebrow" data-anim="fade">{c.about.trajectoryLabel}</p>
              <h2 className="h2" style={{ marginBottom: 34 }}>
                {c.about.trajectoryHeading}
              </h2>
              {c.about.jobs.map((j) => (
                <div className="job" key={`${j.company}-${j.period}`}>
                  <div className="period">{j.period}</div>
                  <div>
                    <h3>{j.role}</h3>
                    <p className="co">{j.company}</p>
                    <p>{j.desc}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="shell">
            <Reveal className="sec-head">
              <p className="eyebrow" data-anim="fade">{c.stack.label}</p>
              <h2 className="h2" data-anim="clip">{c.stack.heading}</h2>
              <p className="lede">{c.stack.lede}</p>
            </Reveal>
            <Reveal>
              <div className="stack-grid">
                {c.stack.groups.map((g) => (
                  <div className="sg" key={g.title}>
                    <h3>{g.title}</h3>
                    <p>{g.desc}</p>
                    <div className="chips">
                      {g.skills.map((s) => (
                        <span className="chip" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <CtaBand c={c} lang={lang} />
      <SiteFooter c={c} lang={lang} />
    </>
  );
}
