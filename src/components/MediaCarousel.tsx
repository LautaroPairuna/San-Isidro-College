// src/components/MediaCarousel.tsx
'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

interface MediaCarouselProps {
  medias?: string[];
  altText?: string;
  className?: string;
}

export default function MediaCarousel({
  medias = [],
  altText = '',
  className = '',
}: MediaCarouselProps) {
  // useEmblaCarousel devuelve [viewportRef, emblaApi]
  const [viewportRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  return (
    <div className={`relative overflow-hidden h-full ${className}`}>
      {/* Viewport: embla gestiona el scroll/swipe aquí */}
      <div className="flex h-full" ref={viewportRef}>
        {medias.map((src, idx) => (
          <div key={idx} className="min-w-full h-full relative">
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
              />
            )}
          </div>
        ))}
      </div>

      {/* Controles personalizados */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
      >
        ‹
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
      >
        ›
      </button>
    </div>
  );
}
