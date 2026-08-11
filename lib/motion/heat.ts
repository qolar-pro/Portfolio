import { heatTarget, motion, useMotionStore } from "./store";

/**
 * THE LOOP
 *
 * One requestAnimationFrame loop for the entire page. It:
 *   1. eases the bloom position toward the raw pointer (trailing light)
 *   2. derives heat from idle level + scroll velocity
 *   3. writes --heat, --mx, --my to :root
 *
 * Nothing here touches React. The store is read with getState() and written
 * with setState() outside of any component subscription, so no render is
 * scheduled. CSS does the rest.
 *
 * Returns a teardown function.
 */
export function startHeatLoop(): () => void {
  const root = document.documentElement;

  // eased bloom position (trails the cursor)
  let bx = 0.5;
  let by = 0.4;
  let heat = motion().heat;

  let raf = 0;
  let lastWrite = { heat: -1, bx: -1, by: -1 };

  const tick = () => {
    const s = motion();

    // trail the pointer — 0.06 lerp reads as "light moving through a medium"
    bx += (s.pointer.nx - bx) * 0.06;
    by += (s.pointer.ny - by) * 0.06;

    // exponential smoothing toward the derived target
    const target = heatTarget(s.idleLevel, s.scrollVelocity);
    heat += (target - heat) * 0.05;

    // only touch the DOM when a value actually moved (3dp) — saves style
    // recalcs when the page is genuinely idle
    const h3 = Math.round(heat * 1000) / 1000;
    const bx2 = Math.round(bx * 10000) / 100;
    const by2 = Math.round(by * 10000) / 100;

    if (h3 !== lastWrite.heat) {
      root.style.setProperty("--heat", String(h3));
      lastWrite.heat = h3;
    }
    if (bx2 !== lastWrite.bx) {
      root.style.setProperty("--mx", `${bx2}%`);
      lastWrite.bx = bx2;
    }
    if (by2 !== lastWrite.by) {
      root.style.setProperty("--my", `${by2}%`);
      lastWrite.by = by2;
    }

    // publish the smoothed value back to the store for shaders to read.
    // setState on a non-subscribed key does not re-render anything.
    if (Math.abs(s.heat - heat) > 0.001) {
      useMotionStore.setState({ heat });
    }

    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/**
 * Pointer + scroll listeners. Passive, and they only write to the store —
 * all DOM writes happen in the loop above so we never interleave
 * reads and writes (layout thrash).
 */
export function startInputTracking(onActivity: () => void): () => void {
  let lastY = window.scrollY;
  let lastT = performance.now();

  const onPointerMove = (e: PointerEvent) => {
    motion().setPointer(e.clientX, e.clientY);
    onActivity();
  };

  const onScroll = () => {
    const now = performance.now();
    const dt = Math.max(now - lastT, 1);
    const y = window.scrollY;

    // px per ms, clamped — spikes from momentum scrolling shouldn't peg heat
    const velocity = Math.min(Math.abs(y - lastY) / dt, 4);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? y / max : 0;

    motion().setScroll(y, velocity, progress);

    lastY = y;
    lastT = now;
    onActivity();
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);
  };
}
