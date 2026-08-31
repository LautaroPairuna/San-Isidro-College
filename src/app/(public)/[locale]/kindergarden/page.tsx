// /app/[locale]/kindergarden/page.tsx
import RenderMedia from '@/components/RenderMedia'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import NivelesEducativos from '@/components/NivelesEducativos'
import SectionCarrusel from '@/components/sectionCarrusel'
import Contact from '@/components/sectionContact'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import {
  getMediaGroupByName,
  getPageContentForSlug,
  type PageContentSection,
} from '@/lib/pageContentCache'
import { BAJADA_PAGINA, TITULO_PAGINA, TITULO_SECCION, TITULO_TARJETA } from '@/lib/tipografia'

/**
 * Salas, en el orden del diseño. Los íconos salen de kindergarten-group.svg:
 * se separó cada animal en su propio archivo para que el título y el detalle
 * puedan traducirse y para que las cuatro columnas pasen a dos en pantallas
 * chicas (en el SVG original el texto venía dibujado y no reflowea).
 */
const SALAS = [
  { key: 'k2', icon: 'k2-monkeys.svg' },
  { key: 'k3', icon: 'k3-hippos.svg' },
  { key: 'k4', icon: 'k4-lions-tigers.svg' },
  { key: 'k5', icon: 'k5-giraffes-pandas.svg' },
] as const

// Secciones de la página en la DB (imágenes de "El valor del juego").
const SECTION_SLUGS = {
  JUEGO_1: 'kindergarden-juego-1',
  JUEGO_2: 'kindergarden-juego-2',
}

const FALLBACKS = {
  JUEGO_1: '/images/image-kindergarten.webp',
  JUEGO_2: '/images/image-SIC-play.webp',
}

// ISR: se renderiza una vez y se sirve desde caché (menos RAM/CPU por request).
// El admin regenera al instante con revalidatePath(); 1h es solo el respaldo.
export const revalidate = 3600

type PageProps = {
  params: Promise<{ locale: string }>
}

const KindergardenPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'nivelInicial' })

  const pageSections = await getPageContentForSlug('kindergarden')
  const juego1 = pageSections.find((s: PageContentSection) => s.slug === SECTION_SLUGS.JUEGO_1)?.medio
  const juego2 = pageSections.find((s: PageContentSection) => s.slug === SECTION_SLUGS.JUEGO_2)?.medio

  // Alianzas (grupo global)
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  return (
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="nivel-inicial" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className={TITULO_PAGINA}>
            {t('intro.title')}
          </h1>
          <p className={`mt-3 ${BAJADA_PAGINA}`}>{t('intro.subtitle')}</p>
          <div className="mt-6 space-y-5 text-gray-700 leading-relaxed">
            <p>{t('intro.p1')}</p>
            <p>{t('intro.p2')}</p>
          </div>
        </div>
      </section>

      {/* ============ PRIMEROS ENCUENTROS CON EL INGLÉS ============ */}
      <section id="ingles" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
            <h2 className={`md:col-span-4 md:text-right ${TITULO_SECCION}`}>
              {t('ingles.label1')}
              <span className="block">{t('ingles.label2')}</span>
            </h2>
            <div className="md:col-span-7 md:col-start-6 md:max-w-md md:border-l md:border-[#9bb5a5] md:pl-6 space-y-4 text-gray-700 leading-relaxed hyphens-auto">
              <p>{t('ingles.p1')}</p>
              <p>{t('ingles.p2')}</p>
              <p>{t('ingles.p3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EL VALOR DEL JUEGO ============ */}
      <section id="juego" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className={TITULO_SECCION}>{t('juego.title')}</h2>

          {/* Foto a la izquierda, texto a la derecha */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <RenderMedia
                medio={juego1}
                fallback={FALLBACKS.JUEGO_1}
                fill
                className="object-cover"
              />
            </div>
            <div className="md:col-span-8 flex flex-col justify-center space-y-5 font-myriad text-[20px] text-gray-700 leading-relaxed md:border-l-2 md:border-black md:pl-6">
              <p>{t('juego.p1')}</p>
              <p>{t('juego.p2')}</p>
            </div>
          </div>

          {/* Texto a la izquierda, foto a la derecha */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 md:order-1 flex flex-col justify-center space-y-5 font-myriad text-[20px] text-gray-700 leading-relaxed md:border-r-2 md:border-black md:pr-6">
              <p>{t('juego.p3')}</p>
              <p>{t('juego.p4')}</p>
            </div>
            <div className="md:col-span-4 md:order-2 relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <RenderMedia
                medio={juego2}
                fallback={FALLBACKS.JUEGO_2}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ UNA PROPUESTA QUE CRECE CON ELLOS ============ */}
      <section id="salas" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className={TITULO_SECCION}>{t('salas.title')}</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">{t('salas.description')}</p>

          {/* Cuatro columnas en desktop; abajo de lg pasan a dos, que es donde
              los títulos de K4/K5 empiezan a partirse. */}
          <ul className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {SALAS.map(({ key, icon }) => (
              <li key={key} className="flex flex-col">
                <img src={`/images/kindergarten/${icon}`} alt="" aria-hidden="true" width={160} height={72} className="h-16 w-auto" />
                <h3 className={`mt-4 ${TITULO_TARJETA} text-[#1e804b]`}>
                  {t(`salas.${key}.title`)}
                </h3>
                <p className="mt-1 text-sm text-[#1e804b] leading-snug whitespace-pre-line">
                  {t(`salas.${key}.jornada`)}
                </p>
                <p className="mt-3 pt-3 border-t border-[#1e804b] text-sm text-[#1e804b] leading-snug">
                  {t(`salas.${key}.detalle`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ NIVELES EDUCATIVOS ============ */}
      <div className="bg-white pt-16 lg:pt-20">
        <NivelesEducativos locale={locale} excluir="kindergarden" />
      </div>

      <FondoFormaSeccion />

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </div>
  )
}

export default KindergardenPage
