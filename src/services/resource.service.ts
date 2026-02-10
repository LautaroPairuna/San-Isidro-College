import { prisma } from "@/lib/prisma";
import { fileService } from "./file.service";
import { GrupoMedios, Medio, Seccion, Prisma } from "@prisma/client";

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type AllowedModels = GrupoMedios | Medio | Seccion;
type TableName = "GrupoMedios" | "Medio" | "Seccion";

const SEARCH_CONFIG: Record<TableName, string[]> = {
  GrupoMedios: ["nombre"],
  Medio: ["textoAlternativo", "urlArchivo"],
  Seccion: ["titulo", "slug"],
};

const DEFAULT_ORDER: Record<TableName, { field: string; direction: "asc" | "desc" }> = {
  GrupoMedios: { field: "actualizadoEn", direction: "desc" },
  Medio: { field: "posicion", direction: "asc" },
  Seccion: { field: "orden", direction: "asc" },
};

const SORT_ALLOWLIST: Record<TableName, string[]> = {
  GrupoMedios: ["id", "nombre", "tipoGrupo", "creadoEn", "actualizadoEn"],
  Medio: ["id", "urlArchivo", "urlMiniatura", "textoAlternativo", "tipo", "posicion", "creadoEn", "actualizadoEn"],
  Seccion: ["id", "slug", "pagina", "orden", "tipo", "titulo", "creadoEn", "actualizadoEn"],
};

export function isValidTableName(name: string): name is TableName {
  return ["GrupoMedios", "Medio", "Seccion"].includes(name);
}

