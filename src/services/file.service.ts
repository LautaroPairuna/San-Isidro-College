import fs from "fs/promises";
import path from "path";
import slugify from "slugify";
import { folderNames, type PrismaTable } from "@/lib/publicConstants";
import { mediaErrors } from "@/lib/mediaErrors";
import type { ParsedFile } from "@/lib/multipart";

const IMAGE_PUBLIC_DIR = process.env.MEDIA_DIR_IMAGES || path.resolve("public", "images");

// Store progress in a temporary directory
const PROGRESS_DIR =
  process.env.UPLOAD_PROGRESS_DIR ||
  path.join(/*turbopackIgnore: true*/ process.cwd(), ".runtime", "upload-progress");
// Ensure directory exists
fs.mkdir(PROGRESS_DIR, { recursive: true }).catch(() => {});

type ProgressStage = 'uploading' | 'compressing' | 'generating_thumbnail' | 'done' | 'error';

let ffmpegModulePromise: Promise<typeof import('fluent-ffmpeg')> | null = null;

async function getSharp() {
  const sharpModule = await import('sharp');
  return ('default' in sharpModule ? sharpModule.default : sharpModule) as typeof import('sharp');
}

async function getFfmpeg() {
  if (!ffmpegModulePromise) {
    ffmpegModulePromise = (async () => {
      const [ffmpegModule, ffmpegStaticModule, ffprobeStaticModule] = await Promise.all([
        import('fluent-ffmpeg'),
        import('ffmpeg-static'),
        import('ffprobe-static'),
      ]);

      const ffmpeg = ('default' in ffmpegModule ? ffmpegModule.default : ffmpegModule) as typeof import('fluent-ffmpeg');

      // ffmpeg-static exporta directamente la ruta del binario (string) como default export.
      const ffmpegPath = (('default' in ffmpegStaticModule
        ? ffmpegStaticModule.default
        : ffmpegStaticModule) as unknown) as string | null;

      // ffprobe-static exporta { path }.
      const ffprobeStatic = ('default' in ffprobeStaticModule
        ? ffprobeStaticModule.default
        : ffprobeStaticModule) as { path: string };
      const ffprobePath = ffprobeStatic?.path;

      if (!ffmpegPath) {
        throw new Error(
          'No se encontró el binario de ffmpeg-static. Verifica que la dependencia se haya instalado con su script de descarga (postinstall).'
        );
      }

      ffmpeg.setFfmpegPath(ffmpegPath);
      if (ffprobePath) {
        ffmpeg.setFfprobePath(ffprobePath);
      }

      return ffmpeg;
    })();
  }

  return ffmpegModulePromise;
}

export type UploadProgress = {
  percent: number;
  stage: ProgressStage;
  updatedAt: number;
  error?: string;
};

async function updateProgress(id: string, percent: number, stage: ProgressStage = 'uploading', error?: string) {
  if (!id) return;
  const filePath = path.join(PROGRESS_DIR, `${id}.json`);
  try {
    const data: UploadProgress = { percent, stage, updatedAt: Date.now(), error };
    await fs.writeFile(filePath, JSON.stringify(data));
  } catch (e) {
    console.error("Error writing progress:", e);
  }
}

export async function getProgress(id: string): Promise<UploadProgress> {
  const filePath = path.join(PROGRESS_DIR, `${id}.json`);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as UploadProgress;
  } catch {
    return { percent: 0, stage: 'uploading', updatedAt: Date.now() };
  }
}

function makeTimestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "-" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function buildSlugName(hintName?: string) {
  return slugify(hintName || "archivo", { lower: true, strict: true }) || "archivo";
}

