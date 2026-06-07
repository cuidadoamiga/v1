'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('') // email o username
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    let email = identifier.trim()

    // Si no tiene @, buscar el email por username
    if (!email.includes('@')) {
      const res = await fetch('/api/auth/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email }),
      })
      if (!res.ok) {
        setError('Usuario o contraseña incorrectos.')
        setLoading(false)
        return
      }
      const data = await res.json()
      email = data.email
    }

    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })

    if (err) {
      setError('Usuario o contraseña incorrectos.')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  const inputStyle = {
    background: '#13131a',
    border: '1px solid #2a2a3a',
    color: '#f0eaf5',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    outline: 'none',
    width: '100%',
  }

  return (
    <div
      style={{ background: '#0d0d12', minHeight: '100vh' }}
      className="flex items-center justify-center px-4"
    >
      <div
        style={{ background: '#1a1a24', border: '1px solid #2a2a3a' }}
        className="rounded-2xl p-10 w-full max-w-sm"
      >
        <h1
          style={{
            background: 'linear-gradient(135deg, #f472b6, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          className="text-2xl font-bold mb-1 text-center"
        >
          cuidado amiga
        </h1>
        <p style={{ color: '#9d8fad', fontSize: 13 }} className="text-center mb-8">
          Panel de moderación
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email o usuario"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={inputStyle}
          />

          {error && (
            <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#2a2a3a' : 'linear-gradient(135deg, #be123c, #ec4899)',
              color: loading ? '#9d8fad' : 'white',
              border: 'none',
              borderRadius: 999,
              padding: '11px',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
