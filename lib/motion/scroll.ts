"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion } from "./store";

/**
 * LENIS ↔ GSAP TICKER MARRIAGE
 *
 * The one correct wiring: Lenis drives scroll, GSAP's ticker drives Lenis,
 * and ScrollTrigger updates from Lenis's scroll event. lagSmoothing(0) stops
 * GSAP from trying to "catch up" after a frame drop, which desyncs the two.
 *
 * Carried over unchanged from the Apex portfolio build — it worked, don't
 * rewrite it.
 */
export function startSmoothScroll(): () => void {
  if (typeof window === "undefined") return () => {};

  gsap.registerPlugin(ScrollTrigger);

  if (motion().reducedMotion) {
    // Native scrolling. ScrollTrigger still works off the window scroller.
    ScrollTrigger.refresh();
    return () => {};
  }

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false, // native momentum on touch feels better than emulated
  });

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}
