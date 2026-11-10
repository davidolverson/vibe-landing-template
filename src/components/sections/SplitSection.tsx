'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { DAY_COMPARISON } from '@/lib/constants';

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-gold shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-400 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function MobileView({ inView }: { inView: boolean }) {
  return (
    <div className="md:hidden space-y-8">
      {/* Without VIBE */}
      <div className="rounded-2xl bg-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-500 mb-4 uppercase tracking-wider">
          Without VIBE
        </h3>
        <div className="space-y-4">
          {DAY_COMPARISON.map((row, i) => (
            <motion.div
              key={`without-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex items-start gap-3"
            >
              <span className="text-xs font-mono text-gray-400 mt-0.5 w-16 shrink-0">
                {row.time}
              </span>
              <XIcon />
              <span className="text-sm text-gray-500">{row.without}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* With VIBE */}
      <div className="rounded-2xl bg-dark p-6 gold-glow">
        <h3 className="text-lg font-bold text-gold mb-4 uppercase tracking-wider">
          With VIBE
        </h3>
        <div className="space-y-4">
          {DAY_COMPARISON.map((row, i) => (
            <motion.div
              key={`with-${i}`}
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.12 + 0.3 }}
              className="flex items-start gap-3"
            >
              <span className="text-xs font-mono text-gold/60 mt-0.5 w-16 shrink-0">
                {row.time}
              </span>
              <CheckIcon />
              <span className="text-sm text-light/90">{row.with}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopView({ inView }: { inView: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dividerPos, setDividerPos] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Track container width to avoid accessing ref in render
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const updateDivider = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(15, Math.min(85, (x / rect.width) * 100));
      setDividerPos(pct);
    },
    [isDragging]
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => updateDivider(e.clientX);
    const onTouchMove = (e: TouchEvent) => updateDivider(e.touches[0].clientX);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, updateDivider, handleDragEnd]);

  // Scroll distortion effect
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Calculate how far through the section we've scrolled
      const sectionTop = rect.top;
      const sectionH = rect.height;
      const progress = Math.max(
        0,
        Math.min(1, (windowH - sectionTop) / (windowH + sectionH))
      );
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftBlur = Math.min(scrollProgress * 4, 3); // max 3px blur
  const rightBrightness = 1 + scrollProgress * 0.15; // max 1.15 brightness

  return (
    <div
      ref={containerRef}
      className="hidden md:block relative overflow-hidden rounded-2xl border border-gray-200"
      style={{ height: `${DAY_COMPARISON.length * 72 + 80}px` }}
    >
      {/* Left side - Without VIBE */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{
          width: `${dividerPos}%`,
          filter: `blur(${leftBlur}px)`,
          transition: isDragging ? 'none' : 'width 0.1s ease',
        }}
      >
        <div
          className="h-full p-8"
          style={{
            width: containerWidth ? `${containerWidth}px` : '100%',
            background:
              '#f0f0f0 repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px)',
          }}
        >
          <h3 className="text-xl font-bold text-gray-400 mb-6 uppercase tracking-wider">
            Without VIBE
          </h3>
          <div className="space-y-4">
            {DAY_COMPARISON.map((row, i) => (
              <motion.div
                key={`left-${i}`}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="flex items-center gap-4 py-2"
              >
                <span className="text-sm font-mono text-gray-400 w-20 shrink-0">
                  {row.time}
                </span>
                <XIcon />
                <span className="text-sm text-gray-500">{row.without}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - With VIBE */}
      <div
        className="absolute top-0 right-0 h-full overflow-hidden"
        style={{
          width: `${100 - dividerPos}%`,
          filter: `brightness(${rightBrightness})`,
          transition: isDragging ? 'none' : 'width 0.1s ease',
        }}
      >
        <div
          className="h-full p-8"
          style={{
            width: containerWidth ? `${containerWidth}px` : '100%',
            marginLeft: containerWidth
              ? `-${(containerWidth * dividerPos) / 100}px`
              : '0',
            background: '#0A0A0F',
          }}
        >
          <div className="flex justify-end">
            <h3 className="text-xl font-bold text-gold mb-6 uppercase tracking-wider">
              With VIBE
            </h3>
          </div>
          <div className="space-y-4">
            {DAY_COMPARISON.map((row, i) => (
              <motion.div
                key={`right-${i}`}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.15 + 0.2 }}
                className="flex items-center gap-4 py-2"
              >
                <span className="text-sm font-mono text-gold/50 w-20 shrink-0">
                  {row.time}
                </span>
                <CheckIcon />
                <span className="text-sm text-light/90">{row.with}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Draggable divider */}
      <div
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        role="separator"
        aria-valuenow={Math.round(dividerPos)}
        aria-valuemin={15}
        aria-valuemax={85}
        aria-label="Drag to compare day without and with VIBE"
        className="absolute top-0 h-full z-10 flex items-center"
        style={{
          left: `${dividerPos}%`,
          transform: 'translateX(-50%)',
          cursor: 'col-resize !important',
          touchAction: 'none',
        }}
      >
        <div className="w-1 h-full bg-gold/80 relative">
          {/* Drag handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold flex items-center justify-center shadow-lg gold-glow">
            <svg
              className="w-5 h-5 text-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 9l4-4 4 4M8 15l4 4 4-4"
                transform="rotate(90 12 12)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SplitSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="py-20 md:py-28 px-4 bg-white" id="split">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            A day <span className="text-gray-400">without</span> vs{' '}
            <span className="text-gold-dark">with</span> VIBE
          </h2>
          <p className="text-gray-500 text-lg hidden md:block">
            Drag the divider to compare your day.
          </p>
        </motion.div>

        <DesktopView inView={inView} />
        <MobileView inView={inView} />
      </div>
    </section>
  );
}
