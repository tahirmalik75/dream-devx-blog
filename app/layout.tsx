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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dream-devx-blog.vercel.app';
  
  return {
    title: {
      default: `${settings.site_name} | ${settings.tagline}`,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.tagline,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      siteName: settings.site_name,
      locale: 'en_US',
      title: settings.site_name,
      description: settings.tagline,
      images: [
        {
          url: '/icon.png',
          width: 512,
          height: 512,
          alt: settings.site_name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.site_name,
      description: settings.tagline,
      images: ['/icon.png'],
    },
    robots: {
      index: true,
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
