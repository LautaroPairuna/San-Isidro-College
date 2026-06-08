import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

type PageContentCache = Record<string, PageContentSection[]>;
type MediaGroupCache = Record<string, MediaGroupMedios>;

const PAGE_CONTENT_CACHE_FILE =
  process.env.PAGE_CONTENT_CACHE_FILE ||
  path.join(/*turbopackIgnore: true*/ process.cwd(), ".runtime", "page-content-cache.json");

const MEDIA_GROUP_CACHE_FILE =
  process.env.MEDIA_GROUP_CACHE_FILE ||
  path.join(/*turbopackIgnore: true*/ process.cwd(), ".runtime", "media-group-cache.json");

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

async function fetchMediaGroupFromDb(groupName: string) {
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

export type MediaGroupMedios = Awaited<ReturnType<typeof fetchMediaGroupFromDb>>;

const globalForPageContentCache = globalThis as typeof globalThis & {
  pageContentMemoryCache?: Map<string, PageContentSection[]>;
  mediaGroupMemoryCache?: Map<string, MediaGroupMedios>;
};

const pageContentMemoryCache =
  globalForPageContentCache.pageContentMemoryCache ??
  new Map<string, PageContentSection[]>();

if (!globalForPageContentCache.pageContentMemoryCache) {
  globalForPageContentCache.pageContentMemoryCache = pageContentMemoryCache;
}

const mediaGroupMemoryCache =
  globalForPageContentCache.mediaGroupMemoryCache ??
  new Map<string, MediaGroupMedios>();

if (!globalForPageContentCache.mediaGroupMemoryCache) {
  globalForPageContentCache.mediaGroupMemoryCache = mediaGroupMemoryCache;
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

async function readMediaGroupCache(): Promise<MediaGroupCache> {
  try {
    const content = await fs.readFile(MEDIA_GROUP_CACHE_FILE, "utf-8");
    const parsed = JSON.parse(content) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as MediaGroupCache;
    }
    return {};
  } catch {
    return {};
  }
}

async function writeMediaGroupCache(cache: MediaGroupCache) {
  await ensureCacheDir();
  await fs.writeFile(MEDIA_GROUP_CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
}

async function setCachedMediaGroup(groupName: string, medios: MediaGroupMedios) {
  mediaGroupMemoryCache.set(groupName, medios);
  const cache = await readMediaGroupCache();
  cache[groupName] = medios;
  await writeMediaGroupCache(cache);
}

async function getCachedMediaGroup(groupName: string): Promise<MediaGroupMedios> {
  const memoryCached = mediaGroupMemoryCache.get(groupName);
  if (memoryCached) {
    return memoryCached;
  }

  const cache = await readMediaGroupCache();
  const medios = cache[groupName];
  if (Array.isArray(medios)) {
    mediaGroupMemoryCache.set(groupName, medios);
    return medios;
  }

  return [];
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

/**
 * Fuente de verdad: la base de datos.
 * La caché en disco/memoria es SÓLO un respaldo para cuando la DB no responde
 * (p. ej. la DB está caída). En operación normal siempre se lee de la DB y se
 * refresca la caché con el resultado, así el respaldo nunca queda obsoleto.
 */
export async function getPageContentForSlug(pageSlug: string): Promise<PageContentSection[]> {
  try {
    const sections = await fetchPageFromDb(pageSlug);
    // Refrescamos la caché con lo último de la DB (incluso si está vacío,
    // para no servir contenido fantasma de un estado anterior).
    await setCachedPageContent(pageSlug, sections);
    return sections;
  } catch (error) {
    console.error(
      `[pageContentCache] DB no disponible para "${pageSlug}", usando caché de respaldo:`,
      error
    );
    const cached = await getCachedPageContent(pageSlug);
    return cached ?? [];
  }
}

export async function getMediaGroupByName(groupName: string): Promise<MediaGroupMedios> {
  try {
    const medios = await fetchMediaGroupFromDb(groupName);
    await setCachedMediaGroup(groupName, medios);
    return medios;
  } catch (error) {
    console.error(
      `[pageContentCache] DB no disponible para grupo "${groupName}", usando caché de respaldo:`,
      error
    );
    return getCachedMediaGroup(groupName);
  }
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
