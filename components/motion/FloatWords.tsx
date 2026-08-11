"use client";

import { motion as store } from "@/lib/motion/store";

interface FloatWordsProps {
  /**
   * Headline text. Markup per word:
   *   [word]  → white-hot (forged glow). Use ONCE per section.
   *   {word}  → flat ember
   *   |       → line break
   */
  children: string;
  className?: string;
}

/**
 * Headline words drifting on staggered phases. Pure CSS keyframes — the
 * animation is declarative, so it costs nothing per frame and pauses
 * automatically under reduced motion via the global media query.
 */
export function FloatWords({ children, className = "" }: FloatWordsProps) {
  const lines = children.split("|");

  let index = 0;

  return (
    <span className={className}>
      {lines.map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {line
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((raw) => {
              const forged = raw.startsWith("[") && raw.endsWith("]");
              const hot = raw.startsWith("{") && raw.endsWith("}");
              const text = forged || hot ? raw.slice(1, -1) : raw;
              const delay = (index++ * 0.5) % 3.5;

              return (
                <span
                  key={`${li}-${text}-${index}`}
                  className={forged ? "forged float-word" : "float-word"}
                  style={{
                    display: "inline-block",
                    animationDelay: `${delay}s`,
                    color: hot ? "var(--color-ember)" : undefined,
                  }}
                >
                  {text.replace(/_/g, "\u00A0")}
                  {"\u00A0"}
                </span>
              );
            })}
        </span>
      ))}
    </span>
  );
}
