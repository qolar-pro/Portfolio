/**
 * The liquid field — the ambient background that replaced the R3F orb.
 *
 * Pure CSS. No canvas, no WebGL, no three.js. That is the point: the orb cost
 * ~700KB of deferred JavaScript and rendered through software GL wherever
 * hardware acceleration was unavailable, which is what made the homepage run
 * at ~10fps under the behaviour gate. This costs one element per blob and
 * nothing to download.
 *
 * Every blob animates `transform` only, so CLAUDE.md invariant 6 holds without
 * needing DD-41's exception — the drift is composited, not painted. The blur
 * is set once and never animated, because animating `filter` would repaint
 * every frame and is exactly the trap the invariant exists to prevent.
 *
 * Sits at `z-index: -1` behind content (invariant 1) and is `aria-hidden`.
 */

interface Blob {
  /** Percentage position within the field. */
  x: number;
  y: number;
  /** Diameter in vmax, so blobs scale with the viewport rather than reflowing. */
  size: number;
  color: string;
  /** Seconds. Deliberately co-prime-ish so the loop never visibly repeats. */
  duration: number;
  delay: number;
  opacity: number;
}

const BLOBS: Blob[] = [
  { x: 18, y: 22, size: 52, color: 'var(--color-ember)', duration: 34, delay: 0, opacity: 0.2 },
  { x: 74, y: 16, size: 40, color: 'var(--color-ember-dull)', duration: 47, delay: -8, opacity: 0.22 },
  { x: 62, y: 68, size: 58, color: 'var(--color-ember-deep)', duration: 41, delay: -19, opacity: 0.3 },
  { x: 30, y: 78, size: 34, color: 'var(--color-steel)', duration: 53, delay: -5, opacity: 0.16 },
  { x: 88, y: 52, size: 30, color: 'var(--color-ember-hot)', duration: 38, delay: -26, opacity: 0.12 },
];

export default function LiquidField({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`liquid-field pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className="liquid-blob"
          style={
            {
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}vmax`,
              height: `${b.size}vmax`,
              background: `radial-gradient(circle at 38% 34%, ${b.color} 0%, transparent 68%)`,
              opacity: b.opacity,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              // Alternate direction so adjacent blobs never drift in lockstep.
              animationDirection: i % 2 ? 'alternate-reverse' : 'alternate',
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
