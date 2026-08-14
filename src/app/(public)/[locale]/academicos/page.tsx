// /app/[locale]/academicos/page.tsx
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import SectionCarrusel from '@/components/sectionCarrusel'
import Contact from '@/components/sectionContact'
import { getMediaGroupByName } from '@/lib/pageContentCache'

/** Íconos de "Nuestros Propósitos", en el orden del diseño (dos filas de cuatro). */
const PROPOSITOS = [
  { key: 'contacto', icon: 'brindar-contacto-proposito.svg' },
  { key: 'comprension', icon: 'favorecer-comprension-proposito.svg' },
  { key: 'idioma', icon: 'promover-idioma-proposito.svg' },
  { key: 'acceso', icon: 'utilizar-ingles-proposito.svg' },
  { key: 'confianza', icon: 'fortalecer-confianza-proposito.svg' },
  { key: 'articular', icon: 'articular-lengua-proposito.svg' },
  { key: 'culturas', icon: 'ampliar-comprension-proposito.svg' },
  { key: 'herramientas', icon: 'brindar-herramientas-proposito.svg' },
] as const

const NIVELES = [
  { key: 'kindergarden', href: '/kindergarden' },
  { key: 'primary', href: '/primary' },
  { key: 'secondary', href: '/secondary' },
] as const

// ISR: se renderiza una vez y se sirve desde caché (menos RAM/CPU por request).
export const revalidate = 3600

type PageProps = {
  params: Promise<{ locale: string }>
}

const AcademicosPage = async ({ params }: PageProps) => {
  const { locale } = await params
  // Habilita el render estático (ISR) fijando el locale sin leer headers().
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'academicosHome' })

  const intro = ['p1', 'p2', 'p3', 'p4', 'p5'] as const

  // Alianzas (grupo global)
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  return (
    <div className="relative overflow-hidden">
      {/* ============ PROYECTO BILINGÜE ============ */}
      <section id="proyecto-bilingue" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#294161] leading-tight">
            {t('intro.title1')}
            <span className="block">{t('intro.title2')}</span>
          </h1>
          <div className="mt-8 space-y-5 text-gray-700 leading-relaxed text-justify">
            {intro.map((p) => (
              <p key={p}>{t(`intro.${p}`)}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ============ APRENDER INGLÉS Y APRENDER EN INGLÉS ============ */}
      <section id="aprender-ingles" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
            <h2 className="md:col-span-4 md:text-right text-xl font-bold text-[#c19516]">
              {t('aprenderIngles.label1')}
              <span className="block">{t('aprenderIngles.label2')}</span>
            </h2>
            <div className="md:col-span-7 md:col-start-6 md:max-w-md md:border-l md:border-[#9bb5a5] md:pl-6 space-y-4 italic text-gray-700 leading-relaxed text-justify hyphens-auto">
              <p>{t('aprenderIngles.p1')}</p>
              <p>{t('aprenderIngles.p2')}</p>
              <p>{t('aprenderIngles.p3')}</p>
              <p>
                {t.rich('aprenderIngles.p4', {
                  b: (chunks) => <strong className="font-bold not-italic">{chunks}</strong>,
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NUESTROS PROPÓSITOS ============ */}
      <section id="propositos" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-xl lg:text-2xl font-bold text-[#c19516]">
            {t('propositos.title')}
          </h2>

          <ul className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            {PROPOSITOS.map(({ key, icon }) => (
              <li key={key} className="flex flex-col items-center text-center">
                <Image
                  src={`/images/academicos/${icon}`}
                  alt=""
                  aria-hidden="true"
                  width={96}
                  height={96}
                  className="h-20 w-auto"
                />
                <p className="mt-3 text-sm text-gray-700 leading-snug">
                  {t(`propositos.${key}`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ NIVELES EDUCATIVOS ============ */}
      <section id="niveles" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#294161]">
            {t('niveles.title')}
          </h2>
          <p className="mt-3 max-w-2xl text-gray-700 leading-relaxed">
            {t('niveles.description')}
          </p>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {NIVELES.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="inline-flex items-center gap-2 font-semibold text-[#294161] hover:text-[#1e804b] transition-colors"
              >
                {t(`niveles.${key}`)}
                <span aria-hidden="true" className="text-[#c19516]">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FondoFormaSeccion />

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </div>
  )
}

export default AcademicosPage
