// src/components/MediaCarousel.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
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

  // Navegación segura
  const showSlide = useCallback(
    (next: number) => {
      if (totalSlides <= 1) return;
      // Loop cíclico
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
      nextSlide();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [totalSlides, isPaused, nextSlide]);

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

  // Drag logic (Framer Motion)
  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    const { offset, velocity } = info;

    if (offset.x < -threshold || velocity.x < -500) {
      nextSlide();
    } else if (offset.x > threshold || velocity.x > 500) {
      prevSlide();
    }
  };

  return (
    <div
      ref={carouselContainerRef}
      className={`relative w-full overflow-hidden h-full cursor-grab active:cursor-grabbing ${className}`}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides Container */}
      <motion.div
        className="flex h-full"
        animate={{ x: `-${index * 100}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={onDragEnd}
        // Evita propagar click si hubo drag significativo (opcional, pero buena UX)
        onClickCapture={(e) => {
          // Si quisiéramos bloquear clicks en links internos durante el drag
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="min-w-full relative h-full overflow-hidden bg-gray-900 select-none"
            onDragStart={(e) => e.preventDefault()} // Evita ghost image nativa
          >
            <RenderMedia
              medio={item as MedioType}
              fallback="/images/placeholder.webp"
              fill={true}
              priority={idx === 0}
              videoMode="contain-blur"
              videoProps={{
                autoPlay: true,
                muted: true,
                loop: true,
                controls: false,
                playsInline: true,
                className: "pointer-events-none" // Importante para no interferir con el drag
              }}
              className="object-cover pointer-events-none" // Importante para imágenes
            />
          </div>
        ))}
      </motion.div>

      {/* Controles */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
          <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
            aria-label="Anterior"
            className="hover:scale-110 transition-transform"
          >
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
                onClick={(e) => { e.stopPropagation(); showSlide(idx); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
            aria-label="Siguiente"
            className="hover:scale-110 transition-transform"
          >
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
      )}
    </div>
  );
};

export default MediaCarousel;
