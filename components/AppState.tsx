'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { content, type LanguageCode, type SiteContent } from '@/lib/i18n';

interface AppState {
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  t: SiteContent;
  /** preloader finished, intro sequence may run */
  loaded: boolean;
  setLoaded: (v: boolean) => void;
  brandKitOpen: boolean;
  setBrandKitOpen: (v: boolean) => void;
  previewUrl: string | null;
  setPreviewUrl: (v: string | null) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [loaded, setLoaded] = useState(false);
  const [brandKitOpen, setBrandKitOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: content[lang],
      loaded,
      setLoaded,
      brandKitOpen,
      setBrandKitOpen,
      previewUrl,
      setPreviewUrl,
    }),
    [lang, loaded, brandKitOpen, previewUrl],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside AppStateProvider');
  return ctx;
}
