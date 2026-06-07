'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Case, Validacion, SolicitudModeradora, CASE_TYPE_COLORS, CASE_TYPE_LABELS } from '@/types'

type Tab = 'validar' | 'pendiente' | 'aprobado' | 'rechazado' | 'solicitudes'

interface CaseWithValidaciones extends Case {
  validaciones: Validacion[]
  mi_voto: Validacion | null
}

export default function AdminPage() {
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [tab, setTab] = useState<Tab>('validar')
  const [cases, setCases] = useState<CaseWithValidaciones[]>([])
  const [simpleCases, setSimpleCases] = useState<Case[]>([])
  const [solicitudes, setSolicitudes] = useState<SolicitudModeradora[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectMotivo, setRejectMotivo] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/admin/login')
      } else {
        setUserId(data.user.id)
        setUserEmail(data.user.email || '')
      }
    })
  }, [])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  async function fetchData() {
    if (!userId) return
    setLoading(true)
    const supabase = createClient()

    if (tab === 'validar') {
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('*')
        .eq('estado', 'pendiente')
        .order('creado_at', { ascending: true })

      if (casesError) console.error('fetchData cases error:', casesError)

      const casesWithVotes: CaseWithValidaciones[] = []
      for (const c of (casesData || [])) {
        const { data: vals } = await supabase
          .from('validaciones')
          .select('*')
          .eq('caso_id', c.id)
        const validaciones = (vals || []) as Validacion[]
        const mi_voto = validaciones.find((v) => v.moderadora_id === userId) || null
        casesWithVotes.push({ ...c, validaciones, mi_voto })
      }
      setCases(casesWithVotes)
    } else if (tab === 'solicitudes') {
      const { data } = await supabase
        .from('solicitudes_moderadoras')
        .select('*')
        .order('creado_at', { ascending: false })
      setSolicitudes((data || []) as SolicitudModeradora[])
    } else {
      const { data } = await supabase
        .from('cases')
        .select('*')
        .eq('estado', tab)
        .order('creado_at', { ascending: false })
      setSimpleCases((data || []) as Case[])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (userId) fetchData()
  }, [userId, tab])

  async function votar(caseId: string, decision: 'aprobado' | 'rechazado') {
    const supabase = createClient()

    await supabase.from('validaciones').insert({
      caso_id: caseId,
      moderadora_id: userId,
      decision,
      motivo_rechazo: decision === 'rechazado' ? (rejectMotivo[caseId] || null) : null,
    } as any)

    const { data: allVotos } = await supabase.from('validaciones').select('*').eq('caso_id', caseId)
    const votos = (allVotos || []) as Validacion[]

    if (votos.some((v) => v.decision === 'rechazado')) {
      await supabase.from('cases').update({ estado: 'rechazado' }).eq('id', caseId)
    } else if (votos.filter((v) => v.decision === 'aprobado').length >= 3) {
      await supabase.from('cases').update({ estado: 'aprobado' }).eq('id', caseId)
    }

    fetchData()
  }

  async function deleteSolicitud(id: string) {
    if (!confirm('¿Eliminar esta solicitud?')) return
    const supabase = createClient()
    await supabase.from('solicitudes_moderadoras').delete().eq('id', id)
    setSolicitudes((prev) => prev.filter((s) => s.id !== id))
  }

  async function deleteCase(id: string) {
    if (!confirm('¿Eliminar este caso definitivamente?')) return
    const supabase = createClient()
    await supabase.from('cases').delete().eq('id', id)
    setSimpleCases((prev) => prev.filter((c) => c.id !== id))
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'validar', label: 'Por validar' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'aprobado', label: 'Aprobados' },
    { key: 'rechazado', label: 'Rechazados' },
    { key: 'solicitudes', label: 'Solicitudes' },
  ]

  if (!userId) {
    return (
      <div style={{ background: '#0d0d12', minHeight: '100vh' }} className="flex items-center justify-center">
        <div style={{ color: '#9d8fad', fontSize: 14 }}>Verificando acceso...</div>
      </div>
    )
  }

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
        <div className="flex items-center gap-4">
          <span style={{ color: '#9d8fad', fontSize: 13 }}>{userEmail}</span>
          <button
            onClick={logout}
            style={{ color: '#9d8fad', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}
            className="hover:text-white transition-colors"
          >
            Salir
          </button>
          <a href="/" style={{ color: '#9d8fad' }} className="text-sm hover:text-white">
            Ver mapa →
          </a>
        </div>
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
          <ValidarSection cases={cases} rejectMotivo={rejectMotivo} setRejectMotivo={setRejectMotivo} onVotar={votar} />
        ) : tab === 'solicitudes' ? (
          <SolicitudesSection solicitudes={solicitudes} onDelete={deleteSolicitud} />
        ) : (
          <CasesSection cases={simpleCases} onDelete={deleteCase} />
        )}
      </main>
    </div>
  )
}

