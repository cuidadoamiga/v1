'use client'

import { SolicitudModeradora } from '@/types'

interface Props {
  solicitudes: SolicitudModeradora[]
  onDelete: (id: string) => void
}

export function SolicitudesSection({ solicitudes, onDelete }: Props) {
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
