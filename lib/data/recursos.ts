export interface Recurso {
  nombre: string
  tipo: 'linea' | 'org' | 'web'
  detalle: string
  url?: string
}

export interface Pais {
  nombre: string
  emoji: string
  emergencia?: string
  recursos: Recurso[]
}

export const TIPO_LABEL: Record<string, string> = {
  linea: '📞 Línea directa',
  org:   '🤝 Organización',
  web:   '🌐 Web oficial',
}

export const TIPO_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  linea: { bg: '#be123c18', text: '#f472b6', border: '#be123c33' },
  org:   { bg: '#7c3aed18', text: '#c084fc', border: '#7c3aed33' },
  web:   { bg: '#0ea5e918', text: '#7dd3fc', border: '#0ea5e933' },
}

export const PAISES: Pais[] = [
  {
    nombre: 'Argentina', emoji: '🇦🇷', emergencia: '144',
    recursos: [
      { nombre: 'Línea 144', tipo: 'linea', detalle: 'Atención a mujeres en situación de violencia — 24hs, gratuita, todo el país' },
      { nombre: 'Línea 137', tipo: 'linea', detalle: 'Atención a víctimas de violencia familiar y sexual — SENAF' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Policía / emergencias' },
      { nombre: 'Mi Mamá y Yo', tipo: 'org', detalle: 'Programa de acompañamiento a víctimas de violencia de género' },
      { nombre: 'Casa del Encuentro', tipo: 'org', detalle: 'Organización feminista — acompañamiento y asesoramiento legal', url: 'https://casadelencuentro.org' },
    ],
  },
  {
    nombre: 'México', emoji: '🇲🇽', emergencia: '800 290 0024',
    recursos: [
      { nombre: 'INMUJERES — LUNAS', tipo: 'linea', detalle: '800 290 0024 — Línea de la Mujer, 24hs gratuita' },
      { nombre: 'CNDH', tipo: 'linea', detalle: '800 202 5000 — Comisión Nacional de Derechos Humanos' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Policía / emergencias' },
      { nombre: 'Red Nacional de Refugios', tipo: 'org', detalle: 'Atención integral a víctimas de violencia', url: 'https://rednacionalderefugios.org.mx' },
      { nombre: 'FEVIMTRA', tipo: 'web', detalle: 'Fiscalía Especial para delitos de violencia contra las mujeres', url: 'https://www.gob.mx/fgr/acciones-y-programas/fevimtra' },
    ],
  },
  {
    nombre: 'Chile', emoji: '🇨🇱', emergencia: '1455',
    recursos: [
      { nombre: 'Fono Víctimas', tipo: 'linea', detalle: '1455 — SernamEG, 24hs gratuita' },
      { nombre: 'Carabineros', tipo: 'linea', detalle: '133 — Emergencias policiales' },
      { nombre: 'SERNAMEG', tipo: 'web', detalle: 'Servicio Nacional de la Mujer y Equidad de Género', url: 'https://sernameg.gob.cl' },
      { nombre: 'Red Chilena contra la VCM', tipo: 'org', detalle: 'Red de organizaciones feministas', url: 'https://www.nomasviolenciacontramujeres.cl' },
    ],
  },
  {
    nombre: 'Colombia', emoji: '🇨🇴', emergencia: '155',
    recursos: [
      { nombre: 'Línea 155', tipo: 'linea', detalle: 'Línea Nacional de Orientación a Mujeres Víctimas — 24hs gratuita' },
      { nombre: 'ICBF', tipo: 'linea', detalle: '018000 918080 — Instituto Colombiano de Bienestar Familiar' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '123 — Policía / emergencias' },
      { nombre: 'Sisma Mujer', tipo: 'org', detalle: 'Organización feminista — acompañamiento jurídico', url: 'https://www.sismamujer.org' },
    ],
  },
  {
    nombre: 'Brasil', emoji: '🇧🇷', emergencia: '180',
    recursos: [
      { nombre: 'Central de Atendimento à Mulher', tipo: 'linea', detalle: '180 — Ligue 180, 24hs gratuita' },
      { nombre: 'Disque Direitos Humanos', tipo: 'linea', detalle: '100 — Violaciones de derechos humanos' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '190 — Polícia Militar' },
      { nombre: 'SPM — Secretaria das Mulheres', tipo: 'web', detalle: 'Gobierno federal — recursos y orientación', url: 'https://www.gov.br/mulheres' },
    ],
  },
  {
    nombre: 'Uruguay', emoji: '🇺🇾', emergencia: '0800 4141',
    recursos: [
      { nombre: 'Línea de Ayuda', tipo: 'linea', detalle: '0800 4141 — INMUJERES, 24hs gratuita' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Policía / emergencias' },
      { nombre: 'INMUJERES', tipo: 'web', detalle: 'Instituto Nacional de las Mujeres', url: 'https://www.gub.uy/ministerio-desarrollo-social/inmujeres' },
      { nombre: 'CNS Mujeres', tipo: 'org', detalle: 'Comisión Nacional de Seguimiento — Mujeres por Democracia', url: 'https://www.cnsmujeres.org.uy' },
    ],
  },
  {
    nombre: 'Perú', emoji: '🇵🇪', emergencia: '100',
    recursos: [
      { nombre: 'Línea 100', tipo: 'linea', detalle: 'Apoyo a víctimas de violencia familiar y sexual — 24hs gratuita' },
      { nombre: 'Chat 100', tipo: 'web', detalle: 'Atención por chat — mimp.gob.pe/chat100', url: 'https://www.mimp.gob.pe/homemimp/chat100.php' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '105 — Policía Nacional del Perú' },
      { nombre: 'MIMP — Programa Aurora', tipo: 'web', detalle: 'Ministerio de la Mujer — centros de emergencia', url: 'https://www.mimp.gob.pe/omep' },
    ],
  },
  {
    nombre: 'Bolivia', emoji: '🇧🇴', emergencia: '800 10 0200',
    recursos: [
      { nombre: 'SLIM', tipo: 'linea', detalle: 'Servicio Legal Integral Municipal — en cada municipio' },
      { nombre: 'Línea Violeta', tipo: 'linea', detalle: '800 10 0200 — gratuita, 24hs' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '110 — Policía' },
      { nombre: 'CIDEM', tipo: 'org', detalle: 'Centro de Información y Desarrollo de la Mujer', url: 'https://cidem.org' },
    ],
  },
  {
    nombre: 'Venezuela', emoji: '🇻🇪', emergencia: '0800 MUJERES',
    recursos: [
      { nombre: '0800 MUJERES', tipo: 'linea', detalle: '0800 685-3737 — Línea gratuita de atención a la mujer' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Emergencias' },
      { nombre: 'INAMUJER', tipo: 'web', detalle: 'Instituto Nacional de la Mujer', url: 'https://www.inamujer.gob.ve' },
    ],
  },
  {
    nombre: 'Ecuador', emoji: '🇪🇨', emergencia: '1800 MUJER',
    recursos: [
      { nombre: '1800 MUJER', tipo: 'linea', detalle: '1800 68537 — Consejo Nacional para la Igualdad de Género' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Emergencias' },
      { nombre: 'CNIG', tipo: 'web', detalle: 'Consejo Nacional para la Igualdad de Género', url: 'https://www.igualdadgenero.gob.ec' },
    ],
  },
  {
    nombre: 'Paraguay', emoji: '🇵🇾', emergencia: '137',
    recursos: [
      { nombre: 'SOS Mujer', tipo: 'linea', detalle: '137 — Secretaría de la Mujer, 24hs gratuita' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Policía' },
      { nombre: 'Secretaría de la Mujer', tipo: 'web', detalle: 'Presidencia de la República', url: 'https://www.mujer.gov.py' },
    ],
  },
  {
    nombre: 'Costa Rica', emoji: '🇨🇷', emergencia: '911',
    recursos: [
      { nombre: 'INAMU', tipo: 'linea', detalle: '800 VIOLETA (8004653) — Instituto Nacional de las Mujeres' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Emergencias' },
      { nombre: 'INAMU', tipo: 'web', detalle: 'Instituto Nacional de las Mujeres', url: 'https://www.inamu.go.cr' },
    ],
  },
  {
    nombre: 'Rep. Dominicana', emoji: '🇩🇴', emergencia: '809 200 2000',
    recursos: [
      { nombre: 'Línea de Emergencia', tipo: 'linea', detalle: '809 200 2000 — Procuraduría Fiscal' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Emergencias' },
      { nombre: 'Ministerio de la Mujer', tipo: 'web', detalle: 'Recursos y orientación', url: 'https://mujer.gob.do' },
    ],
  },
]
