import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { SiteFooter } from '@/components/SiteFooter';
import { EMAIL, ROUTES } from '@/lib/content';
import { resolveLang } from '@/lib/params';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang, c } = await resolveLang(params);
  return pageMetadata({
    lang,
    path: ROUTES.book,
    title: c.routes.book.title,
    description: c.routes.book.lede,
  });
}

export default async function BookPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, c } = await resolveLang(params);

  return (
    <>
      <Nav lang={lang} c={c} />
      <main>
        <PageHero c={c} route="book" />

        <section className="section contact">
          <div className="shell contact-grid">
            <Reveal>
              {/* what the call actually is, so nobody books it expecting a demo */}
              <div className="steps-flat">
                {c.process.steps.slice(0, 1).map((s) => (
                  <div className="step-flat" key={s.title}>
                    <div className="step-flat-n">01</div>
                    <div>
                      <h2>{s.title}</h2>
                      <p className="step-desc">{s.desc}</p>
                      <p className="step-out">
                        <span className="step-out-label">→</span>
                        {s.deliverable}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="direct">
                <p className="meta-label">{c.contact.emailLabel}</p>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ContactForm c={c} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter c={c} lang={lang} />
    </>
  );
}
