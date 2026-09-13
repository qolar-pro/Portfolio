/* The studio mark. A single SVG path on currentColor, so it takes the colour
   of whatever it sits in rather than carrying its own. */
import { Logo } from 'novafaber';

/** Default 24px, as it appears in the nav. */
export const Default = () => <Logo />;

/** The sizes actually used across the site: nav, footer, and the large mark. */
export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
    <Logo size={20} />
    <Logo size={28} />
    <Logo size={48} />
    <Logo size={72} />
  </div>
);

/** On the accent fill — the mark inherits colour, it does not set it. */
export const OnAccent = () => (
  <div
    style={{
      display: 'inline-flex',
      padding: '18px 22px',
      background: 'var(--main, #5600ff)',
      color: 'var(--main-fg, #fff)',
      border: '2px solid #000',
      borderRadius: 5,
      boxShadow: '4px 4px 0 #000',
    }}
  >
    <Logo size={40} />
  </div>
);
