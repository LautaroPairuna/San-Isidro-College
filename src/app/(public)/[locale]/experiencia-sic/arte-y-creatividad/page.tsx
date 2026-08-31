// /app/[locale]/experiencia-sic/arte-y-creatividad/page.tsx
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import TiraFotos from '@/components/TiraFotos'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPageContentForSlug, type PageContentSection } from '@/lib/pageContentCache'
import { BAJADA_PAGINA, TITULO_PAGINA, TITULO_SECCION } from '@/lib/tipografia'

/** Sección con las fotos de San Isidro Play, editable desde el admin. */
const PAGE_SLUG = 'experiencia-sic-arte-y-creatividad'
const PLAY_SECTION_SLUG = 'experiencia-sic-arte-play'

/** Los seis lenguajes, en el orden del diseño. Los íconos son los del repo. */
const LENGUAJES = [
  { key: 'artesVisuales', icon: 'lenguaje-artistico-1.svg' },
  { key: 'musica', icon: 'lenguaje-artistico-2.svg' },
  { key: 'practicaInstrumental', icon: 'lenguaje-artistico-3.svg' },
  { key: 'canto', icon: 'lenguaje-artistico-4.svg' },
  { key: 'teatro', icon: 'lenguaje-artistico-5.svg' },
  { key: 'danza', icon: 'lenguaje-artistico-6.svg' },
] as const

/** Fotos del repo para cuando el grupo del admin todavía está vacío. */
const PLAY_FALLBACK_IMAGES = [
  '/images/image-SIC-play.webp',
  '/images/Image-vida-estudiantil.webp',
  '/images/Image-SIC-dojo.webp',
]

type PageProps = {
  params: Promise<{ locale: string }>
}

// ISR: se renderiza una vez y se sirve desde caché (menos RAM/CPU por request).
// El admin regenera al instante con revalidatePath(); 1h es solo el respaldo.
export const revalidate = 3600

export default async function ExperienciaSicArtePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'experienciaSicArteDetail' })

  const secciones = await getPageContentForSlug(PAGE_SLUG)
  const playMedios = (
    secciones.find((seccion: PageContentSection) => seccion.slug === PLAY_SECTION_SLUG)?.grupo?.medios ?? []
  ).map((medio) => ({
    id: medio.id,
    urlArchivo: medio.urlArchivo,
    textoAlternativo: medio.textoAlternativo,
    tipo: medio.tipo,
    posicion: medio.posicion,
  }))

  return (
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="arte-y-creatividad" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className={TITULO_PAGINA}>{t('title')}</h1>
          <p className={`mt-3 ${BAJADA_PAGINA}`}>{t('intro.lead')}</p>
          <div className="mt-6 space-y-5 text-gray-700 leading-relaxed">
            <p>{t('intro.p1')}</p>
            <p>{t('intro.p2')}</p>
            <p>{t('intro.p3')}</p>
            <p>
              <strong className="font-bold text-[#294161]">{t('intro.p4Lead')}</strong> {t('intro.p4')}
            </p>
          </div>
        </div>
      </section>

      {/* ============ LENGUAJES ARTÍSTICOS ============ */}
      <section id="lenguajes" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className={TITULO_SECCION}>{t('lenguajes.title')}</h2>
          <p className="mt-4 text-gray-700 leading-relaxed">{t('lenguajes.p1')}</p>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {LENGUAJES.map(({ key, icon }) => (
              <li key={key} className="flex flex-col items-center text-center">
                <img src={`/images/experiencias/arte-y-creatividad/${icon}`} alt="" aria-hidden="true" width={96} height={96} className="h-16 w-16 object-contain md:h-20 md:w-20" />
                <span className="mt-3 text-sm font-bold leading-tight text-[#294161]">
                  {t(`lenguajes.items.${key}` as const)}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-gray-700 leading-relaxed">{t('lenguajes.p2')}</p>
        </div>
      </section>

      {/* ============ SAN ISIDRO PLAY ============ */}
      <section id="san-isidro-play" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className={TITULO_SECCION}>{t('play.title')}</h2>
          <p className="mt-2 text-sm font-bold italic text-[#294161]">{t('play.subtitle')}</p>
        </div>

        <div className="relative z-10 mt-10">
          <TiraFotos
            medios={playMedios}
            altText={t('play.carouselAlt')}
            fallbacks={PLAY_FALLBACK_IMAGES}
          />
        </div>

        <div className="relative z-10 mt-12 max-w-4xl mx-auto px-6">
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>{t('play.p1')}</p>
            <p>{t('play.p2')}</p>
            <p>{t('play.p3')}</p>
            <p>{t('play.p4')}</p>
            <p>{t('play.p5')}</p>
            <p className="italic">{t('play.closing')}</p>
          </div>
        </div>
      </section>

      <FondoFormaSeccion />

    </div>
  )
}
