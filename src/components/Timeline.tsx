import { motion } from 'motion/react';
import { translations } from '../i18n';
import type { LanguageCode } from '../i18n';

interface TimelineProps {
  lang: LanguageCode;
}

export default function Timeline({ lang }: TimelineProps) {
  const t = translations[lang].experience;

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Central gradient spine (left rail on mobile) */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 bg-gradient-to-b from-[#22D3EE]/50 via-[#8B5CF6]/50 to-[#E879F9]/50" />

      <div className="space-y-10 md:space-y-0">
        {t.jobs.map((job, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <motion.div
              key={`${job.company}-${job.role}-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative group pl-12 md:pl-0 md:w-1/2 md:py-6 ${
                isLeft ? 'md:pr-14' : 'md:ml-auto md:pl-14'
              }`}
            >
              {/* Node on the spine */}
              <div
                className={`absolute top-8 md:top-1/2 md:-translate-y-1/2 left-4 -translate-x-1/2 md:translate-x-0 ${
                  isLeft ? 'md:left-auto md:-right-[7px]' : 'md:-left-[7px]'
                } w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#22D3EE] via-[#8B5CF6] to-[#E879F9] shadow-[0_0_16px_rgba(139,92,246,0.8)] ring-4 ring-bg-base z-10`}
              />

              <div className="glass rounded-3xl p-6 md:p-8 transition-shadow duration-300 group-hover:shadow-[0_0_45px_rgba(139,92,246,0.18)]">
                <div className="inline-flex items-center font-mono text-[11px] uppercase tracking-[0.2em] aura-text font-bold mb-4">
                  {job.period}
                </div>
                <h4 className="font-display text-lg md:text-xl font-bold text-text-primary leading-snug mb-1">
                  {job.role}
                </h4>
                <div className="text-text-secondary font-semibold mb-4">{job.company}</div>
                <p className="text-text-secondary leading-relaxed text-[15px] md:text-base">
                  {job.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
