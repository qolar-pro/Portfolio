'use client';

import { useState } from 'react';

/**
 * Live site preview.
 *
 * The research teardowns were consistent on this: agency sites that link out
 * to client work lose the visitor. Framing it keeps them here.
 *
 * Many sites refuse to be framed (`X-Frame-Options`), and there is no way to
 * detect that from the parent — the load event fires either way. So this is
 * opt-in: the visitor clicks to load, and an always-visible escape hatch opens
 * it properly. Better than a silent blank rectangle, which is what the old
 * site's version could produce.
 */
export default function LivePreview({ url, name }: { url: string; name: string }) {
  const [live, setLive] = useState(false);

  return (
    <div className="border border-forge-rule bg-forge-carbon">
      <div className="flex items-center justify-between gap-4 border-b border-forge-rule px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-heat-ember" />
          <span className="font-mono text-2xs tracking-[0.08em] text-forge-muted">
            {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-2xs tracking-[0.08em] text-heat-ember uppercase underline underline-offset-4"
        >
          Open ↗
        </a>
      </div>

      <div className="relative aspect-[16/10] w-full">
        {live ? (
          <iframe
            src={url}
            title={`${name} — live site`}
            loading="lazy"
            className="absolute inset-0 h-full w-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLive(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 text-forge-ink-soft transition-colors hover:text-heat-ember"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-forge-rule transition-colors group-hover:border-heat-ember">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
                <path d="M1 1l12 7-12 7V1Z" fill="currentColor" />
              </svg>
            </span>
            <span className="font-mono text-2xs tracking-[0.12em] uppercase">
              Load the live site
            </span>
            <span className="max-w-[30ch] text-center text-xs text-forge-muted">
              Loads {name} in a frame. If it refuses to be embedded, use Open.
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
