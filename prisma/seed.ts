import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaMariaDb(process.env.DATABASE_URL ?? "")
const prisma = new PrismaClient({ adapter })

type SeedMedio = {
  key: string
  urlArchivo: string
  tipo: "IMAGEN" | "VIDEO" | "ICONO"
  posicion: number
  textoAlternativo?: string
  urlMiniatura?: string | null
}

type SeedGrupo = {
  key: string
  nombre: string
  tipoGrupo: "CARRUSEL" | "GALERIA" | "UNICO"
  medios: SeedMedio[]
}

type SeedSection = {
  slug: string
  pagina: string
  orden: number
  tipo: "GALERIA" | "MEDIA_UNICA" | "TEXTO_RICO" | "HERO" | "CUSTOM"
  grupoKey?: string
  medioKey?: string
  grupoId?: number
  medioId?: number
  titulo?: string
}

const GROUP_DEFAULTS: SeedGrupo[] = [
  {
    key: "g-home-hero",
    nombre: "Home - Hero",
    tipoGrupo: "CARRUSEL",
    medios: [
      { key: "m-home-hero-1", urlArchivo: "fondo-home.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Hero home 1" },
      { key: "m-home-hero-2", urlArchivo: "fondo-home.webp", tipo: "IMAGEN", posicion: 20, textoAlternativo: "Hero home 2" },
      { key: "m-home-hero-3", urlArchivo: "fondo-home.webp", tipo: "IMAGEN", posicion: 30, textoAlternativo: "Hero home 3" },
    ],
  },
  {
    key: "g-home-bienvenida",
    nombre: "Home - Bienvenida",
    tipoGrupo: "CARRUSEL",
    medios: [
      { key: "m-home-bienvenida-1", urlArchivo: "fondo-bienvenida.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Bienvenida 1" },
      { key: "m-home-bienvenida-2", urlArchivo: "fondo-bienvenida.webp", tipo: "IMAGEN", posicion: 20, textoAlternativo: "Bienvenida 2" },
      { key: "m-home-bienvenida-3", urlArchivo: "fondo-bienvenida.webp", tipo: "IMAGEN", posicion: 30, textoAlternativo: "Bienvenida 3" },
    ],
  },
  {
    key: "g-home-infografia",
    nombre: "Home - Infografia",
    tipoGrupo: "CARRUSEL",
    medios: [
      { key: "m-home-ico-extranjeros", urlArchivo: "ico-alumnos-extranjeros.svg", tipo: "ICONO", posicion: 10, textoAlternativo: "Ícono alumnos extranjeros" },
      { key: "m-home-ico-alumnos", urlArchivo: "ico-alumnos.svg", tipo: "ICONO", posicion: 20, textoAlternativo: "Ícono alumnos" },
      { key: "m-home-ico-certificados", urlArchivo: "ico-certificados-internacionales.svg", tipo: "ICONO", posicion: 30, textoAlternativo: "Ícono certificados internacionales" },
      { key: "m-home-ico-hectareas", urlArchivo: "ico-hectarias.svg", tipo: "ICONO", posicion: 40, textoAlternativo: "Ícono hectáreas" },
      { key: "m-home-ico-m2", urlArchivo: "ico-m3-construidos.svg", tipo: "ICONO", posicion: 50, textoAlternativo: "Ícono m2 construidos" },
    ],
  },
  {
    key: "g-home-sec3-background",
    nombre: "Home - Seccion 3 Background",
    tipoGrupo: "UNICO",
    medios: [
      { key: "m-home-sec3-background", urlArchivo: "fondo-iconos.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Background sección 3" },
    ],
  },
  {
    key: "g-alianzas",
    nombre: "Alianzas",
    tipoGrupo: "CARRUSEL",
    medios: [
      { key: "m-alianza-iram", urlArchivo: "logo-iram.svg", tipo: "IMAGEN", posicion: 10, textoAlternativo: "IRAM" },
      { key: "m-alianza-iqnet", urlArchivo: "logo-iqnet.svg", tipo: "IMAGEN", posicion: 20, textoAlternativo: "IQNet" },
      { key: "m-alianza-cambridge", urlArchivo: "logo-university-of-cambridge.svg", tipo: "IMAGEN", posicion: 30, textoAlternativo: "Cambridge" },
      { key: "m-alianza-science", urlArchivo: "science-bits-logo.webp", tipo: "IMAGEN", posicion: 40, textoAlternativo: "Science Bits" },
      { key: "m-alianza-google", urlArchivo: "google-education-logo.webp", tipo: "IMAGEN", posicion: 50, textoAlternativo: "Google Education" },
      { key: "m-alianza-epea", urlArchivo: "epea-logo.webp", tipo: "IMAGEN", posicion: 60, textoAlternativo: "EPEA" },
    ],
  },
  {
    key: "g-colegio-instalaciones",
    nombre: "Colegio - Instalaciones",
    tipoGrupo: "UNICO",
    medios: [
      { key: "m-colegio-instalaciones-video", urlArchivo: "video-de-instalaciones-20260104-184512.mp4", tipo: "VIDEO", posicion: 10, textoAlternativo: "Video de instalaciones" },
    ],
  },
  {
    key: "g-academicos-kinder",
    nombre: "Academicos - Kindergarten",
    tipoGrupo: "UNICO",
    medios: [
      { key: "m-academicos-kinder", urlArchivo: "banner-kindergarten-20250602-210920.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Banner Kindergarten" },
    ],
  },
  {
    key: "g-academicos-primary",
    nombre: "Academicos - Primary",
    tipoGrupo: "UNICO",
    medios: [
      { key: "m-academicos-primary", urlArchivo: "banner-primary-20250602-202252.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Banner Primary" },
    ],
  },
  {
    key: "g-academicos-secondary",
    nombre: "Academicos - Secondary",
    tipoGrupo: "UNICO",
    medios: [
      { key: "m-academicos-secondary", urlArchivo: "banner-secondary-20250602-202322.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Banner Secondary" },
    ],
  },
  {
    key: "g-vida-hero",
    nombre: "Vida Estudiantil - Hero",
    tipoGrupo: "CARRUSEL",
    medios: [
      { key: "m-vida-hero-1", urlArchivo: "banner-deportes-20250603-004842.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Vida estudiantil hero 1", urlMiniatura: "thumbs/banner-deportes-20250603-004842.webp" },
      { key: "m-vida-hero-2", urlArchivo: "banner-deportes-2-20250603-004919.webp", tipo: "IMAGEN", posicion: 20, textoAlternativo: "Vida estudiantil hero 2", urlMiniatura: "thumbs/banner-deportes-2-20250603-004919.webp" },
      { key: "m-vida-hero-3", urlArchivo: "banner-deportes-3-20250603-005009.webp", tipo: "IMAGEN", posicion: 30, textoAlternativo: "Vida estudiantil hero 3", urlMiniatura: "thumbs/banner-deportes-3-20250603-005009.webp" },
    ],
  },
  {
    key: "g-vida-rugby",
    nombre: "Vida Estudiantil - Rugby Hockey",
    tipoGrupo: "CARRUSEL",
    medios: [
      { key: "m-vida-rugby-1", urlArchivo: "foto-hockey-20250603-005057.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Rugby y hockey 1", urlMiniatura: "thumbs/foto-hockey-20250603-005057.webp" },
      { key: "m-vida-rugby-2", urlArchivo: "foto-hockey-2-20250603-005124.webp", tipo: "IMAGEN", posicion: 20, textoAlternativo: "Rugby y hockey 2", urlMiniatura: "thumbs/foto-hockey-2-20250603-005124.webp" },
      { key: "m-vida-rugby-3", urlArchivo: "foto-hockey-3-20250603-005153.webp", tipo: "IMAGEN", posicion: 30, textoAlternativo: "Rugby y hockey 3", urlMiniatura: "thumbs/foto-hockey-3-20250603-005153.webp" },
    ],
  },
  {
    key: "g-vida-dojo",
    nombre: "Vida Estudiantil - Dojo",
    tipoGrupo: "CARRUSEL",
    medios: [
      { key: "m-vida-dojo-1", urlArchivo: "foto-dojo-20250603-005232.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Dojo 1", urlMiniatura: "thumbs/foto-dojo-20250603-005232.webp" },
      { key: "m-vida-dojo-2", urlArchivo: "foto-dojo-2-20250603-005253.webp", tipo: "IMAGEN", posicion: 20, textoAlternativo: "Dojo 2", urlMiniatura: "thumbs/foto-dojo-2-20250603-005253.webp" },
      { key: "m-vida-dojo-3", urlArchivo: "foto-dojo-3-20250603-005319.webp", tipo: "IMAGEN", posicion: 30, textoAlternativo: "Dojo 3", urlMiniatura: "thumbs/foto-dojo-3-20250603-005319.webp" },
    ],
  },
  {
    key: "g-vida-gym",
    nombre: "Vida Estudiantil - Gym",
    tipoGrupo: "CARRUSEL",
    medios: [
      { key: "m-vida-gym-1", urlArchivo: "foto-balance-1-20260217-194502.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Gym 1", urlMiniatura: "thumbs/foto-balance-1-thumb-20260217-194502.webp" },
      { key: "m-vida-gym-2", urlArchivo: "foto-balance-2-20260217-194547.webp", tipo: "IMAGEN", posicion: 20, textoAlternativo: "Gym 2", urlMiniatura: "thumbs/foto-balance-2-thumb-20260217-194547.webp" },
      { key: "m-vida-gym-3", urlArchivo: "foto-balance-3-20260217-194614.webp", tipo: "IMAGEN", posicion: 30, textoAlternativo: "Gym 3", urlMiniatura: "thumbs/foto-balance-3-thumb-20260217-194614.webp" },
    ],
  },
  {
    key: "g-vida-bienestar",
    nombre: "Vida Estudiantil - Bienestar",
    tipoGrupo: "CARRUSEL",
    medios: [
      { key: "m-vida-bienestar-1", urlArchivo: "foto-estudiantil-20250603-005440.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "Bienestar 1", urlMiniatura: "thumbs/foto-estudiantil-20250603-005440.webp" },
      { key: "m-vida-bienestar-2", urlArchivo: "foto-estudiantil-2-20250603-005502.webp", tipo: "IMAGEN", posicion: 20, textoAlternativo: "Bienestar 2", urlMiniatura: "thumbs/foto-estudiantil-2-20250603-005502.webp" },
      { key: "m-vida-bienestar-3", urlArchivo: "foto-estudiantil-3-20250603-005527.webp", tipo: "IMAGEN", posicion: 30, textoAlternativo: "Bienestar 3", urlMiniatura: "thumbs/foto-estudiantil-3-20250603-005527.webp" },
    ],
  },
  {
    key: "g-vida-play",
    nombre: "Vida Estudiantil - Play",
    tipoGrupo: "CARRUSEL",
    medios: [
      { key: "m-vida-play-1", urlArchivo: "foto-isidro-play-20250603-005601.webp", tipo: "IMAGEN", posicion: 10, textoAlternativo: "SIC Play 1", urlMiniatura: "thumbs/foto-isidro-play-20250603-005601.webp" },
      { key: "m-vida-play-2", urlArchivo: "foto-isidro-play-2-20250603-005640.webp", tipo: "IMAGEN", posicion: 20, textoAlternativo: "SIC Play 2", urlMiniatura: "thumbs/foto-isidro-play-2-20250603-005640.webp" },
      { key: "m-vida-play-3", urlArchivo: "foto-isidro-play-3-20250603-005706.webp", tipo: "IMAGEN", posicion: 30, textoAlternativo: "SIC Play 3", urlMiniatura: "thumbs/foto-isidro-play-3-20250603-005706.webp" },
    ],
  },
  {
    key: "g-academicos-cards",
    nombre: "Academicos Mas Info - Cards Proyecto de Vida",
    tipoGrupo: "GALERIA",
    medios: [
      { key: "m-card-icon-persona", urlArchivo: "ico-centro-proyecto.svg", tipo: "ICONO", posicion: 10, textoAlternativo: "Icono card persona" },
      { key: "m-card-icon-ciudadanos", urlArchivo: "ico-ciudadanos-globales.svg", tipo: "ICONO", posicion: 20, textoAlternativo: "Icono card ciudadanos globales" },
      { key: "m-card-icon-innovacion", urlArchivo: "ico-innovacion-tecnologia.svg", tipo: "ICONO", posicion: 30, textoAlternativo: "Icono card innovación y tecnología" },
      { key: "m-card-icon-deportes", urlArchivo: "ico-deportes.svg", tipo: "ICONO", posicion: 40, textoAlternativo: "Icono card deportes" },
      { key: "m-card-icon-artes", urlArchivo: "ico-artes.svg", tipo: "ICONO", posicion: 50, textoAlternativo: "Icono card artes" },
      { key: "m-card-icon-sustentabilidad", urlArchivo: "ico-sustentabilidad.svg", tipo: "ICONO", posicion: 60, textoAlternativo: "Icono card sustentabilidad" },
      { key: "m-card-icon-bienestar", urlArchivo: "ico-bienestar.svg", tipo: "ICONO", posicion: 70, textoAlternativo: "Icono card bienestar" },
      { key: "m-card-image-persona", urlArchivo: "centro-proyecto.png", tipo: "IMAGEN", posicion: 110, textoAlternativo: "Card persona" },
      { key: "m-card-image-ciudadanos", urlArchivo: "ciudadanos-globales.png", tipo: "IMAGEN", posicion: 120, textoAlternativo: "Card ciudadanos globales" },
      { key: "m-card-image-innovacion", urlArchivo: "innovacion-tecnologia.png", tipo: "IMAGEN", posicion: 130, textoAlternativo: "Card innovación y tecnología" },
      { key: "m-card-image-deportes", urlArchivo: "deportes.png", tipo: "IMAGEN", posicion: 140, textoAlternativo: "Card deportes" },
      { key: "m-card-image-artes", urlArchivo: "artes.png", tipo: "IMAGEN", posicion: 150, textoAlternativo: "Card artes" },
      { key: "m-card-image-sustentabilidad", urlArchivo: "sustentabilidad.png", tipo: "IMAGEN", posicion: 160, textoAlternativo: "Card sustentabilidad" },
      { key: "m-card-image-bienestar", urlArchivo: "bienestar.png", tipo: "IMAGEN", posicion: 170, textoAlternativo: "Card bienestar" },
    ],
  },
]

const SECTION_DEFAULTS: SeedSection[] = [
  { slug: "home-hero", pagina: "home", orden: 10, tipo: "GALERIA", grupoKey: "g-home-hero" },
  { slug: "home-bienvenida", pagina: "home", orden: 20, tipo: "GALERIA", grupoKey: "g-home-bienvenida" },
  { slug: "home-infografia", pagina: "home", orden: 30, tipo: "GALERIA", grupoKey: "g-home-infografia" },
  { slug: "home-sec3-background", pagina: "home", orden: 40, tipo: "GALERIA", grupoKey: "g-home-sec3-background" },
  { slug: "home-alianzas", pagina: "home", orden: 50, tipo: "GALERIA", grupoKey: "g-alianzas" },
  { slug: "colegio-instalaciones", pagina: "colegio", orden: 10, tipo: "MEDIA_UNICA", medioKey: "m-colegio-instalaciones-video" },
  { slug: "colegio-alianzas", pagina: "colegio", orden: 20, tipo: "GALERIA", grupoKey: "g-alianzas" },
  { slug: "academicos-kinder", pagina: "academicos", orden: 10, tipo: "MEDIA_UNICA", medioKey: "m-academicos-kinder", titulo: "Kindergarten" },
  { slug: "academicos-primary", pagina: "academicos", orden: 20, tipo: "MEDIA_UNICA", medioKey: "m-academicos-primary", titulo: "Primary" },
  { slug: "academicos-secondary", pagina: "academicos", orden: 30, tipo: "MEDIA_UNICA", medioKey: "m-academicos-secondary", titulo: "Secondary" },
  { slug: "academicos-alianzas", pagina: "academicos", orden: 40, tipo: "GALERIA", grupoKey: "g-alianzas", titulo: "Nuestras Alianzas" },
  { slug: "vida-estudiantil-hero", pagina: "vida-estudiantil", orden: 10, tipo: "GALERIA", grupoKey: "g-vida-hero" },
  { slug: "vida-estudiantil-rugby", pagina: "vida-estudiantil", orden: 20, tipo: "GALERIA", grupoKey: "g-vida-rugby" },
  { slug: "vida-estudiantil-dojo", pagina: "vida-estudiantil", orden: 30, tipo: "GALERIA", grupoKey: "g-vida-dojo" },
  { slug: "vida-estudiantil-gym", pagina: "vida-estudiantil", orden: 40, tipo: "GALERIA", grupoKey: "g-vida-gym" },
  { slug: "vida-estudiantil-bienestar", pagina: "vida-estudiantil", orden: 50, tipo: "GALERIA", grupoKey: "g-vida-bienestar" },
  { slug: "vida-estudiantil-play", pagina: "vida-estudiantil", orden: 60, tipo: "GALERIA", grupoKey: "g-vida-play" },
  { slug: "academicos-mas-info-alianzas", pagina: "academicos-mas-info", orden: 10, tipo: "GALERIA", grupoKey: "g-alianzas" },
  { slug: "academicos-mas-info-cards", pagina: "academicos-mas-info", orden: 20, tipo: "GALERIA", grupoKey: "g-academicos-cards", titulo: "Cards Proyecto de Vida" },
  { slug: "vida-estudiantil-mas-info-alianzas", pagina: "vida-estudiantil-mas-info", orden: 10, tipo: "GALERIA", grupoKey: "g-alianzas" },
]

async function upsertGruposYMedios() {
  const groupIdByKey = new Map<string, number>()
  const mediaIdByKey = new Map<string, number>()

  let groupsCreated = 0
  let groupsUpdated = 0
  let mediaCreated = 0
  let mediaUpdated = 0
  let mediaDeleted = 0

  for (const group of GROUP_DEFAULTS) {
    const existingGroup = await prisma.grupoMedios.findUnique({
      where: { nombre: group.nombre },
      select: { id: true, tipoGrupo: true },
    })

    let groupId: number
    if (!existingGroup) {
      const createdGroup = await prisma.grupoMedios.create({
        data: { nombre: group.nombre, tipoGrupo: group.tipoGrupo },
        select: { id: true },
      })
      groupId = createdGroup.id
      groupsCreated += 1
    } else {
      groupId = existingGroup.id
      if (existingGroup.tipoGrupo !== group.tipoGrupo) {
        await prisma.grupoMedios.update({
          where: { id: existingGroup.id },
          data: { tipoGrupo: group.tipoGrupo },
        })
      }
      groupsUpdated += 1
    }

    groupIdByKey.set(group.key, groupId)

    const existingMedios = await prisma.medio.findMany({
      where: { grupoMediosId: groupId },
      select: { id: true },
      orderBy: [{ posicion: "asc" }, { id: "asc" }],
    })

    for (const [index, media] of group.medios.entries()) {
      const existingMedia = existingMedios[index]

      if (!existingMedia) {
        const createdMedia = await prisma.medio.create({
          data: {
            grupoMediosId: groupId,
            urlArchivo: media.urlArchivo,
            urlMiniatura: media.urlMiniatura ?? null,
            textoAlternativo: media.textoAlternativo ?? null,
            tipo: media.tipo,
            posicion: media.posicion,
          },
          select: { id: true },
        })
        mediaIdByKey.set(media.key, createdMedia.id)
        mediaCreated += 1
      } else {
        await prisma.medio.update({
          where: { id: existingMedia.id },
          data: {
            urlArchivo: media.urlArchivo,
            urlMiniatura: media.urlMiniatura ?? null,
            textoAlternativo: media.textoAlternativo ?? null,
            tipo: media.tipo,
            posicion: media.posicion,
          },
        })
        mediaIdByKey.set(media.key, existingMedia.id)
        mediaUpdated += 1
      }
    }

    const mediasToDelete = existingMedios.slice(group.medios.length)
    if (mediasToDelete.length > 0) {
      await prisma.medio.deleteMany({
        where: { id: { in: mediasToDelete.map(item => item.id) } },
      })
      mediaDeleted += mediasToDelete.length
    }
  }

  return {
    groupIdByKey,
    mediaIdByKey,
    groupsCreated,
    groupsUpdated,
    mediaCreated,
    mediaUpdated,
    mediaDeleted,
  }
}

function resolveSectionAssignments(section: SeedSection, groupIdByKey: Map<string, number>, mediaIdByKey: Map<string, number>): SeedSection {
  const resolved: SeedSection = { ...section }

  if (section.grupoKey) {
    const groupId = groupIdByKey.get(section.grupoKey)
    if (!groupId) {
      throw new Error(`No se encontró grupo para key=${section.grupoKey} en sección ${section.slug}`)
    }
    resolved.grupoId = groupId
  }

  if (section.medioKey) {
    const mediaId = mediaIdByKey.get(section.medioKey)
    if (!mediaId) {
      throw new Error(`No se encontró medio para key=${section.medioKey} en sección ${section.slug}`)
    }
    resolved.medioId = mediaId
  }

  return resolved
}


async function upsertSectionPreservingAssignments(section: SeedSection) {
  const existing = await prisma.seccion.findUnique({
    where: { slug: section.slug },
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

  if (typeof section.grupoId === "number") {
    updateData.grupoId = section.grupoId
  }

  if (typeof section.medioId === "number") {
    updateData.medioId = section.medioId
  }

  await prisma.seccion.update({
    where: { slug: section.slug },
    data: updateData,
  })

  return { action: "updated", slug: section.slug }
}

async function main() {
  const mediaResult = await upsertGruposYMedios()
  const results = []

  for (const section of SECTION_DEFAULTS) {
    const resolvedSection = resolveSectionAssignments(section, mediaResult.groupIdByKey, mediaResult.mediaIdByKey)
    const result = await upsertSectionPreservingAssignments(resolvedSection)
    results.push(result)
  }

  const created = results.filter(r => r.action === "created").length
  const updated = results.filter(r => r.action === "updated").length
  console.log(
    `Grupos seed completado: created=${mediaResult.groupsCreated}, updated=${mediaResult.groupsUpdated}, total=${GROUP_DEFAULTS.length}`
  )
  console.log(
    `Medios seed completado: created=${mediaResult.mediaCreated}, updated=${mediaResult.mediaUpdated}, total=${GROUP_DEFAULTS.reduce((acc, group) => acc + group.medios.length, 0)}`
  )
  console.log(`Medios eliminados por normalización exacta: deleted=${mediaResult.mediaDeleted}`)
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
