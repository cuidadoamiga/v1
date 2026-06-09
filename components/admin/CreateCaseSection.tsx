'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { COUNTRIES } from '@/types'

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'es' } }
    )
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    return null
  } catch { return null }
}

interface Props {
  onCreated: () => void
}

export function CreateCaseSection({ onCreated }: Props) {
  const [form, setForm] = useState({
    nombre: '', victima: '', fecha: '', tipo: 'femicidio', pais: '',
    ciudad: '', calle: '', barrio: '', descripcion: '', foto_url: '',
    fuentes: '', proceso_judicial: '',
  })
  const [loading, setLoading] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [success, setSuccess] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    if (['calle', 'barrio', 'ciudad', 'pais'].includes(field)) setGeoError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setGeoError('')

    const addressParts = [form.calle, form.barrio, form.ciudad, form.pais].filter(Boolean).join(', ')
    const coords = await geocode(addressParts)
    if (!coords) {
      setGeoError('No se pudo ubicar la dirección. Revisá ciudad y país.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from('cases').insert({
      nombre: form.nombre,
      victima: form.victima || null,
      fecha: form.fecha,
      tipo: form.tipo,
      pais: form.pais,
      ciudad: form.ciudad || null,
      descripcion: form.descripcion,
      foto_url: form.foto_url || null,
      fuentes: form.fuentes.split('\n').map(s => s.trim()).filter(Boolean),
      proceso_judicial: form.proceso_judicial || null,
      lat: coords.lat,
      lng: coords.lng,
      estado: 'aprobado',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    if (error) {
      setGeoError('Error al guardar: ' + error.message)
    } else {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); onCreated() }, 1200)
    }
    setLoading(false)
  }

  const inp = {
    background: '#13131a', border: '1px solid #2a2a3a', color: '#f0eaf5',
    borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', width: '100%',
  }
  const lbl = {
    color: '#9d8fad', fontSize: 11, fontWeight: 600 as const,
    textTransform: 'uppercase' as const, letterSpacing: '0.05em',
    display: 'block', marginBottom: 4,
  }

  if (success) return (
    <div style={{ background: '#22c55e11', border: '1px solid #22c55e33', borderRadius: 16, padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
      <p style={{ color: '#86efac', fontWeight: 600 }}>Caso publicado correctamente</p>
    </div>
  )

  return (
    <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 16, padding: 24 }}>
      <p style={{ color: '#c084fc', fontSize: 12, marginBottom: 20, background: '#9333ea18', border: '1px solid #9333ea33', borderRadius: 8, padding: '8px 12px' }}>
        Los casos creados desde aquí se publican directamente en el mapa.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={lbl}>Nombre del agresor *</label>
            <input style={inp} value={form.nombre} onChange={e => set('nombre', e.target.value)} required placeholder="Nombre y apellido" />
          </div>
          <div>
            <label style={lbl}>Nombre de la víctima</label>
            <input style={inp} value={form.victima} onChange={e => set('victima', e.target.value)} placeholder="Nombre y apellido" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label style={lbl}>Fecha *</label>
            <input type="date" style={inp} value={form.fecha} onChange={e => set('fecha', e.target.value)} required />
          </div>
          <div>
            <label style={lbl}>Tipo *</label>
            <select style={inp} value={form.tipo} onChange={e => set('tipo', e.target.value)}>
              <option value="femicidio">Femicidio</option>
              <option value="abuso">Abuso</option>
              <option value="acoso">Acoso</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Proceso judicial</label>
            <select style={inp} value={form.proceso_judicial} onChange={e => set('proceso_judicial', e.target.value)}>
              <option value="">No especificado</option>
              <option value="en_proceso">En proceso</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={lbl}>País *</label>
            <select style={inp} value={form.pais} onChange={e => set('pais', e.target.value)} required>
              <option value="">— seleccionar —</option>
              {Object.entries(COUNTRIES).map(([code, name]) => (
                <option key={code} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Ciudad *</label>
            <input style={inp} value={form.ciudad} onChange={e => set('ciudad', e.target.value)} required placeholder="Buenos Aires" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={lbl}>Calle / dirección</label>
            <input style={inp} value={form.calle} onChange={e => set('calle', e.target.value)} placeholder="Av. Corrientes 1234" />
          </div>
          <div>
            <label style={lbl}>Barrio</label>
            <input style={inp} value={form.barrio} onChange={e => set('barrio', e.target.value)} placeholder="Palermo" />
          </div>
        </div>
        {geoError && <p style={{ color: '#fca5a5', fontSize: 12 }}>{geoError}</p>}
        <div>
          <label style={lbl}>Descripción</label>
          <textarea style={{ ...inp, minHeight: 72, resize: 'vertical' }} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>URL foto del agresor</label>
          <input style={inp} value={form.foto_url} onChange={e => set('foto_url', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label style={lbl}>Fuentes (una por línea)</label>
          <textarea style={{ ...inp, minHeight: 60, resize: 'vertical' }} value={form.fuentes} onChange={e => set('fuentes', e.target.value)} placeholder={'https://diario.com/nota\nhttps://otra-fuente.com'} />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ background: loading ? '#2a2a3a' : 'linear-gradient(135deg, #be123c, #ec4899)', color: loading ? '#9d8fad' : 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}
        >
          {loading ? 'Publicando...' : 'Publicar caso directamente'}
        </button>
      </form>
    </div>
  )
}
