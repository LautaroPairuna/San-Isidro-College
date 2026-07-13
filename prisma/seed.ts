import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient, Prisma } from "../src/generated/prisma/client"

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
  subtitulo?: string
  propsJson?: Prisma.InputJsonValue
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
  opts?: Pick<SeedSection, "grupoKey" | "medioKey" | "titulo" | "subtitulo" | "propsJson">
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

const EXPERIENCIA_SIC_OVERVIEW_GROUPS: SeedGrupo[] = [
  group("g-exp-hero", "Experiencia SIC - Hero", "CARRUSEL", [
    media("m-exp-hero-1", "banner-deportes-20250603-004842.webp", "IMAGEN", 10, "Experiencia SIC hero 1", "thumbs/banner-deportes-20250603-004842.webp"),
    media("m-exp-hero-2", "banner-deportes-2-20250603-004919.webp", "IMAGEN", 20, "Experiencia SIC hero 2", "thumbs/banner-deportes-2-20250603-004919.webp"),
    media("m-exp-hero-3", "banner-deportes-3-20250603-005009.webp", "IMAGEN", 30, "Experiencia SIC hero 3", "thumbs/banner-deportes-3-20250603-005009.webp"),
  ]),
  group("g-exp-bienestar-carousel", "Experiencia SIC - Bienestar Carousel", "CARRUSEL", [
    media("m-exp-bienestar-carousel-1", "foto-hockey-20250603-005057.webp", "IMAGEN", 10, "Experiencia SIC bienestar 1", "thumbs/foto-hockey-20250603-005057.webp"),
    media("m-exp-bienestar-carousel-2", "foto-hockey-2-20250603-005124.webp", "IMAGEN", 20, "Experiencia SIC bienestar 2", "thumbs/foto-hockey-2-20250603-005124.webp"),
    media("m-exp-bienestar-carousel-3", "foto-hockey-3-20250603-005153.webp", "IMAGEN", 30, "Experiencia SIC bienestar 3", "thumbs/foto-hockey-3-20250603-005153.webp"),
  ]),
  group("g-exp-google-carousel", "Experiencia SIC - Google Carousel", "CARRUSEL", [
    media("m-exp-google-carousel-1", "foto-isidro-play-20250603-005601.webp", "IMAGEN", 10, "Experiencia SIC google 1", "thumbs/foto-isidro-play-20250603-005601.webp"),
    media("m-exp-google-carousel-2", "foto-isidro-play-2-20250603-005640.webp", "IMAGEN", 20, "Experiencia SIC google 2", "thumbs/foto-isidro-play-2-20250603-005640.webp"),
    media("m-exp-google-carousel-3", "foto-isidro-play-3-20250603-005706.webp", "IMAGEN", 30, "Experiencia SIC google 3", "thumbs/foto-isidro-play-3-20250603-005706.webp"),
  ]),
  group("g-exp-innovacion-carousel", "Experiencia SIC - Innovacion Carousel", "CARRUSEL", [
    media("m-exp-innovacion-carousel-1", "foto-estudiantil-20250603-005440.webp", "IMAGEN", 10, "Experiencia SIC innovacion 1", "thumbs/foto-estudiantil-20250603-005440.webp"),
    media("m-exp-innovacion-carousel-2", "foto-estudiantil-2-20250603-005502.webp", "IMAGEN", 20, "Experiencia SIC innovacion 2", "thumbs/foto-estudiantil-2-20250603-005502.webp"),
    media("m-exp-innovacion-carousel-3", "foto-estudiantil-3-20250603-005527.webp", "IMAGEN", 30, "Experiencia SIC innovacion 3", "thumbs/foto-estudiantil-3-20250603-005527.webp"),
  ]),
] 

