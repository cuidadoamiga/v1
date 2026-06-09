import { z } from 'zod'

export const SolicitudInsertSchema = z.object({
  nombre:         z.string().min(1).max(200),
  mail:           z.string().email().max(200),
  pais:           z.string().min(1).max(100),
  organizacion:   z.string().max(200).optional().nullable(),
  motivo:         z.string().min(10).max(1000),
  como_se_entero: z.string().min(1).max(200),
})

export type SolicitudInsert = z.infer<typeof SolicitudInsertSchema>
