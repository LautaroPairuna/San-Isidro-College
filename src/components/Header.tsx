"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detectar scroll para cambiar estilos
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Seleccionar logo según estado
  const getLogoSrc = () => {
    if (menuOpen) return "/images/logo-san-isidro-3.svg";
    if (scrolled) return "/images/logo-san-isidro-2.svg";
    return "/images/logo-san-isidro.svg";
  };

  // Cerrar menú al hacer click en enlace
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    setMenuOpen(false);
  };

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
        ></div>

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
                ${scrolled
                  ? "bg-white sm:py-8 py-4 sm:px-12 px-6 drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)] rounded-br-4xl ms-0"
                  : "px-3 py-2 sm:ms-10 ms-2"
                }
              `}
            >
              <Link href="#home" onClick={() => setMenuOpen(false)}>
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
            <div className="flex items-center space-x-2 sm:me-10 me-2">
              <div className="hidden md:flex space-x-2">
                <button className="bg-[#1e804b] text-white px-2 py-3 rounded-full">ES</button>
                <button className="bg-[#294161] text-white px-2 py-3 rounded-full">EN</button>
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
              <Link href="#home" onClick={handleNavClick} className="flex items-center">
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
                <button className="bg-[#1e804b] px-3 py-1 rounded-full">ESP</button>
                <button className="bg-[#294161] px-3 py-1 rounded-full">ING</button>
              </div>
            </div>

            {/* Menú principal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Inicio */}
              <div>
                <h3 className="text-lg font-bold mb-2">Inicio</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/#bienvenida"
                      id="bienvenidos-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Bienvenidos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#infograma"
                      id="infograma-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Infograma
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#alianzas"
                      id="alianzas-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Alianzas y Estrategias
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#contacto"
                      id="contacto-ubicacion-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Contacto / Ubicación
                    </Link>
                  </li>
                </ul>
              </div>

              {/* El Colegio */}
              <div>
                <h3 className="text-lg font-bold mb-2">El Colegio</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/colegio#proyecto"
                      id="proyecto-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Proyecto
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/colegio#mision"
                      id="mision-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Misión
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/colegio#vision"
                      id="vision-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Visión
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/colegio#valores"
                      id="valores-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Valores
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/colegio#educacion-personalizada"
                      id="educacion-personalizada-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Educación Personalizada
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/colegio#nuestro-escudo"
                      id="nuestro-escudo-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Nuestro Escudo
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Académicos */}
              <div>
                <h3 className="text-lg font-bold mb-2">Académicos</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/academicos#kindergarten"
                      id="kindergarten-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Kindergarten
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/academicos#primary"
                      id="primary-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Primary
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/academicos#secondary"
                      id="secondary-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Secondary
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/academicos#educacion-bilingue"
                      id="educacion-bilingue-link"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Educación Bilingüe
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Admisiones */}
              <div>
                <h3 className="text-lg font-bold mb-2">Admisiones</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="https://docs.google.com/forms/d/e/1FAIpQLSdTZNnLscG2J5nk8azmzbifaCX1n-2Ft1dPHmOgyRoD9POURA/viewform"
                      target="_blank"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Ver Admisiones
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Vida Estudiantil */}
              <div>
                <h3 className="text-lg font-bold mb-2">Vida Estudiantil</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/vida-estudiantil#deportes"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Deportes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/vida-estudiantil#bienestar-estudiantil"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Bienestar Estudiantil
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/vida-estudiantil#play-habilidades-steam"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Play & STEAM
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-bold mb-2">Contacto</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/contacto#ubicacion"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Ubicación
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contacto#redes-sociales"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Redes Sociales
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contacto#email"
                      onClick={handleNavClick}
                      className="block hover:underline"
                    >
                      Email
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
