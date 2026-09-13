/* Composes the design-system stylesheet: the webfont @import and the three
   --font-* variables that next/font sets at runtime in the app, followed by
   app/globals.css verbatim. Regenerate whenever globals.css changes; the
   output is gitignored because it is derived, never authored. */
import { readFileSync, writeFileSync } from 'node:fs';
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Sofia+Sans:wght@400;500;600;700;900&family=Sofia+Sans+Condensed:wght@400;700;800;900&display=swap');

:root {
  --font-display: 'Sofia Sans Condensed';
  --font-body: 'Sofia Sans';
  --font-mono: 'JetBrains Mono';
}
`;
const css = readFileSync('app/globals.css', 'utf8');
writeFileSync('.design-sync/.cache/ds-styles.css', FONTS + '\n' + css);
console.log('  ds-styles.css:', (FONTS.length + css.length + 1), 'bytes');
