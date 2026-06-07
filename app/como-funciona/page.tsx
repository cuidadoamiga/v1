import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '¿Cómo funciona? — Cuidado Amiga',
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol style={{ margin: 0, padding: 0, listStyle: 'none' }} className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.7, display: 'flex', gap: 12 }}>
          <span style={{
            background: 'linear-gradient(135deg, #be123c, #ec4899)',
            color: 'white',
            fontSize: 11,
            fontWeight: 800,
            width: 22,
            height: 22,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 2,
          }}>{i + 1}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }} className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.7, paddingLeft: 20, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 0, color: '#9333ea', fontWeight: 700 }}>—</span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <h2 style={{
        color: '#ec4899',
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 16,
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default function ComoFuncionaPage() {
  return (
    <div style={{ background: '#0d0d12', minHeight: '100vh' }}>
      <nav style={{ background: '#13131a', borderBottom: '1px solid #2a2a3a' }} className="sticky top-0 z-10 px-6 h-14 flex items-center justify-between">
        <Link href="/" style={{ color: '#9d8fad' }} className="text-sm hover:text-white transition-colors">← Volver</Link>
        <Link href="/unirse" style={{ background: 'linear-gradient(135deg, #be123c, #ec4899)', color: 'white' }} className="text-sm font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity">
          Quiero ser moderadora
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span style={{
            background: '#9333ea22', color: '#c084fc', border: '1px solid #9333ea55',
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            padding: '4px 12px', borderRadius: 999, display: 'inline-block', marginBottom: 16,
          }}>Transparencia</span>
          <h1 style={{
            background: 'linear-gradient(135deg, #f472b6, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontSize: 36, fontWeight: 900, lineHeight: 1.2, marginBottom: 16,
          }}>
            ¿Cómo funciona<br />Cuidado Amiga?
          </h1>
          <p style={{ color: '#9d8fad', fontSize: 15, lineHeight: 1.7 }}>
            Un mapa colaborativo con verificación independiente. Así funciona el proceso de cada caso.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 16, padding: '28px 32px' }}>
            <Section title="¿Cómo entra un caso al mapa?">
              <NumberedList items={[
                'Cualquier persona puede reportar un caso desde el botón "+ Reportar caso".',
                'El caso entra en estado pendiente — no se publica automáticamente.',
                'Tres moderadoras verificadas lo revisan de forma independiente.',
                'Para aprobarlo necesita al menos una fuente pública verificable: nota periodística, denuncia oficial o registro de organización reconocida.',
                'Si las tres aprueban → se publica. Si cualquiera rechaza → no se publica.',
                'El caso publicado siempre incluye el link a la fuente original.',
              ]} />
            </Section>
          </div>

          <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 16, padding: '28px 32px' }}>
            <Section title="¿Qué información se publica?">
              <BulletList items={[
                'Nombre completo del agresor',
                'Fecha del hecho',
                'País y ciudad',
                'Tipo de caso (femicidio / abuso / acoso)',
                'Foto (solo si es pública)',
                'Link a la fuente verificada',
              ]} />
            </Section>
          </div>

          <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 16, padding: '28px 32px' }}>
            <Section title="¿Qué NO se acepta?">
              <BulletList items={[
                'Casos sin fuente pública verificable',
                'Casos basados únicamente en testimonio anónimo sin respaldo',
                'Datos de menores de edad',
                'Información que pueda poner en riesgo a familiares o testigos',
                'Denuncias sin fecha confirmada',
              ]} />
            </Section>
          </div>

          <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 16, padding: '28px 32px' }}>
            <Section title="¿Quiénes son las moderadoras?">
              <p style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                Las moderadoras son personas verificadas manualmente por el equipo de Cuidado Amiga. Cada una firma un protocolo de conducta y trabaja de forma independiente.{' '}
                <Link href="/unirse" style={{ color: '#ec4899', textDecoration: 'underline' }}>
                  Para ser moderadora podés enviar tu solicitud desde /unirse.
                </Link>
              </p>
            </Section>
          </div>

          <div style={{ background: '#9333ea18', border: '1px solid #9333ea33', borderRadius: 16, padding: '28px 32px' }}>
            <Section title="Privacidad y datos">
              <p style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                No vendemos ni monetizamos ningún dato personal. Toda la información publicada en el mapa proviene de fuentes públicas verificadas. No almacenamos datos de quienes reportan casos más allá de lo necesario para el proceso de moderación.
              </p>
            </Section>
          </div>

          <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 16, padding: '28px 32px' }}>
            <Section title="¿Qué pasa si un caso tiene un error?">
              <p style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                Si encontrás un error en un caso publicado podés escribirnos a{' '}
                <a href="mailto:cuidadoamiga@proton.me" style={{ color: '#ec4899', textDecoration: 'underline' }}>
                  cuidadoamiga@proton.me
                </a>{' '}
                con el link al caso y el detalle del error. Lo revisamos y corregimos o damos de baja si corresponde.
              </p>
            </Section>
          </div>
        </div>
      </main>
    </div>
  )
}
