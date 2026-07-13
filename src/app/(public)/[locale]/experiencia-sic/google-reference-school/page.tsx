import Image from 'next/image'
import Contact from '@/components/sectionContact'
import SectionCarrusel from '@/components/sectionCarrusel'
import { toPublicImageUrl } from '@/lib/publicConstants'
import { getTranslations } from 'next-intl/server'
import { getMediaGroupByName } from '@/lib/pageContentCache'

const STUDENT_FEATURES = [
  { key: 'collaborativeLearning', icon: 'aprendizaje-colaborativo-ico.svg' },
  { key: 'digitalCitizenship', icon: 'ciudadania-digital-ico.svg' },
  { key: 'creativeThinking', icon: 'preparacion-futuro-2-ico.svg' },
  { key: 'futureReady', icon: 'preparacion-futuro-ico.svg' },
] as const

const TEACHER_FEATURES = [
  { key: 'enhanceTeaching', icon: 'potenciar-ensenanza-ico.svg' },
  { key: 'innovateWithConfidence', icon: 'innovar-confianza-ico.svg' },
  { key: 'collaborateToGrow', icon: 'colaborar-crecer-ico.svg' },
  { key: 'inspireStudents', icon: 'inspirar-alumnos-ico.svg' },
] as const

const GOOGLE_APPS = [
  { key: 'drive', icon: 'google/drive-ico.svg', label: 'Drive' },
  { key: 'gemini', icon: 'google/gemini-ico.svg', label: 'Gemini' },
  { key: 'notebookLm', icon: 'google/notebook-lm-ico.svg', label: 'NotebookLM' },
  { key: 'calendar', icon: 'google/calendar-ico.svg', label: 'Calendar' },
  { key: 'sites', icon: 'google/sites-ico.svg', label: 'Sites' },
  { key: 'forms', icon: 'google/forms-ico.svg', label: 'Forms' },
  { key: 'gmail', icon: 'google/gmail-ico.svg', label: 'Gmail' },
  { key: 'classroom', icon: 'google/classroom-ico.svg', label: 'Classroom' },
  { key: 'sheets', icon: 'google/sheets-ico.svg', label: 'Sheets' },
  { key: 'docs', icon: 'google/docs-ico.svg', label: 'Docs' },
  { key: 'slides', icon: 'google/slides-ico.svg', label: 'Slides' },
] as const

type PageProps = {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

type StudentFeatureKey = (typeof STUDENT_FEATURES)[number]['key']
type TeacherFeatureKey = (typeof TEACHER_FEATURES)[number]['key']

function FeatureGrid({
  title,
  items,
  t,
  namespace,
}: {
  title: string
  items: readonly { key: string; icon: string }[]
  t: Awaited<ReturnType<typeof getTranslations>>
  namespace: 'students' | 'teachers'
}) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold leading-tight text-gray-800 md:text-3xl">{title}</h2>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.key} className="flex flex-col items-center text-center">
            <Image
              src={toPublicImageUrl('medios', item.icon)}
              alt={t(`${namespace}.items.${item.key}.title` as const)}
              width={140}
              height={140}
              className="h-32 w-32 object-contain md:h-36 md:w-36"
            />
            <h3 className="mt-4 text-lg font-bold leading-tight text-gray-800 md:text-xl">
              {t(`${namespace}.items.${item.key}.title` as const)}
            </h3>
            <p className="mt-2 max-w-[220px] text-[13px] leading-snug text-gray-700 md:max-w-[240px] md:text-sm">
              {t(`${namespace}.items.${item.key}.description` as const)}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default async function ExperienciaSicGoogleReferenceSchoolPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experienciaSicGoogleReferenceSchoolDetail' })
  const alianzasMedia = await getMediaGroupByName('Alianzas')

  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden bg-[#71af8d] px-5 md:px-24 lg:px-60 xl:px-72">
        <div className="relative mx-auto min-h-screen max-w-[1000px] bg-white lg:px-16 px-8 pb-12 pt-24">
          <div className="space-y-5 text-justify text-gray-800">
            <Image
              src="/images/google-education-logo.webp"
              alt={t('logoAlt')}
              width={280}
              height={90}
              className="mx-auto h-auto w-[220px] object-contain md:w-[280px]"
            />

            <h1 className="text-4xl font-bold leading-tight text-shadow-bold-movil md:text-5xl">
              {t('title')}
            </h1>
            <p>{t('intro.p1')}</p>

            <div>
              <h2 className="text-2xl font-bold leading-tight text-gray-800">{t('whatIs.title')}</h2>
              <p className="mt-3">{t('whatIs.p1')}</p>
              <p className="mt-3">{t('whatIs.p2')}</p>
            </div>
          </div>

          <FeatureGrid
            title={t('students.title')}
            items={STUDENT_FEATURES}
            t={t}
            namespace="students"
          />

          <FeatureGrid
            title={t('teachers.title')}
            items={TEACHER_FEATURES}
            t={t}
            namespace="teachers"
          />

          <section className="mt-12 text-justify text-gray-800">
            <h2 className="text-2xl font-bold leading-tight text-gray-800 md:text-3xl">
              {t('technology.title')}
            </h2>
            <p className="mt-3">{t('technology.p1')}</p>

            <div className="mt-8 grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
              {GOOGLE_APPS.map((app) => (
                <div key={app.key} className="flex flex-col items-center justify-start text-center">
                  <Image
                    src={toPublicImageUrl('medios', app.icon)}
                    alt={app.label}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                  <span className="mt-2 text-xs font-medium text-gray-700">{app.label}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 font-semibold">{t('closing.p1')}</p>
          </section>
        </div>
      </section>

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </>
  )
}
