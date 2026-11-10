'use client';

import { useState, useCallback, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { COLORS, FOUNDING, BUSINESS_TYPES } from '@/lib/constants';

/* ─── Spot Progress Bar ─── */
function SpotIndicators({ remaining }: { remaining: number }) {
  const total = FOUNDING.totalSpots;
  const claimed = total - remaining;
  const pct = (claimed / total) * 100;

  return (
    <div className="w-48 md:w-56">
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${COLORS.goldDark}, ${COLORS.gold}, ${COLORS.goldLight})`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/* ─── Waitlist Form (exported for use in HeroSection) ─── */
export function WaitlistForm({ visible }: { visible: boolean }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const remainingSpots = 7;

  const toggleBusinessType = useCallback((type: string) => {
    setBusinessTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email || !email.includes('@') || submitting) return;
      setSubmitting(true);
      setError('');
      try {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email,
            business_types: businessTypes,
            website: honeypot,
          }),
        });
        if (!res.ok) throw new Error('Failed to join waitlist');
        setSubmitted(true);
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [name, email, businessTypes, honeypot, submitting]
  );

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      {/* Card wrapper */}
      <div
        className="rounded-2xl p-5 sm:p-6 relative overflow-hidden"
        style={{
          background: 'rgba(10, 10, 15, 0.85)',
          border: `1px solid ${COLORS.gold}30`,
          backdropFilter: 'blur(16px)',
          boxShadow: `0 0 40px ${COLORS.gold}18, 0 20px 60px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Subtle corner accent — top left */}
        <div
          className="pointer-events-none absolute top-0 left-0 w-20 h-20 rounded-tl-2xl"
          style={{
            background: `radial-gradient(circle at top left, ${COLORS.gold}22, transparent 70%)`,
          }}
          aria-hidden="true"
        />
        {/* Subtle corner accent — bottom right */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-20 h-20 rounded-br-2xl"
          style={{
            background: `radial-gradient(circle at bottom right, ${COLORS.gold}14, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card header */}
              <div className="mb-5 text-center">
                <img
                  src="/vibe-logo.png"
                  alt="VIBE"
                  className="w-28 sm:w-32 h-auto mx-auto"
                  style={{
                    filter: 'drop-shadow(0 0 16px rgba(212, 160, 23, 0.4))',
                  }}
                  draggable={false}
                />
                <p
                  className="text-xs tracking-[0.3em] uppercase font-semibold mb-1"
                  style={{ color: COLORS.gold }}
                >
                  Founding Member Access
                </p>
                <p className="text-white/50 text-xs">
                  Only{' '}
                  <span className="text-white font-semibold">{remainingSpots}</span>{' '}
                  of {FOUNDING.totalSpots} spots left
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                {/* Honeypot — hidden from real users */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
                />

                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="waitlist-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="waitlist-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm outline-none transition-all duration-200 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="waitlist-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm outline-none transition-all duration-200 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30"
                  />
                </div>

                {/* Business Type Multi-Select */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-white/40 font-medium uppercase tracking-widest">
                    Your business lines{' '}
                    <span className="text-white/25 normal-case tracking-normal">(select all that apply)</span>
                  </p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Business types">
                    {BUSINESS_TYPES.map((type) => {
                      const selected = businessTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleBusinessType(type)}
                          aria-pressed={selected}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-150 active:scale-95 select-none"
                          style={{
                            backgroundColor: selected
                              ? COLORS.gold
                              : 'rgba(255,255,255,0.06)',
                            color: selected ? COLORS.dark : 'rgba(255,255,255,0.55)',
                            border: `1px solid ${selected ? COLORS.gold : 'rgba(255,255,255,0.1)'}`,
                            boxShadow: selected
                              ? `0 0 12px ${COLORS.gold}40`
                              : 'none',
                          }}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !email.includes('@')}
                  className="w-full py-3.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-transform hover:scale-[1.02] active:scale-[0.98] pulse-gold mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    backgroundColor: COLORS.gold,
                    color: COLORS.dark,
                  }}
                >
                  {submitting ? 'Securing your spot...' : 'Join The First 50'}
                </button>

                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}
              </form>

              {/* Spot progress bar */}
              <div className="flex flex-col items-center gap-2 mt-4">
                <SpotIndicators remaining={remainingSpots} />
                <p className="text-xs text-white/30">No credit card. Cancel anytime.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="flex flex-col items-center gap-4 py-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: COLORS.gold,
                  boxShadow: `0 0 30px ${COLORS.gold}60`,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path
                    d="M4 11L9 16L18 6"
                    stroke={COLORS.dark}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p
                  className="text-lg font-bold mb-1"
                  style={{ color: COLORS.gold }}
                >
                  You&apos;re in.
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Expect a personal email from David — founder to founder.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Waitlist Section ─── */
export default function WaitlistSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      id="waitlist"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Subtle gold radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,160,23,0.05) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-lg mx-auto px-4 sm:px-6">
        {/* Gold accent line */}
        <motion.div
          className="h-1 w-16 rounded mx-auto mb-8"
          style={{ backgroundColor: COLORS.gold }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Section heading */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <h2
            className="text-xs sm:text-sm tracking-widest uppercase font-bold mb-2"
            style={{ color: COLORS.gold }}
          >
            Founding Member Access
          </h2>
          <p className="text-white/50 text-sm">
            Only{' '}
            <span className="text-white font-semibold">7</span>{' '}
            of {FOUNDING.totalSpots} spots left
          </p>
        </motion.div>

        {/* The waitlist form */}
        <WaitlistForm visible={isInView} />
      </div>
    </section>
  );
}
