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

const media = (
  key: string,
  urlArchivo: string,
  tipo: SeedMedio["tipo"],
  posicion: number,
  textoAlternativo: string,
  urlMiniatura?: string | null
): SeedMedio => ({ key, urlArchivo, tipo, posicion, textoAlternativo, urlMiniatura })

const group = (
  key: string,
  nombre: string,
  tipoGrupo: SeedGrupo["tipoGrupo"],
  medios: SeedMedio[]
): SeedGrupo => ({ key, nombre, tipoGrupo, medios })

const section = (
  slug: string,
  pagina: string,
  orden: number,
  tipo: SeedSection["tipo"],
  opts?: Pick<SeedSection, "grupoKey" | "medioKey" | "titulo">
): SeedSection => ({ slug, pagina, orden, tipo, ...opts })

const HOME_GROUPS: SeedGrupo[] = [
  group("g-home-hero", "Home - Hero", "CARRUSEL", [
    media("m-home-hero-1", "fondo-home.webp", "IMAGEN", 10, "Hero home 1"),
    media("m-home-hero-2", "fondo-home.webp", "IMAGEN", 20, "Hero home 2"),
    media("m-home-hero-3", "fondo-home.webp", "IMAGEN", 30, "Hero home 3"),
  ]),
  group("g-home-bienvenida", "Home - Bienvenida", "CARRUSEL", [
    media("m-home-bienvenida-1", "fondo-bienvenida.webp", "IMAGEN", 10, "Bienvenida 1"),
    media("m-home-bienvenida-2", "fondo-bienvenida.webp", "IMAGEN", 20, "Bienvenida 2"),
    media("m-home-bienvenida-3", "fondo-bienvenida.webp", "IMAGEN", 30, "Bienvenida 3"),
  ]),
  group("g-home-infografia", "Home - Infografia", "CARRUSEL", [
    media("m-home-ico-extranjeros", "ico-alumnos-extranjeros.svg", "ICONO", 10, "Ícono alumnos extranjeros"),
    media("m-home-ico-alumnos", "ico-alumnos.svg", "ICONO", 20, "Ícono alumnos"),
    media("m-home-ico-certificados", "ico-certificados-internacionales.svg", "ICONO", 30, "Ícono certificados internacionales"),
    media("m-home-ico-hectareas", "ico-hectarias.svg", "ICONO", 40, "Ícono hectáreas"),
    media("m-home-ico-m2", "ico-m3-construidos.svg", "ICONO", 50, "Ícono m2 construidos"),
  ]),
  group("g-home-sec3-background", "Home - Seccion 3 Background", "UNICO", [
    media("m-home-sec3-background", "fondo-iconos.webp", "IMAGEN", 10, "Background sección 3"),
  ]),
]

const SHARED_GROUPS: SeedGrupo[] = [
  group("g-alianzas", "Alianzas", "CARRUSEL", [
    media("m-alianza-iram", "logo-iram.svg", "IMAGEN", 10, "IRAM"),
    media("m-alianza-iqnet", "logo-iqnet.svg", "IMAGEN", 20, "IQNet"),
    media("m-alianza-cambridge", "logo-university-of-cambridge.svg", "IMAGEN", 30, "Cambridge"),
    media("m-alianza-science", "science-bits-logo.webp", "IMAGEN", 40, "Science Bits"),
    media("m-alianza-google", "google-education-logo.webp", "IMAGEN", 50, "Google Education"),
    media("m-alianza-epea", "epea-logo.webp", "IMAGEN", 60, "EPEA"),
  ]),
]

const COLEGIO_GROUPS: SeedGrupo[] = [
  group("g-colegio-instalaciones", "Colegio - Instalaciones", "UNICO", [
    media("m-colegio-instalaciones-video", "video-de-instalaciones-20260104-184512.mp4", "VIDEO", 10, "Video de instalaciones"),
  ]),
]

const ACADEMICOS_GROUPS: SeedGrupo[] = [
  group("g-academicos-kinder", "Academicos - Kindergarten", "UNICO", [
    media("m-academicos-kinder", "banner-kindergarten-20250602-210920.webp", "IMAGEN", 10, "Banner Kindergarten"),
  ]),
  group("g-academicos-primary", "Academicos - Primary", "UNICO", [
    media("m-academicos-primary", "banner-primary-20250602-202252.webp", "IMAGEN", 10, "Banner Primary"),
  ]),
  group("g-academicos-secondary", "Academicos - Secondary", "UNICO", [
    media("m-academicos-secondary", "banner-secondary-20250602-202322.webp", "IMAGEN", 10, "Banner Secondary"),
  ]),
]

