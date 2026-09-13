/* A seamless scrolling band. Two identical tracks sit side by side so the
   loop never shows a seam; the second is aria-hidden so a screen reader
   hears the list once. */
import { Marquee } from 'novafaber';

/** The capability band that runs under the hero. */
export const Default = () => (
  <Marquee
    items={[
      'Engineering',
      'Interface design',
      'Commerce systems',
      'Real-time experiences',
      'Creative development',
      'Performance',
    ]}
  />
);

/** A short list — the track still fills the width and loops without a gap. */
export const FewItems = () => <Marquee items={['Design', 'Build', 'Ship']} />;
