'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import FlipCardsCarousel, { type FlipCardItem } from '@/components/FlipCardsCarousel'

type FlipCardsGridProps = {
  items: FlipCardItem[]
  ariaLabel: string
}

function CardIconWithFallback({ src, fallbackSrc, alt }: { src: string; fallbackSrc: string; alt: string }) {
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center">
      <Image
        src={currentSrc}
        alt={alt}
        width={64}
        height={64}
        className="h-full w-full object-contain"
        onError={() => {
          if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc)
        }}
      />
    </div>
  )
}

function CardCoverWithFallback({ src, fallbackSrc, alt }: { src: string; fallbackSrc: string; alt: string }) {
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  return (
    <div className="absolute inset-0">
      <Image
        src={currentSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
        className="rounded-b-3xl object-cover"
        onError={() => {
          if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc)
        }}
      />
    </div>
  )
}

function FlipCard({ card }: { card: FlipCardItem }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const showBack = isFlipped || isHovered

  return (
    <article
      className="w-full cursor-pointer"
      aria-label={card.title}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative h-[390px] w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl shadow-lg [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
          style={{ backgroundColor: card.color }}
        >
          <div className="flex h-[40%] flex-col items-center justify-center px-2 text-center text-white">
            <CardIconWithFallback src={card.icon} fallbackSrc={card.fallbackIcon} alt={card.title} />
            <h3 className="mt-3 text-sm font-bold leading-tight">{card.title}</h3>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[60%]">
            <CardCoverWithFallback src={card.image} fallbackSrc={card.fallbackImage} alt={card.title} />
          </div>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center rounded-3xl p-6 text-center text-xs leading-snug text-white shadow-lg [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
          style={{ backgroundColor: card.color, transform: 'rotateY(180deg)' }}
        >
          <p className="font-semibold">{card.backText}</p>
        </div>
      </div>
    </article>
  )
}

export default function FlipCardsGrid({ items, ariaLabel }: FlipCardsGridProps) {
  if (items.length === 0) return null

  return (
    <div className="mt-8" aria-label={ariaLabel}>
      <div className="xl:hidden">
        <FlipCardsCarousel items={items} ariaLabel={ariaLabel} />
      </div>

      <div className="hidden gap-4 xl:grid xl:grid-cols-4">
        {items.map((card) => (
          <FlipCard key={card.key} card={card} />
        ))}
      </div>
    </div>
  )
}
