// src/app/api/disk-images/[...filePath]/route.ts
export const runtime = 'nodejs';

import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { lookup as mimeLookup } from 'mime-types';
import { PrismaClient } from '@prisma/client';
import { Readable } from 'node:stream';

import {
  IMAGE_PUBLIC_DIR,
  MEDIA_UPLOAD_DIR,
  tableForFolder,
  resolveFolderAlias,
} from '@/lib/adminConstants';

// Prisma singleton (sin exportar)
const g = globalThis as unknown as { prisma?: PrismaClient };
const prisma = g.prisma ?? new PrismaClient();
if (!g.prisma) g.prisma = prisma;

// Utils
function safeJoin(base: string, ...parts: string[]) {
  const decoded = parts.map((p) => decodeURIComponent(p));
  const full = path.resolve(base, ...decoded);
  const safeBase = path.resolve(base);
  if (!full.startsWith(safeBase + path.sep) && full !== safeBase) {
    throw new Error('BAD_PATH');
  }
  return full;
}

function guessMime(p: string): string {
  return (mimeLookup(p) as string) || 'application/octet-stream';
}

function resolveTable(folder: string): 'Medio' | 'GrupoMedios' | undefined {
  const direct = tableForFolder[folder] as 'Medio' | 'GrupoMedios' | undefined;
  if (direct) return direct;
  const alias = resolveFolderAlias(folder);
  return tableForFolder[alias] as 'Medio' | 'GrupoMedios' | undefined;
}

// Node Readable -> Web ReadableStream (sin any)
function toWebReadable(
  nodeStream: import('node:stream').Readable
): ReadableStream<Uint8Array> {
  const { toWeb } = Readable as unknown as {
    toWeb: (s: import('node:stream').Readable) => ReadableStream<Uint8Array>;
  };
  return toWeb(nodeStream);
}

/**
 * Acepta:
 *   /api/disk-images/images/medios/[...]
 *   /api/disk-images/images/medios/thumbs/[...]
 *   /api/disk-images/images/media/[...]         (alias aceptado → 'medios')
 *   /api/disk-images/uploads/media/[...]
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filePath: string[] }> }
) {
  try {
    const { filePath } = await context.params;
    const parts = filePath ?? [];
    if (parts.length < 2) {
      return NextResponse.json({ error: 'Ruta inválida' }, { status: 400 });
    }

    const root = parts[0]; // "images" | "uploads"
    let absPath: string;
    let contentType: string;

    if (root === 'images') {
      if (parts.length < 3) {
        return NextResponse.json({ error: 'Carpeta de imágenes no válida' }, { status: 400 });
      }

      const folderReq = parts[1];     // "medios" | "media"
      const rest = parts.slice(2);    // ["thumbs","file.webp"] | ["file.webp"]
      const fileName = rest[rest.length - 1];

      const tableName = resolveTable(folderReq);
      if (!tableName) {
        return NextResponse.json({ error: 'Carpeta no gestionada' }, { status: 404 });
      }

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

      const physicalFolder = resolveFolderAlias(folderReq); // normaliza 'media' -> 'medios'
      absPath = safeJoin(IMAGE_PUBLIC_DIR, physicalFolder, ...rest);
      contentType = guessMime(absPath);

    } else if (root === 'uploads') {
      if (parts[1] !== 'media' || parts.length < 3) {
        return NextResponse.json({ error: 'Subcarpeta de uploads no permitida' }, { status: 404 });
      }

      const rest = parts.slice(2); // bajo /uploads/media
      const fileName = rest[rest.length - 1];

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

    if (!existsSync(absPath)) {
      return NextResponse.json({ error: 'Fichero no encontrado' }, { status: 404 });
    }
    const st = statSync(absPath);
    if (!st.isFile()) {
      return NextResponse.json({ error: 'No es un archivo' }, { status: 404 });
    }

    const etag = `W/"${st.size}-${Number(st.mtimeMs).toString(36)}"`;
    const baseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Last-Modified': st.mtime.toUTCString(),
      ETag: etag,
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
        const nodeStream = createReadStream(absPath, { start, end });
        return new Response(toWebReadable(nodeStream), { status: 206, headers });
      }
    }

    const headers = { ...baseHeaders, 'Content-Length': String(st.size) };
    const nodeStream = createReadStream(absPath);
    return new Response(toWebReadable(nodeStream), { status: 200, headers });

  } catch (e) {
    if (e instanceof Error && e.message === 'BAD_PATH') {
      return NextResponse.json({ error: 'Bad path' }, { status: 400 });
    }
    // eslint-disable-next-line no-console
    console.error('disk-images error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export const HEAD = GET;
