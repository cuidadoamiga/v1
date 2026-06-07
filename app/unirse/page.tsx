'use client'

import { useState } from 'react'
import Link from 'next/link'
import { COUNTRIES } from '@/types'

export default function UnirsePage() {
  const [form, setForm] = useState({
    nombre: '',
    mail: '',
    pais: '',
    organizacion: '',
    motivo: '',
    como_se_entero: '',
  })
  const [checks, setChecks] = useState({ protocolo: false, sensible: false })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!checks.protocolo || !checks.sensible) {
      setError('Tenés que aceptar ambas condiciones para continuar.')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/solicitud', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      setError('Hubo un error al enviar tu solicitud. Intentá de nuevo.')
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  const inputStyle = {
    background: '#1a1a24',
    border: '1px solid #2a2a3a',
    color: '#f0eaf5',
    borderRadius: 8,
    padding: '10px 14px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
  }

  const labelStyle = {
    color: '#9d8fad',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 6,
  }

  if (success) {
    return (
      <div
        style={{ background: '#0d0d12', minHeight: '100vh' }}
        className="flex items-center justify-center px-4"
      >
        <div
          style={{
            background: '#1a1a24',
            border: '1px solid #2a2a3a',
          }}
          className="rounded-2xl p-10 max-w-md w-full text-center"
        >
          <div className="text-5xl mb-4">💜</div>
          <h2 style={{ color: '#f0eaf5' }} className="text-xl font-bold mb-3">
            Tu solicitud fue recibida
          </h2>
          <p style={{ color: '#9d8fad' }} className="text-sm leading-relaxed mb-6">
            Te contactamos en los próximos días al mail que dejaste.
          </p>
          <Link
            href="/"
            style={{
              background: 'linear-gradient(135deg, #be123c, #ec4899)',
              color: 'white',
              display: 'inline-block',
              padding: '10px 28px',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14,
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Volver al mapa
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0d0d12', minHeight: '100vh' }}>
      <nav
        style={{ background: '#13131a', borderBottom: '1px solid #2a2a3a' }}
        className="sticky top-0 z-10 px-6 h-14 flex items-center justify-between"
      >
        <Link href="/" style={{ color: '#9d8fad' }} className="text-sm hover:text-white transition-colors">
          ← Volver
        </Link>
        <Link href="/protocolo" style={{ color: '#9d8fad' }} className="text-sm hover:text-white transition-colors">
          Ver protocolo
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <span
            style={{
              background: '#9333ea22',
              color: '#c084fc',
              border: '1px solid #9333ea55',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '4px 12px',
              borderRadius: 999,
              display: 'inline-block',
              marginBottom: 16,
            }}
          >
            Acceso para moderadoras
          </span>
          <h1
            style={{
              background: 'linear-gradient(135deg, #f472b6, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: 32,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Quiero ser moderadora
          </h1>
          <p style={{ color: '#9d8fad', fontSize: 14, lineHeight: 1.7 }}>
            Las solicitudes son revisadas manualmente. Si tu solicitud es aprobada, te contactamos con tus credenciales de acceso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label style={labelStyle}>Nombre o alias *</label>
            <input
              placeholder="Puede ser un seudónimo"
              style={inputStyle}
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Mail de contacto *</label>
            <input
              type="email"
              placeholder="tu@mail.com"
              style={inputStyle}
              value={form.mail}
              onChange={(e) => set('mail', e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>País desde donde vas a moderar *</label>
            <select
              style={inputStyle}
              value={form.pais}
              onChange={(e) => set('pais', e.target.value)}
              required
            >
              <option value="">Seleccioná tu país</option>
              {Object.entries(COUNTRIES).map(([code, name]) => (
                <option key={code} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Organización o colectiva (opcional)</label>
            <input
              placeholder="Nombre de la organización, si aplica"
              style={inputStyle}
              value={form.organizacion}
              onChange={(e) => set('organizacion', e.target.value)}
            />
          </div>

          <div>
            <label style={labelStyle}>
              ¿Por qué querés ser moderadora? *
              <span style={{ color: '#ec4899', marginLeft: 8, fontWeight: 400, textTransform: 'none' }}>
                ({form.motivo.length}/300)
              </span>
            </label>
            <textarea
              maxLength={300}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
              value={form.motivo}
              onChange={(e) => set('motivo', e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>¿Cómo te enteraste del proyecto? *</label>
            <select
              style={inputStyle}
              value={form.como_se_entero}
              onChange={(e) => set('como_se_entero', e.target.value)}
              required
            >
              <option value="">Seleccioná una opción</option>
              <option value="Redes sociales">Redes sociales</option>
              <option value="Organización feminista">Organización feminista</option>
              <option value="Me lo compartieron">Me lo compartieron</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div
            style={{
              background: '#1a1a24',
              border: '1px solid #2a2a3a',
              borderRadius: 12,
              padding: 20,
            }}
            className="flex flex-col gap-4"
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.protocolo}
                onChange={(e) => setChecks((p) => ({ ...p, protocolo: e.target.checked }))}
                style={{ marginTop: 2, accentColor: '#ec4899', width: 16, height: 16, flexShrink: 0 }}
              />
              <span style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.5 }}>
                Leí y acepto el{' '}
                <Link href="/protocolo" target="_blank" style={{ color: '#ec4899', textDecoration: 'underline' }}>
                  protocolo de moderación
                </Link>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.sensible}
                onChange={(e) => setChecks((p) => ({ ...p, sensible: e.target.checked }))}
                style={{ marginTop: 2, accentColor: '#ec4899', width: 16, height: 16, flexShrink: 0 }}
              />
              <span style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.5 }}>
                Entiendo que voy a trabajar con información sensible
              </span>
            </label>
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#2a2a3a' : 'linear-gradient(135deg, #be123c, #ec4899)',
              color: loading ? '#9d8fad' : 'white',
              border: 'none',
              borderRadius: 999,
              padding: '12px 32px',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            {loading ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      </main>
    </div>
  )
}
