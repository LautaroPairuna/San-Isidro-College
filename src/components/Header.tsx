// /components/Header.tsx
'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useLocale } from "next-intl"
import { usePathname, getPathname } from "@/i18n/navigation"
import type { AppPathname } from "@/i18n/routing"
import type { MouseEvent } from "react"

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const wasMenuOpenRef = useRef(false)

  // Cerrar con Escape mientras el menú está abierto.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  // Al cerrar el menú (por Escape, click en un link o en la X), devolver el
  // foco al botón que lo abrió en vez de perderlo en el <body>.
  useEffect(() => {
    if (!menuOpen && wasMenuOpenRef.current) {
      menuToggleRef.current?.focus()
    }
    wasMenuOpenRef.current = menuOpen
  }, [menuOpen])

  // next-intl: devuelve el locale actual ('es' o 'en')
  const locale = useLocale() as "es" | "en"
  // Ruta interna (la clave de routing.pathnames, sin prefijo de locale ni slug
  // traducido), p.ej. "/colegio" o "/academicos-mas-info" sea cual sea el idioma
  // o el slug público real.
  const pathname = usePathname()

  // Resuelve la URL pública real de una ruta interna para un locale dado,
  // respetando tanto el prefijo (as-needed: es sin /es, en con /en) como los
  // slugs que difieren entre idiomas (p.ej. /academicos-mas-info -> /proyecto-bilingue
  // en es, /bilingual-project en en).
  const path = (internalHref: AppPathname, hash?: string) => {
    const base = getPathname({ locale, href: internalHref })
    return hash ? `${base}#${hash}` : base
  }

  // Ruta de la página actual en el otro idioma, respetando el mismo slug traducido.
  const getAlternateRoute = (targetLocale: "es" | "en") =>
    getPathname({ locale: targetLocale, href: pathname })

  // Seleccionar logo según estado
  const getLogoSrc = () => {
    if (menuOpen) return "/images/logo-san-isidro-3.svg"
    return "/images/logo-san-isidro-2.svg"
  }

  // Cerrar menú al hacer click en enlace
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation()
    setMenuOpen(false)
  }

  // Enlaces con ancla (#seccion): si ya estamos en la página destino,
  // hacemos scroll suave en vez de navegar (evita el redirect que pierde el hash).
  const handleAnchorClick = (
    e: MouseEvent<HTMLAnchorElement>,
    targetPath: string,
    hash: string
  ) => {
    e.stopPropagation()
    setMenuOpen(false)

    if (pathname === targetPath) {
      e.preventDefault()
      const scrollToTarget = () => {
        const el = document.getElementById(hash)
        if (!el) return
        const headerOffset = 120 // alto del header fijo
        const top = el.getBoundingClientRect().top + window.scrollY - headerOffset
        window.scrollTo({ top, behavior: "smooth" })
      }
      // Esperamos a que el menú termine de cerrarse antes de scrollear
      requestAnimationFrame(() => requestAnimationFrame(scrollToTarget))
    }
  }

  return (
    <div id="container" className="relative bg-white w-full">
      {/* HEADER fijo */}
      <header
        id="header"
        className="fixed top-0 left-0 right-0 z-60 min-h-[120px]"
      >
        <nav
          className={`
            relative z-10 h-full w-full px-0 py-0
          `}
        >
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div
              className={`
                logo-container bg-white py-3 sm:py-6 md:py-8 px-4 sm:px-8 md:px-12 drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)] rounded-br-4xl ms-0
              `}
            >
              <Link href={path('/', 'home')} onClick={() => setMenuOpen(false)}>
                <img id="logo" src={getLogoSrc()} alt={locale === "es" ? "Logo de San Isidro College" : "San Isidro College logo"} width={180} height={90} loading="eager" fetchPriority="high" className="h-14 sm:h-16 md:h-20 w-auto transition-all duration-500 ease-in-out" />
              </Link>
            </div>

            {/* Idiomas y menú */}
            <div className="flex items-center space-x-2 sm:me-10 me-3">
              <div className="hidden md:flex items-center gap-3 me-5">
                {/* Botones de cambio de idioma: un único link estilizado como botón */}
                <Link
                  href={getAlternateRoute("es")}
                  aria-label="Cambiar a Español"
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white shadow-sm transition-colors ${
                    locale === "es" ? "bg-[#1e804b]" : "bg-[#1e804b]/70 hover:bg-[#1e804b]"
                  }`}
                >
                  ES
                </Link>
                <Link
                  href={getAlternateRoute("en")}
                  aria-label="Switch to English"
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white shadow-sm transition-colors ${
                    locale === "en" ? "bg-[#294161]" : "bg-[#294161]/70 hover:bg-[#294161]"
                  }`}
                >
                  EN
                </Link>
              </div>

              <button
                id="menuToggle"
                ref={menuToggleRef}
                className="bg-[#c19516] px-8 py-3 rounded-full text-white cursor-pointer"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="dropdownContainer"
              >
                ☰ MENÚ
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Overlay y panel de menú */}
      <div
        id="dropdownContainer"
        // Cerrado: además de invisible, queda fuera del árbol de accesibilidad
        // y del orden de tabulación (antes se podía tabular a sus links igual).
        inert={!menuOpen}
        className={`
          fixed inset-0 z-80 bg-black/50
          transition-opacity duration-500 ease-in-out
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`
            relative h-full transition-transform duration-500 ease-in-out
            ${menuOpen ? "translate-y-0" : "-translate-y-full"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="menu-panel bg-[#c19516] text-white w-full h-full md:h-auto p-6 md:rounded-b-lg md:shadow-lg overflow-y-auto md:overflow-y-visible">
            {/* Desktop: idioma + cerrar arriba a la derecha */}
            <div className="absolute top-4 right-6 hidden md:flex items-center gap-6">
              <a
                href="mailto:cv@colegiosanisidrosalta.edu.ar"
                className="text-base lg:text-lg text-white/90 hover:text-white transition-colors whitespace-nowrap"
              >
                <span className="font-semibold">Trabajá con nosotros:</span>{" "}
                <span className="font-normal">cv@colegiosanisidrosalta.edu.ar</span>
              </a>
              <Link
                href={getAlternateRoute("es")}
                aria-label="Cambiar a Español"
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white shadow-sm transition-colors ${
                  locale === "es" ? "bg-[#1e804b]" : "bg-[#1e804b]/70 hover:bg-[#1e804b]"
                }`}
              >
                ES
              </Link>
              <Link
                href={getAlternateRoute("en")}
                aria-label="Switch to English"
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white shadow-sm transition-colors ${
                  locale === "en" ? "bg-[#294161]" : "bg-[#294161]/70 hover:bg-[#294161]"
                }`}
              >
                EN
              </Link>
              <button
                id="closeMenu"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white bg-black/80 hover:bg-black shadow-sm"
                onClick={() => setMenuOpen(false)}
                aria-label={locale === "es" ? "Cerrar menú" : "Close menu"}
              >
                X
              </button>
            </div>
            {/* Mobile: botón cerrar arriba derecha */}
            <button
              id="closeMenu"
              className="absolute top-4 right-6 md:hidden w-10 h-10 rounded-full flex items-center justify-center text-white bg-black/80 hover:bg-black shadow-sm"
              onClick={() => setMenuOpen(false)}
              aria-label={locale === "es" ? "Cerrar menú" : "Close menu"}
            >
              X
            </button>

            {/* Logo en menú */}
            <div className="flex flex-col md:flex-row justify-start items-center mb-6">
              <Link href={path('/')} onClick={handleNavClick} className="flex items-center">
                <img id="menuLogo" src={getLogoSrc()} alt={locale === "es" ? "Logo de San Isidro College" : "San Isidro College logo"} width={180} height={90} className="h-20 w-auto" />
              </Link>
              {/* Mobile: idiomas debajo del logo */}
              <div className="flex gap-2 mt-4 md:hidden">
                <Link
                  href={getAlternateRoute("es")}
                  aria-label="Cambiar a Español"
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm transition-colors ${
                    locale === "es" ? "bg-[#1e804b]" : "bg-[#1e804b]/70 hover:bg-[#1e804b]"
                  }`}
                >
                  ES
                </Link>
                <Link
                  href={getAlternateRoute("en")}
                  aria-label="Switch to English"
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm transition-colors ${
                    locale === "en" ? "bg-[#294161]" : "bg-[#294161]/70 hover:bg-[#294161]"
                  }`}
                >
                  EN
                </Link>
              </div>
            </div>

            {/* Menú principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10 xl:gap-12">
              {/* El Colegio */}
              <div className="md:border-l-2 md:border-white/70 md:pl-10 first:md:border-l-0">
                <h2 className="text-4xl mb-2 whitespace-nowrap">
                  <Link href={path('/colegio')} onClick={handleNavClick} className="hover:underline">
                    {locale === "es" ? "El Colegio" : "The School"}
                  </Link>
                </h2>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={path('/colegio', 'proyecto')}
                      id="proyecto-link"
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Proyecto Educativo Bilingüe" : "Bilingual Educational Project"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/colegio', 'mision')}
                      id="mision-link"
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Misión, Visión y Valores" : "Mission, Vision and Values"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/colegio', 'escudo')}
                      id="escudo-link"
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Nuestro Escudo, Nuestra Identidad" : "Our Crest, Our Identity"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/colegio', 'aprendizaje-con-valores')}
                      id="aprendizaje-con-valores-link"
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Aprendizaje con Valores" : "Learning through Values"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/colegio', 'educacion-personalizada')}
                      id="educacion-personalizada-link"
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Educación Personalizada" : "Personalized Education"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/colegio', 'instalaciones')}
                      id="instalaciones-link"
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Instalaciones" : "Facilities"}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Académicos */}
              <div className="md:border-l-2 md:border-white/70 md:pl-10 first:md:border-l-0">
                <h2 className="text-4xl mb-2 whitespace-nowrap">
                  <Link href={path('/academicos')} onClick={handleNavClick} className="hover:underline">
                    {locale === "es" ? "Académicos" : "Academics"}
                  </Link>
                </h2>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={path('/academicos-mas-info')}
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Proyecto Bilingüe" : "Bilingual Project"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/kindergarden')}
                      id="kindergarten-link"
                      onClick={handleNavClick}
                      className="block hover:underline my-3"
                    >
                      {locale === "es" ? "Inicial" : "Kindergarten"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/primary')}
                      id="primary-link"
                      onClick={handleNavClick}
                      className="block hover:underline my-3"
                    >
                      {locale === "es" ? "Primaria" : "Primary"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/secondary')}
                      id="secondary-link"
                      onClick={handleNavClick}
                      className="block hover:underline my-3"
                    >
                      {locale === "es" ? "Secundaria" : "Secondary"}
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Experiencia SIC */}
              <div className="xl:border-l-2 lg:border-l-0 md:border-white/70 md:pl-10 first:md:border-l-0">
                <h2 className="text-4xl mb-2 whitespace-nowrap">
                  <Link href={path('/experiencia-sic')} onClick={handleNavClick} className="hover:underline">
                    {locale === "es" ? "Experiencia SIC" : "SIC Experience"}
                  </Link>
                </h2>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={path('/experiencia-sic/bienestar-y-acompanamiento')}
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Bienestar y Acompañamiento" : "Wellbeing and Guidance"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/experiencia-sic/google-reference-school')}
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Google Reference School" : "Google Reference School"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/experiencia-sic/innovacion-y-robotica')}
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Innovación y Robótica" : "Innovation and Robotics"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/experiencia-sic/fe-y-compromiso-social')}
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Fe y Compromiso Social" : "Faith and Social Commitment"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/experiencia-sic/arte-y-creatividad')}
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Arte y Creatividad" : "Art and Creativity"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/experiencia-sic/houses')}
                      onClick={handleNavClick}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Houses" : "Houses"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/experiencia-sic', 'actividades-extracurriculares')}
                      onClick={(e) => handleAnchorClick(e, '/experiencia-sic', "actividades-extracurriculares")}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Actividades Extracurriculares" : "Extracurricular Activities"}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Deportes */}
              <div className="md:border-l-2 md:border-white/70 md:pl-10 first:md:border-l-0">
                <h2 className="text-4xl mb-4 whitespace-nowrap">
                  <Link href={path('/deportes')} onClick={handleNavClick} className="hover:underline">
                    {locale === "es" ? "Deportes" : "Sports"}
                  </Link>
                </h2>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={path('/deportes', 'club')}
                      onClick={(e) => handleAnchorClick(e, '/deportes', "club")}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Club" : "Club"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/deportes', 'dojo')}
                      onClick={(e) => handleAnchorClick(e, '/deportes', "dojo")}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "Dojo" : "Dojo"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={path('/deportes', 'san-isidro-balance')}
                      onClick={(e) => handleAnchorClick(e, '/deportes', "san-isidro-balance")}
                      className="block hover:underline my-3 whitespace-nowrap"
                    >
                      {locale === "es" ? "San Isidro Balance" : "San Isidro Balance"}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
