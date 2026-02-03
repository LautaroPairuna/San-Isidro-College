// src/lib/adminConstants.ts
import path from 'path';
import { 
  folderNames, 
  type PrismaTable, 
  toPublicImageUrl as clientToPublicImageUrl,
  toPublicMediaUrl as clientToPublicMediaUrl,
  IMAGE_PUBLIC_URL as CLIENT_IMAGE_URL,
  MEDIA_PUBLIC_URL as CLIENT_MEDIA_URL,
  resolveFolderAlias
} from './publicConstants';

export { folderNames, type PrismaTable, resolveFolderAlias } from './publicConstants';

/* ─────────────────────────────────────────────────────────────────
   BASES DE RUTAS (con override por ENV para Docker/EasyPanel)
   ───────────────────────────────────────────────────────────────── */

const CWD = process.cwd();

/** Carpeta pública raíz de IMÁGENES procesadas (WebP y thumbs). */
export const IMAGE_PUBLIC_DIR =
  process.env.MEDIA_DIR_IMAGES || path.join(CWD, 'public', 'images');

/** Prefijo público para IMÁGENES. Ej.: /images */
// Usamos la del cliente si está disponible, o la de servidor, o fallback
export const IMAGE_PUBLIC_URL =
  process.env.MEDIA_URL_IMAGES || CLIENT_IMAGE_URL;

/** Carpeta pública raíz de UPLOADS (binarios sin procesar). */
export const UPLOADS_DIR =
  process.env.UPLOADS_DIR || path.join(CWD, 'public', 'uploads');

/** Carpeta física de VIDEOS subidos (dentro de UPLOADS). */
export const MEDIA_UPLOAD_DIR =
  process.env.MEDIA_DIR_UPLOADS || path.join(UPLOADS_DIR, 'media');

/** Prefijo público de VIDEOS subidos. Ej.: /uploads/media */
export const MEDIA_PUBLIC_URL =
  process.env.MEDIA_URL_UPLOADS || CLIENT_MEDIA_URL;


// Re-exportamos helpers de carpetas inversas (tableForFolder)
// Como adminConstants es server-side (tiene 'path'), podemos definirlo aquí si se usa,
// pero tableForFolder depende de folderNames que ya importamos.
export const tableForFolder: Record<string, PrismaTable> = Object.fromEntries(
  Object.entries(folderNames).map(([tbl, folder]) => [folder, tbl as PrismaTable])
) as Record<string, PrismaTable>;

/* ─────────────────────────────────────────────────────────────────
   ENDPOINTS de la API de administración (en español)
   ───────────────────────────────────────────────────────────────── */

export const API_GRUPO_MEDIOS = '/api/admin/resources/GrupoMedios';
export const API_GRUPO_MEDIOS_ID = (id: number | string) =>
  `/api/admin/resources/GrupoMedios/${id}`;

export const API_MEDIOS = '/api/admin/resources/Medio';
export const API_MEDIO_ID = (id: number | string) =>
  `/api/admin/resources/Medio/${id}`;

/* ─────────────────────────────────────────────────────────────────
   HELPERS de PATHS ABSOLUTOS y URL PÚBLICA
   ───────────────────────────────────────────────────────────────── */

/**
 * Ruta absoluta a una imagen dentro de:
 *   IMAGE_PUBLIC_DIR/<folder>/<...segments>
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

/**
 * URL pública de una imagen (Server-side wrapper).
 * Mantiene compatibilidad con firma (...segments).
 */
export function toPublicImageUrl(
  folder: PrismaTable | string,
  ...segments: string[]
): string {
  // Reutilizamos lógica de cliente pero adaptada a segments
  const filename = segments.join('/');
  return clientToPublicImageUrl(folder, filename);
}

/**
 * Ruta absoluta a un archivo de VIDEO dentro de MEDIA_UPLOAD_DIR
 */
export function getUploadAbsolutePath(...segments: string[]): string {
  return path.join(MEDIA_UPLOAD_DIR, ...segments);
}

/**
 * URL pública de un VIDEO (Server-side wrapper).
 */
export function toPublicMediaUrl(...segments: string[]): string {
  const filename = segments.join('/');
  return clientToPublicMediaUrl(filename);
}
