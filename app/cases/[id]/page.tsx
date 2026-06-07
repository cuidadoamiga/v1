import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Case, CASE_TYPE_COLORS, CASE_TYPE_LABELS, COUNTRIES, CountryCode } from '@/types'

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('id', id)
    .eq('estado', 'aprobado')
    .single()

  if (error || !data) notFound()

  const c = data as Case
  const color = CASE_TYPE_COLORS[c.tipo]
  const countryName = COUNTRIES[c.pais as CountryCode] ?? c.pais

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <nav
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="sticky top-0 z-10 px-6 h-14 flex items-center"
      >
        <Link
          href="/"
          style={{ color: 'var(--text-secondary)' }}
          className="text-sm hover:text-white transition-colors flex items-center gap-1"
        >
          ← Volver al mapa
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
          className="rounded-2xl overflow-hidden"
        >
          {c.foto_url && (
            <div className="relative h-64 w-full">
              <img
                src={c.foto_url}
                alt={c.nombre}
                className="w-full h-full object-cover"
              />
              <div
                style={{
                  background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 100%)',
                }}
                className="absolute inset-0"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
              {!c.foto_url && (
                <div
                  style={{
                    background: color + '22',
                    border: `1px solid ${color}44`,
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    flexShrink: 0,
                  }}
                >
                  🌸
                </div>
              )}
              <div>
                <span
                  style={{
                    background: color + '22',
                    color,
                    border: `1px solid ${color}66`,
                  }}
                  className="text-xs font-medium px-3 py-1 rounded-full inline-block mb-2"
                >
                  {CASE_TYPE_LABELS[c.tipo]}
                </span>
                <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">
                  {c.nombre}
                </h1>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-1">
                  {c.fecha} · {countryName}
                </p>
              </div>
            </div>

            {c.descripcion && (
              <div className="mb-6">
                <h2 style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-wider mb-2">
                  Descripción
                </h2>
                <p style={{ color: 'var(--text-primary)' }} className="text-sm leading-relaxed">
                  {c.descripcion}
                </p>
              </div>
            )}

            {c.fuentes && c.fuentes.length > 0 && (
              <div>
                <h2 style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-wider mb-2">
                  Fuentes
                </h2>
                <ul className="flex flex-col gap-1">
                  {c.fuentes.map((url, i) => (
                    <li key={i}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--pink)' }}
                        className="text-sm hover:underline break-all"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
