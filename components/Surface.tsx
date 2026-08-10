import type { ReactNode } from 'react';

/**
 * The two layout primitives SPEC §3.2 turns on.
 *
 * The split exists because the old site composited body copy directly over a
 * moving, graded 3D scene. Making the distinction structural — rather than a
 * thing each section remembers to honour — is what stops that recurring.
 */

/**
 * Anything someone has to read. Opaque background, capped measure, no canvas
 * behind it. Every prose surface uses this; nothing authors against a
 * full-width container, which is how the old site ended up with paragraphs
 * running the full 1500px.
 */
export function ReadingSurface({
  children,
  narrow = false,
  className = '',
}: {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
}) {
  const measure = narrow ? 'max-w-[var(--measure-narrow)]' : 'max-w-[var(--measure)]';
  return (
    <section className={`bg-ground ${className}`}>
      <div className={`mx-auto w-full ${measure} px-5 py-16 md:py-24`}>{children}</div>
    </section>
  );
}

/**
 * Hero, case-study openers, /lab. Full-bleed and canvas-ready. Deliberately
 * has no measure cap and no default padding — it is not for prose, and giving
 * it comfortable text defaults would invite prose into it.
 */
export function SpectacleSurface({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`relative w-full overflow-hidden ${className}`}>{children}</section>;
}
