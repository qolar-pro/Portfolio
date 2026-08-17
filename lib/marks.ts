/**
 * Client marks, keyed by project slug.
 *
 * Two of these are the sites' real favicons (A25's logo, Sneaker Air's SVG).
 * KD Law's shipped icon is 32px and disintegrates when scaled up, so its mark
 * is redrawn to match their header; Nova Shift ships none at all. Both redraws
 * live in /public/marks and are labelled as such.
 *
 * `bg` is each brand's own ground — the logos read the way they do on their
 * own sites rather than fighting our dark panel.
 *
 * Used by the homepage work tiles and by the "why they chose us" panel.
 */
export const MARKS: Record<string, { src: string; bg: string }> = {
  a25: { src: '/marks/a25.jpeg', bg: '#0e1a2e' },
  'kd-law': { src: '/marks/kdlaw.svg', bg: '#f7f4ef' },
  'sneaker-air': { src: '/marks/sneaker.svg', bg: '#1a1636' },
  'nova-shift': { src: '/marks/novashift.svg', bg: '#131316' },
};
