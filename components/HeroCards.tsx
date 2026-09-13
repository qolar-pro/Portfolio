'use client';

import Image from 'next/image';
import Link from 'next/link';
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, RotateCw } from 'lucide-react';
import { useRef, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';

/**
 * Two real projects either side of the hero headline.
 *
 * Adapted from an "interactive travel card": the 3D tilt and hover lift are
 * kept, the glassmorphism and soft shadows are not — these are hard-edged
 * panels like every other card on the site. Two things were added:
 *
 * - They float, each on its own slow cycle, so the pair never moves in step.
 * - They can be dragged through a full 360° turn. The back face is the
 *   project's stack and what was built, so spinning a card is also how you
 *   read it. On release the card coasts with its momentum and settles on the
 *   nearest face, so it always comes to rest readable.
 *
 * Desktop only (see .hero-cards in globals.css): below ~1280px there is no
 * room beside a centred headline, and a draggable card on a touch screen
 * fights the page scroll.
 */

type Project = SiteContent['work']['projects'][number];

function Card({
  p,
  side,
  c,
  lang,
}: {
  p: Project;
  side: 'left' | 'right';
  c: SiteContent;
  lang: Lang;
}) {
  const reduced = useReducedMotion();
  const t = c.heroCards;

  /* spin = accumulated drag rotation; tilt = hover lean toward the pointer */
  const spinY = useMotionValue(0);
  const spinX = useMotionValue(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const sTiltX = useSpring(tiltX, { damping: 15, stiffness: 150 });
  const sTiltY = useSpring(tiltY, { damping: 15, stiffness: 150 });
  const rotateY = useTransform(() => spinY.get() + sTiltY.get());
  const rotateX = useTransform(() => spinX.get() + sTiltX.get());

  const drag = useRef<{ x: number; y: number; moved: boolean; vx: number; lastX: number; lastT: number } | null>(null);
  const justDragged = useRef(false);

  const settle = (velocity = 0) => {
    const projected = spinY.get() + velocity * 0.18;
    const face = Math.round(projected / 180) * 180;
    const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 90, damping: 16, velocity };
    animate(spinY, face, spring);
    animate(spinX, 0, reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 });
  };

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, moved: false, vx: 0, lastX: e.clientX, lastT: performance.now() };
    tiltX.set(0);
    tiltY.set(0);
  };

  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d) {
      const dx = e.clientX - d.lastX;
      const now = performance.now();
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) d.moved = true;
      if (d.moved) {
        spinY.set(spinY.get() + dx * 0.6);
        spinX.set(Math.max(-40, Math.min(40, spinX.get() - e.movementY * 0.45)));
        d.vx = (dx * 0.6) / Math.max(1, now - d.lastT) * 1000;
      }
      d.lastX = e.clientX;
      d.lastT = now;
      return;
    }
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 21);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 21);
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) {
      justDragged.current = true;
      settle(d.vx);
      window.setTimeout(() => (justDragged.current = false), 0);
    }
  };

  const onLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const flip = (dir: 1 | -1) => {
    animate(spinY, Math.round(spinY.get() / 180) * 180 + dir * 180, reduced ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 16 });
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      flip(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      flip(-1);
    }
  };

  /* A drag that ends over a link must not also follow it. */
  const swallowClickAfterDrag = (e: React.MouseEvent) => {
    if (justDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const float = reduced
    ? {}
    : {
        animate: { y: [0, -14, 0, 10, 0], rotate: side === 'left' ? [-4, -2, -5, -3, -4] : [4, 6, 3, 5, 4] },
        transition: { duration: side === 'left' ? 9 : 11, repeat: Infinity, ease: 'easeInOut' as const },
      };

  return (
    <motion.div className={`hero-card-slot is-${side}`} {...float}>
      <motion.div
        className="hero-card"
        role="group"
        aria-roledescription="project card"
        aria-label={p.title}
        tabIndex={0}
        style={{ rotateX, rotateY }}
        whileHover={reduced ? undefined : { scale: 1.07, y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onLeave}
        onKeyDown={onKey}
        onClickCapture={swallowClickAfterDrag}
      >
        {/* ---- front ---- */}
        <div className="hc-face hc-front">
          <div className="hc-shot">
            <Image
              src={p.images[0]}
              alt=""
              fill
              sizes="260px"
              draggable={false}
              priority
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
            {p.liveUrl && (
              <a
                className="hc-visit"
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.visit}: ${p.title}`}
              >
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </a>
            )}
          </div>
          <div className="hc-body">
            <p className="hc-title">{p.title}</p>
            <p className="hc-sub">{p.tagline}</p>
            <Link className="hc-cta" href={`/${lang}${ROUTES.work}`}>
              {t.see} →
            </Link>
          </div>
          <span className="hc-hint" aria-hidden="true">
            <RotateCw size={12} strokeWidth={2.5} /> {t.hint}
          </span>
        </div>

        {/* ---- back ---- */}
        <div className="hc-face hc-back" aria-hidden="true">
          <p className="hc-back-label">{t.built}</p>
          <ul className="hc-stack">
            {p.stack.slice(0, 6).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <ul className="hc-features">
            {p.features.slice(0, 3).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="hc-back-title">{p.title}</p>
        </div>
      </motion.div>

      <button type="button" className="sr-only" onClick={() => flip(1)}>
        {t.flip}: {p.title}
      </button>
    </motion.div>
  );
}

export function HeroCards({ c, lang }: { c: SiteContent; lang: Lang }) {
  const bySlug = (slug: string) => c.work.projects.find((p) => p.slug === slug);
  const left = bySlug('a25');
  const right = bySlug('tsopouroglou');
  if (!left || !right) return null;

  return (
    <div className="hero-cards">
      <Card p={left} side="left" c={c} lang={lang} />
      <Card p={right} side="right" c={c} lang={lang} />
    </div>
  );
}