const VIDA_ESTUDIANTIL_GROUPS: SeedGrupo[] = [
  group("g-vida-hero", "Vida Estudiantil - Hero", "CARRUSEL", [
    media("m-vida-hero-1", "banner-deportes-20250603-004842.webp", "IMAGEN", 10, "Vida estudiantil hero 1", "thumbs/banner-deportes-20250603-004842.webp"),
    media("m-vida-hero-2", "banner-deportes-2-20250603-004919.webp", "IMAGEN", 20, "Vida estudiantil hero 2", "thumbs/banner-deportes-2-20250603-004919.webp"),
    media("m-vida-hero-3", "banner-deportes-3-20250603-005009.webp", "IMAGEN", 30, "Vida estudiantil hero 3", "thumbs/banner-deportes-3-20250603-005009.webp"),
  ]),
  group("g-vida-rugby", "Vida Estudiantil - Rugby Hockey", "CARRUSEL", [
    media("m-vida-rugby-1", "foto-hockey-20250603-005057.webp", "IMAGEN", 10, "Rugby y hockey 1", "thumbs/foto-hockey-20250603-005057.webp"),
    media("m-vida-rugby-2", "foto-hockey-2-20250603-005124.webp", "IMAGEN", 20, "Rugby y hockey 2", "thumbs/foto-hockey-2-20250603-005124.webp"),
    media("m-vida-rugby-3", "foto-hockey-3-20250603-005153.webp", "IMAGEN", 30, "Rugby y hockey 3", "thumbs/foto-hockey-3-20250603-005153.webp"),
  ]),
  group("g-vida-dojo", "Vida Estudiantil - Dojo", "CARRUSEL", [
    media("m-vida-dojo-1", "foto-dojo-20250603-005232.webp", "IMAGEN", 10, "Dojo 1", "thumbs/foto-dojo-20250603-005232.webp"),
    media("m-vida-dojo-2", "foto-dojo-2-20250603-005253.webp", "IMAGEN", 20, "Dojo 2", "thumbs/foto-dojo-2-20250603-005253.webp"),
    media("m-vida-dojo-3", "foto-dojo-3-20250603-005319.webp", "IMAGEN", 30, "Dojo 3", "thumbs/foto-dojo-3-20250603-005319.webp"),
  ]),
  group("g-vida-gym", "Vida Estudiantil - Gym", "CARRUSEL", [
    media("m-vida-gym-1", "foto-balance-1-20260217-194502.webp", "IMAGEN", 10, "Gym 1", "thumbs/foto-balance-1-thumb-20260217-194502.webp"),
    media("m-vida-gym-2", "foto-balance-2-20260217-194547.webp", "IMAGEN", 20, "Gym 2", "thumbs/foto-balance-2-thumb-20260217-194547.webp"),
    media("m-vida-gym-3", "foto-balance-3-20260217-194614.webp", "IMAGEN", 30, "Gym 3", "thumbs/foto-balance-3-thumb-20260217-194614.webp"),
  ]),
  group("g-vida-bienestar", "Vida Estudiantil - Bienestar", "CARRUSEL", [
    media("m-vida-bienestar-1", "foto-estudiantil-20250603-005440.webp", "IMAGEN", 10, "Bienestar 1", "thumbs/foto-estudiantil-20250603-005440.webp"),
    media("m-vida-bienestar-2", "foto-estudiantil-2-20250603-005502.webp", "IMAGEN", 20, "Bienestar 2", "thumbs/foto-estudiantil-2-20250603-005502.webp"),
    media("m-vida-bienestar-3", "foto-estudiantil-3-20250603-005527.webp", "IMAGEN", 30, "Bienestar 3", "thumbs/foto-estudiantil-3-20250603-005527.webp"),
  ]),
  group("g-vida-play", "Vida Estudiantil - Play", "CARRUSEL", [
    media("m-vida-play-1", "foto-isidro-play-20250603-005601.webp", "IMAGEN", 10, "SIC Play 1", "thumbs/foto-isidro-play-20250603-005601.webp"),
    media("m-vida-play-2", "foto-isidro-play-2-20250603-005640.webp", "IMAGEN", 20, "SIC Play 2", "thumbs/foto-isidro-play-2-20250603-005640.webp"),
    media("m-vida-play-3", "foto-isidro-play-3-20250603-005706.webp", "IMAGEN", 30, "SIC Play 3", "thumbs/foto-isidro-play-3-20250603-005706.webp"),
  ]),
]

