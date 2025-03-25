"use client";

import React, { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ImageCarouselProps {
  images?: string[];  // Opcional para evitar errores
  altText?: string;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images = [], altText = "", className = "" }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const totalSlides = images.length;

  const showSlide = (i: number) => {
    if (totalSlides === 0) return;
    const newIndex = (i + totalSlides) % totalSlides;
    setIndex(newIndex);
  };

  // Autoavance cada 5 segundos
  useEffect(() => {
    if (totalSlides === 0) return;
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // Actualizar la transformación del contenedor al cambiar el índice
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div ref={carouselRef} className="flex transition-transform duration-500 ease-in-out">
        {images.map((src, idx) => (
          <div key={idx} className="min-w-full">
            <img src={src} alt={altText} className="w-full h-auto object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full">
        <button onClick={() => showSlide(index - 1)} className="text-white hover:text-gray-200 transition">
          <FiChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              onClick={() => showSlide(idx)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${idx === index ? 'bg-white scale-110' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        <button onClick={() => showSlide(index + 1)} className="text-white hover:text-gray-200 transition">
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
