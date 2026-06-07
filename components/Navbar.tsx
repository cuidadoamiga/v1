'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            style={{
              background: 'linear-gradient(135deg, var(--rose), var(--violet))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="text-xl font-bold tracking-tight"
          >
            amiga cuidado
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/cases/new"
            style={{
              background: 'linear-gradient(135deg, var(--rose), var(--pink))',
              color: 'white',
            }}
            className="text-sm font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
          >
            + Reportar caso
          </Link>
          <Link
            href="/unirse"
            style={{ color: 'var(--text-secondary)' }}
            className="text-sm hover:text-gray-900 transition-colors"
          >
            Unirse
          </Link>
          <Link
            href="/admin"
            style={{ color: 'var(--text-secondary)' }}
            className="text-sm hover:text-gray-900 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
