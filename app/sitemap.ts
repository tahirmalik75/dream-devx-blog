// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllPublishedSlugs } from '@/lib/posts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

const STATIC_PAGES = [
  { url: '/',               priority: 1.0,  changeFrequency: 'daily'   as const },
  { url: '/about',          priority: 0.7,  changeFrequency: 'monthly' as const },
  { url: '/contact',        priority: 0.6,  changeFrequency: 'monthly' as const },
  { url: '/privacy-policy', priority: 0.5,  changeFrequency: 'monthly' as const },
];

const CATEGORIES = ['technology', 'lifestyle', 'business', 'health', 'travel', 'food', 'finance', 'education'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPublishedSlugs();

  const postUrls: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url:              `${SITE_URL}/blog/${slug}`,
    lastModified:     new Date(),
    changeFrequency:  'weekly',
    priority:         0.9,
  }));

  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url:             `${SITE_URL}/category/${cat}`,
    changeFrequency: 'daily',
    priority:        0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url:             `${SITE_URL}${p.url}`,
    changeFrequency: p.changeFrequency,
    priority:        p.priority,
    lastModified:    new Date(),
  }));

  return [...staticUrls, ...categoryUrls, ...postUrls];
}