function renameFilenameKeepingSuffix(currentFilename: string, hintName: string) {
  const parsed = path.parse(currentFilename);
  const slug = buildSlugName(hintName);
  const thumbMatch = parsed.name.match(/^(.*)-thumb-(\d{8}-\d{6})$/);

  if (thumbMatch) {
    return `${slug}-thumb-${thumbMatch[2]}${parsed.ext}`;
  }

  if (parsed.name.startsWith("thumb-")) {
    const withoutPrefix = parsed.name.slice("thumb-".length);
    const timestampMatch = withoutPrefix.match(/-(\d{8}-\d{6})$/);
    return `thumb-${slug}${timestampMatch ? `-${timestampMatch[1]}` : ""}${parsed.ext}`;
  }

  const timestampMatch = parsed.name.match(/-(\d{8}-\d{6})$/);
  return `${slug}${timestampMatch ? `-${timestampMatch[1]}` : ""}${parsed.ext}`;
}

async function generateVideoThumbnail(videoPath: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const tempName = `thumb-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    console.log(`[FFmpeg] Iniciando generación de miniatura para: ${videoPath}`);
    
    let buf: Buffer | null = null;

    void getFfmpeg()
      .then((ffmpeg) => {
        ffmpeg(videoPath)
          .on('start', (cmd) => {
            console.log(`[FFmpeg] Comando generado: ${cmd}`);
          })
          .screenshots({
            timestamps: ['20%'], // 20% del video para evitar intros negras
            filename: tempName,
            folder: path.dirname(videoPath),
            size: '?x?', // Mantener aspecto original
          })
          .on('end', async () => {
            console.log(`[FFmpeg] Miniatura generada exitosamente: ${tempName}`);
            const thumbPath = path.join(path.dirname(videoPath), tempName);
            try {
              buf = await fs.readFile(thumbPath);
              await fs.unlink(thumbPath);
              resolve(buf);
            } catch (e) {
              console.error("[FFmpeg] Error leyendo thumb temporal:", e);
              resolve(null);
            }
          })
          .on('error', (err) => {
            console.error("[MEDIA][FFMPEG] Error generando miniatura:", err?.message || err);
            resolve(null);
          });
      })
      .catch((err) => {
        console.error("[MEDIA][FFMPEG] Error cargando el binario de ffmpeg/ffprobe:", err);
        resolve(null);
      });
  });
}

async function compressVideo(inputPath: string, outputPath: string, progressId?: string): Promise<boolean> {
  const ffmpeg = await getFfmpeg();

  return new Promise((resolve) => {
    if (progressId) updateProgress(progressId, 0, 'compressing');
    
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264', // Codec de video H.264
        '-crf 28',      // Calidad visual constante (28 es más ligero y rápido que 23)
        '-preset ultrafast', // Prioridad velocidad extrema
        '-vf scale=\'min(1920,iw)\':-2', // Redimensionar a 1080p máx para ahorrar CPU en videos 4K
        '-c:a aac',     // Codec de audio AAC
        '-b:a 128k',    // Bitrate de audio
        '-movflags +faststart' // Optimización para streaming web
      ])
      .on('progress', (progress) => {
        if (progressId && progress.percent) {
          updateProgress(progressId, Math.round(progress.percent), 'compressing');
        }
      })
      .save(outputPath)
      .on('end', () => {
        if (progressId) updateProgress(progressId, 100, 'compressing');
        resolve(true);
      })
      .on('error', (err) => {
        console.error("[MEDIA][FFMPEG] Error comprimiendo video:", err?.message || err);
        if (progressId) updateProgress(progressId, 0, 'error', err.message);
        resolve(false);
      });
  });
}

export type SavedFile = {
  filename: string;
  tipo: "IMAGEN" | "VIDEO" | "ICONO";
  urlMiniatura?: string | null;
};

export const fileService = {
  async ensureDirectories(tableName: string) {
    const baseDir = IMAGE_PUBLIC_DIR;
    const tbl: PrismaTable = tableName === "GrupoMedios" ? "GrupoMedios" : "Medio";
    const keyDir = folderNames[tbl];
    const dir = path.join(baseDir, keyDir);
    const thumbs = path.join(dir, "thumbs");

    await fs.mkdir(dir, { recursive: true });
    await fs.mkdir(thumbs, { recursive: true });

    return { dir, thumbs };
  },

  async cleanTempFiles(tableName: string) {
    const { dir } = await this.ensureDirectories(tableName);
    try {
      // Limpiar carpeta de imágenes/videos
      const files = await fs.readdir(dir);
      const now = Date.now();
      const ONE_HOUR = 60 * 60 * 1000;

      for (const file of files) {
        if (file.includes('-temp.') || file === 'thumb.png') {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          if (now - stats.mtimeMs > ONE_HOUR) {
            await fs.unlink(filePath).catch(() => {});
          }
        }
      }

      // Limpiar carpeta de progreso (archivos json viejos)
      try {
        const progressFiles = await fs.readdir(PROGRESS_DIR);
        for (const pFile of progressFiles) {
          if (pFile.endsWith('.json')) {
            const pPath = path.join(PROGRESS_DIR, pFile);
            const stats = await fs.stat(pPath);
            // Borrar progresos con más de 1 hora
            if (now - stats.mtimeMs > ONE_HOUR) {
              await fs.unlink(pPath).catch(() => {});
            }
          }
        }
      } catch {
        // Ignorar si falla la limpieza de progreso
      }

    } catch (error) {
      console.error("Error limpiando archivos temporales:", error);
    }
  },

  async saveFile(
    file: ParsedFile,
    tableName: string,
    hintName?: string,
    thumbFile?: ParsedFile,
    uploadId?: string
  ): Promise<SavedFile> {
    const { dir, thumbs } = await this.ensureDirectories(tableName);
    const timestamp = makeTimestamp();
    const slug = slugify(hintName || "archivo", { lower: true, strict: true });

    // El archivo ya está en disco (temporal), no en memoria.
    const originalName = file.filename ?? "archivo";
    const ext = path.extname(originalName).toLowerCase();

    const videoExts = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
    const svgExts = [".svg"];

    let savedFilename = "";
    let tipo: "IMAGEN" | "VIDEO" | "ICONO" = "IMAGEN";
    let urlMiniatura: string | null = null;

    if (svgExts.includes(ext)) {
      const out = `${slug}-${timestamp}.svg`;
      try {
        await fs.copyFile(file.filepath, path.join(dir, out));
      } catch (error) {
        if ((error as NodeJS.ErrnoException)?.code === 'ENOSPC') throw mediaErrors.diskFull(error);
        throw mediaErrors.imageProcessingFailed(error);
      }
      savedFilename = out;
      tipo = "ICONO";
    } else if (videoExts.includes(ext)) {
      const out = `${slug}-${timestamp}${ext}`;
      const finalPath = path.join(dir, out);

      // El video ya fue transmitido a disco por el parser multipart (sin bufferear
      // en RAM). Validamos que no esté vacío antes de procesarlo.
      if (file.size === 0) {
        if (uploadId) updateProgress(uploadId, 0, 'error', 'El video está vacío');
        throw mediaErrors.emptyFile();
      }

      // Comprimir video. Si ffmpeg no está disponible o la compresión falla,
      // se conserva el video original (sin comprimir) para no perder la subida.
      let compressed = false;
      try {
        compressed = await compressVideo(file.filepath, finalPath, uploadId);
      } catch (error) {
        // Fallo al cargar/ejecutar el binario de ffmpeg: seguimos con el crudo.
        console.error('[MEDIA][FFMPEG] ffmpeg no disponible, se guarda el video sin comprimir:', error);
        compressed = false;
      }

      if (!compressed) {
        // Copiamos el temporal al destino final (copyFile es seguro entre discos).
        try {
          await fs.copyFile(file.filepath, finalPath);
        } catch (error) {
          if ((error as NodeJS.ErrnoException)?.code === 'ENOSPC') throw mediaErrors.diskFull(error);
          throw mediaErrors.videoProcessingFailed(error);
        }
      }
      savedFilename = out;

      tipo = "VIDEO";

      // Intentar generar miniatura automática de video (best-effort, no bloquea)
      try {
        if (uploadId) updateProgress(uploadId, 0, 'generating_thumbnail');
        console.log(`[FileService] Intentando generar miniatura para video: ${finalPath}`);

        const thumbBuf = await generateVideoThumbnail(finalPath);
        if (thumbBuf) {
          console.log(`[FileService] Miniatura generada, procesando con Sharp...`);
          const thumbName = `thumb-${path.parse(out).name}.webp`;
          const sharp = await getSharp();
          await sharp(thumbBuf)
            .resize(300) // Un poco más grande para video
            .webp({ quality: 80 })
            .toFile(path.join(thumbs, thumbName));
          
          urlMiniatura = thumbName;
          console.log(`[FileService] Miniatura guardada como: ${thumbName}`);
        } else {
          console.warn(`[FileService] No se pudo generar miniatura para: ${finalPath}`);
        }
      } catch (error) {
        console.error("[MEDIA][FFMPEG] Error en proceso de miniatura:", error);
      } finally {
        if (uploadId) updateProgress(uploadId, 100, 'done');
      }
    } else {
      // Imagen por defecto
      const out = `${slug}-${timestamp}.webp`;

      if (file.size === 0) {
        throw mediaErrors.emptyFile();
      }

      try {
        const sharp = await getSharp();
        const buf = await fs.readFile(file.filepath);

        // Guardar principal
        await sharp(buf).webp().toFile(path.join(dir, out));

        savedFilename = out;
        tipo = "IMAGEN";

        // Si se subió miniatura explícita, usarla
        if (thumbFile) {
          const outThumb = `${slug}-thumb-${timestamp}.webp`;
          const bufThumb = await fs.readFile(thumbFile.filepath);

          // Guardar thumb explícito en carpeta principal (para acceso directo)
          await sharp(bufThumb).webp().toFile(path.join(dir, outThumb));

          // También generamos versión pequeña en thumbs/ para consistencia
          await sharp(bufThumb).resize(200).webp().toFile(path.join(thumbs, outThumb));

          urlMiniatura = outThumb;
        } else {
          // Si NO hay thumb explícito, generar miniatura automática de la principal
          await sharp(buf).resize(200).webp().toFile(path.join(thumbs, out));
          urlMiniatura = out;
        }
      } catch (error) {
        if ((error as NodeJS.ErrnoException)?.code === 'ENOSPC') throw mediaErrors.diskFull(error);
        throw mediaErrors.imageProcessingFailed(error);
      }
    }

    // Si es SVG y no hay miniatura explícita, null
    if (tipo === "ICONO" && !thumbFile) {
      urlMiniatura = null;
    }

    return {
      filename: savedFilename,
      tipo,
      urlMiniatura,
    };
  },

  async renameMediaFiles(
    currentFile: string,
    currentThumb: string | null,
    tableName: string,
    hintName: string
  ) {
    const { dir, thumbs } = await this.ensureDirectories(tableName);
    const nextFile = renameFilenameKeepingSuffix(currentFile, hintName);

    if (nextFile !== currentFile) {
      await fs.rename(path.join(dir, currentFile), path.join(dir, nextFile));
      await fs.rename(path.join(thumbs, currentFile), path.join(thumbs, nextFile)).catch(() => {});
    }

    if (!currentThumb) {
      return { urlArchivo: nextFile, urlMiniatura: null };
    }

    if (currentThumb === currentFile) {
      return { urlArchivo: nextFile, urlMiniatura: nextFile };
    }

    const nextThumb = renameFilenameKeepingSuffix(currentThumb, hintName);

    if (nextThumb !== currentThumb) {
      await fs.rename(path.join(dir, currentThumb), path.join(dir, nextThumb)).catch(() => {});
      await fs.rename(path.join(thumbs, currentThumb), path.join(thumbs, nextThumb)).catch(() => {});
    }

    return { urlArchivo: nextFile, urlMiniatura: nextThumb };
  },

  async deleteFile(filename: string, tableName: string) {
    if (!filename) return;
    const { dir, thumbs } = await this.ensureDirectories(tableName);
    
    await fs.rm(path.join(dir, filename), { force: true }).catch(() => {});
    await fs.rm(path.join(thumbs, filename), { force: true }).catch(() => {});
  },
};
