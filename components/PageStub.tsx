/**
 * Phase 0 placeholder. Every route renders one of these so the tree is
 * navigable and indexable before any content exists (SPEC §5, DD-7).
 *
 * Phase 2 replaces the copy; Phase 3 onward replaces the pages themselves.
 * The measure cap is applied here from the start so no page is ever authored
 * against a full-width container — that is how the old site ended up with
 * paragraphs running the full 1500px (SPEC §2).
 */
export default function PageStub({ title, note }: { title: string; note: string }) {
  return (
    <div className="mx-auto w-full max-w-[var(--measure)] px-5 py-20 md:py-28">
      <h1 className="font-display text-4xl leading-tight font-semibold text-balance md:text-5xl">
        {title}
      </h1>
      <p className="mt-6 text-ink-soft">{note}</p>
      <p className="mt-10 font-mono text-xs tracking-wider text-muted uppercase">
        Phase 0 — route scaffold
      </p>
    </div>
  );
}
