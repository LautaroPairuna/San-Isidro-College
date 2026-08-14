import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import type { SeccionTipo, TipoGrupoMedios, TipoMedio } from '@/generated/prisma/client';

export const dynamic = 'force-dynamic';

/**
 * Alta de las secciones y grupos que faltaban para que las páginas nuevas sean
 * editables desde el admin: las fotos de Educación personalizada (Colegio), los
 * íconos de Propósitos (Proyecto bilingüe), las fotos de El valor del juego
 * (Inicial) y las fotos e íconos de Primaria.
 *
 * Es idempotente y conservador: si la sección o el grupo ya existen, no pisa lo
 * que haya cargado el admin. Los medios solo se crean cuando el grupo está
 * vacío, así una segunda corrida nunca duplica ni reemplaza lo subido.
 *
 * Los archivos son los mismos que hoy usa el sitio como respaldo, para que al
 * abrir el admin se vea el estado actual y solo haya que reemplazarlos.
 */

type MedioSeed = {
  urlArchivo: string
  textoAlternativo: string
  tipo: TipoMedio
}

type GrupoSeed = {
  nombre: string
  tipoGrupo: TipoGrupoMedios
  medios: MedioSeed[]
}

type SeccionSeed = {
  slug: string
  pagina: string
  orden: number
  tipo: SeccionTipo
  titulo: string
  grupo: GrupoSeed
}

