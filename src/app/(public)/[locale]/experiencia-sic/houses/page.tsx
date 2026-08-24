// /app/[locale]/experiencia-sic/houses/page.tsx
import BloqueRotulo from '@/components/BloqueRotulo'
import FondoFormaSeccion from '@/components/FondoFormaSeccion'
import HousesFlipCards, { type HouseCardItem } from '@/components/HousesFlipCards'
import { getTranslations, setRequestLocale } from 'next-intl/server'

/**
 * Las tres Houses. El frente lleva el escudo en blanco sobre el color de la
 * House; el dorso, el escudo a color. La barra superior va en navy salvo en Owl,
 * que es navy y quedaría plana: ahí va en verde, como en el diseño.
 */
const HOUSES = [
  { key: 'condor', color: '#145d35', headerColor: '#294161' },
  { key: 'owl', color: '#294161', headerColor: '#145d35' },
  { key: 'falcon', color: '#c09515', headerColor: '#294161' },
] as const

type HouseKey = (typeof HOUSES)[number]['key']

type PageProps = {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

export default async function ExperienciaSicHousesPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'experienciaSicHousesDetail' })

  const casas: HouseCardItem[] = HOUSES.map(({ key, color, headerColor }) => {
    const item = (campo: string) => t(`casas.items.${key as HouseKey}.${campo}`)

    return {
      key,
      house: item('house'),
      name: item('name'),
      school: t('casas.school'),
      crest: `/images/experiencias/houses/${key}-house-blanco.svg`,
      badge: `/images/experiencias/houses/${key}-house-color.svg`,
      color,
      headerColor,
      traits: item('traits'),
      description: item('description'),
      purposeLabel: t('casas.purposeLabel'),
      purpose: item('purpose'),
      qualitiesLabel: t('casas.qualitiesLabel'),
      qualities: item('qualities'),
      symbolsLabel: t('casas.symbolsLabel'),
      symbols: [
        { name: item('symbol1Name'), text: item('symbol1Text') },
        { name: item('symbol2Name'), text: item('symbol2Text') },
      ],
      motto: item('motto'),
    }
  })

  return (
    <div className="relative overflow-hidden">
      {/* ============ PRESENTACIÓN ============ */}
      <section id="houses" className="relative w-full bg-white pt-40 pb-16 lg:pb-24">
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

      {/* ============ TRES HOUSES, UNA COMUNIDAD ============ */}
      <section id="comunidad" className="relative w-full bg-[#dcebe0] py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <BloqueRotulo
            rotulo={
              <>
                {t('comunidad.label1')}
                <span className="block">{t('comunidad.label2')}</span>
              </>
            }
          >
            <p>{t('comunidad.p1')}</p>
            <p>{t('comunidad.p2')}</p>
          </BloqueRotulo>
        </div>
      </section>

      {/* ============ LAS TRES HOUSES ============ */}
      <section id="las-houses" className="relative w-full bg-white py-16 lg:py-24 scroll-mt-32">
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-bold text-[#c19516]">{t('casas.title')}</h2>

          <HousesFlipCards items={casas} ariaLabel={t('casas.ariaLabel')} />

          <div className="mt-12 space-y-4 text-gray-700 leading-relaxed">
            <p>{t('closing.p1')}</p>
            <p>{t('closing.p2')}</p>
          </div>
        </div>
      </section>

      <FondoFormaSeccion />

    </div>
  )
}
