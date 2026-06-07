import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

// Dado un username, devuelve el email para poder hacer signInWithPassword
export async function POST(req: NextRequest) {
  const { username } = await req.json()
  if (!username) return NextResponse.json({ error: 'Falta username' }, { status: 400 })

  const client = getServiceClient()
  const { data, error } = await client.auth.admin.listUsers()

  if (error || !data) {
    return NextResponse.json({ error: 'Error buscando usuario' }, { status: 500 })
  }

  const user = data.users.find(
    (u) => u.user_metadata?.username === username
  )

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ email: user.email })
}
