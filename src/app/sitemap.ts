import type { MetadataRoute } from 'next'
import { getPathname } from '@/i18n/navigation'
import { routing, type AppPathname } from '@/i18n/routing'

function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'http://localhost:3000'
  return raw.replace(/\/+$/, '')
}

const PUBLIC_PATHS: AppPathname[] = [
  '/',
  '/colegio',
  '/academicos',
  '/academicos-mas-info',
  '/kindergarden',
  '/primary',
  '/secondary',
  '/experiencia-sic',
  '/deportes',
  '/deportes-mas-info',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const lastModified = new Date()

  const urls: MetadataRoute.Sitemap = []

  for (const path of PUBLIC_PATHS) {
    const languages: Record<string, string> = {}
    for (const locale of routing.locales) {
      languages[locale] = `${baseUrl}${getPathname({ locale, href: path })}`
    }

    const canonical = languages[routing.defaultLocale] ?? languages[routing.locales[0]]!

    urls.push({
      url: canonical,
      lastModified,
      changeFrequency: 'weekly',
      priority: path === '/' ? 1 : 0.8,
      alternates: { languages },
    })
  }

  return urls
}
