import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        background: '#0d0d12',
        borderTop: '1px solid #1a1a24',
        color: '#9d8fad',
      }}
      className="px-6 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          <div>
            <span
              style={{
                background: 'linear-gradient(135deg, #be123c, #9333ea)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
                fontSize: 20,
                display: 'block',
                marginBottom: 8,
              }}
            >
              cuidadoamiga
            </span>
            <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 340 }}>
              Proyecto de código abierto. Los datos son responsabilidad de las moderadoras verificadas.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { href: '/como-funciona', label: 'Cómo funciona' },
              { href: '/protocolo', label: 'Protocolo' },
              { href: '/unirse', label: 'Unirse' },
              { href: 'mailto:cuidadoamiga@proton.me', label: 'Contacto' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ color: '#9d8fad', fontSize: 14 }}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          style={{ borderTop: '1px solid #1a1a24', paddingTop: 20 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <a
            href="mailto:cuidadoamiga@proton.me"
            style={{ color: '#ec4899', fontSize: 13 }}
            className="hover:underline"
          >
            cuidadoamiga@proton.me
          </a>
          <a
            href="https://github.com/cuidadoamiga/v1"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#9d8fad', fontSize: 13 }}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
