// src/app/api/admin/structure/route.ts
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TableStructure = {
  tableName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
};

export async function GET(): Promise<Response> {
  try {
    const [grupos, medios, secciones] = await Promise.all([
      prisma.grupoMedios.findMany(),
      prisma.medio.findMany(),
      prisma.seccion.findMany(),
    ]);

    const tableInfo: TableStructure[] = [
      { tableName: "GrupoMedios", data: grupos },
      { tableName: "Medio", data: medios },
      { tableName: "Seccion", data: secciones },
    ];

    return Response.json(tableInfo, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Error fetching database structure" },
      { status: 500 }
    );
  }
}
