import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
