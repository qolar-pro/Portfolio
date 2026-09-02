/**
 * The anvil, with the spark struck off it.
 *
 * The anvil takes `currentColor` so it inherits whatever it sits on; the
 * spark is the one place the studio accent appears inside the mark, and it
 * reads it from the `--accent` token rather than hardcoding a hex — so it
 * recalibrates with the theme exactly like every other accent on the page.
 * It used to be a literal #ff6a13, which is how a logo ends up the last
 * orange thing on a teal site.
 */
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M4 12h17l4.2 4.2-4.2 1.4h-1.6l-3.3 5.2 3.8 2.3v1.4H11v-1.4l3.8-2.3-3.3-5.2H9.6L4 16.2V12Z"
        fill="currentColor"
      />
      <path
        d="M23.2 4.6l1.2 3.2 3.2 1.2-3.2 1.2-1.2 3.2-1.2-3.2L18.8 9l3.2-1.2z"
        fill="var(--accent)"
      />
    </svg>
  );
}
