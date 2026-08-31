'use client'

import { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { toPublicImageUrl } from '@/lib/publicConstants'

/** Fotos mínimas en pantalla para que la tira se vea llena de lado a lado. */
const MINIMO_FOTOS = 8

/** Cuánto se achica y se apaga una foto al alejarse del centro de la pantalla. */
const ESCALA_MINIMA = 0.86
const OPACIDAD_MINIMA = 0.5

type MedioMinimal = {
  id: number
  urlArchivo: string
  textoAlternativo?: string | null
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO'
  posicion: number
}

/**
 * Le da profundidad a la tira: la foto que pasa por el centro de la pantalla
 * queda a escala completa y opaca, y las demás se van achicando y apagando
 * según cuánto se alejan del centro.
 *
 * Se escribe directo sobre el estilo de cada slide en vez de guardarlo en
 * estado: esto corre en cada frame del scroll del carrusel y un `setState` por
 * frame haría re-renderizar la lista entera.
 */
function useProfundidad(api: CarouselApi | undefined) {
  useEffect(() => {
    if (!api) return

    const raiz = api.rootNode()
    const slides = api.slideNodes()

    const aplicar = () => {
      const caja = raiz.getBoundingClientRect()
      const centro = caja.left + caja.width / 2
      const alcance = caja.width / 2 || 1

      for (const slide of slides) {
        const foto = slide.firstElementChild as HTMLElement | null
        if (!foto) continue

        const propia = slide.getBoundingClientRect()
        const distancia = Math.min(Math.abs(propia.left + propia.width / 2 - centro) / alcance, 1)

        foto.style.transform = `scale(${1 - (1 - ESCALA_MINIMA) * distancia})`
        foto.style.opacity = String(1 - (1 - OPACIDAD_MINIMA) * distancia)
      }
    }

    aplicar()
    api.on('scroll', aplicar)
    api.on('reInit', aplicar)
    api.on('resize', aplicar)
    // El scroll de la página también cambia qué foto está en el centro del
    // viewport mientras la tira entra y sale de pantalla.
    window.addEventListener('scroll', aplicar, { passive: true })

    return () => {
      api.off('scroll', aplicar)
      api.off('reInit', aplicar)
      api.off('resize', aplicar)
      window.removeEventListener('scroll', aplicar)
    }
  }, [api])
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
  const [api, setApi] = useState<CarouselApi>()
  useProfundidad(api)

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
        setApi={setApi}
        opts={{ align: 'center', loop: true, dragFree: true }}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
        className="group"
      >
        {/* El padding vertical deja lugar para la foto del centro, que es la
            única que se muestra a escala completa. */}
        <CarouselContent className="-ml-2 py-6">
          {items.map((foto) => (
            <CarouselItem key={foto.key} className="basis-auto pl-2">
              <div className="origin-center will-change-transform">
                <img src={foto.src} alt={foto.alt} width={640} height={420} className="h-[240px] w-auto max-w-none rounded-sm object-cover shadow-lg md:h-[340px]" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 opacity-0 transition-opacity group-hover:opacity-100" />
        <CarouselNext className="right-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </Carousel>
    </div>
  )
}
