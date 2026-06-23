import type { Urgencia } from '@/types'

const PALAVRAS_ALTA_URGENCIA = [
  'banco', 'renovar', 'vencendo', 'bloqueio', 'execução', 'execucao',
  'inadimplência', 'inadimplencia', 'protesto', 'cheque', 'negativado',
  'renegociar', 'paralisando', 'parar', 'falência', 'falencia',
]

export function classificarUrgencia(dados: {
  caixa?: number
  divida_total?: number
  vencimento_12m?: number
  resultado: string
  maior_preocupacao?: string
}): Urgencia {
  const { caixa = 0, divida_total = 0, vencimento_12m = 0, resultado, maior_preocupacao = '' } = dados

  const preocupacaoLower = maior_preocupacao.toLowerCase()
  const temPalavraChave = PALAVRAS_ALTA_URGENCIA.some((p) => preocupacaoLower.includes(p))

  // Alta: caixa < 5% da dívida CP
  const caixaBaixo = divida_total > 0 && caixa / divida_total < 0.05

  // Alta: resultado negativo + vencimento > 70% da dívida total
  const vencimentoAlto = divida_total > 0 && resultado === 'negativo' && vencimento_12m / divida_total > 0.7

  if (caixaBaixo || vencimentoAlto || temPalavraChave) {
    return 'alta'
  }

  // Média: resultado negativo + dívida relevante
  if (resultado === 'negativo' && divida_total > 0) {
    return 'media'
  }

  return 'baixa'
}
