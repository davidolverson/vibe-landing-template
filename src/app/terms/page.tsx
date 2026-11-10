import { Metadata } from 'next';
import Link from 'next/link';
import { BRAND, COLORS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service | VIBE',
  description: 'Terms of Service for VIBE by Your Company. Read our terms for waitlist participation and website usage.',
};

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-white/50 mb-10">
          Last updated: March 6, 2026
        </p>

        <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the VIBE website at{' '}
              <span className="text-white">{BRAND.domain}</span>{' '}
              (&quot;Site&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Site. These Terms constitute a legally binding agreement between you and Your Company (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              VIBE is currently in pre-launch. The Site provides information about our upcoming CRM platform and allows you to join a waitlist to receive launch updates and founding member access. The full VIBE product is not yet available for use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Waitlist Participation</h2>
            <p className="mb-2">By joining our waitlist, you acknowledge that:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Joining the waitlist does not guarantee access to the product or founding member pricing</li>
              <li>Founding member spots are limited and offered on a first-come, first-served basis</li>
              <li>Pricing, features, and launch timing described on the Site are subject to change</li>
              <li>We may send you email communications regarding VIBE launch updates</li>
              <li>You may unsubscribe from communications at any time by contacting us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. User Conduct</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Submit false or misleading information</li>
              <li>Use automated systems or bots to submit waitlist entries</li>
              <li>Attempt to interfere with, compromise, or disrupt the Site</li>
              <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
              <li>Use the Site for any unlawful purpose</li>
              <li>Submit multiple entries with the intent to manipulate waitlist position</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Intellectual Property</h2>
            <p>
              All content on the Site — including text, graphics, logos, images, animations, and software — is the property of Your Company or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.
            </p>
            <p className="mt-3">
              The VIBE name, logo, and brand identity are trademarks of Your Company. Unauthorized use is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Disclaimer of Warranties</h2>
            <p>
              The Site and all information on it are provided <span className="text-white font-medium">&quot;as is&quot;</span> and <span className="text-white font-medium">&quot;as available&quot;</span> without warranties of any kind, either express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
            <p className="mt-3">
              Product descriptions, feature lists, pricing, and launch timelines are forward-looking statements and are subject to change without notice. Nothing on the Site constitutes a binding offer or commitment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Your Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of or inability to use the Site, including but not limited to loss of data, loss of business, or loss of anticipated savings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Privacy</h2>
            <p>
              Your use of the Site is also governed by our{' '}
              <Link href="/privacy" className="text-white underline hover:opacity-80 transition-opacity">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Modifications to Terms</h2>
            <p>
              We reserve the right to update or modify these Terms at any time. Changes will be effective immediately upon posting to the Site. Your continued use of the Site after any changes constitutes acceptance of the revised Terms. We will make reasonable efforts to notify waitlist members of material changes via email.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining provisions remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Contact Us</h2>
            <p>
              If you have questions about these Terms, contact us at:
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
            This document is provided for informational purposes. Consult with a qualified attorney for legal advice specific to your situation.
          </p>
        </div>
      </article>
    </main>
  );
}
