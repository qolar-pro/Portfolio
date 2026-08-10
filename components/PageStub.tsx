import { ReadingSurface } from '@/components/Surface';

/**
 * Phase 0 placeholder, now rendering through the Phase 1 system so the
 * scaffold demonstrates the type scale and the measure cap rather than
 * bypassing them.
 *
 * Phase 2 replaces the copy; Phase 3 onward replaces the pages.
 */
export default function PageStub({ title, note }: { title: string; note: string }) {
  return (
    <ReadingSurface>
      <h1 className="text-4xl md:text-5xl">{title}</h1>
      <p className="mt-6 text-lg text-ink-soft">{note}</p>
      <p className="mt-10 font-mono text-2xs tracking-[0.14em] text-muted uppercase">
        Phase 0 — route scaffold
      </p>
    </ReadingSurface>
  );
}
