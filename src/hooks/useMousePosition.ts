'use client';

import { useState, useEffect, useRef } from 'react';

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafId = useRef(0);

  useEffect(() => {
    let latestX = 0;
    let latestY = 0;
    let ticking = false;

    const handleMove = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (!ticking) {
        ticking = true;
        rafId.current = requestAnimationFrame(() => {
          setPosition({ x: latestX, y: latestY });
          ticking = false;
        });
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return position;
}
