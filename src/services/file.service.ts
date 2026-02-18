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

// Configurar rutas de binarios
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

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
    let buf: Buffer | null = null;
    const stream = ffmpeg(videoPath)
      .screenshots({
        timestamps: ['00:00:01'],
        filename: 'thumb.png',
        folder: path.dirname(videoPath),
        size: '?x?', // Mantener aspecto original
      })
      .on('end', async () => {
        // Leer el archivo generado
        const thumbPath = path.join(path.dirname(videoPath), 'thumb.png');
        try {
            buf = await fs.readFile(thumbPath);
            await fs.unlink(thumbPath); // Borrar temporal
            resolve(buf);
        } catch (e) {
            console.error("Error leyendo thumb temporal:", e);
            resolve(null);
        }
      })
      .on('error', (err) => {
        console.error("FFmpeg fluent error:", err);
        resolve(null);
      });
  });
}

function compressVideo(inputPath: string, outputPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264', // Codec de video H.264
        '-crf 23',      // Calidad visual constante (18-28 es el rango usual)
        '-preset fast', // Balance velocidad/compresión
        '-c:a aac',     // Codec de audio AAC
        '-b:a 128k',    // Bitrate de audio
        '-movflags +faststart' // Optimización para streaming web
      ])
      .save(outputPath)
      .on('end', () => resolve(true))
      .on('error', (err) => {
        console.error("Error comprimiendo video:", err);
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
    // Si no es GrupoMedios ni Medio, asumimos que no tiene carpeta propia o usa un fallback.
    // En el código original solo manejaba GrupoMedios y Medio para carpetas.
    // Si agregamos Seccion con archivos, deberíamos mapearlo.
    // Por ahora mantengo la lógica original:
    const tbl: PrismaTable = tableName === "GrupoMedios" ? "GrupoMedios" : "Medio";
    const keyDir = folderNames[tbl];
    const dir = path.join(baseDir, keyDir);
    const thumbs = path.join(dir, "thumbs");

    await fs.mkdir(dir, { recursive: true });
    await fs.mkdir(thumbs, { recursive: true });

    return { dir, thumbs };
  },

  async saveFile(
    file: Blob,
    tableName: string,
    hint: string,
    thumbFile?: Blob
  ): Promise<SavedFile> {
    const { dir, thumbs } = await this.ensureDirectories(tableName);
    const timestamp = makeTimestamp();
    const slug = slugify(String(hint), { lower: true, strict: true });

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
      
      // Escritura eficiente con Streams (chunks) a archivo temporal
      const tempPath = path.join(dir, tempOut);
      const finalPath = path.join(dir, out);

      const webStream = file.stream();
      // @ts-ignore
      const nodeStream = Readable.fromWeb(webStream);
      await pipeline(nodeStream, createWriteStream(tempPath));

      // Comprimir video
      const compressed = await compressVideo(tempPath, finalPath);
      
      if (compressed) {
        // Si se comprimió bien, borrar el temporal
        await fs.unlink(tempPath).catch(() => {});
        savedFilename = out;
      } else {
        // Si falló, renombramos el temporal al final (fallback)
        await fs.rename(tempPath, finalPath);
        savedFilename = out;
      }

      tipo = "VIDEO";

      // Intentar generar miniatura automática de video
      try {
        const thumbBuf = await generateVideoThumbnail(finalPath);
        if (thumbBuf) {
          const outThumb = `${slug}-thumb-${timestamp}.webp`;
          
          // Guardar en dir principal (para acceso directo)
          await sharp(thumbBuf).webp().toFile(path.join(dir, outThumb));
          
          // Guardar en thumbs (resized)
          await sharp(thumbBuf).resize(200).webp().toFile(path.join(thumbs, outThumb));
          
          urlMiniatura = outThumb;
        }
      } catch (err) {
        console.error("Error generando miniatura de video:", err);
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
        urlMiniatura = out; // Mismo nombre, el frontend debe saber buscar en thumbs/ si quiere la pequeña
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

  async cleanTempFiles(tableName: string) {
    const { dir } = await this.ensureDirectories(tableName);
    try {
      const files = await fs.readdir(dir);
      const now = Date.now();
      const ONE_HOUR = 60 * 60 * 1000;

      for (const file of files) {
        // Eliminar archivos temporales (-temp) y thumbnails temporales (thumb.png)
        if (file.includes('-temp.') || file === 'thumb.png') {
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          
          // Borrar si tiene más de 1 hora de antigüedad
          if (now - stats.mtimeMs > ONE_HOUR) {
            await fs.unlink(filePath).catch(() => {});
          }
        }
      }
    } catch (error) {
      console.error("Error limpiando archivos temporales:", error);
    }
  }
};
