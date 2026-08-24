// /app/[locale]/experiencia-sic/fe-y-compromiso-social/page.tsx
import Image from 'next/image'
import BloqueRotulo from '@/components/BloqueRotulo'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import TiraFotos from '@/components/TiraFotos'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPageContentForSlug, type PageContentSection } from '@/lib/pageContentCache'

/** Sección con las fotos de servicio, editable desde el admin. */
const PAGE_SLUG = 'experiencia-sic-fe-y-compromiso-social'
const FOTOS_SECTION_SLUG = 'experiencia-sic-fe-servicio-fotos'

/** Instituciones, en el orden del diseño. */
const INSTITUCIONES = ['hopa', 'hirpaca', 'laEstrella', 'merendero'] as const

/** Fotos del repo para cuando el grupo del admin todavía está vacío. */
const FOTOS_FALLBACK = [
  '/images/Image-vida-estudiantil.webp',
  '/images/image-SIC-play.webp',
  '/images/Image-SIC-dojo.webp',
]

const VERDE = '#1e804b'
const DORADO = '#c19516'
const NAVY = '#294161'

type PageProps = {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

export default async function ExperienciaSicFePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'experienciaSicFeDetail' })

  const secciones = await getPageContentForSlug(PAGE_SLUG)
  const fotos = (
    secciones.find((seccion: PageContentSection) => seccion.slug === FOTOS_SECTION_SLUG)?.grupo?.medios ?? []
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
      <section id="fe-y-compromiso-social" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#294161] leading-tight">{t('title')}</h1>
          <p className="mt-3 text-base font-bold text-[#c19516]">{t('intro.lead')}</p>
          <div className="mt-6 space-y-5 text-gray-700 leading-relaxed">
            <p>{t('intro.p1')}</p>
            <p>{t('intro.p2')}</p>
            <p>{t('intro.p3')}</p>
          </div>
        </div>
      </section>

      {/* ============ EL LEGADO DE SAN ISIDRO LABRADOR ============ */}
      <section id="legado" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <BloqueRotulo
            rotulo={
              <>
                {t('legado.label1')}
                <span className="block">{t('legado.label2')}</span>
              </>
            }
          >
            <p>{t('legado.p1')}</p>
            <p>{t('legado.p2')}</p>
          </BloqueRotulo>
        </div>
      </section>

      {/* ============ APRENDER A TRAVÉS DEL SERVICIO ============ */}
      <section id="servicio" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Texto contra el filete y, del otro lado, el sello de Community Service. */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-4 text-gray-700 leading-relaxed md:text-right md:border-r md:border-[#9bb5a5] md:pr-6">
              <h2 className="text-xl font-bold text-[#c19516]">{t('servicio.title')}</h2>
              <p>{t('servicio.p1')}</p>
            </div>
            <div className="md:col-span-4 flex items-start justify-center md:justify-start">
              <Image
                src="/images/experiencias/fe-y-compromiso/aprender-atraves-servicio.svg"
                alt={t('servicio.logoAlt')}
                width={200}
                height={200}
                className="h-auto w-40 object-contain md:w-44"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12">
          <TiraFotos medios={fotos} altText={t('servicio.carouselAlt')} fallbacks={FOTOS_FALLBACK} />
        </div>

        {/* ============ INSTITUCIONES Y CAMPAÑAS ============ */}
        <div className="relative z-10 mt-12 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <article className="rounded-xl bg-[#f2f1e8] p-6">
              <h3 className="border-b border-[#9bb5a5] pb-2 text-base font-bold" style={{ color: NAVY }}>
                {t('instituciones.title')}
              </h3>
              <ul className="mt-4 space-y-2">
                {INSTITUCIONES.map((key) => (
                  <li key={key} className="flex items-center gap-2 text-sm text-gray-700">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: VERDE }}
                    />
                    {t(`instituciones.items.${key}` as const)}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl bg-[#fdf2e4] p-6">
              <h3 className="border-b pb-2 text-base font-bold" style={{ color: NAVY, borderColor: DORADO }}>
                {t('campanas.title')}
              </h3>
              <p className="mt-4 text-sm text-gray-700">{t('campanas.subtitle')}</p>
            </article>
          </div>
        </div>
      </section>

      <FondoFormaSeccion />
    </div>
  )
}