const ACADEMICOS_MAS_INFO_GROUPS: SeedGrupo[] = [
  group("g-academicos-cards", "Academicos Mas Info - Cards Proyecto de Vida", "GALERIA", [
    media("m-card-icon-persona", "ico-centro-proyecto.svg", "ICONO", 10, "Icono card persona"),
    media("m-card-icon-ciudadanos", "ico-ciudadanos-globales.svg", "ICONO", 20, "Icono card ciudadanos globales"),
    media("m-card-icon-innovacion", "ico-innovacion-tecnologia.svg", "ICONO", 30, "Icono card innovación y tecnología"),
    media("m-card-icon-deportes", "ico-deportes.svg", "ICONO", 40, "Icono card deportes"),
    media("m-card-icon-artes", "ico-artes.svg", "ICONO", 50, "Icono card artes"),
    media("m-card-icon-sustentabilidad", "ico-sustentabilidad.svg", "ICONO", 60, "Icono card sustentabilidad"),
    media("m-card-icon-bienestar", "ico-bienestar.svg", "ICONO", 70, "Icono card bienestar"),
    media("m-card-image-persona", "centro-proyecto.png", "IMAGEN", 110, "Card persona"),
    media("m-card-image-ciudadanos", "ciudadanos-globales.png", "IMAGEN", 120, "Card ciudadanos globales"),
    media("m-card-image-innovacion", "innovacion-tecnologia.png", "IMAGEN", 130, "Card innovación y tecnología"),
    media("m-card-image-deportes", "deportes.png", "IMAGEN", 140, "Card deportes"),
    media("m-card-image-artes", "artes.png", "IMAGEN", 150, "Card artes"),
    media("m-card-image-sustentabilidad", "sustentabilidad.png", "IMAGEN", 160, "Card sustentabilidad"),
    media("m-card-image-bienestar", "bienestar.png", "IMAGEN", 170, "Card bienestar"),
  ]),
]

const GROUP_DEFAULTS: SeedGrupo[] = [
  ...HOME_GROUPS,
  ...SHARED_GROUPS,
  ...COLEGIO_GROUPS,
  ...ACADEMICOS_GROUPS,
  ...VIDA_ESTUDIANTIL_GROUPS,
  ...ACADEMICOS_MAS_INFO_GROUPS,
]

const HOME_SECTIONS: SeedSection[] = [
  section("home-hero", "home", 10, "GALERIA", { grupoKey: "g-home-hero" }),
  section("home-bienvenida", "home", 20, "GALERIA", { grupoKey: "g-home-bienvenida" }),
  section("home-infografia", "home", 30, "GALERIA", { grupoKey: "g-home-infografia" }),
  section("home-sec3-background", "home", 40, "GALERIA", { grupoKey: "g-home-sec3-background" }),
  section("home-alianzas", "home", 50, "GALERIA", { grupoKey: "g-alianzas" }),
]

const COLEGIO_SECTIONS: SeedSection[] = [
  section("colegio-instalaciones", "colegio", 10, "MEDIA_UNICA", { medioKey: "m-colegio-instalaciones-video" }),
  section("colegio-alianzas", "colegio", 20, "GALERIA", { grupoKey: "g-alianzas" }),
]

const ACADEMICOS_SECTIONS: SeedSection[] = [
  section("academicos-kinder", "academicos", 10, "MEDIA_UNICA", { medioKey: "m-academicos-kinder", titulo: "Kindergarten" }),
  section("academicos-primary", "academicos", 20, "MEDIA_UNICA", { medioKey: "m-academicos-primary", titulo: "Primary" }),
  section("academicos-secondary", "academicos", 30, "MEDIA_UNICA", { medioKey: "m-academicos-secondary", titulo: "Secondary" }),
  section("academicos-alianzas", "academicos", 40, "GALERIA", { grupoKey: "g-alianzas", titulo: "Nuestras Alianzas" }),
]

const VIDA_ESTUDIANTIL_SECTIONS: SeedSection[] = [
  section("vida-estudiantil-hero", "vida-estudiantil", 10, "GALERIA", { grupoKey: "g-vida-hero" }),
  section("vida-estudiantil-rugby", "vida-estudiantil", 20, "GALERIA", { grupoKey: "g-vida-rugby" }),
  section("vida-estudiantil-dojo", "vida-estudiantil", 30, "GALERIA", { grupoKey: "g-vida-dojo" }),
  section("vida-estudiantil-gym", "vida-estudiantil", 40, "GALERIA", { grupoKey: "g-vida-gym" }),
  section("vida-estudiantil-bienestar", "vida-estudiantil", 50, "GALERIA", { grupoKey: "g-vida-bienestar" }),
  section("vida-estudiantil-play", "vida-estudiantil", 60, "GALERIA", { grupoKey: "g-vida-play" }),
]

const MAS_INFO_SECTIONS: SeedSection[] = [
  section("academicos-mas-info-alianzas", "academicos-mas-info", 10, "GALERIA", { grupoKey: "g-alianzas" }),
  section("academicos-mas-info-cards", "academicos-mas-info", 20, "GALERIA", { grupoKey: "g-academicos-cards", titulo: "Cards Proyecto de Vida" }),
  section("vida-estudiantil-mas-info-alianzas", "vida-estudiantil-mas-info", 10, "GALERIA", { grupoKey: "g-alianzas" }),
]

const SECTION_DEFAULTS: SeedSection[] = [
  ...HOME_SECTIONS,
  ...COLEGIO_SECTIONS,
  ...ACADEMICOS_SECTIONS,
  ...VIDA_ESTUDIANTIL_SECTIONS,
  ...MAS_INFO_SECTIONS,
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
