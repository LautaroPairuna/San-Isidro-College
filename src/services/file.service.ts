import fs from "fs/promises";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import path from "path";
import slugify from "slugify";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
// @ts-ignore
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
// @ts-ignore
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import { folderNames, type PrismaTable, IMAGE_PUBLIC_DIR } from "@/lib/adminConstants";

import os from "os";

// Configurar rutas de binarios
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// Store progress in a temporary directory
const PROGRESS_DIR = path.join(os.tmpdir(), "upload-progress");
// Ensure directory exists
fs.mkdir(PROGRESS_DIR, { recursive: true }).catch(() => {});

type ProgressStage = 'uploading' | 'compressing' | 'generating_thumbnail' | 'done' | 'error';

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

async function generateVideoThumbnail(videoPath: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const tempName = `thumb-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    console.log(`[FFmpeg] Iniciando generación de miniatura para: ${videoPath}`);
    
    let buf: Buffer | null = null;
    
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
        // Leer el archivo generado
        const thumbPath = path.join(path.dirname(videoPath), tempName);
        try {
            buf = await fs.readFile(thumbPath);
            await fs.unlink(thumbPath); // Borrar temporal
            resolve(buf);
        } catch (e) {
            console.error("[FFmpeg] Error leyendo thumb temporal:", e);
            resolve(null);
        }
      })
      .on('error', (err) => {
        console.error("[FFmpeg] Error fatal:", err);
        resolve(null);
      });
  });
}

function compressVideo(inputPath: string, outputPath: string, progressId?: string): Promise<boolean> {
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
        console.error("Error comprimiendo video:", err);
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
      } catch (e) {
        // Ignorar si falla la limpieza de progreso
      }

    } catch (error) {
      console.error("Error limpiando archivos temporales:", error);
    }
  },

  async saveFile(
    file: Blob,
    tableName: string,
    hintName?: string,
    thumbFile?: Blob,
    uploadId?: string
  ): Promise<SavedFile> {
    const { dir, thumbs } = await this.ensureDirectories(tableName);
    const timestamp = makeTimestamp();
    const slug = slugify(hintName || "archivo", { lower: true, strict: true });

    // Casting seguro
    const originalName = (file as any).name as string;
    const ext = path.extname(originalName).toLowerCase();
    
    const videoExts = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
    const svgExts = [".svg"];

    let savedFilename = "";
    let tipo: "IMAGEN" | "VIDEO" | "ICONO" = "IMAGEN";
    let urlMiniatura: string | null = null;

    if (svgExts.includes(ext)) {
      const out = `${slug}-${timestamp}.svg`;
      const buf = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(dir, out), buf);
      savedFilename = out;
      tipo = "ICONO";
    } else if (videoExts.includes(ext)) {
      const out = `${slug}-${timestamp}${ext}`;
      const tempOut = `${slug}-${timestamp}-temp${ext}`;
      
      const tempPath = path.join(dir, tempOut);
      const finalPath = path.join(dir, out);

      // Report initial progress
      if (uploadId) updateProgress(uploadId, 0, 'uploading');

      const webStream = file.stream();
      // @ts-ignore
      const nodeStream = Readable.fromWeb(webStream);
      
      // Track upload progress
      let loaded = 0;
      const total = file.size;
      
      nodeStream.on('data', (chunk) => {
        loaded += chunk.length;
        if (uploadId && total > 0) {
          const percent = Math.round((loaded / total) * 100);
          // Throttle updates slightly to avoid disk spam
          if (percent % 5 === 0 || percent === 100) {
            updateProgress(uploadId, percent, 'uploading');
          }
        }
      });

      await pipeline(nodeStream, createWriteStream(tempPath));

      // Comprimir video
      const compressed = await compressVideo(tempPath, finalPath, uploadId);
      
      if (compressed) {
        await fs.unlink(tempPath).catch(() => {});
        savedFilename = out;
      } else {
        await fs.rename(tempPath, finalPath);
        savedFilename = out;
      }

      tipo = "VIDEO";

      // Intentar generar miniatura automática de video
      try {
        if (uploadId) updateProgress(uploadId, 0, 'generating_thumbnail');
        console.log(`[FileService] Intentando generar miniatura para video: ${finalPath}`);
        
        // Verificar que el archivo existe y tiene tamaño > 0
        const stat = await fs.stat(finalPath);
        if (stat.size === 0) {
             throw new Error("El archivo de video tiene tamaño 0");
        }

        const thumbBuf = await generateVideoThumbnail(finalPath);
        if (thumbBuf) {
          console.log(`[FileService] Miniatura generada, procesando con Sharp...`);
          const thumbName = `thumb-${path.parse(out).name}.webp`;
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
        console.error("[FileService] Error en proceso de miniatura:", error);
      } finally {
        if (uploadId) updateProgress(uploadId, 100, 'done');
      }
    } else {
      // Imagen por defecto
      const out = `${slug}-${timestamp}.webp`;
      const buf = Buffer.from(await file.arrayBuffer());
      
      // Guardar principal
      await sharp(buf).webp().toFile(path.join(dir, out));
      
      savedFilename = out;
      tipo = "IMAGEN";

      // Si se subió miniatura explícita, usarla
      if (thumbFile) {
        const outThumb = `${slug}-thumb-${timestamp}.webp`;
        const bufThumb = Buffer.from(await thumbFile.arrayBuffer());
        
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

  async deleteFile(filename: string, tableName: string) {
    if (!filename) return;
    const { dir, thumbs } = await this.ensureDirectories(tableName);
    
    await fs.rm(path.join(dir, filename), { force: true }).catch(() => {});
    await fs.rm(path.join(thumbs, filename), { force: true }).catch(() => {});
  },
};