const SECCIONES: SeccionSeed[] = [
  // ── Home: los invitamos a conocernos ──────────────────────────────────
  {
    slug: 'home-conocernos',
    pagina: 'home',
    orden: 60,
    tipo: 'MEDIA_UNICA',
    titulo: 'Los invitamos a conocernos - Foto',
    grupo: {
      nombre: 'Home - Los Invitamos a Conocernos',
      tipoGrupo: 'UNICO',
      medios: [
        {
          urlArchivo: 'fondo-bienvenida.webp',
          textoAlternativo: 'Los invitamos a conocernos',
          tipo: 'IMAGEN',
        },
      ],
    },
  },

  // ── Colegio: educación personalizada ──────────────────────────────────
  {
    slug: 'colegio-personalizada-1',
    pagina: 'colegio',
    orden: 30,
    tipo: 'MEDIA_UNICA',
    titulo: 'Educación personalizada - Foto 1',
    grupo: {
      nombre: 'Colegio - Educacion Personalizada 1',
      tipoGrupo: 'UNICO',
      medios: [
        {
          urlArchivo: 'image-bienvenida-20250602-232317.webp',
          textoAlternativo: 'Educación personalizada 1',
          tipo: 'IMAGEN',
        },
      ],
    },
  },
  {
    slug: 'colegio-personalizada-2',
    pagina: 'colegio',
    orden: 40,
    tipo: 'MEDIA_UNICA',
    titulo: 'Educación personalizada - Foto 2',
    grupo: {
      nombre: 'Colegio - Educacion Personalizada 2',
      tipoGrupo: 'UNICO',
      medios: [
        {
          urlArchivo: 'foto-estudiantil-20250603-005440.webp',
          textoAlternativo: 'Educación personalizada 2',
          tipo: 'IMAGEN',
        },
      ],
    },
  },

  // ── Proyecto bilingüe: íconos de Nuestros Propósitos ──────────────────
  {
    slug: 'academicos-mas-info-propositos',
    pagina: 'academicos-mas-info',
    orden: 30,
    tipo: 'GALERIA',
    titulo: 'Iconos Nuestros Propósitos',
    grupo: {
      nombre: 'Academicos Mas Info - Iconos Propositos',
      tipoGrupo: 'GALERIA',
      medios: [
        { urlArchivo: 'brindar-contacto-proposito.svg', textoAlternativo: 'Contacto cotidiano con el inglés', tipo: 'ICONO' },
        { urlArchivo: 'favorecer-comprension-proposito.svg', textoAlternativo: 'Comprensión y expresión', tipo: 'ICONO' },
        { urlArchivo: 'promover-idioma-proposito.svg', textoAlternativo: 'Uso del idioma', tipo: 'ICONO' },
        { urlArchivo: 'utilizar-ingles-proposito.svg', textoAlternativo: 'El inglés como medio de acceso', tipo: 'ICONO' },
        { urlArchivo: 'fortalecer-confianza-proposito.svg', textoAlternativo: 'Confianza y autonomía', tipo: 'ICONO' },
        { urlArchivo: 'articular-lengua-proposito.svg', textoAlternativo: 'Articulación con el currículo', tipo: 'ICONO' },
        { urlArchivo: 'ampliar-comprension-proposito.svg', textoAlternativo: 'Otras culturas', tipo: 'ICONO' },
        { urlArchivo: 'brindar-herramientas-proposito.svg', textoAlternativo: 'Herramientas para contextos globales', tipo: 'ICONO' },
      ],
    },
  },

  // ── Inicial: el valor del juego ───────────────────────────────────────
  {
    slug: 'kindergarden-juego-1',
    pagina: 'kindergarden',
    orden: 10,
    tipo: 'MEDIA_UNICA',
    titulo: 'El valor del juego - Foto 1',
    grupo: {
      nombre: 'Kindergarden - Valor del Juego 1',
      tipoGrupo: 'UNICO',
      medios: [
        {
          urlArchivo: 'banner-kindergarten-20250602-210920.webp',
          textoAlternativo: 'El valor del juego 1',
          tipo: 'IMAGEN',
        },
      ],
    },
  },
  {
    slug: 'kindergarden-juego-2',
    pagina: 'kindergarden',
    orden: 20,
    tipo: 'MEDIA_UNICA',
    titulo: 'El valor del juego - Foto 2',
    grupo: {
      nombre: 'Kindergarden - Valor del Juego 2',
      tipoGrupo: 'UNICO',
      medios: [
        {
          urlArchivo: 'foto-isidro-play-20250603-005601.webp',
          textoAlternativo: 'El valor del juego 2',
          tipo: 'IMAGEN',
        },
      ],
    },
  },

  // ── Primaria: literatura, aprendizajes y tarjetas ─────────────────────
  {
    slug: 'primary-literatura',
    pagina: 'primary',
    orden: 10,
    tipo: 'MEDIA_UNICA',
    titulo: 'La literatura como punto de partida - Foto',
    grupo: {
      nombre: 'Primary - Literatura',
      tipoGrupo: 'UNICO',
      medios: [
        {
          urlArchivo: 'banner-primary-20250602-202252.webp',
          textoAlternativo: 'La literatura como punto de partida',
          tipo: 'IMAGEN',
        },
      ],
    },
  },
  {
    slug: 'primary-aprendizajes',
    pagina: 'primary',
    orden: 20,
    tipo: 'MEDIA_UNICA',
    titulo: 'Aprendizajes significativos - Foto',
    grupo: {
      nombre: 'Primary - Aprendizajes',
      tipoGrupo: 'UNICO',
      medios: [
        {
          urlArchivo: 'foto-estudiantil-2-20250603-005502.webp',
          textoAlternativo: 'Aprendizajes significativos',
          tipo: 'IMAGEN',
        },
      ],
    },
  },
  {
    // Un solo grupo con los cinco íconos y las cinco fotos: la página toma unos
    // y otras por tipo, como ya hacían las tarjetas del proyecto de vida.
    slug: 'primary-ejes',
    pagina: 'primary',
    orden: 30,
    tipo: 'GALERIA',
    titulo: 'Ejes transversales - Iconos y fotos',
    grupo: {
      nombre: 'Primary - Ejes Transversales',
      tipoGrupo: 'GALERIA',
      medios: [
        { urlArchivo: 'competencia-comunicativa-primary-card.svg', textoAlternativo: 'Competencia comunicativa', tipo: 'ICONO' },
        { urlArchivo: 'alfabetizacion-primary-card.svg', textoAlternativo: 'Alfabetización científica y tecnológica', tipo: 'ICONO' },
        { urlArchivo: 'resolucion-problemas-primary-card.svg', textoAlternativo: 'Resolución de problemas', tipo: 'ICONO' },
        { urlArchivo: 'formacion-personal-primary-card.svg', textoAlternativo: 'Formación personal, social y ciudadana global', tipo: 'ICONO' },
        { urlArchivo: 'sustentabilidad-primary-card.svg', textoAlternativo: 'Educación para la Sustentabilidad', tipo: 'ICONO' },
        { urlArchivo: 'banner-primary-20250602-202252.webp', textoAlternativo: 'Competencia comunicativa', tipo: 'IMAGEN' },
        { urlArchivo: 'foto-balance-1-20260217-194502.webp', textoAlternativo: 'Alfabetización científica y tecnológica', tipo: 'IMAGEN' },
        { urlArchivo: 'foto-estudiantil-20250603-005440.webp', textoAlternativo: 'Resolución de problemas', tipo: 'IMAGEN' },
        { urlArchivo: 'foto-hockey-20250603-005057.webp', textoAlternativo: 'Formación personal, social y ciudadana global', tipo: 'IMAGEN' },
        { urlArchivo: 'foto-balance-3-20260217-194614.webp', textoAlternativo: 'Educación para la Sustentabilidad', tipo: 'IMAGEN' },
      ],
    },
  },
  // ── Secundaria: tarjetas de "Una formación que trasciende el aula" ────
  {
    // Las fotos ya estaban cargadas en el grupo de las tarjetas del proyecto de
    // vida, que es el mismo contenido. Acá solo se engancha la sección: por eso
    // no lleva medios, para no duplicar lo que ya existe.
    slug: 'secondary-formacion',
    pagina: 'secondary',
    orden: 10,
    tipo: 'GALERIA',
    titulo: 'Una formación que trasciende el aula - Fotos',
    grupo: {
      nombre: 'Academicos Mas Info - Cards Proyecto de Vida',
      tipoGrupo: 'GALERIA',
      medios: [],
    },
  },
]

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results: string[] = [];

    for (const seccion of SECCIONES) {
      // 1) Grupo (por nombre, que es como se lo identifica en el admin)
      let grupo = await prisma.grupoMedios.findUnique({
        where: { nombre: seccion.grupo.nombre },
        include: { medios: true },
      });

      if (!grupo) {
        grupo = await prisma.grupoMedios.create({
          data: { nombre: seccion.grupo.nombre, tipoGrupo: seccion.grupo.tipoGrupo },
          include: { medios: true },
        });
        results.push(`Grupo creado: ${seccion.grupo.nombre}`);
      }

      // 2) Medios: solo si el grupo está vacío, para no tocar lo ya subido
      if (seccion.grupo.medios.length === 0) {
        results.push(`Medios: ${seccion.grupo.nombre} se deja como está`);
      } else if (grupo.medios.length === 0) {
        await prisma.medio.createMany({
          data: seccion.grupo.medios.map((medio, i) => ({
            urlArchivo: medio.urlArchivo,
            textoAlternativo: medio.textoAlternativo,
            tipo: medio.tipo,
            posicion: (i + 1) * 10,
            grupoMediosId: grupo!.id,
          })),
        });
        results.push(`Medios creados: ${seccion.grupo.nombre} (${seccion.grupo.medios.length})`);
      } else {
        results.push(`Medios sin cambios: ${seccion.grupo.nombre} (ya tiene ${grupo.medios.length})`);
      }

      // 3) Sección
      const existente = await prisma.seccion.findUnique({ where: { slug: seccion.slug } });
      const primerMedio = await prisma.medio.findFirst({
        where: { grupoMediosId: grupo.id },
        orderBy: { posicion: 'asc' },
      });

      const asignacion =
        seccion.tipo === 'MEDIA_UNICA'
          ? { medioId: primerMedio?.id ?? null, grupoId: null }
          : { grupoId: grupo.id, medioId: null };

      if (existente) {
        await prisma.seccion.update({
          where: { slug: seccion.slug },
          data: {
            pagina: seccion.pagina,
            orden: seccion.orden,
            tipo: seccion.tipo,
            titulo: seccion.titulo,
            // Respeta lo que ya esté asignado a mano desde el admin
            grupoId: existente.grupoId ?? asignacion.grupoId,
            medioId: existente.medioId ?? asignacion.medioId,
          },
        });
        results.push(`Sección actualizada: ${seccion.slug}`);
      } else {
        await prisma.seccion.create({
          data: {
            slug: seccion.slug,
            pagina: seccion.pagina,
            orden: seccion.orden,
            tipo: seccion.tipo,
            titulo: seccion.titulo,
            ...asignacion,
          },
        });
        results.push(`Sección creada: ${seccion.slug}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Secciones y grupos de medios editables listos',
      results,
    });
  } catch (error) {
    console.error('Error en setup-medios-editables:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
