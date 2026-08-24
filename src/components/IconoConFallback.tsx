'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

/**
 * Ícono decorativo que cae al archivo del repo si el que viene del admin no
 * carga (una fila de `medio` puede quedar apuntando a un archivo que ya no
 * está en el volumen de medios).
 *
 * Es cliente porque `onError` solo existe en el navegador; el resto de la
 * sección sigue renderizándose en el servidor. El `useEffect` está para que,
 * si cambia el ícono cargado en el admin, el estado deje de mostrar el
 * anterior — no se dispara en la navegación normal.
 */
export default function IconoConFallback({
  src,
  fallbackSrc,
  width,
  height,
  className,
}: {
  src: string
  fallbackSrc: string
  width: number
  height: number
  className?: string
}) {
  const [actual, setActual] = useState(src)

  useEffect(() => {
    setActual(src)
  }, [src])

  return (
    <Image
      src={actual}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      className={className}
      onError={() => {
        if (actual !== fallbackSrc) setActual(fallbackSrc)
      }}
    />
  )
}
