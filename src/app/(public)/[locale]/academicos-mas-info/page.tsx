// /app/[locale]/vida-estudiantil-mas-info/page.tsx
'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import SmoothLink from '@/components/SmoothLink'
import AsideMenu from '@/components/AsideMenu'
import { useTranslations } from 'next-intl'
import { usePageContent } from '@/lib/hooks'
import { toPublicImageUrl } from '@/lib/publicConstants'
import FlipCardsCarousel from '@/components/FlipCardsCarousel'

const Carousel = dynamic(() => import('@/components/sectionCarrusel'), { ssr: false })
const Contact = dynamic(() => import('@/components/sectionContact'), { ssr: false })
const CARD_MEDIA_SECTION_SLUG = 'academicos-mas-info-cards'

const FLIP_CARDS = [
  {
    key: 'persona',
    icon: '/images/icons/ico-centro-proyecto.svg',
    image: '/images/image-kindergarten.webp',
    color: '#c29618',
  },
  {
    key: 'ciudadanos',
    icon: '/images/icons/ico-ciudadanos-globales.svg',
    image: '/images/medios/foto-estudiantil-20250603-005440.webp',
    color: '#2d8f57',
  },
  {
    key: 'innovacion',
    icon: '/images/icons/ico-innovacion-tecnologia.svg',
    image: '/images/medios/foto-dojo-2-20250603-005253.webp',
    color: '#294161',
  },
  {
    key: 'deportes',
    icon: '/images/icons/ico-deportes.svg',
    image: '/images/medios/foto-hockey-20250603-005057.webp',
    color: '#75ad76',
  },
  {
    key: 'artes',
    icon: '/images/icons/ico-artes.svg',
    image: '/images/medios/foto-isidro-play-20250603-005601.webp',
    color: '#3ba9cf',
  },
  {
    key: 'sustentabilidad',
    icon: '/images/icons/ico-sustentabilidad.svg',
    image: '/images/medios/foto-balance-1-20260217-194502.webp',
    color: '#beb465',
  },
  {
    key: 'bienestar',
    icon: '/images/icons/ico-bienestar.svg',
    image: '/images/medios/foto-balance-2-20260217-194547.webp',
    color: '#c19516',
  },
]

type CardI18nKey = (typeof FLIP_CARDS)[number]['key']

