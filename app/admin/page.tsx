'use client'

import { useEffect, useState } from 'react'
import { Case, Validacion, SolicitudModeradora, CASE_TYPE_COLORS, CASE_TYPE_LABELS, COUNTRIES, CountryCode } from '@/types'

type Tab = 'validar' | 'pendiente' | 'aprobado' | 'rechazado' | 'solicitudes'

interface CaseWithValidaciones extends Case {
  validaciones: Validacion[]
  mi_voto: Validacion | null
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<Tab>('validar')
  const [cases, setCases] = useState<CaseWithValidaciones[]>([])
  const [simpleCases, setSimpleCases] = useState<Case[]>([])
  const [solicitudes, setSolicitudes] = useState<SolicitudModeradora[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectMotivo, setRejectMotivo] = useState<Record<string, string>>({})
  const [userId] = useState(() => typeof window !== 'undefined' ? (localStorage.getItem('mod_id') || crypto.randomUUID()) : '')

  useEffect(() => {
    if (userId && typeof window !== 'undefined') {
      localStorage.setItem('mod_id', userId)
    }
  }, [userId])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPass) {
      setAuth(true)
    } else {
      alert('Contraseña incorrecta')
    }
  }

  async function fetchData() {
    setLoading(true)
    const { getServiceClient } = await import('@/lib/supabase')
    const client = getServiceClient()

    if (tab === 'validar') {
      const { data: casesData } = await client
        .from('cases')
        .select('*')
        .eq('estado', 'pendiente')
        .order('creado_at', { ascending: true })

      const casesWithVotes: CaseWithValidaciones[] = []
      for (const c of (casesData || [])) {
        const { data: vals } = await client
          .from('validaciones')
          .select('*')
          .eq('caso_id', c.id)
        const validaciones = (vals || []) as Validacion[]
        const mi_voto = validaciones.find((v) => v.moderadora_id === userId) || null
        casesWithVotes.push({ ...c, validaciones, mi_voto })
      }
      setCases(casesWithVotes)
    } else if (tab === 'solicitudes') {
      const { data } = await client
        .from('solicitudes_moderadoras')
        .select('*')
        .order('creado_at', { ascending: false })
      setSolicitudes((data || []) as SolicitudModeradora[])
    } else {
      const { data } = await client
        .from('cases')
        .select('*')
        .eq('estado', tab)
        .order('creado_at', { ascending: false })
      setSimpleCases((data || []) as Case[])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (auth) fetchData()
  }, [auth, tab])

  async function votar(caseId: string, decision: 'aprobado' | 'rechazado') {
    const { getServiceClient } = await import('@/lib/supabase')
    const client = getServiceClient()
    const motivo = decision === 'rechazado' ? (rejectMotivo[caseId] || '') : null

    await client.from('validaciones').insert({
      caso_id: caseId,
      moderadora_id: userId,
      decision,
      motivo_rechazo: motivo,
    })

    // Revisar si se completan 3 votos
    const { data: allVotos } = await client
      .from('validaciones')
      .select('*')
      .eq('caso_id', caseId)

    const votos = (allVotos || []) as Validacion[]
    const rechazos = votos.filter((v) => v.decision === 'rechazado')
    const aprobados = votos.filter((v) => v.decision === 'aprobado')

    if (rechazos.length > 0) {
      await client.from('cases').update({ estado: 'rechazado' }).eq('id', caseId)
    } else if (aprobados.length >= 3) {
      await client.from('cases').update({ estado: 'aprobado' }).eq('id', caseId)
    }

    fetchData()
  }

  async function deleteSolicitud(id: string) {
    if (!confirm('¿Eliminar esta solicitud?')) return
    const { getServiceClient } = await import('@/lib/supabase')
    await getServiceClient().from('solicitudes_moderadoras').delete().eq('id', id)
    setSolicitudes((prev) => prev.filter((s) => s.id !== id))
  }

  async function deleteCase(id: string) {
    if (!confirm('¿Eliminar este caso definitivamente?')) return
    const { getServiceClient } = await import('@/lib/supabase')
    await getServiceClient().from('cases').delete().eq('id', id)
    setSimpleCases((prev) => prev.filter((c) => c.id !== id))
  }

  if (!auth) {
    return (
      <div
        style={{ background: '#0d0d12', minHeight: '100vh' }}
        className="flex items-center justify-center"
      >
        <div
          style={{ background: '#1a1a24', border: '1px solid #2a2a3a' }}
          className="rounded-2xl p-10 w-full max-w-sm"
        >
          <h1
            style={{
              background: 'linear-gradient(135deg, #f472b6, #a855f7)',
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
                background: '#13131a',
                border: '1px solid #2a2a3a',
                color: '#f0eaf5',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #be123c, #ec4899)',
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

  const TABS: { key: Tab; label: string }[] = [
    { key: 'validar', label: 'Por validar' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'aprobado', label: 'Aprobados' },
    { key: 'rechazado', label: 'Rechazados' },
    { key: 'solicitudes', label: 'Solicitudes moderadoras' },
  ]

  return (
    <div style={{ background: '#0d0d12', minHeight: '100vh' }}>
      <nav
        style={{ background: '#13131a', borderBottom: '1px solid #2a2a3a' }}
        className="sticky top-0 z-10 px-6 h-14 flex items-center justify-between"
      >
        <span
          style={{
            background: 'linear-gradient(135deg, #f472b6, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          className="font-bold"
        >
          cuidado amiga — Admin
        </span>
        <a href="/" style={{ color: '#9d8fad' }} className="text-sm hover:text-white">
          Ver mapa →
        </a>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: tab === t.key ? '#1a1a24' : 'transparent',
                border: `1px solid ${tab === t.key ? '#2a2a3a' : 'transparent'}`,
                color: tab === t.key ? '#f0eaf5' : '#9d8fad',
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
              <div key={i} style={{ background: '#1a1a24', border: '1px solid #2a2a3a' }} className="rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        ) : tab === 'validar' ? (
          <ValidarSection
            cases={cases}
            rejectMotivo={rejectMotivo}
            setRejectMotivo={setRejectMotivo}
            onVotar={votar}
          />
        ) : tab === 'solicitudes' ? (
          <SolicitudesSection solicitudes={solicitudes} onDelete={deleteSolicitud} />
        ) : (
          <CasesSection cases={simpleCases} onDelete={deleteCase} />
        )}
      </main>
    </div>
  )
}

function ValidarSection({
  cases,
  rejectMotivo,
  setRejectMotivo,
  onVotar,
}: {
  cases: CaseWithValidaciones[]
  rejectMotivo: Record<string, string>
  setRejectMotivo: (fn: (prev: Record<string, string>) => Record<string, string>) => void
  onVotar: (id: string, d: 'aprobado' | 'rechazado') => void
}) {
  if (cases.length === 0) {
    return <p style={{ color: '#9d8fad' }} className="text-sm text-center py-12">No hay casos pendientes de validación</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {cases.map((c) => {
        const color = CASE_TYPE_COLORS[c.tipo]
        const aprobados = c.validaciones.filter((v) => v.decision === 'aprobado').length
        const rechazados = c.validaciones.filter((v) => v.decision === 'rechazado').length
        const yaVotó = !!c.mi_voto

        return (
          <div key={c.id} style={{ background: '#1a1a24', border: '1px solid #2a2a3a' }} className="rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ background: color + '22', color, border: `1px solid ${color}55` }} className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {CASE_TYPE_LABELS[c.tipo]}
                  </span>
                  <span style={{ color: '#9d8fad' }} className="text-xs">{c.fecha} · {c.pais}</span>
                </div>
                <h3 style={{ color: '#f0eaf5' }} className="font-semibold">{c.nombre}</h3>
                {c.descripcion && <p style={{ color: '#9d8fad' }} className="text-xs mt-1 line-clamp-2">{c.descripcion}</p>}
              </div>
              <div
                style={{
                  background: '#0d0d12',
                  border: '1px solid #2a2a3a',
                  borderRadius: 8,
                  padding: '8px 16px',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ color: '#22c55e', fontSize: 18, fontWeight: 700 }}>{aprobados}</div>
                <div style={{ color: '#9d8fad', fontSize: 10 }}>de 3</div>
                {rechazados > 0 && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{rechazados} rechazo{rechazados > 1 ? 's' : ''}</div>}
              </div>
            </div>

            {yaVotó ? (
              <div
                style={{
                  background: c.mi_voto!.decision === 'aprobado' ? '#22c55e11' : '#ef444411',
                  border: `1px solid ${c.mi_voto!.decision === 'aprobado' ? '#22c55e33' : '#ef444433'}`,
                  color: c.mi_voto!.decision === 'aprobado' ? '#86efac' : '#fca5a5',
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium"
              >
                Ya votaste: {c.mi_voto!.decision === 'aprobado' ? 'Aprobado ✓' : `Rechazado — ${c.mi_voto!.motivo_rechazo || 'sin motivo'}`}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  placeholder="Motivo de rechazo (opcional)"
                  value={rejectMotivo[c.id] || ''}
                  onChange={(e) => setRejectMotivo((prev) => ({ ...prev, [c.id]: e.target.value }))}
                  style={{
                    background: '#13131a',
                    border: '1px solid #2a2a3a',
                    color: '#f0eaf5',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 13,
                    outline: 'none',
                    width: '100%',
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => onVotar(c.id, 'aprobado')}
                    style={{ background: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e44' }}
                    className="flex-1 text-sm font-semibold py-2 rounded-lg hover:opacity-80 transition-opacity"
                  >
                    ✓ Aprobar
                  </button>
                  <button
                    onClick={() => onVotar(c.id, 'rechazado')}
                    style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' }}
                    className="flex-1 text-sm font-semibold py-2 rounded-lg hover:opacity-80 transition-opacity"
                  >
                    ✗ Rechazar
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function CasesSection({ cases, onDelete }: { cases: Case[]; onDelete: (id: string) => void }) {
  if (cases.length === 0) {
    return <p style={{ color: '#9d8fad' }} className="text-sm text-center py-12">No hay casos en esta categoría</p>
  }
  return (
    <div className="flex flex-col gap-3">
      {cases.map((c) => {
        const color = CASE_TYPE_COLORS[c.tipo]
        return (
          <div key={c.id} style={{ background: '#1a1a24', border: '1px solid #2a2a3a' }} className="rounded-xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span style={{ background: color + '22', color, border: `1px solid ${color}55` }} className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {CASE_TYPE_LABELS[c.tipo]}
                </span>
                <span style={{ color: '#9d8fad' }} className="text-xs">{c.fecha} · {c.pais}</span>
              </div>
              <h3 style={{ color: '#f0eaf5' }} className="font-semibold">{c.nombre}</h3>
            </div>
            <button
              onClick={() => onDelete(c.id)}
              style={{ color: '#9d8fad' }}
              className="text-xs px-3 py-1.5 rounded-full hover:text-red-400 transition-colors flex-shrink-0"
            >
              Eliminar
            </button>
          </div>
        )
      })}
    </div>
  )
}

function SolicitudesSection({ solicitudes, onDelete }: { solicitudes: SolicitudModeradora[]; onDelete: (id: string) => void }) {
  if (solicitudes.length === 0) {
    return <p style={{ color: '#9d8fad' }} className="text-sm text-center py-12">No hay solicitudes pendientes</p>
  }
  return (
    <div className="flex flex-col gap-3">
      {solicitudes.map((s) => (
        <div key={s.id} style={{ background: '#1a1a24', border: '1px solid #2a2a3a' }} className="rounded-xl p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 style={{ color: '#f0eaf5' }} className="font-semibold">{s.nombre}</h3>
              <p style={{ color: '#9d8fad' }} className="text-xs mt-0.5">
                <a href={`mailto:${s.mail}`} style={{ color: '#ec4899' }}>{s.mail}</a>
                {' · '}{s.pais}
                {s.organizacion && ` · ${s.organizacion}`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                style={{
                  background: '#9333ea22',
                  color: '#c084fc',
                  border: '1px solid #9333ea44',
                  fontSize: 10,
                  fontWeight: 700,
                }}
                className="px-2 py-0.5 rounded-full uppercase"
              >
                {s.estado}
              </span>
              <button
                onClick={() => onDelete(s.id)}
                style={{ color: '#9d8fad' }}
                className="text-xs px-2 py-1 rounded hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
          <p style={{ color: '#9d8fad', fontSize: 12, marginBottom: 6 }}>
            <strong style={{ color: '#e2e8f0' }}>Por qué quiere moderar:</strong> {s.motivo}
          </p>
          <p style={{ color: '#9d8fad', fontSize: 12 }}>
            <strong style={{ color: '#e2e8f0' }}>Cómo se enteró:</strong> {s.como_se_entero}
          </p>
          <p style={{ color: '#4a4a6a', fontSize: 11, marginTop: 8 }}>
            {new Date(s.creado_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
      ))}
    </div>
  )
}
