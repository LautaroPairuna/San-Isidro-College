// lib/adminConstants.ts

import path from 'path';

/** Carpeta raíz de todo lo subido (videos) */
export const UPLOAD_BASE_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Cuando guardemos videos (sin procesar), van a:
 *   public/uploads/media/<video>.<ext>
 */
export const MEDIA_UPLOAD_DIR = path.join(UPLOAD_BASE_DIR, 'media');
export const MEDIA_PUBLIC_URL = '/uploads/media';

/**
 * Carpeta pública para imágenes procesadas (WebP y thumbs).
 * Quedará como `public/images`.
 */
export const IMAGE_PUBLIC_DIR = path.join(process.cwd(), 'public', 'images');
export const IMAGE_PUBLIC_URL = '/images';

/**
 * Mapeo “recurso Prisma” → subcarpeta en `public/images`.
 * Solo “Media” utiliza carpeta. MediaGroup no almacena archivos en disco.
 */
export const folderNames: Record<string, string> = {
  Medio:       'medios',
  GrupoMedios: 'grupos',
};

/**
 * Invertimos el map para que, dado un nombre de carpeta,
 * sepamos a qué tabla Prisma corresponde.
 * Ejemplo resultante: { media: "Media" }
 */
export const tableForFolder: Record<string, string> = Object.fromEntries(
  Object.entries(folderNames).map(([tbl, folder]) => [folder, tbl])
) as Record<string, string>;

/**
 * Endpoints base para CRUD de MediaGroup y Media.
 */
export const API_MEDIA_GROUPS = '/api/admin/resources/MediaGroup';
export const API_MEDIA_GROUP = (id: number | string) =>
  `/api/admin/resources/MediaGroup/${id}`;

export const API_MEDIAS = '/api/admin/resources/Media';
export const API_MEDIA = (id: number | string) =>
  `/api/admin/resources/Media/${id}`;

/**
 * Función auxiliar para construir la ruta absoluta de una imagen
 * en `public/images/<folder>/[...rest]`.
 *
 * Ejemplo de uso:
 *   const absPath = getImageAbsolutePath('media', ['thumbs', 'logo.webp']);
 *   // absPath ≃ /ruta/al/proyecto/public/images/media/thumbs/logo.webp
 */
export function getImageAbsolutePath(
  folder: string,
  segments: string[]
): string {
  return path.join(IMAGE_PUBLIC_DIR, folder, ...segments);
}
