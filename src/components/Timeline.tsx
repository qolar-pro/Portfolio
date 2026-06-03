import { motion } from 'motion/react';
import { translations } from '../i18n';
import type { LanguageCode } from '../i18n';

interface TimelineProps {
  lang: LanguageCode;
}

export default function Timeline({ lang }: TimelineProps) {
  const t = translations[lang].experience;
  
  return (
    <div className="relative border-l border-space-grey-border ml-4 md:ml-6 pl-8 md:pl-12 py-4 space-y-16">
      {t.jobs.map((job, idx) => (
        <motion.div 
          key={`${job.company}-${job.role}-${idx}`}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: idx * 0.1 }}
          className="relative group"
        >
          {/* Timeline Dot */}
          <div className="absolute -left-[37px] md:-left-[53px] top-1.5 w-3 h-3 rounded-full bg-bg-surface border-2 border-[#E94560] group-hover:shadow-[0_0_15px_rgba(233,69,96,0.6)] group-hover:bg-[#E94560] transition-colors duration-300" />
          
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-3">
            <h4 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-[#E94560] transition-colors">{job.role}</h4>
            <span className="text-[#E94560] font-mono font-bold hidden md:inline opacity-30">/</span>
            <span className="text-lg text-text-secondary font-medium">{job.company}</span>
          </div>
          
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary mb-4">
            {job.period}
          </div>
          
          <p className="text-text-secondary leading-relaxed max-w-2xl text-base md:text-lg">
            {job.desc}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
