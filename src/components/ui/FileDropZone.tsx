'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'
import { HiCloudUpload, HiTrash, HiPhotograph, HiFilm } from 'react-icons/hi'
import { MAX_IMG_SIZE_MB, MAX_VIDEO_SIZE_MB } from '@/lib/schemas'

interface Props {
  onFileSelected: (file: File | null) => void
  currentSrc?: string
  currentTipo?: 'IMAGEN' | 'VIDEO' | 'ICONO'
  allowedTypes?: ('IMAGEN' | 'VIDEO')[]
  className?: string
}

export default function FileDropZone({
  onFileSelected,
  currentSrc,
  currentTipo,
  allowedTypes = ['IMAGEN', 'VIDEO'],
  className,
}: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(currentSrc ?? null)
  const [error, setError] = useState<string | null>(null)

  /* ───────── Manejo drag&drop ───────── */
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (!accepted.length) return
      const f = accepted[0]

      /* Validar tamaño y MIME */
      const isVideo = f.type.startsWith('video/')
      const isImage = f.type.startsWith('image/')
      const maxBytes = (isVideo ? MAX_VIDEO_SIZE_MB * 1024 * 1024 * 1024 : MAX_IMG_SIZE_MB * 1024 * 1024)

      /* 1. Validar tipo permitido en general */
      if (!isVideo && !isImage) {
        setError('Solo se admiten imágenes o videos.')
        return
      }

      /* 2. Validar contra allowedTypes */
      if (isVideo && !allowedTypes.includes('VIDEO')) {
        setError('No se admiten videos en este campo.')
        return
      }
      if (isImage && !allowedTypes.includes('IMAGEN')) {
        setError('No se admiten imágenes en este campo.')
        return
      }

      /* 3. Validar tamaño */
      if (f.size > maxBytes) {
        setError(
          `El ${isVideo ? 'video' : 'archivo'} no puede superar ${
            isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMG_SIZE_MB
          } MB.`
        )
        return
      }

      /* Confirmación cambio de tipo */
      if (
        currentTipo &&
        ((currentTipo === 'VIDEO' && isImage) ||
          ((currentTipo === 'IMAGEN' || currentTipo === 'ICONO') && isVideo))
      ) {
        const ok = window.confirm(
          `Cambiarás un ${currentTipo.toLowerCase()} por un ${
            isVideo ? 'video' : 'imagen'
          }. ` + 'La vista previa anterior se descartará. ¿Continuar?'
        )
        if (!ok) return
      }

      setError(null)
      setFile(f)
      onFileSelected(f)
    },
    [currentTipo, onFileSelected, allowedTypes]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    noClick: !!preview, // Si hay preview, el click se maneja en el botón "Cambiar" o overlay
    accept: {
      ...(allowedTypes.includes('IMAGEN') ? { 'image/*': [] } : {}),
      ...(allowedTypes.includes('VIDEO') ? { 'video/*': [] } : {}),
    },
  })

  /* ---- generar / liberar preview ---- */
  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  /* ---- borrar archivo ---- */
  const clear = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setFile(null)
    setPreview(null)
    onFileSelected(null)
    setError(null)
  }

  /* ---- clases ---- */
  const rootClasses = clsx(
    'relative group flex flex-col items-center justify-center w-full min-h-[240px] rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden',
    isDragActive
      ? 'border-indigo-500 bg-indigo-50/50'
      : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50',
    error ? 'border-red-400 bg-red-50' : ''
  )

  const isVideoPreview =
    file?.type.startsWith('video/') || (!file && currentTipo === 'VIDEO')

  return (
    <div className={clsx('w-full flex flex-col', className)}>
      <div {...getRootProps({ className: clsx(rootClasses, 'flex-1') })}>
        <input {...getInputProps()} />

        {preview ? (
          /* Estado: Con Preview */
          <>
            <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
              {isVideoPreview ? (
                <video
                src={preview}
                className="w-full h-full object-contain"
                muted
                loop
                playsInline
                controls
              />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}
            </div>

            {/* Overlay de acciones */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
              <p className="text-white font-medium drop-shadow-sm">
                {isVideoPreview ? 'Video seleccionado' : 'Imagen seleccionada'}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={open}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition font-medium text-sm flex items-center"
                >
                  <HiCloudUpload className="w-5 h-5 mr-2" />
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition font-medium text-sm flex items-center"
                >
                  <HiTrash className="w-5 h-5 mr-2" />
                  Quitar
                </button>
              </div>
            </div>

            {/* Badge de tipo (visible siempre) */}
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 text-white text-xs rounded-md backdrop-blur-sm flex items-center gap-1">
              {isVideoPreview ? <HiFilm /> : <HiPhotograph />}
              <span>{isVideoPreview ? 'VIDEO' : 'IMAGEN'}</span>
            </div>
          </>
        ) : (
          /* Estado: Sin Archivo (Empty) */
          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <div
              className={clsx(
                'p-4 rounded-full transition-colors',
                isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
              )}
            >
              <HiCloudUpload className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-700">
                {isDragActive ? '¡Suéltalo aquí!' : 'Arrastra tu archivo aquí'}
              </p>
              <p className="text-sm text-gray-500">
                o si prefieres buscar en tu equipo
              </p>
            </div>

            <button
              type="button"
              onClick={open}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Seleccionar archivo
            </button>

            {/* Límites informativos */}
            <div className="pt-4 border-t border-gray-100 w-full grid grid-cols-2 gap-4 text-xs text-gray-500">
              {allowedTypes.includes('IMAGEN') && (
                <div className="flex flex-col items-center gap-1">
                  <HiPhotograph className="w-4 h-4 text-gray-400" />
                  <span>Imágenes máx. {MAX_IMG_SIZE_MB} MB</span>
                </div>
              )}
              {allowedTypes.includes('VIDEO') && (
                <div className="flex flex-col items-center gap-1">
                  <HiFilm className="w-4 h-4 text-gray-400" />
                  <span>Videos máx. {MAX_VIDEO_SIZE_MB} GB</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}
    </div>
  )
}
