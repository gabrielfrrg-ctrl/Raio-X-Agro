'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Urgencia, StatusDiagnostico } from '@/types'

const SUBSETOR_LABEL: Record<string, string> = {
  produtor_graos: 'Produtor de grãos',
  soja_feijao: 'Soja e feijão',
  multiplicadora_sementes: 'Multiplicadora de sementes',
  revenda_insumos: 'Revenda de insumos',
  misturadora_fertilizante: 'Misturadora de fertilizante',
  cooperativa: 'Cooperativa',
  outro: 'Outro',
}

const URGENCIA_CONFIG: Record<Urgencia, { label: string; color: string }> = {
  alta: { label: 'Alta', color: 'bg-red-100 text-red-700' },
  media: { label: 'Média', color: 'bg-yellow-100 text-yellow-700' },
  baixa: { label: 'Baixa', color: 'bg-green-100 text-green-700' },
}

const STATUS_CONFIG: Record<StatusDiagnostico, { label: string; color: string }> = {
  aguardando: { label: 'Aguardando', color: 'bg-gray-100 text-gray-600' },
  com_dados: { label: 'Com dados', color: 'bg-amber-100 text-amber-700' },
  em_atendimento: { label: 'Em atendimento', color: 'bg-blue-100 text-blue-700' },
  convertido: { label: 'Convertido', color: 'bg-green-100 text-green-700' },
  descartado: { label: 'Descartado', color: 'bg-gray-100 text-gray-400' },
}

type LeadRow = { id: string; whatsapp: string | null }

type Diagnostic = {
  id: string
  created_at: string
  subsetor: string
  estado: string
  faturamento_rs: number
  urgencia: string | null
  status: string
  leads?: LeadRow[]
}

// Calcula nível de funil do lead
function calcNivel(d: Diagnostic): 'iniciou' | 'com_dados' | 'quer_contato' {
  const leads = d.leads ?? []
  // "Quer contato": tem lead do CTA (whatsapp preenchido ou whatsapp sem prefixo "tel:")
  const temCTA = leads.some((l) => l.whatsapp && !l.whatsapp.startsWith('tel:'))
  if (temCTA) return 'quer_contato'
  // "Com dados": status='com_dados' OR tem lead do gate (whatsapp null ou prefixo tel:)
  if (d.status === 'com_dados' || leads.length > 0) return 'com_dados'
  return 'iniciou'
}

const NIVEL_CONFIG = {
  iniciou: { label: 'Iniciou', color: 'bg-gray-100 text-gray-500' },
  com_dados: { label: 'Com dados', color: 'bg-amber-100 text-amber-700' },
  quer_contato: { label: 'Quer contato', color: 'bg-green-100 text-green-700' },
}

export default function AdminLista({ diagnosticos }: { diagnosticos: Diagnostic[] }) {
  const [filtroUrgencia, setFiltroUrgencia] = useState<string>('todos')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')

  const lista = diagnosticos.filter((d) => {
    if (filtroUrgencia !== 'todos' && d.urgencia !== filtroUrgencia) return false
    if (filtroStatus !== 'todos' && d.status !== filtroStatus) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <span className="font-bold" style={{ color: '#1B3A2D' }}>Raio X Agro</span>
          <span className="text-gray-400 mx-2">·</span>
          <span className="text-gray-600 text-sm">Painel Interno</span>
        </div>
        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">Sair</Link>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Diagnósticos</h1>
            <p className="text-gray-500 text-sm mt-1">{lista.length} de {diagnosticos.length} registros</p>
          </div>
          <Link
            href="/diagnostico/novo"
            target="_blank"
            className="text-sm text-green-600 border border-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
          >
            Ver formulário
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {['todos', 'alta', 'media', 'baixa'].map((u) => (
              <button
                key={u}
                onClick={() => setFiltroUrgencia(u)}
                className={cn(
                  'px-3 py-1 rounded text-sm font-medium transition-colors',
                  filtroUrgencia === u
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {u === 'todos' ? 'Urgência' : u.charAt(0).toUpperCase() + u.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {['todos', 'aguardando', 'em_atendimento', 'convertido', 'descartado'].map((s) => (
              <button
                key={s}
                onClick={() => setFiltroStatus(s)}
                className={cn(
                  'px-3 py-1 rounded text-sm font-medium transition-colors',
                  filtroStatus === s
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {s === 'todos' ? 'Status' : STATUS_CONFIG[s as StatusDiagnostico]?.label || s}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subsetor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Faturamento</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Urgência</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nível</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    Nenhum diagnóstico encontrado.
                  </td>
                </tr>
              ) : (
                lista.map((d) => {
                  const urgConf = d.urgencia ? URGENCIA_CONFIG[d.urgencia as Urgencia] : null
                  const statusConf = STATUS_CONFIG[d.status as StatusDiagnostico]

                  return (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(d.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                        {SUBSETOR_LABEL[d.subsetor] || d.subsetor}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{d.estado}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 text-right">
                        R$ {Number(d.faturamento_rs).toLocaleString('pt-BR')}k
                      </td>
                      <td className="px-4 py-3 text-center">
                        {urgConf ? (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${urgConf.color}`}>
                            {urgConf.label}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {(() => {
                          const nivel = calcNivel(d)
                          const nc = NIVEL_CONFIG[nivel]
                          return (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${nc.color}`}>
                              {nc.label}
                            </span>
                          )
                        })()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConf?.color || ''}`}>
                          {statusConf?.label || d.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/${d.id}`}
                          className="text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
