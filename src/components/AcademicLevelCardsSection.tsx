import AcademicLevelCards, { type AcademicLevelCardItem } from '@/components/AcademicLevelCards'
import { ACADEMIC_LEVELS, type AcademicLevelRouteKey } from '@/lib/academicLevels'
import { getPageContentForSlug, type PageContentSection } from '@/lib/pageContentCache'
import { toPublicImageUrl } from '@/lib/publicConstants'
import { getTranslations } from 'next-intl/server'

type AcademicLevelCardsSectionProps = {
  locale: string
  variant: 'overview' | 'detail'
  excludeLevel?: AcademicLevelRouteKey
}

export default async function AcademicLevelCardsSection({
  locale,
  variant,
  excludeLevel,
}: AcademicLevelCardsSectionProps) {
  const t = await getTranslations({ locale, namespace: 'academicosLevelsNav' })
  const academicosSections = await getPageContentForSlug('academicos')

  const items: AcademicLevelCardItem[] = ACADEMIC_LEVELS
    .filter((level) => level.routeKey !== excludeLevel)
    .map((level) => {
      const medio = academicosSections.find(
        (section: PageContentSection) => section.slug === level.sectionSlug
      )?.medio

      return {
        key: level.routeKey,
        title: t(`levels.${level.routeKey}.title`),
        description: t(`levels.${level.routeKey}.description`),
        href: level.href,
        imageSrc: medio?.urlArchivo ? toPublicImageUrl('medios', medio.urlArchivo) : level.fallbackImage,
        imageAlt: medio?.textoAlternativo || t(`levels.${level.routeKey}.title`),
        color: level.color,
        ctaLabel: t('cta'),
      }
    })

  const title = variant === 'overview' ? t('overviewTitle') : t('detailTitle')
  const columnsClassName =
    variant === 'overview'
      ? 'grid-cols-1 md:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2'

  return <AcademicLevelCards title={title} items={items} columnsClassName={columnsClassName} />
}
