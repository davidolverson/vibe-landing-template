'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Component,
  type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useMousePosition } from '@/hooks/useMousePosition';
import { BRAND, COLORS, BUSINESS_TYPES } from '@/lib/constants';
import HeroBackground from './HeroBackground';
import { WaitlistForm } from './WaitlistSection';

/* ─── Error Boundary ─── */
class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/* ─── Lazy Three.js Canvas ─── */
const ThreeCanvas = dynamic(() => import('./HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

/* ─── 2D Fallback Logo ─── */
function FallbackLogo({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={visible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <img
        src="/vibe-logo.png"
        alt="VIBE"
        className="w-48 md:w-72 h-auto"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(212, 160, 23, 0.4))',
        }}
        draggable={false}
      />
    </motion.div>
  );
}

/* ─── Typewriter Effect ─── */
function TypewriterText({
  text,
  delay = 0,
  speed = 40,
  className = '',
  onComplete,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setDone(true);
      onComplete?.();
    }
  }, [started, displayed, text, speed, onComplete]);

  if (!started) return <span className={className}>&nbsp;</span>;

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </span>
  );
}

/* ─── Business Type Badge ─── */
function BusinessBadge({
  label,
  delay,
  phase,
}: {
  label: string;
  delay: number;
  phase: number;
}) {
  return (
    <motion.span
      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide uppercase border whitespace-nowrap"
      style={{
        borderColor: `${COLORS.gold}55`,
        color: COLORS.gold,
        backgroundColor: `${COLORS.gold}12`,
        backdropFilter: 'blur(4px)',
      }}
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {label}
    </motion.span>
  );
}

/* ─── Pain Counter Row ─── */
function PainCounter({ phase }: { phase: number }) {
  const items = [
    { n: '10', label: 'websites' },
    { n: '10', label: 'CRMs' },
    { n: '10', label: 'logins' },
  ];

  return (
    <motion.div
      className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap"
      initial={{ opacity: 0, y: 16 }}
      animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
    >
      {items.map(({ n, label }, i) => (
        <span key={label} className="flex items-center gap-1.5 sm:gap-2">
          <span
            className="text-xl sm:text-2xl md:text-3xl font-black tabular-nums"
            style={{
              color: COLORS.gold,
              textShadow: `0 0 20px ${COLORS.gold}60`,
            }}
          >
            {n}
          </span>
          <span className="text-sm sm:text-base md:text-lg font-medium text-white/70">
            {label}.
          </span>
          {i < items.length - 1 && (
            <span className="text-white/20 text-lg font-light ml-1 sm:ml-2">|</span>
          )}
        </span>
      ))}
      <span
        className="text-sm sm:text-base md:text-lg font-bold tracking-wide"
        style={{ color: COLORS.goldLight }}
      >
        One problem.
      </span>
    </motion.div>
  );
}

