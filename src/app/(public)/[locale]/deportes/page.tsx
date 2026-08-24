// /app/[locale]/deportes/page.tsx
import Image from 'next/image'
import BloqueRotulo from '@/components/BloqueRotulo'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import MediaCarousel from '@/components/MediaCarousel'
import Contact from '@/components/sectionContact'
import SectionCarrusel from '@/components/sectionCarrusel'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getMediaGroupByName, getPageContentForSlug, type PageContentSection } from '@/lib/pageContentCache'

/* --------------------------------------------------------------------
 *  SLUGS DE SECCIONES (Coinciden con DB)
 * ------------------------------------------------------------------*/
const SECTION_SLUGS = {
  DOJO: 'vida-estudiantil-dojo',
  GYM: 'vida-estudiantil-gym',
} as const

/**
 * Tipo mínimo consistente para carruseles (imagen/video/icono).
 * (No depende de creadoEn/actualizadoEn para evitar fricción de tipado en páginas)
 */
type MedioItem = {
  id: number
  urlArchivo: string
  urlMiniatura?: string | null
  textoAlternativo?: string | null
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO'
  posicion: number
  grupoMediosId: number
}

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function DeportesPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  // Los textos nuevos (deporte y club) viven en su propio namespace; el Dojo y
  // San Isidro Balance siguen usando los que ya existían.
  const t = await getTranslations({ locale, namespace: 'deportesDetail' })
  const tVida = await getTranslations({ locale, namespace: 'vidaEstudiantilHome' })

  /* ------------------------------ CARGA DE MEDIOS DINÁMICA ------------------------------ */
  const pageSections = await getPageContentForSlug('vida-estudiantil')
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  const getMedias = (slug: string): MedioItem[] =>
    ((pageSections.find((s: PageContentSection) => s.slug === slug)?.grupo?.medios ?? []) as MedioItem[])
      .filter((m) => m.tipo === 'IMAGEN' || m.tipo === 'VIDEO')
      .sort((a, b) => a.posicion - b.posicion)

  const dojoMedia = getMedias(SECTION_SLUGS.DOJO)
  const gymMedia = getMedias(SECTION_SLUGS.GYM)

  return (
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="deportes" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#294161] leading-tight">{t('title')}</h1>
          <div className="mt-6 space-y-5 text-gray-700 leading-relaxed">
            <p>{t('intro.p1')}</p>
            <p>{t('intro.p2')}</p>
            <p>{t('intro.p3')}</p>
            <p>{t('intro.p4')}</p>
          </div>
        </div>
      </section>

      {/* ============ SAN ISIDRO COLLEGE CLUB ============ */}
      <section id="club" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <BloqueRotulo
            rotulo={
              <>
                {t('club.label1')}
                <span className="block">{t('club.label2')}</span>
              </>
            }
          >
            <p className="italic">{t('club.lead')}</p>
            <p>{t('club.p1')}</p>
            <p>{t('club.p2')}</p>
          </BloqueRotulo>
        </div>
      </section>

      {/* ============ ASÍ NACIÓ EL CLUB ============ */}
      <section id="club-origen" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Texto contra el filete y, del otro lado, el escudo del club. */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4 text-gray-700 leading-relaxed md:text-right md:border-r md:border-[#9bb5a5] md:pr-6">
              <p>{t('club.p3')}</p>
              <p>{t('club.p4')}</p>
            </div>
            <div className="md:col-span-5 flex items-center justify-center">
              <Image
                src="/images/logo-club-rugby-hockey.svg"
                alt={t('club.logoAlt')}
                width={220}
                height={260}
                className="h-auto w-40 object-contain md:w-52"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ SAN ISIDRO COLLEGE DOJO ============ */}
      <section id="dojo" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5">
              {dojoMedia.length > 0 ? (
                <div className="h-[280px] w-full overflow-hidden rounded-xl shadow-lg md:h-[340px]">
                  <MediaCarousel
                    items={dojoMedia}
                    altText={tVida('dojo.carouselAlt')}
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <Image
                  src="/images/Image-SIC-dojo.webp"
                  alt={tVida('dojo.fallbackAlt')}
                  width={800}
                  height={600}
                  className="h-auto w-full rounded-xl shadow-lg"
                />
              )}
            </div>
            <div className="md:col-span-7 space-y-4 text-gray-700 leading-relaxed">
              <Image
                src="/images/logo-dojo.svg"
                alt={tVida('dojo.logoAlt')}
                width={160}
                height={80}
                className="h-16 w-auto object-contain"
              />
              <h2 className="text-xl font-bold text-[#c19516]">{tVida('dojo.title')}</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{tVida('dojo.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SAN ISIDRO BALANCE ============ */}
      <section id="san-isidro-balance" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 md:order-1 space-y-4 text-gray-700 leading-relaxed">
              <Image
                src="/images/logo-gym-2.svg"
                alt={tVida('gym.logoAlt')}
                width={160}
                height={80}
                className="h-16 w-auto object-contain"
              />
              <h2 className="text-xl font-bold text-[#c19516]">{tVida('gym.title')}</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{tVida('gym.description')}</p>
            </div>
            <div className="md:col-span-5 md:order-2">
              {gymMedia.length > 0 ? (
                <div className="h-[280px] w-full overflow-hidden rounded-xl shadow-lg md:h-[340px]">
                  <MediaCarousel
                    items={gymMedia}
                    altText={tVida('gym.carouselAlt')}
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <Image
                  src="/images/Image-deportes.webp"
                  alt={tVida('gym.fallbackAlt')}
                  width={800}
                  height={600}
                  className="h-auto w-full rounded-xl shadow-lg"
                />
              )}
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
