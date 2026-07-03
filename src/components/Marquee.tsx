import { motion } from 'motion/react';
import { translations } from '../i18n';
import type { LanguageCode } from '../i18n';

interface MarqueeProps {
  lang: LanguageCode;
}

export default function Marquee({ lang }: MarqueeProps) {
  const words = translations[lang].marquee;

  // Duplicate array so it fills nicely and loops smoothly on ultrawide screens
  const doubledWords = [...words, ...words, ...words, ...words, ...words, ...words];

  return (
    <div className="relative mb-20 md:mb-28 overflow-hidden py-4">
      {/* Tilted glass band */}
      <div className="w-[110%] -ml-[5%] -rotate-2 overflow-hidden py-5 md:py-7 glass relative flex">
        <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 50, repeat: Infinity }}
        >
          {doubledWords.map((word, index) => (
            <div key={`${word}-${index}`} className="flex items-center">
              <span
                className={`font-display text-base md:text-xl font-bold uppercase tracking-[0.12em] mx-6 md:mx-10 ${
                  index % 2 === 0 ? 'aura-text' : 'text-outline'
                }`}
              >
                {word}
              </span>
              <span className="text-[#8B5CF6] text-lg md:text-xl select-none" aria-hidden="true">✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
