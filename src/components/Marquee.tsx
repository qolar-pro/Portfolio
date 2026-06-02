import { motion } from 'motion/react';
import { translations } from '../i18n';
import type { LanguageCode } from '../i18n';

interface MarqueeProps {
  lang: LanguageCode;
}

export default function Marquee({ lang }: MarqueeProps) {
  const words = translations[lang].marquee;
  
  // Duplicate array so it fills nicely and loops smoothly
  // Added a larger multiplier to ensure it doesn't run out of text on ultrawide screens
  const doubledWords = [...words, ...words, ...words, ...words, ...words, ...words];

  return (
    <div className="w-full overflow-hidden py-5 md:py-8 border-y border-space-grey-border/50 relative z-20 bg-bg-surface/30 backdrop-blur-md mb-16 md:mb-32 flex">
      {/* Edge Gradients for smooth fade in/out */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        className="flex whitespace-nowrap items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 50, repeat: Infinity }}
      >
        {doubledWords.map((word, index) => (
          <div key={index} className="flex items-center">
            <span className="font-mono text-lg md:text-2xl font-black uppercase tracking-[0.15em] text-text-primary/70 mx-6 md:mx-12">
              {word}
            </span>
            <div className="w-2 h-2 rounded-full bg-[#E94560] shadow-[0_0_10px_rgba(233,69,96,0.5)]" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
