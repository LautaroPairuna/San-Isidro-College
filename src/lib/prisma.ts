import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing");

  // Algunos setups prefieren mariadb:// para el driver; si te falla, descomentá:
  // const adapterUrl = url.replace(/^mysql:\/\//, "mariadb://");
  // const adapter = new PrismaMariaDb(adapterUrl);

  const adapter = new PrismaMariaDb(url);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
}

/**
 * Proxy: evita que Prisma se construya al importar el módulo.
 * Se construye recién cuando accedés a prisma.<algo>.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!global.__prisma) {
      // Si alguien intenta usar Prisma DURANTE el build sin env, damos error claro.
      if (!process.env.DATABASE_URL && process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
        throw new Error(
          "Prisma was accessed during next build, but DATABASE_URL is not set. " +
            "Set DATABASE_URL for build or avoid DB access at build time."
        );
      }
      global.__prisma = createClient();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (global.__prisma as any)[prop];
  },
});

export default prisma;
