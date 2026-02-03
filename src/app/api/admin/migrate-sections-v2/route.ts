import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const results = [];

    // 1. HOME
    const homeSections = [
      { slug: 'home-hero', group: 4, order: 10 },
      { slug: 'home-bienvenida', group: 5, order: 20 },
      { slug: 'home-infografia', group: 6, order: 30 },
      { slug: 'home-sec3-background', group: 7, order: 40 },
      { slug: 'home-alianzas', group: 7, order: 50 },
    ];

    for (const s of homeSections) {
      await prisma.seccion.upsert({
        where: { slug: s.slug },
        update: { grupoId: s.group },
        create: {
          slug: s.slug,
          pagina: 'home',
          orden: s.order,
          tipo: 'GALERIA', // Changed to valid Enum
          grupoId: s.group,
        },
      });
      results.push(`Created/Updated ${s.slug}`);
    }

    // 2. COLEGIO
    // colegio-instalaciones -> Medio 34
    await prisma.seccion.upsert({
      where: { slug: 'colegio-instalaciones' },
      update: { medioId: 34 },
      create: {
        slug: 'colegio-instalaciones',
        pagina: 'colegio',
        orden: 10,
        tipo: 'MEDIA_UNICA', // Changed to valid Enum
        medioId: 34,
      },
    });
    results.push('Created/Updated colegio-instalaciones');

    await prisma.seccion.upsert({
      where: { slug: 'colegio-alianzas' },
      update: { grupoId: 7 },
      create: {
        slug: 'colegio-alianzas',
        pagina: 'colegio',
        orden: 20,
        tipo: 'GALERIA',
        grupoId: 7,
      },
    });
    results.push('Created/Updated colegio-alianzas');

    // 3. ACADEMICOS
    const academicosMedios = [
      { slug: 'academicos-kinder', medio: 1, order: 10 },
      { slug: 'academicos-primary', medio: 2, order: 20 },
      { slug: 'academicos-secondary', medio: 3, order: 30 },
    ];

    for (const s of academicosMedios) {
      await prisma.seccion.upsert({
        where: { slug: s.slug },
        update: { medioId: s.medio },
        create: {
          slug: s.slug,
          pagina: 'academicos',
          orden: s.order,
          tipo: 'MEDIA_UNICA',
          medioId: s.medio,
        },
      });
      results.push(`Created/Updated ${s.slug}`);
    }

    // 4. ACADEMICOS-MAS-INFO
    await prisma.seccion.upsert({
      where: { slug: 'academicos-mas-info-alianzas' },
      update: { grupoId: 7 },
      create: {
        slug: 'academicos-mas-info-alianzas',
        pagina: 'academicos-mas-info',
        orden: 10,
        tipo: 'GALERIA',
        grupoId: 7,
      },
    });
    results.push('Created/Updated academicos-mas-info-alianzas');

    // 5. VIDA-ESTUDIANTIL-MAS-INFO
    await prisma.seccion.upsert({
      where: { slug: 'vida-estudiantil-mas-info-alianzas' },
      update: { grupoId: 7 },
      create: {
        slug: 'vida-estudiantil-mas-info-alianzas',
        pagina: 'vida-estudiantil-mas-info',
        orden: 10,
        tipo: 'GALERIA',
        grupoId: 7,
      },
    });
    results.push('Created/Updated vida-estudiantil-mas-info-alianzas');

    return NextResponse.json({ results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to migrate' }, { status: 500 });
  }
}
