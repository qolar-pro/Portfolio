/* The light/dark switch. It renders the server default, then corrects itself
   on mount, and drives the swap through a view transition where the browser
   supports one. */
import { ThemeToggle } from 'novafaber';

/* ThemeToggle reads exactly four strings off the content object — the labels
   below — so a preview supplies that slice rather than the whole site tree. */
const c = {
  theme: {
    dark: 'Dark',
    light: 'Light',
    toDark: 'Switch to dark',
    toLight: 'Switch to light',
  },
} as never;

/** As it sits in the nav island. */
export const Default = () => <ThemeToggle c={c} />;
