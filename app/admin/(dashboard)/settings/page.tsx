// app/admin/settings/page.tsx
import { getSiteSettings } from '@/lib/settings';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-bold text-ink-950 mb-2">Site Settings</h1>
      <p className="text-ink-500 text-sm mb-8">Manage your site identity, AdSense slots, social links, and legal pages.</p>
      <SettingsForm settings={settings} />
    </div>
  );
}
