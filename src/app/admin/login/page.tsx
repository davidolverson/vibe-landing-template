'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh(); // Ensure server components in /admin re-render with the new cookie
      } else {
        setError(data.error ?? 'Invalid password. Try again.');
        setPassword('');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0A0A0F' }}
    >
      {/* Subtle radial glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(212,160,23,0.06) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-2xl p-8 sm:p-10"
        style={{
          background: '#13131A',
          border: '1px solid rgba(212,160,23,0.18)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <img
            src="/vibe-logo.png"
            alt="VIBE"
            className="w-24 h-auto mx-auto"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(212, 160, 23, 0.3))',
            }}
            draggable={false}
          />
          <p className="mt-1.5 text-xs tracking-[0.25em] uppercase text-white/40">
            Admin Access
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Password field */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-xs tracking-widest uppercase text-white/50 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Enter admin password"
              className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors disabled:opacity-50"
              style={{
                background: '#0A0A0F',
                border: '1px solid rgba(212,160,23,0.2)',
                caretColor: '#D4A017',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,160,23,0.6)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,160,23,0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <p
              className="mb-4 text-xs text-center px-3 py-2 rounded-lg"
              style={{
                color: '#F87171',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.18)',
              }}
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-lg text-sm font-semibold tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: loading ? 'rgba(212,160,23,0.7)' : '#D4A017',
              color: '#0A0A0F',
            }}
            onMouseEnter={(e) => {
              if (!loading && password) {
                (e.currentTarget as HTMLButtonElement).style.background = '#E8C547';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = loading
                ? 'rgba(212,160,23,0.7)'
                : '#D4A017';
            }}
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
