// app/admin/posts/page.tsx
import Link from 'next/link';
import { getAllPostsAdmin } from '@/lib/posts';
import { PlusCircle } from 'lucide-react';
import AdminPostsTable from '@/components/admin/PostsTable';

export default async function AdminPostsPage() {
  const posts = await getAllPostsAdmin();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-950">All Posts</h1>
          <p className="text-ink-500 text-sm mt-1">{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <PlusCircle size={16} /> New Post
        </Link>
      </div>

      <AdminPostsTable posts={posts} />
    </div>
  );
}
