'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Etapa1 from '@/components/diagnostico/Etapa1'
import Etapa2 from '@/components/diagnostico/Etapa2'
import Etapa3 from '@/components/diagnostico/Etapa3'
import ConsentimentoLGPD from '@/components/diagnostico/ConsentimentoLGPD'
import ProgressBar from '@/components/diagnostico/ProgressBar'
import type { FormDados } from '@/types'

// No modo upload o formulário tem apenas 2 etapas visíveis: "Sobre o negócio" + "Diagnóstico"
// No modo formulário tem 3: "Sobre o negócio" + "Resultado e dívida" + "Diagnóstico"
const ETAPAS_FORM   = ['Sobre o negócio', 'Resultado e dívida', 'Diagnóstico']
const ETAPAS_UPLOAD = ['Sobre o negócio', 'Diagnóstico']

const DADOS_INICIAIS: Partial<FormDados> = {
  campos_setoriais: {},
  consentimento_lgpd: false,
}

export default function NovoDiagnosticoPage() {
  const router = useRouter()

  // Fluxo geral
  const [etapa, setEtapa] = useState<number | 'lgpd'>('lgpd')
  const [dados, setDados] = useState<Partial<FormDados>>(DADOS_INICIAIS)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  // Upload de balanço
  const [modoUpload, setModoUpload] = useState(false)
  const [arquivoNome, setArquivoNome] = useState('')
  const [textoExtraido, setTextoExtraido] = useState('')
  const [erroUpload, setErroUpload] = useState('')
  const [extraindo, setExtraindo] = useState(false)

  const etapas = modoUpload ? ETAPAS_UPLOAD : ETAPAS_FORM

  function atualizarDados(novos: Partial<FormDados>) {
    setDados((prev) => ({ ...prev, ...novos }))
  }

  function avancar() {
    if (etapa === 'lgpd') return setEtapa(0)
    if (typeof etapa !== 'number') return
    if (modoUpload) {
      // etapa 0 → etapa 1 (pulando etapa 2 do modo formulário)
      if (etapa === 0) setEtapa(1)
    } else {
      if (etapa < 2) setEtapa(etapa + 1)
    }
  }

  function voltar() {
    if (etapa === 0) return setEtapa('lgpd')
    if (typeof etapa !== 'number') return
    if (modoUpload) {
      if (etapa === 1) setEtapa(0)
    } else {
      if (etapa > 0) setEtapa(etapa - 1)
    }
  }

  // Índice para ProgressBar (sempre 0 ou 1 no upload; 0/1/2 no formulário)
  function etapaParaProgress(): number {
    if (etapa === 'lgpd') return 0
    if (modoUpload) return etapa as number // 0 ou 1
    return etapa as number // 0, 1 ou 2
  }

  // É a última etapa?
  function isUltimaEtapa() {
    if (typeof etapa !== 'number') return false
    return modoUpload ? etapa === 1 : etapa === 2
  }

  async function handleArquivo(file: File) {
    setErroUpload('')
    setTextoExtraido('')
    setArquivoNome(file.name)
    setExtraindo(true)

    const form = new FormData()
    form.append('arquivo', file)

    try {
      const resp = await fetch('/api/diagnostico/extrair', { method: 'POST', body: form })
      const json = await resp.json()

      if (json.erro_leitura || !json.texto) {
        setErroUpload('Não conseguimos ler o documento. Quer preencher as informações manualmente?')
        setArquivoNome('')
        return
      }

      setTextoExtraido(json.texto)
    } catch {
      setErroUpload('Erro ao processar o documento. Tente novamente.')
      setArquivoNome('')
    } finally {
      setExtraindo(false)
    }
  }

  function limparUpload() {
    setArquivoNome('')
    setTextoExtraido('')
    setErroUpload('')
  }

  async function submeter() {
    setLoading(true)
    setErro('')

    try {
      const payload = modoUpload
        ? {
            subsetor: dados.subsetor,
            estado: dados.estado,
            campos_setoriais: dados.campos_setoriais,
            maior_preocupacao: dados.maior_preocupacao,
            texto_balanco: textoExtraido,
            consentimento_lgpd: true,
          }
        : { ...dados, consentimento_lgpd: true }

      const resp = await fetch('/api/diagnostico/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await resp.json()

      if (!resp.ok) {
        setErro(json.error || 'Erro ao gerar diagnóstico.')
        setLoading(false)
        return
      }

      router.push(`/diagnostico/${json.id}`)
    } catch (err) {
      console.error('[submeter] Erro de rede ou parse:', err)
      setErro('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  if (etapa === 'lgpd') {
    return (
      <ConsentimentoLGPD
        onContinuar={() => {
          atualizarDados({ consentimento_lgpd: true })
          avancar()
        }}
      />
    )
  }

  // Índice da etapa para exibição no cabeçalho e barra de progresso
  const etapaIdx = etapaParaProgress()
  const tituloEtapa = etapas[etapaIdx] || ''

  // Subtítulo: só aparece no modo formulário
  const subtitulo = !modoUpload
    ? 'Aproximações são bem-vindas — não precisa acionar o contador pra isso. O que você sabe de cabeça já é suficiente.'
    : null

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: '#F7F5F0' }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#1B3A2D', fontFamily: 'Georgia, serif' }}>
            Raio X Agro
          </h1>
          <p className="text-sm mt-1" style={{ color: '#4B5563' }}>Diagnóstico Financeiro · Agronegócio</p>
        </div>

        <ProgressBar etapaAtual={etapaIdx} etapas={etapas} />

        <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 mt-6" style={{ borderColor: '#D1C9B8' }}>
          <h2 className="text-base font-semibold mb-1" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
            {tituloEtapa}
          </h2>
          {subtitulo && (
            <p className="text-sm italic mb-6" style={{ color: '#4B5563' }}>{subtitulo}</p>
          )}
          {!subtitulo && <div className="mb-4" />}

          {/* Etapa 0 — sempre Etapa1 */}
          {etapa === 0 && (
            <Etapa1
              dados={dados}
              onChange={atualizarDados}
              onAvancar={avancar}
              modoUpload={modoUpload}
              onModoUpload={(v) => { setModoUpload(v); limparUpload() }}
              arquivoNome={extraindo ? 'Lendo documento...' : arquivoNome}
              onArquivo={handleArquivo}
              erroUpload={erroUpload}
              onLimparUpload={() => { limparUpload(); setModoUpload(false) }}
            />
          )}

          {/* Etapa 1 no modo formulário = Etapa2 */}
          {etapa === 1 && !modoUpload && (
            <Etapa2 dados={dados} onChange={atualizarDados} onAvancar={avancar} onVoltar={voltar} />
          )}

          {/* Última etapa (2 no formulário, 1 no upload) = Etapa3 */}
          {isUltimaEtapa() && (
            <Etapa3
              dados={dados}
              onChange={atualizarDados}
              onSubmeter={submeter}
              onVoltar={voltar}
              loading={loading}
              erro={erro}
              modoUpload={modoUpload}
            />
          )}
        </div>
      </div>
    </div>
  )
}
