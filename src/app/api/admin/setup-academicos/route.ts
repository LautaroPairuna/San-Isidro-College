import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { SeccionTipo } from '@/generated/prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results = [];
    const sections: Array<{
      slug: string
      pagina: string
      orden: number
      tipo: SeccionTipo
      medioId?: number
      grupoId?: number
      titulo: string
    }> = [
      {
        slug: 'academicos-kinder',
        pagina: 'academicos',
        orden: 10,
        tipo: 'MEDIA_UNICA',
        medioId: 1, 
        titulo: 'Kindergarten',
      },
      {
        slug: 'academicos-primary',
        pagina: 'academicos',
        orden: 20,
        tipo: 'MEDIA_UNICA',
        medioId: 2,
        titulo: 'Primary',
      },
      {
        slug: 'academicos-secondary',
        pagina: 'academicos',
        orden: 30,
        tipo: 'MEDIA_UNICA',
        medioId: 3,
        titulo: 'Secondary',
      },
      {
        slug: 'academicos-alianzas',
        pagina: 'academicos',
        orden: 40,
        tipo: 'GALERIA',
        grupoId: 7, // ID histórico para grupo 'Alianzas'
        titulo: 'Nuestras Alianzas',
      },
    ];

    for (const s of sections) {
      // Verificar existencia previa
      const existing = await prisma.seccion.findUnique({ where: { slug: s.slug } });

      if (existing) {
        // Actualizar metadatos, preservando asignaciones manuales si ya existen
        await prisma.seccion.update({
          where: { slug: s.slug },
          data: {
            pagina: s.pagina,
            orden: s.orden,
            tipo: s.tipo,
            titulo: s.titulo,
            // Solo establecemos el default si no hay nada asignado actualmente
            grupoId: existing.grupoId ?? s.grupoId,
            medioId: existing.medioId ?? s.medioId,
          },
        });
        results.push(`Updated: ${s.slug}`);
      } else {
        // Crear nueva sección
        await prisma.seccion.create({
          data: {
            slug: s.slug,
            pagina: s.pagina,
            orden: s.orden,
            tipo: s.tipo,
            titulo: s.titulo,
            grupoId: s.grupoId,
            medioId: s.medioId,
          },
        });
        results.push(`Created: ${s.slug}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migración de secciones de académicos completada',
      results,
    });
  } catch (error) {
    console.error('Error en setup-academicos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
