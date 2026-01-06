export const runtime = 'nodejs'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient }              from '@prisma/client'
import fs                            from 'fs/promises'
import path                          from 'path'
import slugify                       from 'slugify'
import sharp                         from 'sharp'
import { folderNames, type PrismaTable }               from '@/lib/adminConstants'

const prisma = new PrismaClient()

const models: Record<string, any> = {
  GrupoMedios: prisma.grupoMedios,
  Medio:       prisma.medio,
}

const FILE_FIELD = 'urlArchivo'
const BOOLEAN_FIELDS: readonly string[] = []

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

/* ─────────────── GET: uno por ID ─────────────── */
export async function GET(_req: NextRequest, { params }: any) {
  // Next.js 15: params es asincrónico y debe ser awaited
  const { tableName, id } = await params
  const model = models[tableName]

  if (!model) {
    return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 })
  }

  const key = isNaN(+id) ? id : +id
  try {
    const item = await model.findUnique({ where: { id: key } })
    return NextResponse.json(item)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al leer registro' }, { status: 500 })
  }
}

/* ─────────────── PUT: actualizar ─────────────── */
export async function PUT(req: NextRequest, { params }: any) {
  // Next.js 15: params es asincrónico y debe ser awaited
  const { tableName, id } = await params
  const model = models[tableName]

  if (!model) {
    return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 })
  }

  const key = isNaN(+id) ? id : +id
  const existing = await model.findUnique({ where: { id: key } })

  const ct = req.headers.get('content-type') || ''
  let data: Record<string, any> = {}
  const files: Record<string, Blob> = {}

  if (ct.includes('multipart/form-data')) {
    const form = await req.formData()
    for (const [k, v] of form.entries()) {
      if (isFileLike(v)) {
        files[k] = v as Blob
      } else if (typeof v === 'string') {
        data[k] = /^\d+$/.test(v) ? Number(v) : v
      }
    }
    normalizeBooleans(data)
  } else {
    data = await req.json()
    for (const k in data) {
      if (typeof data[k] === 'string' && /^\d+$/.test(data[k])) data[k] = Number(data[k])
    }
    normalizeBooleans(data)
  }

  /* Directorios comunes */
  const baseDir = path.join(process.cwd(), 'public', 'images')
  const tbl: PrismaTable = tableName === 'GrupoMedios' ? 'GrupoMedios' : 'Medio'
  const keyDir = folderNames[tbl]
  const dir     = path.join(baseDir, keyDir)
  const thumbs  = path.join(dir, 'thumbs')

  await fs.mkdir(dir, { recursive: true })
  await fs.mkdir(thumbs, { recursive: true })

  const hint = data.nombreArchivo || data.textoAlternativo || tableName
  const slug = slugify(String(hint), { lower: true, strict: true })
  const timestamp = makeTimestamp()

  /* 2 ▸ Procesar archivo principal (urlArchivo) */
  if (files['urlArchivo']) {
    const file = files['urlArchivo']
    
    /* limpiar archivo principal anterior */
    if (existing?.urlArchivo) {
      await fs.rm(path.join(dir,    existing.urlArchivo), { force: true }).catch(() => {})
      await fs.rm(path.join(thumbs, existing.urlArchivo), { force: true }).catch(() => {})
    }

    const originalName = (file as any).name as string
    const ext = path.extname(originalName).toLowerCase()
    const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    const svgExts   = ['.svg']

    if (svgExts.includes(ext)) {
      const out = `${slug}-${timestamp}.svg`
      const buf = Buffer.from(await (file as Blob).arrayBuffer())
      await fs.writeFile(path.join(dir, out), buf)
      data.urlArchivo   = out
      if (!files['urlMiniatura']) data.urlMiniatura = null
      data.tipo         = 'ICONO'
    } else if (videoExts.includes(ext)) {
      const out = `${slug}-${timestamp}${ext}`
      const buf = Buffer.from(await (file as Blob).arrayBuffer())
      await fs.writeFile(path.join(dir, out), buf)
      data.urlArchivo = out
      data.tipo       = 'VIDEO'
    } else {
      const out = `${slug}-${timestamp}.webp`
      const buf = Buffer.from(await (file as Blob).arrayBuffer())
      await sharp(buf).webp().toFile(path.join(dir, out))
      await sharp(buf).resize(200).webp().toFile(path.join(thumbs, out))
      data.urlArchivo   = out
      if (!files['urlMiniatura']) data.urlMiniatura = out
      data.tipo         = 'IMAGEN'
    }
  }

  /* 3 ▸ Procesar miniatura explícita (urlMiniatura) */
  if (files['urlMiniatura']) {
    const thumbFile = files['urlMiniatura']
    
    /* limpiar miniatura anterior */
    if (existing?.urlMiniatura) {
      await fs.rm(path.join(dir,    existing.urlMiniatura), { force: true }).catch(() => {})
      await fs.rm(path.join(thumbs, existing.urlMiniatura), { force: true }).catch(() => {})
    }

    const outThumb = `${slug}-thumb-${timestamp}.webp`
    const bufThumb = Buffer.from(await (thumbFile as Blob).arrayBuffer())
    
    await sharp(bufThumb).webp().toFile(path.join(dir, outThumb))
    await sharp(bufThumb).resize(200).webp().toFile(path.join(thumbs, outThumb))
    
    data.urlMiniatura = outThumb
  }

  delete data.nombreArchivo

  try {
    const updated = await model.update({ where: { id: key }, data })
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al actualizar registro' }, { status: 500 })
  }
}

/* ─────────────── DELETE: eliminar ─────────────── */
export async function DELETE(_req: NextRequest, { params }: any) {
  // Next.js 15: params es asincrónico y debe ser awaited
  const { tableName, id } = await params
  const model = models[tableName]

  if (!model) {
    return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 })
  }

  const key = isNaN(+id) ? id : +id
  const existing = await model.findUnique({ where: { id: key } })

  if (existing?.[FILE_FIELD]) {
    const baseDir = path.join(process.cwd(), 'public', 'images')
    const tbl: PrismaTable = tableName === 'GrupoMedios' ? 'GrupoMedios' : 'Medio'
    const keyDir = folderNames[tbl]
    const dir     = path.join(baseDir, keyDir)
    const thumbs  = path.join(dir, 'thumbs')
    await fs.rm(path.join(dir,    existing[FILE_FIELD]), { force: true }).catch(() => {})
    await fs.rm(path.join(thumbs, existing[FILE_FIELD]), { force: true }).catch(() => {})
  }

  try {
    await model.delete({ where: { id: key } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al eliminar registro' }, { status: 500 })
  }
}
