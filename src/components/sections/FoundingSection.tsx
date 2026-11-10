'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FOUNDING } from '@/lib/constants';

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
const CLAIMED_COUNT = 3;
const AVAILABLE_COUNT = FOUNDING.totalSpots - CLAIMED_COUNT;
const URGENCY = AVAILABLE_COUNT <= 5;

/* ------------------------------------------------------------------ */
/* Gold star icon                                                      */
/* ------------------------------------------------------------------ */
function GoldStar() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-5 h-5 shrink-0"
      fill="#D4A017"
      aria-hidden="true"
    >
      <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21l-4-3.9 5.53-.8z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Perk row with tooltip                                               */
/* ------------------------------------------------------------------ */
function PerkRow({ title, detail }: { title: string; detail: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors cursor-pointer">
        <GoldStar />
        <span className="text-sm sm:text-base md:text-lg text-white/90 font-medium flex-1">
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-white/30 shrink-0 transition-transform duration-200 md:hidden ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden md:absolute md:left-12 md:right-4 md:-bottom-1 md:translate-y-full md:overflow-visible z-20"
          >
            <div className="ml-11 mr-4 mb-2 md:ml-0 md:mr-0 md:mb-0 bg-[#1A1A2E] border border-gold/30 rounded-lg px-4 py-3 text-sm text-white/70 shadow-lg">
              {detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Holographic card                                                    */
/* ------------------------------------------------------------------ */
function HoloCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGradientPos({ x, y });
  };

  const handleMouseLeave = () => {
    setGradientPos({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl p-[1px] overflow-hidden"
      style={{
        background: `linear-gradient(${
          Math.atan2(gradientPos.y - 50, gradientPos.x - 50) * (180 / Math.PI) + 90
        }deg, #B8860B, #D4A017, #E8C547, #D4A017, #B8860B)`,
      }}
    >
      {/* Holographic sheen overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          background: `radial-gradient(
            ellipse at ${gradientPos.x}% ${gradientPos.y}%,
            rgba(232,197,71,0.5) 0%,
            rgba(212,160,23,0.2) 30%,
            rgba(184,134,11,0.1) 50%,
            transparent 70%
          ),
          linear-gradient(
            ${gradientPos.x + gradientPos.y}deg,
            rgba(120,200,255,0.12) 0%,
            rgba(200,120,255,0.12) 25%,
            rgba(255,180,120,0.12) 50%,
            rgba(120,255,200,0.12) 75%,
            rgba(120,200,255,0.12) 100%
          )`,
        }}
      />

      {/* Card body */}
      <div className="relative rounded-2xl bg-[#0e0e18]/95 backdrop-blur-md p-5 sm:p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main section                                                        */
/* ------------------------------------------------------------------ */
export default function FoundingSection() {
  return (
    <section
      className={`relative section-dark py-16 sm:py-24 md:py-36 ${
        URGENCY ? 'urgency-pulse' : ''
      }`}
    >
      {/* Gold gradient border at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #B8860B 20%, #D4A017 40%, #E8C547 50%, #D4A017 60%, #B8860B 80%, transparent 100%)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(212,160,23,0.06) 0%, transparent 100%)',
        }}
      />

      <div className="max-w-3xl mx-auto px-4 md:px-6">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-6xl font-bold font-serif text-white">
            The First{' '}
            <span className="text-gold text-glow">50</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 mt-4 max-w-lg mx-auto">
            We&apos;re letting in 50 operators before anyone else.
          </p>
        </motion.div>

        {/* Premium card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <HoloCard>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              First 50 Member Perks
            </h3>

            <div className="space-y-1">
              {FOUNDING.perks.map((perk) => (
                <PerkRow
                  key={perk.title}
                  title={perk.title}
                  detail={perk.detail}
                />
              ))}
            </div>

            {/* Spots remaining */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-sm text-white/40 uppercase tracking-widest mb-5 text-center">
                {AVAILABLE_COUNT} of {FOUNDING.totalSpots} spots remaining
              </p>
              <div className="w-full max-w-md mx-auto">
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #B8860B, #D4A017, #E8C547)',
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(CLAIMED_COUNT / FOUNDING.totalSpots) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/30">
                  <span>{CLAIMED_COUNT} claimed</span>
                  <span>{AVAILABLE_COUNT} open</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex justify-center">
              <motion.a
                href="#waitlist"
                aria-label="Claim your spot in The First 50"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block px-10 py-4 rounded-full font-bold text-lg text-dark bg-gradient-to-r from-gold-dark via-gold to-gold-light pulse-gold transition-shadow"
              >
                Claim Your Spot
              </motion.a>
            </div>
          </HoloCard>
        </motion.div>
      </div>

      {/* Breathing glow + urgency pulse keyframes are in globals.css */}
    </section>
  );
}
