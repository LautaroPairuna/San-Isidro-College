import React, { useState, useEffect } from 'react';

interface FixedAsideProps {
  children: React.ReactNode;
}

const FixedAside: React.FC<FixedAsideProps> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Puedes ajustar el umbral según tus necesidades
      if (window.scrollY > 2000) {
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
  }, []);

  // Se construyen las clases de Tailwind condicionalmente
  const asideClasses = `fixed right-10 top-60 w-56 text-gray-800 z-20 transition-all duration-300 
    ${scrolled ? 'bg-gray-200 shadow-md p-5 rounded-lg' : ''}`;

  return <aside className={asideClasses}>{children}</aside>;
};

export default FixedAside;
