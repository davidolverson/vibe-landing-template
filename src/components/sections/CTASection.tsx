'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { BRAND, BUSINESS_TYPES, COLORS } from '@/lib/constants';
import type { BusinessType } from '@/lib/constants';

/* ── Floating letter animation for "Spring 2026" ── */
function FloatingText({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          animate={{
            y: [0, -4 - (i % 3) * 2, 0, 3 + (i % 2) * 2, 0],
          }}
          transition={{
            duration: 2.5 + (i % 4) * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.08,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Confetti burst ── */
function ConfettiBurst() {
  const particles = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => {
      const angle = (i / 36) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = 80 + Math.random() * 160;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 0.15,
        duration: 0.8 + Math.random() * 0.6,
        rotate: Math.random() * 360,
      };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0.3,
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── Typewriter placeholder ── */
const PLACEHOLDERS = [
  'you@example.com',
  'owner@example.com',
  'broker@example.com',
];

function useTypewriterPlaceholder() {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = PLACEHOLDERS[phraseIndex];

    if (!isDeleting && charIndex < current.length) {
      const timer = setTimeout(() => {
        setText(current.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 60 + Math.random() * 40);
      return () => clearTimeout(timer);
    }

    if (!isDeleting && charIndex === current.length) {
      const timer = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(timer);
    }

    if (isDeleting && charIndex > 0) {
      const timer = setTimeout(() => {
        setText(current.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 30);
      return () => clearTimeout(timer);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((phraseIndex + 1) % PLACEHOLDERS.length);
    }
  }, [charIndex, isDeleting, phraseIndex]);

  return text;
}

/* ── Social proof ticker ── */
const TICKER_NAMES = [
  { name: 'Sarah', city: 'Houston' },
  { name: 'Mike', city: 'Atlanta' },
  { name: 'Jessica', city: 'Phoenix' },
  { name: 'David', city: 'Dallas' },
  { name: 'Rachel', city: 'Denver' },
  { name: 'Marcus', city: 'Miami' },
  { name: 'Lauren', city: 'Austin' },
  { name: 'James', city: 'Charlotte' },
  { name: 'Ashley', city: 'Tampa' },
  { name: 'Brandon', city: 'Nashville' },
];

function SocialProofTicker() {
  const tickerText = TICKER_NAMES.map(
    (n) => `${n.name} from ${n.city} just joined the waitlist`
  ).join('  \u2022  ');

  // Double it for seamless loop
  const doubled = `${tickerText}  \u2022  ${tickerText}`;

  return (
    <div className="w-full overflow-hidden py-4 opacity-40">
      <motion.div
        className="whitespace-nowrap text-xs md:text-sm text-white/60"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {doubled}
      </motion.div>
    </div>
  );
}

/* ── Background particles ── */
function CTAParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 2,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: COLORS.gold,
          }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── Share Links ── */
function ShareButtons() {
  const shareText = encodeURIComponent(
    "I just joined the VIBE waitlist -- the CRM built for vertically integrated real estate empires. Get on the list:"
  );
  const shareUrl = encodeURIComponent(`https://${BRAND.domain}`);

  return (
    <motion.div
      className="flex flex-col items-center gap-3 mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <p className="text-sm text-white/50">
        Share with 3 friends to jump the line
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[var(--gold)] transition-colors text-sm text-white/70 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Post on X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[var(--gold)] transition-colors text-sm text-white/70 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Share on LinkedIn
        </a>
      </div>
    </motion.div>
  );
}

/* ── Business type checkbox item ── */
function BusinessTypeCheckbox({
  label,
  checked,
  onChange,
}: {
  label: BusinessType;
  checked: boolean;
  onChange: (value: BusinessType, checked: boolean) => void;
}) {
  return (
    <label
      className={`
        flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer
        text-sm transition-all duration-200 select-none
        ${
          checked
            ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-white'
            : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white/80'
        }
      `}
    >
      {/* Custom checkbox */}
      <span
        className={`
          flex-shrink-0 w-4 h-4 rounded flex items-center justify-center border transition-all duration-200
          ${checked ? 'border-[var(--gold)] bg-[var(--gold)]' : 'border-white/20 bg-transparent'}
        `}
        aria-hidden="true"
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke={COLORS.dark}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(label, e.target.checked)}
        aria-label={label}
      />
      {label}
    </label>
  );
}

/* ── Main CTA Section ── */
export default function CTASection() {
  const { ref, inView } = useInView(0.2);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const placeholder = useTypewriterPlaceholder();

  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleBusinessTypeChange = useCallback(
    (value: BusinessType, checked: boolean) => {
      setBusinessTypes((prev) =>
        checked ? [...prev, value] : prev.filter((t) => t !== value)
      );
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [name, email, businessTypes, honeypot, submitting]
  );

  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{ background: COLORS.dark }}
      id="waitlist"
    >
      <CTAParticles />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212, 160, 23, 0.06), transparent)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          The next age of real estate is loading...
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-base md:text-lg text-white/60 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          VIBE launches{' '}
          <span
            className="font-semibold"
            style={{ color: COLORS.gold }}
          >
            <FloatingText text={BRAND.launchWindow} />
          </span>
          . Get on the list.
        </motion.p>

        {/* Form / Success State */}
        <motion.div
          className="relative w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 w-full"
                  noValidate
                >
                  {/* Honeypot — hidden from real users, bots fill it */}
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

                  {/* Name field */}
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    aria-label="Your name"
                    className="w-full px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm md:text-base outline-none transition-all duration-300 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30"
                    required
                  />

                  {/* Email field */}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    autoComplete="email"
                    aria-label="Email address"
                    className="w-full px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm md:text-base outline-none transition-all duration-300 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30"
                    required
                  />

                  {/* Business type multi-select */}
                  <div className="w-full text-left">
                    <p className="text-xs text-white/40 mb-2 pl-1 uppercase tracking-widest">
                      Which businesses do you run? (select all that apply)
                    </p>
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                      role="group"
                      aria-label="Business types"
                    >
                      {BUSINESS_TYPES.map((type) => (
                        <BusinessTypeCheckbox
                          key={type}
                          label={type}
                          checked={businessTypes.includes(type)}
                          onChange={handleBusinessTypeChange}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3.5 rounded-full text-sm md:text-base font-semibold tracking-wide uppercase transition-transform hover:scale-[1.02] active:scale-[0.98] pulse-gold disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                    style={{
                      backgroundColor: COLORS.gold,
                      color: COLORS.dark,
                    }}
                  >
                    {submitting ? 'Joining...' : 'Join the Waitlist'}
                  </button>
                </form>

                {error && (
                  <p className="text-red-400 text-sm mt-2 text-center">
                    {error}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {showConfetti && <ConfettiBurst />}
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.gold }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 15,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 8L7 12L13 4"
                        stroke={COLORS.dark}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p
                    className="text-xl md:text-2xl font-semibold"
                    style={{ color: COLORS.gold }}
                  >
                    You&apos;re in. We&apos;ll be in touch.
                  </p>
                </div>
                <ShareButtons />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social proof ticker */}
        <motion.div
          className="w-full mt-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SocialProofTicker />
        </motion.div>

        {/* No spam */}
        <motion.p
          className="text-xs text-white/50 mt-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          No spam. Just launch updates and founding member access.
        </motion.p>
      </div>
    </section>
  );
}
