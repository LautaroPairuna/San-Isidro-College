// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // Siempre anteponemos el prefijo de locale (incluso para el defaultLocale).
  localePrefix: "always",
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
      es: "/kindergarden",
      en: "/kindergarden",
    },
    "/primary": {
      es: "/primary",
      en: "/primary",
    },
    "/secondary": {
      es: "/secondary",
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
    "/experiencia-sic/actividades-extracurriculares": {
      es: "/experiencia-sic/actividades-extracurriculares",
      en: "/sic-experience/extracurricular-activities",
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
