'use client';

/**
 * The no-WebGL tier: layered radial gradients approximate the nebula,
 * an SVG grain overlay approximates the film grade. Zero JavaScript cost.
 */
export default function StaticBackdrop() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 55% 40% at 18% 12%, rgba(77,124,255,0.16) 0%, transparent 65%)',
            'radial-gradient(ellipse 50% 45% at 85% 35%, rgba(255,79,216,0.10) 0%, transparent 65%)',
            'radial-gradient(ellipse 65% 50% at 50% 88%, rgba(138,92,255,0.13) 0%, transparent 70%)',
            '#030309',
          ].join(', '),
        }}
      />
      <div className="grain-overlay" />
    </div>
  );
}
