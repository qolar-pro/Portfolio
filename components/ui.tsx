import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * The component set.
 *
 * Two rules hold everything together:
 *  1. Every page opens on a forge surface (`PageHeader`) and continues in
 *     daylight. That is DD-26's metaphor applied as structure, and it is what
 *     makes fifteen pages read as one site.
 *  2. Anything that can sit on either surface takes a `tone` prop rather than
 *     hard-coding colours, because the forge tokens and the theme tokens are
 *     different sets and mixing them is the one way to produce invisible text.
 */

export type Tone = 'light' | 'forge';

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

export function Eyebrow({ children, tone = 'light' }: { children: ReactNode; tone?: Tone }) {
  return (
    <p
      className={`font-mono text-2xs tracking-[0.16em] uppercase ${
        tone === 'forge' ? 'text-heat-ember' : 'text-muted'
      }`}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  children,
  as: Tag = 'h2',
  tone = 'light',
  reveal = false,
}: {
  eyebrow?: string;
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  tone?: Tone;
  reveal?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3" {...(reveal ? { 'data-reveal': '' } : {})}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <Tag className={`text-3xl md:text-4xl ${tone === 'forge' ? 'text-forge-ink' : ''}`}>
        {children}
      </Tag>
    </div>
  );
}

export function Button({
  href,
  children,
  variant = 'primary',
  tone = 'light',
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  tone?: Tone;
  external?: boolean;
}) {
  const base =
    'inline-flex items-center justify-center px-6 py-3 font-display text-lg tracking-wide transition-colors';

  const styles =
    variant === 'primary'
      ? tone === 'forge'
        ? 'bg-heat-ember text-forge-void hover:bg-heat-bright'
        : 'bg-ember text-surface hover:bg-ink'
      : tone === 'forge'
        ? 'border border-forge-rule text-forge-ink hover:border-heat-ember hover:text-heat-ember'
        : 'border border-rule-strong text-ink hover:border-ink';

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${styles}`}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

export function Tag({ children, tone = 'light' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 font-mono text-2xs tracking-[0.08em] uppercase ${
        tone === 'forge'
          ? 'bg-forge-steel text-forge-ink-soft'
          : 'bg-surface-sunk text-ink-soft'
      }`}
    >
      {children}
    </span>
  );
}

export function Stat({
  value,
  label,
  tone = 'light',
}: {
  value: string;
  label: string;
  tone?: Tone;
}) {
  return (
    <div
      className={`flex flex-col gap-1 px-5 py-5 ${
        tone === 'forge' ? 'bg-forge-carbon' : 'bg-surface'
      }`}
    >
      <span
        className={`font-display text-4xl leading-none tabular-nums ${
          tone === 'forge' ? 'text-heat-bright' : 'text-ember'
        }`}
      >
        {value}
      </span>
      <span
        className={`font-mono text-2xs tracking-[0.08em] uppercase ${
          tone === 'forge' ? 'text-forge-muted' : 'text-muted'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Band({
  children,
  tone = 'ground',
  glow = false,
  wide = false,
  className = '',
}: {
  children: ReactNode;
  tone?: 'ground' | 'surface' | 'forge';
  glow?: boolean;
  wide?: boolean;
  className?: string;
}) {
  const bg =
    tone === 'forge'
      ? `forge ${glow ? 'forge-glow' : ''}`
      : tone === 'surface'
        ? 'bg-surface'
        : 'bg-ground';
  return (
    <section className={`${bg} ${className}`}>
      <div
        className={`mx-auto w-full px-5 py-16 md:py-24 ${wide ? 'max-w-[1320px]' : 'max-w-[1120px]'}`}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * The opener every inner page uses. One component, so a service page, a case
 * study and the contact page cannot drift apart — which is exactly what
 * happened when each was written with its own `<Band>`.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  meta,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Small facts under the lede — stack, locale count, live URL. */
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="forge forge-glow relative isolate overflow-hidden">
      <div className="mx-auto w-full max-w-[1120px] px-5 pt-20 pb-16 md:pt-28 md:pb-20">
        <div data-reveal className="flex flex-col gap-6">
          <Eyebrow tone="forge">{eyebrow}</Eyebrow>
          <h1 className="max-w-[18ch] text-4xl text-forge-ink md:text-6xl">{title}</h1>
          {lede ? (
            <p className="max-w-[var(--measure)] text-lg text-forge-ink-soft">{lede}</p>
          ) : null}
          {meta ? <div className="mt-2 flex flex-wrap items-center gap-3">{meta}</div> : null}
          {children}
        </div>
      </div>
    </section>
  );
}

/** A bordered content block. Grid-gap borders (`gap-px` on a rule background)
 *  are used everywhere else; this is for standalone panels. */
export function Panel({
  children,
  tone = 'light',
  className = '',
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`border p-6 ${
        tone === 'forge'
          ? 'border-forge-rule bg-forge-carbon text-forge-ink-soft'
          : 'border-rule bg-surface'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Card({
  href,
  title,
  children,
  tone = 'light',
  span = false,
}: {
  href?: string;
  title: string;
  children: ReactNode;
  tone?: Tone;
  span?: boolean;
}) {
  const inner = (
    <>
      <h3
        className={`text-2xl transition-colors ${
          tone === 'forge'
            ? 'text-forge-ink group-hover:text-heat-ember'
            : 'group-hover:text-ember'
        }`}
      >
        {title}
      </h3>
      <p className={tone === 'forge' ? 'text-forge-ink-soft' : 'text-ink-soft'}>{children}</p>
    </>
  );

  const cls = `group flex flex-col gap-3 p-7 transition-colors ${
    tone === 'forge' ? 'bg-forge-carbon hover:bg-forge-steel' : 'bg-ground hover:bg-surface'
  } ${span ? 'md:col-span-2' : ''}`;

  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** The dash-prefixed list used for deliverables across the site. */
export function MarkedList({
  items,
  tone = 'light',
}: {
  items: string[];
  tone?: Tone;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden
            className={`mt-[0.55em] h-px w-4 shrink-0 ${
              tone === 'forge' ? 'bg-heat-ember' : 'bg-ember'
            }`}
          />
          <span className={tone === 'forge' ? 'text-forge-ink-soft' : ''}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Grid whose cell borders come from the gap, so a stray border can't double up. */
export function GridRule({
  children,
  cols = 'md:grid-cols-3',
  tone = 'light',
  className = '',
}: {
  children: ReactNode;
  cols?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-px ${cols} ${tone === 'forge' ? 'bg-forge-rule' : 'bg-rule'} ${className}`}
    >
      {children}
    </div>
  );
}
