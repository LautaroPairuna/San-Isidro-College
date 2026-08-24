import type { ReactNode } from 'react'

/**
 * Rótulo dorado y texto separados por un filete, alternando de lado.
 *
 * Es el bloque que arma las secciones de los niveles (Secondary, Primary,
 * Kindergarten) y que reusan las páginas de Experiencia SIC. En pantallas
 * chicas el filete desaparece y las dos partes se apilan.
 */
export default function BloqueRotulo({
  rotulo,
  children,
  lado = 'izquierda',
  como: Rotulo = 'h2',
  className,
}: {
  rotulo: ReactNode
  children: ReactNode
  /** De qué lado queda el rótulo respecto del texto en desktop. */
  lado?: 'izquierda' | 'derecha'
  /** Nivel del encabezado: h2 cuando el rótulo abre la sección, h3 cuando cuelga de un título anterior. */
  como?: 'h2' | 'h3'
  className?: string
}) {
  const rotuloEl = (
    <Rotulo
      className={`md:col-span-3 text-lg font-bold text-[#c19516] ${
        lado === 'izquierda' ? 'md:text-right' : 'md:col-start-10'
      }`}
    >
      {rotulo}
    </Rotulo>
  )

  const textoEl = (
    <div
      className={`md:col-span-9 space-y-4 text-gray-700 leading-relaxed hyphens-auto ${
        lado === 'izquierda'
          ? 'md:col-start-4 md:border-l md:border-[#9bb5a5] md:pl-6'
          : 'md:col-start-1 md:border-r md:border-[#9bb5a5] md:pr-6 md:text-right'
      }`}
    >
      {children}
    </div>
  )

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start ${className ?? ''}`}
    >
      {lado === 'izquierda' ? (
        <>
          {rotuloEl}
          {textoEl}
        </>
      ) : (
        <>
          {textoEl}
          {rotuloEl}
        </>
      )}
    </div>
  )
}
