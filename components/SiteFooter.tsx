import Link from 'next/link';
import Logomark from '@/components/Logomark';
import LiquidField from '@/components/LiquidField';
import { ROUTES, href } from '@/lib/routes';
import { SITE_NAME, CONTACT_EMAIL, FOUNDER_NAME } from '@/lib/site';
import { contentFor } from '@/lib/content';
import type { Locale } from '@/lib/locales';

/**
 * The footer.
 *
 * Carries the same liquid field as the hero, so the page closes on the surface
 * it opened with rather than falling off a cliff into a link list. Columns are
 * grouped by what a visitor is trying to do — buy, verify, start — not by the
 * shape of the route tree.
 *
 * Ends on the ownership promise, because a footer is read by people who are
 * still deciding, and that promise is the argument that closes deals here.
 */
export default function SiteFooter({ locale }: { locale: Locale }) {
  const c = contentFor(locale);
  const labels = c.chrome.navLabels;
  const services = ROUTES.filter((r) => r.group === 'services');

  return (
    <footer className="relative isolate mt-auto overflow-hidden border-t border-forge-rule bg-base">
      <LiquidField className="opacity-60" />

      <div className="mx-auto w-full max-w-[1240px] px-5 pt-20 pb-10">
        {/* Closing promise, given the weight of a statement rather than a line
            of small print. */}
        <div data-reveal className="max-w-[26ch]">
          <p className="font-mono text-2xs tracking-[0.18em] text-ember uppercase">
            When it is finished
          </p>
          <p className="mt-5 font-display text-4xl leading-[0.95] text-text-primary md:text-5xl">
            You will <span className="text-heat">own all of it.</span>
          </p>
          <p className="mt-5 max-w-[46ch] text-text-secondary">
            The domain, the hosting, the code and the logins — in your name. If you never speak to
            me again, the site keeps working and you can still change it.
          </p>
        </div>

        <div className="mt-16 grid gap-12 border-t border-forge-rule pt-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link
              href={href(locale, '')}
              className="group flex w-fit items-center gap-2.5 text-text-primary transition-colors hover:text-ember"
            >
              <Logomark size={26} />
              <span className="font-display text-xl leading-none tracking-wide">
                NOVA<span className="text-ember">FABER</span>
              </span>
            </Link>
            <p className="max-w-[32ch] text-sm text-text-secondary">{c.chrome.footerNote}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group w-fit font-mono text-2xs tracking-[0.1em] text-ember uppercase"
            >
              {CONTACT_EMAIL}
              <span className="block h-px w-0 bg-ember transition-all duration-500 group-hover:w-full" />
            </a>
          </div>

          <FooterColumn title="Services">
            {services.map((r) => (
              <FooterLink key={r.key} href={href(locale, r.path)}>
                {labels[r.key] ?? r.placeholderLabel}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Studio">
            <FooterLink href={href(locale, 'work')}>{labels.work ?? 'Work'}</FooterLink>
            <FooterLink href={href(locale, 'process')}>{labels.process ?? 'Process'}</FooterLink>
            <FooterLink href={href(locale, 'studio')}>{labels.studio ?? 'Studio'}</FooterLink>
            <FooterLink href={href(locale, 'lab')}>{labels.lab ?? 'Lab'}</FooterLink>
          </FooterColumn>

          <FooterColumn title="Start">
            <FooterLink href={href(locale, 'contact')}>{c.chrome.ctaBook}</FooterLink>
            <FooterLink href={href(locale, 'pricing')}>{labels.pricing ?? 'Pricing'}</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-forge-rule pt-6">
          <p className="font-mono text-2xs tracking-[0.1em] text-text-muted uppercase">
            {SITE_NAME} — {FOUNDER_NAME}
          </p>
          <p className="font-mono text-2xs tracking-[0.1em] text-text-muted uppercase">
            Built from scratch, obviously
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-mono text-2xs tracking-[0.16em] text-text-muted uppercase">{title}</h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

/** Underline draws from zero on hover — the one motion `chrome` allows here. */
function FooterLink({ href: to, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={to}
        className="group inline-flex w-fit flex-col text-sm text-text-secondary transition-colors hover:text-ember"
      >
        {children}
        <span className="h-px w-0 bg-ember transition-all duration-500 group-hover:w-full" />
      </Link>
    </li>
  );
}
