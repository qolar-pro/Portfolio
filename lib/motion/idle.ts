import { motion } from "./store";

/**
 * IDLE ESCALATION
 *
 * The site should not go dead when nobody touches it. Ambient heat rises in
 * two stages so the page keeps breathing:
 *
 *   level 0  active
 *   level 1  drowsy   — 6s   → base heat 0.35
 *   level 2  attract  — 16s  → base heat 0.55
 *
 * Any pointer, key, touch or scroll event resets to 0.
 */

const DROWSY_MS = 6_000;
const ATTRACT_MS = 16_000;

export function startIdleTracking(): { wake: () => void; stop: () => void } {
  let t1: ReturnType<typeof setTimeout> | undefined;
  let t2: ReturnType<typeof setTimeout> | undefined;

  const wake = () => {
    // guard the set — idleLevel IS subscribed by React (discrete state),
    // so only write when it genuinely changes
    if (motion().idleLevel !== 0) motion().setIdleLevel(0);

    clearTimeout(t1);
    clearTimeout(t2);
    t1 = setTimeout(() => motion().setIdleLevel(1), DROWSY_MS);
    t2 = setTimeout(() => motion().setIdleLevel(2), ATTRACT_MS);
  };

  const events: (keyof WindowEventMap)[] = [
    "pointerdown",
    "keydown",
    "touchstart",
    "wheel",
  ];

  events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
  wake();

  return {
    wake,
    stop: () => {
      clearTimeout(t1);
      clearTimeout(t2);
      events.forEach((e) => window.removeEventListener(e, wake));
    },
  };
}
