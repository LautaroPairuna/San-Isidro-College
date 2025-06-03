// src/app/api/admin/resources/[tableName]/route.ts
export const runtime = 'nodejs'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import slugify from 'slugify'
import sharp from 'sharp'
import { folderNames } from '@/lib/adminConstants'

const prisma = new PrismaClient()

/**
 * Mapeo dinámico de nombres a modelos Prisma.
 * Deben coincidir exactamente con los modelos en schema.prisma
 */
const models: Record<string, any> = {
  GrupoMedios: prisma.grupoMedios,
  Medio:       prisma.medio,
}

const BOOLEAN_FIELDS = [] as const
const FILE_FIELD     = 'urlArchivo' // debe coincidir con el campo en Prism

function isFileLike(v: unknown): v is Blob {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as Blob).arrayBuffer === 'function'
  )
}

function normalizeBooleans(obj: Record<string, unknown>) {
  for (const key of BOOLEAN_FIELDS) {
    if (key in obj) {
      const v = obj[key]
      obj[key] = v === true || v === 'true' || v === '1' || v === 1
    }
  }
}

function makeTimestamp() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    '-' +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  )
}

/**
 * GET /api/admin/resources/[tableName]
 * Devuelve todos los registros de la tabla dinámica.
 */
export async function GET(
  _req: NextRequest,
  { params }: any
) {
  const { tableName } = params
  const model = models[tableName]

  if (!model) {
    return NextResponse.json(
      { error: `Recurso “${tableName}” no existe` },
      { status: 404 }
    )
  }

  try {
    // <-- aquí debe ir findMany(), no findUnique
    const all = await model.findMany()
    return NextResponse.json(all)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Error al leer datos' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/resources/[tableName]
 * Crea un nuevo registro en la tabla dinámica.
 * Si se envía un archivo, lo procesa según su extensión:
 *  - .svg → se guarda tal cual (vector, sin conversión).
 *  - .mp4/.mov/... → se guarda tal cual (video).
 *  - cualquier otra extensión → convierte a WebP (imagen + thumb).
 */
export async function POST(
  req: NextRequest,
  { params }: any
) {
  const { tableName } = params
  const model         = models[tableName]

  if (!model) {
    return NextResponse.json(
      { error: `Recurso “${tableName}” no existe` },
      { status: 404 }
    )
  }

  const ct: string = req.headers.get('content-type') || ''
  let data: Record<string, any> = {}
  let file: Blob | null = null

  if (ct.includes('multipart/form-data')) {
    // ─── 1) Parsear formData ─────────────────────────
    const form = await req.formData()

    for (const [k, v] of form.entries()) {
      if (k === FILE_FIELD && isFileLike(v)) {
        file = v as Blob
      } else if (typeof v === 'string') {
        data[k] = /^\d+$/.test(v) ? Number(v) : v
      }
    }

    // 2) Extraer nombreArchivo personalizado y eliminarlo de data
    const nombreArchivoCustom = (data.nombreArchivo as string | undefined) ?? undefined
    delete data.nombreArchivo

    // 3) Normalizar booleanos (si existieran)
    normalizeBooleans(data)

    if (file) {
      // ─── 2) Procesar archivo según su extensión ─────────────────
      const baseDir = path.join(process.cwd(), 'public', 'images')
      const key     = folderNames[tableName] || tableName.toLowerCase()
      const dir     = path.join(baseDir, key)
      const thumbs  = path.join(dir, 'thumbs')

      await fs.mkdir(dir,    { recursive: true })
      await fs.mkdir(thumbs, { recursive: true })

      // Hint para slug: nombreArchivoCustom > data.nombre > data.textoAlternativo > tableName
      const hint =
        typeof nombreArchivoCustom === 'string' && nombreArchivoCustom.trim() !== ''
          ? nombreArchivoCustom
          : data.nombre ?? data.textoAlternativo ?? tableName
      const slug = slugify(String(hint), { lower: true, strict: true })
      const timestamp = makeTimestamp()

      // Extensión real del archivo
      const originalName = (file as any).name as string
      const ext         = path.extname(originalName).toLowerCase()
      const videoExts   = ['.mp4', '.mov', '.avi', '.mkv', '.webm']
      const svgExts     = ['.svg']

      // —— Validación de grupo “UNICO” (solo para “Medio”) ——
      if (tableName === 'Medio') {
        const grupoPadre = await prisma.grupoMedios.findUnique({
          where: { id: Number(data.grupoMediosId) },
          select: { tipoGrupo: true },
        })
        if (grupoPadre?.tipoGrupo === 'UNICO') {
          const existingCount = await prisma.medio.count({
            where: { grupoMediosId: Number(data.grupoMediosId) },
          })
          if (existingCount >= 1) {
            return NextResponse.json(
              { error: 'Este grupo es “UNICO” y ya contiene un medio.' },
              { status: 400 }
            )
          }
        }
      }

      // ─── 2.a) Si es SVG → guardarlo tal cual ────────────────────
      if (svgExts.includes(ext)) {
        const outName = `${slug}-${timestamp}.svg`
        const buf     = Buffer.from(await file.arrayBuffer())
        await fs.writeFile(path.join(dir, outName), buf)

        data[FILE_FIELD] = outName
        data.urlMiniatura = null
        data.tipo = 'ICONO'

      }
      // ─── 2.b) Si es video → guardarlo sin procesar ─────────────
      else if (videoExts.includes(ext)) {
        const outName = `${slug}-${timestamp}${ext}`
        const buf     = Buffer.from(await file.arrayBuffer())
        await fs.writeFile(path.join(dir, outName), buf)

        data[FILE_FIELD] = outName
        data.tipo = 'VIDEO'

      }
      // ─── 2.c) Si es imagen (PNG/JPG/etc.) → convertir a WebP ───
      else {
        const outName = `${slug}-${timestamp}.webp`
        const buf     = Buffer.from(await file.arrayBuffer())

        // Guardar original como WebP
        await sharp(buf).webp().toFile(path.join(dir, outName))
        // Generar thumbnail 200px
        await sharp(buf).resize(200).webp().toFile(path.join(thumbs, outName))

        data[FILE_FIELD] = outName
        data.urlMiniatura = outName
        data.tipo = 'IMAGEN'
      }
    }
  } else {
    // ─── JSON simple (sin archivos) ─────────────────────────────
    data = await req.json()
    delete data.id
    for (const k in data) {
      if (typeof data[k] === 'string' && /^\d+$/.test(data[k])) {
        data[k] = Number(data[k])
      }
    }
    normalizeBooleans(data)
  }

  // ─── 3) Crear registro en Prisma ─────────────────────────────
  try {
    const created = await model.create({ data })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Error al crear registro' },
      { status: 500 }
    )
  }
}
