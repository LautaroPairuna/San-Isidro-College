// src/app/api/disk-images/[...filePath]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { lookup as mimeLookup } from 'mime-types'

import { PrismaClient } from '@prisma/client'

import {
  tableForFolder,
  IMAGE_PUBLIC_DIR,
} from '@/lib/adminConstants'

const prisma = new PrismaClient()

/**
 * GET /api/disk-images/<folder>/<...path>
 *
 * Sirve archivos estáticos desde public/images/<folder>/[...path],
 * pero solo si existe un registro en la tabla correspondiente
 * (obtenida a partir de tableForFolder).
 *
 * Ejemplos válidos:
 *   GET /api/disk-images/media/logo-2025-06-01.webp
 *   GET /api/disk-images/media/thumbs/logo-2025-06-01.webp
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ filePath: string[] }> }
) {
  // 1) Extraer los segmentos de la ruta: 
  //    p. ej. ["media", "logo.webp"] o ["media","thumbs","logo.webp"]
  const { filePath: parts } = await context.params

  if (parts.length < 2) {
    return NextResponse.json({ error: 'Ruta inválida' }, { status: 400 })
  }

  const folder = parts[0]             // ej. "media"
  const rest = parts.slice(1)         // ej. ["logo.webp"] o ["thumbs","logo.webp"]
  const fileName = rest[rest.length - 1] // ej. "logo.webp"
  // Construimos la ruta relativa POSIX: "media/logo.webp" o "media/thumbs/logo.webp"
  const relPath = path.posix.join(folder, ...rest)

  // 2) Determinar la tabla Prisma a partir de la carpeta
  //    tableForFolder debe mapear "media" -> "Medio"
  const tableName = tableForFolder[folder]
  if (!tableName) {
    return NextResponse.json({ error: 'Carpeta no gestionada' }, { status: 404 })
  }

  // 3) Verificar en BD que exista un registro 
  //    con ese fileName en los campos correctos (urlArchivo / urlMiniatura)
  const isThumb = rest[0] === 'thumbs'
  let registro: { id: number } | null = null

  if (tableName === 'Medio') {
    if (isThumb) {
      // Si es thumbnail, buscamos en urlMiniatura
      registro = await prisma.medio.findFirst({
        where: { urlMiniatura: { endsWith: fileName } },
        select: { id: true },
      })
    } else {
      // Si es original, buscamos en urlArchivo
      registro = await prisma.medio.findFirst({
        where: { urlArchivo: { endsWith: fileName } },
        select: { id: true },
      })
    }
  } else {
    // Si en el futuro agregas más mapeos en tableForFolder, incluir aquí
    return NextResponse.json({ error: 'Recurso no disponible' }, { status: 404 })
  }

  if (!registro) {
    return NextResponse.json({ error: 'Archivo no registrado en BD' }, { status: 404 })
  }

  // 4) Construir la ruta absoluta en disco: public/images/<relPath>
  const absPath = path.join(IMAGE_PUBLIC_DIR, relPath)

  try {
    await fs.access(absPath)
  } catch {
    return NextResponse.json({ error: 'Fichero no encontrado' }, { status: 404 })
  }

  // 5) Leer el buffer y devolverlo con el MIME adecuado
  const fileBuffer = await fs.readFile(absPath)
  const contentType = mimeLookup(absPath) || 'application/octet-stream'
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
