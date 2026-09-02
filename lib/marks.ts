/**
 * Client marks, keyed by project slug.
 *
 * All four are vector, so the strip stays crisp at any tile size and on any
 * display — A25's was the last raster holdout (a 92 KB JPEG) and is now a
 * trace of that same artwork, not a reinterpretation of it. KD Law's shipped
 * icon is 32px and disintegrates when scaled up, so its mark is redrawn to
 * match their header; Nova Shift ships none at all. Every redraw says so in
 * a comment inside its own file.
 *
 * `bg` is each brand's own ground — sampled from their artwork, so the logos
 * read the way they do on their own sites rather than fighting our panel.
 * These stay fixed across both site themes on purpose: a client's mark is
 * their colour, not ours to recalibrate.
 */
export const MARKS: Record<string, { src: string; bg: string }> = {
  a25: { src: '/marks/a25.svg', bg: '#0f0740' },
  'kd-law': { src: '/marks/kdlaw.svg', bg: '#f7f4ef' },
  'dress-code': { src: '/marks/dresscode.svg', bg: '#0c0c0c' },
  tsopouroglou: { src: '/marks/tsopouroglou.svg', bg: '#0a6136' },
  'nova-shift': { src: '/marks/novashift.svg', bg: '#131316' },
};