function ValidarSection({ cases, rejectMotivo, setRejectMotivo, onVotar }: {
  cases: CaseWithValidaciones[]
  rejectMotivo: Record<string, string>
  setRejectMotivo: (fn: (prev: Record<string, string>) => Record<string, string>) => void
  onVotar: (id: string, d: 'aprobado' | 'rechazado') => void
}) {
  if (!cases.length) return <p style={{ color: '#9d8fad' }} className="text-sm text-center py-12">No hay casos pendientes de validación</p>

  return (
    <div className="flex flex-col gap-4">
      {cases.map((c) => {
        const color = CASE_TYPE_COLORS[c.tipo]
        const aprobados = c.validaciones.filter((v) => v.decision === 'aprobado').length
        const rechazados = c.validaciones.filter((v) => v.decision === 'rechazado').length

        return (
          <div key={c.id} style={{ background: '#1a1a24', border: '1px solid #2a2a3a' }} className="rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ background: color + '22', color, border: `1px solid ${color}55` }} className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {CASE_TYPE_LABELS[c.tipo]}
                  </span>
                  <span style={{ color: '#9d8fad' }} className="text-xs">{c.fecha} · {c.pais}{c.ciudad ? `, ${c.ciudad}` : ''}</span>
                </div>
                <h3 style={{ color: '#f0eaf5' }} className="font-semibold">{c.nombre}</h3>
                {c.victima && <p style={{ color: '#c084fc', fontSize: 12, marginTop: 2 }}>Víctima: {c.victima}</p>}
                {(c as any).proceso_judicial && (
                  <span style={{ background: (c as any).proceso_judicial === 'cerrado' ? '#22c55e22' : '#f9731622', color: (c as any).proceso_judicial === 'cerrado' ? '#86efac' : '#fdba74', border: `1px solid ${(c as any).proceso_judicial === 'cerrado' ? '#22c55e44' : '#f9731644'}`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, display: 'inline-block', marginTop: 4 }}>
                    {(c as any).proceso_judicial === 'cerrado' ? 'Proceso cerrado' : 'En proceso'}
                  </span>
                )}
                {c.descripcion && <p style={{ color: '#9d8fad' }} className="text-xs mt-1 line-clamp-2">{c.descripcion}</p>}
                {c.fuentes?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.fuentes.map((f, i) => (
                      <a key={i} href={f} target="_blank" rel="noopener noreferrer" style={{ color: '#ec4899', fontSize: 11 }} className="underline truncate max-w-[200px]">
                        Fuente {i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {c.foto_url && (
                <img
                  src={c.foto_url}
                  alt={c.nombre}
                  referrerPolicy="no-referrer"
                  style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid #2a2a3a' }}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              )}
              <div style={{ background: '#0d0d12', border: '1px solid #2a2a3a', borderRadius: 8, padding: '8px 16px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ color: '#22c55e', fontSize: 18, fontWeight: 700 }}>{aprobados}</div>
                <div style={{ color: '#9d8fad', fontSize: 10 }}>de 3</div>
                {rechazados > 0 && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{rechazados} rechazo{rechazados > 1 ? 's' : ''}</div>}
              </div>
            </div>

            {c.mi_voto ? (
              <div
                style={{
                  background: c.mi_voto.decision === 'aprobado' ? '#22c55e11' : '#ef444411',
                  border: `1px solid ${c.mi_voto.decision === 'aprobado' ? '#22c55e33' : '#ef444433'}`,
                  color: c.mi_voto.decision === 'aprobado' ? '#86efac' : '#fca5a5',
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium"
              >
                Ya votaste: {c.mi_voto.decision === 'aprobado' ? 'Aprobado ✓' : `Rechazado — ${c.mi_voto.motivo_rechazo || 'sin motivo'}`}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  placeholder="Motivo de rechazo (opcional)"
                  value={rejectMotivo[c.id] || ''}
                  onChange={(e) => setRejectMotivo((prev) => ({ ...prev, [c.id]: e.target.value }))}
                  style={{ background: '#13131a', border: '1px solid #2a2a3a', color: '#f0eaf5', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', width: '100%' }}
                />
                <div className="flex gap-2">
                  <button onClick={() => onVotar(c.id, 'aprobado')} style={{ background: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e44' }} className="flex-1 text-sm font-semibold py-2 rounded-lg hover:opacity-80 transition-opacity">✓ Aprobar</button>
                  <button onClick={() => onVotar(c.id, 'rechazado')} style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444' }} className="flex-1 text-sm font-semibold py-2 rounded-lg hover:opacity-80 transition-opacity">✗ Rechazar</button>
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
  if (!cases.length) return <p style={{ color: '#9d8fad' }} className="text-sm text-center py-12">No hay casos en esta categoría</p>
  return (
    <div className="flex flex-col gap-3">
      {cases.map((c) => {
        const color = CASE_TYPE_COLORS[c.tipo]
        return (
          <div key={c.id} style={{ background: '#1a1a24', border: '1px solid #2a2a3a' }} className="rounded-xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span style={{ background: color + '22', color, border: `1px solid ${color}55` }} className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{CASE_TYPE_LABELS[c.tipo]}</span>
                <span style={{ color: '#9d8fad' }} className="text-xs">{c.fecha} · {c.pais}</span>
              </div>
              <h3 style={{ color: '#f0eaf5' }} className="font-semibold">{c.nombre}</h3>
            </div>
            <button onClick={() => onDelete(c.id)} style={{ color: '#9d8fad' }} className="text-xs px-3 py-1.5 rounded-full hover:text-red-400 transition-colors flex-shrink-0">Eliminar</button>
          </div>
        )
      })}
    </div>
  )
}

function SolicitudesSection({ solicitudes, onDelete }: { solicitudes: SolicitudModeradora[]; onDelete: (id: string) => void }) {
  if (!solicitudes.length) return <p style={{ color: '#9d8fad' }} className="text-sm text-center py-12">No hay solicitudes pendientes</p>
  return (
    <div className="flex flex-col gap-3">
      {solicitudes.map((s) => (
        <div key={s.id} style={{ background: '#1a1a24', border: '1px solid #2a2a3a' }} className="rounded-xl p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 style={{ color: '#f0eaf5' }} className="font-semibold">{s.nombre}</h3>
              <p style={{ color: '#9d8fad' }} className="text-xs mt-0.5">
                <a href={`mailto:${s.mail}`} style={{ color: '#ec4899' }}>{s.mail}</a>{' · '}{s.pais}
                {s.organizacion && ` · ${s.organizacion}`}
              </p>
            </div>
            <button onClick={() => onDelete(s.id)} style={{ color: '#9d8fad' }} className="text-xs px-2 py-1 rounded hover:text-red-400 transition-colors flex-shrink-0">×</button>
          </div>
          <p style={{ color: '#9d8fad', fontSize: 12, marginBottom: 6 }}><strong style={{ color: '#e2e8f0' }}>Por qué quiere moderar:</strong> {s.motivo}</p>
          <p style={{ color: '#9d8fad', fontSize: 12 }}><strong style={{ color: '#e2e8f0' }}>Cómo se enteró:</strong> {s.como_se_entero}</p>
          <p style={{ color: '#4a4a6a', fontSize: 11, marginTop: 8 }}>{new Date(s.creado_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      ))}
    </div>
  )
}
