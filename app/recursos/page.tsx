import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dónde denunciar — Cuidado Amiga',
  description: 'Recursos y líneas de emergencia para denunciar violencia de género en América Latina.',
}

interface Recurso {
  nombre: string
  tipo: 'linea' | 'org' | 'web'
  detalle: string
  url?: string
}

interface Pais {
  nombre: string
  emoji: string
  emergencia?: string
  recursos: Recurso[]
}

const PAISES: Pais[] = [
  {
    nombre: 'Argentina',
    emoji: '🇦🇷',
    emergencia: '144',
    recursos: [
      { nombre: 'Línea 144', tipo: 'linea', detalle: 'Atención a mujeres en situación de violencia — 24hs, gratuita, todo el país' },
      { nombre: 'Línea 137', tipo: 'linea', detalle: 'Atención a víctimas de violencia familiar y sexual — SENAF' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Policía / emergencias' },
      { nombre: 'Mi Mamá y Yo', tipo: 'org', detalle: 'Programa de acompañamiento a víctimas de violencia de género' },
      { nombre: 'Casa del Encuentro', tipo: 'org', detalle: 'Organización feminista — acompañamiento y asesoramiento legal', url: 'https://casadelencuentro.org' },
    ],
  },
  {
    nombre: 'México',
    emoji: '🇲🇽',
    emergencia: '800 290 0024',
    recursos: [
      { nombre: 'INMUJERES — LUNAS', tipo: 'linea', detalle: '800 290 0024 — Línea de la Mujer, 24hs gratuita' },
      { nombre: 'CNDH', tipo: 'linea', detalle: '800 202 5000 — Comisión Nacional de Derechos Humanos' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Policía / emergencias' },
      { nombre: 'Red Nacional de Refugios', tipo: 'org', detalle: 'Atención integral a víctimas de violencia', url: 'https://rednacionalderefugios.org.mx' },
      { nombre: 'FEVIMTRA', tipo: 'web', detalle: 'Fiscalía Especial para delitos de violencia contra las mujeres', url: 'https://www.gob.mx/fgr/acciones-y-programas/fevimtra' },
    ],
  },
  {
    nombre: 'Chile',
    emoji: '🇨🇱',
    emergencia: '1455',
    recursos: [
      { nombre: 'Fono Víctimas', tipo: 'linea', detalle: '1455 — SernamEG, 24hs gratuita' },
      { nombre: 'Carabineros', tipo: 'linea', detalle: '133 — Emergencias policiales' },
      { nombre: 'SERNAMEG', tipo: 'web', detalle: 'Servicio Nacional de la Mujer y Equidad de Género', url: 'https://sernameg.gob.cl' },
      { nombre: 'Red Chilena contra la VCM', tipo: 'org', detalle: 'Red de organizaciones feministas', url: 'https://www.nomasviolenciacontramujeres.cl' },
    ],
  },
  {
    nombre: 'Colombia',
    emoji: '🇨🇴',
    emergencia: '155',
    recursos: [
      { nombre: 'Línea 155', tipo: 'linea', detalle: 'Línea Nacional de Orientación a Mujeres Víctimas — 24hs gratuita' },
      { nombre: 'ICBF', tipo: 'linea', detalle: '018000 918080 — Instituto Colombiano de Bienestar Familiar' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '123 — Policía / emergencias' },
      { nombre: 'Sisma Mujer', tipo: 'org', detalle: 'Organización feminista — acompañamiento jurídico', url: 'https://www.sismamujer.org' },
    ],
  },
  {
    nombre: 'Brasil',
    emoji: '🇧🇷',
    emergencia: '180',
    recursos: [
      { nombre: 'Central de Atendimento à Mulher', tipo: 'linea', detalle: '180 — Ligue 180, 24hs gratuita' },
      { nombre: 'Disque Direitos Humanos', tipo: 'linea', detalle: '100 — Violaciones de derechos humanos' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '190 — Polícia Militar' },
      { nombre: 'SPM — Secretaria das Mulheres', tipo: 'web', detalle: 'Gobierno federal — recursos y orientación', url: 'https://www.gov.br/mulheres' },
    ],
  },
  {
    nombre: 'Uruguay',
    emoji: '🇺🇾',
    emergencia: '0800 4141',
    recursos: [
      { nombre: 'Línea de Ayuda', tipo: 'linea', detalle: '0800 4141 — INMUJERES, 24hs gratuita' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Policía / emergencias' },
      { nombre: 'INMUJERES', tipo: 'web', detalle: 'Instituto Nacional de las Mujeres', url: 'https://www.gub.uy/ministerio-desarrollo-social/inmujeres' },
      { nombre: 'CNS Mujeres', tipo: 'org', detalle: 'Comisión Nacional de Seguimiento — Mujeres por Democracia', url: 'https://www.cnsmujeres.org.uy' },
    ],
  },
  {
    nombre: 'Perú',
    emoji: '🇵🇪',
    emergencia: '100',
    recursos: [
      { nombre: 'Línea 100', tipo: 'linea', detalle: 'Apoyo a víctimas de violencia familiar y sexual — 24hs gratuita' },
      { nombre: 'Chat 100', tipo: 'web', detalle: 'Atención por chat — mimp.gob.pe/chat100', url: 'https://www.mimp.gob.pe/homemimp/chat100.php' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '105 — Policía Nacional del Perú' },
      { nombre: 'MIMP — Programa Aurora', tipo: 'web', detalle: 'Ministerio de la Mujer — centros de emergencia', url: 'https://www.mimp.gob.pe/omep' },
    ],
  },
  {
    nombre: 'Bolivia',
    emoji: '🇧🇴',
    emergencia: '800 10 0200',
    recursos: [
      { nombre: 'SLIM', tipo: 'linea', detalle: 'Servicio Legal Integral Municipal — en cada municipio' },
      { nombre: 'Línea Violeta', tipo: 'linea', detalle: '800 10 0200 — gratuita, 24hs' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '110 — Policía' },
      { nombre: 'CIDEM', tipo: 'org', detalle: 'Centro de Información y Desarrollo de la Mujer', url: 'https://cidem.org' },
    ],
  },
  {
    nombre: 'Venezuela',
    emoji: '🇻🇪',
    emergencia: '0800 MUJERES',
    recursos: [
      { nombre: '0800 MUJERES', tipo: 'linea', detalle: '0800 685-3737 — Línea gratuita de atención a la mujer' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Emergencias' },
      { nombre: 'INAMUJER', tipo: 'web', detalle: 'Instituto Nacional de la Mujer', url: 'https://www.inamujer.gob.ve' },
    ],
  },
  {
    nombre: 'Ecuador',
    emoji: '🇪🇨',
    emergencia: '1800 MUJER',
    recursos: [
      { nombre: '1800 MUJER', tipo: 'linea', detalle: '1800 68537 — Consejo Nacional para la Igualdad de Género' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Emergencias' },
      { nombre: 'CNIG', tipo: 'web', detalle: 'Consejo Nacional para la Igualdad de Género', url: 'https://www.igualdadgenero.gob.ec' },
    ],
  },
  {
    nombre: 'Paraguay',
    emoji: '🇵🇾',
    emergencia: '137',
    recursos: [
      { nombre: 'SOS Mujer', tipo: 'linea', detalle: '137 — Secretaría de la Mujer, 24hs gratuita' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Policía' },
      { nombre: 'Secretaría de la Mujer', tipo: 'web', detalle: 'Presidencia de la República', url: 'https://www.mujer.gov.py' },
    ],
  },
  {
    nombre: 'Costa Rica',
    emoji: '🇨🇷',
    emergencia: '911',
    recursos: [
      { nombre: 'INAMU', tipo: 'linea', detalle: '800 VIOLETA (8004653) — Instituto Nacional de las Mujeres' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Emergencias' },
      { nombre: 'INAMU', tipo: 'web', detalle: 'Instituto Nacional de las Mujeres', url: 'https://www.inamu.go.cr' },
    ],
  },
  {
    nombre: 'Rep. Dominicana',
    emoji: '🇩🇴',
    emergencia: '809 200 2000',
    recursos: [
      { nombre: 'Línea de Emergencia', tipo: 'linea', detalle: '809 200 2000 — Procuraduría Fiscal' },
      { nombre: 'Emergencias', tipo: 'linea', detalle: '911 — Emergencias' },
      { nombre: 'Ministerio de la Mujer', tipo: 'web', detalle: 'Recursos y orientación', url: 'https://mujer.gob.do' },
    ],
  },
]

const TIPO_LABEL: Record<string, string> = {
  linea: '📞 Línea directa',
  org: '🤝 Organización',
  web: '🌐 Web oficial',
}

const TIPO_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  linea: { bg: '#be123c18', text: '#f472b6', border: '#be123c33' },
  org: { bg: '#7c3aed18', text: '#c084fc', border: '#7c3aed33' },
  web: { bg: '#0ea5e918', text: '#7dd3fc', border: '#0ea5e933' },
}

export default function RecursosPage() {
  return (
    <div style={{ background: '#0d0d12', minHeight: '100vh' }}>
      <nav style={{ background: '#13131a', borderBottom: '1px solid #2a2a3a' }} className="sticky top-0 z-10 px-6 h-14 flex items-center justify-between">
        <Link href="/" style={{ color: '#9d8fad' }} className="text-sm hover:text-white transition-colors">← Volver</Link>
        <Link href="/cases/new" style={{ background: 'linear-gradient(135deg, #be123c, #ec4899)', color: 'white' }} className="text-sm font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity">
          + Reportar caso
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <span style={{ background: '#be123c22', color: '#f472b6', border: '1px solid #be123c55', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 999, display: 'inline-block', marginBottom: 16 }}>
            Recursos
          </span>
          <h1 style={{ background: 'linear-gradient(135deg, #f472b6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 36, fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
            ¿Dónde denunciar?
          </h1>
          <p style={{ color: '#9d8fad', fontSize: 15, lineHeight: 1.7 }}>
            Líneas de emergencia, organizaciones y recursos oficiales para víctimas de violencia de género en América Latina.
            Si estás en peligro inmediato, llamá al número de emergencias de tu país.
          </p>
        </div>

        {/* Alerta de emergencia */}
        <div style={{ background: '#be123c18', border: '1px solid #be123c55', borderRadius: 12, padding: '16px 20px', marginBottom: 40 }} className="flex items-start gap-3">
          <span style={{ fontSize: 20, flexShrink: 0 }}>🚨</span>
          <p style={{ color: '#fda4af', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: '#f472b6' }}>Si estás en peligro inmediato</strong>, no esperes — llamá al número de emergencias de tu país (911 en la mayoría de los países). Tu seguridad es lo primero.
          </p>
        </div>

        {/* Lista de países */}
        <div className="flex flex-col gap-6">
          {PAISES.map((pais) => (
            <div key={pais.nombre} style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 16, overflow: 'hidden' }}>
              {/* Header del país */}
              <div style={{ background: '#13131a', borderBottom: '1px solid #2a2a3a', padding: '14px 20px' }} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 22 }}>{pais.emoji}</span>
                  <h2 style={{ color: '#f0eaf5', fontWeight: 700, fontSize: 16, margin: 0 }}>{pais.nombre}</h2>
                </div>
                {pais.emergencia && (
                  <div style={{ background: '#be123c22', border: '1px solid #be123c55', borderRadius: 8, padding: '4px 12px' }} className="flex items-center gap-2">
                    <span style={{ fontSize: 14 }}>📞</span>
                    <span style={{ color: '#f472b6', fontWeight: 800, fontSize: 14 }}>{pais.emergencia}</span>
                  </div>
                )}
              </div>

              {/* Recursos */}
              <div className="flex flex-col divide-y" style={{ borderColor: '#2a2a3a' }}>
                {pais.recursos.map((r, i) => {
                  const colors = TIPO_COLOR[r.tipo]
                  return (
                    <div key={i} style={{ padding: '14px 20px' }} className="flex items-start gap-3">
                      <span style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, flexShrink: 0, marginTop: 2, whiteSpace: 'nowrap' }}>
                        {TIPO_LABEL[r.tipo]}
                      </span>
                      <div className="flex-1 min-w-0">
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#f0eaf5', fontWeight: 600, fontSize: 14, textDecoration: 'none' }} className="hover:text-pink-400 transition-colors">
                            {r.nombre} →
                          </a>
                        ) : (
                          <span style={{ color: '#f0eaf5', fontWeight: 600, fontSize: 14 }}>{r.nombre}</span>
                        )}
                        <p style={{ color: '#9d8fad', fontSize: 13, margin: '2px 0 0', lineHeight: 1.5 }}>{r.detalle}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer de la página */}
        <div style={{ background: '#9333ea18', border: '1px solid #9333ea33', borderRadius: 12, padding: 20, marginTop: 40, textAlign: 'center' }}>
          <p style={{ color: '#c084fc', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            ¿Conocés un recurso que falta? Escribinos a{' '}
            <a href="mailto:cuidadoamiga@proton.me" style={{ color: '#ec4899', textDecoration: 'underline' }}>cuidadoamiga@proton.me</a>
            {' '}y lo sumamos.
          </p>
        </div>
      </main>
    </div>
  )
}
