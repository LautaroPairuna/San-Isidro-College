import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Optimizaciones de imágenes
  images: {
    // Solo WebP: los originales ya se guardan optimizados en WebP (file.service),
    // así que generar AVIF además duplica el trabajo y es ~3-5x más caro en RAM/CPU.
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    // Quitamos 2048/3840: la variante 4K es la que más RAM consume al procesar
    // y no aporta en un sitio institucional. Conservamos el resize responsive.
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

  // Redirecciones 301 de la antigua web (.html) a las rutas de la web nueva.
  // Migración de DNS: las viejas páginas estáticas se consolidaron en /es/colegio,
  // /es/academicos, /es/vida-estudiantil y el home (#contacto). Se preserva el SEO
  // apuntando cada URL indexada a la sección equivalente.
  async redirects() {
    return [
      // ---- Institucional ----
      { source: '/institucional.html',          destination: '/es/colegio#proyecto',                permanent: true },
      { source: '/mision-vision-valores.html',  destination: '/es/colegio#mision',                  permanent: true },
      { source: '/asesoria-pedagogica.html',    destination: '/es/colegio#educacion-personalizada', permanent: true },
      { source: '/horarios.html',               destination: '/es/colegio',                         permanent: true },
      { source: '/escudo.html',                 destination: '/es/colegio#valores',                 permanent: true },

      // ---- Niveles (kindergarten, primary, secondary) ----
      { source: '/niveles.html',                destination: '/es/academicos',                      permanent: true },
      { source: '/ingles.html',                 destination: '/es/academicos',                      permanent: true },
      { source: '/frances.html',                destination: '/es/academicos',                      permanent: true },

      // ---- Actividades ----
      { source: '/actividades---deportes.html', destination: '/es/vida-estudiantil#deportes',       permanent: true },
      { source: '/arte.html',                   destination: '/es/vida-estudiantil#play-habilidades-steam', permanent: true },
      { source: '/tic.html',                    destination: '/es/vida-estudiantil#play-habilidades-steam', permanent: true },
      { source: '/huerta.html',                 destination: '/es/vida-estudiantil#bienestar-estudiantil', permanent: true },
      { source: '/formacion-religiosa.html',    destination: '/es/vida-estudiantil#bienestar-estudiantil', permanent: true },
      { source: '/instalaciones.html',          destination: '/es/colegio#instalaciones',           permanent: true },
      { source: '/ubicacion.html',              destination: '/es/#contacto',                       permanent: true },

      // ---- Galería de fotos ----
      { source: '/deporte.html',                destination: '/es/vida-estudiantil#deportes',       permanent: true },
      { source: '/family-day.html',             destination: '/es/vida-estudiantil#bienestar-estudiantil', permanent: true },
      { source: '/arte-galeria.html',           destination: '/es/vida-estudiantil#play-habilidades-steam', permanent: true },
      { source: '/huerta-galeria.html',         destination: '/es/vida-estudiantil#bienestar-estudiantil', permanent: true },
      { source: '/formacion-religiosa-galeria.html', destination: '/es/vida-estudiantil#bienestar-estudiantil', permanent: true },
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
