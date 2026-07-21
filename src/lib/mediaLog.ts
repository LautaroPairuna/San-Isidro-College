import path from "path";
import type { MediaError } from "@/lib/mediaErrors";
import type { ParsedFile, ParsedMultipart } from "@/lib/multipart";

/**
 * Logging estructurado de subidas de medios.
 *
 * Todas las líneas llevan el prefijo [MEDIA] para poder filtrarlas desde la
 * consola del servidor, por ejemplo:
 *   - Todo:            docker logs <cont> | grep '\[MEDIA\]'
 *   - Sólo errores:    docker logs <cont> | grep '\[MEDIA\]\[ERROR\]'
 *   - Sólo subidas:    docker logs <cont> | grep '\[MEDIA\]\[UPLOAD\]'
 */

const TAG = "[MEDIA]";

export type UploadContext = {
  op: "POST" | "PUT" | "DELETE";
  resource: string;
  id?: string | number;
};

function target(ctx: UploadContext): string {
  return ctx.id != null ? `${ctx.resource}#${ctx.id}` : ctx.resource;
}

function describeFile(file?: ParsedFile): string {
  if (!file) return "-";
  const ext = (path.extname(file.filename || "").toLowerCase() || "?");
  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  return `name="${file.filename}" size=${file.size}B (${sizeMb}MB) ext=${ext} mime=${file.mimetype}`;
}

/** Loguea los archivos entrantes de una subida (name, tamaño, extensión, MIME). */
export function logIncomingUpload(ctx: UploadContext, parsed: ParsedMultipart | null): void {
  if (!parsed) return;
  const main = parsed.files.urlArchivo;
  const thumb = parsed.files.urlMiniatura;
  if (!main && !thumb) return; // update sin archivo nuevo: nada que loguear

  console.log(
    `${TAG}[UPLOAD][${ctx.op}] ${target(ctx)} main:{ ${describeFile(main)} }` +
      (thumb ? ` thumb:{ ${describeFile(thumb)} }` : "")
  );
}

/** Loguea un error de medio con su código, status HTTP y el archivo involucrado. */
export function logMediaError(
  ctx: UploadContext,
  err: unknown,
  me: MediaError,
  parsed?: ParsedMultipart | null
): void {
  const main = parsed?.files?.urlArchivo;
  const fileStr = main ? ` file:{ ${describeFile(main)} }` : "";

  console.error(
    `${TAG}[ERROR][${ctx.op}] ${target(ctx)} code=${me.code} status=${me.httpStatus} ` +
      `msg="${me.userMessage}"${fileStr}`
  );

  // Para errores inesperados (5xx) volcamos también el error original completo
  // (stack, causa, etc.) para poder diagnosticarlo.
  if (me.httpStatus >= 500) {
    console.error(`${TAG}[ERROR][${ctx.op}] ${target(ctx)} detalle:`, err);
  }
}
