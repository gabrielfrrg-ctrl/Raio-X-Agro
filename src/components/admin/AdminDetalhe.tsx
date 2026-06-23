'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { StatusDiagnostico } from '@/types'

const STATUS_OPTIONS: { value: StatusDiagnostico; label: string }[] = [
  { value: 'aguardando', label: 'Aguardando contato' },
  { value: 'em_atendimento', label: 'Em atendimento' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'descartado', label: 'Descartado' },
]

const URGENCIA_COLOR: Record<string, string> = {
  alta: 'bg-red-100 text-red-700 border-red-200',
  media: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  baixa: 'bg-green-100 text-green-700 border-green-200',
}

const SUBSETOR_LABEL: Record<string, string> = {
  produtor_graos: 'Produtor de grãos',
  soja_feijao: 'Soja e feijão',
  multiplicadora_sementes: 'Multiplicadora de sementes',
  revenda_insumos: 'Revenda de insumos',
  misturadora_fertilizante: 'Misturadora de fertilizante',
  cooperativa: 'Cooperativa',
  outro: 'Outro',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminDetalhe({ diagnostic }: { diagnostic: any }) {
  const [status, setStatus] = useState<StatusDiagnostico>(diagnostic.status)
  const [notas, setNotas] = useState<string>(diagnostic.notas_internas || '')
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState<'output1' | 'output2' | 'dados'>('output1')

  const lead = diagnostic.leads?.[0]

  async function salvar() {
    setSalvando(true)
    setSalvo(false)
    try {
      await fetch(`/api/admin/diagnosticos/${diagnostic.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notas_internas: notas }),
      })
      setSalvo(true)
      setTimeout(() => setSalvo(false), 2000)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-400 hover:text-gray-700 text-sm">← Painel</Link>
        <span className="text-gray-300">·</span>
        <span className="text-gray-600 text-sm font-medium">
          {SUBSETOR_LABEL[diagnostic.subsetor]} · {diagnostic.estado}
        </span>
        {diagnostic.urgencia && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${URGENCIA_COLOR[diagnostic.urgencia]}`}>
            Urgência {diagnostic.urgencia.toUpperCase()}
          </span>
        )}
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-4">
          {/* Abas */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 w-fit">
            {[
              { key: 'output1', label: 'O que o lead viu' },
              { key: 'output2', label: 'Parecer interno' },
              { key: 'dados', label: 'Dados brutos' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setAbaAtiva(key as typeof abaAtiva)}
                className={cn(
                  'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                  abaAtiva === key ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {abaAtiva === 'output1' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">Output 1 — Lead</h3>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {diagnostic.output_1 || '(ainda gerando...)'}
                </div>
              </div>
            )}

            {abaAtiva === 'output2' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">Output 2 — Parecer interno</h3>
                {diagnostic.output_2 ? (
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {diagnostic.output_2}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic">Parecer ainda sendo gerado...</p>
                )}
              </div>
            )}

            {abaAtiva === 'dados' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">Dados do formulário</h3>
                <dl className="space-y-3">
                  {[
                    ['Subsetor', SUBSETOR_LABEL[diagnostic.subsetor] || diagnostic.subsetor],
                    ['Estado', diagnostic.estado],
                    ['Faturamento', `R$ ${Number(diagnostic.faturamento_rs).toLocaleString('pt-BR')} mil`],
                    ['Trajetória', diagnostic.trajetoria],
                    ['Resultado', diagnostic.resultado],
                    ['Causa do resultado', diagnostic.causa_resultado],
                    ['Dívida total', diagnostic.divida_total ? `R$ ${Number(diagnostic.divida_total).toLocaleString('pt-BR')} mil` : '—'],
                    ['Vencimento 12m', diagnostic.vencimento_12m ? `R$ ${Number(diagnostic.vencimento_12m).toLocaleString('pt-BR')} mil` : '—'],
                    ['Caixa disponível', diagnostic.caixa ? `R$ ${Number(diagnostic.caixa).toLocaleString('pt-BR')} mil` : '—'],
                    ['Maior preocupação', diagnostic.maior_preocupacao],
                  ].map(([label, value]) => value ? (
                    <div key={label} className="flex gap-4">
                      <dt className="text-xs text-gray-400 uppercase w-36 shrink-0 pt-0.5">{label}</dt>
                      <dd className="text-sm text-gray-800">{value}</dd>
                    </div>
                  ) : null)}

                  {diagnostic.campos_setoriais && Object.keys(diagnostic.campos_setoriais).length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 uppercase mb-2">Campos setoriais</p>
                      {Object.entries(diagnostic.campos_setoriais).map(([k, v]) => (
                        <div key={k} className="flex gap-4 mb-2">
                          <dt className="text-xs text-gray-400 w-36 shrink-0">{k}</dt>
                          <dd className="text-sm text-gray-700">{v as string}</dd>
                        </div>
                      ))}
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contato do lead */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Contato do lead</h3>
            {lead ? (
              <dl className="space-y-2">
                {lead.nome && <div><dt className="text-xs text-gray-400">Nome</dt><dd className="text-sm font-medium">{lead.nome}</dd></div>}
                {lead.whatsapp && (
                  <div>
                    <dt className="text-xs text-gray-400">WhatsApp</dt>
                    <dd>
                      <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`} target="_blank" className="text-sm text-green-600 hover:underline">
                        {lead.whatsapp}
                      </a>
                    </dd>
                  </div>
                )}
                {lead.email && (
                  <div>
                    <dt className="text-xs text-gray-400">E-mail</dt>
                    <dd>
                      <a href={`mailto:${lead.email}`} className="text-sm text-green-600 hover:underline">
                        {lead.email}
                      </a>
                    </dd>
                  </div>
                )}
                <p className="text-xs text-gray-400 pt-1">
                  Solicitou contato em {new Date(lead.created_at).toLocaleString('pt-BR')}
                </p>
              </dl>
            ) : (
              <p className="text-sm text-gray-400 italic">Lead ainda não clicou no CTA.</p>
            )}
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Status</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusDiagnostico)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Notas internas */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Notas internas</h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={5}
              placeholder="Observações do consultor..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <button
            onClick={salvar}
            disabled={salvando}
            className={cn(
              'w-full py-2.5 font-semibold rounded-lg text-sm transition-colors',
              salvo
                ? 'bg-green-100 text-green-700'
                : 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50'
            )}
          >
            {salvando ? 'Salvando...' : salvo ? '✓ Salvo' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}
