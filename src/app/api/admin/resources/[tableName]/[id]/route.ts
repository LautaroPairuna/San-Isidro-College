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

/* ─────────────── GET ─────────────── */
export async function GET(_req: NextRequest, ctx: ParamsPromise<{ tableName: string; id: string }>) {
  const { tableName, id } = await ctx.params;

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
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e.message === "Unauthorized") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    console.error(e);
    return NextResponse.json({ error: "Error al actualizar registro" }, { status: 500 });
  }
}

/* ─────────────── DELETE ─────────────── */
export async function DELETE(_req: NextRequest, ctx: ParamsPromise<{ tableName: string; id: string }>) {
  const { tableName, id } = await ctx.params;

  try {
    await adminGuard();
    const deleted = await resourceService.delete(tableName, id);
    if (deleted === null) {
      return NextResponse.json({ error: `Recurso “${tableName}” no existe` }, { status: 404 });
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
