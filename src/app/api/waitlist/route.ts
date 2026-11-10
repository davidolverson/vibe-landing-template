import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { insertLead } from '@/lib/db';
import db from '@/lib/db';

// --- Schema validation ---
const WaitlistSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or fewer')
    .transform((s) => s.trim()),
  email: z
    .string()
    .email('A valid email address is required')
    .max(254, 'Email too long')
    .transform((e) => e.trim().toLowerCase()),
  business_types: z
    .array(z.string())
    .min(1, 'Select at least one business type'),
  website: z.string().optional().default(''),
});

// --- DB-based rate limit: one submission per email per 60 seconds ---
// This survives process restarts and scales across serverless invocations.
const RATE_LIMIT_SECONDS = 60;

const checkEmailRateLimit = db.prepare<[string, number]>(`
  SELECT created_at FROM leads
  WHERE email = ?
    AND created_at >= datetime('now', ? || ' seconds')
  LIMIT 1
`);

function isEmailRateLimited(email: string): boolean {
  const row = checkEmailRateLimit.get(email, -RATE_LIMIT_SECONDS);
  return row !== undefined;
}

// --- In-memory IP rate limiter (secondary layer, guards unauthenticated spam) ---
// Resets on process restart — acceptable for a landing page.
// Swap for Upstash Redis when moving to production scale.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;

  // Lazy cleanup: sweep stale entries when the map grows large
  if (rateLimitMap.size > 100) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  return entry.count > RATE_LIMIT_MAX;
}

// --- XSS-safe HTML escaping (for Resend email body) ---
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Origin validation (CSRF protection) ---
function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // No Origin header = same-origin form/fetch — allow
  if (!origin) return true;

  // Development: allow all localhost origins
  if (process.env.NODE_ENV === 'development') return true;

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

// --- Config ---
const NOTIFY_EMAIL = process.env.RESEND_NOTIFY_EMAIL;

// --- Route handler ---
export async function POST(request: Request) {
  try {
    // CSRF: Origin check
    if (!isValidOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // IP-based rate limit (first layer)
    const realIp = request.headers.get('x-real-ip');
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = realIp || forwarded?.split(',')[0]?.trim() || 'unknown';

    if (isIpRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate with Zod
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const result = WaitlistSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Invalid input';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, business_types, website } = result.data;

    // Honeypot triggered — silently accept so bots think they succeeded
    if (website && website.length > 0) {
      return NextResponse.json({ success: true, message: 'Welcome to the waitlist!' });
    }

    // Email-based rate limit: reject if same address submitted within 60 seconds
    if (isEmailRateLimited(email)) {
      return NextResponse.json(
        { error: 'This email was submitted recently. Please wait before trying again.' },
        { status: 429 }
      );
    }

    // Persist to SQLite — upserts on conflict so repeat submissions update the record
    const info = insertLead.run(name, email, JSON.stringify(business_types));
    const isNew = info.changes === 1 && info.lastInsertRowid !== 0;

    // Total signups for the notification email
    const { count: totalSignups } = db
      .prepare('SELECT COUNT(*) as count FROM leads')
      .get() as { count: number };

    // Resend notification (primary audit trail — email is persistent, SQLite file is local)
    if (process.env.RESEND_API_KEY && NOTIFY_EMAIL) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeTypes = business_types.map(escapeHtml).join(', ');
        const safeTime = escapeHtml(
          new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
        );

        await resend.emails.send({
          from: 'VIBE Waitlist <onboarding@resend.dev>',
          to: NOTIFY_EMAIL,
          subject: `New VIBE Waitlist Signup (#${totalSignups})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #D4A017; margin-bottom: 16px;">New Waitlist Signup</h2>
              <p style="font-size: 18px; margin-bottom: 4px;"><strong>${safeName}</strong></p>
              <p style="font-size: 16px; margin-bottom: 8px; color: #444;">${safeEmail}</p>
              <p style="margin-bottom: 8px;"><strong>Business types:</strong> ${safeTypes}</p>
              <p style="color: #666; margin-bottom: 16px;">Signed up at ${safeTime} CT</p>
              <hr style="border: 1px solid #eee; margin: 16px 0;" />
              <p style="color: #999; font-size: 14px;">Total waitlist signups: <strong>${totalSignups}</strong></p>
            </div>
          `,
        });
      } catch (emailError) {
        // Log message only — never log the full error object (may contain API keys or PII)
        const msg = emailError instanceof Error ? emailError.message : 'Unknown email error';
        console.error('[Waitlist] Resend notification failed:', msg);
      }
    }

    return NextResponse.json({
      success: true,
      message: isNew ? 'Welcome to the waitlist!' : 'Your info has been updated!',
    });
  } catch (error) {
    console.error('[Waitlist] Unhandled error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
