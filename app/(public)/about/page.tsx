// app/(public)/about/page.tsx
import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our publication and team.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-serif text-4xl font-bold text-ink-950 mb-6">About Us</h1>
      <div className="prose prose-lg max-w-none text-ink-700">
        <p>{settings.about_text}</p>
        <p>
          We are a team of passionate writers dedicated to delivering high-quality, well-researched
          content across technology, lifestyle, business, and more. Our mission is to inform,
          inspire, and engage our readers with stories that matter.
        </p>
        <h2>Our Values</h2>
        <ul>
          <li><strong>Accuracy</strong> — We verify facts before publishing.</li>
          <li><strong>Independence</strong> — Editorial decisions are never influenced by advertisers.</li>
          <li><strong>Transparency</strong> — We are clear about sponsored content and partnerships.</li>
        </ul>
        <h2>Contact</h2>
        <p>
          Have a story tip or want to collaborate? Reach us at{' '}
          <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>.
        </p>
      </div>
    </div>
  );
}
