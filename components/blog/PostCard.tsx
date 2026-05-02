// components/blog/PostCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types';

interface Props {
  post: Post;
  size?: 'sm' | 'md' | 'lg';
}

export default function PostCard({ post, size = 'md' }: Props) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <article className="post-card group">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Cover image */}
        {post.cover_image && (
          <div className={`relative overflow-hidden ${size === 'lg' ? 'h-64' : size === 'sm' ? 'h-36' : 'h-48'}`}>
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-5">
          {/* Category */}
          <span className="category-badge mb-3 inline-block">{post.category}</span>

          {/* Title */}
          <h2 className={`font-serif font-bold text-ink-950 leading-tight mb-2 line-clamp-2 group-hover:text-accent transition-colors ${
            size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl'
          }`}>
            {post.title}
          </h2>

          {/* Excerpt */}
          {size !== 'sm' && (
            <p className="text-ink-600 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-ink-400">
            <time dateTime={post.created_at}>{timeAgo}</time>
            {post.read_time && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />{post.read_time} min read
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
