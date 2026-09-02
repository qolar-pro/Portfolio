import { THEME_INIT_SCRIPT } from '@/lib/theme';

/**
 * Renders the theme resolver as a blocking script inside <head>.
 *
 * It has to be blocking and it has to be inline. A deferred or external
 * script runs after the first paint, which is exactly the flash of the wrong
 * theme this exists to prevent — a visitor on a light-mode phone would see a
 * black page for one frame on every single navigation.
 *
 * `suppressHydrationWarning` on <html> in the layout is the other half of
 * this: the server cannot know the visitor's theme, so the attribute this
 * writes will not match what the server rendered, and that mismatch is
 * intentional rather than a bug.
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
