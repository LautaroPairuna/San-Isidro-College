// app/deportes/components/Carousel.tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { useMedios } from '@/lib/hooks'

type Slide = {
  src: string
  alt: string
}

interface MedioMinimal {
  id: number
  urlArchivo: string
  textoAlternativo?: string
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO'
  posicion: number
  grupoMediosId: number
}

// Reemplaza este ID por el que corresponda en tu admin para “Alianzas”
const ALIANZAS_GROUP_ID = 7

export default function Carousel() {
  // 1) Traemos todos los medios del grupo “Alianzas”
  const { data: mediosRaw = [], isLoading, error } = useMedios(ALIANZAS_GROUP_ID)

  // 2) Estado local para slides agrupados
  const [rawSlides, setRawSlides] = useState<Slide[][]>([])

  // 3) Construimos rawSlides cuando cambien los datos
  useEffect(() => {
    if (!mediosRaw || mediosRaw.length === 0) {
      setRawSlides([])
      return
    }

    // Filtramos tipos "ICONO" y "IMAGEN"
    const items = (mediosRaw as MedioMinimal[])
      .filter((m) => m.tipo === 'ICONO' || m.tipo === 'IMAGEN')
      .sort((a, b) => a.posicion - b.posicion)
      .map((m) => ({
        src: `/images/medios/${m.urlArchivo}`,
        alt: m.textoAlternativo ?? '',
      }))

    // Agrupamos en subarrays de 3 elementos cada uno
    const chunks: Slide[][] = []
    for (let i = 0; i < items.length; i += 3) {
      chunks.push(items.slice(i, i + 3))
    }

    setRawSlides(chunks)
  }, [mediosRaw])

  // 4) Duplicamos para loop infinito
  const slides = [...rawSlides, ...rawSlides]
  const totalRaw = rawSlides.length

  // 5) Estados de control
  const [index, setIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const carouselRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 6) Función para ir a slide (acepta número o función)
  const goToSlide = useCallback(
    (newIndex: number | ((prev: number) => number)) => {
      if (isAnimating || totalRaw === 0) return
      setIsAnimating(true)
      setIndex((prev) =>
        typeof newIndex === 'function' ? newIndex(prev) : newIndex
      )
    },
    [isAnimating, totalRaw]
  )

  // 7) Autoavance cada 5 segundos (ahora solo depende de isPaused y totalRaw)
  useEffect(() => {
    // Si no hay slides o está pausado, no iniciamos intervalo
    if (isPaused || totalRaw === 0) return

    intervalRef.current = setInterval(() => {
      // Avanzamos índice; si se sale del rango, el handleTransitionEnd lo corrige
      setIndex((prev) => prev + 1)
    }, 5000)

    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, totalRaw])

  // 8) Actualizamos transform/transition al cambiar índice o transitionEnabled
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transition = transitionEnabled
        ? 'transform 500ms ease-in-out'
        : 'none'
      carouselRef.current.style.transform = `translateX(-${index * 100}%)`
    }
  }, [index, transitionEnabled])

  // 9) Al terminar la transición, corregimos índice para loop infinito
  const handleTransitionEnd = () => {
    if (totalRaw === 0) return

    if (index >= totalRaw) {
      // Si llegamos al “duplicado” en la parte derecha, volvemos al principio sin animación
      setTransitionEnabled(false)
      setIndex(index - totalRaw)
    } else if (index < 0) {
      // Si llegamos al “duplicado” en la parte izquierda, volvemos al final
      setTransitionEnabled(false)
      setIndex(index + totalRaw)
    } else {
      setTransitionEnabled(true)
    }
    setIsAnimating(false)
  }

  // 10) Reactiva transición si estuvo desactivada
  useEffect(() => {
    if (!transitionEnabled) {
      const t = setTimeout(() => setTransitionEnabled(true), 50)
      return () => clearTimeout(t)
    }
  }, [transitionEnabled])

  // 11) Pausar/Resumir al hover o touch
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  // 12) Navegación por teclado
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToSlide(index - 1)
      else if (e.key === 'ArrowRight') goToSlide(index + 1)
    },
    [index, goToSlide]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // 13) Swipe en pantallas táctiles
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(index + 1)
      else goToSlide(index - 1)
    }
  }

  // 14) Renderizado condicional tras declarar todos los hooks
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-600">
        Cargando alianzas…
      </div>
    )
  }
  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error al cargar alianzas: {error.message}
      </div>
    )
  }
  if (totalRaw === 0) {
    return null
  }

  return (
    <section id="alianzas">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full mx-auto overflow-hidden py-10 border-t-4 border-b-4 border-[#71af8d]"
      >
        <div
          ref={carouselRef}
          onTransitionEnd={handleTransitionEnd}
          className="flex transition-transform duration-500 ease-in-out"
        >
          {slides.map((slideGroup, idx) => (
            <div
              key={idx}
              className="min-w-full flex justify-center items-center gap-8 sm:gap-12 md:gap-16"
            >
              {slideGroup.map((item, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={() => goToSlide(index - 1)}
          aria-label="Anterior"
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-20 w-6 h-6 sm:w-8 sm:h-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => goToSlide(index + 1)}
          aria-label="Siguiente"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-20 w-6 h-6 sm:w-8 sm:h-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {rawSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full ${
                index % totalRaw === idx ? 'bg-[#71af8d]' : 'bg-gray-400'
              }`}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
