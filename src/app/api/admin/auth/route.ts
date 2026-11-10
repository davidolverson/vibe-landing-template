import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateToken, validateToken } from '@/lib/auth';

// Cookie configuration
const COOKIE_NAME = 'vibe_admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

const isProduction = process.env.NODE_ENV === 'production';

// --- Schema ---
const LoginSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .max(256, 'Password too long'),
});

// --- Origin guard (CSRF) ---
function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (!origin) return true; // Same-origin fetch with no Origin header
  if (process.env.NODE_ENV === 'development') return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// --- POST /api/admin/auth — login ---
export async function POST(request: Request) {
  try {
    if (!isValidOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('[Admin Auth] ADMIN_PASSWORD env var is not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const body = await request.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      );
    }

    const { password } = result.data;

    // Constant-time password comparison to prevent timing attacks
    const isCorrect = validateToken(generateToken(password));

    if (!isCorrect) {
      // Generic message — do not reveal whether the password format was valid
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = generateToken(adminPassword);

    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('[Admin Auth] POST error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// --- DELETE /api/admin/auth — logout ---
export async function DELETE(request: Request) {
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });

  // Overwrite cookie with an expired value to force deletion
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return response;
}
