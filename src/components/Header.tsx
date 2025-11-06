// /components/Header.tsx
'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import type { MouseEvent } from "react"

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // next-intl: devuelve el locale actual ('es' o 'en')
  const locale = useLocale() as "es" | "en"
  // Obtiene la ruta completa incluyendo el prefijo de idioma, p.ej. "/es/colegio", "/en/contacto"
  const pathname = usePathname() || "/"

  // Detectar scroll para cambiar estilos
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calcula la ruta con el otro idioma, reemplazando el primer segmento
  const getAlternateRoute = (targetLocale: "es" | "en") => {
    // Separamos la ruta en segmentos: ["", "es", "colegio", "mision", ...]
    const segments = pathname.split("/")
    // Si el primer segmento tras la "/" coincide con el locale, lo reemplazamos
    if (segments[1] === locale) {
      segments[1] = targetLocale
    } else {
      // Si no tiene prefijo (p.ej. pathname === "/"), lo anteponemos
      segments.splice(1, 0, targetLocale)
    }
    return segments.join("/") || `/${targetLocale}`
  }

  // Seleccionar logo según estado
  const getLogoSrc = () => {
    if (menuOpen) return "/images/logo-san-isidro-3.svg"
    if (scrolled) return "/images/logo-san-isidro-2.svg"
    return "/images/logo-san-isidro.svg"
  }

  // Cerrar menú al hacer click en enlace
  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation()
    setMenuOpen(false)
  }

  return (
    <div id="container" className="relative bg-white w-full">
      {/* HEADER fijo */}
      <header
        id="header"
        className="fixed top-0 left-0 right-0 z-60 min-h-[120px] transition-all duration-500 ease-in-out"
      >
        {/* Fondo SVG */}
        <div
          className={`
            absolute inset-0 bg-[url('/images/fondo-header.svg')]
            bg-no-repeat bg-left md:bg-center bg-cover
            transition-opacity duration-500 ease-in-out
            z-0 ${scrolled ? "opacity-0" : "opacity-100"}
          `}
        />

        <nav
          className={`
            relative z-10 h-full w-full transition-all duration-500 ease-in-out
            ${scrolled ? "py-0 px-0" : "px-6 py-6 md:py-12"}
          `}
        >
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div
              className={`
                logo-container transition-all duration-500 ease-in-out
                ${
                  scrolled
                    ? "bg-white sm:py-8 py-4 sm:px-12 px-6 drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)] rounded-br-4xl ms-0"
                    : "px-3 py-2 sm:ms-10 ms-2"
                }
              `}
            >
              <Link href={`/${locale}#home`} onClick={() => setMenuOpen(false)}>
                <Image
                  id="logo"
                  src={getLogoSrc()}
                  alt="Logo de San Isidro"
                  width={180}
                  height={90}
                  className="h-14 w-auto md:h-20 transition-all duration-500 ease-in-out"
                />
              </Link>
            </div>

            {/* Idiomas y menú */}
            <div className="flex items-center space-x-2 sm:me-10 me-3">
              <div className="hidden md:flex space-x-2 me-5">
                {/* Botones de cambio de idioma */}
                <Link href={getAlternateRoute("es")}>
                  <button
                    className={`px-3 py-3 rounded-full text-white ${
                      locale === "es" ? "bg-[#1e804b]" : "bg-[#1e804b]/60"
                    }`}
                  >
                    ES
                  </button>
                </Link>
                <Link href={getAlternateRoute("en")}>
                  <button
                    className={`px-3 py-3 rounded-full text-white ${
                      locale === "en" ? "bg-[#294161]" : "bg-[#294161]/60"
                    }`}
                  >
                    EN
                  </button>
                </Link>
              </div>
              <button
                id="menuToggle"
                className="bg-[#c19516] px-8 py-3 rounded-full text-white"
                onClick={() => setMenuOpen(true)}
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
          <div className="menu-panel bg-[#c19516] text-white w-full h-full p-6 md:rounded-b-lg md:shadow-lg md:h-auto overflow-y-auto md:overflow-y-visible">
            <button
              id="closeMenu"
              className="absolute top-4 right-6 text-3xl"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              &times;
            </button>

            {/* Logo + idiomas en menú */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <Link href={getAlternateRoute(locale)} onClick={handleNavClick} className="flex items-center">
                <Image
                  id="menuLogo"
                  src={getLogoSrc()}
                  alt="Logo de San Isidro"
                  width={180}
                  height={90}
                  className="h-14 w-auto md:h-20"
                />
              </Link>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Link href={getAlternateRoute("es")}>
                  <button
                    className={`px-3 py-1 rounded-full text-white ${
                      locale === "es" ? "bg-[#1e804b]" : "bg-gray-400/60"
                    }`}
                  >
                    ES
                  </button>
                </Link>
                <Link href={getAlternateRoute("en")}>
                  <button
                    className={`px-3 py-1 rounded-full text-white ${
                      locale === "en" ? "bg-[#294161]" : "bg-gray-400/60"
                    }`}
                  >
                    EN
                  </button>
                </Link>
              </div>
            </div>

            {/* Menú principal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* El Colegio */}
              <div>
                <h3 className="text-lg font-bold mb-2">
                  {locale === "es" ? "El Colegio" : "The School"}
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={`/${locale}/colegio#proyecto`}
                      id="proyecto-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Proyecto" : "Project"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/colegio#mision`}
                      id="mision-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Misión" : "Mission"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/colegio#vision`}
                      id="vision-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Visión" : "Vision"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/colegio#valores`}
                      id="valores-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Valores" : "Values"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/colegio#educacion-personalizada`}
                      id="educacion-personalizada-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Educación Personalizada" : "Personalized Education"}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Académicos */}
              <div>
                <h3 className="text-lg font-bold mb-2">
                  {locale === "es" ? "Académicos" : "Academics"}
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={`/${locale}/academicos#kindergarten`}
                      id="kindergarten-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Kindergarten" : "Kindergarten"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/academicos#primary`}
                      id="primary-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Primaria" : "Primary"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/academicos#secondary`}
                      id="secondary-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Secundaria" : "Secondary"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/academicos`}
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Educación Bilingüe" : "Bilingual Education"}
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Vida Estudiantil */}
              <div>
                <h3 className="text-lg font-bold mb-2">
                  {locale === "es" ? "Vida Estudiantil" : "Student Life"}
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={`/${locale}/vida-estudiantil#deportes`}
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Deportes" : "Sports"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/vida-estudiantil#bienestar-estudiantil`}
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Bienestar Estudiantil" : "Student Welfare"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/vida-estudiantil#play-habilidades-steam`}
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      {locale === "es" ? "Play & STEAM" : "Play & STEAM"}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-bold mb-2">
                  {locale === "es" ? "Contacto" : "Contact"}
                </h3>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
