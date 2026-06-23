'use client'

import { useRef } from 'react'
import CampoMoeda from './CampoMoeda'
import type { FormDados, Subsetor, Trajetoria } from '@/types'

const inputCls = 'w-full px-3 py-2.5 border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#1B3A2D] transition-colors'
const inputStyle = { borderColor: '#D1C9B8', borderRadius: '6px', color: '#1A1A1A' }
const labelStyle = { color: '#1A1A1A', fontSize: '0.875rem', fontWeight: 500 as const }

const SUBSETORES: { value: Subsetor; label: string }[] = [
  { value: 'produtor_graos',          label: 'Produtor de grãos' },
  { value: 'produtor_cafe',           label: 'Produtor de café' },
  { value: 'produtor_cana',           label: 'Produtor de cana-de-açúcar' },
  { value: 'produtor_algodao',        label: 'Produtor de algodão' },
  { value: 'produtor_hf',             label: 'Produtor de frutas e hortaliças (HF)' },
  { value: 'pecuaria_bovina',         label: 'Pecuária bovina' },
  { value: 'suinocultura_avicultura', label: 'Suinocultura e avicultura' },
  { value: 'multiplicadora_sementes', label: 'Multiplicadora de sementes' },
  { value: 'revenda_insumos',         label: 'Revenda de insumos' },
  { value: 'misturadora_fertilizante', label: 'Misturadora de fertilizante' },
  { value: 'cooperativa',             label: 'Cooperativa agrícola' },
  { value: 'trading_graos',           label: 'Trading de grãos' },
  { value: 'armazem_silo',            label: 'Armazém e silo graneleiro' },
  { value: 'frigorifico_abatedouro',  label: 'Frigorífico e abatedouro' },
  { value: 'usina_cana_etanol',       label: 'Usina de cana e etanol' },
  { value: 'biologicos_defensivos',   label: 'Biológicos e defensivos naturais' },
  { value: 'prestador_servicos',      label: 'Prestador de serviços agrícolas' },
  { value: 'outro',                   label: 'Outro' },
]

const TRAJETORIAS: { value: Trajetoria; label: string }[] = [
  { value: 'cresceu', label: 'Cresceu' },
  { value: 'estavel', label: 'Estável' },
  { value: 'caiu',    label: 'Caiu' },
]

type Props = {
  dados: Partial<FormDados>
  onChange: (novos: Partial<FormDados>) => void
  onAvancar: () => void
  // upload
  modoUpload: boolean
  onModoUpload: (v: boolean) => void
  arquivoNome: string
  onArquivo: (file: File) => void
  erroUpload: string
  onLimparUpload: () => void
}

