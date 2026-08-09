/**
 * DD-2: Greece, North Macedonia and English are all first-class markets — no
 * locale is "primary" with the others as translations. That ruling is why
 * every locale carries a URL prefix, including English: an unprefixed `/`
 * for EN would encode exactly the hierarchy DD-2 rejects.
 *
 * DD-10: EN / EL / MK only. DE, FR and IT were stubs aliasing English in the
 * old build and are deleted. A locale ships with real copy or it does not
 * exist in this type.
 */

export const LOCALES = ['en', 'el', 'mk'] as const;

export type Locale = (typeof LOCALES)[number];

/** Used only for the bare `/` redirect, not as a content fallback. */
export const ROOT_REDIRECT_LOCALE: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  el: 'Ελληνικά',
  mk: 'Македонски',
};

/** Short form for the locale switcher. */
export const localeShortNames: Record<Locale, string> = {
  en: 'EN',
  el: 'ΕΛ',
  mk: 'МК',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
