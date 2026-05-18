import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const adapter = new PrismaMariaDb(process.env.DATABASE_URL ?? "");
const prismaLogs =
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
