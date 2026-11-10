'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import SplashScreen from '@/components/SplashScreen';

import HeroSection from '@/components/sections/HeroSection';
import PainSection from '@/components/sections/PainSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ComparisonSection from '@/components/sections/ComparisonSection';
import WorkflowSection from '@/components/sections/WorkflowSection';
import FoundingSection from '@/components/sections/FoundingSection';
import ChatSection from '@/components/sections/ChatSection';
import SplitSection from '@/components/sections/SplitSection';
import TechSection from '@/components/sections/TechSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/sections/Footer';

/* ── Konami Code Easter Egg ── */
const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

function GoldMatrixRain() {
  const columns = 30;
  const chars = 'VIBE01CRMLEAD$CLOSE'.split('');

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      style={{ background: 'rgba(10, 10, 15, 0.92)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {Array.from({ length: columns }).map((_, col) => (
        <motion.div
          key={col}
          className="absolute top-0 text-xs md:text-sm font-mono leading-tight"
          style={{
            left: `${(col / columns) * 100}%`,
            color: '#D4A017',
            textShadow: '0 0 8px rgba(212, 160, 23, 0.6)',
            writingMode: 'vertical-lr',
          }}
          initial={{ y: -200 }}
          animate={{ y: '110vh' }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 1.5,
            ease: 'linear',
          }}
        >
          {Array.from({ length: 20 })
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join('')}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ── Context Menu Toast ── */
function ContextToast({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 px-6 py-3 rounded-full glass-card text-sm md:text-base text-white/80"
      style={{
        border: '1px solid rgba(212, 160, 23, 0.3)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      Nice try — Want to build something like this?{' '}
      <span style={{ color: '#D4A017' }}>Join VIBE.</span>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showContextToast, setShowContextToast] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);

  // Konami code listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === KONAMI_SEQUENCE[konamiIndex]) {
        const next = konamiIndex + 1;
        if (next === KONAMI_SEQUENCE.length) {
          setShowMatrix(true);
          setKonamiIndex(0);
          setTimeout(() => setShowMatrix(false), 4000);
        } else {
          setKonamiIndex(next);
        }
      } else {
        setKonamiIndex(0);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  // Prevent copy and show toast on both desktop (right-click) and mobile (long-press copy)
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextToast(true);
  }, []);

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setShowContextToast(true);
    };
    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  const dismissToast = useCallback(() => {
    setShowContextToast(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {/* Splash / landing switcher */}
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onExplore={() => setShowSplash(false)} />
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <main onContextMenu={handleContextMenu} className="select-none">
              {/* Global UI */}
              <CustomCursor />
              <ScrollProgress />

              {/* Easter eggs */}
              <AnimatePresence>
                {showMatrix && <GoldMatrixRain />}
              </AnimatePresence>
              <AnimatePresence>
                {showContextToast && <ContextToast onDismiss={dismissToast} />}
              </AnimatePresence>

              {/* Sections */}
              <HeroSection />
              <PainSection />
              <FeaturesSection />
              <ComparisonSection />
              <WorkflowSection />
              <FoundingSection />
              <ChatSection />
              <SplitSection />
              <TechSection />
              <CTASection />
              <Footer />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
