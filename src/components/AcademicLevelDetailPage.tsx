import Image from 'next/image'
import FlipCardsCarousel from '@/components/FlipCardsCarousel'
import AcademicLevelCardsSection from '@/components/AcademicLevelCardsSection'
import Contact from '@/components/sectionContact'
import SectionCarrusel from '@/components/sectionCarrusel'
import { ACADEMIC_LEVELS_BY_ROUTE, type AcademicLevelRouteKey } from '@/lib/academicLevels'
import { toPublicImageUrl } from '@/lib/publicConstants'
import { getMediaGroupByName, getPageContentForSlug, type PageContentSection } from '@/lib/pageContentCache'
import { getTranslations } from 'next-intl/server'

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
] as const

type CardI18nKey = (typeof FLIP_CARDS)[number]['key']

type AcademicLevelDetailPageProps = {
  locale: string
  level: AcademicLevelRouteKey
}

function renderKindergartenContent(t: Awaited<ReturnType<typeof getTranslations>>) {
  return (
    <div className="space-y-4 mt-8 relative text-left">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-shadow-bold-movil">
        {t('kindergarten.titulo')}
      </h2>
      <p>{t('kindergarten.p1')}</p>
      <p>{t('kindergarten.p2')}</p>
      <p>{t('kindergarten.p3')}</p>
      <p className="font-bold leading-relaxed text-gray-800">{t('kindergarten.bold')}</p>

      <h3 className="text-xl md:text-xl font-bold mb-4 text-gray-800 pt-16">
        {t('kindergarten.subtituloJuego')}
      </h3>
      <p>{t('kindergarten.juego.p1')}</p>
      <p>{t('kindergarten.juego.p2')}</p>
      <p>{t('kindergarten.juego.p3')}</p>
      <p>{t('kindergarten.juego.p4')}</p>

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
  )
}

function renderPrimaryContent(t: Awaited<ReturnType<typeof getTranslations>>) {
  return (
    <div className="space-y-4 relative mt-8 text-left">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-shadow-bold-movil">
        {t('primary.titulo')}
      </h2>
      <p className="font-bold leading-relaxed text-gray-800 mb-4 text-xl">
        {t('primary.subtitulo')}
      </p>
      <p>{t('primary.p1')}</p>
      <p>{t('primary.p2')}</p>
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
  )
}

function renderSecondaryContent(t: Awaited<ReturnType<typeof getTranslations>>) {
  return (
    <>
      <div className="space-y-5 mt-8 text-left">
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

      <div className="space-y-5 mt-16 text-left">
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

      <div className="space-y-5 mt-16 text-left">
        <h4 className="text-xl font-bold leading-tight text-gray-800 text-left">
          {t('weAreCommunity.identity.title')}
        </h4>
        <p>{t('weAreCommunity.identity.p1')}</p>
        <p>{t('weAreCommunity.identity.p2')}</p>
      </div>
    </>
  )
}

export default async function AcademicLevelDetailPage({
  locale,
  level,
}: AcademicLevelDetailPageProps) {
  const t = await getTranslations({ locale, namespace: 'academicosMasInfo' })
  const pageSections = await getPageContentForSlug('academicos-mas-info')
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  const currentLevel = ACADEMIC_LEVELS_BY_ROUTE[level]

  const cardsSection = pageSections.find(
    (section: PageContentSection) => section.slug === CARD_MEDIA_SECTION_SLUG
  )
  const medias = [...(cardsSection?.grupo?.medios ?? [])].sort((a, b) => a.posicion - b.posicion)
  const iconMedias = medias.filter((media) => media.tipo === 'ICONO')
  const imageMedias = medias.filter((media) => media.tipo === 'IMAGEN')

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
        <div className="relative max-w-300 mx-auto bg-white min-h-screen px-8 pb-8 pt-24">
          {currentLevel.routeKey === 'kindergarden' && renderKindergartenContent(t)}
          {currentLevel.routeKey === 'primary' && renderPrimaryContent(t)}
          {currentLevel.routeKey === 'secondary' && (
            <>
              {renderSecondaryContent(t)}
              <FlipCardsCarousel
                items={cardsWithMedia}
                ariaLabel={t('weAreCommunity.academicProposal.title')}
              />
            </>
          )}

          <AcademicLevelCardsSection
            locale={locale}
            variant="detail"
            excludeLevel={currentLevel.routeKey}
          />
        </div>
      </section>

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </>
  )
}
