// /app/[locale]/secondary/page.tsx
import type { ReactNode } from 'react'
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
 * Tarjetas de "Una formación que trasciende el aula". Son las mismas tarjetas
 * giratorias del resto del sitio; los íconos son los de siempre recoloreados a
 * navy, porque acá el frente va en pastel y los originales son blancos.
 */
const TARJETAS = [
  { key: 'persona', icon: 'persona-secondary-card.svg', color: '#cfe0cd' },
  { key: 'ciudadania', icon: 'ciudadania-secondary-card.svg', color: '#ded8ee' },
  { key: 'innovacion', icon: 'innovacion-secondary-card.svg', color: '#f7dfa0' },
  { key: 'deportes', icon: 'deportes-secondary-card.svg', color: '#cfe2ef' },
  { key: 'artes', icon: 'artes-secondary-card.svg', color: '#cfe0cd' },
  { key: 'sustentabilidad', icon: 'sustentabilidad-secondary-card.svg', color: '#f0cdb0' },
] as const

const TARJETAS_DORSO = '#a9c69c'
const TARJETAS_TEXTO = '#294161'

/**
 * Fotos de las tarjetas mientras no estén cargadas desde el admin. Salen de
 * /images y no de /images/medios: esa carpeta la maneja el servidor de medios,
 * así que un archivo del repo puede no estar ahí.
 */
const TARJETAS_FALLBACK_IMG = [
  '/images/centro-proyecto.png',
  '/images/ciudadanos-globales.png',
  '/images/innovacion-tecnologia.png',
  '/images/deportes.png',
  '/images/artes.png',
  '/images/sustentabilidad.png',
]

/** Los cinco años, en las dos filas del cuadro: ciclo básico y ciclo orientado. */
const CICLOS = [
  { ciclo: 'ciclo1', anios: ['a1', 'a2'] },
  { ciclo: 'ciclo2', anios: ['a3', 'a4', 'a5'] },
] as const

// Grupo de medios de las tarjetas en la DB.
const SECTION_SLUGS = {
  TARJETAS: 'secondary-formacion',
}

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
}

/**
 * Rótulo dorado y texto separados por un filete, alternando de lado. Se repite
 * en las orientaciones y en los programas internacionales.
 */
function BloqueRotulo({
  rotulo,
  children,
  lado = 'izquierda',
}: {
  rotulo: ReactNode
  children: ReactNode
  lado?: 'izquierda' | 'derecha'
}) {
  const rotuloEl = (
    <h3
      className={`md:col-span-4 text-lg font-bold text-[#c19516] ${
        lado === 'izquierda' ? 'md:text-right' : 'md:col-start-8'
      }`}
    >
      {rotulo}
    </h3>
  )

  const textoEl = (
    <div
      className={`md:col-span-6 space-y-4 text-gray-700 leading-relaxed hyphens-auto ${
        lado === 'izquierda'
          ? 'md:col-start-6 md:border-l md:border-[#9bb5a5] md:pl-6 text-justify'
          : 'md:col-start-1 md:border-r md:border-[#9bb5a5] md:pr-6 text-justify md:text-right'
      }`}
    >
      {children}
    </div>
  )

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
      {lado === 'izquierda' ? (
        <>
          {rotuloEl}
          {textoEl}
        </>
      ) : (
        <>
          {textoEl}
          {rotuloEl}
        </>
      )}
    </div>
  )
}

