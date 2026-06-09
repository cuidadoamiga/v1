import { z } from 'zod'

export const CaseTypeSchema = z.enum(['femicidio', 'abuso', 'acoso'])
export const ProcesoJudicialSchema = z.enum(['en_proceso', 'cerrado']).nullable()

export const CaseInsertSchema = z.object({
  nombre:           z.string().min(1).max(200),
  victima:          z.string().max(200).optional().nullable(),
  fecha:            z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  tipo:             CaseTypeSchema,
  pais:             z.string().min(1).max(100),
  ciudad:           z.string().max(100).optional().nullable(),
  descripcion:      z.string().max(2000).optional().default(''),
  foto_url:         z.string().url().max(500).optional().nullable(),
  fuentes:          z.array(z.string().url().max(500)).max(10).default([]),
  proceso_judicial: ProcesoJudicialSchema.optional().default(null),
  lat:              z.number().min(-90).max(90),
  lng:              z.number().min(-180).max(180),
})

export type CaseInsert = z.infer<typeof CaseInsertSchema>
