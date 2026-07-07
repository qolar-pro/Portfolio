'use client';

import ModalShell from './ModalShell';
import { useApp } from '@/components/AppState';

export default function Preview() {
  const { t, previewUrl, setPreviewUrl } = useApp();
  if (!previewUrl) return null;

  return (
    <ModalShell onClose={() => setPreviewUrl(null)} maxWidth="max-w-6xl">
      <div className="flex items-center justify-between gap-4 border-b border-fog/10 px-5 py-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-volt/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-plasma/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-flare/80" />
          </div>
          <span className="truncate font-mono text-[11px] tracking-[0.08em] text-mist">{previewUrl}</span>
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="font-mono text-[10px] tracking-[0.2em] text-mist uppercase transition-colors duration-300 hover:text-fog"
          >
            {t.preview.open} ↗
          </a>
          <button
            onClick={() => setPreviewUrl(null)}
            data-cursor="link"
            className="font-mono text-[10px] tracking-[0.2em] text-mist uppercase transition-colors duration-300 hover:text-flare"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="relative h-[78vh] bg-void">
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-plasma border-t-transparent" />
          <p className="font-display text-base font-medium text-fog">{t.preview.loading}</p>
          <p className="max-w-sm font-mono text-[10px] leading-relaxed tracking-[0.1em] text-ghost uppercase">
            {t.preview.hint}
          </p>
        </div>
        <iframe
          src={previewUrl}
          className="relative z-10 h-full w-full border-0"
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title="Live preview"
        />
      </div>
    </ModalShell>
  );
}
