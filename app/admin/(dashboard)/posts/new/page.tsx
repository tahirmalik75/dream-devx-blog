// app/admin/posts/new/page.tsx
import PostEditor from '@/components/admin/PostEditor';

export default function NewPostPage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold text-ink-950 mb-8">New Post</h1>
      <PostEditor mode="create" />
    </div>
  );
}
