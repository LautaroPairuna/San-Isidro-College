import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query'

/* ------------------------------------------------------------------
 *  1) DEFINIR TIPOS EXPLÍCITOS
 * ---------------------------------------------------------------- */
export interface GrupoMedios {
  id: number
  nombre: string
  descripcion?: string
  tipoGrupo: 'CARRUSEL' | 'GALERIA' | 'UNICO'
  creadoEn: string
  actualizadoEn: string
  // Relación inversa (opcional en listados, presente en detalles/page-content)
  medios?: Medio[]
}

export interface Medio {
  id: number
  urlArchivo: string
  urlMiniatura?: string | null
  textoAlternativo?: string | null
  tipo: 'IMAGEN' | 'VIDEO' | 'ICONO'
  posicion: number
  grupoMediosId: number
  creadoEn: string
  actualizadoEn: string
  nombreArchivo?: string
}

export interface Seccion {
  id: number
  slug: string
  pagina: string
  orden: number
  tipo: 'MEDIA_UNICA' | 'GALERIA' | 'TEXTO_RICO' | 'HERO' | 'CUSTOM'
  titulo?: string | null
  subtitulo?: string | null
  descripcion?: string | null
  urlBoton?: string | null
  textoBoton?: string | null
  grupoId?: number | null
  medioId?: number | null
  propsJson?: any
  creadoEn: string
  actualizadoEn: string
  // Relaciones (presentes en /api/public/page-content)
  grupo?: GrupoMedios | null
  medio?: Medio | null
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

/* ------------------------------------------------------------------
 *  2) FUNCIONES GENÉRICAS DE FETCH
 * ---------------------------------------------------------------- */
async function fetchAll<T>(table: string): Promise<T[]> {
  // Por defecto pedimos un límite alto para mantener comportamiento "fetch all"
  // en los clientes que esperan un array completo.
  // El backend ahora devuelve { data: T[], meta: ... }
  const res = await fetch(`/api/admin/resources/${table}?limit=10000`)
  if (!res.ok) throw new Error(`Error al obtener datos de ${table}`)
  
  const json = await res.json()
  // Si el backend devuelve estructura paginada, extraemos data.
  // Si devolviera array directo (legacy), lo devolvemos tal cual.
  if (json && typeof json === 'object' && 'data' in json && Array.isArray(json.data)) {
    return json.data
  }
  return json as T[]
}

export async function fetchPaginated<T>(
  table: string,
  page: number,
  limit: number,
  search?: string,
  filters?: Record<string, any>,
  sortBy?: string,
  order: 'asc' | 'desc' = 'desc'
): Promise<PaginatedResponse<T>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    order,
    _t: Date.now().toString(),
  })
  if (sortBy) params.set('sortBy', sortBy)
  if (search) params.set('search', search)
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        params.set(key, String(val))
      }
    })
  }

  const res = await fetch(`/api/admin/resources/${table}?${params.toString()}`)
  if (!res.ok) throw new Error(`Error al obtener datos paginados de ${table}`)
  return res.json()
}

export function usePaginatedResource<T>(
  table: string,
  page: number,
  limit: number,
  search: string,
  filters?: Record<string, any>,
  sortBy?: string,
  order: 'asc' | 'desc' = 'desc',
  options?: { enabled?: boolean }
) {
  return useQuery<PaginatedResponse<T>, Error>({
    queryKey: [table, 'paginated', { page, limit, search, ...filters, sortBy, order }],
    queryFn: () => fetchPaginated<T>(table, page, limit, search, filters, sortBy, order),
    enabled: options?.enabled !== false,
    // placeholderData: keepPreviousData // Se debe importar de @tanstack/react-query si es v5
  })
}

async function fetchOne<T>(table: string, id: number | string): Promise<T> {
  const res = await fetch(`/api/admin/resources/${table}/${id}`)
  if (!res.ok) throw new Error(`Error al obtener ${table}/${id}`)
  return res.json()
}

/* ==================================================================
 *  3) HOOKS PARA GRUPO MEDIOS
 * =================================================================*/
export function useGrupoMedios() {
  return useQuery<GrupoMedios[], Error>({
    queryKey: ['GrupoMedios'],
    queryFn : () => fetchAll<GrupoMedios>('GrupoMedios'),
  })
}

export function useGrupoMediosById(id: number | string) {
  return useQuery<GrupoMedios, Error>({
    queryKey: ['GrupoMedios', id],
    queryFn : () => fetchOne<GrupoMedios>('GrupoMedios', id),
    enabled : Boolean(id),
  })
}

export function useCreateGrupoMedios(): UseMutationResult<
  GrupoMedios,
  Error,
  Partial<GrupoMedios>
> {
  const qc = useQueryClient()
  return useMutation<GrupoMedios, Error, Partial<GrupoMedios>>({
    mutationFn: data =>
      fetch('/api/admin/resources/GrupoMedios', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(data),
      }).then(async res => {
        if (!res.ok) throw new Error('Error al crear GrupoMedios')
        return res.json() as Promise<GrupoMedios>
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['GrupoMedios'] }),
  })
}

