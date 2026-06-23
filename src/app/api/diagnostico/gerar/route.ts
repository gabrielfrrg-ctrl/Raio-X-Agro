import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildPrompt1, buildPrompt2, formatarInputFormulario, formatarInputBalanco } from '@/lib/prompts'
import { classificarUrgencia } from '@/lib/urgency'
import type { FormDados } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

// Rate limiting simples em memória (para MVP — em produção usar Redis/Upstash)
const ipTimestamps: Map<string, number[]> = new Map()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hora

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = (ipTimestamps.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT) return false
  timestamps.push(now)
  ipTimestamps.set(ip, timestamps)
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

  console.log('ENV CHECK:', {
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    keyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 10),
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
  })

  // Guard: variáveis de ambiente obrigatórias
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[API /gerar] ANTHROPIC_API_KEY não configurada.')
    return NextResponse.json({ error: 'Configuração incompleta: ANTHROPIC_API_KEY ausente.' }, { status: 500 })
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('[API /gerar] Variáveis Supabase não configuradas.')
    return NextResponse.json({ error: 'Configuração incompleta: Supabase ausente.' }, { status: 500 })
  }

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Muitas requisições. Tente novamente em 1 hora.' }, { status: 429 })
  }

  let body: FormDados & { texto_balanco?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  if (!body.consentimento_lgpd) {
    return NextResponse.json({ error: 'Consentimento LGPD obrigatório.' }, { status: 400 })
  }

  const dados = body
  const modoBalanco = !!body.texto_balanco

  console.log('[API /gerar] Subsetor:', dados.subsetor, '| Estado:', dados.estado, '| Modo:', modoBalanco ? 'balanço' : 'formulário')

  const supabase = createAdminClient()

  // Salva o diagnóstico inicial no banco
  const { data: diagnostic, error: insertError } = await supabase
    .from('diagnostics')
    .insert({
      subsetor: dados.subsetor,
      estado: dados.estado,
      faturamento_rs: dados.faturamento_rs ?? null,
      trajetoria: dados.trajetoria ?? null,
      resultado: dados.resultado ?? null,
      causa_resultado: dados.causa_resultado ?? null,
      divida_total: dados.divida_total ?? null,
      vencimento_12m: dados.vencimento_12m ?? null,
      caixa: dados.caixa ?? null,
      campos_setoriais: dados.campos_setoriais ?? {},
      maior_preocupacao: dados.maior_preocupacao ?? null,
      tipo_entrada: modoBalanco ? 'balanco' : 'formulario',
      consentimento_lgpd: true,
      consentimento_at: new Date().toISOString(),
      ip_address: ip,
      status: 'aguardando',
    })
    .select()
    .single()

  if (insertError || !diagnostic) {
    console.error('[API /gerar] Erro ao salvar no Supabase:', JSON.stringify(insertError))
    return NextResponse.json({ error: `Erro ao salvar diagnóstico: ${insertError?.message || 'desconhecido'}` }, { status: 500 })
  }

  console.log('[API /gerar] Diagnóstico salvo. ID:', diagnostic.id)

  // Classifica urgência (balanço = sempre 'media' até ter dados financeiros)
  const urgencia = modoBalanco
    ? 'media'
    : classificarUrgencia({
        caixa: dados.caixa,
        divida_total: dados.divida_total,
        vencimento_12m: dados.vencimento_12m,
        resultado: dados.resultado,
        maior_preocupacao: dados.maior_preocupacao,
      })

  const inputFormatado = modoBalanco
    ? formatarInputBalanco({
        subsetor: dados.subsetor,
        estado: dados.estado,
        texto_balanco: body.texto_balanco!,
        maior_preocupacao: dados.maior_preocupacao,
      })
    : formatarInputFormulario(dados)

  // Gera Output 1 (para o lead)
  let output1 = ''
  try {
    console.log('[API /gerar] Chamando Anthropic (Output 1)...')
    const resp1 = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: buildPrompt1(dados.subsetor, urgencia as 'alta' | 'media' | 'baixa', inputFormatado),
      messages: [{ role: 'user', content: 'Gere o diagnóstico.' }],
    })
    output1 = resp1.content[0].type === 'text' ? resp1.content[0].text : ''
    console.log('[API /gerar] Output 1 gerado. Chars:', output1.length)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[API /gerar] Erro Anthropic Output 1:', msg)
    // Limpa o diagnóstico salvo sem output para não deixar registro orphan
    await supabase.from('diagnostics').delete().eq('id', diagnostic.id)
    return NextResponse.json({ error: `Erro ao gerar diagnóstico: ${msg}` }, { status: 500 })
  }

  // Salva Output 1 e urgência imediatamente
  await supabase
    .from('diagnostics')
    .update({ output_1: output1, urgencia })
    .eq('id', diagnostic.id)

  // Gera Output 2 em background (não bloqueia a resposta ao lead)
  generateOutput2AndAlert(diagnostic.id, dados, inputFormatado, urgencia).catch(console.error)

  return NextResponse.json({ id: diagnostic.id, output_1: output1, urgencia })
}

async function generateOutput2AndAlert(
  diagnosticId: string,
  dados: FormDados,
  inputFormatado: string,
  urgencia: string,
) {
  const supabase = createAdminClient()

  try {
    const resp2 = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: buildPrompt2(dados.subsetor),
      messages: [{ role: 'user', content: inputFormatado }],
    })
    const output2 = resp2.content[0].type === 'text' ? resp2.content[0].text : ''

    await supabase
      .from('diagnostics')
      .update({ output_2: output2 })
      .eq('id', diagnosticId)

    // Alerta por email se urgência = alta
    if (urgencia === 'alta' && process.env.CONSULTANT_EMAIL && process.env.RESEND_API_KEY) {
      const painel = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/${diagnosticId}`
      await getResend()!.emails.send({
        from: 'alerta@raixoagro.com.br',
        to: process.env.CONSULTANT_EMAIL,
        subject: `🚨 URGÊNCIA ALTA — Novo diagnóstico: ${dados.subsetor} / ${dados.estado}`,
        html: `
          <h2>Diagnóstico de alta urgência recebido</h2>
          <ul>
            <li><strong>Subsetor:</strong> ${dados.subsetor}</li>
            <li><strong>Estado:</strong> ${dados.estado}</li>
            <li><strong>Faturamento:</strong> R$ ${dados.faturamento_rs.toLocaleString('pt-BR')} mil</li>
            <li><strong>Maior preocupação:</strong> ${dados.maior_preocupacao || '—'}</li>
          </ul>
          <p><a href="${painel}">Ver parecer completo no painel</a></p>
        `,
      })
    }
  } catch (err) {
    console.error('Erro ao gerar Output 2 ou enviar alerta:', err)
  }
}
