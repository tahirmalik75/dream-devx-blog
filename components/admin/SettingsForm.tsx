// components/admin/SettingsForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { SiteSettings } from '@/types';

export default function SettingsForm({ settings: initial }: { settings: SiteSettings }) {
  const router   = useRouter();
  const [form, setForm]     = useState(initial);
  const [saving, setSaving] = useState(false);

  function set(key: keyof SiteSettings, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch('/api/settings', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { toast.success('Settings saved!'); router.refresh(); }
    else        { toast.error('Failed to save settings.'); }
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-ink-100 p-6 space-y-4 mb-6">
      <h2 className="font-semibold text-ink-950 text-base border-b border-ink-50 pb-3">{title}</h2>
      {children}
    </div>
  );

  const Field = ({
    label, skey, type = 'text', placeholder = '', hint = '',
  }: { label: string; skey: keyof SiteSettings; type?: string; placeholder?: string; hint?: string }) => (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          rows={5}
          value={(form[skey] as string) || ''}
          onChange={(e) => set(skey, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
      ) : (
        <input
          type={type}
          value={(form[skey] as string) || ''}
          onChange={(e) => set(skey, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      )}
      {hint && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div>
      <Section title="Site Identity">
        <Field label="Site Name"   skey="site_name"  placeholder="My Awesome Blog" />
        <Field label="Tagline"     skey="tagline"    placeholder="Ideas worth reading." />
        <Field label="Logo URL"    skey="logo_url"   placeholder="https://…" hint="Leave empty to use the text site name." />
        <Field label="Favicon URL" skey="favicon_url" placeholder="https://…" />
        <Field label="Contact Email" skey="contact_email" type="email" />
      </Section>

      <Section title="Google AdSense">
        <Field label="Publisher ID"      skey="adsense_publisher_id" placeholder="pub-XXXXXXXXXXXXXXXX" hint="Your ca-pub-XXXXXXXXXXXXXXXX ID" />
        <Field label="Header Ad Slot"    skey="adsense_slot_header"  placeholder="1234567890" />
        <Field label="Sidebar Ad Slot"   skey="adsense_slot_sidebar" placeholder="1234567890" />
        <Field label="Inline Ad Slot"    skey="adsense_slot_inline"  placeholder="1234567890" />
      </Section>

      <Section title="Social Links">
        <Field label="Twitter / X"  skey="social_twitter"   placeholder="https://twitter.com/…" />
        <Field label="Facebook"     skey="social_facebook"  placeholder="https://facebook.com/…" />
        <Field label="Instagram"    skey="social_instagram" placeholder="https://instagram.com/…" />
        <Field label="YouTube"      skey="social_youtube"   placeholder="https://youtube.com/…" />
      </Section>

      <Section title="Legal Pages Content">
        <Field label="About Us Text"          skey="about_text"          type="textarea" placeholder="Write about your publication…" />
        <Field label="Privacy Policy (HTML)"  skey="privacy_policy_text" type="textarea" placeholder="<p>Leave empty to use the auto-generated policy.</p>" hint="Supports basic HTML. Leave empty for auto-generated default." />
      </Section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 bg-accent hover:bg-accent-light disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
      >
        {saving ? 'Saving…' : 'Save All Settings'}
      </button>
    </div>
  );
}
