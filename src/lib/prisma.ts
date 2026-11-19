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
    // El driver deja abiertas todas las conexiones del pool aunque no se usen
    // (minimumIdle = connectionLimit). Así se cierran al minuto sin uso: la base
    // es compartida con otros sitios.
    if (!parsed.searchParams.has("minimumIdle")) {
      parsed.searchParams.set("minimumIdle", "0");
    }
    if (!parsed.searchParams.has("idleTimeout")) {
      parsed.searchParams.set("idleTimeout", "60");
    }
    // MySQL 8 sin SSL: sin esto, con la caché de autenticación vacía (después de
    // reiniciar MySQL) el driver no se puede autenticar.
    if (!parsed.searchParams.has("allowPublicKeyRetrieval")) {
      parsed.searchParams.set("allowPublicKeyRetrieval", "true");
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

// También en producción: un solo pool por proceso aunque el módulo se cargue
// desde más de un bundle.
export const prisma = (globalForPrisma.prisma ||= new PrismaClient({
  adapter,
  log: prismaLogs,
}));
