'use client';

import React from 'react';

interface SmoothLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const SmoothLink: React.FC<SmoothLinkProps> = ({ href, children, className, 'aria-label': ariaLabel }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.substring(1); // Quita el "#" del href
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offset = 80; // Ajuste para evitar que se recorte la parte superior
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const adjustedPosition =
        elementPosition -
        window.innerHeight / 2 +
        targetElement.clientHeight / 2 -
        offset;
      window.scrollTo({
        top: adjustedPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className ?? 'scroll-link'} aria-label={ariaLabel}>
      {children}
    </a>
  );
};

export default SmoothLink;
