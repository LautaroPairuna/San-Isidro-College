export type AcademicLevelRouteKey = 'kindergarden' | 'primary' | 'secondary'
export type AcademicLevelContentKey = 'kindergarten' | 'primary' | 'secondary'

type AcademicLevelConfig = {
  routeKey: AcademicLevelRouteKey
  contentKey: AcademicLevelContentKey
  href: '/kindergarden' | '/primary' | '/secondary'
  sectionSlug: 'academicos-kinder' | 'academicos-primary' | 'academicos-secondary'
  fallbackImage: string
  color: string
}

export const ACADEMIC_LEVELS: AcademicLevelConfig[] = [
  {
    routeKey: 'kindergarden',
    contentKey: 'kindergarten',
    href: '/kindergarden',
    sectionSlug: 'academicos-kinder',
    fallbackImage: '/images/image-kindergarten.webp',
    color: '#c29618',
  },
  {
    routeKey: 'primary',
    contentKey: 'primary',
    href: '/primary',
    sectionSlug: 'academicos-primary',
    fallbackImage: '/images/fondo-iconos.webp',
    color: '#294161',
  },
  {
    routeKey: 'secondary',
    contentKey: 'secondary',
    href: '/secondary',
    sectionSlug: 'academicos-secondary',
    fallbackImage: '/images/image-kindergarten.webp',
    color: '#2d8f57',
  },
]

export const ACADEMIC_LEVELS_BY_ROUTE = Object.fromEntries(
  ACADEMIC_LEVELS.map((level) => [level.routeKey, level])
) as Record<AcademicLevelRouteKey, AcademicLevelConfig>
