// src/app/admin/resources/[tableName]/ResourceDetailClient.tsx
'use client'

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
  memo,
} from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'lodash.debounce'
import { format, parseISO } from 'date-fns'
import clsx from 'clsx'
import { toast } from 'react-hot-toast'
import { HiCheckCircle, HiXCircle, HiCalendar, HiPhotograph, HiChevronUp, HiChevronDown } from 'react-icons/hi'
import { FaPlus, FaTrash, FaPencilAlt, FaEye } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Image from 'next/image'
import FileDropZone from '@/components/ui/FileDropZone'
import { folderNames, toPublicImageUrl } from '@/lib/publicConstants'
import {
  useCreateGrupoMedios,
  useUpdateGrupoMedios,
  useDeleteGrupoMedios,
  useCreateMedio,
  useUpdateMedio,
  useDeleteMedio,
  useCreateSeccion,
  useUpdateSeccion,
  useDeleteSeccion,
  useGrupoMediosById,
  useGrupoMedios, // Para FKs
  useMedios,      // Para FKs
  usePaginatedResource,
  Seccion,
  GrupoMedios,
  Medio,
} from '@/lib/hooks'
import {
  GrupoMediosForm,
  GrupoMediosSchema,
  MedioForm,
  MedioSchema,
  SeccionForm,
  SeccionSchema,
} from '@/lib/schemas'

// -------------------------------
// Tipos para filas
// -------------------------------
// Usamos los tipos definidos en hooks.ts
type GrupoMediosType = GrupoMedios
type MedioType = Medio
type SeccionType = Seccion

// -------------------------------
// Opciones para enums
// -------------------------------
const OPCIONES_TIPO_GRUPO = [
  { value: 'CARRUSEL', label: 'CARRUSEL' },
  { value: 'GALERIA', label: 'GALERÍA' },
  { value: 'UNICO', label: 'ÚNICO' },
] as const

const OPCIONES_TIPO_MEDIO = [
  { value: 'IMAGEN', label: 'IMAGEN' },
  { value: 'VIDEO', label: 'VIDEO' },
  { value: 'ICONO', label: 'ICONO' },
] as const

const OPCIONES_TIPO_SECCION = [
  { value: 'MEDIA_UNICA', label: 'MEDIA ÚNICA' },
  { value: 'GALERIA', label: 'GALERÍA' },
  { value: 'TEXTO_RICO', label: 'TEXTO RICO' },
  { value: 'HERO', label: 'HERO' },
  { value: 'CUSTOM', label: 'CUSTOM' },
] as const

// -------------------------------
// Columnas ocultas y por defecto
// -------------------------------
const HIDDEN_COLUMNS: Record<string, string[]> = {
  GrupoMedios: [],
  Medio: ['grupoMediosId'],
  Seccion: ['propsJson', 'grupoId', 'medioId'],
}

const DEFAULT_COLUMNS: Record<string, string[]> = {
  GrupoMedios: ['id', 'nombre', 'tipoGrupo', 'creadoEn', 'actualizadoEn'],
  Medio: [
    'id',
    'urlArchivo',
    'urlMiniatura',
    'textoAlternativo',
    'tipo',
    'posicion',
    'creadoEn',
    'actualizadoEn',
  ],
  Seccion: [
    'id',
    'slug',
    'pagina',
    'orden',
    'tipo',
    'titulo',
    'creadoEn',
    'actualizadoEn',
  ],
}

// -------------------------------
// Relación padre-hijo
// -------------------------------
type Relation = {
  childTable: 'Medio'
  parentId: number
  foreignKey: 'grupoMediosId'
}

// -------------------------------
// Tipo para editRow
// -------------------------------
type EditRow =
  | { isNew: true; parentId: number | null; resource: 'GrupoMedios' | 'Medio' | 'Seccion' }
  | (GrupoMediosType & { resource: 'GrupoMedios' })
  | (MedioType & { resource: 'Medio' })
  | (SeccionType & { resource: 'Seccion' })

