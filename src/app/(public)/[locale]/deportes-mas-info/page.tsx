// /app/[locale]/deportes-mas-info/page.tsx
import BloqueRotulo from '@/components/BloqueRotulo'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import SectionCarrusel from '@/components/sectionCarrusel'
import Contact from '@/components/sectionContact'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getMediaGroupByName } from '@/lib/pageContentCache'
import { TITULO_PAGINA } from '@/lib/tipografia'

type PageProps = {
  params: Promise<{ locale: string }>
}

// ISR: se renderiza una vez y se sirve desde caché (menos RAM/CPU por request).
// El admin regenera al instante con revalidatePath(); 1h es solo el respaldo.
export const revalidate = 3600

export default async function DeportesMasInfoPage({ params }: PageProps) {
  const { locale } = await params
  // Habilita el render estático (ISR) fijando el locale sin leer headers().
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'deportesDetail' })
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  return (
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="deportes" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className={TITULO_PAGINA}>{t('title')}</h1>
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
        <div className="relative z-10 max-w-4xl mx-auto px-6">
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
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Texto contra el filete y, del otro lado, el escudo del club. */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4 text-gray-700 leading-relaxed md:text-right md:border-r md:border-[#9bb5a5] md:pr-6">
              <p>{t('club.p3')}</p>
              <p>{t('club.p4')}</p>
            </div>
            <div className="md:col-span-5 flex items-center justify-center">
              <img src="/images/logo-club-rugby-hockey.svg" alt={t('club.logoAlt')} width={220} height={260} className="h-auto w-40 object-contain md:w-52" />
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
