import { Metadata } from 'next';
import Link from 'next/link';
import { BRAND, COLORS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | VIBE',
  description: 'Privacy Policy for VIBE by Your Company. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
  return (
    <main
      className="min-h-screen py-20 px-6"
      style={{ background: COLORS.dark }}
    >
      <article className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-10"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>

        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: COLORS.gold }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm text-white/50 mb-10">
          Last updated: March 6, 2026
        </p>

        <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Who We Are</h2>
            <p>
              VIBE (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a product of Your Company. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at{' '}
              <span className="text-white">{BRAND.domain}</span> and use our waitlist service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>
            <h3 className="text-white/90 font-medium mb-2">Information You Provide</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><span className="text-white">Email address</span> — when you join our waitlist</li>
              <li><span className="text-white">Timestamp</span> — when you signed up</li>
            </ul>
            <h3 className="text-white/90 font-medium mt-4 mb-2">Information Collected Automatically</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><span className="text-white">IP address</span> — used solely for rate limiting to prevent abuse (not stored persistently)</li>
              <li><span className="text-white">Browser type and device information</span> — standard server logs</li>
            </ul>
            <p className="mt-3">
              We do <span className="text-white font-medium">not</span> use cookies, tracking pixels, or third-party analytics on this site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Manage your waitlist enrollment</li>
              <li>Send you launch updates and founding member access information</li>
              <li>Protect against abuse and spam (rate limiting)</li>
              <li>Improve our website and services</li>
            </ul>
            <p className="mt-3">
              We will <span className="text-white font-medium">never</span> sell, rent, or trade your email address to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p className="mb-2">We use the following third-party service providers:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <span className="text-white">Resend</span> — for email notification delivery. Resend processes your email address to deliver waitlist confirmation notifications. See{' '}
                <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                  Resend&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <span className="text-white">Replit</span> — for website hosting. See{' '}
                <a href="https://replit.com/site/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                  Replit&apos;s Privacy Policy
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Data Retention</h2>
            <p>
              We retain your email address for as long as necessary to fulfill the purposes described in this policy — primarily to notify you about the VIBE launch. You may request deletion of your data at any time by contacting us at{' '}
              <a href={`mailto:${BRAND.email}`} className="text-white underline hover:opacity-80 transition-opacity">
                {BRAND.email}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Data Security</h2>
            <p>
              We implement reasonable technical and organizational measures to protect your personal information, including rate limiting, input validation, XSS protection, CSRF protection, and security headers (HSTS, CSP, X-Frame-Options). However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Your Rights</h2>
            <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for future communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href={`mailto:${BRAND.email}`} className="text-white underline hover:opacity-80 transition-opacity">
                {BRAND.email}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Our service is not directed to individuals under 16. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify waitlist members of any material changes via email. The &quot;Last updated&quot; date at the top of this page reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at:
            </p>
            <p className="mt-2">
              <span className="text-white">Your Company</span><br />
              Email:{' '}
              <a href={`mailto:${BRAND.email}`} className="text-white underline hover:opacity-80 transition-opacity">
                {BRAND.email}
              </a>
            </p>
          </section>

          <hr className="border-white/10" />

          <p className="text-xs text-white/40 italic">
            This privacy policy is provided for informational purposes. Consult with a qualified attorney for legal advice specific to your situation.
          </p>
        </div>
      </article>
    </main>
  );
}
