// /app/[locale]/experiencia-sic/google-reference-school/page.tsx
import Image from 'next/image'
import BloqueRotulo from '@/components/BloqueRotulo'
import IconoConFallback from '@/components/IconoConFallback'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import Contact from '@/components/sectionContact'
import SectionCarrusel from '@/components/sectionCarrusel'
import { toPublicImageUrl } from '@/lib/publicConstants'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getMediaGroupByName } from '@/lib/pageContentCache'

const STUDENT_FEATURES = [
  { key: 'collaborativeLearning', fallbackIcon: '/images/icons/aprendizaje-colaborativo-ico.svg' },
  { key: 'digitalCitizenship', fallbackIcon: '/images/icons/ciudadania-digital-ico.svg' },
  { key: 'creativeThinking', fallbackIcon: '/images/icons/preparacion-futuro-2-ico.svg' },
  { key: 'futureReady', fallbackIcon: '/images/icons/preparacion-futuro-ico.svg' },
] as const

const TEACHER_FEATURES = [
  { key: 'enhanceTeaching', fallbackIcon: '/images/icons/potenciar-ensenanza-ico.svg' },
  { key: 'innovateWithConfidence', fallbackIcon: '/images/icons/innovar-confianza-ico.svg' },
  { key: 'collaborateToGrow', fallbackIcon: '/images/icons/colaborar-crecer-ico.svg' },
  { key: 'inspireStudents', fallbackIcon: '/images/icons/inspirar-alumnos-ico.svg' },
] as const

const GOOGLE_APPS = [
  { key: 'drive', fallbackIcon: '/images/icons/google/drive-ico.svg', label: 'Drive' },
  { key: 'gemini', fallbackIcon: '/images/icons/google/gemini-ico.svg', label: 'Gemini' },
  { key: 'notebookLm', fallbackIcon: '/images/icons/google/notebook-lm-ico.svg', label: 'NotebookLM' },
  { key: 'calendar', fallbackIcon: '/images/icons/google/calendar-ico.svg', label: 'Calendar' },
  { key: 'sites', fallbackIcon: '/images/icons/google/sites-ico.svg', label: 'Sites' },
  { key: 'forms', fallbackIcon: '/images/icons/google/forms-ico.svg', label: 'Forms' },
  { key: 'gmail', fallbackIcon: '/images/icons/google/gmail-ico.svg', label: 'Gmail' },
  { key: 'classroom', fallbackIcon: '/images/icons/google/classroom-ico.svg', label: 'Classroom' },
  { key: 'sheets', fallbackIcon: '/images/icons/google/sheets-ico.svg', label: 'Sheets' },
  { key: 'docs', fallbackIcon: '/images/icons/google/docs-ico.svg', label: 'Docs' },
  { key: 'slides', fallbackIcon: '/images/icons/google/slides-ico.svg', label: 'Slides' },
] as const

type PageProps = {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

function resolveIcons<T extends { fallbackIcon: string }>(
  items: readonly T[],
  medias: Awaited<ReturnType<typeof getMediaGroupByName>>
) {
  return items.map((item, index) => ({
    ...item,
    icon: medias[index] ? toPublicImageUrl('medios', medias[index]!.urlArchivo) : item.fallbackIcon,
  }))
}

/** Fila de íconos con título y detalle, igual para alumnos y docentes. */
function GrillaIconos({
  items,
  t,
  namespace,
}: {
  items: readonly { key: string; icon: string; fallbackIcon: string }[]
  t: Awaited<ReturnType<typeof getTranslations>>
  namespace: 'students' | 'teachers'
}) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.key} className="flex flex-col items-center text-center">
          <IconoConFallback
            src={item.icon}
            fallbackSrc={item.fallbackIcon}
            width={140}
            height={140}
            className="h-28 w-28 object-contain md:h-32 md:w-32"
          />
          <h3 className="mt-4 text-lg font-bold leading-tight text-[#294161]">
            {t(`${namespace}.items.${item.key}.title` as const)}
          </h3>
          <p className="mt-2 max-w-[240px] text-sm leading-snug text-gray-700">
            {t(`${namespace}.items.${item.key}.description` as const)}
          </p>
        </article>
      ))}
    </div>
  )
}

export default async function ExperienciaSicGoogleReferenceSchoolPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'experienciaSicGoogleReferenceSchoolDetail' })
  const alianzasMedia = await getMediaGroupByName('Alianzas')
  const studentIcons = await getMediaGroupByName('Experiencia SIC - Google Students Icons')
  const teacherIcons = await getMediaGroupByName('Experiencia SIC - Google Teachers Icons')
  const googleAppsIcons = await getMediaGroupByName('Experiencia SIC - Google Apps')
  const studentFeatures = resolveIcons(STUDENT_FEATURES, studentIcons)
  const teacherFeatures = resolveIcons(TEACHER_FEATURES, teacherIcons)
  const googleApps = resolveIcons(GOOGLE_APPS, googleAppsIcons)

  return (
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="google-reference-school" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="inline-flex rounded-lg border border-gray-200 px-6 py-4 shadow-sm">
            <Image
              src="/images/google-education-logo.webp"
              alt={t('logoAlt')}
              width={280}
              height={90}
              className="h-auto w-[200px] object-contain md:w-[240px]"
            />
          </div>

          <h1 className="mt-8 text-3xl lg:text-4xl font-bold text-[#294161] leading-tight">
            {t('title')}
          </h1>
          <p className="mt-6 text-gray-700 leading-relaxed">{t('intro.p1')}</p>
        </div>
      </section>

      {/* ============ QUÉ ES SER GOOGLE REFERENCE SCHOOL ============ */}
      <section id="que-es" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <BloqueRotulo rotulo={t('whatIs.title')}>
            <p>{t('whatIs.p1')}</p>
            <p>{t('whatIs.p2')}</p>
          </BloqueRotulo>
        </div>
      </section>

      {/* ============ QUÉ SIGNIFICA PARA NUESTROS ALUMNOS ============ */}
      <section id="alumnos" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('students.title')}</h2>
          <GrillaIconos items={studentFeatures} t={t} namespace="students" />
        </div>
      </section>

      {/* ============ QUÉ SIGNIFICA PARA NUESTROS DOCENTES ============ */}
      <section id="docentes" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('teachers.title')}</h2>
          <GrillaIconos items={teacherFeatures} t={t} namespace="teachers" />
        </div>
      </section>

      {/* ============ LA TECNOLOGÍA COMO PARTE DEL APRENDIZAJE ============ */}
      <section id="tecnologia" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('technology.title')}</h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            {t('technology.p1')}
          </p>

          <ul className="mt-10 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-11">
            {googleApps.map((app) => (
              <li key={app.key} className="flex flex-col items-center text-center">
                <IconoConFallback
                  src={app.icon}
                  fallbackSrc={app.fallbackIcon}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <span className="mt-2 text-xs font-medium text-gray-700">{app.label}</span>
              </li>
            ))}
          </ul>

          <p className="mt-12 font-bold text-[#294161] leading-relaxed">
            {t('closing.p1')}
          </p>
        </div>
      </section>

      <FondoFormaSeccion />

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </div>
  )
}
