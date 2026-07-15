// /app/[locale]/academicos-mas-info/page.tsx
import AcademicLevelCardsSection from '@/components/AcademicLevelCardsSection'
import SectionCarrusel from '@/components/sectionCarrusel'
import Contact from '@/components/sectionContact'
import { getTranslations } from 'next-intl/server'
import { getMediaGroupByName } from '@/lib/pageContentCache'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function AcademicosMasInfoPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'academicosMasInfo' })
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  return (
    <>
      <section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-60 xl:px-80 overflow-hidden">
        {/* CONTENEDOR CENTRAL CON FONDO BLANCO */}
        <div className="relative max-w-325 mx-auto bg-white min-h-screen px-8 pb-8 pt-24">
          {/* CONTENIDO PRINCIPAL */}
          <h2
            id="proyecto"
            className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-shadow-bold-movil"
          >
            {t('proyectoTitulo')}
          </h2>

          <div className="space-y-4 leading-relaxed text-gray-800 text-left">
            <p>{t('introduccion.p1')}</p>
            <p>{t('introduccion.p2')}</p>
            <p>{t('introduccion.p3')}</p>
            <p>{t('introduccion.p4')}</p>
            <p>{t('introduccion.p5')}</p>
            <p className="font-bold">{t('introduccion.bold1')}</p>
            <p className="font-bold">{t('introduccion.bold2')}</p>
          </div>

          {/* Inglés, Indispensable */}
          <div className="space-y-4 mt-10 text-left">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 text-shadow-bold-movil">
              {t('inglesTitulo')}
            </h3>
            <p>{t('ingles.p1')}</p>
            <p>{t('ingles.p2')}</p>
            <p>{t('ingles.p3')}</p>
            <p>{t('ingles.p4')}</p>
          </div>

          <AcademicLevelCardsSection locale={locale} variant="overview" />
        </div>
      </section>
      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </>
  )
}
