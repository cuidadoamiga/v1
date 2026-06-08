'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span
              style={{
                background: 'linear-gradient(135deg, var(--rose), var(--violet))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
              }}
              className="text-xl tracking-tight"
            >
              cuidadoamiga
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/como-funciona"
              style={{ color: 'var(--text-secondary)' }}
              className="text-sm hover:text-gray-900 transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              href="/unirse"
              style={{ color: 'var(--text-secondary)' }}
              className="text-sm hover:text-gray-900 transition-colors"
            >
              Unirse
            </Link>
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
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9 rounded-lg"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Menú"
          >
            <span
              style={{
                display: 'block',
                width: 22,
                height: 2,
                background: 'var(--text-primary)',
                borderRadius: 2,
                transition: 'transform 0.2s, opacity 0.2s',
                transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 22,
                height: 2,
                background: 'var(--text-primary)',
                borderRadius: 2,
                transition: 'opacity 0.2s',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: 22,
                height: 2,
                background: 'var(--text-primary)',
                borderRadius: 2,
                transition: 'transform 0.2s, opacity 0.2s',
                transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
          className="md:hidden sticky top-14 z-40 flex flex-col"
        >
          <Link
            href="/como-funciona"
            onClick={() => setOpen(false)}
            style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}
            className="px-6 py-4 text-sm font-medium"
          >
            Cómo funciona
          </Link>
          <Link
            href="/unirse"
            onClick={() => setOpen(false)}
            style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}
            className="px-6 py-4 text-sm font-medium"
          >
            Unirse
          </Link>
          <div className="px-6 py-4">
            <Link
              href="/cases/new"
              onClick={() => setOpen(false)}
              style={{
                background: 'linear-gradient(135deg, var(--rose), var(--pink))',
                color: 'white',
                display: 'block',
                textAlign: 'center',
              }}
              className="text-sm font-semibold px-4 py-3 rounded-xl"
            >
              + Reportar caso
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
