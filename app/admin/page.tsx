'use client'

import { useEffect, useState } from 'react'
import { Case, CASE_TYPE_COLORS, CASE_TYPE_LABELS, COUNTRIES, CountryCode } from '@/types'

export default function AdminPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useState(false)
  const [tab, setTab] = useState<'pendiente' | 'aprobado' | 'rechazado'>('pendiente')

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPass) {
      setAuth(true)
    } else {
      alert('Contraseña incorrecta')
    }
  }

  async function fetchCases() {
    const { getServiceClient } = await import('@/lib/supabase')
    const client = getServiceClient()
    const { data } = await client
      .from('cases')
      .select('*')
      .eq('estado', tab)
      .order('creado_at', { ascending: false })
    setCases((data as Case[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    if (auth) {
      setLoading(true)
      fetchCases()
    }
  }, [auth, tab])

  async function updateEstado(id: string, estado: 'aprobado' | 'rechazado') {
    const { getServiceClient } = await import('@/lib/supabase')
    const client = getServiceClient()
    await client.from('cases').update({ estado }).eq('id', id)
    setCases((prev) => prev.filter((c) => c.id !== id))
  }

  async function deleteCase(id: string) {
    if (!confirm('¿Eliminar este caso definitivamente?')) return
    const { getServiceClient } = await import('@/lib/supabase')
    const client = getServiceClient()
    await client.from('cases').delete().eq('id', id)
    setCases((prev) => prev.filter((c) => c.id !== id))
  }

  if (!auth) {
    return (
      <div
        style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}
        className="flex items-center justify-center"
      >
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="rounded-2xl p-10 w-full max-w-sm"
        >
          <h1
            style={{
              background: 'linear-gradient(135deg, var(--pink), var(--violet))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="text-2xl font-bold mb-6 text-center"
          >
            Panel Admin
          </h1>
          <form onSubmit={login} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, var(--rose), var(--pink))',
                color: 'white',
                border: 'none',
                borderRadius: 999,
                padding: '10px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  const TABS = [
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'aprobado', label: 'Aprobados' },
    { key: 'rechazado', label: 'Rechazados' },
  ] as const

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <nav
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="sticky top-0 z-10 px-6 h-14 flex items-center justify-between"
      >
        <span
          style={{
            background: 'linear-gradient(135deg, var(--pink), var(--violet))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          className="font-bold"
        >
          amiga cuidado — Admin
        </span>
        <a href="/" style={{ color: 'var(--text-secondary)' }} className="text-sm hover:text-white">
          Ver mapa →
        </a>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: tab === t.key ? 'var(--bg-card)' : 'transparent',
                border: `1px solid ${tab === t.key ? 'var(--border)' : 'transparent'}`,
                color: tab === t.key ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                className="rounded-xl h-24 animate-pulse"
              />
            ))}
          </div>
        ) : cases.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm text-center py-12">
            No hay casos en esta categoría
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {cases.map((c) => {
              const color = CASE_TYPE_COLORS[c.tipo]
              const country = COUNTRIES[c.pais as CountryCode] ?? c.pais
              return (
                <div
                  key={c.id}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  className="rounded-xl p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        style={{
                          background: color + '22',
                          color,
                          border: `1px solid ${color}66`,
                        }}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      >
                        {CASE_TYPE_LABELS[c.tipo]}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }} className="text-xs">
                        {c.fecha} · {country}
                      </span>
                    </div>
                    <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold">
                      {c.nombre}
                    </h3>
                    {c.descripcion && (
                      <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 line-clamp-2">
                        {c.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {tab === 'pendiente' && (
                      <>
                        <button
                          onClick={() => updateEstado(c.id, 'aprobado')}
                          style={{ background: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e44' }}
                          className="text-xs px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => updateEstado(c.id, 'rechazado')}
                          style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' }}
                          className="text-xs px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteCase(c.id)}
                      style={{ color: 'var(--text-secondary)' }}
                      className="text-xs px-3 py-1.5 rounded-full hover:text-red-400 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
