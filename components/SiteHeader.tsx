'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logomark from '@/components/Logomark';
import LocaleMenu from '@/components/LocaleMenu';
import type { Locale } from '@/lib/locales';

export interface NavItem {
  href: string;
  label: string;
  key: string;
}

/**
 * The header.
 *
 * Forge tone throughout, in both themes — it sits above a forge hero and is
 * part of the chrome, which DD-26 keeps out of the theme's reach.
 *
 * Hides on scroll-down and returns on scroll-up. That is the one motion the
 * budget allows chrome (DD-14) and it earns its place by giving back vertical
 * space on a phone rather than by being interesting.
 */
export default function SiteHeader({
  locale,
  items,
  ctaLabel,
  ctaHref,
}: {
  locale: Locale;
  items: NavItem[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Never hide while the mobile sheet is open, and never near the top.
      if (!menuOpen) setHidden(y > last && y > 140);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  return (
    <header
      className={`forge sticky top-0 z-50 transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${scrolled ? 'border-b border-forge-rule' : ''}`}
    >
      <div className="mx-auto flex w-full max-w-[1120px] items-center gap-6 px-5 py-3.5">
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2.5 text-forge-ink transition-colors hover:text-heat-ember"
        >
          <Logomark size={26} />
          <span className="font-display text-xl leading-none font-semibold tracking-wide">
            NOVA<span className="text-heat-ember">FABER</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ms-auto hidden items-center gap-6 lg:flex">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`text-sm transition-colors ${
                  active ? 'text-heat-ember' : 'text-forge-ink-soft hover:text-forge-ink'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ms-auto flex items-center gap-3 lg:ms-0">
          <LocaleMenu locale={locale} />

          <Link
            href={ctaHref}
            className="hidden bg-heat-ember px-4 py-2 font-display text-base tracking-wide text-forge-void transition-colors hover:bg-heat-bright sm:inline-flex"
          >
            {ctaLabel}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-9 w-9 items-center justify-center border border-forge-rule text-forge-ink transition-colors hover:border-heat-ember hover:text-heat-ember lg:hidden"
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
              {menuOpen ? (
                <path d="M2 2l12 8M14 2L2 10" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M0 1h16M0 6h16M0 11h16" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-forge-rule lg:hidden">
          <nav aria-label="Primary mobile" className="mx-auto max-w-[1120px] px-5 py-4">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="block border-b border-forge-rule py-3 text-forge-ink-soft transition-colors hover:text-heat-ember"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={ctaHref}
              className="mt-5 inline-flex w-full items-center justify-center bg-heat-ember px-5 py-3 font-display text-lg tracking-wide text-forge-void"
            >
              {ctaLabel}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
