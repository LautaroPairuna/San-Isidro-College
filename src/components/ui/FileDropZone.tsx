// src/components/FileDropZone.tsx
'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

interface Props {
  /* Lanza el File seleccionado hacia el padre */
  onFileSelected: (file: File | null) => void;
  /* Para edición: url de la media actual (para mostrar preview inicial) */
  currentSrc?: string;
  /* Para edición: tipo actual ("IMAGEN" | "VIDEO") */
  currentTipo?: 'IMAGEN' | 'VIDEO' | 'ICONO';
}

/* Límites */
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 200;

export default function FileDropZone({ onFileSelected, currentSrc, currentTipo }: Props) {
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(currentSrc ?? null);
  const [error, setError]       = useState<string | null>(null);

  /* ───────── Manejo drag&drop ───────── */
  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted.length) return;
    const f = accepted[0];

    /* Validar tamaño y MIME */
    const isVideo  = f.type.startsWith('video/');
    const isImage  = f.type.startsWith('image/');
    const maxBytes = (isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB) * 1024 * 1024;

    if (!isVideo && !isImage) {
      setError('Solo se admiten imágenes o videos.');
      return;
    }
    if (f.size > maxBytes) {
      setError(
        `El ${isVideo ? 'video' : 'archivo'} no puede superar ${isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB} MB.`,
      );
      return;
    }

    /* Si cambia de imagen→video o viceversa, pedir confirmación */
    if (
      currentTipo &&
      ((currentTipo === 'VIDEO' && isImage) || ((currentTipo === 'IMAGEN' || currentTipo === 'ICONO') && isVideo))
    ) {
      const ok = window.confirm(
        `Cambiarás un ${currentTipo.toLowerCase()} por un ${isVideo ? 'video' : 'imagen'}. ` +
          'La vista previa anterior se descartará. ¿Continuar?',
      );
      if (!ok) return;
    }

    setError(null);
    setFile(f);
    onFileSelected(f); // entrega al padre
  }, [currentTipo, onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  /* ---- generar / liberar preview ---- */
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  /* ---- borrar archivo ---- */
  const clear = () => {
    setFile(null);
    setPreview(null);
    onFileSelected(null);
  };

  /* ---- clases ---- */
  const rootClasses = clsx(
    'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition',
    isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400',
  );

  return (
    <div>
      <div {...getRootProps({ className: rootClasses })}>
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          {preview ? 'Arrastra para reemplazar o haz clic para cambiar' : 'Arrastra o haz clic para subir archivo'}
        </p>
      </div>

      {/* Vista previa */}
      {preview && (
        <div className="mt-4 relative">
          {file?.type.startsWith('video/') || (!file && currentTipo === 'VIDEO') ? (
            <video src={preview} className="w-40 h-auto rounded shadow" muted loop playsInline />
          ) : (
            <Image src={preview} alt="preview" width={160} height={120} className="rounded shadow" />
          )}
          <button
            type="button"
            onClick={clear}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
            title="Eliminar archivo"
          >
            ✕
          </button>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
