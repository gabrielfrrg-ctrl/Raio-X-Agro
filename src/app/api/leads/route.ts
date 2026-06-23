import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(req: NextRequest) {
  const { diagnostic_id, nome, whatsapp, email } = await req.json()

  if (!diagnostic_id) {
    return NextResponse.json({ error: 'diagnostic_id obrigatório.' }, { status: 400 })
  }

  if (!whatsapp && !email) {
    return NextResponse.json({ error: 'Informe WhatsApp ou e-mail.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Busca dados do diagnóstico para o email de notificação
  const { data: diagnostic } = await supabase
    .from('diagnostics')
    .select('subsetor, estado, faturamento_rs, urgencia, output_1')
    .eq('id', diagnostic_id)
    .single()

  // Salva lead
  const { error } = await supabase.from('leads').insert({
    diagnostic_id,
    nome: nome || null,
    whatsapp: whatsapp || null,
    email: email || null,
  })

  if (error) {
    console.error('Erro ao salvar lead:', error)
    return NextResponse.json({ error: 'Erro ao salvar contato.' }, { status: 500 })
  }

  // Notifica consultor por email
  if (process.env.CONSULTANT_EMAIL && process.env.RESEND_API_KEY && diagnostic) {
    const urgenciaEmoji = diagnostic.urgencia === 'alta' ? '🚨' : diagnostic.urgencia === 'media' ? '⚠️' : '📋'
    const painel = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/${diagnostic_id}`

    await getResend()!.emails.send({
      from: 'notificacao@raixoagro.com.br',
      to: process.env.CONSULTANT_EMAIL,
      subject: `${urgenciaEmoji} Lead pediu contato — ${diagnostic.subsetor} / ${diagnostic.estado}`,
      html: `
        <h2>Lead solicitou aprofundamento</h2>
        <ul>
          <li><strong>Nome:</strong> ${nome || '—'}</li>
          <li><strong>WhatsApp:</strong> ${whatsapp || '—'}</li>
          <li><strong>E-mail:</strong> ${email || '—'}</li>
          <li><strong>Subsetor:</strong> ${diagnostic.subsetor}</li>
          <li><strong>Estado:</strong> ${diagnostic.estado}</li>
          <li><strong>Urgência:</strong> ${diagnostic.urgencia?.toUpperCase()}</li>
        </ul>
        <p><a href="${painel}">Ver diagnóstico completo</a></p>
      `,
    }).catch(console.error)
  }

  return NextResponse.json({ ok: true })
}
