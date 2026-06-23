'use client'

import { useState } from 'react'

type Props = {
  diagnosticId: string
  onFechar: () => void
  onSucesso: () => void
}

const inputCls = 'w-full px-3 py-2.5 border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#1B3A2D] transition-colors'
const inputStyle = { borderColor: '#D1C9B8', borderRadius: '6px', color: '#1A1A1A' }
const labelStyle = { color: '#1A1A1A', fontSize: '0.875rem', fontWeight: 500 as const }

export default function ModalContato({ diagnosticId, onFechar, onSucesso }: Props) {
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function enviar() {
    if (!nome.trim()) {
      setErro('Nome é obrigatório.')
      return
    }
    if (!whatsapp && !email) {
      setErro('Informe pelo menos um canal de contato.')
      return
    }
    setLoading(true)
    setErro('')
    try {
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnostic_id: diagnosticId, nome, whatsapp, email }),
      })
      if (!resp.ok) {
        const json = await resp.json()
        setErro(json.error || 'Erro ao enviar.')
        return
      }
      onSucesso()
    } catch {
      setErro('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onFechar} />

      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" style={{ border: '1px solid #D1C9B8' }}>
        <button onClick={onFechar} className="absolute top-4 right-4 text-xl" style={{ color: '#9CA3AF' }}>×</button>

        <h3 className="text-base font-semibold mb-1" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
          Como prefere conversar?
        </h3>
        <p className="text-sm mb-5" style={{ color: '#4B5563' }}>
          Preencha só o canal que prefere — entraremos em contato por lá.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block mb-1" style={labelStyle}>
              WhatsApp
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(65) 99999-9999"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block mb-1" style={labelStyle}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block mb-1" style={labelStyle}>
              Nome <span style={{ color: '#8B6914' }}>*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como posso te chamar?"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {erro && <p className="text-sm" style={{ color: '#991B1B' }}>{erro}</p>}

          <button
            onClick={enviar}
            disabled={loading || !nome.trim() || (!whatsapp && !email)}
            className="w-full py-3 text-white font-semibold transition-colors disabled:opacity-40"
            style={{ background: '#1B3A2D', borderRadius: '6px' }}
          >
            {loading ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
