import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaMariaDb(process.env.DATABASE_URL ?? "")
const prisma = new PrismaClient({ adapter })

type SeedSection = {
  slug: string
  pagina: string
  orden: number
  tipo: "GALERIA" | "MEDIA_UNICA" | "TEXTO_RICO" | "HERO" | "CUSTOM"
  grupoId?: number
  medioId?: number
  titulo?: string
}

const SECTION_DEFAULTS: SeedSection[] = [
  { slug: "home-hero", pagina: "home", orden: 10, tipo: "GALERIA", grupoId: 4 },
  { slug: "home-bienvenida", pagina: "home", orden: 20, tipo: "GALERIA", grupoId: 5 },
  { slug: "home-infografia", pagina: "home", orden: 30, tipo: "GALERIA", grupoId: 6 },
  { slug: "home-sec3-background", pagina: "home", orden: 40, tipo: "GALERIA", grupoId: 7 },
  { slug: "home-alianzas", pagina: "home", orden: 50, tipo: "GALERIA", grupoId: 7 },
  { slug: "colegio-instalaciones", pagina: "colegio", orden: 10, tipo: "MEDIA_UNICA", medioId: 34 },
  { slug: "colegio-alianzas", pagina: "colegio", orden: 20, tipo: "GALERIA", grupoId: 7 },
  { slug: "academicos-kinder", pagina: "academicos", orden: 10, tipo: "MEDIA_UNICA", medioId: 1, titulo: "Kindergarten" },
  { slug: "academicos-primary", pagina: "academicos", orden: 20, tipo: "MEDIA_UNICA", medioId: 2, titulo: "Primary" },
  { slug: "academicos-secondary", pagina: "academicos", orden: 30, tipo: "MEDIA_UNICA", medioId: 3, titulo: "Secondary" },
  { slug: "academicos-alianzas", pagina: "academicos", orden: 40, tipo: "GALERIA", grupoId: 7, titulo: "Nuestras Alianzas" },
  { slug: "vida-estudiantil-hero", pagina: "vida-estudiantil", orden: 10, tipo: "GALERIA" },
  { slug: "vida-estudiantil-rugby", pagina: "vida-estudiantil", orden: 20, tipo: "GALERIA" },
  { slug: "vida-estudiantil-dojo", pagina: "vida-estudiantil", orden: 30, tipo: "GALERIA" },
  { slug: "vida-estudiantil-gym", pagina: "vida-estudiantil", orden: 40, tipo: "GALERIA" },
  { slug: "vida-estudiantil-bienestar", pagina: "vida-estudiantil", orden: 50, tipo: "GALERIA" },
  { slug: "vida-estudiantil-play", pagina: "vida-estudiantil", orden: 60, tipo: "GALERIA" },
  { slug: "academicos-mas-info-alianzas", pagina: "academicos-mas-info", orden: 10, tipo: "GALERIA", grupoId: 7 },
  { slug: "vida-estudiantil-mas-info-alianzas", pagina: "vida-estudiantil-mas-info", orden: 10, tipo: "GALERIA", grupoId: 7 },
] 

async function upsertSectionPreservingAssignments(section: SeedSection) {
  const existing = await prisma.seccion.findUnique({
    where: { slug: section.slug },
    select: { id: true, grupoId: true, medioId: true },
  })

  if (!existing) {
    await prisma.seccion.create({
      data: {
        slug: section.slug,
        pagina: section.pagina,
        orden: section.orden,
        tipo: section.tipo,
        titulo: section.titulo ?? null,
        grupoId: section.grupoId ?? null,
        medioId: section.medioId ?? null,
      },
    })
    return { action: "created", slug: section.slug }
  }

  const updateData: {
    pagina: string
    orden: number
    tipo: SeedSection["tipo"]
    titulo: string | null
    grupoId?: number
    medioId?: number
  } = {
    pagina: section.pagina,
    orden: section.orden,
    tipo: section.tipo,
    titulo: section.titulo ?? null,
  }

  if (existing.grupoId === null && typeof section.grupoId === "number") {
    updateData.grupoId = section.grupoId
  }

  if (existing.medioId === null && typeof section.medioId === "number") {
    updateData.medioId = section.medioId
  }

  await prisma.seccion.update({
    where: { slug: section.slug },
    data: updateData,
  })

  return { action: "updated", slug: section.slug }
}

async function main() {
  const results = []

  for (const section of SECTION_DEFAULTS) {
    const result = await upsertSectionPreservingAssignments(section)
    results.push(result)
  }

  const created = results.filter(r => r.action === "created").length
  const updated = results.filter(r => r.action === "updated").length
  console.log(`Secciones seed completado: created=${created}, updated=${updated}, total=${results.length}`)
}

main()
  .catch(error => {
    console.error("Error ejecutando seed de secciones:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
