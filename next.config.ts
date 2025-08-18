import type { NextConfig } from "next";
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./i18n.ts"); // Note this path

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port:     '3000',
        pathname: '/images/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/api/disk-images/:path*',
      },
    ]
  },
};

module.exports = withNextIntl(nextConfig);
