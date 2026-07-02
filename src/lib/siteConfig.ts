// Configuración central del sitio: datos de marca, contacto y geolocalización.
// Se usa para SEO (metadata, hreflang, JSON-LD, geo meta tags) y como única
// fuente de verdad para la URL base.

// Dominio de producción (post-migración de DNS). Se usa como fallback cuando el
// hosting no define NEXT_PUBLIC_SITE_URL / SITE_URL, para evitar que canonical,
// hreflang, sitemap y Open Graph queden apuntando a localhost en producción.
export const PRODUCTION_SITE_URL = 'https://www.sanisidrocollege.com.ar';

export function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : PRODUCTION_SITE_URL);
  return raw.replace(/\/+$/, '');
}

// Coordenadas tomadas de la ubicación oficial en Google Maps (San Lorenzo, Salta).
export const GEO = {
  latitude: -24.7924737,
  longitude: -65.4864963,
  // ISO 3166-2 de la provincia de Salta (Argentina).
  region: 'AR-A',
  placename: 'San Lorenzo, Salta, Argentina',
} as const;

export const siteConfig = {
  name: 'San Isidro College',
  shortName: 'San Isidro College',
  legalName: 'San Isidro College',
  // Descripción por defecto (se sobreescribe por página vía i18n).
  description:
    'San Isidro College es un colegio bilingüe de orientación católica con un proyecto educativo sólido e innovador en San Lorenzo, Salta, Argentina.',
  email: 'info@colegiosanisidrosalta.edu.ar',
  // Imagen por defecto para compartir en redes (Open Graph / Twitter).
  // PNG 1200x630 con el logo institucional: WhatsApp/Facebook no renderizan SVG
  // ni WebP de forma confiable en previews, por eso usamos un raster con la marca.
  defaultOgImage: '/images/og-san-isidro.png',
  address: {
    streetAddress: 'Avenida Finca Yerba Buena 1500',
    addressLocality: 'San Lorenzo',
    addressRegion: 'Salta',
    postalCode: 'A4401',
    addressCountry: 'AR',
  },
  geo: GEO,
  // Perfiles oficiales (se usan en sameAs del schema y en el contacto).
  socials: [
    'https://www.instagram.com/sanisidrocollegesalta',
    'https://www.facebook.com/sanisidrocollege',
  ],
} as const;

// Mapea el locale de la app al formato de Open Graph (idioma_PAÍS).
export const OG_LOCALES: Record<string, string> = {
  es: 'es_AR',
  en: 'en_US',
};
