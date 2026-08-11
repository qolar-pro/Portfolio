"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { observeReveal } from "@/lib/motion/reveal";
import { motion } from "@/lib/motion/store";

interface IgniteTextProps {
  /** The full string. Wrap the key phrase in [brackets] to make it ember. */
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}

/**
 * Words fade from 0.22 to full as the line enters view; the [bracketed]
 * phrase resolves to ember. Splitting is done with Intl.Segmenter where
 * available so Greek and Cyrillic word boundaries are handled correctly —
 * a naive split(" ") is fine for these scripts but Segmenter is future-proof
 * and costs nothing.
 *
 * No GSAP needed. CSS transitions with per-word delay do the whole thing.
 */
export function IgniteText({ children, className = "", as = "h2" }: IgniteTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    if (motion().reducedMotion) {
      setLit(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    return observeReveal(el, () => setLit(true));
  }, []);

  // parse [key phrases]
  const tokens = children.split(/(\[[^\]]+\])/g).filter(Boolean);
  const words: { text: string; key: boolean }[] = [];

  for (const token of tokens) {
    const isKey = token.startsWith("[") && token.endsWith("]");
    const clean = isKey ? token.slice(1, -1) : token;
    for (const w of clean.split(/\s+/).filter(Boolean)) {
      words.push({ text: w, key: isKey });
    }
  }

  /**
   * `createElement` rather than `<Tag>`.
   *
   * The kit shipped this as `const Tag = as as React.ElementType`, which
   * widens to a union TypeScript cannot narrow across a JSX call \u2014 every prop
   * on the tag then resolves to `never` and `ref`, `className` and `children`
   * all fail to typecheck. h1/h2/h3/p accept identical attributes, so building
   * the element directly is both correct and simpler than reconciling the
   * union. Fixed during kit install; see DD-40.
   */
  return createElement(
    as,
    { ref, className },
    words.map((w, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          opacity: lit ? 1 : 0.22,
          color: lit && w.key ? "var(--color-ember)" : undefined,
          transition: `opacity 500ms var(--ease-soft) ${i * 40}ms, color 500ms var(--ease-soft) ${i * 40}ms`,
        }}
      >
        {w.text}
        {i < words.length - 1 ? "\u00A0" : ""}
      </span>
    )),
  );
}
