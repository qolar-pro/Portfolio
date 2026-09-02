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
    path: ROUTES.process,
    title: c.routes.process.title,
    description: c.routes.process.lede,
  });
}

export default async function ProcessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, c } = await resolveLang(params);

  return (
    <>
      <Nav lang={lang} c={c} />
      <main id="main">
        <PageHero c={c} route="process" />

        {/* the homepage pins these; here they are laid out flat and in full,
            because someone on this route came to read rather than to be shown */}
        <section className="section">
          <div className="shell">
            {/* An ordered list, because four numbered stages that must happen
                in order is exactly what <ol> means. A screen reader now
                announces "1 of 4" without the numerals having to be read
                aloud as decoration. */}
            <ol className="steps-flat">
              {c.process.steps.map((s, i) => (
                <Reveal as="li" className="step-flat" key={s.title} delay={i * 0.05}>
                  <div className="step-flat-n" aria-hidden="true">
                    0{i + 1}
                  </div>
                  <div>
                    <h2>{s.title}</h2>
                    <p className="step-desc">{s.desc}</p>
                    <p className="step-out">
                      <span className="step-out-label" aria-hidden="true">
                        →
                      </span>
                      {s.deliverable}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <CtaBand c={c} lang={lang} />
      <SiteFooter c={c} lang={lang} />
    </>
  );
}
