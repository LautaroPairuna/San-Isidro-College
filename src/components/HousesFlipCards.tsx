'use client'

import Image from 'next/image'
import { useState } from 'react'

export type HouseCardItem = {
  key: string
  /** "Condor House", para el alt del escudo. */
  house: string
  /** "Condors", el nombre que va en el dorso. */
  name: string
  /** "San Isidro College", la barra superior del frente. */
  school: string
  /** Escudo en blanco, para el frente. */
  crest: string
  /** Escudo a color, para el dorso. */
  badge: string
  /** Color de la House: fondo del frente y acentos del dorso. */
  color: string
  /** Color de la barra superior del frente. */
  headerColor: string
  traits: string
  description: string
  purposeLabel: string
  purpose: string
  qualitiesLabel: string
  qualities: string
  symbolsLabel: string
  symbols: { name: string; text: string }[]
  motto: string
}

const DORADO = '#c19516'
const NAVY = '#294161'

/** Rótulo de sección del dorso: texto dorado entre dos filetes. */
function RotuloDorso({ children }: { children: string }) {
  return (
    <div className="mt-4 flex items-center gap-2">
      <span className="h-px flex-1" style={{ backgroundColor: DORADO }} />
      <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: DORADO }}>
        {children}
      </span>
      <span className="h-px flex-1" style={{ backgroundColor: DORADO }} />
    </div>
  )
}

/**
 * Tarjeta de House. Muestra el escudo y al pasar el mouse (o al tocarla) gira
 * y deja ver el propósito, las cualidades y los símbolos.
 *
 * `isHovered` acompaña al `isFlipped` para que en desktop alcance con pasar por
 * encima y en touch, donde no hay hover, funcione el tap.
 */
function HouseCard({ card }: { card: HouseCardItem }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const showBack = isFlipped || isHovered

  return (
    <article
      className="w-full cursor-pointer"
      aria-label={card.house}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative h-[600px] w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Frente */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl shadow-lg [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          <div
            className="flex h-16 items-center justify-center text-white"
            style={{ backgroundColor: card.headerColor }}
          >
            <span className="text-lg">
              <strong className="font-bold">{card.school.replace(/ College$/, '')}</strong>
              <span className="font-light"> College</span>
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center p-6" style={{ backgroundColor: card.color }}>
            <Image
              src={card.crest}
              alt={card.house}
              width={320}
              height={380}
              className="h-full w-auto max-w-full object-contain"
            />
          </div>
        </div>

        {/* Dorso */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border bg-white px-5 py-5 text-center shadow-lg [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
          style={{ borderColor: card.color, transform: 'rotateY(180deg)' }}
        >
          <Image
            src={card.badge}
            alt=""
            aria-hidden="true"
            width={72}
            height={72}
            className="mx-auto h-14 w-14 object-contain"
          />
          <h3 className="mt-2 text-lg font-bold" style={{ color: card.color }}>
            {card.name}
          </h3>
          <p className="mt-1 text-[11px] font-semibold tracking-wide" style={{ color: NAVY }}>
            {card.traits}
          </p>
          <p className="mt-3 text-[12px] leading-snug text-gray-700">{card.description}</p>

          <RotuloDorso>{card.purposeLabel}</RotuloDorso>
          <p className="mt-2 text-[12px] leading-snug text-gray-700">{card.purpose}</p>

          <RotuloDorso>{card.qualitiesLabel}</RotuloDorso>
          <p className="mt-2 text-[12px] leading-snug text-gray-700">{card.qualities}</p>

          <RotuloDorso>{card.symbolsLabel}</RotuloDorso>
          <ul className="mt-2 space-y-1.5 text-left">
            {card.symbols.map((symbol) => (
              <li key={symbol.name} className="text-[12px] leading-snug text-gray-700">
                <strong className="font-bold" style={{ color: NAVY }}>
                  {symbol.name}:
                </strong>{' '}
                {symbol.text}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: DORADO }}>
            {card.motto}
          </p>
        </div>
      </div>
    </article>
  )
}

export default function HousesFlipCards({
  items,
  ariaLabel,
}: {
  items: HouseCardItem[]
  ariaLabel: string
}) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" aria-label={ariaLabel}>
      {items.map((card) => (
        <HouseCard key={card.key} card={card} />
      ))}
    </div>
  )
}
