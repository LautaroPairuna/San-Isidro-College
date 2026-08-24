'use client'

import clsx from 'clsx'
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi'

/** Páginas visibles alrededor de la actual, sin contar la primera y la última. */
const VECINAS = 2

/**
 * Arma la lista de páginas a mostrar: siempre la primera y la última, las
 * vecinas de la actual, y puntos suspensivos donde se saltan páginas.
 *
 * Con pocas páginas devuelve todas; recién a partir de 8 empieza a recortar,
 * así la fila no cambia de ancho todo el tiempo.
 */
function armarPaginas(paginaActual: number, totalPaginas: number): (number | 'salto')[] {
  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1)
  }

  const paginas = new Set<number>([1, totalPaginas, paginaActual])
  for (let i = 1; i <= VECINAS; i++) {
    if (paginaActual - i > 1) paginas.add(paginaActual - i)
    if (paginaActual + i < totalPaginas) paginas.add(paginaActual + i)
  }

  // Cerca de los extremos no hay vecinas de un lado, así que se completan del
  // otro: la fila mantiene siempre la misma cantidad de números.
  if (paginaActual <= VECINAS + 2) [2, 3, 4, 5].forEach((n) => paginas.add(n))
  if (paginaActual >= totalPaginas - VECINAS - 1) {
    for (let n = totalPaginas - 4; n < totalPaginas; n++) paginas.add(n)
  }

  const ordenadas = [...paginas].filter((n) => n >= 1 && n <= totalPaginas).sort((a, b) => a - b)

  const conSaltos: (number | 'salto')[] = []
  ordenadas.forEach((numero, i) => {
    if (i > 0 && numero - ordenadas[i - 1]! > 1) conSaltos.push('salto')
    conSaltos.push(numero)
  })
  return conSaltos
}

/**
 * Los estilos van separados por estado y no encimados con clsx: `bg-white` y
 * `bg-brand-600` son las dos utilidades del mismo tipo, y cual gana lo decide el
 * orden en la hoja generada, no el orden en el string. Encimándolas, el botón de
 * la página actual salía blanco con el número invisible.
 */
const BOTON_BASE =
  'flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40'
const BOTON_NORMAL =
  'border-brand-200 bg-white text-gray-700 hover:bg-brand-100 disabled:hover:bg-white'
const BOTON_ACTUAL = 'border-brand-600 bg-brand-600 font-semibold text-white hover:bg-brand-700'

/**
 * Paginación de las tablas del admin: cuántos registros se están viendo, los
 * números de página con saltos y los saltos al principio y al final.
 */
export default function PaginacionTabla({
  pagina,
  totalPaginas,
  total,
  porPagina,
  onCambiar,
}: {
  pagina: number
  totalPaginas: number
  /** Total de registros, para el "mostrando X-Y de Z". */
  total: number
  porPagina: number
  onCambiar: (pagina: number) => void
}) {
  if (totalPaginas <= 0) return null

  const desde = total === 0 ? 0 : (pagina - 1) * porPagina + 1
  const hasta = Math.min(pagina * porPagina, total)
  const paginas = armarPaginas(pagina, totalPaginas)

  const ir = (destino: number) => onCambiar(Math.min(Math.max(destino, 1), totalPaginas))

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col gap-3 border-t border-brand-200 bg-brand-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-gray-600" aria-live="polite">
        Mostrando <span className="font-semibold text-gray-800">{desde}</span>
        {'–'}
        <span className="font-semibold text-gray-800">{hasta}</span> de{' '}
        <span className="font-semibold text-gray-800">{total}</span>{' '}
        {total === 1 ? 'registro' : 'registros'}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => ir(1)}
          disabled={pagina === 1}
          className={clsx(BOTON_BASE, BOTON_NORMAL)}
          aria-label="Primera página"
          title="Primera página"
        >
          <HiChevronDoubleLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => ir(pagina - 1)}
          disabled={pagina === 1}
          className={clsx(BOTON_BASE, BOTON_NORMAL)}
          aria-label="Página anterior"
          title="Página anterior"
        >
          <HiChevronLeft className="h-4 w-4" />
        </button>

        {paginas.map((numero, i) =>
          numero === 'salto' ? (
            <span
              key={`salto-${i}`}
              aria-hidden="true"
              className="flex h-9 w-6 items-center justify-center text-sm text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={numero}
              type="button"
              onClick={() => ir(numero)}
              aria-label={`Página ${numero}`}
              aria-current={numero === pagina ? 'page' : undefined}
              className={clsx(BOTON_BASE, numero === pagina ? BOTON_ACTUAL : BOTON_NORMAL)}
            >
              {numero}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => ir(pagina + 1)}
          disabled={pagina === totalPaginas}
          className={clsx(BOTON_BASE, BOTON_NORMAL)}
          aria-label="Página siguiente"
          title="Página siguiente"
        >
          <HiChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => ir(totalPaginas)}
          disabled={pagina === totalPaginas}
          className={clsx(BOTON_BASE, BOTON_NORMAL)}
          aria-label="Última página"
          title="Última página"
        >
          <HiChevronDoubleRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}
