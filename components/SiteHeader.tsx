'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Logomark from '@/components/Logomark';
import LocaleMenu from '@/components/LocaleMenu';
import type { Locale } from '@/lib/locales';

export interface NavChild {
  href: string;
  label: string;
  hint: string;
}

export interface NavItem {
  href: string;
  label: string;
  key: string;
  children?: NavChild[];
}

/**
 * The header.
 *
 * Ten flat links became five, because a nav is a map and a ten-item map is a
 * list. The four service pages live in a dropdown under one word; Lab moved to
 * the footer, since it is capability proof rather than a sales page and had no
 * business competing with Pricing for attention.
 *
 * Structure follows the reference: a thin utility bar, logo left, grouped nav,
 * then language and the booking CTA far right.
 */
export default function SiteHeader({
  locale,
  items,
  ctaLabel,
  ctaHref,
  utility,
}: {
  locale: Locale;
  items: NavItem[];
  ctaLabel: string;
  ctaHref: string;
  utility: string;
}) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setOpenKey(null);
  }, [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (!menuOpen && !openKey) setHidden(y > last && y > 160);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen, openKey]);

  useEffect(() => {
    if (!openKey) return;
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenKey(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenKey(null);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openKey]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      className={`sticky top-0 z-50 transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Utility bar. Carries the one fact a hesitant visitor wants before
          they commit to a click: that a person answers. */}
      <div className="hidden border-b border-forge-rule/60 bg-void/80 backdrop-blur md:block">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-1.5">
          <p className="font-mono text-2xs tracking-[0.14em] text-forge-muted uppercase">
            {utility}
          </p>
          <p className="font-mono text-2xs tracking-[0.14em] text-forge-muted uppercase">
            Replies within one working day
          </p>
        </div>
      </div>

      <div
        className={`transition-colors duration-300 ${
          scrolled ? 'border-b border-forge-rule bg-base/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div ref={navRef} className="mx-auto flex max-w-[1240px] items-center gap-8 px-5 py-3.5">
          <Link
            href={`/${locale}`}
            className="group flex shrink-0 items-center gap-2.5 text-text-primary transition-colors hover:text-ember"
          >
            <Logomark size={26} />
            <span className="font-display text-xl leading-none tracking-wide">
              NOVA<span className="text-ember">FABER</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {items.map((item) =>
              item.children ? (
                <div key={item.key} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenKey(openKey === item.key ? null : item.key)}
                    aria-expanded={openKey === item.key}
                    aria-haspopup="true"
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      isActive(item.href) || openKey === item.key
                        ? 'text-ember'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {item.label}
                    <svg
                      width="8"
                      height="5"
                      viewBox="0 0 8 5"
                      fill="none"
                      aria-hidden
                      className={`transition-transform duration-200 ${
                        openKey === item.key ? 'rotate-180' : ''
                      }`}
                    >
                      <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </button>

                  {openKey === item.key ? (
                    <div className="absolute start-0 top-full z-50 mt-4 w-[22rem] border border-forge-rule bg-surface-1 p-2 shadow-2xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group block px-4 py-3 transition-colors hover:bg-surface-2"
                        >
                          <span className="flex items-center justify-between gap-3">
                            <span className="font-display text-lg text-text-primary transition-colors group-hover:text-ember">
                              {child.label}
                            </span>
                            <span aria-hidden className="arrow-slide text-ember opacity-0 transition-opacity group-hover:opacity-100">
                              →
                            </span>
                          </span>
                          <span className="mt-0.5 block text-sm text-text-muted">{child.hint}</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`text-sm transition-colors ${
                    isActive(item.href) ? 'text-ember' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="ms-auto flex items-center gap-3">
            <LocaleMenu locale={locale} />

            {/* Booking CTA. Pill, ember fill, dark label (7.54:1 — DD-30),
                with a hairline ring that lights on hover so it reads as a
                machined control rather than a coloured rectangle. */}
            <Link
              href={ctaHref}
              className="group relative hidden items-center gap-2.5 rounded-full bg-ember py-2.5 ps-5 pe-2.5 font-display text-base tracking-wide text-base transition-colors hover:bg-ember-hot sm:inline-flex"
            >
              <span className="absolute inset-0 rounded-full ring-1 ring-ember-white/0 transition-all duration-300 group-hover:ring-ember-white/40" />
              {ctaLabel}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-base/15">
                <span aria-hidden className="arrow-slide text-sm leading-none">
                  →
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rule-strong text-text-primary transition-colors hover:border-ember hover:text-ember lg:hidden"
            >
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden>
                {menuOpen ? (
                  <path d="M1.5 1.5l12 8M13.5 1.5l-12 8" stroke="currentColor" strokeWidth="1.4" />
                ) : (
                  <path d="M0 1h15M0 5.5h15M0 10h15" stroke="currentColor" strokeWidth="1.4" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-forge-rule bg-surface-1 lg:hidden">
          <nav aria-label="Primary mobile" className="mx-auto max-w-[1240px] px-5 py-4">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="block border-b border-forge-rule py-3 font-display text-xl text-text-primary transition-colors hover:text-ember"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="mb-1 flex flex-col border-b border-forge-rule ps-4">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className="block py-2.5 text-sm text-text-secondary transition-colors hover:text-ember"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            <Link
              href={ctaHref}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-5 py-3 font-display text-lg tracking-wide text-base"
            >
              {ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
