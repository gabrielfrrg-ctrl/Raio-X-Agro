export type Subsetor =
  | 'produtor_graos'
  | 'produtor_cafe'
  | 'produtor_cana'
  | 'produtor_algodao'
  | 'produtor_hf'
  | 'pecuaria_bovina'
  | 'suinocultura_avicultura'
  | 'multiplicadora_sementes'
  | 'revenda_insumos'
  | 'misturadora_fertilizante'
  | 'cooperativa'
  | 'trading_graos'
  | 'armazem_silo'
  | 'frigorifico_abatedouro'
  | 'usina_cana_etanol'
  | 'biologicos_defensivos'
  | 'prestador_servicos'
  | 'outro'

export type Trajetoria = 'cresceu' | 'estavel' | 'caiu'
export type Resultado = 'positivo' | 'negativo' | 'empatou'
export type Urgencia = 'alta' | 'media' | 'baixa'
export type StatusDiagnostico = 'aguardando' | 'com_dados' | 'em_atendimento' | 'convertido' | 'descartado'

// Dados do formulário (3 etapas)
export type FormDados = {
  // Etapa 1
  subsetor: Subsetor
  estado: string
  faturamento_rs: number
  trajetoria: Trajetoria

  // Etapa 2
  resultado: Resultado
  causa_resultado: string
  divida_total: number
  vencimento_12m: number
  caixa: number

  // Etapa 3
  campos_setoriais: Record<string, string>
  maior_preocupacao: string

  // Consentimento
  consentimento_lgpd: boolean
}

export type Diagnostic = {
  id: string
  created_at: string
  subsetor: Subsetor
  estado: string
  faturamento_rs: number
  trajetoria: Trajetoria
  resultado: Resultado
  causa_resultado: string | null
  divida_total: number | null
  vencimento_12m: number | null
  caixa: number | null
  campos_setoriais: Record<string, string>
  maior_preocupacao: string | null
  tipo_entrada: 'formulario' | 'balanco'
  urgencia: Urgencia | null
  output_1: string | null
  output_2: string | null
  status: StatusDiagnostico
  notas_internas: string | null
}

export type Lead = {
  id: string
  diagnostic_id: string
  created_at: string
  nome: string | null
  whatsapp: string | null
  email: string | null
}

export type DiagnosticComLead = Diagnostic & {
  leads: Lead[]
}
