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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 max-w-2xl">
        <span className="category-badge mb-4 inline-block">{post.category}</span>

        <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-ink-300 text-base md:text-lg leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 text-sm text-ink-400">
            <span>{post.author}</span>
            <span>·</span>
            <time>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</time>
            {post.read_time && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={13} />{post.read_time} min</span>
              </>
            )}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            Read Article <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
