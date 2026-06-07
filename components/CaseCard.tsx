import Link from 'next/link'
import { Case, CASE_TYPE_COLORS, CASE_TYPE_LABELS } from '@/types'

export default function CaseCard({ c }: { c: Case }) {
  const color = CASE_TYPE_COLORS[c.tipo]

  return (
    <Link href={`/cases/${c.id}`}>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
        className="rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-start gap-3">
          {c.foto_url ? (
            <img
              src={c.foto_url}
              alt={c.nombre}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                const t = e.currentTarget
                t.style.display = 'none'
                t.nextElementSibling?.removeAttribute('style')
              }}
            />
          ) : (
            <div
              style={{
                background: '#f1f5f9',
                border: '1px solid var(--border)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 20,
              }}
            >
              👤
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                style={{
                  background: color + '18',
                  color,
                  border: `1px solid ${color}44`,
                }}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
              >
                {CASE_TYPE_LABELS[c.tipo]}
              </span>
            </div>
            <h3
              style={{ color: 'var(--text-primary)' }}
              className="font-semibold text-sm truncate group-hover:text-pink-700 transition-colors"
            >
              {c.nombre}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5">
              {c.fecha} · {c.pais}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
