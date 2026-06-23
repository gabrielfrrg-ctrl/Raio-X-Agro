'use client'

import type { FormDados, Subsetor } from '@/types'

// Perguntas setoriais por subsetor
type CampoSetorial = { key: string; label: string; tipo: 'select' | 'textarea'; opcoes?: string[] }

const CAMPOS_SETORIAIS: Partial<Record<Subsetor, CampoSetorial[]>> = {
  produtor_graos: [
    {
      key: 'proporcao_arrendamento',
      label: 'De cada 10 hectares que você planta, quantos são seus e quantos são arrendados?',
      tipo: 'textarea',
    },
    {
      key: 'trava_preco',
      label: 'Você costuma travar o preço da sua soja antes da colheita, ou decide na hora de vender?',
      tipo: 'select',
      opcoes: ['Costumo travar antes', 'Às vezes', 'Decido na hora de vender'],
    },
  ],
  produtor_algodao: [
    {
      key: 'proporcao_arrendamento',
      label: 'De cada 10 hectares que você planta, quantos são seus e quantos são arrendados?',
      tipo: 'textarea',
    },
    {
      key: 'trava_preco',
      label: 'Você costuma travar o preço do algodão antes da colheita, ou decide na hora de vender?',
      tipo: 'select',
      opcoes: ['Costumo travar antes', 'Às vezes', 'Decido na hora de vender'],
    },
  ],
  pecuaria_bovina: [
    {
      key: 'sistema_producao',
      label: 'Qual o sistema de produção predominante?',
      tipo: 'select',
      opcoes: ['Cria', 'Recria e engorda', 'Ciclo completo', 'Confinamento'],
    },
    {
      key: 'area_propria',
      label: 'A terra onde você opera é própria, arrendada ou parceria?',
      tipo: 'select',
      opcoes: ['Principalmente própria', 'Mix própria e arrendada', 'Principalmente arrendada'],
    },
  ],
  frigorifico_abatedouro: [
    {
      key: 'captacao_animais',
      label: 'Como é a captação de animais — própria, terceiros ou mix?',
      tipo: 'select',
      opcoes: ['Principalmente própria', 'Mix', 'Principalmente terceiros'],
    },
    {
      key: 'exposicao_cambial',
      label: 'Você exporta ou vende para exportador? Tem exposição cambial?',
      tipo: 'select',
      opcoes: ['Sim, exporto diretamente', 'Vendo para exportador', 'Mercado interno apenas'],
    },
  ],
  multiplicadora_sementes: [
    {
      key: 'qualidade_estoque',
      label: 'Qual o percentual do seu estoque que você considera dentro do padrão de comercialização?',
      tipo: 'select',
      opcoes: ['Acima de 80%', 'Entre 50% e 80%', 'Abaixo de 50%'],
    },
    {
      key: 'pagamento_clientes',
      label: 'Como está o pagamento dos seus clientes nos últimos 6 meses?',
      tipo: 'select',
      opcoes: ['Dentro do prazo', 'Com atrasos pontuais', 'Com inadimplência relevante'],
    },
  ],
  revenda_insumos: [
    {
      key: 'percentual_barter',
      label: 'Qual percentual das suas vendas é feito via barter — você entrega o insumo agora e recebe o grão na colheita?',
      tipo: 'select',
      opcoes: ['Menos de 30%', 'Entre 30% e 70%', 'Mais de 70%'],
    },
    {
      key: 'trava_cambio_soja',
      label: 'Você costuma travar o preço da soja que vai receber e o câmbio do defensivo que compra, ou deixa aberto?',
      tipo: 'select',
      opcoes: ['Trava os dois', 'Trava parcialmente', 'Deixa aberto'],
    },
  ],
  misturadora_fertilizante: [
    {
      key: 'origem_materia_prima',
      label: 'Você compra matéria-prima importada (potássio, fosfato) ou de fornecedor nacional como Nutrien ou Mosaic?',
      tipo: 'select',
      opcoes: ['Principalmente importada', 'Mix importado e nacional', 'Principalmente nacional'],
    },
    {
      key: 'trava_cambio',
      label: 'Quando fecha a compra de matéria-prima, você trava o câmbio ou deixa aberto até o pagamento?',
      tipo: 'select',
      opcoes: ['Trava no momento da compra', 'Às vezes', 'Deixa aberto'],
    },
  ],
  cooperativa: [
    {
      key: 'pagamento_cooperados',
      label: 'Como está o pagamento dos cooperados nos últimos 6 meses?',
      tipo: 'select',
      opcoes: ['Dentro do prazo', 'Com atrasos pontuais', 'Com inadimplência relevante'],
    },
    {
      key: 'cpr_fisica',
      label: 'Qual o percentual do recebível que está formalizado em CPR Física?',
      tipo: 'select',
      opcoes: ['Mais de 70%', 'Entre 30% e 70%', 'Menos de 30%', 'Não utiliza CPR'],
    },
  ],
}

