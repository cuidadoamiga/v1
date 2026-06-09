'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Case, Validacion, SolicitudModeradora, CASE_TYPE_COLORS, CASE_TYPE_LABELS, COUNTRIES } from '@/types'

const OWNER_EMAIL = 'cuidadoamiga@proton.me'

type Tab = 'validar' | 'pendiente' | 'aprobado' | 'rechazado' | 'solicitudes' | 'crear'

interface CaseWithValidaciones extends Case {
  validaciones: Validacion[]
  mi_voto: Validacion | null
}

interface EditForm {
  nombre: string
  victima: string
  fecha: string
  tipo: string
  pais: string
  ciudad: string
  descripcion: string
  foto_url: string
  fuentes: string
  proceso_judicial: string
  estado: string
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
  const [editingCase, setEditingCase] = useState<Case | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [editSaving, setEditSaving] = useState(false)
  const router = useRouter()

  const isOwner = userEmail === OWNER_EMAIL

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
    if (!confirm('¿Eliminar este caso definitivamente? Esta acción no se puede deshacer.')) return
    const supabase = createClient()
    await supabase.from('cases').delete().eq('id', id)
    setCases((prev) => prev.filter((c) => c.id !== id))
    setSimpleCases((prev) => prev.filter((c) => c.id !== id))
  }

  function openEdit(c: Case) {
    setEditingCase(c)
    setEditForm({
      nombre: c.nombre || '',
      victima: (c as any).victima || '',
      fecha: c.fecha || '',
      tipo: c.tipo || 'femicidio',
      pais: c.pais || '',
      ciudad: c.ciudad || '',
      descripcion: c.descripcion || '',
      foto_url: c.foto_url || '',
      fuentes: Array.isArray(c.fuentes) ? c.fuentes.join('\n') : '',
      proceso_judicial: (c as any).proceso_judicial || '',
      estado: c.estado || 'pendiente',
    })
  }

  async function saveEdit() {
    if (!editingCase || !editForm) return
    setEditSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('cases').update({
      nombre: editForm.nombre,
      victima: editForm.victima || null,
      fecha: editForm.fecha,
      tipo: editForm.tipo,
      pais: editForm.pais,
      ciudad: editForm.ciudad || null,
      descripcion: editForm.descripcion,
      foto_url: editForm.foto_url || null,
      fuentes: editForm.fuentes.split('\n').map(s => s.trim()).filter(Boolean),
      proceso_judicial: editForm.proceso_judicial || null,
      estado: editForm.estado,
    } as any).eq('id', editingCase.id)

    if (error) {
      alert('Error al guardar: ' + error.message)
    } else {
      setEditingCase(null)
      setEditForm(null)
      fetchData()
    }
    setEditSaving(false)
  }

  const TABS: { key: Tab; label: string; ownerOnly?: boolean }[] = [
    { key: 'validar', label: 'Por validar' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'aprobado', label: 'Aprobados' },
    { key: 'rechazado', label: 'Rechazados' },
    { key: 'solicitudes', label: 'Solicitudes' },
    { key: 'crear', label: '+ Crear caso', ownerOnly: true },
  ]

  if (!userId) {
    return (
      <div style={{ background: '#0d0d12', minHeight: '100vh' }} className="flex items-center justify-center">
        <div style={{ color: '#9d8fad', fontSize: 14 }}>Verificando acceso...</div>
      </div>
    )
  }

  const inputStyle = {
    background: '#13131a',
    border: '1px solid #2a2a3a',
    color: '#f0eaf5',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    outline: 'none',
    width: '100%',
  }
  const labelStyle = {
    color: '#9d8fad',
    fontSize: 11,
    fontWeight: 600 as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 4,
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
          {TABS.filter(t => !t.ownerOnly || isOwner).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: tab === t.key ? (t.key === 'crear' ? 'linear-gradient(135deg,#be123c,#ec4899)' : '#1a1a24') : 'transparent',
                border: `1px solid ${tab === t.key ? (t.key === 'crear' ? 'transparent' : '#2a2a3a') : (t.key === 'crear' ? '#be123c55' : 'transparent')}`,
                color: tab === t.key ? '#f0eaf5' : (t.key === 'crear' ? '#f472b6' : '#9d8fad'),
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
          <ValidarSection cases={cases} rejectMotivo={rejectMotivo} setRejectMotivo={setRejectMotivo} onVotar={votar} isOwner={isOwner} onEdit={openEdit} onDelete={deleteCase} />
        ) : tab === 'solicitudes' ? (
          <SolicitudesSection solicitudes={solicitudes} onDelete={deleteSolicitud} />
        ) : tab === 'crear' && isOwner ? (
          <CreateCaseSection onCreated={() => { setTab('aprobado'); fetchData() }} />
        ) : (
          <CasesSection cases={simpleCases} isOwner={isOwner} onEdit={openEdit} onDelete={deleteCase} />
        )}
      </main>

      {/* Modal de edición */}
      {editingCase && editForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, overflowY: 'auto' }}
          className="flex items-start justify-center p-4 pt-8"
          onClick={(e) => { if (e.target === e.currentTarget) { setEditingCase(null); setEditForm(null) } }}
        >
          <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 16, width: '100%', maxWidth: 560 }} className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 style={{ color: '#f0eaf5', fontWeight: 700, fontSize: 16 }}>Editar caso</h2>
              <button onClick={() => { setEditingCase(null); setEditForm(null) }} style={{ color: '#9d8fad', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>

            <div>
              <label style={labelStyle}>Nombre del agresor</label>
              <input style={inputStyle} value={editForm.nombre} onChange={e => setEditForm(f => f && ({ ...f, nombre: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Nombre de la víctima</label>
              <input style={inputStyle} value={editForm.victima} onChange={e => setEditForm(f => f && ({ ...f, victima: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Fecha</label>
                <input type="date" style={inputStyle} value={editForm.fecha} onChange={e => setEditForm(f => f && ({ ...f, fecha: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Tipo</label>
                <select style={inputStyle} value={editForm.tipo} onChange={e => setEditForm(f => f && ({ ...f, tipo: e.target.value }))}>
                  <option value="femicidio">Femicidio</option>
                  <option value="abuso">Abuso</option>
                  <option value="acoso">Acoso</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>País</label>
                <select style={inputStyle} value={editForm.pais} onChange={e => setEditForm(f => f && ({ ...f, pais: e.target.value }))}>
                  <option value="">— seleccionar —</option>
                  {Object.entries(COUNTRIES).map(([code, name]) => (
                    <option key={code} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Ciudad</label>
                <input style={inputStyle} value={editForm.ciudad} onChange={e => setEditForm(f => f && ({ ...f, ciudad: e.target.value }))} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Descripción</label>
              <textarea style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }} value={editForm.descripcion} onChange={e => setEditForm(f => f && ({ ...f, descripcion: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>URL foto del agresor</label>
              <input style={inputStyle} value={editForm.foto_url} onChange={e => setEditForm(f => f && ({ ...f, foto_url: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Fuentes (una por línea)</label>
              <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={editForm.fuentes} onChange={e => setEditForm(f => f && ({ ...f, fuentes: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Proceso judicial</label>
                <select style={inputStyle} value={editForm.proceso_judicial} onChange={e => setEditForm(f => f && ({ ...f, proceso_judicial: e.target.value }))}>
                  <option value="">No especificado</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Estado</label>
                <select style={inputStyle} value={editForm.estado} onChange={e => setEditForm(f => f && ({ ...f, estado: e.target.value }))}>
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={saveEdit}
                disabled={editSaving}
                style={{ background: 'linear-gradient(135deg, #be123c, #ec4899)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: editSaving ? 'not-allowed' : 'pointer', opacity: editSaving ? 0.7 : 1, flex: 1 }}
              >
                {editSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                onClick={() => { setEditingCase(null); setEditForm(null) }}
                style={{ background: 'transparent', color: '#9d8fad', border: '1px solid #2a2a3a', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ValidarSection({ cases, rejectMotivo, setRejectMotivo, onVotar, isOwner, onEdit, onDelete }: {
  cases: CaseWithValidaciones[]
  rejectMotivo: Record<string, string>
  setRejectMotivo: (fn: (prev: Record<string, string>) => Record<string, string>) => void
  onVotar: (id: string, d: 'aprobado' | 'rechazado') => void
  isOwner: boolean
  onEdit: (c: Case) => void
  onDelete: (id: string) => void
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
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {c.foto_url && (
                  <img src={c.foto_url} alt={c.nombre} referrerPolicy="no-referrer" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid #2a2a3a' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                )}
                <div style={{ background: '#0d0d12', border: '1px solid #2a2a3a', borderRadius: 8, padding: '8px 16px', textAlign: 'center' }}>
                  <div style={{ color: '#22c55e', fontSize: 18, fontWeight: 700 }}>{aprobados}</div>
                  <div style={{ color: '#9d8fad', fontSize: 10 }}>de 3</div>
                  {rechazados > 0 && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{rechazados} rechazo{rechazados > 1 ? 's' : ''}</div>}
                </div>
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

            {isOwner && (
              <div style={{ borderTop: '1px solid #2a2a3a', marginTop: 12, paddingTop: 12 }} className="flex gap-2">
                <button onClick={() => onEdit(c)} style={{ background: '#3b82f611', color: '#93c5fd', border: '1px solid #3b82f633', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  ✏ Editar
                </button>
                <button onClick={() => onDelete(c.id)} style={{ background: '#ef444411', color: '#fca5a5', border: '1px solid #ef444433', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  🗑 Eliminar
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function CasesSection({ cases, isOwner, onEdit, onDelete }: { cases: Case[]; isOwner: boolean; onEdit: (c: Case) => void; onDelete: (id: string) => void }) {
  if (!cases.length) return <p style={{ color: '#9d8fad' }} className="text-sm text-center py-12">No hay casos en esta categoría</p>
  return (
    <div className="flex flex-col gap-3">
      {cases.map((c) => {
        const color = CASE_TYPE_COLORS[c.tipo]
        return (
          <div key={c.id} style={{ background: '#1a1a24', border: '1px solid #2a2a3a' }} className="rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ background: color + '22', color, border: `1px solid ${color}55` }} className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{CASE_TYPE_LABELS[c.tipo]}</span>
                  <span style={{ color: '#9d8fad' }} className="text-xs">{c.fecha} · {c.pais}{c.ciudad ? `, ${c.ciudad}` : ''}</span>
                </div>
                <h3 style={{ color: '#f0eaf5' }} className="font-semibold">{c.nombre}</h3>
                {c.victima && <p style={{ color: '#c084fc', fontSize: 12, marginTop: 2 }}>Víctima: {c.victima}</p>}
                {(c as any).proceso_judicial && (
                  <span style={{ background: (c as any).proceso_judicial === 'cerrado' ? '#22c55e22' : '#f9731622', color: (c as any).proceso_judicial === 'cerrado' ? '#86efac' : '#fdba74', border: `1px solid ${(c as any).proceso_judicial === 'cerrado' ? '#22c55e44' : '#f9731644'}`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, display: 'inline-block', marginTop: 4 }}>
                    {(c as any).proceso_judicial === 'cerrado' ? 'Proceso cerrado' : 'En proceso'}
                  </span>
                )}
              </div>
              {c.foto_url && (
                <img src={c.foto_url} alt={c.nombre} referrerPolicy="no-referrer" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid #2a2a3a' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
              )}
            </div>
            {isOwner && (
              <div style={{ borderTop: '1px solid #2a2a3a', marginTop: 12, paddingTop: 12 }} className="flex gap-2">
                <button onClick={() => onEdit(c)} style={{ background: '#3b82f611', color: '#93c5fd', border: '1px solid #3b82f633', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  ✏ Editar
                </button>
                <button onClick={() => onDelete(c.id)} style={{ background: '#ef444411', color: '#fca5a5', border: '1px solid #ef444433', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  🗑 Eliminar
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`, { headers: { 'Accept-Language': 'es' } })
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    return null
  } catch { return null }
}

function CreateCaseSection({ onCreated }: { onCreated: () => void }) {
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
            <button onClick={() => onDelete(s.id)} style={{ color: '#9d8fad', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }} className="hover:text-red-400 transition-colors flex-shrink-0">×</button>
          </div>
          <p style={{ color: '#9d8fad', fontSize: 12, marginBottom: 6 }}><strong style={{ color: '#e2e8f0' }}>Por qué quiere moderar:</strong> {s.motivo}</p>
          <p style={{ color: '#9d8fad', fontSize: 12 }}><strong style={{ color: '#e2e8f0' }}>Cómo se enteró:</strong> {s.como_se_entero}</p>
          <p style={{ color: '#4a4a6a', fontSize: 11, marginTop: 8 }}>{new Date(s.creado_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      ))}
    </div>
  )
}
