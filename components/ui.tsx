import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Shared primitives. Small on purpose — the design system lives in tokens
 * (app/globals.css), so these carry composition, not styling opinions.
 */

/** Mono eyebrow. Uses --text-2xs, the one size reserved for labels, never prose. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-2xs tracking-[0.14em] text-muted uppercase">{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  children,
  as: Tag = 'h2',
}: {
  eyebrow?: string;
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag className="text-3xl md:text-4xl">{children}</Tag>
    </div>
  );
}

export function Button({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const base =
    'inline-flex items-center justify-center px-6 py-3 font-display text-lg tracking-wide transition-colors';
  const styles =
    variant === 'primary'
      ? 'bg-ember text-surface hover:bg-ink'
      : 'border border-rule-strong text-ink hover:border-ink';
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

/**
 * A claim with a number. Kept deliberately plain: the credibility comes from
 * the figure being checkable, and decoration around an unverifiable number
 * reads as compensation.
 */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 bg-surface px-5 py-5">
      <span className="font-display text-4xl leading-none text-ember tabular-nums">{value}</span>
      <span className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">{label}</span>
    </div>
  );
}

/** Full-bleed band with its own background. Used to separate homepage sections. */
export function Band({
  children,
  tone = 'ground',
  className = '',
}: {
  children: ReactNode;
  tone?: 'ground' | 'surface';
  className?: string;
}) {
  const bg = tone === 'surface' ? 'bg-surface' : 'bg-ground';
  return (
    <section className={`${bg} ${className}`}>
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 md:py-24">{children}</div>
    </section>
  );
}
