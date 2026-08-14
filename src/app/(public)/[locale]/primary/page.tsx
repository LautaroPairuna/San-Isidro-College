// /app/[locale]/primary/page.tsx
import RenderMedia from '@/components/RenderMedia'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import NivelesEducativos from '@/components/NivelesEducativos'
import FlipCardsCarousel from '@/components/FlipCardsCarousel'
import SectionCarrusel from '@/components/sectionCarrusel'
import Contact from '@/components/sectionContact'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { toPublicImageUrl } from '@/lib/publicConstants'
import {
  getMediaGroupByName,
  getPageContentForSlug,
  type PageContentSection,
} from '@/lib/pageContentCache'

/**
 * Ejes transversales. Usan las mismas tarjetas giratorias que el resto del
 * sitio; lo único propio son los íconos (navy sobre pastel, como el diseño) y
 * el color de cada frente. El dorso va en verde para las cinco.
 */
const EJES = [
  { key: 'comunicativa', icon: 'competencia-comunicativa-primary-card.svg', color: '#cfe0cd' },
  { key: 'cientifica', icon: 'alfabetizacion-primary-card.svg', color: '#ded8ee' },
  { key: 'problemas', icon: 'resolucion-problemas-primary-card.svg', color: '#f7dfa0' },
  { key: 'ciudadana', icon: 'formacion-personal-primary-card.svg', color: '#cfe2ef' },
  { key: 'sustentabilidad', icon: 'sustentabilidad-primary-card.svg', color: '#d8e4c0' },
] as const

const EJES_DORSO = '#a9c69c'
const EJES_TEXTO = '#294161'

/** Fotos de las tarjetas mientras no estén cargadas desde el admin. */
const EJES_FALLBACK_IMG = [
  '/images/medios/banner-primary-20250602-202252.webp',
  '/images/medios/foto-balance-1-20260217-194502.webp',
  '/images/medios/foto-estudiantil-20250603-005440.webp',
  '/images/medios/foto-hockey-20250603-005057.webp',
  '/images/medios/foto-balance-3-20260217-194614.webp',
]

/**
 * Los siete grados, en las dos filas del cuadro: primer ciclo arriba (tres) y
 * segundo ciclo abajo (cuatro), como en el diseño.
 */
const CICLOS = [
  { ciclo: 'ciclo1', grados: ['g1', 'g2', 'g3'] },
  { ciclo: 'ciclo2', grados: ['g4', 'g5', 'g6', 'g7'] },
] as const

// Secciones de la página en la DB.
const SECTION_SLUGS = {
  LITERATURA: 'primary-literatura',
  APRENDIZAJES: 'primary-aprendizajes',
  EJES: 'primary-ejes',
}

const FALLBACKS = {
  LITERATURA: '/images/medios/banner-primary-20250602-202252.webp',
  APRENDIZAJES: '/images/image-SIC-play.webp',
}

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
}

const PrimaryPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'nivelPrimario' })

  const pageSections = await getPageContentForSlug('primary')
  const literatura = pageSections.find((s: PageContentSection) => s.slug === SECTION_SLUGS.LITERATURA)?.medio
  const aprendizajes = pageSections.find((s: PageContentSection) => s.slug === SECTION_SLUGS.APRENDIZAJES)?.medio

  // Fotos de las tarjetas: si el grupo está cargado en el admin, manda la DB.
  const ejesMedios = [...(pageSections.find((s: PageContentSection) => s.slug === SECTION_SLUGS.EJES)?.grupo?.medios ?? [])]
    .sort((a, b) => a.posicion - b.posicion)
    .filter((medio) => medio.tipo === 'IMAGEN')

  const ejes = EJES.map(({ key, icon, color }, i) => ({
    key,
    title: t(`ejes.${key}.title`),
    backText: t(`ejes.${key}.backText`),
    icon: `/images/primary/${icon}`,
    fallbackIcon: `/images/primary/${icon}`,
    image: ejesMedios[i] ? toPublicImageUrl('medios', ejesMedios[i].urlArchivo) : EJES_FALLBACK_IMG[i],
    fallbackImage: EJES_FALLBACK_IMG[i],
    color,
    backColor: EJES_DORSO,
    textColor: EJES_TEXTO,
  }))

  // Alianzas (grupo global)
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  return (
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="nivel-primario" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#294161] leading-tight">
            {t('intro.title')}
          </h1>
          <p className="mt-3 text-base font-bold text-[#c19516]">{t('intro.subtitle')}</p>
          <div className="mt-6 space-y-5 text-gray-700 leading-relaxed text-justify">
            <p>{t('intro.p1')}</p>
            <p>{t('intro.p2')}</p>
            <p>{t('intro.p3')}</p>
          </div>
        </div>
      </section>

      {/* ============ PROPUESTA BILINGÜE ============ */}
      <section id="propuesta" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
            <h2 className="md:col-span-4 md:text-right text-xl font-bold text-[#c19516]">
              {t('propuesta.label1')}
              <span className="block">{t('propuesta.label2')}</span>
            </h2>
            <div className="md:col-span-7 md:col-start-6 md:max-w-md md:border-l md:border-[#9bb5a5] md:pl-6 space-y-4 text-gray-700 leading-relaxed text-justify hyphens-auto">
              <p>{t('propuesta.p1')}</p>
              <p>
                {t.rich('propuesta.p2', {
                  b: (chunks) => <strong className="font-bold">{chunks}</strong>,
                })}
              </p>
              <p>{t('propuesta.p3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LA LITERATURA COMO PUNTO DE PARTIDA ============ */}
      <section id="literatura" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <RenderMedia
                medio={literatura}
                fallback={FALLBACKS.LITERATURA}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="md:col-span-8 space-y-5 text-gray-700 leading-relaxed text-justify md:border-l-2 md:border-black md:pl-6">
              <h2 className="text-xl font-bold text-[#c19516]">{t('literatura.title')}</h2>
              <p>{t('literatura.p1')}</p>
              <p>{t('literatura.p2')}</p>
              <p className="italic">{t('literatura.frase')}</p>
              <p>{t('literatura.p3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ APRENDIZAJES SIGNIFICATIVOS ============ */}
      <section id="aprendizajes" className="relative w-full bg-white pb-16 lg:pb-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 md:order-1 space-y-5 text-gray-700 leading-relaxed text-justify md:border-r-2 md:border-black md:pr-6">
              <h2 className="text-xl font-bold text-[#c19516]">{t('aprendizajes.title')}</h2>
              <p>{t('aprendizajes.p1')}</p>
              <p>{t('aprendizajes.p2')}</p>
              <p>{t('aprendizajes.p3')}</p>
            </div>
            <div className="md:col-span-4 md:order-2 relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <RenderMedia
                medio={aprendizajes}
                fallback={FALLBACKS.APRENDIZAJES}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ EJES TRANSVERSALES ============ */}
      <section id="ejes" className="relative w-full bg-white pb-16 lg:pb-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('ejes.title')}</h2>
          <p className="mt-3 max-w-2xl text-gray-700 leading-relaxed">{t('ejes.description')}</p>

          {/* Son cinco y en el diseño entran en una sola fila */}
          <FlipCardsCarousel
            items={ejes}
            ariaLabel={t('ejes.title')}
            itemClassName="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/5"
          />
        </div>
      </section>

      {/* ============ UN RECORRIDO QUE CONTINÚA ============ */}
      <section id="recorrido" className="relative w-full bg-white pb-16 lg:pb-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('recorrido.title')}</h2>
          <p className="mt-3 text-gray-700 leading-relaxed text-justify">
            {t('recorrido.description')}
          </p>

          {/* Cuadro de grados. En el diseño viene como SVG con el texto dibujado
              adentro; acá va en HTML para que se traduzca y para que las siete
              celdas se reacomoden en pantallas chicas. */}
          <div className="mt-10 rounded-2xl bg-[#1e804b]/80 px-6 py-8 md:px-10 md:py-10 text-white">
            <h3 className="text-lg md:text-xl font-bold">{t('recorrido.cuadro.title')}</h3>
            <p className="mt-2 inline-block bg-white/20 px-3 py-1 text-sm">
              {t('recorrido.cuadro.jornada')}
            </p>

            <div className="mt-8 space-y-8">
              {CICLOS.map(({ ciclo, grados }) => (
                <ul key={ciclo} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                  {grados.map((key) => (
                    <li key={key}>
                      <p className="text-2xl md:text-3xl leading-none">
                        {t(`recorrido.cuadro.${key}`)}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold leading-tight">
                        {t('recorrido.cuadro.unidad')}
                      </p>
                      <p className="mt-1 text-sm font-bold">{t(`recorrido.cuadro.${ciclo}`)}</p>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ NIVELES EDUCATIVOS ============ */}
      <NivelesEducativos locale={locale} excluir="primary" />

      <FondoFormaSeccion />

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </div>
  )
}

export default PrimaryPage
