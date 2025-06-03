// src/components/RenderMedia.tsx
import React, { memo } from 'react'
import Image from 'next/image'

/**
 * Tipo que describe un medio (imagen o video) desde la API.
 */
export interface MedioType {
  id: number
  urlArchivo: string
  urlMiniatura?: string | null
  textoAlternativo?: string | null
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO'
  posicion: number
  grupoMediosId: number
  creadoEn: string
  actualizadoEn: string
}

/**
 * Props para el componente RenderMedia:
 * - medio: objeto MedioType proveniente de la API.
 * - fallback: ruta a imagen que se mostrará si no hay `medio` o si falla la carga.
 * - className: clases CSS opcionales para estilizar el elemento <img> o <video>.
 */
interface Props {
  medio?: MedioType | null
  fallback: string
  className?: string
}

/**
 * RenderMedia
 *
 * Componente genérico que, dado un objeto MedioType, detecta si debe
 * renderizar una etiqueta <video> (cuando tipo === 'VIDEO') o una imagen
 * (cuando tipo === 'IMAGEN' o 'ICONO'). Si `medio` viene nulo o indefinido,
 * se usa la ruta `fallback`.
 *
 * Buenas prácticas aplicadas:
 * - Siempre validar que `medio.urlArchivo` exista antes de usarlo.
 * - Next.js <Image> para optimización en imágenes.
 * - Etiqueta <video> con props básicos para autoplay en loop sin sonido.
 * - Componente memoizado para evitar renderizados innecesarios.
 * - Comentarios claros explicando propósitos y lógica.
 */
const RenderMedia = memo(function RenderMedia({
  medio,
  fallback,
  className,
}: Props) {
  // Si no hay objeto `medio`, o no tiene urlArchivo válida, usamos fallback como imagen
  if (!medio || !medio.urlArchivo) {
    return (
      <Image
        src={fallback}
        alt="Media Fallback"
        width={800}
        height={600}
        className={className}
        unoptimized={false}
      />
    )
  }

  // Construir la URL pública del archivo: asumimos que los medios se sirven desde /images/medios/
  const src = `/images/medios/${medio.urlArchivo}`

  // Si el tipo es VIDEO, renderizamos un <video>
  if (medio.tipo === 'VIDEO') {
    return (
      <video
        src={src}
        className={className}
        controls
        muted
        loop
        playsInline
      >
        {/* Texto accesible para navegadores que no soportan <video> */}
        Tu navegador no soporta la reproducción de video.
      </video>
    )
  }

  // Para IMAGEN o ICONO, usamos Next.js Image
  // Si existe urlMiniatura, podríamos usarla en lugar de urlArchivo,
  // pero aquí asumimos que urlArchivo ya es WebP optimizado.
  return (
    <Image
      src={src}
      alt={medio.textoAlternativo ?? 'Media Image'}
      width={800}
      height={600}
      className={className}
      unoptimized={false}
    />
  )
})

export default RenderMedia