const EXPERIENCIA_SIC_DETAIL_GROUPS: SeedGrupo[] = [
  group("g-exp-bienestar-cards", "Experiencia SIC - Bienestar Cards", "GALERIA", [
    media("m-exp-bienestar-icon-tutorias", "tutorias-ico.svg", "ICONO", 10, "Tutorias"),
    media("m-exp-bienestar-icon-educacion-emocional", "educacion-emocional-ico.svg", "ICONO", 20, "Educacion emocional"),
    media("m-exp-bienestar-icon-trabajo-familias", "trabajo-familia-ico.svg", "ICONO", 30, "Trabajo junto a las familias"),
    media("m-exp-bienestar-icon-desarrollo-integral", "desarrollo-integral-ico.svg", "ICONO", 40, "Desarrollo integral"),
    media("m-exp-bienestar-icon-sosten-emocional", "sosten-emocional-ico.svg", "ICONO", 50, "Sosten emocional"),
    media("m-exp-bienestar-icon-acompanamiento-psicopedagogico", "acompanamiento-pedagogico-ico.svg", "ICONO", 60, "Acompanamiento psicopedagogico"),
    media("m-exp-bienestar-icon-convivencia-escolar", "convivencia-escolar-ico.svg", "ICONO", 70, "Convivencia escolar"),
    media("m-exp-bienestar-icon-trabajo-interdisciplinario", "trabajo-interdisciplinario-ico.svg", "ICONO", 80, "Trabajo interdisciplinario"),
    media("m-exp-bienestar-card-1", "foto-estudiantil-20250603-005440.webp", "IMAGEN", 110, "Bienestar card 1", "thumbs/foto-estudiantil-20250603-005440.webp"),
    media("m-exp-bienestar-card-2", "foto-estudiantil-2-20250603-005502.webp", "IMAGEN", 120, "Bienestar card 2", "thumbs/foto-estudiantil-2-20250603-005502.webp"),
    media("m-exp-bienestar-card-3", "foto-dojo-2-20250603-005253.webp", "IMAGEN", 130, "Bienestar card 3", "thumbs/foto-dojo-2-20250603-005253.webp"),
    media("m-exp-bienestar-card-4", "foto-hockey-20250603-005057.webp", "IMAGEN", 140, "Bienestar card 4", "thumbs/foto-hockey-20250603-005057.webp"),
    media("m-exp-bienestar-card-5", "foto-hockey-2-20250603-005124.webp", "IMAGEN", 150, "Bienestar card 5", "thumbs/foto-hockey-2-20250603-005124.webp"),
    media("m-exp-bienestar-card-6", "foto-isidro-play-20250603-005601.webp", "IMAGEN", 160, "Bienestar card 6", "thumbs/foto-isidro-play-20250603-005601.webp"),
    media("m-exp-bienestar-card-7", "foto-balance-1-20260217-194502.webp", "IMAGEN", 170, "Bienestar card 7", "thumbs/foto-balance-1-20260217-194502.webp"),
    media("m-exp-bienestar-card-8", "foto-balance-2-20260217-194547.webp", "IMAGEN", 180, "Bienestar card 8", "thumbs/foto-balance-2-20260217-194547.webp"),
  ]),
  group("g-exp-google-logo", "Experiencia SIC - Google Logo", "UNICO", [
    media("m-exp-google-logo", "google-education-logo.webp", "IMAGEN", 10, "Google for Education logo"),
  ]),
  group("g-exp-google-students-icons", "Experiencia SIC - Google Students Icons", "GALERIA", [
    media("m-exp-google-student-collaborative", "aprendizaje-colaborativo-ico.svg", "ICONO", 10, "Aprendizaje colaborativo"),
    media("m-exp-google-student-citizenship", "ciudadania-digital-ico.svg", "ICONO", 20, "Ciudadania digital"),
    media("m-exp-google-student-creativity", "preparacion-futuro-2-ico.svg", "ICONO", 30, "Creatividad e innovacion"),
    media("m-exp-google-student-future", "preparacion-futuro-ico.svg", "ICONO", 40, "Preparacion para el futuro"),
  ]),
  group("g-exp-google-teachers-icons", "Experiencia SIC - Google Teachers Icons", "GALERIA", [
    media("m-exp-google-teacher-enhance", "potenciar-ensenanza-ico.svg", "ICONO", 10, "Potenciar la ensenanza"),
    media("m-exp-google-teacher-innovate", "innovar-confianza-ico.svg", "ICONO", 20, "Innovar con confianza"),
    media("m-exp-google-teacher-collaborate", "colaborar-crecer-ico.svg", "ICONO", 30, "Colaborar para crecer"),
    media("m-exp-google-teacher-inspire", "inspirar-alumnos-ico.svg", "ICONO", 40, "Inspirar a los alumnos"),
  ]),
  group("g-exp-google-apps", "Experiencia SIC - Google Apps", "GALERIA", [
    media("m-exp-google-app-drive", "google/drive-ico.svg", "ICONO", 10, "Drive"),
    media("m-exp-google-app-gemini", "google/gemini-ico.svg", "ICONO", 20, "Gemini"),
    media("m-exp-google-app-notebooklm", "google/notebook-lm-ico.svg", "ICONO", 30, "NotebookLM"),
    media("m-exp-google-app-calendar", "google/calendar-ico.svg", "ICONO", 40, "Calendar"),
    media("m-exp-google-app-sites", "google/sites-ico.svg", "ICONO", 50, "Sites"),
    media("m-exp-google-app-forms", "google/forms-ico.svg", "ICONO", 60, "Forms"),
    media("m-exp-google-app-gmail", "google/gmail-ico.svg", "ICONO", 70, "Gmail"),
    media("m-exp-google-app-classroom", "google/classroom-ico.svg", "ICONO", 80, "Classroom"),
    media("m-exp-google-app-sheets", "google/sheets-ico.svg", "ICONO", 90, "Sheets"),
    media("m-exp-google-app-docs", "google/docs-ico.svg", "ICONO", 100, "Docs"),
    media("m-exp-google-app-slides", "google/slides-ico.svg", "ICONO", 110, "Slides"),
  ]),
  group("g-exp-innovacion-students-icons", "Experiencia SIC - Innovacion Students Icons", "GALERIA", [
    media("m-exp-innovacion-student-creative", "pensamiento-creativo-ico.svg", "ICONO", 10, "Pensamiento creativo"),
    media("m-exp-innovacion-student-problem", "resolucion-problemas-ico.svg", "ICONO", 20, "Resolucion de problemas"),
    media("m-exp-innovacion-student-teamwork", "trabajo-equipo-ico.svg", "ICONO", 30, "Trabajo en equipo"),
    media("m-exp-innovacion-student-computational", "pensamiento-computacional-ico.svg", "ICONO", 40, "Pensamiento computacional"),
  ]),
  group("g-exp-innovacion-tools-icons", "Experiencia SIC - Innovacion Tools Icons", "GALERIA", [
    media("m-exp-innovacion-tool-robotica", "robotica-ico.svg", "ICONO", 10, "Robotica"),
    media("m-exp-innovacion-tool-programacion", "programacion-ico.svg", "ICONO", 20, "Programacion"),
    media("m-exp-innovacion-tool-electronica", "electronica-ico.svg", "ICONO", 30, "Electronica"),
    media("m-exp-innovacion-tool-diseno", "diseno-proyectos-ico.svg", "ICONO", 40, "Diseno de proyectos"),
    media("m-exp-innovacion-tool-prototipado", "prototipado-ico.svg", "ICONO", 50, "Prototipado"),
    media("m-exp-innovacion-tool-desafios", "resolucion-desafios-ico.svg", "ICONO", 60, "Resolucion de desafios"),
    media("m-exp-innovacion-tool-impresion", "impresion-3d-ico.svg", "ICONO", 70, "Impresion 3D"),
  ]),
]

