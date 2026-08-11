/**
 * SHARED REVEAL OBSERVER
 *
 * ONE IntersectionObserver for the whole page, fire-once. Elements register
 * themselves and are unobserved on first intersection — nothing re-runs on
 * scroll back up, which is both cheaper and less annoying than replaying
 * animations.
 */

type RevealCallback = (el: Element) => void;

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, RevealCallback>();

function ensureObserver(): IntersectionObserver {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const cb = callbacks.get(entry.target);
        cb?.(entry.target);
        callbacks.delete(entry.target);
        observer!.unobserve(entry.target);
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );

  return observer;
}

export function observeReveal(el: Element, cb: RevealCallback): () => void {
  const io = ensureObserver();
  callbacks.set(el, cb);
  io.observe(el);
  return () => {
    callbacks.delete(el);
    io.unobserve(el);
  };
}
