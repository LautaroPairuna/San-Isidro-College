// src/lib/hooks.ts
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
 *
 *  Aquí asumimos el shape básico de tus entidades. Ajusta estos
 *  campos según lo que realmente tenga tu modelo GrupoMedios y Medio.
 * ---------------------------------------------------------------- */
export interface GrupoMedios {
  id: number
  nombre: string
  descripcion?: string
  creadoEn: string
  actualizadoEn: string
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
}

/* ------------------------------------------------------------------
 *  2) FUNCIONES GENÉRICAS DE FETCH
 * ---------------------------------------------------------------- */
async function fetchAll<T>(table: string): Promise<T[]> {
  const res = await fetch(`/api/admin/resources/${table}`)
  if (!res.ok) throw new Error(`Error al obtener datos de ${table}`)
  return res.json()
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
export function useMedios(grupoMediosId?: number) {
  return useQuery<Medio[], Error>({
    queryKey: ['Medio'],
    queryFn : () => fetchAll<Medio>('Medio'),
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
 *  5) Hook utilitario: cargar varios recursos por IDs
 * =================================================================*/
export function useResourcesByIds<T>(
  resource: string,
  ids: number[]
): {
  dataById  : Record<number, T | undefined>
  isLoading : boolean
  errorById : Record<number, Error | null>
} {
  const queries = useQueries({
    queries: ids.map(id => ({
      queryKey : [resource, id],
      queryFn  : () => fetchOne<T>(resource, id),
      enabled  : id != null,
    })),
  }) as UseQueryResult<T, Error>[]

  const dataById: Record<number, T | undefined> = {}
  const errorById: Record<number, Error | null> = {}
  let isLoading = false

  queries.forEach((q, idx) => {
    const id = ids[idx]
    dataById[id]  = q.data
    errorById[id] = q.error ?? null
    if (q.isLoading) isLoading = true
  })

  return { dataById, isLoading, errorById }
}
