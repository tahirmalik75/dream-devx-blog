-- supabase/schema.sql
-- Run this in your Supabase SQL Editor to set up the database

-- ── Enable UUID extension ──────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Posts table ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  excerpt          TEXT NOT NULL DEFAULT '',
  content          TEXT NOT NULL DEFAULT '',
  cover_image      TEXT,
  category         TEXT NOT NULL DEFAULT 'Technology',
  tags             TEXT[] DEFAULT '{}',
  author           TEXT NOT NULL DEFAULT 'Admin',
  published        BOOLEAN NOT NULL DEFAULT FALSE,
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title       TEXT,
  meta_description TEXT,
  read_time        INTEGER DEFAULT 1,
  views            INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Increment view count (atomic RPC) ─────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_views(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE posts SET views = views + 1 WHERE slug = post_slug AND published = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Site settings table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id                      INTEGER PRIMARY KEY DEFAULT 1,
  site_name               TEXT    NOT NULL DEFAULT 'The Insight',
  tagline                 TEXT    NOT NULL DEFAULT 'Ideas worth reading.',
  logo_url                TEXT,
  favicon_url             TEXT,
  adsense_publisher_id    TEXT    NOT NULL DEFAULT '',
  adsense_slot_header     TEXT    NOT NULL DEFAULT '',
  adsense_slot_sidebar    TEXT    NOT NULL DEFAULT '',
  adsense_slot_inline     TEXT    NOT NULL DEFAULT '',
  social_twitter          TEXT    NOT NULL DEFAULT '',
  social_facebook         TEXT    NOT NULL DEFAULT '',
  social_instagram        TEXT    NOT NULL DEFAULT '',
  social_youtube          TEXT    NOT NULL DEFAULT '',
  contact_email           TEXT    NOT NULL DEFAULT 'hello@example.com',
  about_text              TEXT    NOT NULL DEFAULT '',
  privacy_policy_text     TEXT    NOT NULL DEFAULT '',
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings row
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ── Admin users table ──────────────────────────────────────────────────────
-- Links to Supabase Auth (auth.users) with a role column
CREATE TABLE IF NOT EXISTS admin_users (
  id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role  TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor'))
);

-- ── Row Level Security ─────────────────────────────────────────────────────
ALTER TABLE posts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users   ENABLE ROW LEVEL SECURITY;

-- Public: read published posts only
CREATE POLICY "Public can read published posts"
ON posts FOR SELECT
USING (published = TRUE);

-- Service role (used by admin client) bypasses RLS automatically.
-- If you need anon reads for settings, add:
CREATE POLICY "Public can read settings"
ON site_settings FOR SELECT
USING (TRUE);

-- ── Storage bucket ─────────────────────────────────────────────────────────
-- Run in Supabase Dashboard → Storage → New Bucket:
-- Name: blog-images   |  Public: YES
-- Or via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Public read
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_posts_slug       ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_published  ON posts (published);
CREATE INDEX IF NOT EXISTS idx_posts_category   ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_featured   ON posts (featured);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
