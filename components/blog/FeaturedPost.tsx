// components/blog/FeaturedPost.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types';

export default function FeaturedPost({ post }: { post: Post }) {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-ink-950 min-h-[480px] flex items-end group">
      {/* Background image */}
      {post.cover_image && (
        <Image
          src={post.cover_image}
          alt={post.title}
          fill
          priority
          className="object-cover opacity-50 group-hover:opacity-40 transition-opacity duration-500"
          sizes="100vw"
        />
      )}

      {/* Content Box */}
      <div className="relative z-10 w-full p-6 md:p-10">
        <div className="glass-card p-8 md:p-12 rounded-3xl max-w-3xl border-white/20">
          <span className="category-badge mb-4 inline-block">{post.category}</span>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink-950 leading-tight mb-4 group-hover:text-accent transition-colors">
            {post.title}
          </h1>

          <p className="text-ink-600 text-base md:text-lg leading-relaxed mb-6 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 text-sm text-ink-500">
              <span className="font-semibold text-ink-700">{post.author}</span>
              <span>·</span>
              <time>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</time>
              {post.read_time && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={13} />{post.read_time} min read</span>
                </>
              )}
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95"
            >
              Read Article <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
