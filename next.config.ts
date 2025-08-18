import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Para rutas del mismo origen no necesitás remotePatterns
  images: {},

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
