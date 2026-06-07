'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { COUNTRIES, CountryCode } from '@/types'

export default function NewCasePage() {
  const [form, setForm] = useState({
    nombre: '',
    fecha: '',
    tipo: 'femicidio',
    pais: '',
    descripcion: '',
    foto_url: '',
    fuentes: '',
    lat: '',
    lng: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fuentes = form.fuentes
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const { error: err } = await supabase.from('cases').insert({
      nombre: form.nombre,
      fecha: form.fecha,
      tipo: form.tipo,
      pais: form.pais,
      descripcion: form.descripcion,
      foto_url: form.foto_url || null,
      fuentes,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      estado: 'pendiente',
    })

    if (err) {
      setError('Error al enviar el caso. Por favor intentá de nuevo.')
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  const inputStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: 8,
    padding: '10px 14px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
  }

  const labelStyle = {
    color: 'var(--text-secondary)',
    fontSize: 12,
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 6,
  }

  if (success) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex items-center justify-center">
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="rounded-2xl p-10 max-w-md text-center"
        >
          <div className="text-5xl mb-4">🌸</div>
          <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-2">
            Caso enviado
          </h2>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">
            El caso fue enviado correctamente y será revisado por el equipo de moderación antes de publicarse.
          </p>
          <Link
            href="/"
            style={{ background: 'linear-gradient(135deg, var(--rose), var(--pink))', color: 'white' }}
            className="text-sm font-medium px-6 py-2.5 rounded-full inline-block hover:opacity-90 transition-opacity"
          >
            Volver al mapa
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <nav
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="sticky top-0 z-10 px-6 h-14 flex items-center"
      >
        <Link href="/" style={{ color: 'var(--text-secondary)' }} className="text-sm hover:text-white transition-colors">
          ← Volver al mapa
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1
          style={{
            background: 'linear-gradient(135deg, var(--pink), var(--violet))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          className="text-3xl font-bold mb-2"
        >
          Reportar un caso
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-8">
          Los casos son revisados por el equipo antes de publicarse en el mapa.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label style={labelStyle}>Nombre completo *</label>
            <input style={inputStyle} value={form.nombre} onChange={(e) => set('nombre', e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Fecha *</label>
              <input type="date" style={inputStyle} value={form.fecha} onChange={(e) => set('fecha', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Tipo *</label>
              <select style={inputStyle} value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
                <option value="femicidio">Femicidio</option>
                <option value="abuso">Abuso</option>
                <option value="acoso">Acoso</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>País *</label>
            <select style={inputStyle} value={form.pais} onChange={(e) => set('pais', e.target.value)} required>
              <option value="">Seleccioná un país</option>
              {Object.entries(COUNTRIES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea
              style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Latitud *</label>
              <input
                type="number"
                step="any"
                placeholder="-34.6037"
                style={inputStyle}
                value={form.lat}
                onChange={(e) => set('lat', e.target.value)}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Longitud *</label>
              <input
                type="number"
                step="any"
                placeholder="-58.3816"
                style={inputStyle}
                value={form.lng}
                onChange={(e) => set('lng', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>URL de foto (opcional)</label>
            <input
              type="url"
              placeholder="https://..."
              style={inputStyle}
              value={form.foto_url}
              onChange={(e) => set('foto_url', e.target.value)}
            />
          </div>

          <div>
            <label style={labelStyle}>Fuentes (una por línea)</label>
            <textarea
              placeholder="https://diario.com/noticia&#10;https://otra-fuente.com"
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              value={form.fuentes}
              onChange={(e) => set('fuentes', e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--rose)', fontSize: 13 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? 'var(--border)'
                : 'linear-gradient(135deg, var(--rose), var(--pink))',
              color: 'white',
              border: 'none',
              borderRadius: 999,
              padding: '12px 32px',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            {loading ? 'Enviando...' : 'Enviar caso'}
          </button>
        </form>
      </main>
    </div>
  )
}
