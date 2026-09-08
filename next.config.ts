import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  cacheMaxMemorySize: 0,
  serverExternalPackages: [
    'prisma',
    '@prisma/client',
    'fluent-ffmpeg',
    'ffmpeg-static',
    'ffprobe-static'
  ],

  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob: https:",
      "frame-src 'self' https://www.google.com https://docs.google.com",
      "connect-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // IMÁGENES dinámicas (preferido)
      { source: '/images/medios/thumbs/:path*', destination: '/api/disk-images/images/medios/thumbs/:path*' },
      { source: '/images/medios/:path*',        destination: '/api/disk-images/images/medios/:path*' },

      // VIDEOS dinámicos
      { source: '/uploads/media/:path*',         destination: '/api/disk-images/uploads/media/:path*' },
    ];
  },
  
  async redirects() {
    return [
      // ---- Renombre de rutas públicas ----
      // Nota: los destinos van sin prefijo /es porque el español es el locale
      // por defecto (localePrefix: "as-needed") y se sirve desde la raíz.
      { source: '/es/kindergarden', destination: '/inicial', permanent: true },
      { source: '/en/kindergarden', destination: '/en/kindergarten', permanent: true },
      // Los slugs en español de los niveles pasan de la palabra en inglés a su
      // traducción, para que la URL quede en el mismo idioma que el contenido.
      { source: '/kindergarten', destination: '/inicial', permanent: true },
      { source: '/primary', destination: '/primaria', permanent: true },
      { source: '/secondary', destination: '/secundaria', permanent: true },
      // Actividades Extracurriculares ya no tiene vista de detalle propia:
      // pasó a ser una sección con anchor dentro de /experiencia-sic.
      { source: '/experiencia-sic/actividades-extracurriculares', destination: '/experiencia-sic#actividades-extracurriculares', permanent: true },
      { source: '/en/sic-experience/extracurricular-activities', destination: '/en/sic-experience#actividades-extracurriculares', permanent: true },
      { source: '/es/vida-estudiantil', destination: '/deportes', permanent: true },
      { source: '/en/student-life', destination: '/en/sports', permanent: true },
      { source: '/es/vida-estudiantil-mas-info', destination: '/deportes-mas-info', permanent: true },
      { source: '/en/student-life-more-info', destination: '/en/sports-more-info', permanent: true },
      { source: '/es/academicos-mas-info', destination: '/proyecto-bilingue', permanent: true },
      { source: '/en/academics-more-info', destination: '/en/bilingual-project', permanent: true },

      // ---- Institucional ----
      { source: '/institucional.html',          destination: '/colegio#proyecto',                permanent: true },
      { source: '/mision-vision-valores.html',  destination: '/colegio#mision',                  permanent: true },
      { source: '/asesoria-pedagogica.html',    destination: '/colegio#educacion-personalizada', permanent: true },
      { source: '/horarios.html',               destination: '/colegio',                         permanent: true },
      { source: '/escudo.html',                 destination: '/colegio#valores',                 permanent: true },

      // ---- Niveles (kindergarten, primary, secondary) ----
      { source: '/niveles.html',                destination: '/academicos',                      permanent: true },
      { source: '/ingles.html',                 destination: '/proyecto-bilingue',               permanent: true },
      { source: '/frances.html',                destination: '/proyecto-bilingue',               permanent: true },

      // ---- Actividades ----
      { source: '/actividades---deportes.html', destination: '/deportes#deportes',               permanent: true },
      { source: '/arte.html',                   destination: '/experiencia-sic#arte-y-creatividad', permanent: true },
      { source: '/tic.html',                    destination: '/experiencia-sic#innovacion-y-robotica', permanent: true },
      { source: '/huerta.html',                 destination: '/experiencia-sic#actividades-extracurriculares', permanent: true },
      { source: '/formacion-religiosa.html',    destination: '/colegio#valores',                 permanent: true },
      { source: '/instalaciones.html',          destination: '/colegio#instalaciones',           permanent: true },
      { source: '/ubicacion.html',              destination: '/#contacto',                       permanent: true },

      // ---- Galería de fotos ----
      { source: '/deporte.html',                destination: '/deportes#deportes',               permanent: true },
      { source: '/family-day.html',             destination: '/experiencia-sic#bienestar-y-acompanamiento', permanent: true },
      { source: '/arte-galeria.html',           destination: '/experiencia-sic#arte-y-creatividad', permanent: true },
      { source: '/huerta-galeria.html',         destination: '/experiencia-sic#actividades-extracurriculares', permanent: true },
      { source: '/formacion-religiosa-galeria.html', destination: '/colegio#valores',           permanent: true },
      { source: '/instalaciones-galeria.html',  destination: '/colegio#instalaciones',           permanent: true },
      { source: '/admisiones.html',             destination: '/',                                 permanent: true },

      // ---- Trabaja con nosotros ----
      { source: '/trabaja-con-nosotros-docente.html',        destination: '/#contacto',          permanent: true },
      { source: '/trabaja-con-nosotros-administracion.html', destination: '/#contacto',          permanent: true },
      { source: '/trabaja-con-nosotros-mantenimiento.html',  destination: '/#contacto',          permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
