// src/lib/adminConstants.ts
// Este módulo es SOLO para el servidor (usa node:path y process.cwd()).
import 'server-only';
import path from 'node:path';

/* ──────────────────────────────────────────────────────────────
   BASES DE RUTAS (override por ENV para Docker/EasyPanel)
   ────────────────────────────────────────────────────────────── */

const CWD = process.cwd();

/** Carpeta pública raíz de IMÁGENES procesadas (WebP y thumbs). */
export const IMAGE_PUBLIC_DIR =
  process.env.MEDIA_DIR_IMAGES || path.join(CWD, 'public', 'images');

/** Prefijo público para IMÁGENES. Ej.: /images */
export const IMAGE_PUBLIC_URL =
  process.env.MEDIA_URL_IMAGES || '/images';

/** Carpeta pública raíz de UPLOADS (binarios sin procesar). */
export const UPLOADS_DIR =
  process.env.UPLOADS_DIR || path.join(CWD, 'public', 'uploads');

/** Carpeta física de VIDEOS subidos (dentro de UPLOADS). */
export const MEDIA_UPLOAD_DIR =
  process.env.MEDIA_DIR_UPLOADS || path.join(UPLOADS_DIR, 'media');

/** Prefijo público de VIDEOS subidos. Ej.: /uploads/media */
export const MEDIA_PUBLIC_URL =
  process.env.MEDIA_URL_UPLOADS || '/uploads/media';

/* ──────────────────────────────────────────────────────────────
   MAPEOS PRISMA ↔ CARPETAS (para IMÁGENES bajo /public/images)
   ──────────────────────────────────────────────────────────────
   Nota: en FS usamos plural "medios" y "grupos".
*/

export const folderNames = {
  /** Archivos (imágenes/íconos/videos) pertenecientes a la tabla Prisma `Medio` */
  Medio: 'medios',
  /** `GrupoMedios` no persiste archivos, pero lo dejamos por consistencia */
  GrupoMedios: 'grupos',
} as const;

export type PrismaTable = keyof typeof folderNames;

/** Inverso: dado el nombre de carpeta, devolver la tabla Prisma. */
export const tableForFolder: Record<string, PrismaTable> = Object.fromEntries(
  Object.entries(folderNames).map(([tbl, folder]) => [folder, tbl as PrismaTable])
) as Record<string, PrismaTable>;

/** Alias para tolerar singular "media" → carpeta física "medios". */
export function resolveFolderAlias(folder: string): string {
  if (folder === 'media') return 'medios';
  return folder;
}

/* ──────────────────────────────────────────────────────────────
   ENDPOINTS de la API de administración (en español)
   ────────────────────────────────────────────────────────────── */

export const API_GRUPO_MEDIOS = '/api/admin/resources/GrupoMedios';
export const API_GRUPO_MEDIOS_ID = (id: number | string) =>
  `/api/admin/resources/GrupoMedios/${id}`;

export const API_MEDIOS = '/api/admin/resources/Medio';
export const API_MEDIO_ID = (id: number | string) =>
  `/api/admin/resources/Medio/${id}`;

/* ──────────────────────────────────────────────────────────────
   HELPERS de PATHS ABSOLUTOS y URL PÚBLICA (server-only)
   ────────────────────────────────────────────────────────────── */

/**
 * Ruta absoluta a una imagen:
 *   IMAGE_PUBLIC_DIR/<folder>/<...segments>
 *
 * `folder` puede ser:
 *  - una clave Prisma ('Medio' | 'GrupoMedios'), o
 *  - el nombre de carpeta final ('medios' | 'grupos' | 'media' alias)
 */
export function getImageAbsolutePath(
  folder: PrismaTable | string,
  segments: string[]
): string {
  const folderName =
    (folder as PrismaTable) in folderNames
      ? folderNames[folder as PrismaTable]
      : resolveFolderAlias(String(folder));

  return path.join(IMAGE_PUBLIC_DIR, folderName, ...segments);
}

/** URL pública de una imagen: IMAGE_PUBLIC_URL/<folder>/<...segments> */
export function toPublicImageUrl(
  folder: PrismaTable | string,
  ...segments: string[]
): string {
  const folderName =
    (folder as PrismaTable) in folderNames
      ? folderNames[folder as PrismaTable]
      : resolveFolderAlias(String(folder));

  const base = IMAGE_PUBLIC_URL.replace(/\/$/, '');
  return [base, folderName, ...segments].join('/').replace(/\/{2,}/g, '/');
}

/** Ruta absoluta a un archivo de VIDEO: MEDIA_UPLOAD_DIR/<...segments> */
export function getUploadAbsolutePath(...segments: string[]): string {
  return path.join(MEDIA_UPLOAD_DIR, ...segments);
}

/** URL pública de un VIDEO: MEDIA_PUBLIC_URL/<...segments> */
export function toPublicMediaUrl(...segments: string[]): string {
  const base = MEDIA_PUBLIC_URL.replace(/\/$/, '');
  return [base, ...segments].join('/').replace(/\/{2,}/g, '/');
}
