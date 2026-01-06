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

/**
 * Mapeo dinámico de nombres a modelos Prisma.
 */
const models: Record<string, any> = {
  GrupoMedios: prisma.grupoMedios,
  Medio:       prisma.medio,
}

const BOOLEAN_FIELDS: readonly string[] = []
const FILE_FIELD = 'urlArchivo'

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

/* ─────────────── GET: listar todos ─────────────── */
export async function GET(_req: NextRequest, { params }: any) {
  // Next.js 15: params es asincrónico y debe ser awaited
  const { tableName } = await params
  const model = models[tableName]

  if (!model) {
    return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 })
  }

  try {
    const all = await model.findMany()
    return NextResponse.json(all)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al leer datos' }, { status: 500 })
  }
}

/* ─────────────── POST: crear registro ─────────────── */
export async function POST(req: NextRequest, { params }: any) {
  // Next.js 15: params es asincrónico y debe ser awaited
  const { tableName } = await params
  const model = models[tableName]

  if (!model) {
    return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 })
  }

  const ct = req.headers.get('content-type') || ''
  let data: Record<string, any> = {}
  let file: Blob | null = null

  if (ct.includes('multipart/form-data')) {
    /* 1 ▸ Parsear multipart */
    const form = await req.formData()
    const files: Record<string, Blob> = {}

    for (const [k, v] of form.entries()) {
      if (isFileLike(v)) {
        files[k] = v as Blob
      } else if (typeof v === 'string') {
        data[k] = /^\d+$/.test(v) ? Number(v) : v
      }
    }
    const nombreArchivoCustom = data.nombreArchivo as string | undefined
    delete data.nombreArchivo
    normalizeBooleans(data)

    const baseDir = path.join(process.cwd(), 'public', 'images')
    const tbl: PrismaTable = tableName === 'GrupoMedios' ? 'GrupoMedios' : 'Medio'
    const keyDir = folderNames[tbl]
    const dir     = path.join(baseDir, keyDir)
    const thumbs  = path.join(dir, 'thumbs')
    await fs.mkdir(dir, { recursive: true })
    await fs.mkdir(thumbs, { recursive: true })

    const timestamp = makeTimestamp()
    const hint = nombreArchivoCustom || data.nombre || data.textoAlternativo || tableName
    const slug = slugify(String(hint), { lower: true, strict: true })

    /* 2 ▸ Procesar archivo principal (urlArchivo) */
    if (files['urlArchivo']) {
      file = files['urlArchivo']
      const originalName = (file as any).name as string
      const ext = path.extname(originalName).toLowerCase()
      const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm']
      const svgExts   = ['.svg']

      /* Validación UNICO */
      if (tableName === 'Medio') {
        const grupoPadre = await prisma.grupoMedios.findUnique({
          where: { id: Number(data.grupoMediosId) },
          select: { tipoGrupo: true },
        })
        if (grupoPadre?.tipoGrupo === 'UNICO') {
          const existing = await prisma.medio.count({ where: { grupoMediosId: Number(data.grupoMediosId) } })
          if (existing >= 1) {
            return NextResponse.json(
              { error: 'Este grupo es “UNICO” y ya contiene un medio.' },
              { status: 400 },
            )
          }
        }
      }

      /* 2.a ▸ SVG */
      if (svgExts.includes(ext)) {
        const out = `${slug}-${timestamp}.svg`
        const buf = Buffer.from(await (file as Blob).arrayBuffer())
        await fs.writeFile(path.join(dir, out), buf)
        data.urlArchivo = out
        // Si no se envió miniatura explícita, anularla
        if (!files['urlMiniatura']) data.urlMiniatura = null
        data.tipo = 'ICONO'
      }
      /* 2.b ▸ Video */
      else if (videoExts.includes(ext)) {
        const out = `${slug}-${timestamp}${ext}`
        const buf = Buffer.from(await (file as Blob).arrayBuffer())
        await fs.writeFile(path.join(dir, out), buf)
        data.urlArchivo = out
        data.tipo = 'VIDEO'
        // Nota: urlMiniatura se procesará abajo si existe
      }
      /* 2.c ▸ Imagen */
      else {
        const out = `${slug}-${timestamp}.webp`
        const buf = Buffer.from(await (file as Blob).arrayBuffer())
        await sharp(buf).webp().toFile(path.join(dir, out))
        await sharp(buf).resize(200).webp().toFile(path.join(thumbs, out))
        data.urlArchivo   = out
        // Si es imagen, la misma imagen sirve de miniatura por defecto
        if (!files['urlMiniatura']) data.urlMiniatura = out
        data.tipo          = 'IMAGEN'
      }
    }

    /* 3 ▸ Procesar miniatura explícita (urlMiniatura) */
    if (files['urlMiniatura']) {
      const thumbFile = files['urlMiniatura']
      // Siempre guardar como webp
      const outThumb = `${slug}-thumb-${timestamp}.webp`
      const bufThumb = Buffer.from(await (thumbFile as Blob).arrayBuffer())
      
      // Guardar original en carpeta principal
      await sharp(bufThumb).webp().toFile(path.join(dir, outThumb))
      // Guardar resize en thumbs (para que FotoCell lo encuentre rápido)
      await sharp(bufThumb).resize(200).webp().toFile(path.join(thumbs, outThumb))
      
      data.urlMiniatura = outThumb
    }

  } else {
    /* JSON simple */
    data = await req.json()
    delete data.id
    for (const k in data) {
      if (typeof data[k] === 'string' && /^\d+$/.test(data[k])) data[k] = Number(data[k])
    }
    normalizeBooleans(data)
  }

  /* 3 ▸ Crear en Prisma */
  try {
    const created = await model.create({ data })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al crear registro' }, { status: 500 })
  }
}
