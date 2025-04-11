"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

// Definición de los slides originales (dos slides)
const rawSlides = [
  [
    {
      src: '/images/google-education-logo.webp',
      alt: 'Google for Education',
    },
    {
      src: '/images/science-bits-logo.webp',
      alt: 'Science Bits',
    },
    {
      src: '/images/epea-logo.webp',
      alt: 'EPEA',
    },
  ],
  [
    {
      src: '/images/logo-iqnet.svg',
      alt: 'IQNET',
    },
    {
      src: '/images/logo-iram.svg',
      alt: 'IRAM',
    },
    {
      src: '/images/logo-university-of-cambridge.svg',
      alt: 'University of Cambridge',
    },
  ],
];

const Carousel = () => {
  // Duplicamos los slides para lograr un loop infinito sin salto abrupto.
  const slides = [...rawSlides, ...rawSlides]; // Resultado: 4 slides (los dos primeros son reales, los dos siguientes clones)
  const totalRaw = rawSlides.length; // 2 slides reales
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  // Controlamos si la transición CSS está activada o no (para poder reiniciar sin animación)
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Función para ir a un slide (ajustando el índice de manera circular)
  const goToSlide = useCallback((newIndex: number) => {
    setIndex(newIndex);
  }, []);

  // Autoavance cada 5 segundos (si no está pausado)
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        goToSlide(index + 1);
      }, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [index, isPaused, goToSlide]);

  // Actualiza la transformación del contenedor
  useEffect(() => {
    if (carouselRef.current) {
      // Si la transición está deshabilitada, quitar la propiedad temporalmente
      carouselRef.current.style.transition = transitionEnabled
        ? 'transform 500ms ease-in-out'
        : 'none';
      carouselRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index, transitionEnabled]);

  // Al terminar la transición, si hemos llegado a una de las copias clonadas,
  // se reinicia el índice sin transición para que el efecto sea infinito.
  const handleTransitionEnd = () => {
    if (index >= totalRaw) {
      // Si el índice es mayor o igual a la cantidad de slides reales, restamos ese valor.
      setTransitionEnabled(false);
      setIndex(index - totalRaw);
    } else if (index < 0) {
      setTransitionEnabled(false);
      setIndex(index + totalRaw);
    } else {
      setTransitionEnabled(true);
    }
  };

  // Re-activar la transición luego de un reinicio instantáneo
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  // Pausa/resume al mover el mouse
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Navegación por teclado
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToSlide(index - 1);
    else if (e.key === 'ArrowRight') goToSlide(index + 1);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index]);

  // Soporte para swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(index + 1);
      else goToSlide(index - 1);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full mx-auto overflow-hidden py-10 border-t-4 border-b-4 border-[#71af8d]"
    >
      {/* Contenedor de slides */}
      <div
        ref={carouselRef}
        onTransitionEnd={handleTransitionEnd}
        className="flex transition-transform duration-500 ease-in-out"
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="min-w-full flex justify-center items-center gap-16">
            {slide.map((item, i) => (
              <div key={i} className="relative h-32 w-40">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Botón izquierdo con SVG */}
      <button
        onClick={() => goToSlide(index - 1)}
        aria-label="Anterior"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Botón derecho con SVG */}
      <button
        onClick={() => goToSlide(index + 1)}
        aria-label="Siguiente"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores de navegación */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {rawSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full ${ (index % totalRaw) === idx ? 'bg-[#71af8d]' : 'bg-gray-400'}`}
            aria-label={`Ir al slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
