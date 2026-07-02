// src/proxy.ts (middleware de Next.js 16)
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Pasamos el objeto `routing` completo para que el middleware aplique también
// los `pathnames` localizados (p. ej. /en/school -> interno /en/colegio) además
// del prefijo de locale.
export default createMiddleware(routing);

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
