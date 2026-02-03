// src/components/MediaCarousel.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import RenderMedia, { MedioType } from '@/components/RenderMedia';

// Interfaz compatible con lo que llega de la API/Prisma
interface MedioMinimal {
  id: number;
  urlArchivo: string;
  textoAlternativo?: string | null;
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO';
  posicion?: number;
  grupoMediosId?: number;
}

interface MediaCarouselProps {
  items: (MedioType | MedioMinimal)[];
  altText?: string;
  className?: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  items = [],
  altText = '',
  className = '',
}) => {
  const totalSlides = items.length;
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const showSlide = useCallback(
    (next: number) => {
      if (totalSlides <= 1) return;
      const newIndex = (next + totalSlides) % totalSlides;
      setIndex(newIndex);
    },
    [totalSlides]
  );
  const nextSlide = useCallback(() => showSlide(index + 1), [index, showSlide]);
  const prevSlide = useCallback(() => showSlide(index - 1), [index, showSlide]);

  // Auto-advance
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [totalSlides, isPaused]);

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Keyboard nav
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = carouselContainerRef.current;
    if (!el) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    el.addEventListener('keydown', onKeyDown);
    return () => {
      el.removeEventListener('keydown', onKeyDown);
    };
  }, [prevSlide, nextSlide]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <div
      ref={carouselContainerRef}
      className={`relative w-full overflow-hidden h-full ${className}`}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="min-w-full relative h-full overflow-hidden bg-gray-900"
          >
            <RenderMedia
              medio={item as MedioType} // Cast seguro por compatibilidad de tipos
              fallback="/images/placeholder.webp" // Fallback genérico si falla
              fill={true} // Imagen llena el slide
              videoMode="contain-blur" // Video mantiene ratio con fondo blur
              videoProps={{
                autoPlay: true,
                muted: true,
                loop: true,
                controls: false,
              }}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Controles */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full">
        <button onClick={prevSlide} aria-label="Anterior">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => showSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === index ? 'bg-white scale-110' : 'bg-gray-300'
              }`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
        <button onClick={nextSlide} aria-label="Siguiente">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MediaCarousel;