export function useUpdateGrupoMedios(
  id: number
): UseMutationResult<GrupoMedios, Error, Partial<GrupoMedios>> {
  const qc = useQueryClient()
  return useMutation<GrupoMedios, Error, Partial<GrupoMedios>>({
    mutationFn: data =>
      fetch(`/api/admin/resources/GrupoMedios/${id}`, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(data),
      }).then(async res => {
        if (!res.ok) throw new Error('Error al actualizar GrupoMedios')
        return res.json() as Promise<GrupoMedios>
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['GrupoMedios'] }),
  })
}

export function useDeleteGrupoMedios(): UseMutationResult<unknown, Error, number> {
  const qc = useQueryClient()
  return useMutation<unknown, Error, number>({
    mutationFn: id =>
      fetch(`/api/admin/resources/GrupoMedios/${id}`, { method: 'DELETE' }).then(
        async res => {
          if (!res.ok) throw new Error('Error al eliminar GrupoMedios')
          return res.json() as Promise<unknown>
        }
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['GrupoMedios'] }),
  })
}

/* ==================================================================
 *  4) HOOKS PARA MEDIO
 * =================================================================*/
export function useMedios(grupoMediosId?: number, options?: { enabled?: boolean }) {
  return useQuery<Medio[], Error>({
    queryKey: ['Medio'],
    queryFn : () => fetchAll<Medio>('Medio'),
    enabled : options?.enabled !== false,
    select  : data =>
      typeof grupoMediosId === 'number'
        ? data.filter(m => m.grupoMediosId === grupoMediosId)
        : data,
  })
}

export function useMedioById(id: number | string) {
  return useQuery<Medio, Error>({
    queryKey: ['Medio', id],
    queryFn : () => fetchOne<Medio>('Medio', id),
    enabled : Boolean(id),
  })
}

export function useCreateMedio(): UseMutationResult<Medio, Error, FormData> {
  const qc = useQueryClient()
  return useMutation<Medio, Error, FormData>({
    mutationFn: formData =>
      fetch('/api/admin/resources/Medio', {
        method: 'POST',
        body  : formData,
      }).then(async res => {
        if (!res.ok) throw new Error('Error al crear Medio')
        return res.json() as Promise<Medio>
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['Medio'] }),
  })
}

export function useUpdateMedio(
  id: number
): UseMutationResult<Medio, Error, FormData> {
  const qc = useQueryClient()
  return useMutation<Medio, Error, FormData>({
    mutationFn: formData =>
      fetch(`/api/admin/resources/Medio/${id}`, {
        method: 'PUT',
        body  : formData,
      }).then(async res => {
        if (!res.ok) throw new Error('Error al actualizar Medio')
        return res.json() as Promise<Medio>
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['Medio'] }),
  })
}

export function useDeleteMedio(): UseMutationResult<unknown, Error, number> {
  const qc = useQueryClient()
  return useMutation<unknown, Error, number>({
    mutationFn: id =>
      fetch(`/api/admin/resources/Medio/${id}`, { method: 'DELETE' }).then(
        async res => {
          if (!res.ok) throw new Error('Error al eliminar Medio')
          return res.json() as Promise<unknown>
        }
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['Medio'] }),
  })
}

/* ==================================================================
 *  5) HOOKS PARA SECCION
 * =================================================================*/
export function useSecciones() {
  return useQuery<Seccion[], Error>({
    queryKey: ['Seccion'],
    queryFn : () => fetchAll<Seccion>('Seccion'),
  })
}

export function useSeccionById(id: number | string) {
  return useQuery<Seccion, Error>({
    queryKey: ['Seccion', id],
    queryFn : () => fetchOne<Seccion>('Seccion', id),
    enabled : Boolean(id),
  })
}

export function useCreateSeccion(): UseMutationResult<Seccion, Error, Partial<Seccion>> {
  const qc = useQueryClient()
  return useMutation<Seccion, Error, Partial<Seccion>>({
    mutationFn: data =>
      fetch('/api/admin/resources/Seccion', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(data),
      }).then(async res => {
        if (!res.ok) throw new Error('Error al crear Seccion')
        return res.json() as Promise<Seccion>
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['Seccion'] }),
  })
}

export function useUpdateSeccion(
  id: number
): UseMutationResult<Seccion, Error, Partial<Seccion>> {
  const qc = useQueryClient()
  return useMutation<Seccion, Error, Partial<Seccion>>({
    mutationFn: data =>
      fetch(`/api/admin/resources/Seccion/${id}`, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(data),
      }).then(async res => {
        if (!res.ok) throw new Error('Error al actualizar Seccion')
        return res.json() as Promise<Seccion>
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['Seccion'] }),
  })
}

export function useDeleteSeccion(): UseMutationResult<unknown, Error, number> {
  const qc = useQueryClient()
  return useMutation<unknown, Error, number>({
    mutationFn: id =>
      fetch(`/api/admin/resources/Seccion/${id}`, { method: 'DELETE' }).then(
        async res => {
          if (!res.ok) throw new Error('Error al eliminar Seccion')
          return res.json() as Promise<unknown>
        }
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['Seccion'] }),
  })
}

/* ==================================================================
 *  6) HOOKS PÚBLICOS
 * =================================================================*/
export function usePageContent(slug: string) {
  return useQuery<Seccion[], Error>({
    queryKey: ['page-content', slug],
    queryFn: () => fetch(`/api/public/page-content?slug=${slug}`).then(res => {
        if (!res.ok) throw new Error('Error fetching page content')
        return res.json()
    }),
    enabled: !!slug
  })
}
