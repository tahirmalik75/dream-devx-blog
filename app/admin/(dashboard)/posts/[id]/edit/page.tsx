// app/admin/posts/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase';
import PostEditor from '@/components/admin/PostEditor';
import type { Post } from '@/types';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) notFound();

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold text-ink-950 mb-8">Edit Post</h1>
      <PostEditor mode="edit" post={data as Post} />
    </div>
  );
}
