'use client';

import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from 'framer-motion';
import { WORKFLOW_STEPS } from '@/lib/constants';

/* ------------------------------------------------------------------ */
/* Step illustration — simple CSS/SVG shapes per step                  */
/* ------------------------------------------------------------------ */
function StepIllustration({
  step,
  progress,
}: {
  step: number;
  progress: number;
}) {
  const active = progress > 0.15;

  const shared =
    'w-full h-full flex items-center justify-center overflow-hidden';

  switch (step) {
    /* 1 — incoming signals converging */
    case 1:
      return (
        <div className={shared}>
          <svg viewBox="0 0 120 120" className="w-28 h-28">
            <circle
              cx="60"
              cy="60"
              r="16"
              fill="none"
              stroke="#D4A017"
              strokeWidth="2"
              opacity={active ? 1 : 0.3}
              style={{ transition: 'opacity .4s' }}
            />
            {[0, 72, 144, 216, 288].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 60 + 50 * Math.cos(rad);
              const y1 = 60 + 50 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={60}
                  y2={60}
                  stroke="#D4A017"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity={active ? 1 : 0.2}
                  style={{
                    transition: `opacity .4s ${i * 0.1}s`,
                  }}
                />
              );
            })}
          </svg>
        </div>
      );

    /* 2 — dedup merge */
    case 2:
      return (
        <div className={shared}>
          <svg viewBox="0 0 120 120" className="w-28 h-28">
            <circle
              cx="40"
              cy="60"
              r="22"
              fill="none"
              stroke="#D4A017"
              strokeWidth="2"
              opacity={active ? 1 : 0.3}
              style={{ transition: 'opacity .4s' }}
            />
            <circle
              cx="80"
              cy="60"
              r="22"
              fill="none"
              stroke="#D4A017"
              strokeWidth="2"
              opacity={active ? 1 : 0.3}
              style={{ transition: 'opacity .4s .1s' }}
            />
            <path
              d="M60 42 Q60 60 60 78"
              stroke="#D4A017"
              strokeWidth="2"
              fill="none"
              opacity={active ? 1 : 0}
              style={{ transition: 'opacity .4s .2s' }}
            />
          </svg>
        </div>
      );

    /* 3 — speed clock */
    case 3:
      return (
        <div className={shared}>
          <svg viewBox="0 0 120 120" className="w-28 h-28">
            <circle
              cx="60"
              cy="60"
              r="40"
              fill="none"
              stroke="#D4A017"
              strokeWidth="2"
              opacity={active ? 1 : 0.3}
              style={{ transition: 'opacity .4s' }}
            />
            <line
              x1="60"
              y1="60"
              x2="60"
              y2="28"
              stroke="#D4A017"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                transformOrigin: '60px 60px',
                transform: active
                  ? 'rotate(360deg)'
                  : 'rotate(0deg)',
                transition: 'transform 1.5s ease-in-out',
              }}
            />
            <circle cx="60" cy="60" r="3" fill="#D4A017" />
          </svg>
        </div>
      );

    /* 4 — comms channels */
    case 4:
      return (
        <div className={shared}>
          <svg viewBox="0 0 120 120" className="w-28 h-28">
            <rect
              x="30"
              y="35"
              width="60"
              height="50"
              rx="8"
              fill="none"
              stroke="#D4A017"
              strokeWidth="2"
              opacity={active ? 1 : 0.3}
              style={{ transition: 'opacity .4s' }}
            />
            <polyline
              points="30,40 60,62 90,40"
              fill="none"
              stroke="#D4A017"
              strokeWidth="2"
              opacity={active ? 1 : 0.3}
              style={{ transition: 'opacity .4s .1s' }}
            />
          </svg>
        </div>
      );

    /* 5 — kanban columns */
    case 5:
      return (
        <div className={shared}>
          <svg viewBox="0 0 120 120" className="w-28 h-28">
            {[25, 50, 75].map((x, i) => (
              <g key={i}>
                <rect
                  x={x - 10}
                  y="25"
                  width="20"
                  height="70"
                  rx="4"
                  fill="none"
                  stroke="#D4A017"
                  strokeWidth="1.5"
                  opacity={active ? 1 : 0.3}
                  style={{ transition: `opacity .4s ${i * 0.1}s` }}
                />
                <rect
                  x={x - 6}
                  y={30 + i * 8}
                  width="12"
                  height="8"
                  rx="2"
                  fill="#D4A017"
                  opacity={active ? 0.8 : 0.15}
                  style={{ transition: `opacity .4s ${i * 0.15}s` }}
                />
              </g>
            ))}
            <line
              x1="35"
              y1="60"
              x2="85"
              y2="60"
              stroke="#D4A017"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity={active ? 0.5 : 0}
              style={{ transition: 'opacity .5s .3s' }}
            />
          </svg>
        </div>
      );

    /* 6 — sync arrow */
    case 6:
      return (
        <div className={shared}>
          <svg viewBox="0 0 120 120" className="w-28 h-28">
            <rect
              x="15"
              y="35"
              width="35"
              height="50"
              rx="6"
              fill="none"
              stroke="#D4A017"
              strokeWidth="2"
              opacity={active ? 1 : 0.3}
              style={{ transition: 'opacity .4s' }}
            />
            <rect
              x="70"
              y="35"
              width="35"
              height="50"
              rx="6"
              fill="none"
              stroke="#D4A017"
              strokeWidth="2"
              opacity={active ? 1 : 0.3}
              style={{ transition: 'opacity .4s .1s' }}
            />
            <line
              x1="52"
              y1="55"
              x2="68"
              y2="55"
              stroke="#D4A017"
              strokeWidth="2"
              markerEnd="url(#arrow)"
              opacity={active ? 1 : 0}
              style={{ transition: 'opacity .4s .2s' }}
            />
            <line
              x1="68"
              y1="65"
              x2="52"
              y2="65"
              stroke="#D4A017"
              strokeWidth="2"
              markerEnd="url(#arrow)"
              opacity={active ? 1 : 0}
              style={{ transition: 'opacity .4s .3s' }}
            />
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#D4A017" />
              </marker>
            </defs>
          </svg>
        </div>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Speed counter for step 3                                            */
/* ------------------------------------------------------------------ */
function SpeedCounter({ active }: { active: boolean }) {
  const motionVal = useMotionValue(30);
  const [display, setDisplay] = useState(30);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (active && !hasAnimated.current) {
      hasAnimated.current = true;
      const controls = animate(motionVal, 0, {
        duration: 1.8,
        ease: 'easeOut',
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
      return () => controls.stop();
    }
  }, [active, motionVal]);

  return (
    <div className="flex items-baseline gap-1 mt-3">
      <span className="text-4xl md:text-5xl font-bold text-gold tabular-nums">
        {display}
      </span>
      <span className="text-lg text-gold/70">seconds</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main section                                                        */
/* ------------------------------------------------------------------ */
export default function WorkflowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* progress bar height mirrors scroll progress */
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  /* current step index (0-5) derived from scroll */
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.min(
        WORKFLOW_STEPS.length - 1,
        Math.floor(v * WORKFLOW_STEPS.length)
      );
      setCurrentIdx(idx);
    });
    return unsub;
  }, [scrollYProgress]);

  /* per-step progress (0-1) derived from scrollYProgress without hooks in loops */
  // Use individual useTransform calls for each step (fixed count = 6)
  const step0Progress = useTransform(scrollYProgress, [0 / 6, 1 / 6], [0, 1]);
  const step1Progress = useTransform(scrollYProgress, [1 / 6, 2 / 6], [0, 1]);
  const step2Progress = useTransform(scrollYProgress, [2 / 6, 3 / 6], [0, 1]);
  const step3Progress = useTransform(scrollYProgress, [3 / 6, 4 / 6], [0, 1]);
  const step4Progress = useTransform(scrollYProgress, [4 / 6, 5 / 6], [0, 1]);
  const step5Progress = useTransform(scrollYProgress, [5 / 6, 6 / 6], [0, 1]);
  const stepProgresses = [step0Progress, step1Progress, step2Progress, step3Progress, step4Progress, step5Progress];

  /* subscribe to per-step motion values so we can pass them as numbers */
  const [stepProgressValues, setStepProgressValues] = useState<number[]>(
    () => WORKFLOW_STEPS.map(() => 0)
  );

  useEffect(() => {
    const unsubs = stepProgresses.map((mv, i) =>
      mv.on('change', (v) =>
        setStepProgressValues((prev) => {
          const next = [...prev];
          next[i] = v;
          return next;
        })
      )
    );
    return () => unsubs.forEach((u) => u());
    // stepProgresses refs are stable (fixed hook calls above)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative section-light"
      style={{ height: `${WORKFLOW_STEPS.length * 50}vh` }}
    >
      {/* ---- Sticky frame ---- */}
      <div className="sticky top-0 min-h-screen md:h-screen flex flex-col overflow-hidden">
        {/* Sticky step indicator bar */}
        <div className="w-full bg-white/80 backdrop-blur border-b border-gray-200 py-2 sm:py-3 px-4 sm:px-6 md:px-12 z-10">
          <p className="text-xs sm:text-sm font-medium text-gray-500 tracking-widest uppercase">
            Step {WORKFLOW_STEPS[currentIdx].step} /{' '}
            {WORKFLOW_STEPS.length}
          </p>
          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            {WORKFLOW_STEPS[currentIdx].title}
          </p>
        </div>

        <div className="flex-1 flex">
          {/* ---- Progress bar (hidden mobile) ---- */}
          <div className="relative hidden md:flex flex-col items-center py-12 pl-8 pr-4 w-16 shrink-0">
            <div className="relative w-[3px] flex-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full rounded-full"
                style={{
                  height: progressHeight,
                  background:
                    'linear-gradient(180deg, #B8860B, #D4A017, #E8C547)',
                }}
              />
            </div>
            {/* nodes */}
            {WORKFLOW_STEPS.map((_, i) => {
              const topPct = ((i + 0.5) / WORKFLOW_STEPS.length) * 100;
              const isActive = i <= currentIdx;
              return (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full border-2 transition-colors duration-300 -translate-x-1/2"
                  style={{
                    top: `calc(${topPct}% * 0.76 + 48px + 24px)`,
                    left: '50%',
                    borderColor: isActive ? '#D4A017' : '#d1d5db',
                    backgroundColor: isActive ? '#D4A017' : '#fff',
                  }}
                />
              );
            })}
          </div>

          {/* ---- Main content area ---- */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24">
            {/* Headline — visible only at top */}
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 font-serif"
              style={{
                opacity: headlineOpacity,
              }}
            >
              From lead to close — in one platform
            </motion.h2>
            <motion.div
              className="h-1 w-20 bg-gold rounded mb-8"
              style={{
                opacity: headlineOpacity,
              }}
            />

            {/* Steps — crossfade */}
            <div className="relative flex-1 flex items-center">
              {WORKFLOW_STEPS.map((ws, i) => {
                const isVisible = i === currentIdx;
                return (
                  <motion.div
                    key={ws.step}
                    className="absolute inset-0 flex items-center"
                    initial={false}
                    animate={{
                      opacity: isVisible ? 1 : 0,
                      y: isVisible ? 0 : 30,
                    }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 w-full max-w-5xl">
                      {/* Text */}
                      <div className="flex flex-col justify-center">
                        <span className="text-4xl sm:text-6xl md:text-8xl font-bold text-gold/20 leading-none select-none">
                          {String(ws.step).padStart(2, '0')}
                        </span>
                        <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mt-2">
                          {ws.title}
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2 md:mt-3 max-w-md">
                          {ws.description}
                        </p>

                        {/* Speed counter on step 3 */}
                        {ws.step === 3 && (
                          <SpeedCounter active={currentIdx === 2} />
                        )}
                      </div>

                      {/* Illustration */}
                      <div className="flex items-center justify-center">
                        <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <StepIllustration
                            step={ws.step}
                            progress={stepProgressValues[i]}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
