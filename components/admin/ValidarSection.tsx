'use client'

import { Case, Validacion, CASE_TYPE_COLORS, CASE_TYPE_LABELS } from '@/types'

interface CaseWithValidaciones extends Case {
  validaciones: Validacion[]
  mi_voto: Validacion | null
}

interface Props {
  cases: CaseWithValidaciones[]
  rejectMotivo: Record<string, string>
  setRejectMotivo: (fn: (prev: Record<string, string>) => Record<string, string>) => void
  onVotar: (id: string, d: 'aprobado' | 'rechazado') => void
  isOwner: boolean
  onEdit: (c: Case) => void
  onDelete: (id: string) => void
}

export function ValidarSection({ cases, rejectMotivo, setRejectMotivo, onVotar, isOwner, onEdit, onDelete }: Props) {
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
                {c.proceso_judicial && (
                  <span style={{ background: c.proceso_judicial === 'cerrado' ? '#22c55e22' : '#f9731622', color: c.proceso_judicial === 'cerrado' ? '#86efac' : '#fdba74', border: `1px solid ${c.proceso_judicial === 'cerrado' ? '#22c55e44' : '#f9731644'}`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, display: 'inline-block', marginTop: 4 }}>
                    {c.proceso_judicial === 'cerrado' ? 'Proceso cerrado' : 'En proceso'}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {c.foto_url && <img src={c.foto_url} alt={c.nombre} referrerPolicy="no-referrer" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid #2a2a3a' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />}
                <div style={{ background: '#0d0d12', border: '1px solid #2a2a3a', borderRadius: 8, padding: '8px 16px', textAlign: 'center' }}>
                  <div style={{ color: '#22c55e', fontSize: 18, fontWeight: 700 }}>{aprobados}</div>
                  <div style={{ color: '#9d8fad', fontSize: 10 }}>de 3</div>
                  {rechazados > 0 && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{rechazados} rechazo{rechazados > 1 ? 's' : ''}</div>}
                </div>
              </div>
            </div>

            {c.mi_voto ? (
              <div style={{ background: c.mi_voto.decision === 'aprobado' ? '#22c55e11' : '#ef444411', border: `1px solid ${c.mi_voto.decision === 'aprobado' ? '#22c55e33' : '#ef444433'}`, color: c.mi_voto.decision === 'aprobado' ? '#86efac' : '#fca5a5' }} className="rounded-lg px-4 py-2 text-sm font-medium">
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
                <button onClick={() => onEdit(c)} style={{ background: '#3b82f611', color: '#93c5fd', border: '1px solid #3b82f633', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✏ Editar</button>
                <button onClick={() => onDelete(c.id)} style={{ background: '#ef444411', color: '#fca5a5', border: '1px solid #ef444433', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🗑 Eliminar</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
