// /app/[locale]/experiencia-sic/innovacion-y-robotica/page.tsx
import BloqueRotulo from '@/components/BloqueRotulo'
import IconoConFallback from '@/components/IconoConFallback'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import Contact from '@/components/sectionContact'
import SectionCarrusel from '@/components/sectionCarrusel'
import { toPublicImageUrl } from '@/lib/publicConstants'
import { getTranslations, setRequestLocale } from 'next-intl/server'
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

export default async function ExperienciaSicInnovacionRoboticaPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'experienciaSicInnovacionRoboticaDetail' })
  const alianzasMedia = await getMediaGroupByName('Alianzas')
  const studentIcons = await getMediaGroupByName('Experiencia SIC - Innovacion Students Icons')
  const toolsIcons = await getMediaGroupByName('Experiencia SIC - Innovacion Tools Icons')
  const studentDevelopment = resolveIcons(STUDENT_DEVELOPMENT, studentIcons)
  const labTools = resolveIcons(LAB_TOOLS, toolsIcons)

  return (
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="innovacion-y-robotica" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="max-w-3xl text-3xl lg:text-4xl font-bold text-[#294161] leading-tight">
            {t('title')}
          </h1>

          <BloqueRotulo className="mt-10" rotulo={t('intro.lead')}>
            <p>{t('intro.p1')}</p>
            <p>{t('intro.p2')}</p>
            <p>{t('intro.p3')}</p>
          </BloqueRotulo>
        </div>
      </section>

      {/* ============ QUÉ DESARROLLAN NUESTROS ALUMNOS ============ */}
      <section id="alumnos" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('students.title')}</h2>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {studentDevelopment.map((item) => (
              <article key={item.key} className="flex flex-col items-center text-center">
                <IconoConFallback
                  src={item.icon}
                  fallbackSrc={item.fallbackIcon}
                  width={140}
                  height={140}
                  className="h-28 w-28 object-contain md:h-32 md:w-32"
                />
                <h3 className="mt-4 text-lg font-bold leading-tight text-[#294161]">
                  {t(`students.items.${item.key}.title` as const)}
                </h3>
                <p className="mt-2 max-w-[240px] text-sm leading-snug text-gray-700">
                  {t(`students.items.${item.key}.description` as const)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ UN ESPACIO PARA EXPERIMENTAR ============ */}
      <section id="laboratorio" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('lab.title')}</h2>
          <p className="mt-4 max-w-3xl text-gray-700 leading-relaxed">{t('lab.p1')}</p>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-7">
            {labTools.map((tool) => (
              <li key={tool.key} className="flex flex-col items-center text-center">
                <IconoConFallback
                  src={tool.icon}
                  fallbackSrc={tool.fallbackIcon}
                  width={88}
                  height={88}
                  className="h-16 w-16 object-contain md:h-20 md:w-20"
                />
                <span className="mt-3 text-sm font-bold leading-tight text-[#294161]">
                  {t(`lab.tools.${tool.key}` as const)}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-12 max-w-3xl font-bold text-[#294161] leading-relaxed">
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
