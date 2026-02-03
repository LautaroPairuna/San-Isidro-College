// src/app/api/admin/resources/[tableName]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import slugify from "slugify";
import sharp from "sharp";
import { folderNames, type PrismaTable, IMAGE_PUBLIC_DIR } from "@/lib/adminConstants";
import { prisma } from "@/lib/prisma";

const BOOLEAN_FIELDS: readonly string[] = [];

function isFileLike(v: unknown): v is Blob {
  return typeof v === "object" && v !== null && typeof (v as Blob).arrayBuffer === "function";
}

function normalizeBooleans(obj: Record<string, unknown>) {
  for (const key of BOOLEAN_FIELDS) {
    if (key in obj) {
      const v = obj[key];
      obj[key] = v === true || v === "true" || v === "1" || v === 1;
    }
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

type ParamsPromise<T> = { params: Promise<T> };

async function listAll(tableName: string) {
  switch (tableName) {
    case "GrupoMedios":
      return prisma.grupoMedios.findMany();
    case "Medio":
      return prisma.medio.findMany();
    case "Seccion":
      return prisma.seccion.findMany();
    default:
      return null;
  }
}

async function createOne(tableName: string, data: any) {
  switch (tableName) {
    case "GrupoMedios":
      return prisma.grupoMedios.create({ data });
    case "Medio":
      return prisma.medio.create({ data });
    case "Seccion":
      return prisma.seccion.create({ data });
    default:
      return null;
  }
}

/* ─────────────── GET: listar todos ─────────────── */
export async function GET(_req: NextRequest, ctx: ParamsPromise<{ tableName: string }>) {
  const { tableName } = await ctx.params;

  try {
    const all = await listAll(tableName);
    if (all === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
    }
    return NextResponse.json(all);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al leer datos" }, { status: 500 });
  }
}

/* ─────────────── POST: crear registro ─────────────── */
export async function POST(req: NextRequest, ctx: ParamsPromise<{ tableName: string }>) {
  const { tableName } = await ctx.params;

  const ct = req.headers.get("content-type") || "";
  let data: Record<string, any> = {};

  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    const files: Record<string, Blob> = {};

    for (const [k, v] of form.entries()) {
      if (isFileLike(v)) files[k] = v as Blob;
      else if (typeof v === "string") data[k] = /^\d+$/.test(v) ? Number(v) : v;
    }

    const nombreArchivoCustom = data.nombreArchivo as string | undefined;
    delete data.nombreArchivo;
    normalizeBooleans(data);

    const baseDir = IMAGE_PUBLIC_DIR;
    const tbl: PrismaTable = tableName === "GrupoMedios" ? "GrupoMedios" : "Medio";
    const keyDir = folderNames[tbl];
    const dir = path.join(baseDir, keyDir);
    const thumbs = path.join(dir, "thumbs");
    await fs.mkdir(dir, { recursive: true });
    await fs.mkdir(thumbs, { recursive: true });

    const timestamp = makeTimestamp();
    const hint = nombreArchivoCustom || data.nombre || data.textoAlternativo || tableName;
    const slug = slugify(String(hint), { lower: true, strict: true });

    if (files["urlArchivo"]) {
      const file = files["urlArchivo"];
      const originalName = (file as any).name as string;
      const ext = path.extname(originalName).toLowerCase();
      const videoExts = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
      const svgExts = [".svg"];

      // Validación UNICO (solo para Medio)
      if (tableName === "Medio") {
        const grupoPadre = await prisma.grupoMedios.findUnique({
          where: { id: Number(data.grupoMediosId) },
          select: { tipoGrupo: true },
        });

        if (grupoPadre?.tipoGrupo === "UNICO") {
          const existing = await prisma.medio.count({
            where: { grupoMediosId: Number(data.grupoMediosId) },
          });
          if (existing >= 1) {
            return NextResponse.json(
              { error: "Este grupo es “UNICO” y ya contiene un medio." },
              { status: 400 }
            );
          }
        }
      }

      if (svgExts.includes(ext)) {
        const out = `${slug}-${timestamp}.svg`;
        const buf = Buffer.from(await (file as Blob).arrayBuffer());
        await fs.writeFile(path.join(dir, out), buf);
        data.urlArchivo = out;
        if (!files["urlMiniatura"]) data.urlMiniatura = null;
        data.tipo = "ICONO";
      } else if (videoExts.includes(ext)) {
        const out = `${slug}-${timestamp}${ext}`;
        const buf = Buffer.from(await (file as Blob).arrayBuffer());
        await fs.writeFile(path.join(dir, out), buf);
        data.urlArchivo = out;
        data.tipo = "VIDEO";
      } else {
        const out = `${slug}-${timestamp}.webp`;
        const buf = Buffer.from(await (file as Blob).arrayBuffer());
        await sharp(buf).webp().toFile(path.join(dir, out));
        await sharp(buf).resize(200).webp().toFile(path.join(thumbs, out));
        data.urlArchivo = out;
        if (!files["urlMiniatura"]) data.urlMiniatura = out;
        data.tipo = "IMAGEN";
      }
    }

    if (files["urlMiniatura"]) {
      const thumbFile = files["urlMiniatura"];
      const outThumb = `${slug}-thumb-${timestamp}.webp`;
      const bufThumb = Buffer.from(await (thumbFile as Blob).arrayBuffer());
      await sharp(bufThumb).webp().toFile(path.join(dir, outThumb));
      await sharp(bufThumb).resize(200).webp().toFile(path.join(thumbs, outThumb));
      data.urlMiniatura = outThumb;
    }
  } else {
    data = await req.json();
    delete data.id;
    for (const k in data) {
      if (typeof data[k] === "string" && /^\d+$/.test(data[k])) data[k] = Number(data[k]);
    }
    normalizeBooleans(data);
  }

  try {
    const created = await createOne(tableName, data);
    if (created === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
    }
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al crear registro" }, { status: 500 });
  }
}
