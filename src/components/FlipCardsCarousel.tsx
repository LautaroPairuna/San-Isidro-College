'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  Carousel as UICarousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

export interface FlipCardItem {
  key: string
  title: string
  backText: string
  icon: string
  image: string
  fallbackIcon: string
  fallbackImage: string
  color: string
}

interface FlipCardsCarouselProps {
  items: FlipCardItem[]
  ariaLabel: string
}

function CardIconWithFallback({ src, fallbackSrc, alt }: { src: string; fallbackSrc: string; alt: string }) {
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={46}
      height={46}
      className="mx-auto object-contain"
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc)
      }}
    />
  )
}

function CardCoverWithFallback({ src, fallbackSrc, alt }: { src: string; fallbackSrc: string; alt: string }) {
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes="(max-width: 640px) 280px, (max-width: 1280px) 45vw, 280px"
      className="object-cover"
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc)
      }}
    />
  )
}

function FlipCard({ card }: { card: FlipCardItem }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <article 
      className="group w-full [perspective:1200px] cursor-pointer" 
      aria-label={card.title}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative h-[390px] w-full transition-transform duration-700 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] md:group-focus-within:[transform:rotateY(180deg)] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-white/40 shadow-lg [backface-visibility:hidden]"
          style={{ backgroundColor: card.color }}
        >
          <div className="h-[40%] px-5 text-center text-white flex flex-col items-center justify-center">
            <CardIconWithFallback src={card.icon} fallbackSrc={card.fallbackIcon} alt={card.title} />
            <h5 className="mt-3 text-lg font-bold leading-tight">{card.title}</h5>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[60%]">
            <CardCoverWithFallback src={card.image} fallbackSrc={card.fallbackImage} alt={card.title} />
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-2xl border border-white/40 p-6 text-white shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ backgroundColor: card.color }}
        >
          <div className="h-full flex items-center justify-center text-center text-xs md:text-sm leading-snug font-semibold">
            {card.backText}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function FlipCardsCarousel({
  items,
  ariaLabel,
}: FlipCardsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [slideIndex, setSlideIndex] = useState(0)
  const [slideCount, setSlideCount] = useState(0)
  const [pages, setPages] = useState<number[]>([0])

  useEffect(() => {
    if (!api) return

    const calculatePages = () => {
      const snapList = api.scrollSnapList()
      setSlideCount(snapList.length)
      
      const containerWidth = api.containerNode().getBoundingClientRect().width
      const slideNodes = api.slideNodes()
      const slideWidth = slideNodes[0]?.getBoundingClientRect().width || 1
      const visibleCount = Math.round(containerWidth / slideWidth)
      
      const step = Math.max(1, visibleCount - 1)
      const newPages = []
      for (let i = 0; i < snapList.length; i += step) {
        newPages.push(i)
      }
      
      if (newPages.length > 0 && newPages[newPages.length - 1] !== snapList.length - 1) {
        newPages.push(snapList.length - 1)
      }
      
      setPages(Array.from(new Set(newPages)))
    }

    const handleSelect = () => {
      setSlideIndex(api.selectedScrollSnap())
    }

    calculatePages()
    handleSelect()

    api.on('reInit', calculatePages)
    api.on('reInit', handleSelect)
    api.on('select', handleSelect)

    return () => {
      api.off('reInit', calculatePages)
      api.off('reInit', handleSelect)
      api.off('select', handleSelect)
    }
  }, [api])

  if (items.length === 0) return null

  return (
    <div className="mt-16">
      <UICarousel
        setApi={setApi}
        opts={{ align: 'start', loop: false }}
        className="w-full px-2 lg:px-12 relative"
        aria-label={ariaLabel}
      >
        <CarouselContent className="cursor-grab active:cursor-grabbing">
          {items.map((card) => (
            <CarouselItem 
              key={`card-${card.key}`} 
              className="basis-full lg:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
            >
              <div className="mx-auto w-full max-w-[320px] sm:max-w-[400px] lg:max-w-none">
                <FlipCard card={card} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {pages.length > 1 && (
          <>
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 -left-6 lg:left-0 h-9 w-9 lg:h-10 lg:w-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white border border-gray-200 shadow-md transition-colors disabled:opacity-50 z-10"
              disabled={slideIndex === 0}
              onClick={() => {
                let activeP = pages.findIndex(p => p >= slideIndex)
                if (activeP === -1) activeP = pages.length - 1
                const prevPage = pages[Math.max(0, activeP - 1)]
                api?.scrollTo(prevPage)
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </button>

            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 -right-6 lg:right-0 h-9 w-9 lg:h-10 lg:w-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white border border-gray-200 shadow-md transition-colors disabled:opacity-50 z-10"
              disabled={slideIndex === slideCount - 1}
              onClick={() => {
                let activeP = pages.findIndex(p => p > slideIndex)
                if (activeP === -1) activeP = pages.length - 1
                const nextPage = pages[Math.min(pages.length - 1, activeP)]
                api?.scrollTo(nextPage)
              }}
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Siguiente</span>
            </button>

            <div className="mt-6 flex justify-center gap-2">
              {pages.map((pageSnapIndex, index) => {
                const isActive = slideIndex >= pageSnapIndex && (pages[index + 1] === undefined || slideIndex < pages[index + 1])
                return (
                  <button
                    key={`dot-${index}`}
                    onClick={() => api?.scrollTo(pageSnapIndex)}
                    aria-label={`Ir a la página ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      isActive ? 'w-7 bg-black/75' : 'w-2.5 bg-black/25 hover:bg-black/45'
                    }`}
                  />
                )
              })}
            </div>
          </>
        )}
      </UICarousel>
    </div>
  )
}
