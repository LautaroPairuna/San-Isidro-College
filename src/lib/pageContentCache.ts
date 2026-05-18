import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

type PageContentCache = Record<string, PageContentSection[]>;

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

export type PageContentSection = Awaited<ReturnType<typeof fetchPageFromDb>>[number];

const globalForPageContentCache = globalThis as typeof globalThis & {
  pageContentMemoryCache?: Map<string, PageContentSection[]>;
};

const pageContentMemoryCache =
  globalForPageContentCache.pageContentMemoryCache ??
  new Map<string, PageContentSection[]>();

if (!globalForPageContentCache.pageContentMemoryCache) {
  globalForPageContentCache.pageContentMemoryCache = pageContentMemoryCache;
}

function setMemoryCache(pageSlug: string, sections: PageContentSection[]) {
  pageContentMemoryCache.set(pageSlug, sections);
}

function hydrateMemoryCache(cache: PageContentCache) {
  pageContentMemoryCache.clear();
  for (const [pageSlug, sections] of Object.entries(cache)) {
    pageContentMemoryCache.set(pageSlug, sections);
  }
}

async function setCachedPageContent(pageSlug: string, sections: PageContentSection[]) {
  const cache = await readCache();
  cache[pageSlug] = sections;
  await writeCache(cache);
  setMemoryCache(pageSlug, sections);
}

export async function getCachedPageContent(pageSlug: string): Promise<PageContentSection[] | null> {
  const memoryCached = pageContentMemoryCache.get(pageSlug);
  if (memoryCached) {
    return memoryCached;
  }

  const cache = await readCache();
  const page = cache[pageSlug];
  if (Array.isArray(page)) {
    setMemoryCache(pageSlug, page);
    return page;
  }

  return null;
}

export async function getPageContentForSlug(pageSlug: string): Promise<PageContentSection[]> {
  const cached = await getCachedPageContent(pageSlug);
  if (cached) {
    return cached;
  }

  const sections = await fetchPageFromDb(pageSlug);
  if (sections.length > 0) {
    await setCachedPageContent(pageSlug, sections);
  }

  return sections;
}

export async function getMediaGroupByName(groupName: string) {
  const group = await prisma.grupoMedios.findFirst({
    where: { nombre: groupName },
    include: {
      medios: {
        orderBy: { posicion: "asc" },
      },
    },
  });

  return group?.medios ?? [];
}

export function invalidatePageContentMemoryCache(pageSlug?: string): void {
  if (pageSlug) {
    pageContentMemoryCache.delete(pageSlug);
    return;
  }

  pageContentMemoryCache.clear();
}

export async function refreshPageContentCacheForSlug(pageSlug: string): Promise<void> {
  const sections = await fetchPageFromDb(pageSlug);
  await setCachedPageContent(pageSlug, sections);
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
  hydrateMemoryCache(grouped);
}
