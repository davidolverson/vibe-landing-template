'use client';

import { useState, useEffect } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const { x, y } = useMousePosition();
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    setHasFinePointer(fine);
    if (fine) {
      document.body.classList.add('custom-cursor-active');
      return () => document.body.classList.remove('custom-cursor-active');
    }
  }, []);

  if (!hasFinePointer) return null;

  return (
    <div aria-hidden="true">
      {/* Main dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] h-3 w-3 rounded-full bg-[var(--gold)] mix-blend-difference"
        animate={{ x: x - 6, y: y - 6 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      />
      {/* Trailing glow */}
      <motion.div
        className="pointer-events-none fixed z-[9998] h-8 w-8 rounded-full border border-[var(--gold)] opacity-40"
        animate={{ x: x - 16, y: y - 16 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.8 }}
      />
    </div>
  );
}
