import { NextResponse } from 'next/server';
import { getCachedPageContent, getPageContentForSlug } from '@/lib/pageContentCache';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get('slug');

  if (!pageSlug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    const sections = await getPageContentForSlug(pageSlug);
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching page content:', error);
    const cached = await getCachedPageContent(pageSlug);
    if (cached) {
      return NextResponse.json(cached);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
