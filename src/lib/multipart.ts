import Busboy from "busboy";
import { randomUUID } from "crypto";
import os from "os";
import path from "path";
import { createWriteStream } from "fs";
import fs from "fs/promises";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import type { NextRequest } from "next/server";
import { mediaErrors } from "@/lib/mediaErrors";

/** Archivo recibido, ya volcado a un temporal en disco (nunca se bufferea entero en RAM). */
export type ParsedFile = {
  filepath: string;
  filename: string;
  mimetype: string;
  size: number;
};

export type ParsedMultipart = {
  fields: Record<string, string>;
  files: Record<string, ParsedFile>;
};

/** Tamaño máximo por archivo (evita llenar el disco con subidas abusivas). */
const DEFAULT_MAX_FILE_BYTES = 1024 * 1024 * 1024; // 1 GB

function sanitizeFilename(name: string): string {
  return path.basename(name || "archivo").replace(/[^\w.\-]+/g, "_").slice(0, 120);
}

/**
 * Parsea un request multipart/form-data transmitiendo los archivos directo a
 * disco (temporales) en lugar de cargarlos en memoria con `req.formData()`.
 * Así la subida deja de depender del heap/RAM del servidor.
 *
 * Importante: quien consume debe eliminar los temporales con `cleanupParsed`.
 */
export async function parseMultipartToDisk(
  req: NextRequest,
  opts?: { maxFileBytes?: number }
): Promise<ParsedMultipart> {
  const contentType = req.headers.get("content-type") || "";
  const maxFileBytes = opts?.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES;

  if (!req.body) {
    return { fields: {}, files: {} };
  }

  const fields: Record<string, string> = {};
  const files: Record<string, ParsedFile> = {};

  return await new Promise<ParsedMultipart>((resolve, reject) => {
    const bb = Busboy({
      headers: { "content-type": contentType },
      limits: { fileSize: maxFileBytes },
    });

    // Promesas de escritura de cada archivo en disco.
    const writes: Promise<void>[] = [];
    let settled = false;

    const fail = async (err: unknown) => {
      if (settled) return;
      settled = true;
      // Limpieza best-effort de lo ya escrito.
      await cleanupParsed({ files });
      reject(err);
    };

    bb.on("field", (name, value) => {
      fields[name] = value;
    });

    bb.on("file", (name, stream, info) => {
      const filename = sanitizeFilename(info.filename ?? "archivo");
      const tmpPath = path.join(os.tmpdir(), `sic-upload-${randomUUID()}-${filename}`);

      let size = 0;
      let tooLarge = false;
      stream.on("data", (chunk: Buffer) => {
        size += chunk.length;
      });
      stream.on("limit", () => {
        tooLarge = true;
      });

      const write = pipeline(stream, createWriteStream(tmpPath))
        .then(async () => {
          if (tooLarge) {
            await fs.unlink(tmpPath).catch(() => {});
            throw mediaErrors.payloadTooLarge(Math.floor(maxFileBytes / (1024 * 1024)));
          }
          files[name] = {
            filepath: tmpPath,
            filename: info.filename ?? "archivo",
            mimetype: info.mimeType ?? "application/octet-stream",
            size,
          };
        });

      writes.push(write);
      // Propagamos el fallo (ej. archivo demasiado grande) para abortar.
      write.catch((err) => void fail(err));
    });

    bb.on("error", (err) => void fail(err));

    bb.on("close", () => {
      Promise.all(writes)
        .then(() => {
          if (settled) return;
          settled = true;
          resolve({ fields, files });
        })
        .catch((err) => void fail(err));
    });

    const nodeStream = Readable.fromWeb(req.body as unknown as Parameters<typeof Readable.fromWeb>[0]);
    nodeStream.on("error", (err) => void fail(err));
    nodeStream.pipe(bb);
  });
}

/** Elimina los temporales generados por `parseMultipartToDisk`. */
export async function cleanupParsed(parsed: Pick<ParsedMultipart, "files">): Promise<void> {
  await Promise.all(
    Object.values(parsed.files).map((f) => fs.unlink(f.filepath).catch(() => {}))
  );
}
