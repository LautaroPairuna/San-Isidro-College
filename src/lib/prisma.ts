import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { Prisma, PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Limita el pool de conexiones del driver mariadb (default: 10). Un sitio de
// este tamaño no necesita más de 5, y cada conexión abierta retiene buffers.
// Se respeta el valor si ya viene definido en la propia DATABASE_URL.
function withConnectionLimit(url: string): string {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("connectionLimit")) {
      parsed.searchParams.set("connectionLimit", "5");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

const adapter = new PrismaMariaDb(withConnectionLimit(process.env.DATABASE_URL ?? ""));
const prismaLogs: Prisma.LogLevel[] =
  process.env.PRISMA_LOG_QUERIES === "true"
    ? ["query", "error", "warn"]
    : ["error", "warn"];

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: prismaLogs,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
