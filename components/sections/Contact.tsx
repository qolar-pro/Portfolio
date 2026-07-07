'use client';

import SectionShell from './SectionShell';
import { useApp } from '@/components/AppState';
import Magnetic from '@/components/Magnetic';
import TextRoll from '@/components/TextRoll';
import { EMAIL, SOCIALS } from '@/lib/i18n';
import { journey } from '@/lib/journey';

/**
 * Journey's end at the beacon. The invitation in oversized type,
 * the email as the single monumental link, socials as a quiet ledger.
 */
export default function Contact() {
  const { t } = useApp();

  const backToTop = () => {
    if (journey.scrollTo) journey.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <SectionShell id="contact" index="06" label={t.contact.label} className="min-h-screen">
      <div className="flex flex-col items-start">
        <h2 className="font-display leading-[0.92] font-bold tracking-tight uppercase">
          <span className="line-mask">
            <span className="text-[clamp(2.8rem,9vw,9rem)] text-fog">{t.contact.headingA}</span>
          </span>
          <span className="line-mask">
            <span className="text-neon text-[clamp(2.8rem,9vw,9rem)]">{t.contact.headingB}</span>
          </span>
        </h2>

        <p data-reveal className="mt-8 max-w-xl text-base leading-relaxed text-mist md:text-lg">
          {t.contact.desc}
        </p>

        {/* the monumental email */}
        <a
          href={`mailto:${EMAIL}`}
          data-cursor="link"
          data-reveal
          className="group mt-14 block w-full border-y border-fog/10 py-8 transition-colors duration-500 hover:border-plasma/50 md:py-10"
        >
          <span className="mb-2 block font-mono text-[10px] tracking-[0.35em] text-ghost uppercase">
            {t.contact.emailLabel}
          </span>
          <span className="block font-display text-[clamp(1.1rem,3.4vw,3rem)] font-medium tracking-tight break-all text-fog transition-all duration-500 group-hover:text-transparent group-hover:[background:linear-gradient(100deg,#4d7cff,#8a5cff_50%,#ff4fd8)] group-hover:[background-clip:text] group-hover:[-webkit-background-clip:text]">
            {EMAIL}
            <span className="ml-3 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:-translate-y-1">
              ↗
            </span>
          </span>
        </a>

        {/* socials ledger */}
        <div data-reveal-group className="mt-12 grid w-full grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="group flex flex-col gap-1"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] text-ghost uppercase">{social.label}</span>
              <span className="roll-trigger font-display text-sm font-medium text-mist transition-colors duration-300 group-hover:text-fog md:text-base">
                <TextRoll text={`@${social.handle}`} />
                <span className="ml-1 inline-block opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  ↗
                </span>
              </span>
              <span className="mt-1 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-volt to-flare transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        {/* footer strip */}
        <div className="mt-24 flex w-full flex-col items-start justify-between gap-6 border-t border-fog/10 pt-8 md:flex-row md:items-center">
          <span className="font-mono text-[10px] tracking-[0.25em] text-ghost uppercase">
            © {new Date().getFullYear()} Giannis Papadopoulos — Apex Solutions
          </span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-ghost uppercase">{t.contact.footerNote}</span>
          <Magnetic strength={0.35}>
            <button
              onClick={backToTop}
              data-cursor="link"
              className="group roll-trigger flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-mist uppercase transition-colors duration-300 hover:text-fog"
            >
              <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
                ↑
              </span>
              <TextRoll text="Resurface" />
            </button>
          </Magnetic>
        </div>
      </div>
    </SectionShell>
  );
}
