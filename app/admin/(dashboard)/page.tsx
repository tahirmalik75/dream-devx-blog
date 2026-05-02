// app/admin/page.tsx
import Link from 'next/link';
import { getAllPostsAdmin } from '@/lib/posts';
import { FileText, Eye, PlusCircle, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function AdminDashboard() {
  const posts = await getAllPostsAdmin();

  const published = posts.filter((p) => p.published).length;
  const drafts    = posts.filter((p) => !p.published).length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const recent    = posts.slice(0, 8);

  const STATS = [
    { label: 'Total Posts',     value: posts.length, icon: FileText,   color: 'bg-blue-50 text-blue-600'   },
    { label: 'Published',       value: published,    icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Drafts',          value: drafts,       icon: FileText,   color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Views',     value: totalViews,   icon: Eye,        color: 'bg-purple-50 text-purple-600'},
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-950">Dashboard</h1>
          <p className="text-ink-500 text-sm mt-1">Welcome back. Here's your blog overview.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <PlusCircle size={16} /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-ink-100 p-5">
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-ink-950">{value.toLocaleString()}</p>
            <p className="text-sm text-ink-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent posts table */}
      <div className="bg-white rounded-xl border border-ink-100">
        <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
          <h2 className="font-semibold text-ink-950">Recent Posts</h2>
          <Link href="/admin/posts" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-ink-50">
          {recent.map((post) => (
            <div key={post.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-ink-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink-900 truncate">{post.title}</p>
                <p className="text-xs text-ink-400 mt-0.5">
                  {post.category} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  post.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                <span className="text-xs text-ink-400 flex items-center gap-1"><Eye size={12}/>{post.views}</span>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="text-xs text-accent hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
