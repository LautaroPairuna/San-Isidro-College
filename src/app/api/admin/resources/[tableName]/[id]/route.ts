// src/app/api/admin/resources/[tableName]/[id]/route.ts
export const runtime = 'nodejs'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient }              from '@prisma/client'
import fs                           from 'fs/promises'
import path                         from 'path'
import slugify                      from 'slugify'
import sharp                        from 'sharp'
import { folderNames }              from '@/lib/adminConstants'

const prisma = new PrismaClient()

const models: Record<string, any> = {
  GrupoMedios: prisma.grupoMedios,
  Medio:       prisma.medio,
}

const FILE_FIELD     = 'urlArchivo'
const BOOLEAN_FIELDS = [] as const

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
 * GET /api/admin/resources/[tableName]/[id]
 * Devuelve un solo registro por ID.
 */
export async function GET(
  _req: NextRequest,
  { params }: any
) {
  const { tableName, id } = params
  const model             = models[tableName]

  if (!model) {
    return NextResponse.json(
      { error: `Recurso “${tableName}” no existe` },
      { status: 404 }
    )
  }

  const key = isNaN(+id) ? id : +id

  try {
    const item = await model.findUnique({ where: { id: key } })
    return NextResponse.json(item)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Error al leer registro' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/resources/[tableName]/[id]
 * Actualiza un registro. Si se envía un archivo, lo procesa igual que en POST.
 */
export async function PUT(
  req: NextRequest,
  { params }: any
) {
  const { tableName, id } = params
  const model = models[tableName]

  if (!model) {
    return NextResponse.json(
      { error: `Recurso “${tableName}” no existe` },
      { status: 404 },
    )
  }

  const key = isNaN(+id) ? id : +id
  const existing = await model.findUnique({ where: { id: key } })

  const ct = req.headers.get('content-type') || ''

  let data: Record<string, any> = {}
  let file: Blob | null = null

  // ─── 1) Parsear body ───────────────────────────────────
  if (ct.includes('multipart/form-data')) {
    const form = await req.formData()
    for (const [k, v] of form.entries()) {
      if (k === FILE_FIELD && isFileLike(v)) {
        file = v as Blob
      } else if (typeof v === 'string') {
        data[k] = /^\d+$/.test(v) ? Number(v) : v
      }
    }
    normalizeBooleans(data)
  } else {
    data = await req.json()
    for (const k in data) {
      if (typeof data[k] === 'string' && /^\d+$/.test(data[k])) {
        data[k] = Number(data[k])
      }
    }
    normalizeBooleans(data)
  }

  // ─── 2) Procesar archivo nuevo (si existe) ───────────────
  if (file) {
    const baseDir = path.join(process.cwd(), 'public', 'images')
    const keyDir  = folderNames[tableName]
    const dir     = path.join(baseDir, keyDir)
    const thumbs  = path.join(dir, 'thumbs')

    // 2.a) Eliminar archivos antiguos (si existían)
    if (existing?.[FILE_FIELD]) {
      await fs.rm(path.join(dir, existing[FILE_FIELD]), { force: true }).catch(() => {})
      await fs.rm(path.join(thumbs, existing[FILE_FIELD]), { force: true }).catch(() => {})
    }

    await fs.mkdir(dir,    { recursive: true })
    await fs.mkdir(thumbs, { recursive: true })

    const hintBase =
      typeof data.nombreArchivo === 'string' && data.nombreArchivo.trim() !== ''
        ? String(data.nombreArchivo)
        : data.textoAlternativo ?? tableName
    const slug = slugify(hintBase, { lower: true, strict: true })
    const timestamp = makeTimestamp()

    const originalName = (file as any).name as string
    const ext = path.extname(originalName).toLowerCase()
    const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    const svgExts   = ['.svg']

    // ─── 2.a) Si es SVG → guardarlo tal cual ───────────────────
    if (svgExts.includes(ext)) {
      const outName = `${slug}-${timestamp}.svg`
      const buf     = Buffer.from(await file.arrayBuffer())
      await fs.writeFile(path.join(dir, outName), buf)

      data.urlArchivo = outName
      data.urlMiniatura = null
      data.tipo = 'ICONO'
    }
    // ─── 2.b) Si es video → guardarlo sin procesar ─────────────
    else if (videoExts.includes(ext)) {
      const outName = `${slug}-${timestamp}${ext}`
      const buf     = Buffer.from(await file.arrayBuffer())
      await fs.writeFile(path.join(dir, outName), buf)

      data.urlArchivo = outName
      data.tipo = 'VIDEO'
    }
    // ─── 2.c) Si es imagen → convertir a WebP ───────────────────
    else {
      const outName = `${slug}-${timestamp}.webp`
      const buf     = Buffer.from(await file.arrayBuffer())

      // Guardar original WebP
      await sharp(buf).webp().toFile(path.join(dir, outName))
      // Generar thumbnail 200px
      await sharp(buf).resize(200).webp().toFile(path.join(thumbs, outName))

      data.urlArchivo = outName
      data.urlMiniatura = outName
      data.tipo = 'IMAGEN'
    }
  }

  delete data.nombreArchivo

  // ─── 3) Actualizar registro en Prisma ───────────────────────
  try {
    const updated = await model.update({
      where: { id: key },
      data,
    })
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Error al actualizar registro' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/resources/[tableName]/[id]
 * Elimina el registro y borra el archivo físico (imagen/svg/video + thumb si existe).
 */
export async function DELETE(
  _req: NextRequest,
  { params }: any
) {
  const { tableName, id } = params
  const model             = models[tableName]

  if (!model) {
    return NextResponse.json(
      { error: `Recurso “${tableName}” no existe` },
      { status: 404 }
    )
  }

  const key      = isNaN(+id) ? id : +id
  const existing = await model.findUnique({ where: { id: key } })

  if (existing?.[FILE_FIELD]) {
    const baseDir = path.join(process.cwd(), 'public', 'images')
    const keyDir  = folderNames[tableName]
    const dir     = path.join(baseDir, keyDir)
    const thumbs  = path.join(dir, 'thumbs')

    await fs.rm(path.join(dir, existing[FILE_FIELD]), { force: true }).catch(() => {})
    await fs.rm(path.join(thumbs, existing[FILE_FIELD]), { force: true }).catch(() => {})
  }

  try {
    await model.delete({ where: { id: key } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Error al eliminar registro' },
      { status: 500 }
    )
  }
}
