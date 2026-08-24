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

/**
 * Tarjetas de bienestar. El frente va en pastel, con la misma paleta que las
 * tarjetas de Secondary, así que los íconos no pueden ser los de /images/icons:
 * esos son blancos y sobre pastel no se ven. En /images/experiencias/bienestar
 * están los mismos dibujos recoloreados a navy.
 */
const FIRST_GROUP_CARDS = [
  { key: 'tutorias', icon: 'tutorias-ico.svg', color: '#cfe0cd' },
  { key: 'educacionEmocional', icon: 'educacion-emocional-ico.svg', color: '#ded8ee' },
  { key: 'trabajoFamilias', icon: 'trabajo-familia-ico.svg', color: '#f7dfa0' },
  { key: 'desarrolloIntegral', icon: 'desarrollo-integral-ico.svg', color: '#cfe2ef' },
] as const

const SECOND_GROUP_CARDS = [
  { key: 'sostenEmocional', icon: 'sosten-emocional-ico.svg', color: '#f7dfa0' },
  { key: 'acompanamientoPsicopedagogico', icon: 'acompanamiento-pedagogico-ico.svg', color: '#cfe2ef' },
  { key: 'convivenciaEscolar', icon: 'convivencia-escolar-ico.svg', color: '#cfe0cd' },
  { key: 'trabajoInterdisciplinario', icon: 'trabajo-interdisciplinario-ico.svg', color: '#f0cdb0' },
] as const

/** Dorso y texto de las tarjetas, iguales a los de Secondary. */
const TARJETAS_DORSO = '#a9c69c'
const TARJETAS_TEXTO = '#294161'

type CardKey =
  | (typeof FIRST_GROUP_CARDS)[number]['key']
  | (typeof SECOND_GROUP_CARDS)[number]['key']

type PageProps = {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

function buildCards(
  cards: ReadonlyArray<{ key: CardKey; icon: string; color: string }>,
  imageUrls: string[],
  t: Awaited<ReturnType<typeof getTranslations>>,
  offset: number
): FlipCardItem[] {
  return cards.map((card, index) => {
    const image = imageUrls[offset + index] ?? CARD_FALLBACK_IMAGES[(offset + index) % CARD_FALLBACK_IMAGES.length]
    const icon = `/images/experiencias/bienestar/${card.icon}`

    return {
      key: card.key,
      title: t(`cards.${card.key}.title`),
      backText: t(`cards.${card.key}.backText`),
      icon,
      image,
      fallbackIcon: icon,
      fallbackImage: CARD_FALLBACK_IMAGES[(offset + index) % CARD_FALLBACK_IMAGES.length],
      color: card.color,
      backColor: TARJETAS_DORSO,
      textColor: TARJETAS_TEXTO,
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
  const imageUrls =
    imageMedias.length > 0
      ? Array.from({ length: 8 }, (_, index) =>
          toPublicImageUrl('medios', imageMedias[index % imageMedias.length]!.urlArchivo)
        )
      : [...CARD_FALLBACK_IMAGES]

  const firstGroupCards = buildCards(FIRST_GROUP_CARDS, imageUrls, t, 0)
  const secondGroupCards = buildCards(SECOND_GROUP_CARDS, imageUrls, t, 4)

  return (
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="bienestar" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#294161] leading-tight">
            {t('title')}
          </h1>
          <p className="mt-6 text-gray-700 leading-relaxed">{t('intro.p1')}</p>
        </div>
      </section>

      {/* ============ NUESTRA FILOSOFÍA ============ */}
      <section id="filosofia" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <BloqueRotulo rotulo={t('philosophy.title')}>
            <p>{t('philosophy.p1')}</p>
            <p>{t('philosophy.p2')}</p>
          </BloqueRotulo>

          <FlipCardsGrid items={firstGroupCards} ariaLabel={t('firstGroupAriaLabel')} />
        </div>
      </section>

      {/* ============ UNA COMUNIDAD QUE ACOMPAÑA ============ */}
      <section id="comunidad" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <BloqueRotulo rotulo={t('community.title')}>
            <p>{t('community.p1')}</p>
            <p>{t('community.p2')}</p>
          </BloqueRotulo>
        </div>
      </section>

      {/* ============ EQUIPO DE ORIENTACIÓN ESCOLAR ============ */}
      <section id="eoe" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516] whitespace-pre-line">{t('eoe.title')}</h2>
          <p className="mt-4 text-gray-700 leading-relaxed">{t('eoe.p1')}</p>

          <FlipCardsGrid items={secondGroupCards} ariaLabel={t('secondGroupAriaLabel')} />
        </div>
      </section>

      {/* ============ ACOMPAÑAR PARA CRECER ============ */}
      <section id="cierre" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
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
