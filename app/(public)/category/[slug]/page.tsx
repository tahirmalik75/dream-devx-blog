// app/(public)/category/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostsByCategory } from '@/lib/posts';
import PostCard from '@/components/blog/PostCard';
import type { Category } from '@/types';

const VALID: Record<string, Category> = {
  technology: 'Technology',
  lifestyle:  'Lifestyle',
  business:   'Business',
  health:     'Health',
  travel:     'Travel',
  food:       'Food',
  finance:    'Finance',
  education:  'Education',
};

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = VALID[params.slug];
  if (!cat) return { title: 'Not Found' };
  return {
    title: `${cat} Articles`,
    description: `Browse all ${cat} articles on our blog.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const cat = VALID[params.slug];
  if (!cat) notFound();

  const posts = await getPostsByCategory(cat, 24);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="mb-10 pb-6 border-b border-ink-100">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Category</p>
        <h1 className="font-serif text-4xl font-bold text-ink-950">{cat}</h1>
        <p className="text-ink-500 mt-2">{posts.length} article{posts.length !== 1 ? 's' : ''}</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-ink-400 text-center py-20">No posts in this category yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  );
}
