'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const inputCls = 'w-full px-4 py-2.5 border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#1B3A2D] transition-colors'
const inputStyle = { borderColor: '#D1C9B8', borderRadius: '6px', color: '#1A1A1A' }
const labelStyle = { color: '#1A1A1A', fontSize: '0.875rem', fontWeight: 500 as const }

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha inválidos.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F7F5F0' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#1B3A2D', fontFamily: 'Georgia, serif' }}>
            Raio X Agro
          </h1>
          <p className="text-sm mt-1" style={{ color: '#4B5563' }}>Acesso restrito · Consultoria</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8" style={{ borderColor: '#D1C9B8' }}>
          <h2 className="text-base font-semibold mb-6" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
            Entrar no painel
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1" style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="consultor@empresa.com.br"
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block mb-1" style={labelStyle}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={inputCls}
                style={inputStyle}
              />
            </div>

            {error && (
              <p className="text-sm px-4 py-2" style={{ color: '#991B1B', background: '#FEF2F2', borderRadius: '6px' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#1B3A2D', borderRadius: '6px' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
