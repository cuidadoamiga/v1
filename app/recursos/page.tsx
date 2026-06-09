import Link from 'next/link'
import type { Metadata } from 'next'
import { PAISES, TIPO_LABEL, TIPO_COLOR } from '@/lib/data/recursos'

export const metadata: Metadata = {
  title: 'Dónde denunciar — Cuidado Amiga',
  description: 'Recursos y líneas de emergencia para denunciar violencia de género en América Latina.',
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

        <div style={{ background: '#be123c18', border: '1px solid #be123c55', borderRadius: 12, padding: '16px 20px', marginBottom: 40 }} className="flex items-start gap-3">
          <span style={{ fontSize: 20, flexShrink: 0 }}>🚨</span>
          <p style={{ color: '#fda4af', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: '#f472b6' }}>Si estás en peligro inmediato</strong>, no esperes — llamá al número de emergencias de tu país (911 en la mayoría de los países). Tu seguridad es lo primero.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {PAISES.map((pais) => (
            <div key={pais.nombre} style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 16, overflow: 'hidden' }}>
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
