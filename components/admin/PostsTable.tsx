// components/admin/PostsTable.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import type { Post } from '@/types';

export default function AdminPostsTable({ posts: initialPosts }: { posts: Post[] }) {
  const router              = useRouter();
  const [posts, setPosts]   = useState(initialPosts);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setPosts((p) => p.filter((post) => post.id !== id));
      toast.success('Post deleted.');
      router.refresh();
    } catch {
      toast.error('Could not delete post.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 border-b border-ink-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-ink-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-600">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-600">Views</th>
              <th className="text-left px-4 py-3 font-semibold text-ink-600">Date</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-ink-50 transition-colors">
                <td className="px-5 py-4 font-medium text-ink-900 max-w-xs truncate">
                  {post.title}
                  {post.featured && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Featured</span>
                  )}
                </td>
                <td className="px-4 py-4 text-ink-500">{post.category}</td>
                <td className="px-4 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-4 text-ink-500 flex items-center gap-1">
                  <Eye size={12} className="opacity-50" />{post.views}
                </td>
                <td className="px-4 py-4 text-ink-400 text-xs">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {post.published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 text-ink-400 hover:text-ink-700 rounded transition-colors"
                        title="View post"
                      >
                        <ExternalLink size={15} />
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-1.5 text-ink-400 hover:text-accent rounded transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deleting === post.id}
                      className="p-1.5 text-ink-400 hover:text-red-600 rounded transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
