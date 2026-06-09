'use client'

import { Case, CASE_TYPE_COLORS, CASE_TYPE_LABELS } from '@/types'

interface Props {
  cases: Case[]
  isOwner: boolean
  onEdit: (c: Case) => void
  onDelete: (id: string) => void
}

export function CasesSection({ cases, isOwner, onEdit, onDelete }: Props) {
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
