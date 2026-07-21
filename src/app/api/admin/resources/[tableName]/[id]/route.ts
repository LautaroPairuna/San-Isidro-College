export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/auth-guard";
import { resourceService, isValidTableName } from "@/services/resource.service";
import {
  invalidatePageContentMemoryCache,
  refreshPageContentCacheAll,
} from "@/lib/pageContentCache";
import { toMediaError } from "@/lib/mediaErrors";
import { parseMultipartToDisk, cleanupParsed, type ParsedFile, type ParsedMultipart } from "@/lib/multipart";

const BOOLEAN_FIELDS: readonly string[] = [];

function normalizeBooleans(obj: Record<string, unknown>) {
  for (const key of BOOLEAN_FIELDS) {
    if (key in obj) {
      const v = obj[key];
      obj[key] = v === true || v === "true" || v === "1" || v === 1;
    }
  }
}

type ParamsPromise<T> = { params: Promise<T> };

/* ─────────────── GET ─────────────── */
export async function GET(_req: NextRequest, ctx: ParamsPromise<{ tableName: string; id: string }>) {
  const { tableName, id } = await ctx.params;

  if (!isValidTableName(tableName)) {
    return NextResponse.json({ error: "Modelo inválido" }, { status: 400 });
  }

  try {
    await adminGuard();
    const item = await resourceService.getOne(tableName, id);
    if (item === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (e: any) {
    if (e.message === "Unauthorized") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error(e);
    return NextResponse.json({ error: "Error al leer registro" }, { status: 500 });
  }
}

/* ─────────────── PUT ─────────────── */
export async function PUT(req: NextRequest, ctx: ParamsPromise<{ tableName: string; id: string }>) {
  const { tableName, id } = await ctx.params;

  if (!isValidTableName(tableName)) {
    return NextResponse.json({ error: "Modelo inválido" }, { status: 400 });
  }

  let parsed: ParsedMultipart | null = null;

  try {
    await adminGuard();

    const ct = req.headers.get("content-type") || "";
    let data: Record<string, any> = {};
    const filesMap: { main?: ParsedFile; thumb?: ParsedFile } = {};

    if (ct.includes("multipart/form-data")) {
      // Transmite los archivos a disco sin bufferearlos en memoria.
      parsed = await parseMultipartToDisk(req);
      for (const [k, v] of Object.entries(parsed.fields)) {
        data[k] = /^\d+$/.test(v) ? Number(v) : v;
      }
      if (parsed.files.urlArchivo) filesMap.main = parsed.files.urlArchivo;
      if (parsed.files.urlMiniatura) filesMap.thumb = parsed.files.urlMiniatura;
      normalizeBooleans(data);
    } else {
      data = await req.json();
      for (const k in data) {
        if (typeof data[k] === "string" && /^\d+$/.test(data[k])) data[k] = Number(data[k]);
      }
      normalizeBooleans(data);
    }

    const updated = await resourceService.update(tableName, id, data, filesMap);

    if (updated === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
    }

    if (tableName === "Seccion" || tableName === "GrupoMedios" || tableName === "Medio") {
      invalidatePageContentMemoryCache();
      await refreshPageContentCacheAll();
    }

    return NextResponse.json(updated);
  } catch (e: any) {
    const me = toMediaError(e);
    // Sólo registramos en consola los errores realmente inesperados del servidor.
    if (me.httpStatus >= 500) console.error(e);
    return NextResponse.json({ error: me.userMessage, code: me.code }, { status: me.httpStatus });
  } finally {
    // Limpiar los temporales de la subida.
    if (parsed) await cleanupParsed(parsed);
  }
}

/* ─────────────── DELETE ─────────────── */
export async function DELETE(_req: NextRequest, ctx: ParamsPromise<{ tableName: string; id: string }>) {
  const { tableName, id } = await ctx.params;

  if (!isValidTableName(tableName)) {
    return NextResponse.json({ error: "Modelo inválido" }, { status: 400 });
  }

  try {
    await adminGuard();
    const deleted = await resourceService.delete(tableName, id);
    if (deleted === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
    }

    if (tableName === "Seccion" || tableName === "GrupoMedios" || tableName === "Medio") {
      invalidatePageContentMemoryCache();
      await refreshPageContentCacheAll();
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error(e);
    return NextResponse.json({ error: "Error al eliminar registro" }, { status: 500 });
  }
}
