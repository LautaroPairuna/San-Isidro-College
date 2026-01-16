// src/app/api/admin/resources/[tableName]/[id]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import slugify from "slugify";
import sharp from "sharp";
import { folderNames, type PrismaTable } from "@/lib/adminConstants";
import { prisma } from "@/lib/prisma";

const FILE_FIELD = "urlArchivo";
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

async function findUnique(tableName: string, id: string) {
  const key = Number.isNaN(Number(id)) ? (id as any) : Number(id);
  switch (tableName) {
    case "GrupoMedios":
      return prisma.grupoMedios.findUnique({ where: { id: key } });
    case "Medio":
      return prisma.medio.findUnique({ where: { id: key } });
    case "Seccion":
      return prisma.seccion.findUnique({ where: { id: key } });
    default:
      return null;
  }
}

async function updateOne(tableName: string, id: string, data: any) {
  const key = Number.isNaN(Number(id)) ? (id as any) : Number(id);
  switch (tableName) {
    case "GrupoMedios":
      return prisma.grupoMedios.update({ where: { id: key }, data });
    case "Medio":
      return prisma.medio.update({ where: { id: key }, data });
    case "Seccion":
      return prisma.seccion.update({ where: { id: key }, data });
    default:
      return null;
  }
}

async function deleteOne(tableName: string, id: string) {
  const key = Number.isNaN(Number(id)) ? (id as any) : Number(id);
  switch (tableName) {
    case "GrupoMedios":
      return prisma.grupoMedios.delete({ where: { id: key } });
    case "Medio":
      return prisma.medio.delete({ where: { id: key } });
    case "Seccion":
      return prisma.seccion.delete({ where: { id: key } });
    default:
      return null;
  }
}

/* ─────────────── GET ─────────────── */
export async function GET(_req: NextRequest, ctx: ParamsPromise<{ tableName: string; id: string }>) {
  const { tableName, id } = await ctx.params;

  try {
    const item = await findUnique(tableName, id);
    if (item === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al leer registro" }, { status: 500 });
  }
}

/* ─────────────── PUT ─────────────── */
export async function PUT(req: NextRequest, ctx: ParamsPromise<{ tableName: string; id: string }>) {
  const { tableName, id } = await ctx.params;

  const existing = await findUnique(tableName, id);
  if (existing === null) {
    return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
  }

  const ct = req.headers.get("content-type") || "";
  let data: Record<string, any> = {};
  const files: Record<string, Blob> = {};

  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    for (const [k, v] of form.entries()) {
      if (isFileLike(v)) files[k] = v as Blob;
      else if (typeof v === "string") data[k] = /^\d+$/.test(v) ? Number(v) : v;
    }
    normalizeBooleans(data);
  } else {
    data = await req.json();
    for (const k in data) {
      if (typeof data[k] === "string" && /^\d+$/.test(data[k])) data[k] = Number(data[k]);
    }
    normalizeBooleans(data);
  }

  /* Directorios comunes */
  const baseDir = path.join(process.cwd(), "public", "images");
  const tbl: PrismaTable = tableName === "GrupoMedios" ? "GrupoMedios" : "Medio";
  const keyDir = folderNames[tbl];
  const dir = path.join(baseDir, keyDir);
  const thumbs = path.join(dir, "thumbs");

  await fs.mkdir(dir, { recursive: true });
  await fs.mkdir(thumbs, { recursive: true });

  const hint = data.nombreArchivo || data.textoAlternativo || tableName;
  const slug = slugify(String(hint), { lower: true, strict: true });
  const timestamp = makeTimestamp();

  if (files["urlArchivo"]) {
    const file = files["urlArchivo"];

    if ((existing as any)?.urlArchivo) {
      await fs.rm(path.join(dir, (existing as any).urlArchivo), { force: true }).catch(() => {});
      await fs.rm(path.join(thumbs, (existing as any).urlArchivo), { force: true }).catch(() => {});
    }

    const originalName = (file as any).name as string;
    const ext = path.extname(originalName).toLowerCase();
    const videoExts = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
    const svgExts = [".svg"];

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

    if ((existing as any)?.urlMiniatura) {
      await fs.rm(path.join(dir, (existing as any).urlMiniatura), { force: true }).catch(() => {});
      await fs.rm(path.join(thumbs, (existing as any).urlMiniatura), { force: true }).catch(() => {});
    }

    const outThumb = `${slug}-thumb-${timestamp}.webp`;
    const bufThumb = Buffer.from(await (thumbFile as Blob).arrayBuffer());
    await sharp(bufThumb).webp().toFile(path.join(dir, outThumb));
    await sharp(bufThumb).resize(200).webp().toFile(path.join(thumbs, outThumb));
    data.urlMiniatura = outThumb;
  }

  delete data.nombreArchivo;

  try {
    const updated = await updateOne(tableName, id, data);
    if (updated === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al actualizar registro" }, { status: 500 });
  }
}

/* ─────────────── DELETE ─────────────── */
export async function DELETE(_req: NextRequest, ctx: ParamsPromise<{ tableName: string; id: string }>) {
  const { tableName, id } = await ctx.params;

  const existing = await findUnique(tableName, id);
  if (existing === null) {
    return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
  }

  if ((existing as any)?.[FILE_FIELD]) {
    const baseDir = path.join(process.cwd(), "public", "images");
    const tbl: PrismaTable = tableName === "GrupoMedios" ? "GrupoMedios" : "Medio";
    const keyDir = folderNames[tbl];
    const dir = path.join(baseDir, keyDir);
    const thumbs = path.join(dir, "thumbs");
    await fs.rm(path.join(dir, (existing as any)[FILE_FIELD]), { force: true }).catch(() => {});
    await fs.rm(path.join(thumbs, (existing as any)[FILE_FIELD]), { force: true }).catch(() => {});
  }

  try {
    const deleted = await deleteOne(tableName, id);
    if (deleted === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al eliminar registro" }, { status: 500 });
  }
}
