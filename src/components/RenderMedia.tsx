// src/components/RenderMedia.tsx
import React, { memo, useState } from 'react'
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
  priority?: boolean
  unoptimized?: boolean
  sizes?: string
  fetchPriority?: 'high' | 'low' | 'auto'
  loading?: 'eager' | 'lazy'
}

interface ImageWithFallbackProps {
  src: string
  fallback: string
  alt: string
  className?: string
  width: number
  height: number
  fill: boolean
  sizes?: string
  priority: boolean
  loading: 'eager' | 'lazy'
  unoptimized?: boolean
  fetchPriority?: 'high' | 'low' | 'auto'
}

function ImageWithFallback({
  src,
  fallback,
  alt,
  className,
  width,
  height,
  fill,
  sizes,
  priority,
  loading,
  unoptimized,
  fetchPriority,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false)
  const activeSrc = failed ? fallback : src
  const isDynamic = activeSrc.startsWith('/api/disk-images')

  return (
    <Image
      src={activeSrc}
      alt={alt}
      {...(fill ? { fill: true, sizes: sizes || '100vw' } : { width, height })}
      className={className}
      unoptimized={unoptimized ?? isDynamic}
      priority={priority}
      loading={loading}
      onError={() => {
        if (!failed && src !== fallback) setFailed(true)
      }}
      {...(fetchPriority ? { fetchPriority } : {})}
    />
  )
}

interface VideoWithFallbackProps {
  src: string
  fallback: string
  alt: string
  className?: string
  width: number
  height: number
  fill: boolean
  sizes?: string
  priority: boolean
  loading: 'eager' | 'lazy'
  unoptimized?: boolean
  fetchPriority?: 'high' | 'low' | 'auto'
  mode: 'cover' | 'contain-blur'
  videoProps: React.VideoHTMLAttributes<HTMLVideoElement>
}

function VideoWithFallback({
  src,
  fallback,
  alt,
  className,
  width,
  height,
  fill,
  sizes,
  priority,
  loading,
  unoptimized,
  fetchPriority,
  mode,
  videoProps,
}: VideoWithFallbackProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <ImageWithFallback
        src={fallback}
        fallback={fallback}
        alt={alt}
        className={className}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        loading={loading}
        unoptimized={unoptimized}
        fetchPriority={fetchPriority}
      />
    )
  }

  if (mode === 'cover') {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        {...videoProps}
        onError={(event) => {
          setFailed(true)
          videoProps.onError?.(event)
        }}
        className={`w-full h-full object-cover ${className || ''}`}
      />
    )
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className || ''}`}>
      <div className="absolute inset-0 z-0 opacity-50">
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          onError={() => {
            setFailed(true)
          }}
          className="w-full h-full object-cover blur-xl scale-110 pointer-events-none"
        />
      </div>

      <video
        src={src}
        className="relative z-10 w-full h-full object-contain"
        controls
        muted={false}
        loop={false}
        playsInline
        {...videoProps}
        onError={(event) => {
          setFailed(true)
          videoProps.onError?.(event)
        }}
      >
        Tu navegador no soporta la reproducción de video.
      </video>
    </div>
  )
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
  priority = false,
  unoptimized,
  sizes,
  fetchPriority,
  loading,
}: Props) {
  const effectiveLoading = loading ?? (priority ? 'eager' : 'lazy')

  // Si no hay objeto `medio`, o no tiene urlArchivo válida, usamos fallback como imagen
  if (!medio?.urlArchivo) {
    return (
      <ImageWithFallback
        src={fallback}
        fallback={fallback}
        alt="Media Fallback"
        className={className}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        loading={effectiveLoading}
        unoptimized={unoptimized}
        fetchPriority={fetchPriority}
      />
    )
  }

  // Construir la URL pública del archivo: usamos el helper cliente-safe
  const src = toPublicImageUrl('medios', medio.urlArchivo)

  // Si el tipo es VIDEO
  if (medio.tipo === 'VIDEO') {
    const mode = videoMode || (fill ? 'cover' : 'contain-blur')
    return (
      <VideoWithFallback
        key={`video:${src}`}
        src={src}
        fallback={fallback}
        alt={medio.textoAlternativo || 'Media Fallback'}
        className={className}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        loading={effectiveLoading}
        unoptimized={unoptimized}
        fetchPriority={fetchPriority}
        mode={mode}
        videoProps={videoProps}
      />
    )
  }

  // Si el tipo es IMAGEN o ICONO
  return (
    <ImageWithFallback
      key={`image:${src}`}
      src={src}
      fallback={fallback}
      alt={medio.textoAlternativo || 'Medio'}
      className={className}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      priority={priority}
      loading={effectiveLoading}
      unoptimized={unoptimized}
      fetchPriority={fetchPriority}
    />
  )
})

export default RenderMedia
