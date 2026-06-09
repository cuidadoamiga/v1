'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Case, Validacion, SolicitudModeradora, COUNTRIES } from '@/types'
import { ValidarSection } from '@/components/admin/ValidarSection'
import { CasesSection } from '@/components/admin/CasesSection'
import { CreateCaseSection } from '@/components/admin/CreateCaseSection'
import { SolicitudesSection } from '@/components/admin/SolicitudesSection'

// Fallback solo en dev. En prod se usa la tabla moderators (role = 'owner')
const OWNER_EMAIL_FALLBACK = process.env.NEXT_PUBLIC_OWNER_EMAIL ?? ''

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
  const [isOwner, setIsOwner] = useState(false)
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

  // isOwner se setea via moderators table en el useEffect de auth

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/admin/login')
        return
      }
      setUserId(data.user.id)
      setUserEmail(data.user.email || '')

      // Chequear rol real desde la tabla moderators
      const { data: modRow } = await supabase
        .from('moderators')
        .select('role')
        .eq('user_id', data.user.id)
        .single()

      if (modRow?.role === 'owner') {
        setIsOwner(true)
      } else {
        // Fallback: comparar email mientras se migra a la tabla moderators
        setIsOwner((data.user.email ?? '') === OWNER_EMAIL_FALLBACK)
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

