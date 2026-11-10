'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {
      // Best-effort — proceed to redirect regardless
    }
    router.push('/admin/login');
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs tracking-widest uppercase px-3 py-1.5 rounded border transition-colors disabled:opacity-50"
      style={{
        borderColor: 'rgba(212,160,23,0.3)',
        color: '#D4A017',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(212,160,23,0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
      }}
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
