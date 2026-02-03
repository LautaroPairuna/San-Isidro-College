// src/lib/schemas.ts
import { z } from 'zod';

export const MAX_IMG_SIZE_MB = 50;
export const MAX_VIDEO_SIZE_MB = 2048;

export const MAX_IMG_SIZE = MAX_IMG_SIZE_MB * 1024 * 1024;
export const MAX_VIDEO_SIZE = MAX_VIDEO_SIZE_MB * 1024 * 1024;

/* ---------- GrupoMedios SIN CAMBIOS ---------- */
export const GrupoMediosSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  tipoGrupo: z.enum(['CARRUSEL', 'GALERIA', 'UNICO'], { message: 'Selecciona un tipo de grupo' }),
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

  tipo: z.enum(['IMAGEN', 'VIDEO', 'ICONO'], { message: 'Selecciona un tipo de medio' }),

  posicion: z.number({ message: 'Debe ser un número' })
            .int('Debe ser un entero')
            .min(0, 'No puede ser negativa'),

  grupoMediosId: z.number({ message: 'Selecciona un grupo' })
                  .int()
                  .positive('Debe ser mayor que cero'),
});
export type MedioForm = z.infer<typeof MedioSchema>;

/* ---------- Seccion (Nuevo) ---------- */
export const SeccionSchema = z.object({
  slug: z.string().trim().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  pagina: z.string().trim().min(1, 'Requerido'),
  orden: z.coerce.number().int().min(0),
  tipo: z.enum(['MEDIA_UNICA', 'GALERIA', 'TEXTO_RICO', 'HERO', 'CUSTOM']),
  titulo: z.string().optional(),
  subtitulo: z.string().optional(),
  grupoId: z.coerce.number().int().positive().optional().nullable(),
  medioId: z.coerce.number().int().positive().optional().nullable(),
  // propsJson se podría manejar como string y parsear, o ignorar por ahora en el form básico
});
export type SeccionForm = z.infer<typeof SeccionSchema>;
