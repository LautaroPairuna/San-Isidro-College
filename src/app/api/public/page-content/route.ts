import { NextResponse } from 'next/server';
import { getPageContentForSlug } from '@/lib/pageContentCache';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get('slug');

  if (!pageSlug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  // getPageContentForSlug ya lee de la DB (fuente de verdad) y cae a la caché
  // de respaldo automáticamente si la DB no responde.
  const sections = await getPageContentForSlug(pageSlug);
  return NextResponse.json(sections);
}
