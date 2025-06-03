import type { NextConfig } from "next";
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./i18n.ts"); // Note this path

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = withNextIntl(nextConfig);
