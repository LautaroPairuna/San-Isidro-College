import fs from "fs/promises";
import path from "path";
import slugify from "slugify";
import sharp from "sharp";
import { folderNames, type PrismaTable, IMAGE_PUBLIC_DIR } from "@/lib/adminConstants";

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
      const buf = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(dir, out), buf);
      savedFilename = out;
      tipo = "VIDEO";
    } else {
      // Imagen por defecto
      const out = `${slug}-${timestamp}.webp`;
      const buf = Buffer.from(await file.arrayBuffer());
      
      // Guardar principal
      await sharp(buf).webp().toFile(path.join(dir, out));
      
      // Guardar miniatura auto-generada
      await sharp(buf).resize(200).webp().toFile(path.join(thumbs, out));
      
      savedFilename = out;
      urlMiniatura = out; // Por defecto la misma imagen es su thumb (reducido)
      tipo = "IMAGEN";
    }

    // Si se subió miniatura explícita, procesarla
    if (thumbFile) {
      const outThumb = `${slug}-thumb-${timestamp}.webp`;
      const bufThumb = Buffer.from(await thumbFile.arrayBuffer());
      await sharp(bufThumb).webp().toFile(path.join(dir, outThumb));
      await sharp(bufThumb).resize(200).webp().toFile(path.join(thumbs, outThumb));
      urlMiniatura = outThumb;
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
