import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const VALID_TIPOS = ['femicidio', 'abuso', 'acoso']
const VALID_PROCESOS = ['en_proceso', 'cerrado', null, '']
const MAX_TEXT = 2000
const MAX_URL = 500

function sanitize(str: unknown, max = 500): string {
  if (typeof str !== 'string') return ''
  return str.trim().slice(0, max).replace(/<[^>]*>/g, '') // strip HTML tags
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validación estricta de campos
    const nombre = sanitize(body.nombre, 200)
    const victima = sanitize(body.victima, 200)
    const fecha = sanitize(body.fecha, 20)
    const tipo = sanitize(body.tipo, 20)
    const pais = sanitize(body.pais, 100)
    const ciudad = sanitize(body.ciudad, 100)
    const descripcion = sanitize(body.descripcion, MAX_TEXT)
    const foto_url = sanitize(body.foto_url, MAX_URL)
    const proceso_judicial = sanitize(body.proceso_judicial, 20) || null
    const lat = typeof body.lat === 'number' ? body.lat : null
    const lng = typeof body.lng === 'number' ? body.lng : null

    // Validaciones obligatorias
    if (!nombre) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
    if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 })
    if (!VALID_TIPOS.includes(tipo)) return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    if (!pais) return NextResponse.json({ error: 'País requerido' }, { status: 400 })
    if (!ciudad) return NextResponse.json({ error: 'Ciudad requerida' }, { status: 400 })
    if (lat === null || lng === null) return NextResponse.json({ error: 'Coordenadas requeridas' }, { status: 400 })
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return NextResponse.json({ error: 'Coordenadas inválidas' }, { status: 400 })
    if (proceso_judicial && !VALID_PROCESOS.includes(proceso_judicial)) return NextResponse.json({ error: 'Proceso judicial inválido' }, { status: 400 })
    if (foto_url && !isValidUrl(foto_url)) return NextResponse.json({ error: 'URL de foto inválida' }, { status: 400 })

    // Validar fuentes
    const rawFuentes = Array.isArray(body.fuentes) ? body.fuentes : []
    const fuentes = rawFuentes
      .map((f: unknown) => sanitize(f, MAX_URL))
      .filter((f: string) => f && isValidUrl(f))
      .slice(0, 10) // máx 10 fuentes

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('cases').insert({
      nombre,
      victima: victima || null,
      fecha,
      tipo,
      pais,
      ciudad: ciudad || null,
      descripcion,
      foto_url: foto_url || null,
      fuentes,
      proceso_judicial: proceso_judicial || null,
      lat,
      lng,
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
