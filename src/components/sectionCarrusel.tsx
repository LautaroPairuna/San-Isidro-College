"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

type Slide = {
  src: string;
  alt: string;
};

const rawSlides: Slide[][] = [
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
  // Duplicamos los slides para lograr el efecto de loop infinito.
  const slides = [...rawSlides, ...rawSlides];
  const totalRaw = rawSlides.length; // cantidad de slides "reales"

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ajustamos la función para aceptar número o función actualizadora
  const goToSlide = useCallback(
    (newIndex: number | ((prevIndex: number) => number)) => {
      if (isAnimating) return; // Evita iniciar nueva transición si la actual no finalizó
      setIsAnimating(true);
      setIndex((prevIndex) =>
        typeof newIndex === 'function' ? newIndex(prevIndex) : newIndex
      );
    },
    [isAnimating]
  );

  // Autoavance cada 5 segundos usando la función actualizadora
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        goToSlide((prevIndex) => prevIndex + 1);
      }, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, goToSlide]);

  // Actualiza la transformación del contenedor para mover el slider
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transition = transitionEnabled
        ? 'transform 500ms ease-in-out'
        : 'none';
      carouselRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index, transitionEnabled]);

  // Al finalizar la transición, verificamos si se debe reiniciar el índice
  const handleTransitionEnd = () => {
    if (index >= totalRaw) {
      setTransitionEnabled(false);
      setIndex(index - totalRaw);
    } else if (index < 0) {
      setTransitionEnabled(false);
      setIndex(index + totalRaw);
    } else {
      setTransitionEnabled(true);
    }
    // Se permite ejecutar otra transición una vez finalizada la actual.
    setIsAnimating(false);
  };

  // Reactivamos la transición si fue desactivada temporalmente.
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  // Eventos para pausar/resumir el autoavance al pasar el mouse o tocar.
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Navegación por teclado
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToSlide(index - 1);
      else if (e.key === 'ArrowRight') goToSlide(index + 1);
    },
    [index, goToSlide]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Soporte para swipe en dispositivos táctiles
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
    <section id="alianzas">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full mx-auto overflow-hidden py-10 border-t-4 border-b-4 border-[#71af8d]"
      >
        <div
          ref={carouselRef}
          onTransitionEnd={handleTransitionEnd}
          className="flex transition-transform duration-500 ease-in-out"
        >
          {slides.map((slide, idx) => (
            <div key={idx} className="min-w-full flex justify-center items-center gap-8 sm:gap-12 md:gap-16">
              {slide.map((item, i) => (
                <div key={i} className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={() => goToSlide(index - 1)}
          aria-label="Anterior"
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-20 w-6 h-6 sm:w-8 sm:h-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => goToSlide(index + 1)}
          aria-label="Siguiente"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-20 w-6 h-6 sm:w-8 sm:h-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {rawSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full ${(index % totalRaw) === idx ? 'bg-[#71af8d]' : 'bg-gray-400'}`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
