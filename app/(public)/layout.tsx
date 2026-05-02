// app/(public)/layout.tsx
import { getSiteSettings } from '@/lib/settings';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdSlot from '@/components/ads/AdSlot';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header settings={settings} />

      {/* Top banner ad */}
      <div className="w-full bg-ink-100 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <AdSlot
            slot={settings.adsense_slot_header}
            publisherId={settings.adsense_publisher_id}
            format="horizontal"
            className="ad-slot-banner mx-auto max-w-4xl"
          />
        </div>
      </div>

      <main className="min-h-[60vh]">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
