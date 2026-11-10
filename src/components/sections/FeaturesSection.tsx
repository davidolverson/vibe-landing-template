'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { FEATURES } from '@/lib/constants';

/* ------------------------------------------------------------------ */
/*  SVG Icons — simple shapes with stroke-draw animation              */
/* ------------------------------------------------------------------ */

interface IconProps {
  animate: boolean;
}

const iconBaseClass = 'w-10 h-10';

const strokeTransition = (delay: number) => ({
  strokeDashoffset: {
    duration: 1.2,
    delay,
    ease: 'easeInOut' as const,
  },
});

function UnifiedLeadsIcon({ animate }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={iconBaseClass}>
      {/* Center circle */}
      <motion.circle
        cx="24"
        cy="24"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="50.27"
        initial={{ strokeDashoffset: 50.27 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0)}
      />
      {/* Top spoke */}
      <motion.line
        x1="24" y1="4" x2="24" y2="16"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="12"
        initial={{ strokeDashoffset: 12 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0.3)}
      />
      {/* Right spoke */}
      <motion.line
        x1="32" y1="24" x2="44" y2="24"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="12"
        initial={{ strokeDashoffset: 12 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0.5)}
      />
      {/* Bottom spoke */}
      <motion.line
        x1="24" y1="32" x2="24" y2="44"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="12"
        initial={{ strokeDashoffset: 12 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0.7)}
      />
      {/* Left spoke */}
      <motion.line
        x1="4" y1="24" x2="16" y2="24"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="12"
        initial={{ strokeDashoffset: 12 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0.9)}
      />
    </svg>
  );
}

function MultiSiteIcon({ animate }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={iconBaseClass}>
      {/* Left page */}
      <motion.rect
        x="4" y="8" width="16" height="20" rx="2"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="72"
        initial={{ strokeDashoffset: 72 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0)}
      />
      {/* Right page */}
      <motion.rect
        x="28" y="8" width="16" height="20" rx="2"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="72"
        initial={{ strokeDashoffset: 72 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0.3)}
      />
      {/* Funnel arrow down center */}
      <motion.path
        d="M12 32 L24 40 L36 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="36"
        initial={{ strokeDashoffset: 36 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0.6)}
      />
      {/* Center dot */}
      <motion.circle
        cx="24"
        cy="44"
        r="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        initial={{ opacity: 0 }}
        animate={animate ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.0 }}
      />
    </svg>
  );
}

function DashboardIcon({ animate }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={iconBaseClass}>
      {/* Outer frame */}
      <motion.rect
        x="4" y="4" width="40" height="40" rx="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="160"
        initial={{ strokeDashoffset: 160 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0)}
      />
      {/* Bar 1 */}
      <motion.line
        x1="12" y1="36" x2="12" y2="24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="12"
        initial={{ strokeDashoffset: 12 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0.4)}
      />
      {/* Bar 2 */}
      <motion.line
        x1="20" y1="36" x2="20" y2="18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="18"
        initial={{ strokeDashoffset: 18 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0.6)}
      />
      {/* Bar 3 */}
      <motion.line
        x1="28" y1="36" x2="28" y2="14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="22"
        initial={{ strokeDashoffset: 22 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0.8)}
      />
      {/* Bar 4 */}
      <motion.line
        x1="36" y1="36" x2="36" y2="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="26"
        initial={{ strokeDashoffset: 26 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(1.0)}
      />
    </svg>
  );
}

function CommsIcon({ animate }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={iconBaseClass}>
      {/* Speech bubble */}
      <motion.path
        d="M8 8 H40 Q44 8 44 12 V28 Q44 32 40 32 H16 L8 40 V32 Q4 32 4 28 V12 Q4 8 8 8 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="140"
        initial={{ strokeDashoffset: 140 }}
        animate={animate ? { strokeDashoffset: 0 } : {}}
        transition={strokeTransition(0)}
      />
      {/* Dot 1 */}
      <motion.circle
        cx="16" cy="20" r="2"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        animate={animate ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.8 }}
      />
      {/* Dot 2 */}
      <motion.circle
        cx="24" cy="20" r="2"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        animate={animate ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.0 }}
      />
      {/* Dot 3 */}
      <motion.circle
        cx="32" cy="20" r="2"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        animate={animate ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
    </svg>
  );
}

const ICONS = [UnifiedLeadsIcon, MultiSiteIcon, DashboardIcon, CommsIcon];

/* ------------------------------------------------------------------ */
/*  Feature Card with 3D flip + magnetic hover                        */
/* ------------------------------------------------------------------ */

interface FeatureCardProps {
  feature: (typeof FEATURES)[number];
  index: number;
  IconComponent: React.ComponentType<IconProps>;
}

function FeatureCard({ feature, index, IconComponent }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.06;
    const offsetY = (e.clientY - centerY) * 0.06;
    setMagnetOffset({ x: offsetX, y: offsetY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsFlipped(false);
    setMagnetOffset({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <motion.div
        className="relative w-full h-64 sm:h-72 md:h-80"
        animate={{
          rotateY: isFlipped ? 180 : 0,
          x: magnetOffset.x,
          y: magnetOffset.y,
        }}
        transition={{
          rotateY: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          x: { type: 'spring', stiffness: 150, damping: 15 },
          y: { type: 'spring', stiffness: 150, damping: 15 },
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ---- FRONT FACE (Problem) ---- */}
        <div
          className="absolute inset-0 rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 bg-white/[0.03] backdrop-blur-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div>
            <div className="text-gray-500 mb-4">
              <IconComponent animate={isInView} />
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-600 mb-3">
              The Problem
            </p>
            <p className="text-lg sm:text-xl text-gray-400 font-medium leading-relaxed">
              {feature.problem}
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="hidden md:inline">Hover to see the solution</span>
            <span className="md:hidden">Tap to see the solution</span>
          </div>
        </div>

        {/* ---- BACK FACE (Solution) ---- */}
        <div
          className="absolute inset-0 rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-gold/40 bg-gradient-to-br from-gold/10 to-gold-dark/5 backdrop-blur-sm"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div>
            <div className="text-gold mb-4">
              <IconComponent animate={isInView} />
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-gold/70 mb-2">
              {feature.title}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {feature.headline}
            </h3>
            <p className="text-base text-gray-300 leading-relaxed">
              {feature.description}
            </p>
          </div>
          <div className="h-[2px] w-16 bg-gradient-to-r from-gold to-gold-dark rounded-full" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%)',
      }}
    >
      {/* Diagonal line pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 40px, #D4A017 40px, #D4A017 41px)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-gold/70 mb-4">
            What VIBE Solves
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            One platform.{' '}
            <span className="text-gold text-glow">Zero duct tape.</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
            Every card has two sides. Hover to flip from the problem to the VIBE
            solution.
          </p>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={i}
              IconComponent={ICONS[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
