// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
  locales:       routing.locales,
  defaultLocale: routing.defaultLocale,
  // Siempre anteponemos el prefijo (incluso para el defaultLocale)
  localePrefix:  'always'
});

export const config = {
  matcher: [
    /*
      Aplica i18n a TODO excepto:
      - /api
      - /_next
      - /admin (y subrutas)
      - Archivos estáticos (con punto en el path)
    */
    '/((?!api|_next|admin|.*\\..*).*)'
  ]
};
