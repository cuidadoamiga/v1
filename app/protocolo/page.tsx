import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Protocolo de moderación — Amiga Cuidado',
}

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mb-10">
    <h2
      style={{
        color: '#ec4899',
        fontSize: 13,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 16,
      }}
    >
      {title}
    </h2>
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            color: '#e2e8f0',
            fontSize: 15,
            lineHeight: 1.7,
            paddingLeft: 20,
            marginBottom: 10,
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              color: '#9333ea',
              fontWeight: 700,
            }}
          >
            —
          </span>
          {item}
        </li>
      ))}
    </ul>
  </div>
)

export default function ProtocoloPage() {
  return (
    <div style={{ background: '#0d0d12', minHeight: '100vh' }}>
      <nav
        style={{
          background: '#13131a',
          borderBottom: '1px solid #2a2a3a',
        }}
        className="sticky top-0 z-10 px-6 h-14 flex items-center justify-between"
      >
        <Link
          href="/"
          style={{ color: '#9d8fad' }}
          className="text-sm hover:text-white transition-colors"
        >
          ← Volver
        </Link>
        <Link
          href="/unirse"
          style={{
            background: 'linear-gradient(135deg, #be123c, #ec4899)',
            color: 'white',
          }}
          className="text-sm font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Quiero ser moderadora
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span
            style={{
              background: '#9333ea22',
              color: '#c084fc',
              border: '1px solid #9333ea55',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '4px 12px',
              borderRadius: 999,
              display: 'inline-block',
              marginBottom: 16,
            }}
          >
            Documento público
          </span>
          <h1
            style={{
              background: 'linear-gradient(135deg, #f472b6, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: 36,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            Protocolo de moderación
          </h1>
          <p style={{ color: '#9d8fad', fontSize: 15, lineHeight: 1.7 }}>
            Este documento define los criterios y conductas que rigen el trabajo de las moderadoras de Amiga Cuidado.
            Es de lectura obligatoria antes de solicitar acceso.
          </p>
        </div>

        <div
          style={{
            background: '#1a1a24',
            border: '1px solid #2a2a3a',
            borderRadius: 16,
            padding: '32px 40px',
          }}
        >
          <Section
            title="Criterios para publicar un caso"
            items={[
              'Debe tener al menos una fuente pública verificable: nota periodística, denuncia oficial, u organización reconocida.',
              'No se publican casos sin nombre o sin fecha confirmada.',
              'La foto debe ser pública — no tomada de redes sociales privadas.',
            ]}
          />

          <div
            style={{
              height: 1,
              background: '#2a2a3a',
              margin: '0 0 32px',
            }}
          />

          <Section
            title="Lo que nunca se publica"
            items={[
              'Datos de menores de edad.',
              'Dirección exacta del domicilio de la víctima o su familia.',
              'Información que pueda poner en riesgo a familiares o testigos.',
            ]}
          />

          <div style={{ height: 1, background: '#2a2a3a', margin: '0 0 32px' }} />

          <Section
            title="Conducta de las moderadoras"
            items={[
              'Confidencialidad sobre los datos que manejan.',
              'No compartir capturas del panel de administración.',
              'Reportar cualquier intento de manipulación o presión externa.',
            ]}
          />

          <div style={{ height: 1, background: '#2a2a3a', margin: '0 0 32px' }} />

          <Section
            title="Causas de baja como moderadora"
            items={[
              'Publicar casos sin validación completa de las 3 moderadoras.',
              'Filtrar información sensible.',
              'Inactividad prolongada sin aviso previo.',
            ]}
          />
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/unirse"
            style={{
              background: 'linear-gradient(135deg, #be123c, #ec4899)',
              color: 'white',
              display: 'inline-block',
              padding: '12px 32px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Quiero ser moderadora →
          </Link>
        </div>
      </main>
    </div>
  )
}
