"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Controla el scroll para aplicar estilos al header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Selecciona el logo dependiendo del estado del menú y del scroll
  const getLogoSrc = () => {
    if (menuOpen) return "/images/logo-san-isidro-3.svg";
    if (scrolled) return "/images/logo-san-isidro-2.svg";
    return "/images/logo-san-isidro.svg";
  };

  // Handler para cuando se haga clic en un enlace de navegación
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Si necesitas evitar la propagación, puedes descomentar la siguiente línea:
    // e.stopPropagation();
    setMenuOpen(false);
  };

  return (
    <div id="container" className="relative bg-white w-full">
      {/* HEADER fijo */}
      <header
        id="header"
        className="fixed top-0 left-0 right-0 z-60 min-h-[120px] transition-all duration-500 ease-in-out"
      >
        {/* Fondo SVG con transición */}
        <div
          className={`
            absolute inset-0 bg-[url('/images/fondo-header.svg')]
            bg-no-repeat bg-left md:bg-center bg-cover
            transition-opacity duration-500 ease-in-out
            z-0 ${scrolled ? "opacity-0" : "opacity-100"}
          `}
        ></div>
        <nav className="relative z-10 h-full px-6 py-6 md:py-12">
          <div className="container mx-auto flex items-center justify-between px-2">
            {/* Logo */}
            <div
              className={`
                logo-container transition-all duration-500 ease-in-out
                ${scrolled ? "bg-white py-4 px-6 shadow-lg rounded-lg" : "px-3 py-2"}
              `}
            >
              <Link
                href="/"
                aria-label="San Isidro Home"
                onClick={() => setMenuOpen(false)}
                className="flex items-center"
              >
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
            {/* Botones de idioma y menú */}
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex space-x-1">
                <button className="flex items-center justify-center bg-[#1e804b] text-white px-4 py-2 rounded-full">
                  ESP
                </button>
                <button className="flex items-center justify-center bg-[#294161] text-white px-4 py-2 rounded-full">
                  ING
                </button>
              </div>
              <button
                id="menuToggle"
                className="flex items-center justify-center bg-[#c19516] px-6 py-3 rounded-full text-white"
                onClick={() => setMenuOpen(true)}
              >
                ☰ MENÚ
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* MENÚ DESPLEGABLE con animaciones y sin interferir en la navegación */}
      <div
        id="dropdownContainer"
        className={`
          fixed inset-0 z-80 transition-opacity duration-500 ease-in-out bg-black/50
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setMenuOpen(false)}
      >
        {/* Panel del menú: se mantiene en el DOM para animar, pero detiene la propagación */}
        <div
          className={`
            relative transition-transform duration-500 ease-in-out h-full
            ${menuOpen ? "translate-y-0" : "-translate-y-full"}
          `}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="menu-panel bg-[#c19516] text-white w-full h-full p-4 md:rounded-b-lg md:shadow-lg md:h-auto">
            <button
              id="closeMenu"
              className="absolute top-4 right-6 text-3xl text-white"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 pe-10">
              <Link
                href="/"
                onClick={handleNavClick}
                className="flex items-center logo-container transition-all duration-500 ease-in-out px-2 py-1"
              >
                <Image
                  id="menuLogo"
                  src={getLogoSrc()}
                  alt="Logo de San Isidro"
                  width={180}
                  height={90}
                  className="h-14 w-auto md:h-20"
                />
              </Link>
              <div className="flex space-x-1 mt-4 md:mt-0">
                <button className="flex items-center justify-center bg-[#1e804b] text-white px-3 py-1 rounded-full">
                  ESP
                </button>
                <button className="flex items-center justify-center bg-[#294161] text-white px-3 py-1 rounded-full">
                  ING
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="border-b md:border-b-0 md:border-r border-white pb-2 md:pb-0 md:pr-2">
                <h3 className="text-lg font-bold">Colegio</h3>
                <ul className="mt-1 space-y-1">
                  <li>
                    <Link
                      href="/colegio"
                      onClick={handleNavClick}
                      className="hover:underline"
                    >
                      Sobre el colegio
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="border-b md:border-b-0 md:border-r border-white pb-2 md:pb-0 md:pr-2">
                <h3 className="text-lg font-bold">Académico</h3>
                <ul className="mt-1 space-y-1">
                  <li>
                    <Link
                      href="/vida-estudiantil"
                      onClick={handleNavClick}
                      className="hover:underline"
                    >
                      Vida Estudiantil
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/vida-estudiantil-mas-info"
                      onClick={handleNavClick}
                      className="hover:underline"
                    >
                      Más información
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/deportes"
                      onClick={handleNavClick}
                      className="hover:underline"
                    >
                      Deportes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/deportes-mas-info"
                      onClick={handleNavClick}
                      className="hover:underline"
                    >
                      Deportes - Más información
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold">Contacto</h3>
                <ul className="mt-1 space-y-1">
                  <li>
                    <Link
                      href="/ubicacion"
                      onClick={handleNavClick}
                      className="hover:underline"
                    >
                      Ubicación
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/redes-sociales"
                      onClick={handleNavClick}
                      className="hover:underline"
                    >
                      Redes Sociales
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/email"
                      onClick={handleNavClick}
                      className="hover:underline"
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
