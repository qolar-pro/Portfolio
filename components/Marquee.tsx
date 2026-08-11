/**
 * Capability strip.
 *
 * DD-14 allows a marquee where continuous motion carries meaning rather than
 * being decoration — a list of capabilities that never ends is a reasonable
 * thing to show scrolling. It pauses on hover so it can actually be read,
 * and stops entirely under `prefers-reduced-motion`.
 *
 * The track is rendered twice so the loop has no seam; the duplicate is
 * `aria-hidden` so a screen reader hears the list once.
 */
export default function Marquee({ items }: { items: string[] }) {
  const track = (
    <div className="marquee__track">
      {items.map((item) => (
        <span
          key={item}
          className="flex shrink-0 items-center gap-3 font-display text-2xl whitespace-nowrap text-forge-ink-soft"
        >
          {item}
          <span aria-hidden className="text-heat-ember">
            ✳
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee border-y border-forge-rule py-5">
      {track}
      <div aria-hidden>{track}</div>
    </div>
  );
}
