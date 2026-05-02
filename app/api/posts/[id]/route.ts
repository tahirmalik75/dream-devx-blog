// app/api/posts/[id]/route.ts  — PUT (update) + DELETE
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updatePost, deletePost } from '@/lib/posts';

interface Props { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  try {
    const post = await updatePost(params.id, body);
    return NextResponse.json(post);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update post';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await deletePost(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete post';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
