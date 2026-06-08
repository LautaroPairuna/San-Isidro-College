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
};

export default withNextIntl(nextConfig);
