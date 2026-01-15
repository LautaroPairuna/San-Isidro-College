// src/lib/schemas.ts
import { z } from 'zod';

export const MAX_IMG_SIZE_MB = 50;
export const MAX_VIDEO_SIZE_MB = 2048;

export const MAX_IMG_SIZE   = MAX_IMG_SIZE_MB  * 1024 * 1024;
export const MAX_VIDEO_SIZE = MAX_VIDEO_SIZE_MB * 1024 * 1024;

/* ---------- GrupoMedios SIN CAMBIOS ---------- */
export const GrupoMediosSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  tipoGrupo: z.enum(['CARRUSEL', 'GALERIA', 'UNICO'], { errorMap: () => ({ message: 'Selecciona un tipo de grupo' }) }),
});
export type GrupoMediosForm = z.infer<typeof GrupoMediosSchema>;

/* ---------- Medio CON VALIDACIÓN CORREGIDA ---------- */
export const MedioSchema = z.object({
  nombreArchivo: z.string().trim().min(1, 'Debe tener al menos 1 carácter').max(50, 'Máximo 50 caracteres').optional(),

  /** Archivo principal (imagen o video) */
  urlArchivo: z.instanceof(File).optional()
    .superRefine((file: File | undefined, ctx) => {
      if (!file) return;

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Formato no soportado (solo imágenes o videos)' });
        return;
      }

      if (isImage && file.size > MAX_IMG_SIZE) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `La imagen no puede superar ${MAX_IMG_SIZE_MB} MB` });
      }

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        const sizeMsg = MAX_VIDEO_SIZE_MB >= 1024 ? `${MAX_VIDEO_SIZE_MB / 1024} GB` : `${MAX_VIDEO_SIZE_MB} MB`;
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `El video no puede superar ${sizeMsg}` });
      }
    }),

  /** Miniatura opcional (solo imagen) */
  urlMiniatura: z.instanceof(File).optional()
    .superRefine((file: File | undefined, ctx) => {
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La miniatura debe ser una imagen' });
      } else if (file.size > MAX_IMG_SIZE) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `La miniatura no puede superar ${MAX_IMG_SIZE_MB} MB` });
      }
    }),

  textoAlternativo: z.string().trim().max(200, 'Máximo 200 caracteres').optional(),

  tipo: z.enum(['IMAGEN', 'VIDEO', 'ICONO'], { errorMap: () => ({ message: 'Selecciona un tipo de medio' }) }),

  posicion: z.number({ invalid_type_error: 'Debe ser un número' })
            .int('Debe ser un entero')
            .min(0, 'No puede ser negativa'),

  grupoMediosId: z.number({ invalid_type_error: 'Selecciona un grupo' })
                  .int()
                  .positive('Debe ser mayor que cero'),
});
export type MedioForm = z.infer<typeof MedioSchema>;
