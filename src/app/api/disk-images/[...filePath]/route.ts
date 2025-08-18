export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { lookup as mimeLookup } from 'mime-types';
import { PrismaClient } from '@prisma/client';

import {
  IMAGE_PUBLIC_DIR,   // p.ej. /app/public/images
  MEDIA_UPLOAD_DIR,   // p.ej. /app/public/uploads/media
  tableForFolder,     // { medios: "Medio", grupos: "GrupoMedios" }
} from '@/lib/adminConstants';

// ───────────────── Prisma singleton ─────────────────
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (!g.prisma) g.prisma = prisma;

// Utilidad: evita traversal tipo ../../
function safeJoin(base: string, ...parts: string[]) {
  const decoded = parts.map((p) => decodeURIComponent(p));
  const full = path.resolve(base, ...decoded);
  const safeBase = path.resolve(base);
  if (!full.startsWith(safeBase + path.sep) && full !== safeBase) {
    throw new Error('BAD_PATH');
  }
  return full;
}

function guessMime(p: string) {
  return (mimeLookup(p) as string) || 'application/octet-stream';
}

// Alias para soportar "media" (singular) → carpeta física "medios"
const IMAGES_FOLDER_ALIASES: Record<string, string> = {
  medios: 'medios',
  media: 'medios',
};

// Mapea carpeta → tabla Prisma (tolerante a media/medios)
function resolveTableForFolder(folder: string): 'Medio' | 'GrupoMedios' | undefined {
  // Primero, lo que venga de adminConstants
  const direct = tableForFolder[folder] as 'Medio' | 'GrupoMedios' | undefined;
  if (direct) return direct;
  // Alias comunes
  if (folder === 'media' || folder === 'medios') return 'Medio';
  return undefined;
}

/**
 * Soporta:
 *   /api/disk-images/images/medios/[...]
 *   /api/disk-images/images/medios/thumbs/[...]
 *   /api/disk-images/images/media/[...]
 *   /api/disk-images/uploads/media/[...]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { filePath: string[] } }
) {
  try {
    const parts = params?.filePath ?? [];
    if (parts.length < 2) {
      return NextResponse.json({ error: 'Ruta inválida' }, { status: 400 });
    }

    const root = parts[0]; // "images" | "uploads"

    let absPath: string;
    let contentType: string;

    if (root === 'images') {
      // Esperamos: images / <folder> / [...rest]
      if (parts.length < 3) {
        return NextResponse.json({ error: 'Carpeta de imágenes no válida' }, { status: 400 });
      }

      const folderReq = parts[1];       // "medios" | "media"
      const rest = parts.slice(2);      // ["thumbs","file.webp"] | ["file.webp"]
      const fileName = rest[rest.length - 1];

      const tableName = resolveTableForFolder(folderReq);
      if (!tableName) {
        return NextResponse.json({ error: 'Carpeta no gestionada' }, { status: 404 });
      }

      // Validación en BD SOLO para archivos de 'Medio'
      if (tableName === 'Medio') {
        const isThumb = rest[0] === 'thumbs';
        const where = isThumb
          ? { urlMiniatura: { endsWith: fileName } }
          : { urlArchivo:   { endsWith: fileName } };
        const exists = await prisma.medio.findFirst({ where, select: { id: true } });
        if (!exists) {
          return NextResponse.json({ error: 'Archivo no registrado en BD' }, { status: 404 });
        }
      }

      // Carpeta física (alias media → medios)
      const physicalFolder = IMAGES_FOLDER_ALIASES[folderReq] || folderReq;
      absPath = safeJoin(IMAGE_PUBLIC_DIR, physicalFolder, ...rest);
      contentType = guessMime(absPath);

    } else if (root === 'uploads') {
      // Esperamos: uploads / media / [...rest]
      if (parts[1] !== 'media' || parts.length < 3) {
        return NextResponse.json({ error: 'Subcarpeta de uploads no permitida' }, { status: 404 });
      }

      const rest = parts.slice(2); // bajo /uploads/media
      const fileName = rest[rest.length - 1];

      // Validación en BD (Medio). Soporta que urlArchivo tenga basename o ruta completa.
      const exists = await prisma.medio.findFirst({
        where: {
          OR: [
            { urlArchivo:   { endsWith: fileName } },
            { urlMiniatura: { endsWith: fileName } },
          ],
        },
        select: { id: true },
      });
      if (!exists) {
        return NextResponse.json({ error: 'Archivo no registrado en BD' }, { status: 404 });
      }

      absPath = safeJoin(MEDIA_UPLOAD_DIR, ...rest);
      contentType = guessMime(absPath);

    } else {
      return NextResponse.json({ error: 'Raíz no soportada' }, { status: 404 });
    }

    // ── FS
    if (!existsSync(absPath)) {
      return NextResponse.json({ error: 'Fichero no encontrado' }, { status: 404 });
    }
    const st = statSync(absPath);
    if (!st.isFile()) {
      return NextResponse.json({ error: 'No es un archivo' }, { status: 404 });
    }

    // ── Cache + Range
    const etag = `W/"${st.size}-${Number(st.mtimeMs).toString(36)}"`;
    const baseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Last-Modified': st.mtime.toUTCString(),
      'ETag': etag,
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    const inm = req.headers.get('if-none-match');
    if (inm && inm === etag) {
      return new NextResponse(null, { status: 304, headers: baseHeaders });
    }

    const range = req.headers.get('range');
    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (m) {
        const size = st.size;
        const start = m[1] ? Math.min(parseInt(m[1], 10), size - 1) : 0;
        const end = m[2] ? Math.min(parseInt(m[2], 10), size - 1) : size - 1;
        const chunk = end - start + 1;

        const headers = {
          ...baseHeaders,
          'Content-Range': `bytes ${start}-${end}/${size}`,
          'Content-Length': String(chunk),
        };
        const stream = createReadStream(absPath, { start, end });
        return new Response(stream as any, { status: 206, headers });
      }
    }

    const headers = { ...baseHeaders, 'Content-Length': String(st.size) };
    const stream = createReadStream(absPath);
    return new Response(stream as any, { status: 200, headers });

  } catch (e: any) {
    if (e?.message === 'BAD_PATH') {
      return NextResponse.json({ error: 'Bad path' }, { status: 400 });
    }
    console.error('disk-images error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export const HEAD = GET;
