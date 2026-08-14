import Image from 'next/image'

/**
 * Trazo punteado decorativo que acompaña el fondo de Colegio y Académicos.
 *
 * El SVG mide 1660x3410 y está pensado para pantallas de 1920px, así que el
 * ancho va en vw (1600/1920 = 83.33vw) para que escale con la pantalla en vez
 * de quedar fijo.
 *
 * El trazo es una serpentina continua: a ese ancho sus curvas internas caen
 * sobre la columna de texto. Por eso se enmascara la franja central —queda
 * visible solo en los márgenes, como en el diseño— sin tocar el SVG.
 *
 * Va al final del contenedor y sin z-index propio: así queda por encima de las
 * franjas de color de las secciones, pero por debajo del contenido, que se
 * apoya en `relative z-10`.
 */

/** Mitad del ancho oculto. El max() evita que el trazo invada el texto en pantallas chicas. */
const BAND = 'max(24vw, 420px)'
/** Desvanecido a cada lado de la franja oculta, para que el corte no se note. */
const FEATHER = '90px'

const MASK = [
  'linear-gradient(to right',
  '#000 0',
  `#000 calc(50% - ${BAND} - ${FEATHER})`,
  `transparent calc(50% - ${BAND})`,
  `transparent calc(50% + ${BAND})`,
  `#000 calc(50% + ${BAND} + ${FEATHER})`,
  '#000 100%)',
].join(', ')

export default function FondoFormaSeccion({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 flex justify-center ${className ?? ''}`}
    >
      <Image
        src="/images/forma-seccion-1.svg"
        alt=""
        width={1660}
        height={3410}
        className="w-[90vw] max-w-none h-auto"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}
      />
    </div>
  )
}
