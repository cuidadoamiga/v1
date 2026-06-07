import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getServiceClient } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nombre, mail, pais, organizacion, motivo, como_se_entero } = body

  // Guardar en Supabase
  const supabase = getServiceClient()
  const { error: dbError } = await supabase.from('solicitudes_moderadoras').insert({
    nombre,
    mail,
    pais,
    organizacion: organizacion || null,
    motivo,
    como_se_entero,
    estado: 'pendiente',
  })

  if (dbError) {
    return NextResponse.json({ error: 'Error al guardar la solicitud.' }, { status: 500 })
  }

  // Enviar mail
  const { error: mailError } = await resend.emails.send({
    from: 'Amiga Cuidado <noreply@cuidadoamiga.org>',
    to: 'cuidadoamiga@proton.me',
    subject: `Nueva solicitud de moderadora — ${nombre}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #be123c;">Nueva solicitud de moderadora</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Nombre / alias</td><td style="padding: 8px 0; font-weight: 600;">${nombre}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Mail</td><td style="padding: 8px 0;"><a href="mailto:${mail}">${mail}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">País</td><td style="padding: 8px 0;">${pais}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Organización</td><td style="padding: 8px 0;">${organizacion || '—'}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Cómo se enteró</td><td style="padding: 8px 0;">${como_se_entero}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #be123c;">
          <p style="margin: 0; color: #64748b; font-size: 13px; margin-bottom: 6px;">Por qué quiere ser moderadora:</p>
          <p style="margin: 0;">${motivo}</p>
        </div>
      </div>
    `,
  })

  if (mailError) {
    // La solicitud se guardó igual, el mail falló — no es crítico
    console.error('Error enviando mail:', mailError)
  }

  return NextResponse.json({ ok: true })
}
