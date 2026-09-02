/**
 * The theme contract, in one place.
 *
 * Three pieces have to agree on these strings or the site flashes: the
 * blocking script in <head> (components/ThemeScript), the toggle
 * (components/ThemeToggle) and the stylesheet's `[data-theme]` selectors.
 * They all read them from here.
 */

export type Theme = 'dark' | 'light';

/** localStorage key holding an EXPLICIT choice. Absent means "follow the OS". */
export const THEME_KEY = 'nf-theme';

/** What the site looks like before anyone has expressed a preference. */
export const DEFAULT_THEME: Theme = 'dark';

/** Browser chrome colour per theme — mirrors --surface. Used by <meta name="theme-color">. */
export const THEME_COLOR: Record<Theme, string> = {
  dark: '#141416',
  light: '#eceef2',
};

/**
 * The resolver, as a string, because it has to run before React exists.
 *
 * This is injected into a blocking <script> in <head>. It runs before the
 * first paint, so `data-theme` is already on <html> when the browser applies
 * the stylesheet — which is the whole reason there is no flash of the wrong
 * theme, on any route, in any language.
 *
 * It is deliberately tiny and deliberately defensive: localStorage throws in
 * Safari private mode and in some embedded webviews, and a theme toggle is
 * not worth a blank page. Anything that goes wrong falls through to the
 * stylesheet's own default, which is dark.
 */
export const THEME_INIT_SCRIPT = `
(function(){
  try {
    var stored = localStorage.getItem('${THEME_KEY}');
    var theme = (stored === 'dark' || stored === 'light')
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : '${DEFAULT_THEME}');
    var r = document.documentElement;
    r.setAttribute('data-theme', theme);
    r.style.colorScheme = theme;
  } catch (e) {}
})();
`.trim();