export default function Etapa1({ dados, onChange, onAvancar, modoUpload, onModoUpload, arquivoNome, onArquivo, erroUpload, onLimparUpload }: Props) {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const isOutro = dados.subsetor === 'outro'
  const descricaoOutro = dados.campos_setoriais?.descricao_outro || ''

  const validoBase = dados.subsetor && dados.estado && (!isOutro || descricaoOutro.trim())
  const validoUpload = validoBase && arquivoNome
  const validoFormulario = validoBase && dados.faturamento_rs && dados.trajetoria
  const valido = modoUpload ? validoUpload : validoFormulario

  function handleSubsetor(value: Subsetor) {
    onChange({
      subsetor: value,
      campos_setoriais: value === 'outro' ? { descricao_outro: '' } : {},
    })
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    onArquivo(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    onArquivo(file)
  }

  return (
    <div className="space-y-5">
      {/* Subsetor */}
      <div>
        <label className="block mb-1" style={labelStyle}>
          Subsetor <span style={{ color: '#8B6914' }}>*</span>
        </label>
        <select
          value={dados.subsetor || ''}
          onChange={(e) => handleSubsetor(e.target.value as Subsetor)}
          className={inputCls}
          style={inputStyle}
        >
          <option value="" disabled>Selecione...</option>
          {SUBSETORES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Campo "Outro" */}
      {isOutro && (
        <div>
          <label className="block mb-1" style={labelStyle}>
            Descreva seu negócio em uma frase <span style={{ color: '#8B6914' }}>*</span>
          </label>
          <input
            type="text"
            value={descricaoOutro}
            onChange={(e) => onChange({ campos_setoriais: { ...dados.campos_setoriais, descricao_outro: e.target.value } })}
            placeholder="ex: beneficiadora de café, viveiro florestal..."
            className={inputCls}
            style={inputStyle}
            autoFocus
          />
        </div>
      )}

      {/* Estado */}
      <div>
        <label className="block mb-1" style={labelStyle}>
          Estado de operação <span style={{ color: '#8B6914' }}>*</span>
        </label>
        <input
          type="text"
          value={dados.estado || ''}
          onChange={(e) => onChange({ estado: e.target.value })}
          placeholder="Ex: Mato Grosso, Goiás"
          className={inputCls}
          style={inputStyle}
        />
      </div>

      {/* Bloco de upload */}
      <div className="rounded-lg p-4" style={{ background: '#F7F5F0', border: '1px solid #D1C9B8' }}>
        <p className="text-sm font-medium mb-0.5" style={{ color: '#1A1A1A' }}>
          Tem um balanço ou balancete disponível?
        </p>
        <p className="text-xs italic mb-3" style={{ color: '#4B5563' }}>
          Se enviar o documento, o diagnóstico fica mais preciso — pulamos as perguntas financeiras.
        </p>

        <div className="flex gap-2">
          {[
            { value: false, label: 'Prefiro responder as perguntas' },
            { value: true,  label: 'Sim, vou enviar o documento' },
          ].map((op) => (
            <button
              key={String(op.value)}
              type="button"
              onClick={() => { onModoUpload(op.value); if (!op.value) onLimparUpload() }}
              className="flex-1 py-2 px-3 border text-xs font-medium transition-colors text-left"
              style={{
                borderRadius: '6px',
                borderColor: modoUpload === op.value ? '#1B3A2D' : '#D1C9B8',
                background: modoUpload === op.value ? '#1B3A2D' : '#fff',
                color: modoUpload === op.value ? '#fff' : '#4B5563',
              }}
            >
              {op.label}
            </button>
          ))}
        </div>

        {/* Área de upload */}
        {modoUpload && (
          <div className="mt-3">
            {arquivoNome ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: '#F0F4F2', border: '1px solid #D1C9B8' }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#1B3A2D' }}>
                  <span>📎</span>
                  <span className="truncate max-w-[200px]">{arquivoNome}</span>
                </div>
                <button
                  onClick={onLimparUpload}
                  className="text-xs ml-2 shrink-0"
                  style={{ color: '#9CA3AF' }}
                >
                  remover
                </button>
              </div>
            ) : (
              <div
                onClick={() => inputFileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer rounded-lg flex flex-col items-center justify-center py-5 transition-colors"
                style={{ border: '1.5px dashed #D1C9B8', background: '#fff' }}
              >
                <span className="text-xl mb-1">📎</span>
                <p className="text-sm text-center" style={{ color: '#4B5563' }}>
                  Clique para selecionar ou arraste o arquivo aqui
                </p>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>PDF ou XLSX · máximo 10MB</p>
              </div>
            )}

            <input
              ref={inputFileRef}
              type="file"
              accept=".pdf,.xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />

            {erroUpload && (
              <p className="text-xs mt-2" style={{ color: '#991B1B' }}>{erroUpload}</p>
            )}
          </div>
        )}
      </div>

      {/* Campos financeiros — apenas no modo formulário */}
      {!modoUpload && (
        <>
          <CampoMoeda
            label="Faturamento anual"
            name="faturamento_rs"
            value={dados.faturamento_rs}
            onChange={(v) => onChange({ faturamento_rs: v })}
            obrigatorio
          />

          <div>
            <label className="block mb-2" style={labelStyle}>
              Trajetória do faturamento <span style={{ color: '#8B6914' }}>*</span>
            </label>
            <div className="flex gap-2">
              {TRAJETORIAS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onChange({ trajetoria: t.value })}
                  className="flex-1 py-2.5 border text-sm font-medium transition-colors"
                  style={{
                    borderRadius: '6px',
                    borderColor: dados.trajetoria === t.value ? '#1B3A2D' : '#D1C9B8',
                    background: dados.trajetoria === t.value ? '#1B3A2D' : '#fff',
                    color: dados.trajetoria === t.value ? '#fff' : '#4B5563',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        onClick={onAvancar}
        disabled={!valido}
        className="w-full py-3 text-white font-semibold transition-colors mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: '#1B3A2D', borderRadius: '6px' }}
      >
        Próximo →
      </button>
    </div>
  )
}
