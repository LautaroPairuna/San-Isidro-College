'use client'

import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { toPublicImageUrl } from '@/lib/publicConstants'

/** Fotos mínimas en pantalla para que la tira se vea llena de lado a lado. */
const MINIMO_FOTOS = 8

type MedioMinimal = {
  id: number
  urlArchivo: string
  textoAlternativo?: string | null
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO'
  posicion: number
}

/**
 * Tira de fotos que cruza la pantalla de lado a lado, como en el diseño de
 * San Isidro Play: todas a la misma altura y con el ancho que les da su propia
 * proporción, corriéndose de a una.
 *
 * Se sale de la columna de contenido con el truco de `left-1/2 w-screen
 * -translate-x-1/2`, así el resto de la sección sigue centrado en 1024px.
 * El alto va fijo y el ancho en `auto`: el navegador lo calcula con la
 * proporción real de cada foto, que es lo que hace que la tira se vea despareja
 * como en el diseño.
 */
export default function TiraFotos({
  medios,
  altText,
  fallbacks = [],
}: {
  medios: MedioMinimal[]
  altText: string
  /** Fotos del repo para cuando el grupo todavía no tiene nada cargado. */
  fallbacks?: string[]
}) {
  const fotos = medios
    .filter((medio) => medio.tipo === 'IMAGEN')
    .sort((a, b) => a.posicion - b.posicion)
    .map((medio) => ({
      src: toPublicImageUrl('medios', medio.urlArchivo),
      alt: medio.textoAlternativo ?? altText,
    }))

  const disponibles = fotos.length > 0 ? fotos : fallbacks.map((src) => ({ src, alt: altText }))

  if (disponibles.length === 0) return null

  // Con pocas fotos la tira no llega a cruzar la pantalla y queda media vacía.
  // Se repiten hasta MINIMO_FOTOS para que el loop se vea continuo; si el admin
  // carga suficientes, no se repite ninguna.
  const items = Array.from({ length: Math.max(disponibles.length, MINIMO_FOTOS) }, (_, i) => ({
    ...disponibles[i % disponibles.length]!,
    key: `${disponibles[i % disponibles.length]!.src}-${i}`,
  }))

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <Carousel
        opts={{ align: 'start', loop: true, dragFree: true }}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
        className="group"
      >
        <CarouselContent className="-ml-2">
          {items.map((foto) => (
            <CarouselItem key={foto.key} className="basis-auto pl-2">
              <Image
                src={foto.src}
                alt={foto.alt}
                width={640}
                height={420}
                sizes="(max-width: 768px) 70vw, 30vw"
                className="h-[180px] w-auto max-w-none object-cover md:h-[220px]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 opacity-0 transition-opacity group-hover:opacity-100" />
        <CarouselNext className="right-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </Carousel>
    </div>
  )
}
