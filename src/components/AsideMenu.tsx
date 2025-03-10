"use client";
import React, { useState, useEffect } from 'react';

interface FixedAsideProps {
  children: React.ReactNode;
  scrollThreshold?: number;
}

const AsideMenu: React.FC<FixedAsideProps> = ({
  children,
  scrollThreshold = 2000,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  // Menú fijo para escritorio (se muestra a partir de lg)
  const asideDesktop = `
    hidden lg:block
    fixed lg:right-0 2xl:right-20 top-60 w-56 text-gray-800 z-30 transition-all duration-300
    ${scrolled ? 'bg-gray-200 shadow-md p-5 rounded-lg' : ''}
  `;

  // Menú móvil (< lg) estilo off-canvas,
  // top-[80px] para que no choque con el header,
  // y max-h-[80%] para que no ocupe todo el alto.
  const asideMobile = `
    block lg:hidden
    fixed right-0 top-[250px]
    w-64 max-h-[80%] bg-white z-50 shadow-lg
    transform transition-transform duration-300
    ${openMobile ? 'translate-x-0' : 'translate-x-full'}
  `;

  return (
    <>
      {/* Menú fijo para escritorio */}
      <aside className={asideDesktop}>{children}</aside>

      {/* Botón para abrir el menú en móvil */}
      <button
        onClick={() => setOpenMobile(true)}
        className="lg:hidden fixed top-[250px] right-0 z-50 bg-gray-800 text-white p-2 rounded"
      >
        ☰
      </button>

      {/* Menú off-canvas para móvil */}
      <aside className={asideMobile}>
        {/* Botón para cerrar */}
        <button
          onClick={() => setOpenMobile(false)}
          className="absolute top-4 right-4 text-gray-700 text-3xl"
        >
          &times;
        </button>
        <div className="mt-16 p-4">
          {children}
        </div>
      </aside>
    </>
  );
};

export default AsideMenu;
