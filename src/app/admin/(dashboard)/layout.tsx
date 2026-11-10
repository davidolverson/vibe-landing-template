import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateToken } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('vibe_admin_session')?.value;

  if (!sessionToken || !validateToken(sessionToken)) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <header className="border-b border-[#D4A017]/20 bg-[#0A0A0F]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/vibe-logo.png"
              alt="VIBE"
              className="h-8 w-auto"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(212, 160, 23, 0.3))',
              }}
              draggable={false}
            />
            <span className="text-xs text-white/40 tracking-widest uppercase border-l border-white/10 pl-3">
              Admin
            </span>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
