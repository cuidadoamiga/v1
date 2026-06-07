export type CaseType = 'femicidio' | 'abuso' | 'acoso'

export type CaseStatus = 'pendiente' | 'aprobado' | 'rechazado'

export interface Case {
  id: string
  nombre: string
  fecha: string
  tipo: CaseType
  pais: string
  descripcion: string
  foto_url: string | null
  fuentes: string[]
  lat: number
  lng: number
  estado: CaseStatus
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
  femicidio: '#e11d48',
  abuso: '#9333ea',
  acoso: '#ec4899',
}
