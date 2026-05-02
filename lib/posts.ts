// lib/posts.ts
import { createServerSupabaseClient, createAdminClient } from './supabase';
import type { Post, Category } from '@/types';
import slugify from 'slugify';

// ─── READ ────────────────────────────────────────────────────────────────────
// NOTE: We use createAdminClient() for read operations during Static Generation 
// to avoid the "cookies() was called outside a request scope" error.

/** Fetch all published posts (SSR) */
export async function getAllPosts(limit = 20, offset = 0): Promise<Post[]> {
  const supabase = createAdminClient(); 
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) { console.error(error); return []; }
  return data as Post[];
}

/** Fetch featured post for hero section */
export async function getFeaturedPost(): Promise<Post | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data as Post | null;
}

/** Fetch a single post by slug (for SSR blog page) */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) return null;

  // Increment view count (fire-and-forget)
  supabase.rpc('increment_views', { post_slug: slug }).then(() => {});

  return data as Post;
}

/** Fetch posts by category */
export async function getPostsByCategory(
  category: Category,
  limit = 12
): Promise<Post[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as Post[]) || [];
}

/** Fetch related posts (same category, excluding current) */
export async function getRelatedPosts(
  category: Category,
  excludeSlug: string,
  limit = 3
): Promise<Post[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image, category, created_at, read_time')
    .eq('published', true)
    .eq('category', category)
    .neq('slug', excludeSlug)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as Post[]) || [];
}

/** Get all published slugs (for sitemap / static generation) */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('posts')
    .select('slug')
    .eq('published', true);
  return (data || []).map((p: { slug: string }) => p.slug);
}

// ─── ADMIN WRITE (service-role, bypasses RLS) ────────────────────────────────

export interface PostInput {
  title: string;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  category: Category;
  tags?: string[];
  published?: boolean;
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  read_time?: number;
}

function generateSlug(title: string) {
  return slugify(title, { lower: true, strict: true, trim: true });
}

function estimateReadTime(html: string) {
  const text = html.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function createPost(input: PostInput): Promise<Post> {
  const admin = createAdminClient();
  const slug = generateSlug(input.title);
  const read_time = estimateReadTime(input.content);

  const { data, error } = await admin
    .from('posts')
    .insert({
      ...input,
      slug,
      read_time,
      views: 0,
      author: 'Admin',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
}

export async function updatePost(id: string, input: Partial<PostInput>): Promise<Post> {
  const admin = createAdminClient();
  const updates: Record<string, unknown> = { ...input, updated_at: new Date().toISOString() };

  if (input.title) updates.slug = generateSlug(input.title);
  if (input.content) updates.read_time = estimateReadTime(input.content);

  const { data, error } = await admin
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
}

export async function deletePost(id: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Admin: fetch ALL posts (including drafts) */
export async function getAllPostsAdmin(): Promise<Post[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Post[];
}
