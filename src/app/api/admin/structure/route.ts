// src/app/api/admin/structure/route.ts

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type PrismaModel = { findMany: (args?: any) => Promise<any[]> }

/* Ahora sólo existen dos modelos en el schema: GrupoMedios y Medio */
const models: Record<string, PrismaModel> = {
  GrupoMedios: prisma.grupoMedios,
  Medio:       prisma.medio,
}

interface TableStructure {
  tableName: string
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  data: any[]
}

export async function GET(): Promise<Response> {
  try {
    const tableInfo: TableStructure[] = []

    for (const tableName of Object.keys(models)) {
      /* Obtenemos todos los registros de cada tabla */
      const data = await models[tableName].findMany()
      tableInfo.push({ tableName, data })
    }

    return new Response(JSON.stringify(tableInfo), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: 'Error fetching database structure' }),
      { status: 500 }
    )
  }
}
