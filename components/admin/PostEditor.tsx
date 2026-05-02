// components/admin/PostEditor.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import toast from 'react-hot-toast';
import {
  Bold, Italic, Strikethrough, Code, Heading2, Heading3, List, ListOrdered,
  Quote, Minus, Undo, Redo, Link2, Image as ImageIcon, Youtube as YoutubeIcon, Save,
} from 'lucide-react';
import type { Post, Category } from '@/types';

const CATEGORIES: Category[] = [
  'Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Food', 'Finance', 'Education',
];

interface Props {
  mode: 'create' | 'edit';
  post?: Post;
}

export default function PostEditor({ mode, post }: Props) {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string>(post?.cover_image || '');
  const [coverUploading, setCoverUploading] = useState(false);

  const [fields, setFields] = useState({
    title:            post?.title            || '',
    excerpt:          post?.excerpt          || '',
    category:         post?.category         || 'Technology' as Category,
    tags:             post?.tags?.join(', ') || '',
    meta_title:       post?.meta_title       || '',
    meta_description: post?.meta_description || '',
    published:        post?.published        || false,
    featured:         post?.featured         || false,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ allowBase64: false, HTMLAttributes: { class: 'rounded-xl max-w-full' } }),
      Youtube.configure({ controls: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your article here…' }),
      CharacterCount,
    ],
    content: post?.content || '',
    editorProps: {
      attributes: { class: 'tiptap-editor' },
    },
  });

  // ── Image upload into content ──────────────────────────────────────────────
  async function insertImage() {
    const input = document.createElement('input');
    input.type  = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;
      const t = toast.loading('Uploading image…');
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'content');
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      toast.dismiss(t);
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
        toast.success('Image inserted!');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    };
    input.click();
  }

  // ── Cover image upload ─────────────────────────────────────────────────────
  async function uploadCover(file: File) {
    setCoverUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'covers');
    const res  = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setCoverUploading(false);
    if (data.url) { setCoverPreview(data.url); }
    else { toast.error(data.error || 'Upload failed'); }
  }

  // ── YouTube embed ──────────────────────────────────────────────────────────
  function insertYoutube() {
    const url = prompt('Enter YouTube URL:');
    if (url && editor) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  // ── Link ──────────────────────────────────────────────────────────────────
  function setLink() {
    const url = prompt('Enter URL:', editor?.getAttributes('link').href);
    if (url === null) return;
    if (url === '') { editor?.chain().focus().unsetLink().run(); return; }
    editor?.chain().focus().setLink({ href: url }).run();
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!fields.title.trim()) { toast.error('Title is required'); return; }
    if (!editor) return;

    setSaving(true);
    const body = {
      ...fields,
      tags:        fields.tags.split(',').map((t) => t.trim()).filter(Boolean),
      content:     editor.getHTML(),
      cover_image: coverPreview || null,
    };

    const url    = mode === 'create' ? '/api/posts' : `/api/posts/${post!.id}`;
    const method = mode === 'create' ? 'POST'       : 'PUT';

    const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { toast.error(data.error || 'Save failed'); return; }

    toast.success(mode === 'create' ? 'Post created!' : 'Post updated!');
    if (mode === 'create') router.push(`/admin/posts/${data.id}/edit`);
    else router.refresh();
  }

  // ── Toolbar button helper ──────────────────────────────────────────────────
  const TB = useCallback(({
    onClick, active = false, title, children,
  }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-ink-200 text-ink-900' : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'}`}
    >
      {children}
    </button>
  ), []);

  if (!editor) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

      {/* ── Editor column ──────────────────────────────────────── */}
      <div className="xl:col-span-2 space-y-6">

        {/* Title */}
        <input
          type="text"
          placeholder="Post title…"
          value={fields.title}
          onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))}
          className="w-full text-3xl font-serif font-bold text-ink-950 placeholder:text-ink-300 border-0 border-b-2 border-ink-100 focus:border-accent focus:outline-none bg-transparent pb-3"
        />

        {/* Excerpt */}
        <textarea
          placeholder="Short excerpt / meta description…"
          rows={2}
          value={fields.excerpt}
          onChange={(e) => setFields((f) => ({ ...f, excerpt: e.target.value }))}
          className="w-full px-4 py-3 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />

        {/* TipTap toolbar */}
        <div className="border border-ink-200 rounded-xl overflow-hidden bg-white">
          <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-ink-100 bg-ink-50">
            <TB title="Bold"          onClick={() => editor.chain().focus().toggleBold().run()}          active={editor.isActive('bold')}>          <Bold size={15}/>          </TB>
            <TB title="Italic"        onClick={() => editor.chain().focus().toggleItalic().run()}        active={editor.isActive('italic')}>        <Italic size={15}/>        </TB>
            <TB title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}        active={editor.isActive('strike')}>        <Strikethrough size={15}/> </TB>
            <TB title="Code"          onClick={() => editor.chain().focus().toggleCode().run()}          active={editor.isActive('code')}>          <Code size={15}/>          </TB>
            <span className="w-px h-5 bg-ink-200 mx-1" />
            <TB title="Heading 2"     onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}> <Heading2 size={15}/> </TB>
            <TB title="Heading 3"     onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}> <Heading3 size={15}/> </TB>
            <span className="w-px h-5 bg-ink-200 mx-1" />
            <TB title="Bullet List"   onClick={() => editor.chain().focus().toggleBulletList().run()}    active={editor.isActive('bulletList')}>    <List size={15}/>          </TB>
            <TB title="Ordered List"  onClick={() => editor.chain().focus().toggleOrderedList().run()}   active={editor.isActive('orderedList')}>   <ListOrdered size={15}/>   </TB>
            <TB title="Blockquote"    onClick={() => editor.chain().focus().toggleBlockquote().run()}    active={editor.isActive('blockquote')}>    <Quote size={15}/>         </TB>
            <TB title="Divider"       onClick={() => editor.chain().focus().setHorizontalRule().run()}>                                                               <Minus size={15}/>         </TB>
            <span className="w-px h-5 bg-ink-200 mx-1" />
            <TB title="Link"          onClick={setLink}                                                  active={editor.isActive('link')}>          <Link2 size={15}/>         </TB>
            <TB title="Insert image"  onClick={insertImage}>                                                                                                         <ImageIcon size={15}/>     </TB>
            <TB title="Embed YouTube" onClick={insertYoutube}>                                                                                                       <YoutubeIcon size={15}/>   </TB>
            <span className="w-px h-5 bg-ink-200 mx-1" />
            <TB title="Undo"          onClick={() => editor.chain().focus().undo().run()}>               <Undo size={15}/>          </TB>
            <TB title="Redo"          onClick={() => editor.chain().focus().redo().run()}>               <Redo size={15}/>          </TB>

            <span className="ml-auto text-xs text-ink-400">
              {editor.storage.characterCount?.characters()} chars
            </span>
          </div>

          <EditorContent editor={editor} />
        </div>
      </div>

      {/* ── Sidebar / meta ─────────────────────────────────────── */}
      <div className="space-y-5">

        {/* Publish button */}
        <div className="bg-white rounded-xl border border-ink-100 p-5 space-y-4">
          <h3 className="font-semibold text-ink-950">Publish</h3>
          <div className="flex items-center justify-between">
            <label className="text-sm text-ink-600">Status</label>
            <button
              type="button"
              onClick={() => setFields((f) => ({ ...f, published: !f.published }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${fields.published ? 'bg-green-500' : 'bg-ink-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${fields.published ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-ink-600">Featured</label>
            <button
              type="button"
              onClick={() => setFields((f) => ({ ...f, featured: !f.featured }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${fields.featured ? 'bg-amber-500' : 'bg-ink-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${fields.featured ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-accent-light disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            <Save size={16} /> {saving ? 'Saving…' : mode === 'create' ? 'Create Post' : 'Save Changes'}
          </button>
        </div>

        {/* Cover image */}
        <div className="bg-white rounded-xl border border-ink-100 p-5 space-y-3">
          <h3 className="font-semibold text-ink-950">Cover Image</h3>
          {coverPreview && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image src={coverPreview} alt="Cover" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setCoverPreview('')}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
              >
                Remove
              </button>
            </div>
          )}
          <label className={`block w-full text-center border-2 border-dashed border-ink-200 rounded-lg py-4 text-sm text-ink-500 cursor-pointer hover:border-accent transition-colors ${coverUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {coverUploading ? 'Uploading…' : coverPreview ? 'Change cover' : 'Upload cover image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); }}
            />
          </label>
          <p className="text-xs text-ink-400">Or paste URL:</p>
          <input
            type="url"
            placeholder="https://…"
            value={coverPreview}
            onChange={(e) => setCoverPreview(e.target.value)}
            className="w-full px-3 py-2 border border-ink-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Category & tags */}
        <div className="bg-white rounded-xl border border-ink-100 p-5 space-y-4">
          <h3 className="font-semibold text-ink-950">Classification</h3>
          <div>
            <label className="block text-sm text-ink-600 mb-1">Category</label>
            <select
              value={fields.category}
              onChange={(e) => setFields((f) => ({ ...f, category: e.target.value as Category }))}
              className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-ink-600 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="react, nextjs, web"
              value={fields.tags}
              onChange={(e) => setFields((f) => ({ ...f, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-ink-100 p-5 space-y-4">
          <h3 className="font-semibold text-ink-950">SEO</h3>
          <div>
            <label className="block text-sm text-ink-600 mb-1">Meta Title</label>
            <input
              type="text"
              placeholder="Leave empty to use post title"
              value={fields.meta_title}
              onChange={(e) => setFields((f) => ({ ...f, meta_title: e.target.value }))}
              className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-ink-400 mt-1">{fields.meta_title.length}/60</p>
          </div>
          <div>
            <label className="block text-sm text-ink-600 mb-1">Meta Description</label>
            <textarea
              rows={3}
              placeholder="Leave empty to use excerpt"
              value={fields.meta_description}
              onChange={(e) => setFields((f) => ({ ...f, meta_description: e.target.value }))}
              className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <p className="text-xs text-ink-400 mt-1">{fields.meta_description.length}/160</p>
          </div>
        </div>
      </div>
    </div>
  );
}
