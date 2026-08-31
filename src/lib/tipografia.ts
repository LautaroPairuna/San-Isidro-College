// src/lib/tipografia.ts

/**
 * Tamaños de títulos y subtítulos de las páginas de contenido (niveles,
 * Experiencia SIC y El Colegio).
 *
 * Estaban escritos a mano en cada página y habían quedado desparejos: la misma
 * clase de título aparecía como `text-xl` en una sección y `text-2xl lg:text-3xl`
 * en otra. Al vivir acá, cambiar la escala es tocar un solo lugar.
 */

/** Título que abre la página (h1). */
export const TITULO_PAGINA = 'text-3xl lg:text-4xl font-bold text-[#294161] leading-tight'

/** Bajada dorada que va debajo del título de la página. */
export const BAJADA_PAGINA = 'text-base font-bold text-[#c19516]'

/** Título dorado de cada sección (h2), incluido el rótulo de BloqueRotulo. */
export const TITULO_SECCION = 'text-xl font-bold text-[#c19516]'

/** Título de las tarjetas y cuadros; el color lo pone cada página. */
export const TITULO_TARJETA = 'text-lg font-bold leading-tight'

/** Título de los bloques compartidos que cierran las páginas (Niveles educativos, etc.). */
export const TITULO_BLOQUE = 'text-2xl font-bold text-[#294161]'
