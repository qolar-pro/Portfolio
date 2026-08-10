import Link from 'next/link';
import Logomark from '@/components/Logomark';
import { ROUTES, href } from '@/lib/routes';
import { SITE_NAME, CONTACT_EMAIL, FOUNDER_NAME } from '@/lib/site';
import { contentFor } from '@/lib/content';
import type { Locale } from '@/lib/locales';

/**
 * The footer.
 *
 * Forge tone, and structured rather than a flat link list — grouped by what a
 * visitor is trying to do (buy, verify, contact) instead of by the shape of
 * the route tree. Ends on the ownership promise, because that is the argument
 * that closes deals in this market and a footer is read by people who are
 * still deciding.
 */
export default function SiteFooter({ locale }: { locale: Locale }) {
  const c = contentFor(locale);
  const labels = c.chrome.navLabels;

  const services = ROUTES.filter((r) => r.group === 'services');
  const proof = ROUTES.filter((r) => ['work', 'lab', 'process', 'studio'].includes(r.key));

  return (
    <footer className="forge mt-auto border-t border-forge-rule">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link href={href(locale, '')} className="flex items-center gap-2.5 text-forge-ink">
              <Logomark size={26} />
              <span className="font-display text-xl leading-none font-semibold tracking-wide">
                NOVA<span className="text-heat-ember">FABER</span>
              </span>
            </Link>
            <p className="max-w-[34ch] text-sm text-forge-ink-soft">{c.chrome.footerNote}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono text-2xs tracking-[0.08em] text-heat-ember uppercase underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <FooterColumn title="Services">
            {services.map((r) => (
              <FooterLink key={r.key} href={href(locale, r.path)}>
                {labels[r.key] ?? r.placeholderLabel}
              </FooterLink>
            ))}
            <FooterLink href={href(locale, 'pricing')}>{labels.pricing ?? 'Pricing'}</FooterLink>
          </FooterColumn>

          <FooterColumn title="Studio">
            {proof.map((r) => (
              <FooterLink key={r.key} href={href(locale, r.path)}>
                {labels[r.key] ?? r.placeholderLabel}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Start">
            <FooterLink href={href(locale, 'contact')}>{c.chrome.ctaBook}</FooterLink>
            <FooterLink href={href(locale, 'pricing')}>{c.chrome.ctaQuote}</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-14 border-t border-forge-rule pt-6">
          <p className="max-w-[52ch] text-sm text-forge-ink-soft">
            Every project is handed over in full — domain, hosting, code and logins in your name.
            If you never speak to me again, the site keeps working and you can still change it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-2xs tracking-[0.08em] text-forge-muted uppercase">
              {SITE_NAME} — {FOUNDER_NAME}
            </p>
            <p className="font-mono text-2xs tracking-[0.08em] text-forge-muted uppercase">
              Built from scratch, obviously
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-mono text-2xs tracking-[0.14em] text-forge-muted uppercase">{title}</h2>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href: to, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={to} className="text-sm text-forge-ink-soft transition-colors hover:text-heat-ember">
        {children}
      </Link>
    </li>
  );
}
