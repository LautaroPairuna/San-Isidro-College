import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

type PageContentCache = Record<string, unknown[]>;

const PAGE_CONTENT_CACHE_FILE =
  process.env.PAGE_CONTENT_CACHE_FILE ||
  path.join(/*turbopackIgnore: true*/ process.cwd(), ".runtime", "page-content-cache.json");

async function ensureCacheDir() {
  await fs.mkdir(path.dirname(PAGE_CONTENT_CACHE_FILE), { recursive: true });
}

async function readCache(): Promise<PageContentCache> {
  try {
    const content = await fs.readFile(PAGE_CONTENT_CACHE_FILE, "utf-8");
    const parsed = JSON.parse(content) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as PageContentCache;
    }
    return {};
  } catch {
    return {};
  }
}

async function writeCache(cache: PageContentCache) {
  await ensureCacheDir();
  await fs.writeFile(PAGE_CONTENT_CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
}

async function fetchPageFromDb(pageSlug: string) {
  return prisma.seccion.findMany({
    where: { pagina: pageSlug },
    include: {
      grupo: {
        include: {
          medios: {
            orderBy: { posicion: "asc" },
          },
        },
      },
      medio: true,
    },
    orderBy: { orden: "asc" },
  });
}

export async function getCachedPageContent(pageSlug: string): Promise<unknown[] | null> {
  const cache = await readCache();
  const page = cache[pageSlug];
  return Array.isArray(page) ? page : null;
}

export async function refreshPageContentCacheForSlug(pageSlug: string): Promise<void> {
  const sections = await fetchPageFromDb(pageSlug);
  const cache = await readCache();
  cache[pageSlug] = sections;
  await writeCache(cache);
}

export async function refreshPageContentCacheAll(): Promise<void> {
  const sections = await prisma.seccion.findMany({
    include: {
      grupo: {
        include: {
          medios: {
            orderBy: { posicion: "asc" },
          },
        },
      },
      medio: true,
    },
    orderBy: [{ pagina: "asc" }, { orden: "asc" }],
  });

  const grouped = sections.reduce<PageContentCache>((acc, section) => {
    const page = section.pagina;
    if (!acc[page]) acc[page] = [];
    acc[page].push(section);
    return acc;
  }, {});

  await writeCache(grouped);
}

