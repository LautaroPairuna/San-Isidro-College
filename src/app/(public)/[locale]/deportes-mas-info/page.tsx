// /app/[locale]/deportes-mas-info/page.tsx
import SmoothLink from '@/components/SmoothLink'
import AsideMenu from '@/components/AsideMenu'
import SectionCarrusel from '@/components/sectionCarrusel'
import Contact from '@/components/sectionContact'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getMediaGroupByName } from '@/lib/pageContentCache'

// ISR: se renderiza una vez y se sirve desde caché (menos RAM/CPU por request).
// El admin regenera al instante con revalidatePath(); 1h es solo el respaldo.
export const revalidate = 3600

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function DeportesMasInfoPage({ params }: PageProps) {
  const { locale } = await params
  // Habilita el render estático (ISR) fijando el locale sin leer headers().
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'vidaEstudiantilMasInfo' })
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  return (
    <>
      <section className="relative w-full min-h-screen bg-[#71af8d] px-5 md:px-24 lg:px-60 xl:px-72 overflow-hidden">
        {/* CONTENEDOR CENTRAL CON FONDO BLANCO */}
        <div className="relative max-w-250 mx-auto bg-white min-h-screen px-8 pb-8 pt-40">
          {/* CONTENIDO PRINCIPAL */}
          <div>
            <h2
              id="proyecto"
              className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-shadow-bold-movil"
            >
              {t('proyectoTitle')}
            </h2>
            {/* Deportes */}
            <div className="space-y-6 leading-relaxed text-gray-800 text-left" id="deportes">
              <p>{t('intro.p1')}</p>
              <p>{t('intro.p2')}</p>
              <p>{t('intro.p3')}</p>
            </div>
          </div>
        </div>
      </section>

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </>
  )
}