export const resourceService = {
  async listAll<T extends AllowedModels>(
    tableName: TableName,
    page = 1,
    limit = 1000,
    search?: string,
    filters?: Record<string, unknown>,
    sortBy?: string,
    order: "asc" | "desc" = "desc"
  ): Promise<PaginatedResult<T> | null> {
    const skip = (page - 1) * limit;

    // 1. Construir WHERE
    const whereConditions: Prisma.JsonObject[] = [];

    // Filtros exactos
    if (filters && Object.keys(filters).length > 0) {
      whereConditions.push(filters as Prisma.JsonObject);
    }

    // Búsqueda dinámica
    if (search) {
      const searchFields = SEARCH_CONFIG[tableName] || [];
      if (searchFields.length > 0) {
        whereConditions.push({
          OR: searchFields.map((field) => ({
            [field]: { contains: search },
          })),
        });
      }
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    // 2. Construir ORDER BY
    const orderBy: Record<string, "asc" | "desc"> = {};
    // const forbiddenFields = ["grupo", "medios", "medio", "propsJson"]; // Reemplazado por allowlist

    const validSortFields = SORT_ALLOWLIST[tableName] || [];
    
    if (sortBy && sortBy.trim().length > 0 && validSortFields.includes(sortBy)) {
      orderBy[sortBy] = order;
    } else {
      const defaultSort = DEFAULT_ORDER[tableName];
      if (defaultSort) {
        orderBy[defaultSort.field] = defaultSort.direction;
      }
    }

    console.log(`[ResourceService] Listing ${tableName} with orderBy:`, JSON.stringify(orderBy));

    try {
      // Prisma Client no permite "tableName" dinámico tipado fácilmente sin mapeo manual o delegados inseguros.
      // Usamos un switch exhaustivo para mantener tipado fuerte.
      let total = 0;
      let data: T[] = [];

      // Usamos 'any' en la desestructuración intermedia para evitar conflictos de PrismaPromise vs Promise
      // pero mantenemos la seguridad de tipos en el switch
      let rawData: unknown[];

      switch (tableName) {
        case "GrupoMedios":
          [total, rawData] = await prisma.$transaction([
            prisma.grupoMedios.count({ where }),
            prisma.grupoMedios.findMany({
              where,
              take: limit,
              skip,
              orderBy,
            }),
          ]);
          data = rawData as T[];
          break;
        case "Medio":
          [total, rawData] = await prisma.$transaction([
            prisma.medio.count({ where }),
            prisma.medio.findMany({
              where,
              take: limit,
              skip,
              orderBy,
            }),
          ]);
          data = rawData as T[];
          break;
        case "Seccion":
          [total, rawData] = await prisma.$transaction([
            prisma.seccion.count({ where }),
            prisma.seccion.findMany({
              where,
              take: limit,
              skip,
              orderBy,
            }),
          ]);
          data = rawData as T[];
          break;
        default:
          return null;
      }

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in listAll:", error);
      throw new Error("Error fetching data");
    }
  },

  async getOne(tableName: TableName, id: string | number): Promise<AllowedModels | null> {
    const key = Number(id);
    if (Number.isNaN(key)) return null;

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
  },

  async create(
    tableName: TableName,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    files?: { main?: Blob; thumb?: Blob }
  ): Promise<AllowedModels | null> {
    // Validación lógica de negocio
    if (tableName === "Medio" && data.grupoMediosId) {
      const grupoPadre = await prisma.grupoMedios.findUnique({
        where: { id: Number(data.grupoMediosId) },
        select: { tipoGrupo: true },
      });

      if (grupoPadre?.tipoGrupo === "UNICO") {
        const existing = await prisma.medio.count({
          where: { grupoMediosId: Number(data.grupoMediosId) },
        });
        if (existing >= 1) {
          throw new Error("Este grupo es “UNICO” y ya contiene un medio.");
        }
      }
    }

    // Manejo de archivos
    if (files?.main) {
      const hint = data.nombreArchivo || data.nombre || data.textoAlternativo || tableName;
      const saved = await fileService.saveFile(files.main, tableName, hint, files.thumb);

      data.urlArchivo = saved.filename;
      data.tipo = saved.tipo;
      if (saved.urlMiniatura) {
        data.urlMiniatura = saved.urlMiniatura;
      } else if (data.urlMiniatura === undefined) {
        data.urlMiniatura = null;
      }
    }

    delete data.nombreArchivo;

    // Casting explícito a tipos de creación de Prisma
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
  },

  async update(
    tableName: TableName,
    id: string | number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    files?: { main?: Blob; thumb?: Blob }
  ): Promise<AllowedModels | null> {
    const key = Number(id);
    if (Number.isNaN(key)) return null;

    const existing = await this.getOne(tableName, key);
    if (!existing) return null;

    if (files?.main) {
      // Cast seguro sabiendo que 'urlArchivo' existe en Medio/Grupo (si aplica)
      // Como AllowedModels es unión, verificamos propiedad
      if ("urlArchivo" in existing && existing.urlArchivo) {
        await fileService.deleteFile(existing.urlArchivo, tableName);
      }

      const hint = data.nombreArchivo || data.textoAlternativo || tableName;
      const saved = await fileService.saveFile(files.main, tableName, hint, files.thumb);

      data.urlArchivo = saved.filename;
      data.tipo = saved.tipo;
      if (saved.urlMiniatura) {
        data.urlMiniatura = saved.urlMiniatura;
      } else {
        data.urlMiniatura = null;
      }
    } else if (files?.thumb) {
      if ("urlMiniatura" in existing && existing.urlMiniatura) {
        await fileService.deleteFile(existing.urlMiniatura, tableName);
      }
    }

    delete data.nombreArchivo;

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
  },

  async delete(tableName: TableName, id: string | number): Promise<AllowedModels | null> {
    const key = Number(id);
    if (Number.isNaN(key)) return null;

    const existing = await this.getOne(tableName, key);
    if (!existing) return null;

    if ("urlArchivo" in existing && existing.urlArchivo) {
      await fileService.deleteFile(existing.urlArchivo, tableName);
    }
    if (
      "urlMiniatura" in existing &&
      existing.urlMiniatura &&
      "urlArchivo" in existing &&
      existing.urlMiniatura !== existing.urlArchivo
    ) {
      await fileService.deleteFile(existing.urlMiniatura, tableName);
    }

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
  },
};
