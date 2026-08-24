// /app/[locale]/experiencia-sic/bienestar-y-acompanamiento/page.tsx
import type { FlipCardItem } from '@/components/FlipCardsCarousel'
import BloqueRotulo from '@/components/BloqueRotulo'
import FlipCardsGrid from '@/components/FlipCardsGrid'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import RenderMedia from '@/components/RenderMedia'
import Contact from '@/components/sectionContact'
import SectionCarrusel from '@/components/sectionCarrusel'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { toPublicImageUrl } from '@/lib/publicConstants'
import { getMediaGroupByName, getPageContentForSlug, type PageContentSection } from '@/lib/pageContentCache'

const CARD_MEDIA_PAGE_SLUG = 'experiencia-sic-bienestar-y-acompanamiento'
const CARD_MEDIA_SECTION_SLUG = 'experiencia-sic-bienestar-cards-1'
/** Foto de cierre, editable desde el admin como medio único. */
const CIERRE_SECTION_SLUG = 'experiencia-sic-bienestar-cierre'

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

const CIERRE_FALLBACK_IMG = '/images/Image-vida-estudiantil.webp'

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
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'experienciaSicBienestarDetail' })
  const alianzasMedia = await getMediaGroupByName('Alianzas')
  const bienestarSections = await getPageContentForSlug(CARD_MEDIA_PAGE_SLUG)

  const cardsSection = bienestarSections.find(
    (section: PageContentSection) => section.slug === CARD_MEDIA_SECTION_SLUG
  )
  const cierreMedio = bienestarSections.find(
    (section: PageContentSection) => section.slug === CIERRE_SECTION_SLUG
  )?.medio

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
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="bienestar" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#294161] leading-tight">
            {t('title')}
          </h1>
          <p className="mt-6 text-gray-700 leading-relaxed">{t('intro.p1')}</p>
        </div>
      </section>

      {/* ============ NUESTRA FILOSOFÍA ============ */}
      <section id="filosofia" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <BloqueRotulo rotulo={t('philosophy.title')}>
            <p>{t('philosophy.p1')}</p>
            <p>{t('philosophy.p2')}</p>
          </BloqueRotulo>

          <FlipCardsGrid items={firstGroupCards} ariaLabel={t('firstGroupAriaLabel')} />
        </div>
      </section>

      {/* ============ UNA COMUNIDAD QUE ACOMPAÑA ============ */}
      <section id="comunidad" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <BloqueRotulo rotulo={t('community.title')}>
            <p>{t('community.p1')}</p>
            <p>{t('community.p2')}</p>
          </BloqueRotulo>
        </div>
      </section>

      {/* ============ EQUIPO DE ORIENTACIÓN ESCOLAR ============ */}
      <section id="eoe" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516] whitespace-pre-line">{t('eoe.title')}</h2>
          <p className="mt-4 max-w-3xl text-gray-700 leading-relaxed">{t('eoe.p1')}</p>

          <FlipCardsGrid items={secondGroupCards} ariaLabel={t('secondGroupAriaLabel')} />
        </div>
      </section>

      {/* ============ ACOMPAÑAR PARA CRECER ============ */}
      <section id="cierre" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          {/* El filete va en la columna de texto y no lleva items-center: así
              se estira hasta el alto de la foto, como en Primary. */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 flex flex-col justify-center space-y-4 text-gray-700 leading-relaxed md:text-right md:border-r-2 md:border-black md:pr-6">
              <h2 className="text-xl font-bold text-[#c19516]">{t('closing.title')}</h2>
              <p>{t('closing.p1')}</p>
            </div>
            <div className="md:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <RenderMedia
                medio={cierreMedio}
                fallback={CIERRE_FALLBACK_IMG}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <FondoFormaSeccion />

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </div>
  )
}
