'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BRAND, COLORS } from '@/lib/constants';

/* ── Typewriter hook — self-contained, no external deps ── */
function useTypewriter(text: string, startDelay: number, speed: number) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let charIndex = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        charIndex += 1;
        setDisplayed(text.slice(0, charIndex));
        if (charIndex >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startId);
      clearInterval(intervalId);
    };
  }, [text, startDelay, speed]);

  return { displayed, done };
}

/* ── Ember particles — reuses the .ember-rise CSS animation from globals.css ── */
const EMBERS: Array<{
  size: number;
  left: string;
  bottom: string;
  delay: string;
  duration: string;
  opacity: number;
}> = [
  { size: 3, left: '8%',  bottom: '10%', delay: '0s',    duration: '10s', opacity: 0.55 },
  { size: 2, left: '18%', bottom: '5%',  delay: '1.8s',  duration: '13s', opacity: 0.4  },
  { size: 4, left: '30%', bottom: '15%', delay: '3.2s',  duration: '11s', opacity: 0.6  },
  { size: 2, left: '45%', bottom: '8%',  delay: '0.7s',  duration: '14s', opacity: 0.35 },
  { size: 3, left: '60%', bottom: '12%', delay: '2.5s',  duration: '9s',  opacity: 0.5  },
  { size: 2, left: '72%', bottom: '6%',  delay: '4.1s',  duration: '12s', opacity: 0.45 },
  { size: 4, left: '85%', bottom: '18%', delay: '1.2s',  duration: '10s', opacity: 0.6  },
  { size: 2, left: '92%', bottom: '9%',  delay: '3.7s',  duration: '13s', opacity: 0.4  },
];

function EmberParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {EMBERS.map((ember, i) => (
        <span
          key={i}
          className="ember-rise absolute rounded-full"
          style={{
            width: ember.size,
            height: ember.size,
            left: ember.left,
            bottom: ember.bottom,
            animationDelay: ember.delay,
            animationDuration: ember.duration,
            opacity: ember.opacity,
            background: `radial-gradient(circle, ${COLORS.goldLight}, ${COLORS.gold})`,
            boxShadow: `0 0 ${ember.size * 3}px ${COLORS.gold}`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Ambient gold glow behind the logo ── */
function AmbientGlow() {
  return (
    <div
      className="ambient-breathe pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
      style={{
        width: 480,
        height: 480,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.gold}18 0%, ${COLORS.goldDark}08 55%, transparent 75%)`,
      }}
    />
  );
}

/* ── Props ── */
interface SplashScreenProps {
  onExplore: () => void;
}

/* ── Main component ── */
export default function SplashScreen({ onExplore }: SplashScreenProps) {
  // Sequencing flags
  const [logoReady, setLogoReady]       = useState(false);
  const [taglineReady, setTaglineReady] = useState(false);
  const [buttonReady, setButtonReady]   = useState(false);

  // Logo animation completes at ~1.2s; we fire tagline at 1.5s
  useEffect(() => {
    const t1 = setTimeout(() => setLogoReady(true), 100);   // kick logo entrance
    const t2 = setTimeout(() => setTaglineReady(true), 1500); // start typewriter
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Tagline: "10 businesses. One CRM. Zero chaos." — ~38 chars at 45ms/char ≈ 1.7s
  const TAGLINE_SPEED = 45;
  const { displayed: taglineText, done: taglineDone } = useTypewriter(
    BRAND.tagline,
    taglineReady ? 0 : 9_999_999, // only start when ready
    TAGLINE_SPEED,
  );

  // Once tagline finishes, show button after a short pause
  useEffect(() => {
    if (!taglineDone) return;
    const t = setTimeout(() => setButtonReady(true), 400);
    return () => clearTimeout(t);
  }, [taglineDone]);

  const handleExplore = useCallback(() => {
    onExplore();
  }, [onExplore]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onExplore();
      }
    },
    [onExplore],
  );

  return (
    <motion.div
      key="splash"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ background: COLORS.dark }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      aria-label="VIBE splash screen"
    >
      {/* Background layers */}
      <AmbientGlow />
      <EmberParticles />

      {/* Subtle grid overlay — same pattern as HeroSection */}
      <div
        className="pointer-events-none absolute inset-0 grid-pattern opacity-40"
        aria-hidden="true"
      />

      {/* ── Content stack ── */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">

        {/* VIBE wordmark */}
        <motion.img
          src="/vibe-logo.png"
          alt="VIBE"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={logoReady ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-48 sm:w-64 md:w-80 h-auto"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(212, 160, 23, 0.45)) drop-shadow(0 0 80px rgba(212, 160, 23, 0.15))',
          }}
          draggable={false}
        />

        {/* Tagline — typewriter */}
        <div className="min-h-[2rem] md:min-h-[2.75rem] flex items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={taglineReady ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="text-xl md:text-3xl font-bold text-white leading-tight"
            aria-live="polite"
          >
            {taglineText}
            {/* blinking cursor while typing */}
            {taglineReady && !taglineDone && (
              <span className="typewriter-cursor" aria-hidden="true" />
            )}
          </motion.p>
        </div>

        {/* Explore button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={buttonReady ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            onClick={handleExplore}
            onKeyDown={handleKeyDown}
            className="pulse-gold rounded-xl px-10 py-4 text-sm font-bold tracking-widest uppercase transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none"
            style={{
              background: `linear-gradient(135deg, ${COLORS.goldDark}, ${COLORS.gold}, ${COLORS.goldLight})`,
              color: COLORS.dark,
              boxShadow: `0 0 24px ${COLORS.gold}55, 0 4px 24px rgba(0,0,0,0.4)`,
            }}
            aria-label="Enter the VIBE landing page"
          >
            Explore
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}