// -------------------------------
// Componente principal
// -------------------------------
export default function ResourceDetailClient({
  tableName,
}: {
  tableName: 'GrupoMedios' | 'Medio' | 'Seccion'
}) {
  // -----------------------------
  // Estado y hooks generales
  // -----------------------------
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [childRelation, setChildRelation] = useState<Relation | null>(null)
  const [detailRow, setDetailRow] = useState<GrupoMediosType | MedioType | SeccionType | null>(
    null
  )
  const [editRow, setEditRow] = useState<EditRow | null>(null)
  const [confirmItems, setConfirmItems] = useState<
    (GrupoMediosType | MedioType | SeccionType)[] | null
  >(null)
  const [selected, setSelected] = useState<number[]>([])
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  // Debounce para búsqueda
  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearch(val.toLowerCase())
        setPage(1)
      }, 300),
    []
  )

  useEffect(() => {
    debouncedSetSearch(searchInput)
  }, [searchInput, debouncedSetSearch])

  // -----------------------------
  // Datos Paginados (Server-Side)
  // -----------------------------
  const currentTable = childRelation ? childRelation.childTable : tableName

  const filters = useMemo(() => {
    if (childRelation) {
      return { [childRelation.foreignKey]: childRelation.parentId }
    }
    return undefined
  }, [childRelation])

  const {
    data: paginatedData,
    isLoading: loadingData,
    isFetching, // Agregamos isFetching para feedback visual en actualizaciones
    error: errorData,
    refetch,
  } = usePaginatedResource<GrupoMediosType | MedioType | SeccionType>(
    currentTable,
    page,
    pageSize,
    search,
    filters
  )

  const pageData = paginatedData?.data || []
  const totalPages = paginatedData?.meta.totalPages || 1

  // -----------------------------
  // Datos Auxiliares
  // -----------------------------
  
  // Padre para header drill-down
  const { data: parentRowData } = useGrupoMediosById(childRelation?.parentId || 0)
  const parentRow = parentRowData as GrupoMediosType | undefined

  // -----------------------------
  // Mutations (React Query)
  // -----------------------------
  const deleteGrupo = useDeleteGrupoMedios()
  const deleteMedio = useDeleteMedio()
  const deleteSeccion = useDeleteSeccion()

  // -----------------------------
  // Acciones CRUD
  // -----------------------------
  const handleSort = useCallback((column: string) => {
    console.log('Ordenando por:', column); // Log para depuración
    if (sortBy === column) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setOrder('asc')
    }
  }, [sortBy])

  const handleDelete = useCallback(
    (id: number) => {
      if (tableName === 'GrupoMedios') {
        deleteGrupo.mutate(id)
      } else if (tableName === 'Medio') {
        deleteMedio.mutate(id)
      } else if (tableName === 'Seccion') {
        deleteSeccion.mutate(id)
      }
      setConfirmItems(null)
      setSelected([])
    },
    [tableName, deleteGrupo, deleteMedio, deleteSeccion]
  )

  const handleViewChild = (row: GrupoMediosType) => {
    if (tableName === 'GrupoMedios') {
      setChildRelation({
        childTable: 'Medio',
        parentId: row.id,
        foreignKey: 'grupoMediosId',
      })
      setPage(1)
      setSelected([])
    }
  }

  const toggleSelect = useCallback((id: number) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    )
  }, [])

  const toggleSelectAll = useCallback(() => {
    const allIds = pageData.map((r) => r.id)
    setSelected((s) =>
      s.length === allIds.length ? [] : allIds
    )
  }, [pageData])

  // -----------------------------
  // Renderizado de celdas
  // -----------------------------
  const renderCell = useCallback(
    (val: unknown, col: string) => {
      if (val == null) return <span className="text-gray-400">null</span>
      if (col === 'urlArchivo' && typeof val === 'string' && val.trim() !== '') {
        return (
          <FotoCell
            fileName={val}
            tableName={tableName}
            childRelation={childRelation}
          />
        )
      }
      if (col === 'urlMiniatura' && typeof val === 'string' && val.trim() !== '') {
        return (
          <FotoCell
            fileName={val}
            tableName={tableName}
            childRelation={childRelation}
          />
        )
      }
      if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
        const fecha = parseISO(val)
        return (
          <div className="flex items-center text-sm text-gray-700">
            <HiCalendar className="h-4 w-4 text-blue-400 mr-1" />
            {format(fecha, 'dd/MM/yyyy')}
          </div>
        )
      }
      if (col === 'tipo' && val === 'VIDEO') {
        return (
          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
            VIDEO
          </span>
        )
      }
      if (typeof val === 'object') {
        const json = JSON.stringify(val)
        return (
          <div className="flex items-center text-sm text-gray-700">
            <HiPhotograph className="h-4 w-4 text-green-400 mr-1" />
            {json.length > 40 ? json.slice(0, 40) + '…' : json}
          </div>
        )
      }
      if (typeof val === 'boolean') {
        return val ? (
          <HiCheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <HiXCircle className="h-5 w-5 text-red-500" />
        )
      }
      const str = String(val)
      return (
        <span className="text-sm text-gray-700">
          {str.length > 50 ? str.slice(0, 50) + '…' : str}
        </span>
      )
    },
    [tableName, childRelation]
  )

  // -----------------------------
  // Columnas dinámicas
  // -----------------------------
  const rawColumns = useMemo<string[]>(() => Object.keys(pageData[0] ?? {}), [pageData])
  const visibleCols = useMemo<string[]>(() => {
    const hidden =
      HIDDEN_COLUMNS[childRelation ? childRelation.childTable : tableName] ?? []
    if (rawColumns.length > 0) {
      return rawColumns.filter((c) => !hidden.includes(c))
    }
    const base =
      DEFAULT_COLUMNS[childRelation ? childRelation.childTable : tableName] ?? ['id']
    return base.filter((c) => !hidden.includes(c))
  }, [rawColumns, tableName, childRelation])

  // -----------------------------
  // Estados auxiliares (detalle, edición)
  // -----------------------------

  const displayName =
    parentRow?.nombre || `${childRelation?.childTable} #${childRelation?.parentId}`

  // -----------------------------
  // Manejo de errores/carga
  // -----------------------------
  if (loadingData) {
    return <div className="p-4 text-gray-600">Cargando datos …</div>
  }
  if (errorData) {
    return <div className="p-4 text-red-500">Error al cargar datos</div>
  }

  const parentIsUnico = parentRow?.tipoGrupo === 'UNICO'
  const parentMedioCount = paginatedData?.meta.total || 0
  const forbidNewMedio = parentIsUnico && parentMedioCount >= 1

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">
          Gestión de {tableName === 'GrupoMedios' ? 'Grupos de Medios' : 'Medios'}
        </h1>
        <p className="text-sm text-gray-600">
          Aquí puedes crear, editar y eliminar registros.
        </p>
      </header>

      {childRelation && (
        <div className="mb-4 flex items-center space-x-4">
          <button
            onClick={() => {
              setChildRelation(null)
              setSelected([])
            }}
            className="text-indigo-600 hover:underline focus:outline-none"
          >
            ← Volver a Grupos de Medios
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Medios de “{displayName}”
          </h2>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between mb-4 space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (forbidNewMedio) return
                setDetailRow(null)
                setEditRow(
                  childRelation
                    ? {
                        isNew: true,
                        parentId: childRelation.parentId,
                        resource: 'Medio',
                      }
                    : { isNew: true, parentId: null, resource: 'GrupoMedios' }
                )
              }}
              disabled={forbidNewMedio}
              className={clsx(
                'flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition',
                forbidNewMedio && 'opacity-50 cursor-not-allowed'
              )}
              title={forbidNewMedio ? 'El grupo UNICO ya posee un medio' : 'Crear nuevo'}
            >
              <FaPlus className="mr-2" /> Nuevo
            </button>

            {selected.length > 0 && (
              <button
                onClick={() =>
                  setConfirmItems(
                    pageData.filter((r) => selected.includes(r.id))
                  )
                }
                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
              >
                <FaTrash className="mr-2" /> Eliminar ({selected.length})
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar..."
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n} filas
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className={clsx("overflow-x-auto relative", isFetching && "opacity-50 pointer-events-none")}>
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
               <div className="bg-white p-2 rounded shadow text-indigo-600 font-semibold">Cargando...</div>
            </div>
          )}
          {pageData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Sin resultados</div>
          ) : (
            <table key={`${sortBy}-${order}-${page}`} className="min-w-full divide-y divide-indigo-100">
              <thead className="sticky top-0 bg-indigo-600">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === pageData.length && pageData.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      aria-label="Seleccionar todos"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Acciones
                  </th>
                  {visibleCols.map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition select-none"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{col.replace(/([A-Z])/g, ' $1')}</span>
                        {sortBy === col && (
                          <span>
                            {order === 'asc' ? (
                              <HiChevronUp className="h-4 w-4" />
                            ) : (
                              <HiChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-indigo-100">
                {pageData.map((row) => (
                  <tr
                    key={row.id}
                    className="odd:bg-indigo-50 even:bg-white hover:bg-indigo-100 transition"
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => toggleSelect(row.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        aria-label={`Seleccionar fila ${row.id}`}
                      />
                    </td>

                    <td className="px-4 py-2 flex space-x-3 items-center justify-center">
                      <button
                        title="Ver"
                        onClick={() => {
                          setDetailRow(row)
                          setEditRow(null)
                          setConfirmItems(null)
                        }}
                        className="p-1 hover:text-indigo-600 transition"
                        aria-label={`Ver fila ${row.id}`}
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                      <button
                        title="Editar"
                        onClick={() => {
                          if (tableName === 'GrupoMedios') {
                            setEditRow({ ...(row as GrupoMediosType), resource: 'GrupoMedios' })
                          } else if (tableName === 'Seccion') {
                            setEditRow({ ...(row as SeccionType), resource: 'Seccion' })
                          } else {
                            setEditRow({ ...(row as MedioType), resource: 'Medio' })
                          }
                          setDetailRow(null)
                        }}
                        className="p-1 hover:text-indigo-600 transition"
                        aria-label={`Editar fila ${row.id}`}
                      >
                        <FaPencilAlt className="h-5 w-5" />
                      </button>

                      {tableName === 'GrupoMedios' && !childRelation && (
                        <button
                          title="Ver Medios"
                          onClick={() => handleViewChild(row as GrupoMediosType)}
                          className="p-1 hover:text-indigo-600 transition"
                          aria-label={`Ver medios de grupo ${row.id}`}
                        >
                          <HiPhotograph className="h-5 w-5" />
                        </button>
                      )}

                      <button
                        title="Eliminar"
                        onClick={() => setConfirmItems([row])}
                        className="p-1 hover:text-red-600 transition"
                        aria-label={`Eliminar fila ${row.id}`}
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </td>

                    {visibleCols.map((col) => (
                      <td
                        key={col}
                        className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 border-b border-indigo-100"
                      >
                        {renderCell((row as unknown as Record<string, unknown>)[col], col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación */}
        {pageData.length > 0 && (
          <footer className="flex items-center justify-between px-4 py-3 bg-indigo-50 border-t border-indigo-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-indigo-300 rounded disabled:opacity-50 hover:bg-indigo-100 transition"
              aria-label="Página anterior"
            >
              ‹
            </button>
            <span className="text-sm text-gray-700">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-indigo-300 rounded disabled:opacity-50 hover:bg-indigo-100 transition"
              aria-label="Página siguiente"
            >
              ›
            </button>
          </footer>
        )}
      </div>

      {/* Modal Detalle */}
      {detailRow && (
        <Modal
          title={`Detalle de ${
            tableName === 'GrupoMedios' ? 'Grupo' : 'Medio'
          } ${detailRow.id}`}
          onClose={() => setDetailRow(null)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(detailRow)
              .filter(
                ([, val]) =>
                  val == null || ['string', 'number', 'boolean'].includes(typeof val)
              )
              .map(([key, val]) => (
                <div key={key} className="flex">
                  <span className="font-semibold w-40 text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="text-gray-800">{String(val)}</span>
                </div>
              ))}

            {Object.entries(detailRow)
              .filter(([, val]) => val && typeof val === 'object')
              .map(([key, val]) => (
                <div key={key} className="md:col-span-2 border-t pt-4">
                  <button
                    onClick={() =>
                      setOpenSections((s) => ({ ...s, [key]: !s[key] }))
                    }
                    className="w-full flex justify-between items-center text-left text-gray-700 font-medium hover:text-gray-900"
                  >
                    <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span>{openSections[key] ? '▲' : '▼'}</span>
                  </button>
                  {openSections[key] && (
                    <div className="mt-3 text-gray-800 text-sm space-y-2">
                      {Array.isArray(val) &&
                        (val as unknown[]).length > 0 &&
                        typeof (val as unknown[])[0] === 'object' && (
                          <table className="w-full text-sm border-collapse">
                            <thead className="bg-indigo-100">
                              <tr>
                                {Object.keys((val as unknown[])[0] as Record<string, unknown>).map(
                                  (colKey, i) => (
                                    <th
                                      key={i}
                                      className="border px-2 py-1 text-left text-indigo-700"
                                    >
                                      {colKey.replace(/([A-Z])/g, ' $1')}
                                    </th>
                                  )
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {(val as unknown[]).map((rowObj, i) => (
                                <tr
                                  key={i}
                                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                  {Object.values(rowObj as Record<string, unknown>).map(
                                    (cell, j) => (
                                      <td key={j} className="border px-2 py-1">
                                        {String(cell)}
                                      </td>
                                    )
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                      {Array.isArray(val) &&
                        (val as unknown[]).every((e) =>
                          ['string', 'number', 'boolean'].includes(typeof e)
                        ) && (
                          <ul className="list-disc list-inside pl-4">
                            {(val as unknown[]).map((item, j) => (
                              <li key={j}>{String(item)}</li>
                            ))}
                          </ul>
                        )}

                      {!Array.isArray(val) && (
                        <dl className="space-y-1">
                          {Object.entries(val as Record<string, unknown>).map(
                            ([prop, cellVal]) => (
                              <div key={prop} className="flex">
                                <dt className="font-semibold w-36">
                                  {prop.replace(/([A-Z])/g, ' $1')}:
                                </dt>
                                <dd className="flex-1">{String(cellVal)}</dd>
                              </div>
                            )
                          )}
                        </dl>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Modal>
      )}

      {/* Modal Crear/Editar */}
      {editRow && (
        <FormModal
          tableName={tableName}
          initialData={editRow}
          parentId={childRelation?.parentId ?? null}
          currentCount={paginatedData?.meta.total || 0}
          onClose={() => setEditRow(null)}
        />
      )}

      {/* Modal Confirmación Eliminación */}
      {confirmItems && (
        <ConfirmModal
          items={confirmItems}
          onCancel={() => setConfirmItems(null)}
          onConfirm={() => confirmItems.forEach((it) => handleDelete(it.id))}
        />
      )}
    </div>
  )
}

// -------------------------------
// Componente FotoCell (preview)
// -------------------------------
type FotoCellProps = {
  fileName: string
  tableName: 'GrupoMedios' | 'Medio' | 'Seccion'
  childRelation: Relation | null
}

const FotoCell = memo(function FotoCell({
  fileName,
  tableName,
  childRelation,
}: FotoCellProps) {
  const tableKey = childRelation?.childTable ?? tableName
  if (tableKey === 'Seccion') return null

  const key = folderNames[tableKey as 'Medio' | 'GrupoMedios']
  const thumbSrc = `/images/${key}/thumbs/${fileName}`
  const fullSrc = `/images/${key}/${fileName}`

  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  const isVideo = ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)

  const [src, setSrc] = useState(isVideo ? fullSrc : thumbSrc)
  const [errored, setErrored] = useState(false)

  const handleError = () => {
    if (!isVideo && src === thumbSrc) setSrc(fullSrc)
    else setErrored(true)
  }

  if (errored) return <span className="text-xs text-gray-600 truncate">{fileName}</span>

  return (
    <div className="flex items-center space-x-2">
      {isVideo ? (
        <video
          src={src}
          width={64}
          height={48}
          muted
          loop
          playsInline
          className="rounded shadow object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={fileName}
          width={64}
          height={64}
          onError={handleError}
          className="rounded shadow object-cover"
        />
      )}
      <span className="text-xs text-gray-600 truncate" style={{ maxWidth: 100 }}>
        {fileName}
      </span>
    </div>
  )
})

// -------------------------------
// Modal reutilizable
// -------------------------------
type ModalProps = {
  title: string
  onClose: () => void
  children: ReactNode
}

const Modal = memo(function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden"
      >
        <header className="flex justify-between items-center px-6 py-3 bg-gray-100 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            ✕
          </button>
        </header>
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  )
})

// -------------------------------
// ConfirmModal para eliminar
// -------------------------------
type ConfirmModalProps = {
  items: (GrupoMediosType | MedioType | SeccionType)[]
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal = memo(function ConfirmModal({
  items,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal title="Confirmar eliminación" onClose={onCancel}>
      <p className="text-gray-700 mb-4">
        Vas a eliminar <span className="font-medium text-red-600">{items.length}</span> registro(s):
      </p>
      <ul className="list-disc list-inside max-h-40 overflow-y-auto border rounded p-4 bg-gray-50 mb-6">
        {items.map((it, idx) => (
          <li key={idx} className="text-gray-600">
            {'nombre' in it ? it.nombre : 'slug' in it ? it.slug : it.id}
          </li>
        ))}
      </ul>
      <div className="flex justify-end space-x-3">
        <ButtonBase onClick={onCancel}>Cancelar</ButtonBase>
        <ButtonBase variant="danger" onClick={onConfirm}>
          Eliminar
        </ButtonBase>
      </div>
    </Modal>
  )
})

// -------------------------------
// FormModal: creación y edición
// -------------------------------
type FormModalProps = {
  tableName: 'GrupoMedios' | 'Medio' | 'Seccion'
  initialData: EditRow
  parentId: number | null
  currentCount?: number
  onClose: () => void
}

const FormModal = memo(function FormModal({
  tableName,
  initialData,
  parentId,
  currentCount = 0,
  onClose,
}: FormModalProps) {
  const isNewMode = 'isNew' in initialData && initialData.isNew === true
  const isEditing = !isNewMode
  const qc = useQueryClient()

  // Hook para GrupoMedios
  const {
    register: registerGrupo,
    handleSubmit: handleSubmitGrupo,
    formState: { errors: errorsGrupo },
    control: controlGrupo,
  } = useForm<GrupoMediosForm>({
    resolver: zodResolver(GrupoMediosSchema),
    defaultValues:
      isEditing && 'resource' in initialData && initialData.resource === 'GrupoMedios'
        ? {
            nombre: (initialData as GrupoMediosType).nombre,
            tipoGrupo: (initialData as GrupoMediosType).tipoGrupo,
          }
        : {
            nombre: '',
            tipoGrupo: 'CARRUSEL',
          },
  })

  // Hook para Medio
  const {
    register: registerMedio,
    handleSubmit: handleSubmitMedio,
    control: controlMedio,
    formState: { errors: errorsMedio },
    setError: setErrorMedio,
  } = useForm<MedioForm>({
    resolver: zodResolver(MedioSchema),
    defaultValues:
      isEditing && 'resource' in initialData && initialData.resource === 'Medio'
        ? {
            urlArchivo: undefined,
            urlMiniatura: undefined,
            textoAlternativo: (initialData as MedioType).textoAlternativo ?? '',
            tipo: (initialData as MedioType).tipo,
            posicion: (initialData as MedioType).posicion,
            grupoMediosId: (initialData as MedioType).grupoMediosId,
          }
        : {
            urlArchivo: undefined,
            urlMiniatura: undefined,
            textoAlternativo: '',
            tipo: 'IMAGEN',
            posicion: 0,
            grupoMediosId: parentId ?? 0,
          },
  })

  // Hook para Seccion
  const {
    register: registerSeccion,
    handleSubmit: handleSubmitSeccion,
    control: controlSeccion,
    formState: { errors: errorsSeccion },
  } = useForm<SeccionForm>({
    resolver: zodResolver(SeccionSchema) as Resolver<SeccionForm>,
    defaultValues:
      isEditing && 'resource' in initialData && initialData.resource === 'Seccion'
        ? {
            slug: (initialData as SeccionType).slug,
            pagina: (initialData as SeccionType).pagina,
            orden: (initialData as SeccionType).orden,
            tipo: (initialData as SeccionType).tipo,
            titulo: (initialData as SeccionType).titulo ?? '',
            subtitulo: (initialData as SeccionType).subtitulo ?? '',
            grupoId: (initialData as SeccionType).grupoId,
            medioId: (initialData as SeccionType).medioId,
          }
        : {
            slug: '',
            pagina: 'home',
            orden: 0,
            tipo: 'MEDIA_UNICA',
            titulo: '',
            subtitulo: '',
            grupoId: null,
            medioId: null,
          },
  })

  // Hooks de mutación
  const createGrupoHook = useCreateGrupoMedios()
  const updateGrupoHook = useUpdateGrupoMedios(
    isEditing && 'resource' in initialData && initialData.resource === 'GrupoMedios'
      ? (initialData as GrupoMediosType).id
      : 0
  )
  const createMedioHook = useCreateMedio()
  const updateMedioHook = useUpdateMedio(
    isEditing && 'resource' in initialData && initialData.resource === 'Medio'
      ? (initialData as MedioType).id
      : 0
  )
  const createSeccionHook = useCreateSeccion()
  const updateSeccionHook = useUpdateSeccion(
    isEditing && 'resource' in initialData && initialData.resource === 'Seccion'
      ? (initialData as SeccionType).id
      : 0
  )

  // Datos de FK (grupos para el select en medio y seccion)
  const { data: gruposFK = [] } = useGrupoMedios()

  // Datos de FK (medios para el select en seccion)
  const { data: mediosFK = [] } = useMedios()

  // Submit GrupoMedios
  const onSubmitGrupo: SubmitHandler<GrupoMediosForm> = (data) => {
    if (isEditing && 'resource' in initialData && initialData.resource === 'GrupoMedios') {
      updateGrupoHook.mutate(data, {
        onSuccess: () => {
          toast.success('Grupo actualizado')
          onClose()
          qc.invalidateQueries({ queryKey: ['GrupoMedios'] })
        },
        onError: () => {
          toast.error('Error al actualizar grupo')
        },
      })
    } else {
      createGrupoHook.mutate(data, {
        onSuccess: () => {
          toast.success('Grupo creado')
          onClose()
          qc.invalidateQueries({ queryKey: ['GrupoMedios'] })
        },
        onError: () => {
          toast.error('Error al crear grupo')
        },
      })
    }
  }

  // Construir FormData para Medio
  const buildMedioFormData = (values: MedioForm) => {
    const fd = new FormData()
    if (values.nombreArchivo) {
      fd.append('nombreArchivo', values.nombreArchivo)
    }
    if (values.urlArchivo) fd.append('urlArchivo', values.urlArchivo)
    if (values.urlMiniatura) fd.append('urlMiniatura', values.urlMiniatura)
    fd.append('textoAlternativo', values.textoAlternativo ?? '')
    fd.append('tipo', values.tipo)
    fd.append('posicion', String(values.posicion))
    fd.append('grupoMediosId', String(values.grupoMediosId))
    return fd
  }

  // Submit Medio
  const onSubmitMedio: SubmitHandler<MedioForm> = async (data) => {
    // 0️⃣ Validación manual: Archivo requerido en creación
    if (isNewMode && !data.urlArchivo) {
      setErrorMedio('urlArchivo', {
        type: 'manual',
        message: 'Selecciona un archivo (imagen o video)',
      })
      return
    }

    // 1️⃣ Validación “UNICO”
    const grupoSel = gruposFK.find((g) => g.id === data.grupoMediosId)
    if (grupoSel?.tipoGrupo === 'UNICO') {
      // Si estamos insertando en el mismo padre del que venimos, usamos currentCount
      // De lo contrario, confiamos en la validación del servidor
      if (parentId === data.grupoMediosId) {
        if (isNewMode && currentCount >= 1) {
          toast.error('Este grupo es de tipo UNICO y ya contiene un medio')
          return
        }
      }
    }

    // 2️⃣ Construir FormData y disparar la mutación
    const formData = buildMedioFormData(data)

    try {
      if (isEditing && 'resource' in initialData && initialData.resource === 'Medio') {
        await updateMedioHook.mutateAsync(formData)
        toast.success('Medio actualizado')
      } else {
        await createMedioHook.mutateAsync(formData)
        toast.success('Medio creado')
      }
      qc.invalidateQueries({ queryKey: ['Medio'] })
      onClose()
    } catch (error) {
      console.error(error)
      toast.error(isEditing ? 'Error al actualizar medio' : 'Error al crear medio')
    }
  }

  // Submit Seccion
  const onSubmitSeccion: SubmitHandler<SeccionForm> = (data) => {
    if (isEditing && 'resource' in initialData && initialData.resource === 'Seccion') {
      updateSeccionHook.mutate(data, {
        onSuccess: () => {
          toast.success('Sección actualizada')
          onClose()
          qc.invalidateQueries({ queryKey: ['Seccion'] })
        },
        onError: () => {
          toast.error('Error al actualizar sección')
        },
      })
    } else {
      createSeccionHook.mutate(data, {
        onSuccess: () => {
          toast.success('Sección creada')
          onClose()
          qc.invalidateQueries({ queryKey: ['Seccion'] })
        },
        onError: () => {
          toast.error('Error al crear sección')
        },
      })
    }
  }

  return (
    <Modal
      title={`${isNewMode ? 'Crear' : 'Editar'} ${
        tableName === 'GrupoMedios' ? 'Grupo de Medios' : tableName === 'Medio' ? 'Medio' : 'Sección'
      }`}
      onClose={onClose}
    >
      {tableName === 'GrupoMedios' ? (
        <form
          onSubmit={handleSubmitGrupo(onSubmitGrupo)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Nombre */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Nombre</label>
            <InputBase {...registerGrupo('nombre')} placeholder="Nombre del grupo" />
            {errorsGrupo.nombre && (
              <p className="text-red-600 text-sm">{errorsGrupo.nombre.message}</p>
            )}
          </div>

          {/* TipoGrupo */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Tipo Grupo</label>
            <Controller
              control={controlGrupo}
              name="tipoGrupo"
              render={({ field }) => (
                <SelectBase {...field}>
                  <option value="">— Selecciona —</option>
                  {OPCIONES_TIPO_GRUPO.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </SelectBase>
              )}
            />
            {errorsGrupo.tipoGrupo && (
              <p className="text-red-600 text-sm">{errorsGrupo.tipoGrupo.message}</p>
            )}
          </div>

          {/* Botón Guardar */}
          <div className="md:col-span-2 flex justify-end">
            <ButtonBase type="submit">{isNewMode ? 'Guardar' : 'Actualizar'}</ButtonBase>
          </div>
        </form>
      ) : tableName === 'Medio' ? (
        <form
          onSubmit={handleSubmitMedio(onSubmitMedio)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* GrupoMediosId */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Grupo de Medios</label>
            <Controller
              control={controlMedio}
              name="grupoMediosId"
              render={({ field }) => {
                if (parentId !== null) {
                  return (
                    <>
                      <input type="hidden" {...field} value={parentId} />
                      <SelectBase disabled className="bg-gray-100 text-gray-600 cursor-not-allowed">
                        <option value={parentId}>
                          {gruposFK.find((g) => g.id === parentId)?.nombre ??
                            `Grupo ${parentId}`}
                        </option>
                      </SelectBase>
                    </>
                  )
                }
                return (
                  <SelectBase
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <option value="">— Selecciona —</option>
                    {gruposFK.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nombre}
                      </option>
                    ))}
                  </SelectBase>
                )
              }}
            />
            {errorsMedio.grupoMediosId && (
              <p className="text-red-600 text-sm">{errorsMedio.grupoMediosId.message}</p>
            )}
          </div>

          {/* Nombre */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Nombre</label>
            <InputBase
              {...registerMedio('nombreArchivo')}
              placeholder="Nombre personalizado para el archivo"
            />
            {errorsMedio.nombreArchivo && (
              <p className="text-red-600 text-sm">{errorsMedio.nombreArchivo.message}</p>
            )}
          </div>

          {/* urlArchivo (file + preview) */}
          <div className="flex flex-col h-full">
            <label className="mb-1 text-gray-700 font-medium">Archivo</label>
            <Controller
              control={controlMedio}
              name="urlArchivo"
              render={({ field }) => (
                <FileDropZone
                  className="flex-1"
                  onFileSelected={field.onChange}
                  currentSrc={
                    isEditing ? toPublicImageUrl('medios', (initialData as MedioType).urlArchivo) : undefined
                  }
                  currentTipo={isEditing ? (initialData as MedioType).tipo : undefined}
                />
              )}
            />
            {errorsMedio.urlArchivo && (
              <p className="text-red-600 text-sm">{errorsMedio.urlArchivo.message}</p>
            )}
          </div>

          {/* urlMiniatura (file + preview) */}
          <div className="flex flex-col h-full">
            <label className="mb-1 text-gray-700 font-medium">Miniatura</label>
            <Controller
              control={controlMedio}
              name="urlMiniatura"
              render={({ field }) => (
                <FileDropZone
                  className="flex-1"
                  onFileSelected={field.onChange}
                  currentSrc={
                    isEditing ? toPublicImageUrl('medios', (initialData as MedioType).urlMiniatura || '') : undefined
                  }
                  currentTipo="IMAGEN"
                  allowedTypes={['IMAGEN']}
                />
              )}
            />
            {errorsMedio.urlMiniatura && (
              <p className="text-red-600 text-sm">{errorsMedio.urlMiniatura.message}</p>
            )}
          </div>

          {/* textoAlternativo */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Texto Alternativo</label>
            <InputBase
              {...registerMedio('textoAlternativo')}
              placeholder="Texto alternativo (opcional)"
            />
            {errorsMedio.textoAlternativo && (
              <p className="text-red-600 text-sm">{errorsMedio.textoAlternativo.message}</p>
            )}
          </div>

          {/* tipo */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Tipo Medio</label>
            <Controller
              control={controlMedio}
              name="tipo"
              render={({ field }) => (
                <SelectBase {...field}>
                  <option value="">— Selecciona —</option>
                  {OPCIONES_TIPO_MEDIO.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </SelectBase>
              )}
            />
            {errorsMedio.tipo && (
              <p className="text-red-600 text-sm">{errorsMedio.tipo.message}</p>
            )}
          </div>

          {/* posicion */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Posición</label>
            <Controller
              control={controlMedio}
              name="posicion"
              render={({ field }) => (
                <InputBase
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errorsMedio.posicion && (
              <p className="text-red-600 text-sm">{errorsMedio.posicion.message}</p>
            )}
          </div>

          {/* Botón Guardar */}
          <div className="md:col-span-2 flex justify-end">
            <ButtonBase type="submit">{isNewMode ? 'Guardar' : 'Actualizar'}</ButtonBase>
          </div>
        </form>
      ) : (
        /* --------------------------
         * FORM SECCION
         * -------------------------- */
        <form
          onSubmit={handleSubmitSeccion(onSubmitSeccion)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Slug */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Slug (ID único)</label>
            <InputBase {...registerSeccion('slug')} placeholder="ej: home-hero-principal" />
            {errorsSeccion.slug && (
              <p className="text-red-600 text-sm">{errorsSeccion.slug.message}</p>
            )}
          </div>

          {/* Pagina */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Página</label>
            <InputBase {...registerSeccion('pagina')} placeholder="ej: home, academicos, contacto" />
            {errorsSeccion.pagina && (
              <p className="text-red-600 text-sm">{errorsSeccion.pagina.message}</p>
            )}
          </div>

          {/* Orden */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Orden</label>
            <InputBase
              type="number"
              min={0}
              {...registerSeccion('orden')}
            />
            {errorsSeccion.orden && (
              <p className="text-red-600 text-sm">{errorsSeccion.orden.message}</p>
            )}
          </div>

          {/* Tipo Seccion */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Tipo</label>
            <Controller
              control={controlSeccion}
              name="tipo"
              render={({ field }) => (
                <SelectBase {...field}>
                  {OPCIONES_TIPO_SECCION.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </SelectBase>
              )}
            />
            {errorsSeccion.tipo && (
              <p className="text-red-600 text-sm">{errorsSeccion.tipo.message}</p>
            )}
          </div>

          {/* Titulo */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Título (Opcional)</label>
            <InputBase {...registerSeccion('titulo')} placeholder="Título de la sección" />
          </div>

          {/* Subtitulo */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Subtítulo (Opcional)</label>
            <InputBase {...registerSeccion('subtitulo')} placeholder="Subtítulo de la sección" />
          </div>

          {/* Grupo ID */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Grupo de Medios (Opcional)</label>
            <Controller
              control={controlSeccion}
              name="grupoId"
              render={({ field }) => (
                <SelectBase
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">— Ninguno —</option>
                  {gruposFK.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre} ({g.tipoGrupo})
                    </option>
                  ))}
                </SelectBase>
              )}
            />
          </div>

          {/* Medio ID */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Medio Único (Opcional)</label>
            <Controller
              control={controlSeccion}
              name="medioId"
              render={({ field }) => (
                <SelectBase
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">— Ninguno —</option>
                  {mediosFK.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombreArchivo || m.urlArchivo}
                    </option>
                  ))}
                </SelectBase>
              )}
            />
          </div>

          {/* Botón Guardar */}
          <div className="md:col-span-2 flex justify-end">
            <ButtonBase type="submit">{isNewMode ? 'Guardar' : 'Actualizar'}</ButtonBase>
          </div>
        </form>
      )}
    </Modal>
  )
})

// -------------------------------
// Componentes base reutilizables
// -------------------------------

// ButtonBase
type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'danger'
}

const ButtonBase = memo(function ButtonBase({
  variant = 'default',
  children,
  className,
  ...props
}: ButtonBaseProps) {
  return (
    <button
      {...props}
      className={clsx(
        'px-6 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-indigo-500',
        {
          'bg-indigo-600 hover:bg-indigo-700 text-white': variant === 'default',
          'bg-red-500 hover:bg-red-600 text-white': variant === 'danger',
        },
        className
      )}
    >
      {children}
    </button>
  )
})

// InputBase
type InputBaseProps = React.InputHTMLAttributes<HTMLInputElement>

const InputBase = memo(function InputBase(props: InputBaseProps) {
  return (
    <input
      {...props}
      className={clsx(
        'px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400',
        props.className
      )}
    />
  )
})

// SelectBase
type SelectBaseProps = React.SelectHTMLAttributes<HTMLSelectElement>

const SelectBase = memo(function SelectBase(props: SelectBaseProps) {
  return (
    <select
      {...props}
      className={clsx(
        'px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400',
        props.className
      )}
    />
  )
})