export default function AcademicosMasInfoPage() {
  const t = useTranslations('academicosMasInfo')
  const { data: pageSections = [] } = usePageContent('academicos-mas-info')

  const cardsSection = pageSections.find(section => section.slug === CARD_MEDIA_SECTION_SLUG)
  const medias = [...(cardsSection?.grupo?.medios ?? [])].sort((a, b) => a.posicion - b.posicion)
  const iconMedias = medias.filter(media => media.tipo === 'ICONO')
  const imageMedias = medias.filter(media => media.tipo === 'IMAGEN')

  const cardsWithMedia = FLIP_CARDS.map((card, index) => ({
    ...card,
    title: t(`cards.${card.key as CardI18nKey}.title`),
    backText: t(`cards.${card.key as CardI18nKey}.backText`),
    fallbackIcon: card.icon,
    fallbackImage: card.image,
    icon: iconMedias[index] ? toPublicImageUrl('medios', iconMedias[index].urlArchivo) : card.icon,
    image: imageMedias[index] ? toPublicImageUrl('medios', imageMedias[index].urlArchivo) : card.image,
  }))

  return (
    <>
      <section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-60 xl:px-80 overflow-hidden">
        {/* CONTENEDOR CENTRAL CON FONDO BLANCO */}
        <div className="relative max-w-300 mx-auto bg-white min-h-screen px-8 pb-8 pt-24">
          {/* CONTENIDO PRINCIPAL */}
          <h2
            id="proyecto"
            className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-shadow-bold-movil"
          >
            {t('proyectoTitulo')}
          </h2>

          <div className="space-y-4 leading-relaxed text-gray-800 text-justify">
            <p>{t('introduccion.p1')}</p>
            <p>{t('introduccion.p2')}</p>
            <p>{t('introduccion.p3')}</p>
            <p>{t('introduccion.p4')}</p>
            <p>{t('introduccion.p5')}</p>
            <p className="font-bold">{t('introduccion.bold1')}</p>
            <p className="font-bold">{t('introduccion.bold2')}</p>
          </div>

          {/* Inglés, Indispensable */}
          <div className="space-y-4 mt-10 text-justify">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 text-shadow-bold-movil">
              {t('inglesTitulo')}
            </h3>
            <p>{t('ingles.p1')}</p>
            <p>{t('ingles.p2')}</p>
            <p>{t('ingles.p3')}</p>
            <p>{t('ingles.p4')}</p>
          </div>

          {/* Kindergarten */}
          <div className="space-y-4 mt-32 relative text-justify">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-shadow-bold-movil">
              {t('kindergarten.titulo')}
            </h3>
            <p>{t('kindergarten.p1')}</p>
            <p>{t('kindergarten.p2')}</p>
            <p id="kindergarten">{t('kindergarten.p3')}</p>
            <p className="font-bold leading-relaxed text-gray-800">
              {t('kindergarten.bold')}
            </p>

            <h4 className="text-xl md:text-xl font-bold mb-4 text-gray-800 pt-16">
              {t('kindergarten.subtituloJuego')}
            </h4>
            <p>{t('kindergarten.juego.p1')}</p>
            <p>{t('kindergarten.juego.p2')}</p>
            <p>{t('kindergarten.juego.p3')}</p>
            <p>{t('kindergarten.juego.p4')}</p>

            {/* Imágenes para Kindergarten */}
            <div className="relative">
              <div className="hidden lg:block md:absolute xl:-top-180 lg:-top-220 xl:-left-85 lg:-left-75 w-62.5 z-20">
                <Image
                  src="/images/cuadro-kindergarten.svg"
                  alt={t('kindergarten.imagenAltDecoracion')}
                  width={250}
                  height={250}
                />
              </div>
              <div className="block lg:hidden relative mx-auto z-20">
                <Image
                  src="/images/cuadro-kindergarten-movil.svg"
                  alt={t('kindergarten.imagenAltDecoracionMovil')}
                  width={300}
                  height={300}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Primary */}
          <div className="space-y-4 relative mt-32 text-justify">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-shadow-bold-movil" >
              {t('primary.titulo')}
            </h3>
            <p className="font-bold leading-relaxed text-gray-800 mb-4 text-xl">
              {t('primary.subtitulo')}
            </p>
            <p>{t('primary.p1')}</p>
            <p id="primary">{t('primary.p2')}</p>
            <p>{t('primary.p3')}</p>
            <p>{t('primary.p4')}</p>

            <div className="mb-16">
              <Image
                src="/images/cuadro-primary.svg"
                alt={t('primary.imagenAltDecoracion')}
                width={600}
                height={600}
                className="block"
              />
            </div>
            <div className="relative left-0 md:left-1/2 w-full md:w-[100vw] md:-translate-x-1/2">
              <Image
                src="/images/image-primary.svg"
                alt={t('primary.imagenAltContenido')}
                width={1300}
                height={400}
                className="mx-auto -mt-10 lg:max-w-none w-[650px] md:w-[800px] xl:w-[1000px] 2xl:w-[1200px] h-auto"
              />
            </div>
          </div>

          {/* Secondary */}
          <div className="space-y-4 mt-32 text-justify" id="secondary">
            <h3 className="text-4xl md:text-5xl font-bold my-6 text-gray-800 text-shadow-bold-movil">
              {t('secondary.titulo')}
            </h3>
            <h4 className="font-bold text-xl">{t('secondary.subtitulo')}</h4>
            <p>{t('secondary.p1')}</p>
            <p>
              {t('secondary.p2Part1')}
              <span className="font-bold">{t('secondary.enfatizado')}</span>
              {t('secondary.p2Part2')}
            </p>
            <div className="bg-white/80 p-4 rounded-xl text-[#1e804b] border-[#1e804b] border-2 w-full">
              <h4 className="font-bold text-xl text-center mb-4">
                {t('secondary.diplomaDualTitulo')}
              </h4>
              <p className="text-justify">{t('secondary.diplomaDualTexto')}</p>
              <div className="mx-auto mt-5 justify-center flex">
                <Image
                  src="/images/logo-academia-internatiional-studies.svg"
                  alt={t('secondary.diplomaDualLogoAlt')}
                  width={128}
                  height={128}
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 mt-16 text-justify">
            <h3 className="text-2xl font-semibold uppercase leading-tight text-gray-800 text-left">
              We are Community
            </h3>
            <h4 className="text-xl font-bold leading-tight text-gray-800 text-left">
              {t('weAreCommunity.academicProposal.title')}
            </h4>
            <p>{t('weAreCommunity.academicProposal.p1')}</p>
            <p>{t('weAreCommunity.academicProposal.orientationsTitle')}</p>
            <p>
              <span className="font-bold">{t('weAreCommunity.academicProposal.natural.label')}</span>{' '}
              {t('weAreCommunity.academicProposal.natural.text')}
            </p>
            <p>
              <span className="font-bold">{t('weAreCommunity.academicProposal.informatics.label')}</span>{' '}
              {t('weAreCommunity.academicProposal.informatics.text')}
            </p>
          </div>

          <div className="space-y-5 mt-16 text-justify">
            <h4 className="text-xl font-bold leading-tight text-gray-800 text-left">
              {t('weAreCommunity.internationalProjection.title')}
            </h4>
            <p>{t('weAreCommunity.internationalProjection.intro')}</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <span className="font-bold">{t('weAreCommunity.internationalProjection.igcse.label')}</span>{' '}
                {t('weAreCommunity.internationalProjection.igcse.text')}
              </li>
              <li>
                <span className="font-bold">{t('weAreCommunity.internationalProjection.dual.label')}</span>{' '}
                {t('weAreCommunity.internationalProjection.dual.text')}
              </li>
            </ol>
            <p>{t('weAreCommunity.internationalProjection.closing')}</p>
          </div>

          <div className="space-y-5 mt-16 text-justify">
            <h4 className="text-xl font-bold leading-tight text-gray-800 text-left">{t('weAreCommunity.identity.title')}</h4>
            <p>{t('weAreCommunity.identity.p1')}</p>
            <p>{t('weAreCommunity.identity.p2')}</p>
          </div>

          <FlipCardsCarousel
            items={cardsWithMedia}
            ariaLabel={t('weAreCommunity.academicProposal.title')}
          />

          <div className="space-y-5 mt-16 text-justify">
            <h3 className="text-xl font-bold leading-tight text-gray-800 text-left">
              {t('weAreCommunity.eoe.title')}
            </h3>
            <p>{t('weAreCommunity.eoe.intro')}</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <span className="font-bold">{t('weAreCommunity.eoe.emotional.label')}</span>{' '}
                {t('weAreCommunity.eoe.emotional.text')}
              </li>
              <li>
                <span className="font-bold">{t('weAreCommunity.eoe.learning.label')}</span>{' '}
                {t('weAreCommunity.eoe.learning.text')}
              </li>
              <li>
                <span className="font-bold">{t('weAreCommunity.eoe.coexistence.label')}</span>{' '}
                {t('weAreCommunity.eoe.coexistence.text')}
              </li>
            </ul>
            <p>{t('weAreCommunity.eoe.closing')}</p>
          </div>

          <div className="space-y-5 mt-16 text-justify">
            <h3 className="text-xl font-bold leading-tight text-gray-800 text-left">{t('weAreCommunity.club.title')}</h3>
            <p>{t('weAreCommunity.club.p1')}</p>
          </div>
        </div>

        {/* ASIDE SUPERPUESTO EN EL COSTADO */}
        <div className="w-1/4 relative">
          <AsideMenu scrollThreshold={3000}>
            <hr className="border-t border-black mb-3" />
            <h3 className="text-xl italic text-gray-900 mb-6">
              {t('aside.titulo')}
            </h3>
            <ul className="space-y-5">
              <li className="font-bold">
                <SmoothLink href="#proyecto">{t('aside.proyecto')}</SmoothLink>
              </li>
              <li className="space-y-1 font-bold">
                <SmoothLink href="#kindergarten">{t('aside.kindergarten')}</SmoothLink>
                <br />
                <SmoothLink href="#primary">{t('aside.primary')}</SmoothLink>
                <br />
                <SmoothLink href="#secondary">{t('aside.secondary')}</SmoothLink>
              </li>
            </ul>
          </AsideMenu>
        </div>
      </section>

      {/* Carrusel (sin medias, ya que son opcionales) */}
      <Carousel />

      {/* Contacto */}
      <Contact />
    </>
  )
}
