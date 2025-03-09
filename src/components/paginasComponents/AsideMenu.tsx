import React, { useState, useEffect } from 'react';

interface FixedAsideProps {
  children: React.ReactNode;
  scrollThreshold?: number; // Hacemos que sea opcional
}

const AsideMenu: React.FC<FixedAsideProps> = ({ children, scrollThreshold = 2000 }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Limpieza del listener al desmontar el componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold]);

  const asideClasses = `fixed right-20 top-60 w-56 text-gray-800 z-20 transition-all duration-300 
    ${scrolled ? 'bg-gray-200 shadow-md p-5 rounded-lg' : ''}`;

  return <aside className={asideClasses}>{children}</aside>;
};

export default AsideMenu;
