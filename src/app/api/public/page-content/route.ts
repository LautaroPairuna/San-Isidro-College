import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCachedPageContent, refreshPageContentCacheForSlug } from '@/lib/pageContentCache';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageSlug = searchParams.get('slug');

  if (!pageSlug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  try {
    // Buscamos todas las secciones asociadas a la página solicitada.
    // Incluimos el GrupoMedios y sus Medios, ordenados por posición.
    const sections = await prisma.seccion.findMany({
      where: { pagina: pageSlug },
      include: {
        grupo: {
          include: {
            medios: {
              orderBy: { posicion: 'asc' },
            },
          },
        },
        // También incluimos 'medio' individual por si la sección es de tipo MEDIA_UNICA
        medio: true,
      },
      orderBy: { orden: 'asc' },
    });

    // Mantener snapshot en disco para tolerar caída/eliminación de DB.
    await refreshPageContentCacheForSlug(pageSlug);

    // Si DB responde vacío por borrado accidental, devolvemos el snapshot anterior si existe.
    if (sections.length === 0) {
      const cached = await getCachedPageContent(pageSlug);
      if (cached && cached.length > 0) {
        return NextResponse.json(cached);
      }
    }

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
