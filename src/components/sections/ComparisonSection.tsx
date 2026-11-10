'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { COMPETITORS } from '@/lib/constants';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CellValue = boolean | string;

interface FeatureRow {
  label: string;
  key: string;
  vibeValue: string;
  getCompetitorValue: (c: (typeof COMPETITORS)[number]) => CellValue;
}

/* ------------------------------------------------------------------ */
/*  Feature row definitions                                            */
/* ------------------------------------------------------------------ */

const FEATURE_ROWS: FeatureRow[] = [
  {
    label: 'Unified Leads',
    key: 'unified',
    vibeValue: 'Yes',
    getCompetitorValue: (c) => c.unified,
  },
  {
    label: 'Multi-Site Capture',
    key: 'multiSite',
    vibeValue: 'Yes',
    getCompetitorValue: (c) => c.multiSite,
  },
  {
    label: 'QuickBooks Sync',
    key: 'qbo',
    vibeValue: 'Native',
    getCompetitorValue: (c) => c.qbo,
  },
  {
    label: 'Owner Dashboards',
    key: 'dashboards',
    vibeValue: 'Yes',
    getCompetitorValue: (c) => c.dashboards,
  },
  {
    label: 'Comms Hub',
    key: 'comms',
    vibeValue: 'Full',
    getCompetitorValue: (c) => c.comms,
  },
  {
    label: 'IDX Integration',
    key: 'idx',
    vibeValue: 'Built-in',
    getCompetitorValue: (c) => c.idx,
  },
  {
    label: 'Multi-Tenant',
    key: 'multiTenant',
    vibeValue: 'Yes',
    getCompetitorValue: (c) => c.multiTenant,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function renderCellValue(value: CellValue): React.ReactNode {
  if (value === true || value === 'Yes') {
    return (
      <span className="text-green-600 font-semibold text-sm">Yes</span>
    );
  }
  if (value === false) {
    return (
      <svg className="w-5 h-5 text-red-400 mx-auto" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return <span className="text-gray-500 text-sm">{value}</span>;
}

/** Calculate scaled price for team-size slider */
function scalePrice(basePrice: string, teamSize: number): string {
  const match = basePrice.match(/\d+/);
  if (!match) return basePrice;
  const base = parseInt(match[0], 10);
  // Most CRMs charge per-seat; model a rough multiplier
  const perSeatFactor = teamSize <= 5 ? 1 : 1 + (teamSize - 5) * 0.15;
  const scaled = Math.round(base * perSeatFactor);
  return `~$${scaled.toLocaleString()}/mo`;
}

/* ------------------------------------------------------------------ */
/*  Gold Checkmark with cascade animation                              */
/* ------------------------------------------------------------------ */

function GoldCheck({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-center"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <motion.path
          d="M5 13l4 4L19 7"
          stroke="#D4A017"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
        />
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Blurrable competitor cell — table variant (sm+)                   */
/* ------------------------------------------------------------------ */

function BlurCell({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <td
      className="px-3 py-4 text-center whitespace-nowrap transition-all duration-300 cursor-pointer select-none"
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      onClick={() => setRevealed((prev) => !prev)}
      style={{ filter: revealed ? 'none' : 'blur(5px)' }}
    >
      {children}
    </td>
  );
}

/* ------------------------------------------------------------------ */
/*  Blurrable competitor cell — card variant (mobile)                 */
/* ------------------------------------------------------------------ */

function BlurCardCell({ children, label }: { children: React.ReactNode; label: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setRevealed((prev) => !prev)}
      className="flex flex-col items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-center w-full transition-colors active:bg-gray-100"
    >
      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 leading-none">
        {label}
      </span>
      <span
        className="transition-all duration-300 select-none"
        style={{ filter: revealed ? 'none' : 'blur(4px)' }}
      >
        {children}
      </span>
      {!revealed && (
        <span className="text-[9px] text-gray-300 leading-none">tap to reveal</span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile feature card                                               */
/* ------------------------------------------------------------------ */

function MobileFeatureCard({ row, rowIdx }: { row: FeatureRow; rowIdx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: rowIdx * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Card header: feature name + VIBE value */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: 'linear-gradient(135deg, rgba(212,160,23,0.06), rgba(184,134,11,0.03))',
          borderBottom: '1px solid rgba(212,160,23,0.12)',
        }}
      >
        <span className="text-sm font-semibold text-gray-800">{row.label}</span>
        <div className="flex items-center gap-1.5">
          <GoldCheck delay={rowIdx * 0.12} />
          <span className="text-sm font-semibold text-gray-700">{row.vibeValue}</span>
        </div>
      </div>

      {/* 2×2 competitor grid */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {COMPETITORS.map((c) => (
          <BlurCardCell key={c.name} label={c.name}>
            {renderCellValue(row.getCompetitorValue(c))}
          </BlurCardCell>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile price summary card                                         */
/* ------------------------------------------------------------------ */

function MobilePriceCard({ rowIdx }: { rowIdx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: rowIdx * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Header: VIBE price */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: 'linear-gradient(135deg, rgba(212,160,23,0.06), rgba(184,134,11,0.03))',
          borderBottom: '1px solid rgba(212,160,23,0.12)',
        }}
      >
        <span className="text-sm font-semibold text-gray-800">Price</span>
        <div className="flex flex-col items-end">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: rowIdx * 0.07 + 0.2 }}
            className="text-sm font-bold"
            style={{ color: '#D4A017' }}
          >
            $600/mo*
          </motion.span>
          <span className="text-[10px] text-gray-400">*Founding rate</span>
        </div>
      </div>

      {/* 2×2 competitor prices */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {COMPETITORS.map((c) => (
          <BlurCardCell key={c.name} label={c.name}>
            <span className="text-sm font-semibold text-gray-700">{c.price}</span>
          </BlurCardCell>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Team Cost Calculator                                               */
/* ------------------------------------------------------------------ */

function CostCalculator() {
  const [teamSize, setTeamSize] = useState(5);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const vibeMonthly = 600; // Founding member Starter price
  const vibeSavings = useMemo(() => {
    // Sum competitor costs at scale vs VIBE flat
    const totalCompetitorAvg =
      COMPETITORS.reduce((sum, c) => {
        const m = c.price.match(/\d+/);
        return sum + (m ? parseInt(m[0], 10) : 0);
      }, 0) / COMPETITORS.length;
    const perSeatFactor = teamSize <= 5 ? 1 : 1 + (teamSize - 5) * 0.15;
    const avgScaled = Math.round(totalCompetitorAvg * perSeatFactor);
    return Math.max(0, avgScaled - vibeMonthly);
  }, [teamSize]);

  const sliderPercent = ((teamSize - 3) / (15 - 3)) * 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-16 sm:mt-20 max-w-3xl mx-auto"
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
          What does your stack really cost?
        </h3>
        <p className="text-gray-500 text-sm text-center mb-8">
          Drag to match your team size and see competitor pricing scale up.
        </p>

        {/* Slider */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>3 agents</span>
            <span className="font-semibold text-gray-900 text-lg">
              {teamSize} agents
            </span>
            <span>15 agents</span>
          </div>
          <div className="relative h-2 rounded-full bg-gray-200">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${sliderPercent}%`,
                background: 'linear-gradient(90deg, #B8860B, #D4A017, #E8C547)',
              }}
            />
          </div>
          <input
            type="range"
            min={3}
            max={15}
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value, 10))}
            className="w-full -mt-2 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* Price comparison grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {COMPETITORS.map((c) => (
            <div
              key={c.name}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                {c.name}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {scalePrice(c.price, teamSize)}
              </p>
            </div>
          ))}
          {/* VIBE card */}
          <div className="rounded-xl border-2 border-gold/40 bg-gradient-to-br from-gold/5 to-transparent p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-xs text-gold uppercase tracking-wider font-semibold mb-1">
              VIBE Founding
            </p>
            <p className="text-lg font-bold text-gray-900">
              ${vibeMonthly}/mo
            </p>
          </div>
        </div>

        {/* Savings callout */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">
            Average monthly savings with VIBE
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={vibeSavings}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="text-4xl sm:text-5xl font-bold"
              style={{ color: '#D4A017' }}
            >
              ${vibeSavings.toLocaleString()}
              <span className="text-lg text-gray-400 font-normal">/mo</span>
            </motion.p>
          </AnimatePresence>
          <p className="text-xs text-gray-400 mt-1">
            vs. average competitor at {teamSize} agents
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */

export default function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      id="comparison"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: '#FAFAFA' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-gold-dark mb-4">
            The Battlefield
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What you&apos;re paying for{' '}
            <span className="text-gray-400">vs.</span>{' '}
            <span style={{ color: '#D4A017' }}>what you&apos;re missing</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg">

            <span className="hidden sm:inline">Hover any competitor cell to reveal the truth.</span>
            <span className="sm:hidden">Tap any competitor cell to reveal the truth.</span>
            {' '}VIBE fills the gaps they can&apos;t.
          </p>
        </motion.div>

        {/* Mobile card list — shown below sm, replaces the table */}
        <div className="block sm:hidden space-y-3">
          {FEATURE_ROWS.map((row, rowIdx) => (
            <MobileFeatureCard key={row.key} row={row} rowIdx={rowIdx} />
          ))}
          <MobilePriceCard rowIdx={FEATURE_ROWS.length} />
        </div>

        {/* Table — hidden on mobile, visible from sm upward */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="hidden sm:block relative overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 sm:px-4 py-4 text-xs font-mono uppercase tracking-wider text-gray-400 bg-white sticky left-0 z-20 min-w-[100px] sm:min-w-[140px]">
                  Feature
                </th>
                {COMPETITORS.map((c) => (
                  <th
                    key={c.name}
                    className="px-3 py-4 text-xs font-mono uppercase tracking-wider text-gray-400 text-center whitespace-nowrap"
                  >
                    {c.name}
                  </th>
                ))}
                {/* VIBE header — sticky on right for mobile */}
                <th
                  className="px-4 py-4 text-xs font-mono uppercase tracking-wider text-center whitespace-nowrap sticky right-0 z-20 min-w-[100px]"
                  style={{
                    color: '#D4A017',
                    background:
                      'linear-gradient(135deg, rgba(212,160,23,0.06), rgba(184,134,11,0.03))',
                  }}
                >
                  VIBE
                </th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map((row, rowIdx) => (
                <tr
                  key={row.key}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-3 sm:px-4 py-4 text-sm font-medium text-gray-700 bg-white sticky left-0 z-10">
                    {row.label}
                  </td>
                  {COMPETITORS.map((c) => (
                    <BlurCell key={c.name}>
                      {renderCellValue(row.getCompetitorValue(c))}
                    </BlurCell>
                  ))}
                  {/* VIBE cell — gold check cascade */}
                  <td
                    className="px-4 py-4 text-center sticky right-0 z-10"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(212,160,23,0.06), rgba(184,134,11,0.03))',
                    }}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <GoldCheck delay={rowIdx * 0.12} />
                      <span className="text-sm font-semibold text-gray-700">
                        {row.vibeValue}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Price row */}
              <tr className="bg-gray-50/50">
                <td className="px-3 sm:px-4 py-4 text-sm font-semibold text-gray-900 bg-white sticky left-0 z-10">
                  Price
                </td>
                {COMPETITORS.map((c) => (
                  <BlurCell key={c.name}>
                    <span className="text-sm font-semibold text-gray-700">
                      {c.price}
                    </span>
                  </BlurCell>
                ))}
                <td
                  className="px-4 py-4 text-center sticky right-0 z-10"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(212,160,23,0.06), rgba(184,134,11,0.03))',
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: FEATURE_ROWS.length * 0.12 + 0.2 }}
                    className="text-sm font-bold"
                    style={{ color: '#D4A017' }}
                  >
                    $600/mo*
                  </motion.span>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    *Founding rate
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Team size cost calculator */}
        <CostCalculator />
      </div>
    </section>
  );
}
