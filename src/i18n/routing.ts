// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // El locale por defecto (es) se sirve sin prefijo (sanisidrocollege.com.ar/colegio,
  // no /es/colegio); en sirve con prefijo (/en/school). Evita contenido duplicado
  // para SEO y hace que el dominio raíz sea la versión canónica en español.
  localePrefix: "as-needed",
  // Con "as-needed" el default (es) no lleva prefijo, así que sin esto el
  // middleware detecta el idioma por cookie/Accept-Language y puede pisar una
  // elección explícita: el usuario cambiaba a español (navega a /colegio, sin
  // prefijo) y el middleware lo mandaba de vuelta a /en/colegio porque la
  // cookie NEXT_LOCALE seguía en "en" de una visita anterior. El selector de
  // idioma del Header ya navega a la URL correcta por sí solo; no hace falta
  // (ni conviene) que el middleware "corrija" eso por su cuenta.
  localeDetection: false,
  // Rutas localizadas: la CLAVE es el pathname interno (coincide con la carpeta
  // dentro de app/[locale]), y el valor define el slug público por idioma.
  // Así /es/colegio se sirve como /en/school, /es/academicos como /en/academics, etc.
  pathnames: {
    "/": "/",
    "/colegio": { es: "/colegio", en: "/school" },
    "/academicos": { es: "/academicos", en: "/academics" },
    "/academicos-mas-info": {
      es: "/proyecto-bilingue",
      en: "/bilingual-project",
    },
    "/kindergarden": {
      es: "/inicial",
      en: "/kindergarten",
    },
    "/primary": {
      es: "/primaria",
      en: "/primary",
    },
    "/secondary": {
      es: "/secundaria",
      en: "/secondary",
    },
    "/experiencia-sic": {
      es: "/experiencia-sic",
      en: "/sic-experience",
    },
    "/experiencia-sic/bienestar-y-acompanamiento": {
      es: "/experiencia-sic/bienestar-y-acompanamiento",
      en: "/sic-experience/wellbeing-and-guidance",
    },
    "/experiencia-sic/google-reference-school": {
      es: "/experiencia-sic/google-reference-school",
      en: "/sic-experience/google-reference-school",
    },
    "/experiencia-sic/innovacion-y-robotica": {
      es: "/experiencia-sic/innovacion-y-robotica",
      en: "/sic-experience/innovation-and-robotics",
    },
    "/experiencia-sic/houses": {
      es: "/experiencia-sic/houses",
      en: "/sic-experience/houses",
    },
    "/experiencia-sic/arte-y-creatividad": {
      es: "/experiencia-sic/arte-y-creatividad",
      en: "/sic-experience/art-and-creativity",
    },
    "/experiencia-sic/fe-y-compromiso-social": {
      es: "/experiencia-sic/fe-y-compromiso-social",
      en: "/sic-experience/faith-and-social-commitment",
    },
    "/deportes": { es: "/deportes", en: "/sports" },
    "/deportes-mas-info": {
      es: "/deportes-mas-info",
      en: "/sports-more-info",
    },
  },
});

// Pathnames internos válidos (claves del mapa de rutas). Se usa para tipar los
// helpers de SEO/sitemap que calculan las variantes por idioma.
export type AppPathname = keyof typeof routing.pathnames;
