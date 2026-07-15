import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  cacheMaxMemorySize: 0,
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  serverExternalPackages: [
    'prisma', 
    '@prisma/client', 
    'fluent-ffmpeg', 
    '@ffmpeg-installer/ffmpeg', 
    '@ffprobe-installer/ffprobe'
  ],

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
      { source: '/es/vida-estudiantil', destination: '/es/deportes', permanent: true },
      { source: '/en/student-life', destination: '/en/sports', permanent: true },
      { source: '/es/vida-estudiantil-mas-info', destination: '/es/deportes-mas-info', permanent: true },
      { source: '/en/student-life-more-info', destination: '/en/sports-more-info', permanent: true },
      { source: '/es/academicos-mas-info', destination: '/es/proyecto-bilingue', permanent: true },
      { source: '/en/academics-more-info', destination: '/en/bilingual-project', permanent: true },

      // ---- Institucional ----
      { source: '/institucional.html',          destination: '/es/colegio#proyecto',                permanent: true },
      { source: '/mision-vision-valores.html',  destination: '/es/colegio#mision',                  permanent: true },
      { source: '/asesoria-pedagogica.html',    destination: '/es/colegio#educacion-personalizada', permanent: true },
      { source: '/horarios.html',               destination: '/es/colegio',                         permanent: true },
      { source: '/escudo.html',                 destination: '/es/colegio#valores',                 permanent: true },

      // ---- Niveles (kindergarten, primary, secondary) ----
      { source: '/niveles.html',                destination: '/es/academicos',                      permanent: true },
      { source: '/ingles.html',                 destination: '/es/proyecto-bilingue',               permanent: true },
      { source: '/frances.html',                destination: '/es/proyecto-bilingue',               permanent: true },

      // ---- Actividades ----
      { source: '/actividades---deportes.html', destination: '/es/deportes#deportes',               permanent: true },
      { source: '/arte.html',                   destination: '/es/experiencia-sic#san-isidro-play', permanent: true },
      { source: '/tic.html',                    destination: '/es/experiencia-sic#innovacion-y-robotica', permanent: true },
      { source: '/huerta.html',                 destination: '/es/experiencia-sic#actividades-extracurriculares', permanent: true },
      { source: '/formacion-religiosa.html',    destination: '/es/colegio#valores',                 permanent: true },
      { source: '/instalaciones.html',          destination: '/es/colegio#instalaciones',           permanent: true },
      { source: '/ubicacion.html',              destination: '/es/#contacto',                       permanent: true },

      // ---- Galería de fotos ----
      { source: '/deporte.html',                destination: '/es/deportes#deportes',               permanent: true },
      { source: '/family-day.html',             destination: '/es/experiencia-sic#bienestar-y-acompanamiento', permanent: true },
      { source: '/arte-galeria.html',           destination: '/es/experiencia-sic#san-isidro-play', permanent: true },
      { source: '/huerta-galeria.html',         destination: '/es/experiencia-sic#actividades-extracurriculares', permanent: true },
      { source: '/formacion-religiosa-galeria.html', destination: '/es/colegio#valores',           permanent: true },
      { source: '/instalaciones-galeria.html',  destination: '/es/colegio#instalaciones',           permanent: true },
      { source: '/admisiones.html',             destination: '/es',                                 permanent: true },

      // ---- Trabaja con nosotros ----
      { source: '/trabaja-con-nosotros-docente.html',        destination: '/es/#contacto',          permanent: true },
      { source: '/trabaja-con-nosotros-administracion.html', destination: '/es/#contacto',          permanent: true },
      { source: '/trabaja-con-nosotros-mantenimiento.html',  destination: '/es/#contacto',          permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
