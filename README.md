# Blog Website — Next.js + Tailwind + Supabase

A production-ready, SEO-optimized blog built for **Google AdSense approval**.

## Tech Stack

| Layer      | Technology                                 |
|------------|--------------------------------------------|
| Framework  | Next.js 14 (App Router, SSR + ISR)         |
| Styling    | Tailwind CSS + @tailwindcss/typography     |
| Database   | Supabase (PostgreSQL)                      |
| Auth       | NextAuth v5 + Supabase Auth                |
| Editor     | TipTap (rich-text, image upload, YouTube)  |
| Images     | Supabase Storage                           |
| SEO        | Next.js Metadata API + JSON-LD + Sitemap   |

---

## Project Structure

```
├── app/
│   ├── (public)/               # Public routes (header + footer layout)
│   │   ├── page.tsx            # Homepage — featured post + grid + sidebar
│   │   ├── blog/[slug]/        # Blog post page (SSR)
│   │   ├── category/[slug]/    # Category listing
│   │   ├── about/              # About Us (AdSense legal)
│   │   ├── contact/            # Contact form
│   │   └── privacy-policy/     # Auto-generated privacy policy
│   ├── admin/                  # Protected admin panel
│   │   ├── layout.tsx          # Sidebar navigation
│   │   ├── page.tsx            # Dashboard with stats
│   │   ├── login/              # Login page
│   │   ├── posts/              # Post list + new/edit
│   │   └── settings/           # Site settings
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth handler
│   │   ├── posts/              # CRUD API
│   │   ├── upload/             # Image upload API
│   │   └── settings/           # Settings API
│   ├── sitemap.ts              # Dynamic XML sitemap
│   ├── robots.ts               # robots.txt
│   └── layout.tsx              # Root layout + fonts + metadata
├── components/
│   ├── layout/                 # Header, Footer
│   ├── blog/                   # PostCard, FeaturedPost
│   ├── admin/                  # PostEditor, PostsTable, SettingsForm
│   ├── ads/                    # AdSlot component
│   └── seo/                    # PostMeta helper
├── lib/
│   ├── supabase.ts             # Browser + server + admin clients
│   ├── posts.ts                # Post CRUD + fetching
│   ├── settings.ts             # Site settings
│   ├── auth.ts                 # NextAuth config
│   └── upload.ts               # Image upload util
├── supabase/
│   └── schema.sql              # Full DB schema — run this first
├── types/index.ts              # TypeScript types
└── middleware.ts               # Auth guard for /admin
```

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/you/blog-website.git
cd blog-website
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Copy **Project URL** and **anon key** from Settings → API
3. Copy **service_role key** (keep secret!)

### 3. Run the database schema

In Supabase Dashboard → SQL Editor, paste and run the entire contents of `supabase/schema.sql`.

### 4. Create a storage bucket

The schema SQL does this automatically. If it doesn't, go to Storage → New bucket:
- Name: `blog-images`, Public: **Yes**

### 5. Create your admin user

In Supabase Dashboard → Authentication → Users → Add user. Then in SQL Editor:

```sql
INSERT INTO admin_users (id, email, role)
VALUES ('<your-auth-user-uuid>', 'admin@yoursite.com', 'admin');
```

### 6. Configure environment variables

```bash
cp .env.example .env.local
# Fill in your values
```

### 7. Run development server

```bash
npm run dev
# → http://localhost:3000
# Admin → http://localhost:3000/admin
```

---

## Google AdSense Setup

1. Apply at [google.com/adsense](https://google.com/adsense)
2. Add your site and get your **Publisher ID** (`ca-pub-XXXXXX`)
3. In Admin → Settings, enter your Publisher ID and Ad Slot IDs
4. Add the AdSense script to `app/layout.tsx`:

```tsx
<script
  async
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${settings.adsense_publisher_id}`}
  crossOrigin="anonymous"
/>
```

Ad slots are placed in:
- **Header** — top banner below the nav
- **Sidebar** — right rail on homepage and post pages
- **Inline** — inside post content (after intro + after body)

---

## Deployment (Vercel)

```bash
npm run build   # Verify no type errors
vercel deploy
```

Set all `.env.example` variables as **Environment Variables** in Vercel dashboard.

---

## SEO Checklist (for AdSense approval)

- [x] SSR meta tags (title, description, OG, Twitter card) per post
- [x] JSON-LD structured data (BlogPosting schema)
- [x] Dynamic sitemap at `/sitemap.xml`
- [x] `robots.txt` blocking admin/API routes
- [x] Canonical URLs
- [x] Privacy Policy page
- [x] About Us page
- [x] Contact page
- [x] Clean typography with `@tailwindcss/typography`
- [x] Mobile-responsive layout
- [x] Fast image loading (`next/image` with priority on hero)
- [x] ISR (60s revalidation) for fast delivery
