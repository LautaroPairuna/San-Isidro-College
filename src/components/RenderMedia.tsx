// src/components/RenderMedia.tsx
import React, { memo } from 'react'
import Image from 'next/image'
import { toPublicImageUrl } from '@/lib/publicConstants'

/**
 * Tipo mínimo que RenderMedia necesita para funcionar.
 * (No debería exigir creadoEn/actualizadoEn porque no renderiza con eso)
 */
export type MedioKind = 'IMAGEN' | 'VIDEO' | 'ICONO'

export interface MedioBase {
  id: number
  urlArchivo: string
  urlMiniatura?: string | null
  textoAlternativo?: string | null
  tipo: MedioKind
  posicion: number
  grupoMediosId: number
}

/**
 * Tipo completo (DB/API “full”).
 * Si en otros lados lo necesitás, seguís teniéndolo.
 */
export interface MedioType extends MedioBase {
  creadoEn: string
  actualizadoEn: string
}

/**
 * Props para el componente RenderMedia:
 * - medio: objeto mínimo requerido para renderizar.
 * - fallback: ruta a imagen que se mostrará si no hay `medio` o si falla la carga.
 * - className: clases CSS opcionales para estilizar el elemento <img> o <video>.
 */
interface Props {
  medio?: MedioBase | null
  fallback: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  videoMode?: 'cover' | 'contain-blur'
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>
}

/**
 * RenderMedia
 *
 * Componente genérico que, dado un objeto MedioBase, detecta si debe
 * renderizar un <video> (cuando tipo === 'VIDEO') o una imagen
 * (cuando tipo === 'IMAGEN' o 'ICONO'). Si `medio` viene nulo o indefinido,
 * se usa la ruta `fallback`.
 *
 * Soporta modo "fill" vs modo dimensiones fijas.
 */
const RenderMedia = memo(function RenderMedia({
  medio,
  fallback,
  className,
  width = 800,
  height = 600,
  fill = false,
  videoMode,
  videoProps = {},
}: Props) {
  // Si no hay objeto `medio`, o no tiene urlArchivo válida, usamos fallback como imagen
  if (!medio?.urlArchivo) {
    return (
      <Image
        src={fallback}
        alt="Media Fallback"
        {...(fill ? { fill: true, sizes: '100vw' } : { width, height })}
        className={className}
      />
    )
  }

  // Construir la URL pública del archivo: usamos el helper cliente-safe
  const src = toPublicImageUrl('medios', medio.urlArchivo)

  // Si el tipo es VIDEO
  if (medio.tipo === 'VIDEO') {
    const mode = videoMode || (fill ? 'cover' : 'contain-blur')

    if (mode === 'cover') {
      return (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          {...videoProps}
          className={`w-full h-full object-cover ${className || ''}`}
        />
      )
    }

    return (
      <div className={`relative w-full h-full overflow-hidden ${className || ''}`}>
        {/* Fondo blur */}
        <div className="absolute inset-0 z-0 opacity-50">
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover blur-xl scale-110 pointer-events-none"
          />
        </div>

        {/* Frente */}
        <video
          src={src}
          className="relative z-10 w-full h-full object-contain"
          controls
          muted={false}
          loop={false}
          playsInline
          {...videoProps}
        >
          Tu navegador no soporta la reproducción de video.
        </video>
      </div>
    )
  }

  // Para IMAGEN o ICONO
  return (
    <Image
      src={src}
      alt={medio.textoAlternativo ?? 'Media Image'}
      {...(fill ? { fill: true, sizes: '100vw' } : { width, height })}
      className={className}
    />
  )
})

export default RenderMedia
