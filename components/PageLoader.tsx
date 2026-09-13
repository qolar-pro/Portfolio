'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * First-load overlay: a shuffling deck of neobrutalist cards over the page
 * while it finishes loading.
 *
 * ── IT REPORTS REAL PROGRESS ─────────────────────────────────────────
 * The original looped a fake 0→100% counter. This one moves toward what the
 * browser has actually finished — the document, then the fonts, then every
 * image and script — and leaves the moment the page is genuinely ready. A
 * loader that lies about progress is a loader people learn to ignore.
 *
 * ── IT IS KEPT SHORT, ON PURPOSE ─────────────────────────────────────
 * Every millisecond it is on screen is a millisecond the site is hidden, so:
 *   - it lifts as soon as the page is loaded, after a floor of ~0.7 s so it
 *     does not just flash;
 *   - it is capped at 3.5 s from navigation start — a slow third-party script
 *     never holds the site hostage — and a CSS-only failsafe hides it at 6 s
 *     even if the JavaScript that lifts it never runs;
 *   - it runs once per browser session. Later full reloads skip it, blocked
 *     before first paint by LOADER_SKIP_SCRIPT, so there is no flash either;
 *   - with JavaScript off it never covers anything (the <noscript> rule).
 *
 * ── IT DOES NOT COLLECT ANYTHING ─────────────────────────────────────
 * Visit reporting to Discord is components/VisitTracker, and it stays gated
 * on the cookie decision. Loading the page is not consent.
 */

const SEEN = 'nf-loader-seen';

/** Runs in <head> before first paint: a repeat load in the same session never shows the overlay. */
export const LOADER_SKIP_SCRIPT = `try{if(sessionStorage.getItem('${SEEN}'))document.documentElement.classList.add('nf-skip-loader')}catch(e){}`;

const STEPS = [
  { id: 1, title: 'COMPILING', tag: 'STEP 01', tone: 'violet' },
  { id: 2, title: 'OPTIMIZING', tag: 'STEP 02', tone: 'blue' },
  { id: 3, title: 'HYDRATING', tag: 'STEP 03', tone: 'cyan' },
  { id: 4, title: 'RENDERING', tag: 'STEP 04', tone: 'indigo' },
  { id: 5, title: 'READY', tag: 'STEP 05', tone: 'main' },
] as const;

const MIN_MS = 700;
const MAX_MS = 3500;

export function PageLoader({ status }: { status: string }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [deck, setDeck] = useState<readonly (typeof STEPS)[number][]>(STEPS);
  const [progress, setProgress] = useState(6);
  const target = useRef(6);
  const shown = useRef(6);

  useEffect(() => {
    if (document.documentElement.classList.contains('nf-skip-loader')) {
      setVisible(false);
      return;
    }
    /* Both limits count from navigation start, not from this effect: on a slow
       phone hydration alone can take seconds, and a cap measured from here
       would stack on top of that wait. */
    document.documentElement.classList.add('nf-loading');

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN_MS - performance.now());
      window.setTimeout(() => {
        target.current = 100;
        setProgress(100);
        shown.current = 100;
        window.setTimeout(() => {
          setVisible(false);
          document.documentElement.classList.remove('nf-loading');
          try {
            sessionStorage.setItem(SEEN, '1');
          } catch {
            /* private mode: it simply shows again next load */
          }
        }, 220);
      }, wait);
    };

    /* progress follows real milestones */
    const bump = (v: number) => (target.current = Math.max(target.current, v));
    if (document.readyState !== 'loading') bump(40);
    else document.addEventListener('DOMContentLoaded', () => bump(40), { once: true });
    document.fonts?.ready.then(() => bump(72)).catch(() => {});

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    const cap = window.setTimeout(finish, Math.max(0, MAX_MS - performance.now()));

    /* Eased toward the target, but React only hears about whole-percent
       changes — re-rendering five animated cards on every frame was what made
       the bar trail far behind its own number. */
    let raf = 0;
    let eased = shown.current;
    const tick = () => {
      if (eased < target.current) eased = Math.min(target.current, eased + Math.max(0.6, (target.current - eased) * 0.12));
      const whole = Math.round(eased);
      if (whole !== shown.current) {
        shown.current = whole;
        setProgress(whole);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const shuffle = reduced
      ? 0
      : window.setInterval(() => {
          setDeck((d) => [...d.slice(1), d[0]]);
        }, 520);

    return () => {
      window.clearTimeout(cap);
      window.clearInterval(shuffle);
      cancelAnimationFrame(raf);
      window.removeEventListener('load', finish);
      document.documentElement.classList.remove('nf-loading');
    };
  }, [reduced]);

  const pct = Math.round(progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="page-loader"
          role="status"
          aria-live="polite"
          aria-label={status}
          initial={false}
          exit={reduced ? { opacity: 0 } : { y: '-100%', transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="pl-stage">
            <div className="pl-deck" aria-hidden="true">
              {deck.map((card, index) => {
                const isTop = index === 0;
                return (
                  <motion.div
                    key={card.id}
                    layout
                    className={`pl-card tone-${card.tone}`}
                    initial={false}
                    animate={{
                      x: isTop ? 0 : index * 3,
                      y: isTop ? 0 : index * 8,
                      rotate: isTop ? 0 : (index % 2 === 0 ? 1 : -1) * index * 2,
                      scale: 1 - index * 0.04,
                      zIndex: STEPS.length - index,
                    }}
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 24 }}
                  >
                    <div className="pl-head">
                      <span className="pl-dot">
                        <span />
                      </span>
                      <span className="pl-tag">{card.tag}</span>
                    </div>
                    <div className="pl-center">
                      {isTop ? (
                        <motion.span
                          className="pl-icon is-top"
                          animate={reduced ? undefined : { rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                        >
                          <RefreshCw size={24} />
                        </motion.span>
                      ) : (
                        <span className="pl-icon">
                          <Sparkles size={24} />
                        </span>
                      )}
                      <p className="pl-title">{card.title}</p>
                    </div>
                    <div className="pl-foot">
                      <div className="pl-status">
                        <span>STATUS</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="pl-bar">
                        <span style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="pl-pill">
              <Loader2 className="pl-spin" size={16} aria-hidden="true" />
              <span>{status}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
