import { heatTarget, motion, useMotionStore } from "./store";

/**
 * THE LOOP
 *
 * One requestAnimationFrame loop for the entire page. It:
 *   1. eases the bloom position toward the raw pointer (trailing light)
 *   2. derives heat from idle level + scroll velocity
 *   3. writes --heat, --mx, --my to :root
 *
 * Nothing here renders. The store is read with getState() and written outside
 * any component subscription; CSS does the rest.
 *
 * ---------------------------------------------------------------------------
 * WHY THE LOOP SLEEPS
 *
 * Each frame this writes --mx/--my/--heat, and those drive a full-viewport
 * radial-gradient repaint on `.forge::before` plus a mask-image repaint on
 * `.forge::after`. That is paint work, not compositing — see the note on
 * CLAUDE.md invariant 6 in PROGRESS.md (DD-41). It is the identity of the
 * site and worth its cost while something is actually moving, and worth
 * nothing at all while the page is still.
 *
 * So the loop is not perpetual. It stops when every eased value has caught up
 * with its target, and when the tab is hidden. Input wakes it again through a
 * non-React store subscription.
 *
 * Note on what is NOT gated: an earlier plan was to gate on `.forge` being in
 * the viewport. That would never fire — SiteHeader carries `.forge`, so a
 * forge surface is on screen on every route at every scroll position.
 * ---------------------------------------------------------------------------
 */

/** Below this delta a value has arrived; chasing it further is invisible. */
const SETTLED = 0.0005;

/** Pointer trail. 0.06 reads as "light moving through a medium". */
const POINTER_LERP = 0.06;

/** Heat smoothing, per MOTION_SPEC §1. Do not change without updating the spec. */
const HEAT_LERP = 0.05;

export function startHeatLoop(): () => void {
  const root = document.documentElement;

  let bx = 0.5;
  let by = 0.4;
  let heat = motion().heat;

  let raf = 0;
  let running = false;
  const lastWrite = { heat: -1, bx: -1, by: -1 };

  const tick = () => {
    const s = motion();

    const tx = s.pointer.nx;
    const ty = s.pointer.ny;
    const target = heatTarget(s.idleLevel, s.scrollVelocity);

    bx += (tx - bx) * POINTER_LERP;
    by += (ty - by) * POINTER_LERP;
    heat += (target - heat) * HEAT_LERP;

    // Only touch the DOM when a value actually moved at the precision the CSS
    // can express — saves style recalcs on near-static frames.
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

    /**
     * Publish the smoothed value so shaders can read it with getState().
     *
     * Correction to a claim this file used to carry: it is NOT true that
     * "setState on a non-subscribed key does not re-render anything". Zustand
     * notifies every subscriber on every setState and runs each selector.
     * Components are spared only when their selector output is unchanged — and
     * any component calling `useMotionStore()` with no selector re-renders on
     * every one of these writes, 60× a second.
     *
     * The rule that actually keeps this safe is in CLAUDE.md §5: React may
     * subscribe to discrete state only, always through a selector. This write
     * is cheap because the subscriber list is short and no selector here
     * depends on `heat`.
     */
    if (Math.abs(s.heat - heat) > 0.001) {
      useMotionStore.setState({ heat });
    }

    const arrived =
      Math.abs(target - heat) < SETTLED &&
      Math.abs(tx - bx) < SETTLED &&
      Math.abs(ty - by) < SETTLED;

    if (arrived || document.hidden) {
      running = false;
      raf = 0;
      return;
    }

    raf = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (running || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(tick);
  };

  /**
   * Non-React subscription. This is outside the render path entirely — it
   * exists so input can restart a sleeping loop without adding a second set
   * of listeners alongside the ones in startInputTracking().
   *
   * `heat` is deliberately absent from the selector: the loop writes it, and
   * including it would wake the loop from its own final frame.
   */
  const unsubscribe = useMotionStore.subscribe(
    (s) => `${s.pointer.nx},${s.pointer.ny},${s.idleLevel},${s.scrollVelocity}`,
    wake,
  );

  const onVisibility = () => {
    if (!document.hidden) wake();
  };
  document.addEventListener("visibilitychange", onVisibility);

  wake();

  return () => {
    unsubscribe();
    document.removeEventListener("visibilitychange", onVisibility);
    if (raf) cancelAnimationFrame(raf);
    running = false;
  };
}

/**
 * Pointer + scroll listeners. Passive, and they only write to the store — all
 * DOM writes happen in the loop above, so reads and writes are never
 * interleaved (layout thrash).
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

    // px per ms, clamped — momentum spikes shouldn't peg heat
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
