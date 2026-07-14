import type { FlipCardItem } from '@/components/FlipCardsCarousel'
import FlipCardsGrid from '@/components/FlipCardsGrid'
import Contact from '@/components/sectionContact'
import SectionCarrusel from '@/components/sectionCarrusel'
import { getTranslations } from 'next-intl/server'
import { toPublicImageUrl } from '@/lib/publicConstants'
import { getMediaGroupByName, getPageContentForSlug, type PageContentSection } from '@/lib/pageContentCache'

const CARD_MEDIA_PAGE_SLUG = 'experiencia-sic-bienestar-y-acompanamiento'
const CARD_MEDIA_SECTION_SLUG = 'experiencia-sic-bienestar-cards-1'

const CARD_FALLBACK_IMAGES = [
  '/images/image-kindergarten.webp',
  '/images/medios/foto-estudiantil-20250603-005440.webp',
  '/images/medios/foto-dojo-2-20250603-005253.webp',
  '/images/medios/foto-hockey-20250603-005057.webp',
  '/images/medios/foto-isidro-play-20250603-005601.webp',
  '/images/medios/foto-balance-1-20260217-194502.webp',
  '/images/medios/foto-balance-2-20260217-194547.webp',
  '/images/medios/foto-hockey-20250603-005057.webp',
] as const

const FIRST_GROUP_CARDS = [
  { key: 'tutorias', fallbackIcon: '/images/icons/tutorias-ico.svg', color: '#c19516' },
  { key: 'educacionEmocional', fallbackIcon: '/images/icons/educacion-emocional-ico.svg', color: '#2d8f57' },
  { key: 'trabajoFamilias', fallbackIcon: '/images/icons/trabajo-familia-ico.svg', color: '#294161' },
  { key: 'desarrolloIntegral', fallbackIcon: '/images/icons/desarrollo-integral-ico.svg', color: '#75ad76' },
] as const

const SECOND_GROUP_CARDS = [
  { key: 'sostenEmocional', fallbackIcon: '/images/icons/sosten-emocional-ico.svg', color: '#3ba9cf' },
  { key: 'acompanamientoPsicopedagogico', fallbackIcon: '/images/icons/acompanamiento-pedagogico-ico.svg', color: '#beb465' },
  { key: 'convivenciaEscolar', fallbackIcon: '/images/icons/convivencia-escolar-ico.svg', color: '#c19516' },
  { key: 'trabajoInterdisciplinario', fallbackIcon: '/images/icons/trabajo-interdisciplinario-ico.svg', color: '#294161' },
] as const

type CardKey =
  | (typeof FIRST_GROUP_CARDS)[number]['key']
  | (typeof SECOND_GROUP_CARDS)[number]['key']

type PageProps = {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

function buildCards(
  cards: ReadonlyArray<{ key: CardKey; fallbackIcon: string; color: string }>,
  iconUrls: string[],
  imageUrls: string[],
  t: Awaited<ReturnType<typeof getTranslations>>,
  offset: number
): FlipCardItem[] {
  return cards.map((card, index) => {
    const image = imageUrls[offset + index] ?? CARD_FALLBACK_IMAGES[(offset + index) % CARD_FALLBACK_IMAGES.length]
    const icon = iconUrls[offset + index] ?? card.fallbackIcon

    return {
      key: card.key,
      title: t(`cards.${card.key}.title`),
      backText: t(`cards.${card.key}.backText`),
      icon,
      image,
      fallbackIcon: card.fallbackIcon,
      fallbackImage: CARD_FALLBACK_IMAGES[(offset + index) % CARD_FALLBACK_IMAGES.length],
      color: card.color,
    }
  })
}

export default async function ExperienciaSicBienestarPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experienciaSicBienestarDetail' })
  const alianzasMedia = await getMediaGroupByName('Alianzas')
  const bienestarSections = await getPageContentForSlug(CARD_MEDIA_PAGE_SLUG)

  const cardsSection = bienestarSections.find(
    (section: PageContentSection) => section.slug === CARD_MEDIA_SECTION_SLUG
  )
  const imageMedias = [...(cardsSection?.grupo?.medios ?? [])]
    .filter((media) => media.tipo === 'IMAGEN')
    .sort((a, b) => a.posicion - b.posicion)
  const iconMedias = [...(cardsSection?.grupo?.medios ?? [])]
    .filter((media) => media.tipo === 'ICONO')
    .sort((a, b) => a.posicion - b.posicion)
  const iconUrls = iconMedias.map((media) => toPublicImageUrl('medios', media.urlArchivo))

  const imageUrls =
    imageMedias.length > 0
      ? Array.from({ length: 8 }, (_, index) =>
          toPublicImageUrl('medios', imageMedias[index % imageMedias.length]!.urlArchivo)
        )
      : [...CARD_FALLBACK_IMAGES]

  const firstGroupCards = buildCards(FIRST_GROUP_CARDS, iconUrls, imageUrls, t, 0)
  const secondGroupCards = buildCards(SECOND_GROUP_CARDS, iconUrls, imageUrls, t, 4)

  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden bg-[#71af8d] px-5 md:px-24 lg:px-60 xl:px-72">
        <div className="relative mx-auto min-h-screen max-w-[1000px] bg-white px-8 pb-12 pt-28">
          <div className="space-y-5 text-left text-gray-800">
            <h1 className="text-4xl font-bold leading-tight text-shadow-bold-movil md:text-5xl">
              {t('title')}
            </h1>
            <p>{t('intro.p1')}</p>
            <h2 className="pt-2 text-2xl font-bold leading-tight text-gray-800">
              {t('philosophy.title')}
            </h2>
            <p>{t('philosophy.p1')}</p>
            <p>{t('philosophy.p2')}</p>
          </div>

          <FlipCardsGrid items={firstGroupCards} ariaLabel={t('firstGroupAriaLabel')} />

          <div className="mt-10 space-y-5 text-left text-gray-800">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-gray-800">
                {t('community.title')}
              </h2>
              <p className="mt-2">{t('community.p1')}</p>
              <p>{t('community.p2')}</p>
            </div>

            <div className="pt-8">
              <h2 className="text-2xl font-bold leading-tight text-gray-800">
                {t('eoe.title')}
              </h2>
              <p className="mt-2">{t('eoe.p1')}</p>
            </div>
          </div>

          <FlipCardsGrid items={secondGroupCards} ariaLabel={t('secondGroupAriaLabel')} />

          <div className="mt-10 space-y-4 text-left text-gray-800">
            <h2 className="text-2xl font-bold leading-tight text-gray-800">
              {t('closing.title')}
            </h2>
            <p>{t('closing.p1')}</p>
          </div>
        </div>
      </section>

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </>
  )
}
