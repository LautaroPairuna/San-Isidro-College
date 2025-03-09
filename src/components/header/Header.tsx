import React, { useEffect, useState } from "react";

const Header: React.FC = () => {
  // Estado para saber si el usuario ha hecho scroll más de 50px
  const [scrolled, setScrolled] = useState(false);
  // Estado para controlar si el menú está abierto
  const [menuOpen, setMenuOpen] = useState(false);

  // Pre-cargamos imágenes para evitar parpadeos
  useEffect(() => {
    ["/images/logo-san-isidro-2.svg", "/images/logo-san-isidro-3.svg"].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Escuchamos el scroll para actualizar el estado "scrolled"
  useEffect(() => {
    const handleScroll = () => {
      // Si el menú está abierto, no actualizamos el header (para evitar conflicto de estilos)
      if (menuOpen) return;
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  // Retorna la ruta del logo según el estado
  const getLogoSrc = () => {
    if (menuOpen) {
      // Menú abierto → Variante 3
      return "/images/logo-san-isidro-3.svg";
    } else if (scrolled) {
      // Header scrolleado → Variante 2
      return "/images/logo-san-isidro-2.svg";
    }
    // Por defecto, el logo original
    return "/images/logo-san-isidro.svg";
  };

  // Funciones para abrir/cerrar el menú
  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div id="container" className="relative bg-white overflow-x-hidden">
      {/* Overlay (se muestra sólo si el menú está abierto) */}
      {menuOpen && (
        <div
          id="overlay"
          className="fixed inset-0 bg-black opacity-65 z-50 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Header fijo con ID para que tu CSS #header aplique */}
      <header
        id="header"
        // Agregamos la clase scrolled-header condicionalmente
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          ${scrolled ? "scrolled-header" : ""}
          ${menuOpen ? "hidden" : ""}
        `}
      >
        <nav className="flex items-center justify-between px-6 py-6 md:py-12">
          {/* Contenedor del logo principal */}
          <div
            className={`logo-container transition-all duration-500 ease-in-out ms-0 md:ms-10
              ${scrolled ? "scrolled-logo" : ""}
            `}
          >
            <a href="/" aria-label="San Isidro Home" className="flex items-center">
              <img
                id="logo"
                src={getLogoSrc()}
                alt="Logo de San Isidro"
                className="h-12 w-auto md:h-20"
              />
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-2">
              <button className="bg-[#1e804b] text-white px-4 py-2 rounded-full">ESP</button>
              <button className="bg-[#294161] text-white px-4 py-2 rounded-full">ING</button>
            </div>
            <button
              id="menuToggle"
              className="bg-[#c19516] px-6 py-3 rounded-full text-white"
              onClick={openMenu}
            >
              ☰ MENÚ
            </button>
          </div>
        </nav>
      </header>

      {/* Menú desplegable */}
      <div
        id="dropdownMenu"
        className={`
          fixed top-0 left-0 right-0
          z-60
          transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="menu-panel bg-[#c19516] text-white w-full rounded-b-lg shadow-lg p-6 relative">
          <button
            id="closeMenu"
            className="absolute top-4 right-6 text-3xl text-white"
            aria-label="Cerrar menú"
            onClick={closeMenu}
          >
            &times;
          </button>
          <div className="flex justify-between items-center mb-6">
            <a
              href="/"
              aria-label="San Isidro Home"
              className={`flex items-center logo-container transition-all duration-500 ease-in-out
                ${scrolled ? "scrolled-logo" : ""}
              `}
            >
              <img
                id="menuLogo"
                src={getLogoSrc()}
                alt="Logo de San Isidro"
                className="h-16 md:h-20 transition-all duration-500 ease-in-out"
              />
            </a>
            <div className="flex space-x-2">
              <button className="bg-[#1e804b] text-white px-4 py-2 rounded-full">ESP</button>
              <button className="bg-[#294161] text-white px-4 py-2 rounded-full">ING</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-b md:border-b-0 md:border-r border-white pb-4 md:pb-0 md:pr-4">
              <h3 className="text-xl font-bold">Colegio</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="/colegio" className="hover:underline">
                    Sobre el colegio
                  </a>
                </li>
              </ul>
            </div>
            <div className="border-b md:border-b-0 md:border-r border-white pb-4 md:pb-0 md:pr-4">
              <h3 className="text-xl font-bold">Académico</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="/vida-estudiantil" className="hover:underline">
                    Vida Estudiantil
                  </a>
                </li>
                <li>
                  <a href="/vida-estudiantil-mas-info" className="hover:underline">
                    Más información
                  </a>
                </li>
                <li>
                  <a href="/deportes" className="hover:underline">
                    Deportes
                  </a>
                </li>
                <li>
                  <a href="/deportes-mas-info" className="hover:underline">
                    Deportes - Más información
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold">Contacto</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Ubicación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Redes Sociales
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
