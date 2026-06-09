import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { SolicitudInsertSchema } from '@/lib/schemas/solicitud'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Escapa caracteres HTML para prevenir XSS en el cuerpo del mail */
function esc(str: unknown): string {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .slice(0, 1000)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsed = SolicitudInsertSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Datos inválidos' }, { status: 400 })
  }
  const { nombre, mail, pais, organizacion, motivo, como_se_entero } = parsed.data

  // Guardar en Supabase usando service role (inserción de datos no sensibles)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: dbError } = await supabase.from('solicitudes_moderadoras').insert({
    nombre, mail, pais,
    organizacion: organizacion ?? null,
    motivo, como_se_entero,
    estado: 'pendiente',
  })

  if (dbError) {
    console.error('DB error solicitud:', dbError)
    return NextResponse.json({ error: 'Error al guardar la solicitud.' }, { status: 500 })
  }

  // Enviar mail con campos escapados para prevenir XSS
  const { error: mailError } = await resend.emails.send({
    from: 'Cuidado Amiga <noreply@cuidadoamiga.com>',
    to: process.env.NEXT_PUBLIC_OWNER_EMAIL ?? 'cuidadoamiga@proton.me',
    subject: `Nueva solicitud de moderadora — ${esc(nombre)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #be123c;">Nueva solicitud de moderadora</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Nombre / alias</td>
            <td style="padding: 8px 0; font-weight: 600;">${esc(nombre)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Mail</td>
            <td style="padding: 8px 0;"><a href="mailto:${esc(mail)}">${esc(mail)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">País</td>
            <td style="padding: 8px 0;">${esc(pais)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Organización</td>
            <td style="padding: 8px 0;">${organizacion ? esc(organizacion) : '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Cómo se enteró</td>
            <td style="padding: 8px 0;">${esc(como_se_entero)}</td>
          </tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #be123c;">
          <p style="margin: 0; color: #64748b; font-size: 13px; margin-bottom: 6px;">Por qué quiere ser moderadora:</p>
          <p style="margin: 0;">${esc(motivo)}</p>
        </div>
      </div>
    `,
  })

  if (mailError) {
    console.error('Error enviando mail:', mailError)
    // La solicitud se guardó igual — el mail es secundario
  }

  return NextResponse.json({ ok: true })
}
