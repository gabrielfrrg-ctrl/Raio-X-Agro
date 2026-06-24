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

const inputBase: React.CSSProperties = {
  width: '100%',
  height: 48,
  padding: '0 14px',
  border: '1px solid #D1C9B8',
  borderRadius: 6,
  fontSize: 15,
  color: '#1A1A1A',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function EmailGate({ diagnosticId, urgencia, onSucesso }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
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
    if (!nome.trim()) {
      setErro('Nome é obrigatório.')
      return
    }

    setLoading(true)
    setErro('')

    try {
      const resp = await fetch('/api/diagnostico/email-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnostic_id: diagnosticId, nome, email, telefone }),
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
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9CA3AF', letterSpacing: '1.5px' }}>
            diagnóstico do negócio
          </p>
          <div className="h-px mb-8" style={{ background: '#D1C9B8' }} />
        </div>

        {/* Índice de saúde — preview */}
        <div className="rounded-xl p-5 mb-8" style={{ background: '#fff', border: '0.5px solid #D1C9B8' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF', letterSpacing: '1.5px' }}>
            Índice de saúde financeira
          </p>
          <div className="w-full h-1 rounded-full mb-3" style={{ background: cfg.cor }} />
          <p className="text-base font-semibold mb-1" style={{ color: cfg.nomeColor }}>{cfg.nome}</p>
          <p className="text-sm" style={{ color: '#6B7280' }}>Seu índice está pronto.</p>
        </div>

        {/* Formulário */}
        <div className="rounded-xl p-6 sm:p-8" style={{ background: '#fff', border: '0.5px solid #D1C9B8' }}>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 22,
            color: '#1B3A2D',
            lineHeight: 1.4,
            margin: '0 0 24px',
          }}>
            Informe seu email para ver o diagnóstico completo e recebê-lo na sua caixa de entrada.
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1A1A1A', marginBottom: 6 }}>
                E-mail <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={inputBase}
              />
            </div>

            {/* Nome */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1A1A1A', marginBottom: 6 }}>
                Nome <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como posso te chamar?"
                required
                style={inputBase}
              />
            </div>

            {/* Telefone (opcional) */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1A1A1A', marginBottom: 6 }}>
                Telefone{' '}
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 400 }}>(opcional)</span>
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 99999-9999"
                style={inputBase}
              />
            </div>

            {erro && (
              <p style={{ fontSize: 13, color: '#991B1B', margin: 0 }}>{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !nome.trim()}
              style={{
                width: '100%',
                height: 52,
                background: '#1B3A2D',
                color: '#fff',
                fontWeight: 600,
                fontSize: 15,
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                opacity: (loading || !email.trim() || !nome.trim()) ? 0.4 : 1,
                marginTop: 4,
              }}
            >
              {loading ? 'Aguarde...' : 'Ver meu diagnóstico completo'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 14, textAlign: 'center', lineHeight: 1.5 }}>
            Você também receberá o diagnóstico no email. Sem spam. Cancele quando quiser.
          </p>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6, textAlign: 'center' }}>
            <Link href="/privacidade" style={{ color: '#9CA3AF', textDecoration: 'underline' }} target="_blank">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
