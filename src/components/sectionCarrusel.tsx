// src/app/components/ui/sectionCarrusel.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import RenderMedia from '@/components/RenderMedia';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';

interface MedioMinimal {
  id: number;
  urlArchivo: string;
  textoAlternativo?: string | null;
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO';
  posicion: number;
  grupoMediosId: number;
}

interface SectionCarruselProps {
  medios: MedioMinimal[];
}

export default function SectionCarrusel({ medios }: SectionCarruselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // 2) Agrupamos en chunks de 3 para mantener el diseño original
  const slides = useMemo<MedioMinimal[][]>(() => {
    if (!medios || medios.length === 0) return [];

    const items = medios
      .filter((m) => m.tipo === 'ICONO' || m.tipo === 'IMAGEN')
      .sort((a, b) => a.posicion - b.posicion);

    const chunks: MedioMinimal[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      chunks.push(items.slice(i, i + 3));
    }
    return chunks;
  }, [medios]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section id="alianzas">
      <div className="relative w-full mx-auto py-10 border-t-4 border-b-4 border-[#71af8d]">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slideGroup, idx) => (
              <CarouselItem key={idx} className="min-w-full">
                <div className="flex justify-center items-center gap-8 sm:gap-12 md:gap-16 h-full p-4">
                  {slideGroup.map((item) => (
                    <div
                      key={item.id}
                      className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
                    >
                      <RenderMedia
                        medio={item}
                        fallback="/images/placeholder.webp"
                        fill
                        priority={idx === 0}
                        sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
                        className="object-contain"
                        unoptimized={true}
                      />
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controles de Navegación Personalizados (Estilo Original) */}
          <div className="hidden md:block">
            <CarouselPrevious
              variant="ghost"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-gray-200 hover:bg-gray-300 rounded-full shadow-md text-gray-700 border-none"
            />
            <CarouselNext
              variant="ghost"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-gray-200 hover:bg-gray-300 rounded-full shadow-md text-gray-700 border-none"
            />
          </div>

          {/* Indicadores (Dots) Verdes */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300',
                  current === index
                    ? 'bg-[#71af8d] w-8' // Activo: Verde y alargado
                    : 'bg-[#71af8d]/30 w-2.5 hover:bg-[#71af8d]/60' // Inactivo: Verde transparente
                )}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
}
