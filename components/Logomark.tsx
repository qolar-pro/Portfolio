/**
 * The NovaFaber mark.
 *
 * An anvil's horn and face, drawn so the negative space reads as an N and the
 * struck spark sits where the hammer would land. It is not an abstract logo
 * with the name next to it — the shape is the trade, which is the same
 * argument the whole brand makes.
 *
 * Single path plus a spark, so it stays legible at 20px in a header and
 * inherits `currentColor` rather than carrying its own palette.
 */
export default function Logomark({
  size = 28,
  className = '',
  spark = true,
}: {
  size?: number;
  className?: string;
  spark?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
    >
      {/* Anvil: face, horn, waist, base. The diagonal through the waist is
          the N stroke. */}
      <path
        d="M4 11h17.5l4.5 4.5-4.5 1.5H20l-3.5 5.5 4 2.5v1.5H11.5V25l4-2.5L12 17H8.5L4 15.5V11Z"
        fill="currentColor"
      />
      <path d="M9.5 27h13v2h-13z" fill="currentColor" opacity="0.55" />
      {spark ? (
        <g>
          <path
            d="M23.5 5.5 24.8 8.9 28.2 10.2 24.8 11.5 23.5 14.9 22.2 11.5 18.8 10.2 22.2 8.9Z"
            fill="var(--heat-bright, currentColor)"
          />
        </g>
      ) : null}
    </svg>
  );
}
