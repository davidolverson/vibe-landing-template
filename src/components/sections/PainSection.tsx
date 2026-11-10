'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { PAIN_QUOTES, COLORS } from '@/lib/constants';

/* ─── Glitch Text Effect ─── */
function GlitchText({
  text,
  triggered,
  className = '',
}: {
  text: string;
  triggered: boolean;
  className?: string;
}) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (triggered) {
      setGlitching(true);
      const timer = setTimeout(() => setGlitching(false), 800);
      return () => clearTimeout(timer);
    }
  }, [triggered]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      {glitching && (
        <>
          <span
            className="absolute inset-0 z-20"
            style={{
              color: COLORS.gold,
              clipPath: 'inset(20% 0 50% 0)',
              transform: 'translate(-2px, 1px)',
              opacity: 0.8,
              animation: 'glitch-1 0.3s steps(2) 3',
            }}
          >
            {text}
          </span>
          <span
            className="absolute inset-0 z-20"
            style={{
              color: '#ff4444',
              clipPath: 'inset(60% 0 10% 0)',
              transform: 'translate(2px, -1px)',
              opacity: 0.5,
              animation: 'glitch-2 0.25s steps(3) 3',
            }}
          >
            {text}
          </span>
        </>
      )}
      {/* Glitch keyframes are in globals.css */}
    </span>
  );
}

/* ─── Particle Burst on Shatter ─── */
function ParticleBurst({ originX, originY }: { originX: number; originY: number }) {
  const particles = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const distance = 60 + Math.random() * 80;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 0.1,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: COLORS.gold,
            left: '50%',
            top: '50%',
            boxShadow: `0 0 6px ${COLORS.gold}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.7, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/* ─── Pain Card ─── */
const SOLUTIONS = [
  'One CRM. Zero spreadsheets.',
  'RE + mortgage + insurance. One platform.',
  'One login. Every lead tracked.',
  'QuickBooks syncs automatically.',
  'Pay less. Convert more.',
  'Migrate once. Keep everything.',
];

function PainCard({
  quote,
  index,
  scrollProgress,
}: {
  quote: (typeof PAIN_QUOTES)[number];
  index: number;
  scrollProgress: number;
}) {
  const [shattered, setShattered] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref: viewRef, inView } = useInView(0.3);

  // Different depth/speed per card
  const depthScale = 0.9 + (index % 3) * 0.05;
  const speedMultiplier = 0.6 + (index % 3) * 0.3;
  const yOffset = scrollProgress * speedMultiplier * -60;

  // Staggered float positions
  const floatConfigs = [
    { x: '-5%', rotate: -2 },
    { x: '8%', rotate: 1.5 },
    { x: '-3%', rotate: -1 },
    { x: '6%', rotate: 2 },
    { x: '-7%', rotate: -1.5 },
    { x: '4%', rotate: 1 },
  ];
  const float = floatConfigs[index % floatConfigs.length];

  const handleShatter = useCallback(() => {
    if (shattered) return;
    setShowBurst(true);
    setTimeout(() => setShattered(true), 100);
    setTimeout(() => setShowBurst(false), 800);
  }, [shattered]);

  return (
    <div ref={viewRef} className="relative">
      <motion.div
        ref={cardRef}
        className="relative"
        style={{
          transform: `translateY(${yOffset}px) scale(${depthScale})`,
          transformOrigin: 'center',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.12, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {!shattered ? (
            <motion.div
              key="pain"
              className="glass-card rounded-xl p-5 sm:p-6 md:p-8 max-w-lg mx-auto select-none"
              style={{
                transform: `rotate(${float.rotate}deg)`,
              }}
              onClick={handleShatter}
              whileHover={{ scale: 1.03, rotate: 0 }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <GlitchText
                text={`"${quote.text}"`}
                triggered={inView}
                className="text-base md:text-lg text-white/90 leading-relaxed italic block mb-3"
              />
              <p className="text-xs md:text-sm text-white/40 text-right">
                -- {quote.author}
              </p>
              <p className="text-[10px] text-white/20 mt-3 text-center uppercase tracking-widest">
                Click to shatter
              </p>
              {showBurst && <ParticleBurst originX={0} originY={0} />}
            </motion.div>
          ) : (
            <motion.div
              key="solution"
              className="rounded-xl p-6 md:p-8 max-w-lg mx-auto text-center"
              style={{
                background: `linear-gradient(135deg, rgba(212, 160, 23, 0.1), rgba(212, 160, 23, 0.05))`,
                border: `1px solid rgba(212, 160, 23, 0.3)`,
              }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="text-lg md:text-xl font-semibold text-glow"
                style={{ color: COLORS.gold }}
              >
                {SOLUTIONS[index % SOLUTIONS.length]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ─── Counting Number ─── */
function CountUp({
  target,
  duration = 2000,
  triggered,
}: {
  target: number;
  duration?: number;
  triggered: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let rafId: number;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [triggered, target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

/* ─── Main Pain Section ─── */
export default function PainSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: counterRef, inView: counterInView } = useInView(0.5);
  const { ref: exitRef, inView: exitInView } = useInView(0.5);

  // Scroll progress for parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const [scrollVal, setScrollVal] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setScrollVal(v));
    return unsub;
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${COLORS.dark} 0%, #0d0d18 80%, #111127 100%)`,
      }}
    >
      {/* Section heading */}
      <div className="max-w-4xl mx-auto px-4 mb-16 md:mb-24 text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          The industry is{' '}
          <span style={{ color: COLORS.gold }} className="text-glow">
            broken
          </span>
        </motion.h2>
        <motion.p
          className="text-white/40 text-sm md:text-base max-w-md mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Real professionals. Real frustrations. Sound familiar?
        </motion.p>
      </div>

      {/* Pain cards grid */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {PAIN_QUOTES.map((quote, i) => (
          <PainCard
            key={i}
            quote={quote}
            index={i}
            scrollProgress={scrollVal}
          />
        ))}
      </div>

      {/* Counter */}
      <div ref={counterRef} className="max-w-3xl mx-auto px-4 mt-24 md:mt-32 text-center">
        <motion.p
          className="text-2xl md:text-4xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ color: COLORS.gold }} className="text-glow">
            <CountUp target={462} triggered={counterInView} />
          </span>{' '}
          <span className="text-white/70 text-lg md:text-2xl font-normal">
            real estate professionals posted about these problems this month
          </span>
        </motion.p>
      </div>

      {/* Exit line */}
      <div ref={exitRef} className="max-w-3xl mx-auto px-4 mt-16 md:mt-20 text-center">
        <motion.p
          className="text-xl md:text-3xl font-semibold text-glow"
          style={{
            color: COLORS.gold,
            fontFamily: 'var(--font-playfair, Georgia, serif)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={exitInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Sound familiar? There&apos;s a better way.
        </motion.p>
      </div>
    </section>
  );
}
