// src/components/MediaCarousel.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface MediaCarouselProps {
  medias?: string[];
  altText?: string;
  className?: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  medias = [],
  altText = '',
  className = '',
}) => {
  const totalSlides = medias.length;
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
        {medias.map((src, idx) => (
          <div
            key={idx}
            className="min-w-full relative aspect-auto h-full"
          >
            {src.toLowerCase().endsWith('.mp4') ? (
              <video
                src={src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={src}
                alt={altText}
                fill
                className="object-cover"
                sizes="100vw"
              />
            )}
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
          {medias.map((_, idx) => (
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
