// components/seo/PostMeta.tsx
// Helper to generate Metadata for a blog post — used in blog/[slug]/page.tsx
import type { Metadata } from 'next';
import type { Post } from '@/types';

export function generatePostMetadata(post: Post, siteUrl: string, siteName: string): Metadata {
  const title       = post.meta_title       || post.title;
  const description = post.meta_description || post.excerpt;
  const url         = `${siteUrl}/blog/${post.slug}`;
  const image       = post.cover_image || `${siteUrl}/og-default.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type:      'article',
      siteName,
      images:    [{ url: image, width: 1200, height: 630, alt: title }],
      publishedTime: post.created_at,
      modifiedTime:  post.updated_at,
      tags:          post.tags,
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [image],
    },
    alternates: { canonical: url },
  };
}