const SecondaryPage = async ({ params }: PageProps) => {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'nivelSecundario' })

  const pageSections = await getPageContentForSlug('secondary')
  const tarjetasMedios = [
    ...(pageSections.find((s: PageContentSection) => s.slug === SECTION_SLUGS.TARJETAS)?.grupo?.medios ?? []),
  ]
    .sort((a, b) => a.posicion - b.posicion)
    .filter((medio) => medio.tipo === 'IMAGEN')

  const tarjetas = TARJETAS.map(({ key, icon, color }, i) => ({
    key,
    title: t(`formacion.cards.${key}.title`),
    backText: t(`formacion.cards.${key}.backText`),
    icon: `/images/secondary/${icon}`,
    fallbackIcon: `/images/secondary/${icon}`,
    image: tarjetasMedios[i]
      ? toPublicImageUrl('medios', tarjetasMedios[i].urlArchivo)
      : TARJETAS_FALLBACK_IMG[i],
    fallbackImage: TARJETAS_FALLBACK_IMG[i],
    color,
    backColor: TARJETAS_DORSO,
    textColor: TARJETAS_TEXTO,
  }))

  // Alianzas (grupo global)
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  return (
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="nivel-secundario" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#294161] leading-tight">
            {t('intro.title')}
          </h1>
          <p className="mt-3 text-base font-bold text-[#c19516]">{t('intro.subtitle')}</p>
          <div className="mt-6 space-y-5 text-gray-700 leading-relaxed text-justify">
            <p>{t('intro.p1')}</p>
            <p>{t('intro.p2')}</p>
          </div>
        </div>
      </section>

      {/* ============ DOS ORIENTACIONES ============ */}
      <section id="orientaciones" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-[#c19516]">{t('orientaciones.title')}</h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed text-justify">
              <p>{t('orientaciones.p1')}</p>
              <p>{t('orientaciones.p2')}</p>
            </div>
          </div>

          <BloqueRotulo rotulo={t('orientaciones.naturales.label')}>
            <p>{t('orientaciones.naturales.p1')}</p>
          </BloqueRotulo>

          <BloqueRotulo rotulo={t('orientaciones.informatica.label')} lado="derecha">
            <p>{t('orientaciones.informatica.p1')}</p>
          </BloqueRotulo>
        </div>
      </section>

      {/* ============ CONECTADA CON EL MUNDO ============ */}
      <section id="mundo" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-[#c19516]">{t('mundo.title')}</h2>
            <p className="mt-4 text-gray-700 leading-relaxed text-justify">{t('mundo.p1')}</p>
          </div>

          <BloqueRotulo rotulo={t('mundo.igcse.label')}>
            <p>{t('mundo.igcse.p1')}</p>
            <p>{t('mundo.igcse.p2')}</p>
          </BloqueRotulo>

          <BloqueRotulo
            lado="derecha"
            rotulo={
              <>
                {t('mundo.dual.label1')}
                <span className="block">{t('mundo.dual.label2')}</span>
              </>
            }
          >
            <p>{t('mundo.dual.p1')}</p>
            <p>{t('mundo.dual.p2')}</p>
          </BloqueRotulo>
        </div>
      </section>

      {/* ============ PROYECTO DE VIDA ============ */}
      <section id="proyecto-vida" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('proyectoVida.title')}</h2>
          <div className="mt-4 space-y-4 text-gray-700 leading-relaxed text-justify">
            <p>{t('proyectoVida.p1')}</p>
            <p>{t('proyectoVida.p2')}</p>
            <p>{t('proyectoVida.p3')}</p>
          </div>
        </div>
      </section>

      {/* ============ FORMACIÓN QUE TRASCIENDE EL AULA ============ */}
      <section id="formacion" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('formacion.title')}</h2>
          <p className="mt-3 max-w-2xl text-gray-700 leading-relaxed">
            {t('formacion.description')}
          </p>

          <FlipCardsCarousel items={tarjetas} ariaLabel={t('formacion.title')} />
        </div>
      </section>

      {/* ============ UN RECORRIDO POR SECUNDARIA ============ */}
      <section id="recorrido" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('recorrido.title')}</h2>

          {/* Cuadro de años. Va en HTML y no como secondary-group.svg: el SVG
              trae el texto dibujado y solo en español. */}
          <div className="mt-8 rounded-2xl bg-[#1e804b]/80 px-6 py-8 md:px-10 md:py-10 text-white">
            <h3 className="text-lg md:text-xl font-bold">{t('recorrido.cuadro.title')}</h3>
            <p className="mt-2 inline-block bg-white/20 px-3 py-1 text-sm">
              {t('recorrido.cuadro.jornada')}
            </p>

            <div className="mt-8 space-y-8">
              {CICLOS.map(({ ciclo, anios }) => (
                <ul key={ciclo} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                  {anios.map((key) => (
                    <li key={key}>
                      <p className="text-2xl md:text-3xl font-bold leading-tight whitespace-pre-line">
                        {t(`recorrido.cuadro.${key}`)}
                      </p>
                      <p className="mt-1 text-sm font-bold">{t(`recorrido.cuadro.${ciclo}`)}</p>
                    </li>
                  ))}

                  {/* Las orientaciones acompañan al ciclo orientado */}
                  {ciclo === 'ciclo2' && (
                    <li className="col-span-2 sm:col-span-3 lg:col-span-1 lg:border-l lg:border-white/50 lg:pl-6">
                      <p className="text-sm font-bold">{t('recorrido.cuadro.orientacionesTitle')}</p>
                      <p className="mt-1 text-sm">{t('recorrido.cuadro.orientacion1')}</p>
                      <p className="text-sm">{t('recorrido.cuadro.orientacion2')}</p>
                    </li>
                  )}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ NIVELES EDUCATIVOS ============ */}
      <div className="bg-white pt-16 lg:pt-20">
        <NivelesEducativos locale={locale} excluir="secondary" />
      </div>

      <FondoFormaSeccion />

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </div>
  )
}

export default SecondaryPage
