'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The hero's background plate: sparks off an anvil, which is the studio's own
 * mark rather than generic technology B-roll.
 *
 * The poster ships as a CSS layer and is always there, so the frame is never
 * empty — the video is an upgrade on top of it, not the thing holding the
 * layout up. It only mounts when all three are true:
 *
 *   - the visitor has not asked for reduced motion
 *   - the viewport is wide enough to be a desktop (the file is ~9 MB)
 *   - the connection is not flagged save-data
 *
 * Mounting is deferred to an effect rather than decided during render, so the
 * server and the first client pass agree and there is no hydration mismatch.
 */
export function HeroVideo() {
  const [play, setPlay] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 900px)').matches;
    // non-standard but widely shipped; absent on Safari, hence the optional chain
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!reduced && wide && !conn?.saveData) setPlay(true);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // autoplay can still be refused (battery saver, iOS low power); the poster
    // stays visible in that case because `ready` never flips
    v.play().catch(() => {});
  }, [play]);

  return (
    <div className="hero-plate" aria-hidden="true">
      <div className="hero-poster" />
      {play && (
        <video
          ref={ref}
          className={`hero-video ${ready ? 'is-ready' : ''}`}
          src="/video/hero-forge.mp4"
          poster="/video/hero-forge.jpg"
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        />
      )}
      {/* holds contrast under the type without flattening the sparks */}
      <div className="hero-scrim" />
      <div className="hero-grain" />
    </div>
  );
}
