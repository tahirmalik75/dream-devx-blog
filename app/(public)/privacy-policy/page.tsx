// app/(public)/privacy-policy/page.tsx
import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use, and protect your data.',
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  const siteName = settings.site_name;
  const email    = settings.contact_email;
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  const date     = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-serif text-4xl font-bold text-ink-950 mb-3">Privacy Policy</h1>
      <p className="text-ink-400 text-sm mb-10">Last updated: {date}</p>

      <div className="prose prose-lg max-w-none text-ink-700">
        {settings.privacy_policy_text ? (
          <div dangerouslySetInnerHTML={{ __html: settings.privacy_policy_text }} />
        ) : (
          <>
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>{siteName}</strong> ("{siteName}", "we", "our", "us"). We are committed to
              protecting your personal information and your right to privacy. This Privacy Policy
              applies to information we collect when you visit {siteUrl}.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We may collect information about you in several ways:</p>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, IP address.</li>
              <li><strong>Cookies:</strong> Small files stored on your device for analytics and advertising.</li>
              <li><strong>Contact Form:</strong> Name and email when you contact us voluntarily.</li>
            </ul>

            <h2>3. Google AdSense &amp; Cookies</h2>
            <p>
              We use Google AdSense to display advertisements. Google uses cookies to serve ads
              based on your prior visits to our site and other sites on the internet. You may opt
              out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>.
            </p>

            <h2>4. Analytics</h2>
            <p>
              We use analytics services to understand how visitors use our site. This data is
              aggregated and does not personally identify you.
            </p>

            <h2>5. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for
              the privacy practices or content of those sites.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain personal data only as long as necessary for the purposes outlined in this
              policy or as required by law.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, or delete your
              personal data. Contact us at{' '}
              <a href={`mailto:${email}`}>{email}</a> to exercise these rights.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated revision date.
            </p>

            <h2>9. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href={`mailto:${email}`}>{email}</a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
