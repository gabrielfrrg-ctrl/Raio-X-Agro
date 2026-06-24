import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

const INDICE_CONFIG = {
  baixa: { cor: '#22C55E', nome: 'Operação sólida', barraHex: '#22C55E' },
  media: { cor: '#F59E0B', nome: 'Atenção identificada', barraHex: '#F59E0B' },
  alta: { cor: '#EF4444', nome: 'Ação recomendada', barraHex: '#EF4444' },
}

function buildEmailHtml(params: {
  nome: string
  output_1: string
  urgencia: string | null
  siteUrl: string
}): string {
  const { nome, output_1, urgencia, siteUrl } = params
  const key = (urgencia ?? 'media') as keyof typeof INDICE_CONFIG
  const cfg = INDICE_CONFIG[key] ?? INDICE_CONFIG.media

  // Limpa o output_1 dos marcadores de markdown
  const diagnosticoTexto = output_1
    .replace(/^#{1,3}\s.*$/gm, '')
    .replace(/^§\s*[A-ZÇÃÉÊ].*$/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n+/g, '</p><p style="margin:0 0 16px;line-height:1.8;color:#1A1A1A;font-size:15px;">')
    .trim()

  const paras = `<p style="margin:0 0 16px;line-height:1.8;color:#1A1A1A;font-size:15px;">${diagnosticoTexto}</p>`

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F5F0;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F0;padding:32px 16px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">

        <!-- Header -->
        <tr>
          <td style="background:#1B3A2D;padding:28px 32px;border-radius:8px 8px 0 0;">
            <p style="margin:0;font-family:Georgia,serif;font-size:24px;color:#ffffff;font-weight:700;">
              Raio X Agro
            </p>
            <p style="margin:4px 0 0;font-size:11px;color:#8B6914;letter-spacing:1px;text-transform:uppercase;">
              Diagnóstico Financeiro
            </p>
          </td>
        </tr>

        <!-- Corpo -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-radius:0 0 8px 8px;border:0.5px solid #D1C9B8;">

            <p style="margin:0 0 24px;font-size:15px;color:#4B5563;">
              Olá${nome ? `, ${nome}` : ''}! Seu diagnóstico financeiro está pronto.
            </p>

            <!-- Índice de saúde -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#F7F5F0;border:0.5px solid #D1C9B8;border-radius:8px;padding:16px;">
                  <p style="margin:0 0 10px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">
                    SEU ÍNDICE DE SAÚDE FINANCEIRA
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:${cfg.barraHex};height:4px;border-radius:4px;"></td>
                    </tr>
                  </table>
                  <p style="margin:10px 0 0;font-size:16px;font-weight:600;color:${cfg.cor};">${cfg.nome}</p>
                </td>
              </tr>
            </table>

            <!-- Diagnóstico -->
            <p style="margin:0 0 12px;font-size:11px;color:#8B6914;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">
              SEU DIAGNÓSTICO
            </p>

            <div style="font-family:Georgia,serif;">
              ${paras}
            </div>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
              <tr>
                <td style="background:#F7F5F0;border-radius:8px;padding:24px;text-align:center;">
                  <p style="margin:0 0 16px;font-size:15px;color:#1A1A1A;font-family:Georgia,serif;">
                    Quer conversar sobre o que o diagnóstico encontrou na sua operação?
                  </p>
                  <a href="${siteUrl}"
                     style="display:inline-block;background:#1B3A2D;color:#ffffff;text-decoration:none;
                            padding:14px 28px;border-radius:6px;font-weight:600;font-size:15px;">
                    Quero ser contatado por um especialista
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9CA3AF;line-height:1.6;">
              Raio X Agro · Diagnóstico Financeiro para o Agronegócio<br>
              Você recebeu este email porque solicitou seu diagnóstico.<br>
              Para cancelar o recebimento, responda este email com "cancelar".
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  const { diagnostic_id, nome, email, telefone } = await req.json()

  if (!diagnostic_id || !email) {
    return NextResponse.json({ error: 'diagnostic_id e email são obrigatórios.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Busca dados do diagnóstico
  const { data: diagnostic, error: fetchError } = await supabase
    .from('diagnostics')
    .select('output_1, urgencia, subsetor, estado')
    .eq('id', diagnostic_id)
    .single()

  if (fetchError || !diagnostic) {
    return NextResponse.json({ error: 'Diagnóstico não encontrado.' }, { status: 404 })
  }

  // Salva o email gate como lead (whatsapp = telefone se fornecido)
  await supabase.from('leads').insert({
    diagnostic_id,
    nome: nome || null,
    email,
    whatsapp: telefone ? `tel:${telefone}` : null,
  }).then(({ error }) => {
    if (error) console.error('Erro ao salvar lead gate:', error)
  })

  // Atualiza status do diagnóstico para 'com_dados'
  await supabase
    .from('diagnostics')
    .update({ status: 'com_dados' })
    .eq('id', diagnostic_id)
    .then(({ error }) => {
      if (error) console.error('Erro ao atualizar status para com_dados:', error)
    })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://raioxagro.com.br'

  // Envia email do diagnóstico para o lead
  if (process.env.RESEND_API_KEY && diagnostic.output_1) {
    const resend = getResend()
    if (resend) {
      await resend.emails.send({
        from: 'Raio X Agro <onboarding@resend.dev>',
        to: email,
        subject: 'Seu diagnóstico financeiro — Raio X Agro',
        html: buildEmailHtml({
          nome: nome || '',
          output_1: diagnostic.output_1,
          urgencia: diagnostic.urgencia,
          siteUrl,
        }),
      }).catch(console.error)
    }
  }

  return NextResponse.json({ ok: true })
}
