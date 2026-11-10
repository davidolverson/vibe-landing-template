import crypto from 'crypto';

/**
 * Generates a SHA-256 token from the password and the current UTC date (YYYY-MM-DD).
 * The date component means tokens automatically expire at midnight UTC — the maxAge
 * cookie setting enforces the 24-hour hard cap on the client side, and the date
 * component is the server-side defence that invalidates tokens after the calendar day
 * rolls over.
 */
export function generateToken(password: string): string {
  const date = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  return crypto
    .createHash('sha256')
    .update(`${password}:${date}`)
    .digest('hex');
}

/**
 * Validates a token against the current day's expected value.
 * Returns false if ADMIN_PASSWORD is not set or the token does not match.
 */
export function validateToken(token: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const expected = generateToken(password);

  // Constant-time comparison to prevent timing attacks
  if (expected.length !== token.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}
