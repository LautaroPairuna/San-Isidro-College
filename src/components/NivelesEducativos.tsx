import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

const NIVELES = [
  { key: 'kindergarden', href: '/kindergarden' },
  { key: 'primary', href: '/primary' },
  { key: 'secondary', href: '/secondary' },
] as const

export type NivelKey = (typeof NIVELES)[number]['key']

/**
 * Franja verde de cierre con los enlaces a los tres niveles.
 *
 * Dentro de la página de un nivel se excluye el propio (`excluir`), como en el
 * diseño: Inicial muestra Primaria y Secundaria.
 */
export default async function NivelesEducativos({
  locale,
  excluir,
  className,
}: {
  locale: string
  excluir?: NivelKey
  className?: string
}) {
  const t = await getTranslations({ locale, namespace: 'nivelesEducativos' })
  const niveles = NIVELES.filter(({ key }) => key !== excluir)

  return (
    <section
      id="niveles"
      className={`relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32 ${className ?? ''}`}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#294161]">{t('title')}</h2>
        <p className="mt-3 max-w-2xl text-gray-700 leading-relaxed">{t('description')}</p>

        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
          {niveles.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="inline-flex items-center gap-2 font-semibold text-[#294161] hover:text-[#1e804b] transition-colors"
            >
              {t(key)}
              <span aria-hidden="true" className="text-[#c19516]">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
