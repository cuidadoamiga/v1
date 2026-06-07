export type CaseType = 'femicidio' | 'abuso' | 'acoso'

export type CaseStatus = 'pendiente' | 'aprobado' | 'rechazado'

export type ProcesoJudicial = 'en_proceso' | 'cerrado' | null

export interface Case {
  id: string
  nombre: string
  victima: string | null
  fecha: string
  tipo: CaseType
  pais: string
  ciudad: string | null
  descripcion: string
  foto_url: string | null
  fuentes: string[]
  proceso_judicial: ProcesoJudicial
  lat: number
  lng: number
  estado: CaseStatus
  creado_at: string
}

export interface Validacion {
  id: string
  caso_id: string
  moderadora_id: string
  decision: 'aprobado' | 'rechazado'
  motivo_rechazo: string | null
  created_at: string
}

export interface SolicitudModeradora {
  id: string
  nombre: string
  mail: string
  pais: string
  organizacion: string | null
  motivo: string
  como_se_entero: string
  estado: 'pendiente' | 'aprobada' | 'rechazada'
  creado_at: string
}

export type CountryCode =
  | 'AR' | 'BR' | 'CL' | 'CO' | 'MX' | 'PE' | 'UY' | 'PY'
  | 'BO' | 'EC' | 'VE' | 'CR' | 'PA' | 'DO' | 'GT' | 'HN'
  | 'SV' | 'NI' | 'CU' | 'PR'

export const COUNTRIES: Record<CountryCode, string> = {
  AR: 'Argentina',
  BR: 'Brasil',
  CL: 'Chile',
  CO: 'Colombia',
  MX: 'México',
  PE: 'Perú',
  UY: 'Uruguay',
  PY: 'Paraguay',
  BO: 'Bolivia',
  EC: 'Ecuador',
  VE: 'Venezuela',
  CR: 'Costa Rica',
  PA: 'Panamá',
  DO: 'Rep. Dominicana',
  GT: 'Guatemala',
  HN: 'Honduras',
  SV: 'El Salvador',
  NI: 'Nicaragua',
  CU: 'Cuba',
  PR: 'Puerto Rico',
}

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  femicidio: 'Femicidio',
  abuso: 'Abuso',
  acoso: 'Acoso',
}

export const CASE_TYPE_COLORS: Record<CaseType, string> = {
  femicidio: '#be123c',
  abuso: '#7c3aed',
  acoso: '#db2777',
}
