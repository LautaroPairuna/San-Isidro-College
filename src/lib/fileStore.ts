// src/lib/fileStore.ts

import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import slugify from 'slugify'
import { IMAGE_PUBLIC_DIR } from '@/lib/adminConstants'

const PUBLIC_IMAGES = IMAGE_PUBLIC_DIR

/**
 * Asegura que existan las carpetas:
 *  public/images/<folder>/original
 *  public/images/<folder>/thumbs
 */
async function ensureFolders(folder: string) {
  const baseDir   = path.join(PUBLIC_IMAGES, folder)
  const thumbsDir = path.join(baseDir, 'thumbs')
  await fs.mkdir(baseDir, { recursive: true })
  await fs.mkdir(thumbsDir, { recursive: true })
  return { baseDir, thumbsDir }
}

/**
 * Genera un nombre de archivo usando slug + timestamp.
 */
function makeFilename(titleHint: string, ext: string) {
  const baseSlug  = slugify(titleHint, { lower: true, strict: true })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${baseSlug}-${timestamp}${ext}`
}

/**
 * Guarda un Blob como imagen WebP en public/images/<folder>/original,
 * y genera también su miniatura en public/images/<folder>/thumbs.
 * Devuelve el nombre de archivo (.webp).
 */
export async function saveImage(
  folder: string,
  file: Blob,
  titleHint: string
): Promise<string> {
  const { baseDir, thumbsDir } = await ensureFolders(folder)

  // Generar un nombre con extensión “.webp”
  const filename = makeFilename(titleHint, '.webp')
  const buffer   = Buffer.from(await file.arrayBuffer())

  // Guardar versión WebP completa
  const fullPath = path.join(baseDir, filename)
  await sharp(buffer).webp().toFile(fullPath)

  // Generar y guardar thumbnail (200px ancho)
  const thumbPath = path.join(thumbsDir, filename)
  await sharp(buffer).resize(200).webp().toFile(thumbPath)

  return filename
}

/**
 * Guarda un Blob “tal cual” como archivo de video (o cualquier binario)
 * en public/images/<folder>/original. No genera thumbnail.
 * Devuelve el nombre con su extensión original.
 */
export async function saveVideo(
  folder: string,
  file: Blob & { name: string },
  titleHint: string
): Promise<string> {
  const { baseDir } = await ensureFolders(folder)

  // Intentamos extraer la extensión original del Blob
  // (suponiendo que viene con file.name válido)
  const originalName = file.name
  const ext         = path.extname(originalName).toLowerCase() || '.mp4'
  const filename    = makeFilename(titleHint, ext)
  const buffer      = Buffer.from(await file.arrayBuffer())

  const fullPath = path.join(baseDir, filename)
  await fs.writeFile(fullPath, buffer)

  return filename
}

/**
 * Elimina un archivo y (si existe) su miniatura de public/images/<folder>:
 * - original: public/images/<folder>/<filename>
 * - thumb:    public/images/<folder>/thumbs/<filename>
 */
export async function removeFile(
  folder: string,
  filename: string
): Promise<void> {
  const baseDir   = path.join(PUBLIC_IMAGES, folder)
  const thumbsDir = path.join(baseDir, 'thumbs')

  await fs.rm(path.join(baseDir, filename), { force: true }).catch(() => {})
  await fs.rm(path.join(thumbsDir, filename), { force: true }).catch(() => {})
}
