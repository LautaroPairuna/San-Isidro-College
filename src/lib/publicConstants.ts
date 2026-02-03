// src/lib/publicConstants.ts

/**
 * URL base pública para IMÁGENES.
 * Usamos el endpoint '/api/disk-images/images' por defecto para garantizar
 * que se lean los archivos recién subidos (bypass de caché estática de Next.js).
 */
export const IMAGE_PUBLIC_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL_IMAGES || '/api/disk-images/images';

/**
 * URL base pública para VIDEOS.
 * Usamos el endpoint '/api/disk-images/uploads/media' por defecto.
 */
export const MEDIA_PUBLIC_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL_UPLOADS || '/api/disk-images/uploads/media';

/* ─────────────────────────────────────────────────────────────────
   MAPEOS PRISMA ↔ CARPETAS (Safe for Client)
   ───────────────────────────────────────────────────────────────── */
export const folderNames = {
  /** Archivos (imágenes/íconos/videos) pertenecientes a la tabla Prisma `Medio` */
  Medio: 'medios',
  /** `GrupoMedios` no persiste archivos, pero lo dejamos por consistencia */
  GrupoMedios: 'grupos',
} as const;

export type PrismaTable = keyof typeof folderNames;

/**
 * Resuelve el nombre de la carpeta física dado un alias o key de PrismaTable.
 * Si no encuentra mapeo, devuelve el input original.
 */
export function resolveFolderAlias(folder: string): string {
  if (folder in folderNames) {
    return folderNames[folder as PrismaTable];
  }
  return folder;
}

/**
 * Helper para construir URL pública de una imagen.
 *
 * @param folder - Carpeta lógica ('Medio' | 'GrupoMedios' | 'medios' | 'grupos' | string)
 * @param filename - Nombre del archivo
 */
export function toPublicImageUrl(folder: PrismaTable | string, filename: string): string {
  if (!filename) return '';
  
  // Resolver nombre de carpeta si viene como Key de Prisma
  const folderName = resolveFolderAlias(String(folder));
  
  const cleanFile = filename.replace(/^\/+/, '');
  const cleanFolder = folderName.replace(/\/$/, '');
  const base = IMAGE_PUBLIC_URL.replace(/\/$/, '');
  
  return `${base}/${cleanFolder}/${cleanFile}`;
}

/**
 * Helper para construir URL pública de un video.
 *
 * @param filename - Nombre del archivo
 */
export function toPublicMediaUrl(filename: string): string {
  if (!filename) return '';
  const cleanFile = filename.replace(/^\/+/, '');
  const base = MEDIA_PUBLIC_URL.replace(/\/$/, '');
  
  return `${base}/${cleanFile}`;
}
