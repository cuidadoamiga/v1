'use client'

import { useState } from 'react'
import Link from 'next/link'

const FAQS = [
  {
    q: '¿Cualquiera puede subir un caso?',
    a: 'Cualquier persona puede reportar un caso, pero ningún caso se publica automáticamente. Pasa por revisión de tres moderadoras independientes antes de aparecer en el mapa.',
  },
  {
    q: '¿Cómo sé que la información es verdadera?',
    a: 'Cada caso requiere al menos una fuente pública verificable para ser aprobado: nota periodística, denuncia oficial o registro de una organización reconocida. Sin fuente no se publica.',
  },
  {
    q: '¿Qué pasa si alguien sube información falsa?',
    a: 'El sistema de triple validación está diseñado para evitar eso. Si un caso falso llegara a publicarse por error, cualquier persona puede reportarlo a cuidadoamiga@proton.me y se da de baja inmediatamente.',
  },
  {
    q: '¿Puedo reportar un caso de mi país aunque el sitio sea de América Latina?',
    a: 'Sí. El sitio documenta casos de todos los países de América Latina y el Caribe.',
  },
  {
    q: '¿Cómo puedo ayudar?',
    a: null, // tiene JSX especial
  },
  {
    q: '¿El sitio está en portugués?',
    a: 'Sí, el sitio funciona en español y portugués.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section style={{ background: '#0d0d12', borderTop: '1px solid #1a1a24' }} className="px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h2
          style={{
            background: 'linear-gradient(135deg, #f472b6, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 24,
            fontWeight: 900,
            marginBottom: 32,
          }}
        >
          Preguntas frecuentes
        </h2>

        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                background: open === i ? '#1a1a24' : '#13131a',
                border: `1px solid ${open === i ? '#2a2a3a' : '#1a1a24'}`,
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'all 0.15s',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '16px 20px' }}
                className="flex items-center justify-between gap-4"
              >
                <span style={{ color: '#f0eaf5', fontSize: 15, fontWeight: 600 }}>{faq.q}</span>
                <span
                  style={{
                    color: '#ec4899',
                    fontSize: 18,
                    fontWeight: 300,
                    flexShrink: 0,
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 0.15s',
                    display: 'inline-block',
                  }}
                >
                  +
                </span>
              </button>

              {open === i && (
                <div style={{ padding: '0 20px 16px', color: '#9d8fad', fontSize: 14, lineHeight: 1.7 }}>
                  {i === 4 ? (
                    <p>
                      Podés reportar casos con fuentes verificadas, convertirte en moderadora desde{' '}
                      <Link href="/unirse" style={{ color: '#ec4899', textDecoration: 'underline' }}>/unirse</Link>
                      , o compartir el sitio con organizaciones feministas de tu país.
                    </p>
                  ) : (
                    <p>{faq.a}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
