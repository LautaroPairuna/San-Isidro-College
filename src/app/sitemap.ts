import type { MetadataRoute } from 'next'
import { routing, type AppPathname } from '@/i18n/routing'
import { getPathname } from '@/i18n/navigation'
import { getBaseUrl } from '@/lib/siteConfig'

// Pathnames internos públicos (claves del mapa de rutas localizadas).
const PUBLIC_HREFS: AppPathname[] = [
  '/',
  '/colegio',
  '/academicos',
  '/academicos-mas-info',
  '/vida-estudiantil',
  '/vida-estudiantil-mas-info',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const lastModified = new Date()

  const urls: MetadataRoute.Sitemap = []

  for (const href of PUBLIC_HREFS) {
    const languages: Record<string, string> = {}
    for (const locale of routing.locales) {
      // getPathname resuelve el slug localizado (p. ej. /en/school) con prefijo.
      languages[locale] = `${baseUrl}${getPathname({ locale, href })}`
    }

    const canonical = languages[routing.defaultLocale] ?? languages[routing.locales[0]]!
    // x-default mejora el targeting internacional (Google elige el idioma por usuario).
    languages['x-default'] = canonical

    urls.push({
      url: canonical,
      lastModified,
      changeFrequency: 'weekly',
      priority: href === '/' ? 1 : 0.8,
      alternates: { languages },
    })
  }

  return urls
}
