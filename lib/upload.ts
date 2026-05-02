// lib/upload.ts
import { createAdminClient } from './supabase';

const BUCKET = 'blog-images';

export async function uploadImage(file: File, folder = 'posts'): Promise<string> {
  const admin = createAdminClient();
  const ext   = file.name.split('.').pop();
  const name  = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await admin.storage.from(BUCKET).upload(name, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) throw new Error(error.message);

  const { data } = admin.storage.from(BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const admin  = createAdminClient();
  const path   = url.split(`/${BUCKET}/`)[1];
  if (!path) return;
  await admin.storage.from(BUCKET).remove([path]);
}