/* ─── Main Hero Section ─── */
export default function HeroSection() {
  const mouse = useMousePosition();
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  // 0 = black  |  1 = canvas + form  |  2 = text + badges  |  3 = CTA extras
  const [hasWebGL, setHasWebGL] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Orchestrate load sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // canvas + form slides in
      setTimeout(() => setPhase(2), 1400),  // pain hook + badges
      setTimeout(() => setPhase(3), 2600),  // typewriter + sub-copy
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Parallax centers
  const [center, setCenter] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const update = () =>
      setCenter({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const parallaxFg = {
    x: (mouse.x - center.x) * 0.02,
    y: (mouse.y - center.y) * 0.02,
  };
  const parallaxBg = {
    x: (mouse.x - center.x) * -0.01,
    y: (mouse.y - center.y) * -0.01,
  };

  const handleTypewriterComplete = useCallback(() => {}, []);

  // Badge stagger timing — 8 types, start at delay 0.3
  const badgeDelays = BUSINESS_TYPES.map((_, i) => 0.3 + i * 0.08);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden grid-pattern"
      style={{ background: COLORS.dark }}
    >
      {/* Accessible heading for screen readers */}
      <h1 className="sr-only">VIBE — One CRM for every business line</h1>

      {/* Cinematic SVG background */}
      {mounted && <HeroBackground />}

      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(212, 160, 23, 0.06), transparent 60%)`,
          opacity: phase >= 1 ? 1 : 0,
        }}
      />

      {/* 3D Canvas — background layer with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ x: parallaxBg.x, y: parallaxBg.y }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      >
        {mounted && hasWebGL ? (
          <div
            className="w-full h-full transition-opacity duration-1000"
            style={{ opacity: phase >= 1 ? 1 : 0 }}
          >
            <CanvasErrorBoundary
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <FallbackLogo visible={phase >= 1} />
                </div>
              }
            >
              <ThreeCanvas logoVisible={phase >= 1} />
            </CanvasErrorBoundary>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FallbackLogo visible={phase >= 1} />
          </div>
        )}
      </motion.div>

      {/* Dashboard screenshot removed from here — moved into foreground content flow */}

      {/* ─── Foreground Content ─── */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-start min-h-screen px-4 pt-4 sm:pt-6 pb-8 text-center"
        animate={{ x: parallaxFg.x, y: parallaxFg.y }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      >
        {/*
          LAYOUT ORDER (top to bottom, mobile-first):
          1. Logo spacer (3D canvas occupies this area)
          2. Pain hook: "10 websites. 10 CRMs. 10 logins. One problem."
          3. Tagline (typewriter)
          4. Sub-copy
          5. Business-type badge swarm
          6. Brand name micro-label
          7. Scroll indicator
        */}

        {/* Spacer that clears the 3D logo area */}
        <div className="h-[60px] sm:h-[200px] md:h-[240px] shrink-0" aria-hidden="true" />

        {/* ── 1. Pain hook ── */}
        <PainCounter phase={phase} />

        {/* ── 2. Typewriter tagline ── */}
        <div className="min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3.5rem] flex items-center mt-4">
          {phase >= 3 && (
            <TypewriterText
              text={BRAND.tagline}
              delay={300}
              speed={32}
              className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold leading-tight text-white"
              onComplete={handleTypewriterComplete}
            />
          )}
        </div>

        {/* ── 3. Sub-copy ── */}
        <motion.p
          className="text-xs sm:text-sm md:text-base text-white/45 max-w-md leading-relaxed mt-3"
          initial={{ opacity: 0, y: 8 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          {BRAND.subtitle}
        </motion.p>

        {/* ── 4. Business-type badge swarm ── */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 max-w-sm sm:max-w-md md:max-w-lg mt-4 sm:mt-6 mb-2"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          aria-label="Business types VIBE unifies"
        >
          {BUSINESS_TYPES.filter((t) => t !== 'Other').map((type, i) => (
            <BusinessBadge
              key={type}
              label={type}
              delay={badgeDelays[i] ?? 0.3}
              phase={phase}
            />
          ))}
          {/* Merge arrow + VIBE label */}
          <motion.span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase"
            style={{
              background: `linear-gradient(135deg, ${COLORS.goldDark}, ${COLORS.gold}, ${COLORS.goldLight})`,
              color: COLORS.dark,
              boxShadow: `0 0 16px ${COLORS.gold}55`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.3 + BUSINESS_TYPES.length * 0.08 + 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 5H9M6 2L9 5L6 8"
                stroke={COLORS.dark}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            VIBE
          </motion.span>
        </motion.div>

        {/* ── 5. Brand name micro-label ── */}
        <motion.p
          className="text-[10px] sm:text-[11px] font-light uppercase text-white/30 tracking-[0.3em] mt-3"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 2 }}
        >
          {BRAND.fullName}
        </motion.p>

        {/* ── 6. Dashboard preview ── */}
        <motion.div
          className="w-[95%] sm:w-[85%] max-w-[1100px] rounded-2xl overflow-hidden mt-4 sm:mt-12"
          style={{
            boxShadow: '0 0 40px rgba(212, 160, 23, 0.15), 0 20px 60px rgba(0,0,0,0.5)',
          }}
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/opengraph-image.jpeg"
            alt="VIBE dashboard showing unified pipeline across all business lines"
            width={1500}
            height={788}
            priority
            quality={80}
            sizes="(max-width: 768px) 95vw, 1100px"
            className="w-full h-auto"
          />
        </motion.div>

        {/* ── 7. Waitlist form ── */}
        <div className="w-full max-w-md mt-8 sm:mt-12 px-2">
          <WaitlistForm visible={phase >= 2} />
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          className="mt-auto pt-10 hidden sm:flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          aria-hidden="true"
        >
          <span className="text-xs tracking-widest uppercase text-white/40">
            Scroll
          </span>
          <motion.svg
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            className="text-white/40"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M10 4 L10 20 M4 14 L10 22 L16 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
