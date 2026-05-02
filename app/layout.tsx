// app/layout.tsx
import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { getSiteSettings } from '@/lib/settings';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

// Base metadata — individual pages override this
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default:  settings.site_name,
      template: `%s | ${settings.site_name}`,
    },
    description:      settings.tagline,
    metadataBase:     new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    openGraph: {
      type:      'website',
      siteName:  settings.site_name,
      locale:    'en_US',
    },
    twitter: { card: 'summary_large_image' },
    robots: {
      index:  true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="bg-ink-50 text-ink-900 antialiased">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
