import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { CaseInsertSchema } from '@/lib/schemas/case'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = CaseInsertSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return NextResponse.json(
        { error: firstError?.message ?? 'Datos inválidos' },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Usa anon key — RLS garantiza estado = 'pendiente' en inserts de anon
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.from('cases').insert({
      ...data,
      estado: 'pendiente',
    })

    if (error) {
      console.error('DB insert error:', error)
      return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    console.error('API cases error:', e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
