// app/api/posts/route.ts  — GET (admin list) + POST (create)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllPostsAdmin, createPost } from '@/lib/posts';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const posts = await getAllPostsAdmin();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  try {
    const post = await createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create post';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
