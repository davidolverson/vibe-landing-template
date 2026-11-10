'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '@/lib/constants';

const GOLD = COLORS.gold;
const GOLD_LIGHT = COLORS.goldLight;

/* ── Rising ember particles — CSS-animated, not Framer ── */
function Embers() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      size: 1 + Math.random() * 2.5,
      duration: `${8 + Math.random() * 10}s`,
      delay: `${Math.random() * 8}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute ember-rise"
          style={{
            left: p.left,
            bottom: '5%',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: GOLD,
            boxShadow: `0 0 ${p.size * 3}px ${GOLD}50`,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ── Static building with lit windows ── */
function Building({
  x, baseY, w, h, delay, hasSpire, hasCrown,
}: {
  x: number; baseY: number; w: number; h: number; delay: number;
  hasSpire?: boolean; hasCrown?: boolean;
}) {
  const top = baseY - h;
  const cols = Math.max(2, Math.floor(w / 14));
  const rows = Math.max(3, Math.floor(h / 25));
  const winW = (w - (cols + 1) * 3) / cols;
  const winH = (h - (rows + 1) * 4) / rows;

  // Pre-generate which windows are lit (static, no animation per window)
  const windows = useMemo(() => {
    return Array.from({ length: rows * cols }).map((_, i) => ({
      col: i % cols,
      row: Math.floor(i / cols),
      lit: Math.random() > 0.5,
      opacity: 0.08 + Math.random() * 0.2,
    }));
  }, [rows, cols]);

  return (
    <g>
      {/* Building body */}
      <motion.rect
        x={x} y={top} width={w} height={h}
        fill="rgba(12, 12, 20, 0.95)"
        stroke={GOLD}
        strokeWidth={0.6}
        strokeOpacity={0.12}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: `${x + w / 2}px ${baseY}px` }}
      />

      {/* Gold left edge */}
      <motion.line
        x1={x} y1={top} x2={x} y2={baseY}
        stroke={GOLD} strokeWidth={0.8}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 0.8, delay: delay + 0.6 }}
      />

      {/* Crown */}
      {hasCrown && (
        <motion.rect
          x={x + w * 0.15} y={top - 10}
          width={w * 0.7} height={10}
          fill="rgba(12, 12, 20, 0.95)"
          stroke={GOLD} strokeWidth={0.4} strokeOpacity={0.1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.8 }}
        />
      )}

      {/* Spire */}
      {hasSpire && (
        <>
          <motion.path
            d={`M ${x + w / 2} ${top - 35} L ${x + w / 2 - 3} ${top} L ${x + w / 2 + 3} ${top} Z`}
            fill="rgba(12, 12, 20, 0.95)"
            stroke={GOLD} strokeWidth={0.5} strokeOpacity={0.15}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: delay + 0.8 }}
          />
          {/* Beacon — CSS animated */}
          <circle
            cx={x + w / 2} cy={top - 35} r={2}
            fill={GOLD}
            className="beacon-blink"
          />
        </>
      )}

      {/* Windows — all static rects, no per-window animation */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: delay + 1 }}
      >
        {windows.map((win, i) => {
          if (!win.lit) return null;
          return (
            <rect
              key={i}
              x={x + 3 + win.col * (winW + 3)}
              y={top + 4 + win.row * (winH + 4)}
              width={winW}
              height={winH}
              fill={GOLD}
              opacity={win.opacity}
              rx={0.5}
            />
          );
        })}
      </motion.g>
    </g>
  );
}

/* ── Light rays — just 6 static fading lines ── */
function LightRays() {
  const rays = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const angle = -45 + (i / 5) * 90;
      const rad = (angle * Math.PI) / 180;
      const len = 500 + Math.random() * 300;
      return {
        x2: 960 + Math.sin(rad) * len,
        y2: 780 - Math.cos(rad) * len,
        width: 1.5 + Math.random() * 2,
        delay: 0.8 + i * 0.2,
        opacity: 0.03 + Math.random() * 0.03,
      };
    });
  }, []);

  return (
    <g>
      {rays.map((r, i) => (
        <motion.line
          key={i}
          x1={960} y1={780} x2={r.x2} y2={r.y2}
          stroke={GOLD_LIGHT} strokeWidth={r.width}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: r.opacity, pathLength: 1 }}
          transition={{ duration: 2.5, delay: r.delay, ease: 'easeOut' }}
        />
      ))}
    </g>
  );
}

export default function HeroBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const baseY = 1080;

  const backBuildings = useMemo(() => [
    { x: 40, w: 65, h: 170 }, { x: 120, w: 50, h: 130 },
    { x: 190, w: 80, h: 200 }, { x: 310, w: 55, h: 150 },
    { x: 400, w: 70, h: 180 }, { x: 1250, w: 65, h: 160 },
    { x: 1340, w: 75, h: 190 }, { x: 1450, w: 50, h: 140 },
    { x: 1550, w: 70, h: 175 }, { x: 1650, w: 60, h: 155 },
    { x: 1740, w: 75, h: 185 },
  ], []);

  const frontBuildings = useMemo(() => [
    { x: 60, w: 85, h: 300, hasCrown: true },
    { x: 170, w: 65, h: 240 },
    { x: 260, w: 95, h: 400, hasSpire: true },
    { x: 380, w: 60, h: 260 },
    { x: 465, w: 80, h: 360, hasCrown: true },
    { x: 570, w: 70, h: 280 },
    { x: 670, w: 105, h: 460, hasSpire: true },
    { x: 800, w: 75, h: 330, hasCrown: true },
    { x: 900, w: 90, h: 480, hasSpire: true },
    { x: 1020, w: 65, h: 350 },
    { x: 1110, w: 95, h: 440, hasSpire: true },
    { x: 1230, w: 75, h: 320, hasCrown: true },
    { x: 1330, w: 85, h: 380 },
    { x: 1440, w: 100, h: 500, hasSpire: true },
    { x: 1570, w: 70, h: 280 },
    { x: 1670, w: 90, h: 420, hasCrown: true },
    { x: 1790, w: 75, h: 340 },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Vignette */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, rgba(10, 10, 15, 0.7) 100%)',
        }}
      />

      {/* Horizon glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[50%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.5 }}
        style={{
          background: `radial-gradient(ellipse 80% 35% at 50% 100%,
            rgba(212, 160, 23, 0.12) 0%,
            rgba(212, 160, 23, 0.05) 35%,
            transparent 65%
          )`,
        }}
      />

      {/* Breathing ambient glow */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[50vh] max-h-[600px] ambient-breathe"
        style={{
          background: 'radial-gradient(ellipse, rgba(212, 160, 23, 0.025) 0%, transparent 70%)',
        }}
      />

      {/* SVG skyline */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="hz-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0" />
            <stop offset="30%" stopColor={GOLD} stopOpacity="0.2" />
            <stop offset="50%" stopColor={GOLD_LIGHT} stopOpacity="0.35" />
            <stop offset="70%" stopColor={GOLD} stopOpacity="0.2" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Light rays */}
        <LightRays />

        {/* Back row (dimmer) — skip on mobile */}
        {!isMobile && (
          <g opacity={0.35}>
            {backBuildings.map((b, i) => (
              <Building key={`b-${i}`} x={b.x} baseY={baseY} w={b.w} h={b.h} delay={0.2 + i * 0.08} />
            ))}
          </g>
        )}

        {/* Horizon glow line */}
        <motion.rect
          x={0} y={baseY - 3} width={1920} height={3}
          fill="url(#hz-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.6 }}
        />

        {/* Front row — every other building on mobile */}
        {(isMobile ? frontBuildings.filter((_, i) => i % 2 === 0) : frontBuildings).map((b, i) => (
          <Building
            key={`f-${i}`}
            x={b.x} baseY={baseY} w={b.w} h={b.h}
            delay={0.1 + i * 0.06}
            hasSpire={(b as { hasSpire?: boolean }).hasSpire}
            hasCrown={(b as { hasCrown?: boolean }).hasCrown}
          />
        ))}

        {/* HUD corners */}
        <motion.path
          d="M 50 45 L 50 30 L 90 30"
          fill="none" stroke={GOLD} strokeWidth={0.8}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 0.15, pathLength: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
        />
        <motion.path
          d="M 1870 1050 L 1870 1060 L 1830 1060"
          fill="none" stroke={GOLD} strokeWidth={0.8}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 0.15, pathLength: 1 }}
          transition={{ duration: 1.5, delay: 2.2 }}
        />
      </svg>

      {/* Embers */}
      <Embers />

      {/* Sweeping spotlight — CSS animated */}
      <div
        className="absolute bottom-0 w-[500px] h-[700px] skyline-spotlight"
        style={{
          background: `radial-gradient(ellipse 40% 80% at 50% 100%, rgba(212, 160, 23, 0.05), transparent 70%)`,
        }}
      />

      {/* Horizon heartbeat — CSS animated */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] horizon-pulse"
        style={{
          background: `linear-gradient(90deg, transparent, ${GOLD}40, ${GOLD_LIGHT}70, ${GOLD}40, transparent)`,
        }}
      />
    </div>
  );
}
