'use client'

import { useState, useEffect } from 'react'
import ModalContato from './ModalContato'
import EmailGate from './EmailGate'

type Props = {
  diagnostic: {
    id: string
    output_1: string
    urgencia: string | null
    subsetor: string
    estado: string
  }
}

// Divide o parágrafo em segmentos: texto normal e callout (**texto**)
type Segmento = { tipo: 'texto'; conteudo: string } | { tipo: 'callout'; conteudo: string }

function parseParagrafo(p: string): Segmento[] {
  const segmentos: Segmento[] = []
  const regex = /\*\*(.+?)\*\*/g
  let ultimo = 0
  let match

  while ((match = regex.exec(p)) !== null) {
    if (match.index > ultimo) {
      const antes = p.slice(ultimo, match.index).trim()
      if (antes) segmentos.push({ tipo: 'texto', conteudo: antes })
    }
    segmentos.push({ tipo: 'callout', conteudo: match[1] })
    ultimo = match.index + match[0].length
  }

  const resto = p.slice(ultimo).trim()
  if (resto) segmentos.push({ tipo: 'texto', conteudo: resto })

  return segmentos
}

function parseOutput(texto: string) {
  // Remove cabeçalhos de seção residuais (§ XXXX, ### XXX, --- etc.)
  const limpo = texto
    .replace(/^#{1,3}\s.*$/gm, '')
    .replace(/^§\s*[A-ZÇÃÉÊ].*$/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return limpo.split(/\n\n+/).filter(Boolean)
}

const INDICE_CONFIG = {
  baixa: {
    cor: '#22C55E',
    nome: 'Operação sólida',
    desc: 'Há oportunidades que você provavelmente não está capturando.',
    nomeColor: '#1B3A2D',
  },
  media: {
    cor: '#F59E0B',
    nome: 'Atenção identificada',
    desc: 'Há pontos que merecem análise antes do próximo ciclo.',
    nomeColor: '#92400E',
  },
  alta: {
    cor: '#EF4444',
    nome: 'Ação recomendada',
    desc: 'Há risco real no curto prazo que precisa de atenção imediata.',
    nomeColor: '#991B1B',
  },
}

function IndicesSaude({ urgencia }: { urgencia: string | null }) {
  const key = (urgencia ?? 'media') as keyof typeof INDICE_CONFIG
  const cfg = INDICE_CONFIG[key] ?? INDICE_CONFIG.media

  return (
    <div className="mb-6 rounded-xl p-4" style={{ background: '#fff', border: '0.5px solid #D1C9B8' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF', letterSpacing: '1.5px' }}>
        Índice de saúde financeira
      </p>
      <div className="w-full h-1 rounded-full mb-3" style={{ background: cfg.cor }} />
      <p className="text-base font-semibold mb-1" style={{ color: cfg.nomeColor }}>{cfg.nome}</p>
      <p className="text-sm" style={{ color: '#6B7280' }}>{cfg.desc}</p>
      {urgencia === 'alta' && (
        <div className="flex items-center gap-1.5 mt-2" style={{ color: '#EF4444', fontSize: '12px' }}>
          <i className="ti ti-clock" style={{ fontSize: '13px' }} />
          <span>Respondemos em até 2 horas</span>
        </div>
      )}
    </div>
  )
}

export default function ResultadoView({ diagnostic }: Props) {
  const [emailSubmetido, setEmailSubmetido] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [contatoEnviado, setContatoEnviado] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent')
    }
  }, [])

  if (!emailSubmetido) {
    return (
      <EmailGate
        diagnosticId={diagnostic.id}
        urgencia={diagnostic.urgencia}
        onSucesso={() => setEmailSubmetido(true)}
      />
    )
  }

  const isAlta = diagnostic.urgencia === 'alta'
  const paragrafos = parseOutput(diagnostic.output_1)

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: '#F7F5F0' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
              diagnóstico do negócio
            </span>
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ color: '#9CA3AF', background: '#EDE9E0' }}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              leitura de 90 segundos
            </span>
          </div>
          <div className="h-px" style={{ background: '#D1C9B8' }} />
        </div>

        {/* Índice de saúde financeira */}
        <IndicesSaude urgencia={diagnostic.urgencia} />

        {/* Conteúdo */}
        <div className="space-y-5">
          {paragrafos.map((paragrafo, idx) => {
            const segmentos = parseParagrafo(paragrafo)
            const temCallout = segmentos.some((s) => s.tipo === 'callout')

            // Parágrafo sem callout
            if (!temCallout) {
              // Pergunta provocativa: parágrafo que termina com "?" e não tem callout
              const isQuestao = paragrafo.trim().endsWith('?') && paragrafo.length < 300
              if (isQuestao) {
                return (
                  <div key={idx} className="px-6 py-5 my-4 rounded-lg" style={{ background: '#EDE9E0', border: '1px solid #D1C9B8' }}>
                    <p className="text-center italic" style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.7', color: '#1A1A1A' }}>
                      {paragrafo.trim()}
                    </p>
                  </div>
                )
              }

              return (
                <p key={idx} style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.75', color: '#1A1A1A' }}>
                  {paragrafo}
                </p>
              )
            }

            // Parágrafo com callout — renderiza segmentos em sequência
            return (
              <div key={idx} className="space-y-4">
                {segmentos.map((seg, si) => {
                  if (seg.tipo === 'callout') {
                    return (
                      <div
                        key={si}
                        style={{
                          borderLeft: '3px solid #8B6914',
                          padding: '12px 16px',
                          background: '#FDF8F0',
                        }}
                      >
                        <p style={{ fontFamily: 'Georgia, serif', fontSize: '17px', lineHeight: '1.6', color: '#1B3A2D', fontWeight: 600, margin: 0 }}>
                          {seg.conteudo}
                        </p>
                      </div>
                    )
                  }
                  return (
                    <p key={si} style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.75', color: '#1A1A1A', margin: 0 }}>
                      {seg.conteudo}
                    </p>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 mb-4">
          {contatoEnviado ? (
            <div className="text-center py-6 px-4 rounded-lg" style={{ background: '#F0F4F2', border: '1px solid #D1C9B8' }}>
              <p className="font-semibold mb-1" style={{ color: '#1B3A2D' }}>Recebemos sua mensagem.</p>
              <p className="text-sm" style={{ color: '#4B5563' }}>Um consultor vai entrar em contato em breve.</p>
            </div>
          ) : (
            <div>
              {isAlta && (
                <div className="px-4 py-2 mb-0 rounded-t-lg text-center" style={{ background: '#FEF3C7', border: '1px solid #D97706', borderBottom: 'none' }}>
                  <p className="text-sm font-medium" style={{ color: '#92400E' }}>
                    Respondemos em até 2 horas
                  </p>
                </div>
              )}
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.fbq) {
                    window.fbq('track', 'Lead')
                  }
                  setModalAberto(true)
                }}
                className="w-full py-4 text-white font-semibold text-base transition-colors"
                style={{
                  background: isAlta ? '#92400E' : '#1B3A2D',
                  borderRadius: isAlta ? '0 0 6px 6px' : '6px',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = isAlta ? '#78350F' : '#142d22'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = isAlta ? '#92400E' : '#1B3A2D'
                }}
              >
                {diagnostic.urgencia === 'media'
                  ? 'Vamos conversar sobre isso?'
                  : 'Quero conversar sobre minha operação'}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#9CA3AF' }}>
          Raio X Agro · Diagnóstico Financeiro para o Agronegócio
        </p>
      </div>

      {modalAberto && (
        <ModalContato
          diagnosticId={diagnostic.id}
          onFechar={() => setModalAberto(false)}
          onSucesso={() => {
            setModalAberto(false)
            setContatoEnviado(true)
          }}
        />
      )}
    </div>
  )
}
