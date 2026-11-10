'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { TECH_STACK } from '@/lib/constants';

type TechItem = (typeof TECH_STACK)[number];

interface OrbitItemProps {
  item: TechItem;
  index: number;
  total: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
  anyHovered: boolean;
}

function OrbitItem({
  item,
  index,
  total,
  isHovered,
  onHover,
  anyHovered,
}: OrbitItemProps) {
  // Each item gets a different orbit radius and speed
  const baseAngle = (360 / total) * index;
  const radius = 140 + (index % 3) * 30; // 140, 170, 200 px
  const duration = 20 + index * 4; // different speeds

  return (
    <motion.div
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
      }}
      animate={
        isHovered
          ? {} // paused when hovered
          : {
              rotate: [baseAngle, baseAngle + 360],
            }
      }
      transition={
        isHovered
          ? {}
          : {
              rotate: {
                duration,
                repeat: Infinity,
                ease: 'linear',
              },
            }
      }
    >
      <motion.div
        className="absolute"
        style={{
          top: `-${radius}px`,
          left: '-40px',
        }}
        animate={
          isHovered
            ? {}
            : {
                rotate: [-baseAngle, -(baseAngle + 360)],
              }
        }
        transition={
          isHovered
            ? {}
            : {
                rotate: {
                  duration,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }
        }
      >
        <motion.button
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onHover(null)}
          animate={{
            scale: isHovered ? 1.3 : anyHovered && !isHovered ? 0.85 : 1,
            opacity: anyHovered && !isHovered ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                     bg-dark-mid border border-gold/30 text-light/90
                     hover:border-gold hover:bg-gold/10 transition-colors"
        >
          {item.name}

          {/* Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                           px-3 py-1.5 rounded-lg bg-gold text-dark text-xs font-medium
                           whitespace-nowrap shadow-lg z-20"
              >
                {item.description}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function ConnectionLine({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const baseAngle = (360 / total) * index;
  const radius = 140 + (index % 3) * 30;
  const angleRad = (baseAngle * Math.PI) / 180;
  const endX = Math.sin(angleRad) * radius;
  const endY = -Math.cos(angleRad) * radius;

  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-1/2 left-1/2 pointer-events-none z-0"
      style={{ overflow: 'visible' }}
      width="1"
      height="1"
    >
      <motion.line
        x1="0"
        y1="0"
        x2={endX}
        y2={endY}
        stroke="#D4A017"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
}

function MobileGrid({ inView }: { inView: boolean }) {
  return (
    <div className="md:hidden grid grid-cols-2 gap-3 mt-10">
      {TECH_STACK.map((item, i) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="glass-card rounded-xl p-4 text-center"
        >
          <p className="text-sm font-semibold text-gold mb-1">{item.name}</p>
          <p className="text-xs text-light/60">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function DesktopOrbit({ inView }: { inView: boolean }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="hidden md:flex items-center justify-center mt-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
        style={{ width: '460px', height: '460px' }}
      >
        {/* Orbit rings (subtle) */}
        {[140, 170, 200].map((r) => (
          <div
            key={r}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10"
            style={{ width: r * 2, height: r * 2 }}
          />
        ))}

        {/* Center VIBE */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(212,160,23,0.3)',
                '0 0 40px rgba(212,160,23,0.5)',
                '0 0 20px rgba(212,160,23,0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-full bg-gold flex items-center justify-center"
          >
            <span className="text-dark font-black text-xl tracking-wider">
              VIBE
            </span>
          </motion.div>
        </div>

        {/* Connection line */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <ConnectionLine
              index={hoveredIndex}
              total={TECH_STACK.length}
            />
          )}
        </AnimatePresence>

        {/* Orbiting items */}
        {TECH_STACK.map((item, i) => (
          <OrbitItem
            key={item.name}
            item={item}
            index={i}
            total={TECH_STACK.length}
            isHovered={hoveredIndex === i}
            onHover={setHoveredIndex}
            anyHovered={hoveredIndex !== null}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default function TechSection() {
  const { ref, inView } = useInView(0.15);

  return (
    <section
      ref={ref}
      className="section-dark py-16 md:py-24 px-4"
      id="tech"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-light mb-3">
            Built different.{' '}
            <span className="text-gold text-glow">Literally.</span>
          </h2>
          <p className="text-light/50 text-lg">
            Modern stack. No legacy baggage. No duct tape.
          </p>
        </motion.div>

        <DesktopOrbit inView={inView} />
        <MobileGrid inView={inView} />
      </div>
    </section>
  );
}
