// types/index.ts

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;           // HTML from TipTap
  cover_image: string | null;
  category: Category;
  tags: string[];
  author: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  read_time?: number;        // in minutes
  views: number;
}

export type Category =
  | 'Technology'
  | 'Lifestyle'
  | 'Business'
  | 'Health'
  | 'Travel'
  | 'Food'
  | 'Finance'
  | 'Education';

export interface SiteSettings {
  site_name: string;
  tagline: string;
  logo_url: string | null;
  favicon_url: string | null;
  adsense_publisher_id: string;
  adsense_slot_header: string;
  adsense_slot_sidebar: string;
  adsense_slot_inline: string;
  social_twitter: string;
  social_facebook: string;
  social_instagram: string;
  social_youtube: string;
  contact_email: string;
  about_text: string;
  privacy_policy_text: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}
