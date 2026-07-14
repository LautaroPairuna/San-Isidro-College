import Image from 'next/image'
import Contact from '@/components/sectionContact'
import SectionCarrusel from '@/components/sectionCarrusel'
import { toPublicImageUrl } from '@/lib/publicConstants'
import { getTranslations } from 'next-intl/server'
import { getMediaGroupByName } from '@/lib/pageContentCache'

const STUDENT_DEVELOPMENT = [
  { key: 'creativeThinking', fallbackIcon: '/images/icons/pensamiento-creativo-ico.svg' },
  { key: 'problemSolving', fallbackIcon: '/images/icons/resolucion-problemas-ico.svg' },
  { key: 'teamwork', fallbackIcon: '/images/icons/trabajo-equipo-ico.svg' },
  { key: 'computationalThinking', fallbackIcon: '/images/icons/pensamiento-computacional-ico.svg' },
] as const

const LAB_TOOLS = [
  { key: 'robotics', fallbackIcon: '/images/icons/robotica-ico.svg' },
  { key: 'programming', fallbackIcon: '/images/icons/programacion-ico.svg' },
  { key: 'electronics', fallbackIcon: '/images/icons/electronica-ico.svg' },
  { key: 'projectDesign', fallbackIcon: '/images/icons/diseno-proyectos-ico.svg' },
  { key: 'prototyping', fallbackIcon: '/images/icons/prototipado-ico.svg' },
  { key: 'challengeSolving', fallbackIcon: '/images/icons/resolucion-desafios-ico.svg' },
  { key: 'printing3d', fallbackIcon: '/images/icons/impresion-3d-ico.svg' },
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

function DevelopmentGrid({
  title,
  items,
  t,
}: {
  title: string
  items: readonly { key: string; icon: string }[]
  t: Awaited<ReturnType<typeof getTranslations>>
}) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold leading-tight text-gray-800 md:text-3xl">{title}</h2>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.key} className="flex flex-col items-center text-center">
            <Image
              src={item.icon}
              alt={t(`students.items.${item.key}.title` as const)}
              width={140}
              height={140}
              className="h-28 w-28 object-contain md:h-32 md:w-32"
            />
            <h3 className="mt-4 text-lg font-bold leading-tight text-gray-800 md:text-xl">
              {t(`students.items.${item.key}.title` as const)}
            </h3>
            <p className="mt-2 max-w-[220px] text-[13px] leading-snug text-gray-700 md:max-w-[240px] md:text-sm">
              {t(`students.items.${item.key}.description` as const)}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

function ToolsGrid({
  items,
  t,
}: {
  items: readonly { key: string; icon: string }[]
  t: Awaited<ReturnType<typeof getTranslations>>
}) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {items.map((item) => (
        <div key={item.key} className="flex flex-col items-center text-center">
          <Image
            src={item.icon}
            alt={t(`lab.tools.${item.key}` as const)}
            width={88}
            height={88}
            className="h-20 w-20 object-contain"
          />
          <span className="mt-3 text-base font-semibold leading-tight text-gray-800">
            {t(`lab.tools.${item.key}` as const)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default async function ExperienciaSicInnovacionRoboticaPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experienciaSicInnovacionRoboticaDetail' })
  const alianzasMedia = await getMediaGroupByName('Alianzas')
  const studentIcons = await getMediaGroupByName('Experiencia SIC - Innovacion Students Icons')
  const toolsIcons = await getMediaGroupByName('Experiencia SIC - Innovacion Tools Icons')
  const studentDevelopment = resolveIcons(STUDENT_DEVELOPMENT, studentIcons)
  const labTools = resolveIcons(LAB_TOOLS, toolsIcons)

  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden bg-[#71af8d] px-5 md:px-24 lg:px-60 xl:px-72">
        <div className="relative mx-auto min-h-screen max-w-[1000px] bg-white px-8 pb-12 pt-24">
          <div className="space-y-4 text-left text-gray-800">
            <h1 className="text-4xl font-bold leading-tight text-shadow-bold-movil md:text-5xl">
              {t('title')}
            </h1>
            <p className="text-lg font-bold leading-snug text-gray-800">{t('intro.lead')}</p>
            <p>{t('intro.p1')}</p>
            <p>{t('intro.p2')}</p>
            <p>{t('intro.p3')}</p>
          </div>

          <DevelopmentGrid title={t('students.title')} items={studentDevelopment} t={t} />

          <section className="mt-12 text-gray-800">
            <h2 className="text-2xl font-bold leading-tight text-gray-800 md:text-3xl">{t('lab.title')}</h2>
            <p className="mt-3 text-left text-gray-700">{t('lab.p1')}</p>
            <ToolsGrid items={labTools} t={t} />
          </section>

          <section className="mt-12 text-left text-gray-800">
            <p className="text-lg font-semibold leading-relaxed">{t('closing.p1')}</p>
          </section>
        </div>
      </section>

      <SectionCarrusel medios={alianzasMedia} />
      <Contact />
    </>
  )
}
