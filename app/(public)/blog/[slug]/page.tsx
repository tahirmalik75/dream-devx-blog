// app/(public)/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { Metadata } from 'next';

import { getPostBySlug, getRelatedPosts, getAllPublishedSlugs } from '@/lib/posts';
import { getSiteSettings } from '@/lib/settings';
import { generatePostMetadata } from '@/components/seo/PostMeta';
import AdSlot from '@/components/ads/AdSlot';
import PostCard from '@/components/blog/PostCard';

interface Props {
  params: { slug: string };
}

// ── Static params for ISR / SSG ──────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── Per-post metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };
  const settings = await getSiteSettings();
  return generatePostMetadata(
    post,
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    settings.site_name
  );
}

// ── Page (SSR) ────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const [settings, related] = await Promise.all([
    getSiteSettings(),
    getRelatedPosts(post.category, post.slug, 3),
  ]);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: settings.site_name },
    mainEntityOfPage: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Article ──────────────────────────────────────── */}
          <article className="lg:col-span-2">

            {/* Breadcrumb */}
            <nav className="text-sm text-ink-400 mb-6 flex gap-2">
              <Link href="/" className="hover:text-accent">Home</Link>
              <span>/</span>
              <Link href={`/category/${post.category.toLowerCase()}`} className="hover:text-accent">{post.category}</Link>
              <span>/</span>
              <span className="text-ink-600 truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Category + Title */}
            <span className="category-badge mb-4 inline-block">{post.category}</span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink-950 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-500 mb-8 pb-8 border-b border-ink-100">
              <span className="font-medium text-ink-700">{post.author}</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                <time dateTime={post.created_at}>
                  {format(new Date(post.created_at), 'MMMM d, yyyy')}
                </time>
              </span>
              {post.read_time && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />{post.read_time} min read
                </span>
              )}
            </div>

            {/* Cover image */}
            {post.cover_image && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-10 shadow-lg">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            )}

            {/* ── First inline ad ── */}
            <AdSlot
              slot={settings.adsense_slot_inline}
              publisherId={settings.adsense_publisher_id}
              format="horizontal"
              className="ad-slot-inline"
            />

            {/* Post content (TipTap HTML output) */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-ink-950
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-blockquote:border-accent prose-blockquote:text-ink-600
                prose-code:bg-ink-100 prose-code:px-1 prose-code:rounded
                prose-pre:bg-ink-950 prose-pre:text-ink-100"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* ── Second inline ad ── */}
            <AdSlot
              slot={settings.adsense_slot_inline}
              publisherId={settings.adsense_publisher_id}
              format="horizontal"
              className="ad-slot-inline mt-10"
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-ink-100">
                <Tag size={16} className="text-ink-400 mt-0.5" />
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-ink-100 text-ink-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* ── Sidebar ───────────────────────────────────────── */}
          <aside className="space-y-8 lg:sticky lg:top-24 self-start">
            <AdSlot
              slot={settings.adsense_slot_sidebar}
              publisherId={settings.adsense_publisher_id}
              format="vertical"
              className="ad-slot-rect"
            />

            {related.length > 0 && (
              <div className="bg-white rounded-xl border border-ink-100 p-5">
                <h3 className="font-serif font-bold text-lg text-ink-950 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {related.map((p) => (
                    <PostCard key={p.id} post={p} size="sm" />
                  ))}
                </div>
              </div>
            )}

            <AdSlot
              slot={settings.adsense_slot_sidebar}
              publisherId={settings.adsense_publisher_id}
              format="rectangle"
              className="ad-slot-rect"
            />
          </aside>
        </div>
      </div>
    </>
  );
}
