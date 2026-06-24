'use client'

import { useState } from 'react'
import Link from 'next/link'

const INDICE_CONFIG = {
  baixa: { cor: '#22C55E', nome: 'Operação sólida', nomeColor: '#1B3A2D' },
  media: { cor: '#F59E0B', nome: 'Atenção identificada', nomeColor: '#92400E' },
  alta: { cor: '#EF4444', nome: 'Ação recomendada', nomeColor: '#991B1B' },
}

type Props = {
  diagnosticId: string
  urgencia: string | null
  onSucesso: () => void
}

export default function EmailGate({ diagnosticId, urgencia, onSucesso }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const key = (urgencia ?? 'media') as keyof typeof INDICE_CONFIG
  const cfg = INDICE_CONFIG[key] ?? INDICE_CONFIG.media

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setErro('Email é obrigatório.')
      return
    }

    setLoading(true)
    setErro('')

    try {
      const resp = await fetch('/api/diagnostico/email-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnostic_id: diagnosticId, email }),
      })

      if (!resp.ok) {
        const json = await resp.json().catch(() => ({}))
        setErro(json.error || 'Erro ao salvar. Tente novamente.')
        return
      }

      // Pixel CompleteRegistration
      if (typeof window !== 'undefined' && (window as any).fbq) {
        ;(window as any).fbq('track', 'CompleteRegistration')
      }

      onSucesso()
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: '#F7F5F0' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* Header */}
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9CA3AF', letterSpacing: '1.5px' }}>
          diagnóstico do negócio
        </p>
        <div className="h-px mb-8" style={{ background: '#D1C9B8' }} />

        {/* Índice de saúde — preview */}
        <div className="rounded-xl p-5 mb-8" style={{ background: '#fff', border: '0.5px solid #D1C9B8' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF', letterSpacing: '1.5px' }}>
            Seu índice está pronto.
          </p>
          <div className="w-full rounded-full mb-3" style={{ background: cfg.cor, height: 4 }} />
          <p className="text-base font-semibold" style={{ color: cfg.nomeColor }}>{cfg.nome}</p>
        </div>

        {/* Formulário */}
        <div className="rounded-xl p-6 sm:p-8" style={{ background: '#fff', border: '0.5px solid #D1C9B8' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 22,
            color: '#1B3A2D',
            lineHeight: 1.45,
            margin: '0 0 24px',
          }}>
            Informe seu email para ver o diagnóstico completo.
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoFocus
              style={{
                width: '100%',
                height: 52,
                padding: '0 16px',
                border: '1px solid #D1C9B8',
                borderRadius: 6,
                fontSize: 16,
                color: '#1A1A1A',
                background: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {erro && (
              <p style={{ fontSize: 13, color: '#991B1B', margin: 0 }}>{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{
                width: '100%',
                height: 52,
                background: '#1B3A2D',
                color: '#fff',
                fontWeight: 600,
                fontSize: 15,
                border: 'none',
                borderRadius: 6,
                cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !email.trim() ? 0.4 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {loading ? 'Aguarde...' : 'Ver meu diagnóstico'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 14, textAlign: 'center', lineHeight: 1.6 }}>
            Enviamos uma cópia para o seu email. Sem spam.
          </p>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
            <Link href="/privacidade" style={{ color: '#9CA3AF', textDecoration: 'underline' }} target="_blank">
              Política de Privacidade
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
