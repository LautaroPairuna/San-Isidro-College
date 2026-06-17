import { getBaseUrl, siteConfig } from '@/lib/siteConfig';

/**
 * Datos estructurados (schema.org) para SEO local y de geolocalización.
 * Declara la institución como EducationalOrganization/School con su dirección
 * postal, coordenadas geográficas y zona de servicio (Salta, Argentina).
 */
export default function SeoJsonLd({ locale }: { locale: string }) {
  const baseUrl = getBaseUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'School'],
    '@id': `${baseUrl}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: baseUrl,
    description: siteConfig.description,
    email: siteConfig.email,
    inLanguage: locale,
    image: `${baseUrl}${siteConfig.defaultOgImage}`,
    logo: `${baseUrl}/images/eslogan.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    hasMap: `https://www.google.com/maps?q=${siteConfig.geo.latitude},${siteConfig.geo.longitude}`,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Salta, Argentina',
    },
    sameAs: siteConfig.socials,
  };

  return (
    <script
      type="application/ld+json"
      // El contenido es estático y controlado por nosotros (sin datos de usuario).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
