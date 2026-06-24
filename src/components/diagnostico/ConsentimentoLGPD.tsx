'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ConsentimentoLGPD({ onContinuar }: { onContinuar: () => void }) {
  const [aceito, setAceito] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F7F5F0' }}>
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#1B3A2D', fontFamily: 'Georgia, serif' }}>
            Raio X Agro
          </h1>
          <p className="text-sm mt-1" style={{ color: '#4B5563' }}>Diagnóstico Financeiro · Agronegócio</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8" style={{ borderColor: '#D1C9B8' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
            Antes de começar
          </h2>

          <div className="space-y-3 mb-6" style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: '1.65' }}>
            <p>
              Autorizo o Raio X Agro a utilizar as informações fornecidas para fins de diagnóstico
              financeiro e a compartilhá-las com consultores parceiros credenciados pela plataforma
              para eventual contato sobre os resultados.
            </p>
            <p>
              Ao continuar, você concorda com nossa{' '}
              <Link href="/privacidade" className="underline" style={{ color: '#8B6914' }} target="_blank">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={aceito}
              onChange={(e) => setAceito(e.target.checked)}
              className="mt-0.5 w-4 h-4 cursor-pointer shrink-0"
              style={{ accentColor: '#1B3A2D' }}
            />
            <span className="text-sm" style={{ color: '#1A1A1A' }}>Li e concordo com a Política de Privacidade</span>
          </label>

          <button
            onClick={onContinuar}
            disabled={!aceito}
            className="w-full py-3 px-4 text-white font-semibold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#1B3A2D', borderRadius: '6px' }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
