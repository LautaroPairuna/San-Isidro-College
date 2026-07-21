/**
 * Taxonomía de errores para el manejo de recursos/medios.
 *
 * El objetivo es que el frontend reciba un mensaje claro y específico
 * (y un `code` estable) en lugar de un genérico "Error al actualizar medio".
 */

export type MediaErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INVALID_MODEL"
  | "BUSINESS_RULE"
  | "VALIDATION"
  | "EMPTY_FILE"
  | "UNSUPPORTED_FORMAT"
  | "PAYLOAD_TOO_LARGE"
  | "DISK_FULL"
  | "FFMPEG_UNAVAILABLE"
  | "VIDEO_PROCESSING_FAILED"
  | "IMAGE_PROCESSING_FAILED"
  | "INTERNAL";

export class MediaError extends Error {
  readonly code: MediaErrorCode;
  readonly httpStatus: number;
  /** Mensaje pensado para mostrarse directamente al usuario. */
  readonly userMessage: string;

  constructor(
    code: MediaErrorCode,
    userMessage: string,
    httpStatus: number,
    options?: { cause?: unknown }
  ) {
    super(userMessage, options);
    this.name = "MediaError";
    this.code = code;
    this.httpStatus = httpStatus;
    this.userMessage = userMessage;
  }
}

/** Atajos para lanzar errores concretos desde la capa de servicios. */
export const mediaErrors = {
  emptyFile: (cause?: unknown) =>
    new MediaError(
      "EMPTY_FILE",
      "El archivo subido está vacío (0 bytes). Volvé a seleccionar el archivo e intentá de nuevo.",
      422,
      { cause }
    ),
  payloadTooLarge: (maxMb?: number) =>
    new MediaError(
      "PAYLOAD_TOO_LARGE",
      maxMb
        ? `El archivo supera el tamaño máximo permitido (${maxMb} MB).`
        : "El archivo supera el tamaño máximo permitido.",
      413
    ),
  unsupportedFormat: (ext?: string) =>
    new MediaError(
      "UNSUPPORTED_FORMAT",
      ext
        ? `El formato de archivo "${ext}" no es compatible.`
        : "El formato de archivo no es compatible.",
      415
    ),
  diskFull: (cause?: unknown) =>
    new MediaError(
      "DISK_FULL",
      "No hay espacio suficiente en el servidor para guardar el archivo.",
      507,
      { cause }
    ),
  ffmpegUnavailable: (cause?: unknown) =>
    new MediaError(
      "FFMPEG_UNAVAILABLE",
      "No se pudo procesar el video: el componente de video (ffmpeg) no está disponible en el servidor.",
      500,
      { cause }
    ),
  videoProcessingFailed: (cause?: unknown) =>
    new MediaError(
      "VIDEO_PROCESSING_FAILED",
      "No se pudo procesar el video. Puede que el archivo esté dañado o en un formato no compatible.",
      422,
      { cause }
    ),
  imageProcessingFailed: (cause?: unknown) =>
    new MediaError(
      "IMAGE_PROCESSING_FAILED",
      "No se pudo procesar la imagen. Puede que el archivo esté dañado o en un formato no compatible.",
      422,
      { cause }
    ),
};

function hasCode(e: unknown): e is { code: string } {
  return typeof e === "object" && e !== null && "code" in e && typeof (e as { code: unknown }).code === "string";
}

function getMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "";
}

/**
 * Normaliza cualquier error a un `MediaError` con código, status HTTP y
 * mensaje entendible por el usuario.
 */
export function toMediaError(e: unknown): MediaError {
  if (e instanceof MediaError) return e;

  const message = getMessage(e);

  // Autenticación
  if (message === "Unauthorized") {
    return new MediaError("UNAUTHORIZED", "No autorizado.", 401, { cause: e });
  }

  // Reglas de negocio propias (ej. grupos "UNICO")
  if (message.includes("UNICO") || message.includes("“UNICO”")) {
    return new MediaError("BUSINESS_RULE", message, 409, { cause: e });
  }

  // Errores de sistema de archivos
  if (hasCode(e)) {
    if (e.code === "ENOSPC") return mediaErrors.diskFull(e);
    // Binario de ffmpeg/ffprobe faltante o no ejecutable
    if (e.code === "ENOENT" && /ffmpeg|ffprobe/i.test(message)) {
      return mediaErrors.ffmpegUnavailable(e);
    }
    // Errores conocidos de Prisma
    if (e.code === "P2025") {
      return new MediaError("NOT_FOUND", "El registro que intentás modificar ya no existe.", 404, { cause: e });
    }
    if (e.code === "P2002") {
      return new MediaError("VALIDATION", "Ya existe un registro con esos datos (valor duplicado).", 409, { cause: e });
    }
    if (e.code === "P2003") {
      return new MediaError("VALIDATION", "El grupo de medios seleccionado no existe.", 409, { cause: e });
    }
  }

  // Errores de validación de Prisma (no traen `code`)
  if (e instanceof Error && e.name === "PrismaClientValidationError") {
    return new MediaError("VALIDATION", "Los datos enviados no son válidos para este registro.", 400, { cause: e });
  }

  return new MediaError(
    "INTERNAL",
    "Ocurrió un error inesperado en el servidor. Intentá nuevamente en unos minutos.",
    500,
    { cause: e }
  );
}
