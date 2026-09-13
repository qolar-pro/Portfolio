/* The two-line display headline. `a` renders in body ink, `b` in the accent,
   and every character is wrapped in its own span so each can animate and
   react to the pointer independently.

   EVERY style this component has is scoped to `.hero h1` — the size, the
   uppercase, the accent colour on the second line, the per-letter float. Drop
   the <h1> on a page without that ancestor and it renders as small black
   italic body text, which is what the first version of this preview did. So
   the preview composes the real hero markup around it; that is the only
   render that is true, and it doubles as the wrapper the design agent must
   copy when it places this component. */
import { HeroTitle } from 'novafaber';

const Hero = ({ children }: { children: React.ReactNode }) => (
  <section className="hero" style={{ minHeight: 'auto', padding: '32px 0' }}>
    <div className="shell">
      <div className="hero-copy">{children}</div>
    </div>
  </section>
);

/** The line the site itself ships. */
export const Default = () => (
  <Hero>
    <HeroTitle a="Built from" b="scratch." />
  </Hero>
);

/** About as long as either line can go. The size is a vw clamp, so past
    roughly fourteen characters a line breaks mid-word and the first glyph
    clips — this component wants short, declarative lines, not sentences. */
export const Longest = () => (
  <Hero>
    <HeroTitle a="Websites that" b="actually convert." />
  </Hero>
);

/** Short lines set very large — the case the clamp is tuned for. */
export const Short = () => (
  <Hero>
    <HeroTitle a="We build" b="software." />
  </Hero>
);
