// lib/settings.ts
import { createAdminClient } from './supabase';
import type { SiteSettings } from '@/types';

const DEFAULTS: SiteSettings = {
  site_name: 'dream-devx-blog',
  tagline: 'Crafting digital experiences.',
  logo_url: null,
  favicon_url: null,
  adsense_publisher_id: '',
  adsense_slot_header: '',
  adsense_slot_sidebar: '',
  adsense_slot_inline: '',
  social_twitter: '',
  social_facebook: '',
  social_instagram: '',
  social_youtube: '',
  contact_email: 'connect.dreamdev@gmail.com',
  about_text: 'We write thoughtful articles on technology, lifestyle, and more.',
  privacy_policy_text: '',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();
  return { ...DEFAULTS, ...(data || {}) };
}

export async function updateSiteSettings(
  updates: Partial<SiteSettings>
): Promise<SiteSettings> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('site_settings')
    .upsert({ id: 1, ...updates })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return { ...DEFAULTS, ...data };
}
