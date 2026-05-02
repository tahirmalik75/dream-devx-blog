// app/(public)/page.tsx
import { Suspense } from 'react';
import { getAllPosts, getFeaturedPost } from '@/lib/posts';
import { getSiteSettings } from '@/lib/settings';
import FeaturedPost from '@/components/blog/FeaturedPost';
import PostCard from '@/components/blog/PostCard';
import AdSlot from '@/components/ads/AdSlot';
import Newsletter from '@/components/layout/Newsletter';
import type { Category } from '@/types';

const CATEGORIES: Category[] = ['Technology', 'Lifestyle', 'Business', 'Health'];

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  const [featuredPost, posts, settings] = await Promise.all([
    getFeaturedPost(),
    getAllPosts(12),
    getSiteSettings(),
  ]);

  const latestPosts   = posts.filter((p) => !p.featured).slice(0, 6);
  const sidebarPosts  = posts.slice(6, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* ── Hero ─────────────────────────────────────────────── */}
      {featuredPost && (
        <section className="mb-14">
          <FeaturedPost post={featuredPost} />
        </section>
      )}

      {/* ── Category pills ───────────────────────────────────── */}
      <section className="mb-10 flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={`/category/${cat.toLowerCase()}`}
            className="px-4 py-1.5 rounded-full border border-ink-200 text-sm font-medium text-ink-600 hover:bg-accent hover:border-accent hover:text-white transition-colors"
          >
            {cat}
          </a>
        ))}
      </section>

      {/* ── Main grid + sidebar ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Post grid */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold text-ink-950 mb-6 pb-2 border-b border-ink-100">
            Latest Articles
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Inline ad after 6 posts */}
          <AdSlot
            slot={settings.adsense_slot_inline}
            publisherId={settings.adsense_publisher_id}
            format="horizontal"
            className="ad-slot-inline"
          />

          {/* Second row */}
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {posts.slice(6, 12).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Sidebar ad */}
          <AdSlot
            slot={settings.adsense_slot_sidebar}
            publisherId={settings.adsense_publisher_id}
            format="vertical"
            className="ad-slot-rect"
          />

          {/* Popular posts */}
          <div className="bg-white rounded-xl border border-ink-100 p-5">
            <h3 className="font-serif font-bold text-lg text-ink-950 mb-4">Trending</h3>
            <ol className="space-y-4">
              {sidebarPosts.map((post, i) => (
                <li key={post.id} className="flex gap-3 items-start">
                  <span className="font-serif text-3xl font-bold text-ink-100 leading-none select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <a href={`/blog/${post.slug}`} className="text-sm font-medium text-ink-800 hover:text-accent transition-colors leading-snug">
                    {post.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Newsletter widget */}
          <Newsletter />

          {/* Second sidebar ad */}
          <AdSlot
            slot={settings.adsense_slot_sidebar}
            publisherId={settings.adsense_publisher_id}
            format="rectangle"
            className="ad-slot-rect"
          />
        </aside>
      </div>
    </div>
  );
}
