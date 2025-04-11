"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images?: string[];
  altText?: string;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = [],
  altText = "",
  className = ""
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const totalSlides = images.length;
  const [isPaused, setIsPaused] = useState(false);

  // Para gestionar swipe
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const showSlide = useCallback(
    (i: number) => {
      if (totalSlides === 0) return;
      const newIndex = (i + totalSlides) % totalSlides;
      setIndex(newIndex);
    },
    [totalSlides]
  );

  // Autoavance cada 5 segundos si no está en pausa
  useEffect(() => {
    if (totalSlides === 0) return;
    if (!isPaused) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % totalSlides);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [totalSlides, isPaused]);

  // Actualiza la transformación del contenedor al cambiar el índice
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  // Pausa al pasar el mouse
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Soporte para navegación por teclado
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') showSlide(index - 1);
      else if (e.key === 'ArrowRight') showSlide(index + 1);
    },
    [index, showSlide]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Soporte para swipe en dispositivos táctiles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showSlide(index + 1);
      else showSlide(index - 1);
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Contenedor de slides */}
      <div ref={carouselRef} className="flex transition-transform duration-500 ease-in-out">
        {images.map((src, idx) => (
          <div key={idx} className="min-w-full relative aspect-[6/5]">
            <Image
              src={src}
              alt={altText}
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
            />
          </div>
        ))}
      </div>
      
      {/* Controles e indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full">
        <button
          onClick={() => showSlide(index - 1)}
          className="text-white hover:text-gray-200 transition"
          aria-label="Slide anterior"
        >
          {/* SVG izquierdo */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => showSlide(idx)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${idx === index ? 'bg-white scale-110' : 'bg-gray-300'}`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => showSlide(index + 1)}
          className="text-white hover:text-gray-200 transition"
          aria-label="Slide siguiente"
        >
          {/* SVG derecho */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
