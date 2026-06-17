import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getBaseUrl } from '@/lib/siteConfig'

const PUBLIC_PATHS = [
  '',
  'colegio',
  'academicos',
  'academicos-mas-info',
  'vida-estudiantil',
  'vida-estudiantil-mas-info',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const lastModified = new Date()

  const urls: MetadataRoute.Sitemap = []

  for (const path of PUBLIC_PATHS) {
    const languages: Record<string, string> = {}
    for (const locale of routing.locales) {
      const localePrefix = `/${locale}`
      const suffix = path ? `/${path}` : ''
      languages[locale] = `${baseUrl}${localePrefix}${suffix}`
    }

    const canonical = languages[routing.defaultLocale] ?? languages[routing.locales[0]]!
    // x-default mejora el targeting internacional (Google elige el idioma por usuario).
    languages['x-default'] = canonical

    urls.push({
      url: canonical,
      lastModified,
      changeFrequency: 'weekly',
      priority: path === '' ? 1 : 0.8,
      alternates: { languages },
    })
  }

  return urls
}
