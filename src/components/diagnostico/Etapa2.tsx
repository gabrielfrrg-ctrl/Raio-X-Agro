'use client'

import CampoMoeda from './CampoMoeda'
import type { FormDados, Resultado } from '@/types'

const inputCls = 'w-full px-3 py-2.5 border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#1B3A2D] transition-colors resize-none'
const inputStyle = { borderColor: '#D1C9B8', borderRadius: '6px', color: '#1A1A1A' }
const labelStyle = { color: '#1A1A1A', fontSize: '0.875rem', fontWeight: 500 }

const RESULTADOS: { value: Resultado; label: string; emoji: string }[] = [
  { value: 'positivo', label: 'Fechou no positivo', emoji: '↑' },
  { value: 'empatou', label: 'Praticamente empatou', emoji: '→' },
  { value: 'negativo', label: 'Fechou no negativo', emoji: '↓' },
]

type Props = {
  dados: Partial<FormDados>
  onChange: (novos: Partial<FormDados>) => void
  onAvancar: () => void
  onVoltar: () => void
}

export default function Etapa2({ dados, onChange, onAvancar, onVoltar }: Props) {
  const valido = dados.resultado

  return (
    <div className="space-y-5">
      <div>
        <label className="block mb-2" style={labelStyle}>
          Resultado do último período <span style={{ color: '#8B6914' }}>*</span>
        </label>
        <div className="flex flex-col gap-2">
          {RESULTADOS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => onChange({ resultado: r.value })}
              className="flex items-center gap-3 px-4 py-3 border text-sm font-medium transition-colors text-left"
              style={{
                borderRadius: '6px',
                borderColor: dados.resultado === r.value ? '#1B3A2D' : '#D1C9B8',
                background: dados.resultado === r.value ? '#F0F4F2' : '#fff',
                color: dados.resultado === r.value ? '#1B3A2D' : '#4B5563',
              }}
            >
              <span className="font-mono text-base w-4 text-center">{r.emoji}</span>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1" style={labelStyle}>O que pesou mais nesse resultado?</label>
        <p className="text-xs italic mb-1.5" style={{ color: '#4B5563' }}>
          Quanto mais específico, mais preciso o diagnóstico — preço da commodity, custo de insumo, inadimplência de cliente, evento climático, custo financeiro. Uma frase já resolve.
        </p>
        <textarea
          value={dados.causa_resultado || ''}
          onChange={(e) => onChange({ causa_resultado: e.target.value })}
          rows={2}
          placeholder="ex: preço da soja caiu na hora de vender e o custo do arrendamento não caiu junto"
          className={inputCls}
          style={inputStyle}
        />
      </div>

      <CampoMoeda
        label="Quanto você deve hoje, somando banco e fornecedor?"
        name="divida_total"
        value={dados.divida_total}
        onChange={(v) => onChange({ divida_total: v })}
        hint="Estimativa já resolve. Inclui arrendamento se souber, mas não precisa calcular agora."
      />

      <CampoMoeda
        label="O que você já sabe que vence nos próximos 12 meses?"
        name="vencimento_12m"
        value={dados.vencimento_12m}
        onChange={(v) => onChange({ vencimento_12m: v })}
        hint="Uma ideia geral já resolve — parcelas, renovações, o que vier à cabeça."
      />

      <CampoMoeda
        label="Quanto você tem disponível hoje, em conta ou aplicação?"
        name="caixa"
        value={dados.caixa}
        onChange={(v) => onChange({ caixa: v })}
        hint="Estimativa já serve."
      />

      <div className="flex gap-3 pt-2">
        <button
          onClick={onVoltar}
          className="flex-1 py-3 border text-sm font-medium transition-colors"
          style={{ borderColor: '#D1C9B8', borderRadius: '6px', color: '#4B5563', background: '#fff' }}
        >
          ← Voltar
        </button>
        <button
          onClick={onAvancar}
          disabled={!valido}
          className="flex-1 py-3 text-white font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: '#1B3A2D', borderRadius: '6px' }}
        >
          Próximo →
        </button>
      </div>
    </div>
  )
}
