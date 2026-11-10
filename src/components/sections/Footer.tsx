'use client';

import { BRAND, COLORS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer
      className="w-full py-10 px-6 border-t border-white/5"
      style={{ background: COLORS.dark }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo + Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span
            className="text-xl font-bold tracking-wider"
            style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              color: COLORS.gold,
            }}
          >
            {BRAND.name}
          </span>
          <span className="text-xs text-white/50">
            &copy; 2026 Your Company. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-white/50">
          <a
            href="/privacy"
            className="hover:text-white/70 transition-colors py-2"
          >
            Privacy Policy
          </a>
          <span className="text-white/10">|</span>
          <a
            href="/terms"
            className="hover:text-white/70 transition-colors py-2"
          >
            Terms of Service
          </a>
        </div>

        {/* Social + Contact */}
        <div className="flex items-center gap-4">
          {/* X / Twitter */}
          <a
            href={BRAND.twitter ? `https://x.com/${BRAND.twitter.replace("@", "")}` : "https://x.com/"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-[var(--gold)] transition-colors"
            aria-label="X (Twitter)"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-[var(--gold)] transition-colors"
            aria-label="LinkedIn"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>

          {/* Email */}
          <a
            href={`mailto:${BRAND.email}`}
            className="text-xs text-white/40 hover:text-[var(--gold)] transition-colors"
          >
            {BRAND.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
