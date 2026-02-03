export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/auth-guard";
import { resourceService } from "@/services/resource.service";

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

type ParamsPromise<T> = { params: Promise<T> };

/* ─────────────── GET: listar todos ─────────────── */
export async function GET(req: NextRequest, ctx: ParamsPromise<{ tableName: string }>) {
  const { tableName } = await ctx.params;
  const searchParams = req.nextUrl.searchParams;
  
  // Parsear query params
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 1000;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const order = (searchParams.get("order") as 'asc' | 'desc') || 'desc';

  // Extraer filtros adicionales
  const filters: Record<string, any> = {};
  searchParams.forEach((value, key) => {
    // Ignorar parámetros de paginación, ordenamiento y cache-busting
    if (['page', 'limit', 'search', 'sortBy', 'order', '_t'].includes(key)) return;
    
    // Convertir tipos básicos
    if (/^\d+$/.test(value)) {
        filters[key] = Number(value);
    } else if (value === 'true') {
        filters[key] = true;
    } else if (value === 'false') {
        filters[key] = false;
    } else if (value === 'null') {
        filters[key] = null;
    } else {
        filters[key] = value;
    }
  });

  try {
    await adminGuard();
    const result = await resourceService.listAll(tableName, page, limit, search, filters, sortBy, order);
    
    if (result === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error(e);
    return NextResponse.json({ error: "Error al leer datos" }, { status: 500 });
  }
}

/* ─────────────── POST: crear registro ─────────────── */
export async function POST(req: NextRequest, ctx: ParamsPromise<{ tableName: string }>) {
  const { tableName } = await ctx.params;

  try {
    await adminGuard();

    const ct = req.headers.get("content-type") || "";
    let data: Record<string, any> = {};
    const filesMap: { main?: Blob; thumb?: Blob } = {};

    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      
      for (const [k, v] of form.entries()) {
        if (isFileLike(v)) {
            if (k === "urlArchivo") filesMap.main = v as Blob;
            if (k === "urlMiniatura") filesMap.thumb = v as Blob;
        }
        else if (typeof v === "string") data[k] = /^\d+$/.test(v) ? Number(v) : v;
      }

      // data.nombreArchivo se mantiene en data para que el servicio lo use como hint
      normalizeBooleans(data);
    } else {
      data = await req.json();
      delete data.id;
      for (const k in data) {
        if (typeof data[k] === "string" && /^\d+$/.test(data[k])) data[k] = Number(data[k]);
      }
      normalizeBooleans(data);
    }

    const created = await resourceService.create(tableName, data, filesMap);

    if (created === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
    }
    return NextResponse.json(created, { status: 201 });

  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    // Error de negocio (ej. validación UNICO)
    if (e.message && e.message.includes("UNICO")) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Error al crear registro" }, { status: 500 });
  }
}