type Props = {
  dados: Partial<FormDados>
  onChange: (novos: Partial<FormDados>) => void
  onSubmeter: () => void
  onVoltar: () => void
  loading: boolean
  erro: string
  modoUpload?: boolean
}

export default function Etapa3({ dados, onChange, onSubmeter, onVoltar, loading, erro, modoUpload }: Props) {
  const subsetor = dados.subsetor as Subsetor
  const campos = modoUpload ? [] : (CAMPOS_SETORIAIS[subsetor] || [])

  function atualizarSetorial(key: string, value: string) {
    onChange({
      campos_setoriais: { ...dados.campos_setoriais, [key]: value },
    })
  }

  const valido = dados.maior_preocupacao?.trim()

  const inputCls = 'w-full px-3 py-2.5 border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#1B3A2D] transition-colors'
  const inputStyle = { borderColor: '#D1C9B8', borderRadius: '6px', color: '#1A1A1A' }
  const labelStyle = { color: '#1A1A1A', fontSize: '0.875rem', fontWeight: 500 as const }

  return (
    <div className="space-y-5">
      {campos.map((campo) => (
        <div key={campo.key}>
          <label className="block mb-1" style={labelStyle}>{campo.label}</label>
          {campo.tipo === 'select' ? (
            <select
              value={dados.campos_setoriais?.[campo.key] || ''}
              onChange={(e) => atualizarSetorial(campo.key, e.target.value)}
              className={inputCls}
              style={inputStyle}
            >
              <option value="" disabled>Selecione...</option>
              {campo.opcoes?.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ) : (
            <textarea
              value={dados.campos_setoriais?.[campo.key] || ''}
              onChange={(e) => atualizarSetorial(campo.key, e.target.value)}
              rows={2}
              className={`${inputCls} resize-none`}
              style={inputStyle}
            />
          )}
        </div>
      ))}

      <div>
        <label className="block mb-1" style={labelStyle}>
          Qual sua maior preocupação com a operação hoje?{' '}
          <span style={{ color: '#8B6914' }}>*</span>
        </label>
        <p className="text-xs italic mb-1.5" style={{ color: '#4B5563' }}>
          O que você mencionar aqui é o ponto de partida do diagnóstico — banco, vencimento, inadimplência de cliente, renovação de contrato, custo financeiro. Seja direto.
        </p>
        <textarea
          value={dados.maior_preocupacao || ''}
          onChange={(e) => onChange({ maior_preocupacao: e.target.value })}
          rows={3}
          placeholder="ex: tenho R$ 8M vencendo em março e o banco está pedindo garantias que não tenho"
          className={`${inputCls} resize-none`}
          style={inputStyle}
        />
      </div>

      {erro && (
        <p className="text-sm px-4 py-2" style={{ color: '#7f1d1d', background: '#fef2f2', borderRadius: '6px' }}>
          {erro}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onVoltar}
          disabled={loading}
          className="flex-1 py-3 border text-sm font-medium transition-colors disabled:opacity-40"
          style={{ borderColor: '#D1C9B8', borderRadius: '6px', color: '#4B5563', background: '#fff' }}
        >
          ← Voltar
        </button>
        <button
          onClick={onSubmeter}
          disabled={!valido || loading}
          className="flex-1 py-3 text-white font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: '#1B3A2D', borderRadius: '6px' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Gerando diagnóstico...
            </span>
          ) : (
            'Gerar diagnóstico →'
          )}
        </button>
      </div>
    </div>
  )
}
