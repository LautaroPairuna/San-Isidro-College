import type { Metadata } from 'next';
import { routing, type AppPathname } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import { getBaseUrl, siteConfig, GEO, OG_LOCALES } from '@/lib/siteConfig';

type AppLocale = (typeof routing.locales)[number];

type BuildMetadataArgs = {
  locale: string;
  /** Pathname interno de la ruta, p. ej. '/' (home) o '/colegio'. */
  href?: AppPathname;
  title: string;
  description: string;
  /** Imagen para compartir (ruta absoluta o relativa al dominio). */
  image?: string;
};

function toAbsolute(baseUrl: string, src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return `${baseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
}

/**
 * Construye la metadata de una página con:
 *  - canonical + hreflang (alternates por locale + x-default)
 *  - Open Graph / Twitter localizados
 *  - geo meta tags (geo.region, geo.placename, geo.position, ICBM)
 */
export function buildPageMetadata({
  locale,
  href = '/',
  title,
  description,
  image,
}: BuildMetadataArgs): Metadata {
  const baseUrl = getBaseUrl();

  // Cada idioma tiene su propio slug (localized pathnames), por eso resolvemos
  // la ruta por locale en lugar de reutilizar el mismo sufijo. getPathname ya
  // incluye el prefijo de locale (p. ej. '/en/school').
  const localizedPath = (loc: AppLocale) => getPathname({ locale: loc, href });

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${baseUrl}${localizedPath(loc)}`;
  }
  // x-default apunta al locale por defecto (mejor práctica para SEO internacional).
  languages['x-default'] = `${baseUrl}${localizedPath(routing.defaultLocale)}`;

  const canonical = `${baseUrl}${localizedPath(locale as AppLocale)}`;
  const ogImage = toAbsolute(baseUrl, image ?? siteConfig.defaultOgImage);
  const ogLocale = OG_LOCALES[locale] ?? OG_LOCALES[routing.defaultLocale];
  const alternateLocales = routing.locales
    .filter((l) => l !== locale)
    .map((l) => OG_LOCALES[l])
    .filter(Boolean);

  return {
    metadataBase: new URL(baseUrl),
    // absolute: el título ya viene completo desde i18n; evitamos el template del root.
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title,
      description,
      url: canonical,
      locale: ogLocale,
      alternateLocale: alternateLocales,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    // Geo meta tags para reforzar la localización del negocio (Salta, Argentina).
    other: {
      'geo.region': GEO.region,
      'geo.placename': GEO.placename,
      'geo.position': `${GEO.latitude};${GEO.longitude}`,
      ICBM: `${GEO.latitude}, ${GEO.longitude}`,
    },
  };
}
