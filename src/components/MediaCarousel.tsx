'use client';

import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import RenderMedia, { MedioType } from '@/components/RenderMedia';
import { cn } from '@/lib/utils';

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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (items.length === 0) return null;

  // Si hay un solo elemento, renderizarlo estáticamente
  if (items.length === 1) {
    const item = items[0];
    return (
      <div className={cn('w-full h-full relative overflow-hidden bg-gray-900', className)}>
        <RenderMedia
          medio={item as MedioType}
          fallback="/images/placeholder.webp"
          fill={true}
          priority={true}
          videoMode="contain-blur"
          videoProps={{
            autoPlay: true,
            muted: true,
            loop: true,
            controls: false,
            playsInline: true,
            className: 'pointer-events-none object-contain w-full h-full relative z-10',
          }}
          className="w-full h-full pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      opts={{
        loop: true,
        align: 'start',
      }}
      className={cn('w-full h-full relative group', className)}
    >
      <CarouselContent className="h-full -ml-0">
        {items.map((item, idx) => (
          <CarouselItem key={idx} className="h-full pl-0 relative">
            <div className="w-full h-full relative overflow-hidden bg-gray-900">
              <RenderMedia
                medio={item as MedioType}
                fallback="/images/placeholder.webp"
                fill={true}
                priority={idx === 0}
                videoMode="contain-blur" // Forzar modo contain-blur
                videoProps={{
                  autoPlay: true,
                  muted: true,
                  loop: true,
                  controls: false,
                  playsInline: true,
                  className: 'pointer-events-none object-contain w-full h-full relative z-10', // object-contain para respetar aspect ratio
                }}
                className="w-full h-full pointer-events-none"
              />
              {/* Overlay gradiente sutil para mejorar visibilidad de controles si es necesario */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Controles Unificados (Dots + Flechas) - Estilo Pill Dark */}
      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-lg">
          <CarouselPrevious
            className="static translate-y-0 h-6 w-6 bg-transparent border-none text-white hover:text-white/80 hover:bg-transparent"
            variant="ghost"
          />

          <div className="flex gap-2 items-center mx-1">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'rounded-full transition-all duration-300',
                  current === index
                    ? 'bg-white w-8 h-2.5'
                    : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/80'
                )}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>

          <CarouselNext
            className="static translate-y-0 h-6 w-6 bg-transparent border-none text-white hover:text-white/80 hover:bg-transparent"
            variant="ghost"
          />
        </div>
      )}
    </Carousel>
  );
};

export default MediaCarousel;