const GROUP_DEFAULTS: SeedGrupo[] = [
  ...HOME_GROUPS,
  ...SHARED_GROUPS,
  ...COLEGIO_GROUPS,
  ...ACADEMICOS_GROUPS,
  ...VIDA_ESTUDIANTIL_GROUPS,
  ...ACADEMICOS_MAS_INFO_GROUPS,
  ...EXPERIENCIA_SIC_OVERVIEW_GROUPS,
  ...EXPERIENCIA_SIC_DETAIL_GROUPS,
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

const EXPERIENCIA_SIC_SECTIONS: SeedSection[] = [
  section("experiencia-sic-hero", "experiencia-sic", 10, "HERO", {
    grupoKey: "g-exp-hero",
    titulo: "Experiencia San Isidro",
    propsJson: {
      component: "hero",
      locales: {
        es: {
          title: "Experiencia San Isidro",
          description:
            "La experiencia de crecer, aprender y compartir va mucho mas alla del aula. En San Isidro College, cada actividad complementa la formacion academica y ofrece nuevas oportunidades para desarrollar talentos, fortalecer vinculos y disfrutar de una comunidad que inspira a crecer.",
        },
        en: {
          title: "San Isidro Experience",
          description:
            "The experience of growing, learning, and sharing goes far beyond the classroom. At San Isidro College, each activity complements academic development and creates new opportunities to build talents, strengthen bonds, and enjoy a community that inspires growth.",
        },
      },
    },
  }),
  section("experiencia-sic-bienestar-y-acompanamiento", "experiencia-sic", 20, "GALERIA", {
    grupoKey: "g-exp-bienestar-carousel",
    titulo: "Bienestar y Acompanamiento",
    propsJson: {
      component: "feature-card",
      overviewHash: "bienestar-y-acompanamiento",
      detailHref: "/experiencia-sic/bienestar-y-acompanamiento",
      locales: {
        es: {
          title: "Bienestar y Acompanamiento",
          description:
            "Creemos que cada alumno aprende mejor cuando se siente seguro, escuchado y acompanado. Por eso promovemos un entorno de confianza, respeto y cercania, donde el bienestar forma parte de la experiencia educativa de todos los dias.",
          readMore: "Leer mas",
        },
        en: {
          title: "Wellbeing and Guidance",
          description:
            "We believe every student learns better when they feel safe, heard, and supported. That is why we promote an environment of trust, respect, and closeness, where wellbeing is part of the educational experience every day.",
          readMore: "Read more",
        },
      },
    },
  }),
  section("experiencia-sic-google-reference-school", "experiencia-sic", 30, "GALERIA", {
    grupoKey: "g-exp-google-carousel",
    titulo: "Google Reference School",
    propsJson: {
      component: "feature-card",
      overviewHash: "google-reference-school",
      detailHref: "/experiencia-sic/google-reference-school",
      locales: {
        es: {
          title: "Google Reference School",
          description:
            "La innovacion forma parte de nuestra identidad desde el primer dia. Como Google Reference School, integramos la tecnologia de manera significativa para potenciar el aprendizaje, la creatividad y la colaboracion, preparando a nuestros alumnos para los desafios del futuro.",
          readMore: "Leer mas",
        },
        en: {
          title: "Google Reference School",
          description:
            "Innovation has been part of our identity from day one. As a Google Reference School, we integrate technology in meaningful ways to strengthen learning, creativity, and collaboration, preparing our students for the challenges of the future.",
          readMore: "Read more",
        },
      },
    },
  }),
  section("experiencia-sic-innovacion-y-robotica", "experiencia-sic", 40, "GALERIA", {
    grupoKey: "g-exp-innovacion-carousel",
    titulo: "Innovacion y Robotica",
    propsJson: {
      component: "feature-card",
      overviewHash: "innovacion-y-robotica",
      detailHref: "/experiencia-sic/innovacion-y-robotica",
      locales: {
        es: {
          title: "Innovacion y Robotica",
          description:
            "Un espacio donde las ideas se convierten en proyectos. Nuestro Laboratorio de Innovacion y Robotica invita a los alumnos a explorar, disenar, construir y experimentar, desarrollando habilidades para resolver los desafios del presente y del futuro.",
          readMore: "Leer mas",
        },
        en: {
          title: "Innovation and Robotics",
          description:
            "A space where ideas become projects. Our Innovation and Robotics Lab invites students to explore, design, build, and experiment, developing the skills to solve the challenges of the present and the future.",
          readMore: "Read more",
        },
      },
    },
  }),
]

const EXPERIENCIA_SIC_BIENESTAR_SECTIONS: SeedSection[] = [
  section("experiencia-sic-bienestar-intro", "experiencia-sic-bienestar-y-acompanamiento", 10, "TEXTO_RICO", {
    titulo: "Bienestar y Acompanamiento",
    subtitulo: "En San Isidro College entendemos que educar es acompanar.",
    propsJson: {
      component: "rich-text",
      locales: {
        es: {
          intro: {
            p1: "En San Isidro College entendemos que educar es acompanar. El bienestar de nuestros alumnos es un pilar de nuestra propuesta educativa, porque sabemos que sentirse contenido, seguro y escuchado es fundamental para aprender, crecer y desarrollar todo su potencial.",
          },
          philosophy: {
            title: "Una filosofia centrada en la persona",
            paragraphs: [
              "Creemos en una educacion que forme integralmente, contemplando tanto el desarrollo academico como el crecimiento emocional y social de cada estudiante.",
              "Por eso trabajamos para que cada alumno encuentre en el colegio un espacio de pertenencia, confianza y cuidado, donde pueda expresarse, vincularse con otros y construir una imagen positiva de si mismo.",
            ],
          },
        },
        en: {
          intro: {
            p1: "At San Isidro College, we understand that educating means accompanying. Our students wellbeing is a core pillar of our educational proposal, because feeling supported, safe, and heard is essential to learn, grow, and develop their full potential.",
          },
          philosophy: {
            title: "A philosophy centered on the person",
            paragraphs: [
              "We believe in an education that forms the whole person, considering both academic development and the emotional and social growth of each student.",
              "That is why we work so that every student finds at school a space of belonging, trust, and care, where they can express themselves, connect with others, and build a positive image of themselves.",
            ],
          },
        },
      },
    },
  }),
  section("experiencia-sic-bienestar-cards-1", "experiencia-sic-bienestar-y-acompanamiento", 20, "GALERIA", {
    grupoKey: "g-exp-bienestar-cards",
    titulo: "Tarjetas Bienestar - Grupo 1",
    propsJson: {
      component: "flip-cards",
      sourceGroup: "Experiencia SIC - Bienestar Cards",
      cardKeys: ["tutorias", "educacionEmocional", "trabajoFamilias", "desarrolloIntegral"],
    },
  }),
  section("experiencia-sic-bienestar-community", "experiencia-sic-bienestar-y-acompanamiento", 30, "TEXTO_RICO", {
    titulo: "Una comunidad que acompana",
    propsJson: {
      component: "rich-text",
      locales: {
        es: {
          title: "Una comunidad que acompana",
          paragraphs: [
            "El bienestar se construye todos los dias a traves del vinculo entre alumnos, docentes, tutores y familias. Por eso fomentamos una comunicacion cercana y un trabajo conjunto que permita sostener a cada estudiante en su recorrido escolar.",
            "Las tutorias, la educacion emocional y las acciones preventivas forman parte de una cultura institucional orientada al cuidado, el respeto y la convivencia.",
          ],
        },
        en: {
          title: "A community that supports",
          paragraphs: [
            "Wellbeing is built every day through the bond among students, teachers, tutors, and families. That is why we encourage close communication and joint work that supports each student throughout their school journey.",
            "Tutoring, emotional education, and preventive actions are part of an institutional culture oriented toward care, respect, and coexistence.",
          ],
        },
      },
    },
  }),
  section("experiencia-sic-bienestar-eoe", "experiencia-sic-bienestar-y-acompanamiento", 40, "TEXTO_RICO", {
    titulo: "Un acompanamiento profesional - Equipo de Orientacion Escolar (EOE)",
    propsJson: {
      component: "rich-text",
      locales: {
        es: {
          title: "Un acompanamiento profesional - Equipo de Orientacion Escolar (EOE)",
          paragraphs: [
            "Ademas del acompanamiento cotidiano que brindan docentes y tutores, San Isidro College cuenta con un Equipo de Orientacion Escolar integrado por profesionales de Psicologia y Psicopedagogia que acompanan las trayectorias de nuestros estudiantes y trabajan de manera articulada con las familias, los docentes y, cuando es necesario, con profesionales externos.",
          ],
        },
        en: {
          title: "Professional support - School Guidance Team (EOE)",
          paragraphs: [
            "In addition to the daily support provided by teachers and tutors, San Isidro College has a School Guidance Team made up of Psychology and Psychopedagogy professionals who support our students pathways and work in coordination with families, teachers, and, when necessary, external professionals.",
          ],
        },
      },
    },
  }),
  section("experiencia-sic-bienestar-cards-2", "experiencia-sic-bienestar-y-acompanamiento", 50, "GALERIA", {
    grupoKey: "g-exp-bienestar-cards",
    titulo: "Tarjetas Bienestar - Grupo 2",
    propsJson: {
      component: "flip-cards",
      sourceGroup: "Experiencia SIC - Bienestar Cards",
      cardKeys: ["sostenEmocional", "acompanamientoPsicopedagogico", "convivenciaEscolar", "trabajoInterdisciplinario"],
    },
  }),
  section("experiencia-sic-bienestar-closing", "experiencia-sic-bienestar-y-acompanamiento", 60, "TEXTO_RICO", {
    titulo: "Acompanar para crecer",
    propsJson: {
      component: "rich-text",
      locales: {
        es: {
          title: "Acompanar para crecer",
          paragraphs: [
            "En San Isidro College entendemos que cada alumno recorre un camino unico. Por eso promovemos una cultura del cuidado donde el bienestar, la cercania y el acompanamiento forman parte de la experiencia educativa de todos los dias. Nuestro compromiso es brindar a cada estudiante las herramientas, el apoyo y la confianza necesarios para crecer, aprender y desarrollar todo su potencial.",
          ],
        },
        en: {
          title: "Supporting growth",
          paragraphs: [
            "At San Isidro College, we understand that each student follows a unique path. That is why we promote a culture of care where wellbeing, closeness, and guidance are part of the educational experience every day. Our commitment is to provide each student with the tools, support, and confidence they need to grow, learn, and develop their full potential.",
          ],
        },
      },
    },
  }),
]

const EXPERIENCIA_SIC_GOOGLE_SECTIONS: SeedSection[] = [
  section("experiencia-sic-google-intro", "experiencia-sic-google-reference-school", 10, "TEXTO_RICO", {
    grupoKey: "g-exp-google-logo",
    titulo: "San Isidro College es Google Reference School",
    subtitulo: "Es un reconocimiento que distingue a instituciones educativas que integran la tecnologia de Google de manera innovadora para transformar la ensenanza y el aprendizaje.",
    propsJson: {
      component: "rich-text",
      sourceGroup: "Experiencia SIC - Google Logo",
      logoKey: "m-exp-google-logo",
      locales: {
        es: {
          intro: {
            p1: "Es un reconocimiento que distingue a instituciones educativas que integran la tecnologia de Google de manera innovadora para transformar la ensenanza y el aprendizaje.",
          },
          whatIs: {
            title: "Que es ser Google Reference School?",
            paragraphs: [
              "Ser Google Reference School significa formar parte de una comunidad internacional de instituciones que se destacan por utilizar la tecnologia como una herramienta para potenciar el aprendizaje, la creatividad y la colaboracion.",
              "Este reconocimiento refleja nuestro compromiso con una educacion innovadora, donde la tecnologia acompana el desarrollo de habilidades fundamentales para el presente y el futuro.",
            ],
          },
        },
        en: {
          intro: {
            p1: "It is a recognition that distinguishes educational institutions that integrate Google technology in innovative ways to transform teaching and learning.",
          },
          whatIs: {
            title: "What does it mean to be a Google Reference School?",
            paragraphs: [
              "Being a Google Reference School means being part of an international community of institutions that stand out for using technology as a tool to strengthen learning, creativity, and collaboration.",
              "This recognition reflects our commitment to innovative education, where technology supports the development of essential skills for the present and the future.",
            ],
          },
        },
      },
    },
  }),
  section("experiencia-sic-google-students", "experiencia-sic-google-reference-school", 20, "TEXTO_RICO", {
    grupoKey: "g-exp-google-students-icons",
    titulo: "Que significa para nuestros alumnos?",
    propsJson: {
      component: "icon-grid",
      sourceGroup: "Experiencia SIC - Google Students Icons",
      itemKeys: ["collaborativeLearning", "digitalCitizenship", "creativeThinking", "futureReady"],
      locales: {
        es: {
          title: "Que significa para nuestros alumnos?",
          items: {
            collaborativeLearning: {
              title: "Aprendizaje colaborativo",
              description: "Los alumnos trabajan en equipo utilizando herramientas digitales que favorecen la comunicacion y la construccion conjunta del conocimiento.",
            },
            digitalCitizenship: {
              title: "Ciudadania digital",
              description: "Aprenden a utilizar la tecnologia de manera responsable, etica y segura.",
            },
            creativeThinking: {
              title: "Creatividad e innovacion",
              description: "La tecnologia se convierte en un medio para crear, investigar, resolver problemas y desarrollar nuevas ideas.",
            },
            futureReady: {
              title: "Preparacion para el futuro",
              description: "Desarrollan competencias digitales que seran fundamentales en la universidad, el mundo laboral y los desafios del siglo XXI.",
            },
          },
        },
        en: {
          title: "What does it mean for our students?",
          items: {
            collaborativeLearning: {
              title: "Collaborative learning",
              description: "Students work as a team using digital tools that encourage communication and the shared construction of knowledge.",
            },
            digitalCitizenship: {
              title: "Digital citizenship",
              description: "They learn to use technology in a responsible, ethical, and safe way.",
            },
            creativeThinking: {
              title: "Creativity and innovation",
              description: "Technology becomes a means to create, investigate, solve problems, and develop new ideas.",
            },
            futureReady: {
              title: "Future readiness",
              description: "They develop digital competencies that will be essential in university, the workplace, and the challenges of the 21st century.",
            },
          },
        },
      },
    },
  }),
  section("experiencia-sic-google-teachers", "experiencia-sic-google-reference-school", 30, "TEXTO_RICO", {
    grupoKey: "g-exp-google-teachers-icons",
    titulo: "Que significa para nuestros docentes?",
    propsJson: {
      component: "icon-grid",
      sourceGroup: "Experiencia SIC - Google Teachers Icons",
      itemKeys: ["enhanceTeaching", "innovateWithConfidence", "collaborateToGrow", "inspireStudents"],
      locales: {
        es: {
          title: "Que significa para nuestros docentes?",
          items: {
            enhanceTeaching: {
              title: "Potenciar la ensenanza",
              description: "La tecnologia acompana el trabajo docente, ofreciendo nuevas herramientas para enriquecer cada experiencia de aprendizaje.",
            },
            innovateWithConfidence: {
              title: "Innovar con confianza",
              description: "Nuestros docentes reciben formacion y acompanamiento continuo para incorporar nuevas metodologias y aprovechar todo el potencial de las herramientas digitales.",
            },
            collaborateToGrow: {
              title: "Colaborar para crecer",
              description: "La planificacion compartida y el intercambio de recursos fortalecen el trabajo en equipo y promueven una comunidad profesional de aprendizaje.",
            },
            inspireStudents: {
              title: "Inspirar a los alumnos",
              description: "La innovacion comienza con docentes preparados para despertar la curiosidad, fomentar la creatividad y acompanar a cada estudiante en su desarrollo.",
            },
          },
        },
        en: {
          title: "What does it mean for our teachers?",
          items: {
            enhanceTeaching: {
              title: "Enhancing teaching",
              description: "Technology supports teachers work by offering new tools to enrich every learning experience.",
            },
            innovateWithConfidence: {
              title: "Innovating with confidence",
              description: "Our teachers receive ongoing training and support to incorporate new methodologies and make the most of digital tools.",
            },
            collaborateToGrow: {
              title: "Collaborating to grow",
              description: "Shared planning and resource exchange strengthen teamwork and promote a professional learning community.",
            },
            inspireStudents: {
              title: "Inspiring students",
              description: "Innovation begins with prepared teachers who spark curiosity, encourage creativity, and support each student in their development.",
            },
          },
        },
      },
    },
  }),
  section("experiencia-sic-google-technology", "experiencia-sic-google-reference-school", 40, "TEXTO_RICO", {
    titulo: "La tecnologia como parte del aprendizaje",
    propsJson: {
      component: "rich-text",
      locales: {
        es: {
          title: "La tecnologia como parte del aprendizaje",
          paragraphs: [
            "En San Isidro College la tecnologia no reemplaza al docente: potencia la ensenanza. Desde la apertura del colegio, la innovacion y las herramientas digitales forman parte de nuestra propuesta educativa. Google Workspace for Education acompana la experiencia diaria de alumnos y docentes, promoviendo un aprendizaje dinamico, colaborativo y organizado desde los primeros anos.",
          ],
        },
        en: {
          title: "Technology as part of learning",
          paragraphs: [
            "At San Isidro College, technology does not replace the teacher: it strengthens teaching. Since the school opened, innovation and digital tools have been part of our educational proposal. Google Workspace for Education supports the daily experience of students and teachers, promoting dynamic, collaborative, and organized learning from the earliest years.",
          ],
        },
      },
    },
  }),
  section("experiencia-sic-google-apps", "experiencia-sic-google-reference-school", 50, "TEXTO_RICO", {
    grupoKey: "g-exp-google-apps",
    titulo: "Google Workspace for Education",
    propsJson: {
      component: "apps-grid",
      sourceGroup: "Experiencia SIC - Google Apps",
      apps: ["drive", "gemini", "notebookLm", "calendar", "sites", "forms", "gmail", "classroom", "sheets", "docs", "slides"],
    },
  }),
  section("experiencia-sic-google-closing", "experiencia-sic-google-reference-school", 60, "TEXTO_RICO", {
    titulo: "Cierre",
    propsJson: {
      component: "rich-text",
      locales: {
        es: {
          paragraphs: [
            "En San Isidro College creemos que innovar no significa incorporar mas tecnologia, sino generar mejores oportunidades para aprender. Ser Google Reference School es el reflejo de ese compromiso con una educacion que prepara a nuestros alumnos para el mundo que viene.",
          ],
        },
        en: {
          paragraphs: [
            "At San Isidro College, we believe that innovating does not mean adding more technology, but creating better opportunities to learn. Being a Google Reference School reflects that commitment to an education that prepares our students for the world ahead.",
          ],
        },
      },
    },
  }),
]

const EXPERIENCIA_SIC_INNOVACION_SECTIONS: SeedSection[] = [
  section("experiencia-sic-innovacion-intro", "experiencia-sic-innovacion-y-robotica", 10, "TEXTO_RICO", {
    titulo: "Laboratorio de Innovacion y Robotica",
    subtitulo: "Un espacio donde las ideas se convierten en proyectos.",
    propsJson: {
      component: "rich-text",
      locales: {
        es: {
          lead: "Un espacio donde las ideas se convierten en proyectos.",
          paragraphs: [
            "En San Isidro College creemos que las mejores experiencias de aprendizaje nacen cuando los alumnos tienen la oportunidad de experimentar.",
            "Nuestro Laboratorio de Innovacion y Robotica es un espacio pensado para despertar la curiosidad, fomentar la creatividad y transformar las ideas en proyectos reales.",
            "A traves de desafios, experiencias practicas y trabajo colaborativo, los estudiantes desarrollan habilidades que trascienden el conocimiento tecnico y los preparan para un mundo en constante evolucion.",
          ],
        },
        en: {
          lead: "A space where ideas become projects.",
          paragraphs: [
            "At San Isidro College, we believe the best learning experiences happen when students have the opportunity to experiment.",
            "Our Innovation and Robotics Lab is designed to spark curiosity, encourage creativity, and turn ideas into real projects.",
            "Through challenges, hands-on experiences, and collaborative work, students develop skills that go beyond technical knowledge and prepare them for a constantly evolving world.",
          ],
        },
      },
    },
  }),
  section("experiencia-sic-innovacion-students", "experiencia-sic-innovacion-y-robotica", 20, "TEXTO_RICO", {
    grupoKey: "g-exp-innovacion-students-icons",
    titulo: "Que desarrollan nuestros alumnos?",
    propsJson: {
      component: "icon-grid",
      sourceGroup: "Experiencia SIC - Innovacion Students Icons",
      itemKeys: ["creativeThinking", "problemSolving", "teamwork", "computationalThinking"],
      locales: {
        es: {
          title: "Que desarrollan nuestros alumnos?",
          items: {
            creativeThinking: {
              title: "Pensamiento creativo",
              description: "Aprenden a imaginar, disenar y transformar ideas en soluciones innovadoras.",
            },
            problemSolving: {
              title: "Resolucion de problemas",
              description: "Analizan desafios, experimentan diferentes alternativas y encuentran soluciones mediante el ensayo y la mejora continua.",
            },
            teamwork: {
              title: "Trabajo en equipo",
              description: "Cada proyecto fomenta la colaboracion, la comunicacion y el aprendizaje compartido.",
            },
            computationalThinking: {
              title: "Pensamiento computacional",
              description: "Desarrollan habilidades de programacion, logica y secuenciacion para comprender como funciona la tecnologia y crear con ella.",
            },
          },
        },
        en: {
          title: "What do our students develop?",
          items: {
            creativeThinking: {
              title: "Creative thinking",
              description: "They learn to imagine, design, and transform ideas into innovative solutions.",
            },
            problemSolving: {
              title: "Problem solving",
              description: "They analyze challenges, test different alternatives, and find solutions through iteration and continuous improvement.",
            },
            teamwork: {
              title: "Teamwork",
              description: "Each project encourages collaboration, communication, and shared learning.",
            },
            computationalThinking: {
              title: "Computational thinking",
              description: "They develop programming, logic, and sequencing skills to understand how technology works and create with it.",
            },
          },
        },
      },
    },
  }),
  section("experiencia-sic-innovacion-lab", "experiencia-sic-innovacion-y-robotica", 30, "TEXTO_RICO", {
    titulo: "Un espacio para experimentar",
    propsJson: {
      component: "rich-text",
      locales: {
        es: {
          title: "Un espacio para experimentar",
          paragraphs: [
            "Nuestro laboratorio integra distintas herramientas y tecnologias para que los alumnos puedan investigar, construir y aprender de manera activa.",
          ],
        },
        en: {
          title: "A space to experiment",
          paragraphs: [
            "Our lab brings together different tools and technologies so students can investigate, build, and learn actively.",
          ],
        },
      },
    },
  }),
  section("experiencia-sic-innovacion-tools", "experiencia-sic-innovacion-y-robotica", 40, "TEXTO_RICO", {
    grupoKey: "g-exp-innovacion-tools-icons",
    titulo: "Herramientas del laboratorio",
    propsJson: {
      component: "tools-grid",
      sourceGroup: "Experiencia SIC - Innovacion Tools Icons",
      items: [
        { key: "robotics", labelEs: "Robotica", labelEn: "Robotics" },
        { key: "programming", labelEs: "Programacion", labelEn: "Programming" },
        { key: "electronics", labelEs: "Electronica", labelEn: "Electronics" },
        { key: "projectDesign", labelEs: "Diseno de proyectos", labelEn: "Project design" },
        { key: "prototyping", labelEs: "Prototipado", labelEn: "Prototyping" },
        { key: "challengeSolving", labelEs: "Resolucion de desafios", labelEn: "Challenge solving" },
        { key: "printing3d", labelEs: "Impresion 3D", labelEn: "3D printing" },
      ],
    },
  }),
  section("experiencia-sic-innovacion-closing", "experiencia-sic-innovacion-y-robotica", 50, "TEXTO_RICO", {
    titulo: "Cierre",
    propsJson: {
      component: "rich-text",
      locales: {
        es: {
          paragraphs: [
            "Nuestro Laboratorio de Innovacion y Robotica es una expresion del compromiso de San Isidro College con una educacion innovadora. En conjunto con nuestra propuesta tecnologica y nuestro reconocimiento como Google Reference School, este espacio impulsa a los alumnos a aprender, crear y desarrollar las habilidades que les permitiran desenvolverse con confianza en el mundo del manana.",
          ],
        },
        en: {
          paragraphs: [
            "Our Innovation and Robotics Lab expresses San Isidro College commitment to innovative education. Together with our technological proposal and our recognition as a Google Reference School, this space encourages students to learn, create, and develop the skills that will allow them to move confidently in the world of tomorrow.",
          ],
        },
      },
    },
  }),
]

const SECTION_DEFAULTS: SeedSection[] = [
  ...HOME_SECTIONS,
  ...COLEGIO_SECTIONS,
  ...ACADEMICOS_SECTIONS,
  ...VIDA_ESTUDIANTIL_SECTIONS,
  ...MAS_INFO_SECTIONS,
  ...EXPERIENCIA_SIC_SECTIONS,
  ...EXPERIENCIA_SIC_BIENESTAR_SECTIONS,
  ...EXPERIENCIA_SIC_GOOGLE_SECTIONS,
  ...EXPERIENCIA_SIC_INNOVACION_SECTIONS,
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
  const propsJsonValue = section.propsJson ?? Prisma.DbNull

  if (!existing) {
    const createData: Prisma.SeccionUncheckedCreateInput = {
      slug: section.slug,
      pagina: section.pagina,
      orden: section.orden,
      tipo: section.tipo,
      titulo: section.titulo ?? null,
      subtitulo: section.subtitulo ?? null,
      propsJson: propsJsonValue,
      grupoId: section.grupoId ?? null,
      medioId: section.medioId ?? null,
    }

    await prisma.seccion.create({
      data: createData,
    })
    return { action: "created", slug: section.slug }
  }

  const updateData: Prisma.SeccionUncheckedUpdateInput = {
    pagina: section.pagina,
    orden: section.orden,
    tipo: section.tipo,
    titulo: section.titulo ?? null,
    subtitulo: section.subtitulo ?? null,
    propsJson: propsJsonValue,
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
