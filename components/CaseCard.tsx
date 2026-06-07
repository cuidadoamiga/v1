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
        className="rounded-xl p-4 hover:border-pink-500/40 transition-all cursor-pointer group"
      >
        <div className="flex items-start gap-3">
          {c.foto_url ? (
            <img
              src={c.foto_url}
              alt={c.nombre}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div
              style={{ background: color + '22', border: `1px solid ${color}44` }}
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
            >
              🌸
            </div>
          )}
          <div className="min-w-0">
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
            </div>
            <h3
              style={{ color: 'var(--text-primary)' }}
              className="font-semibold text-sm truncate group-hover:text-pink-400 transition-colors"
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
