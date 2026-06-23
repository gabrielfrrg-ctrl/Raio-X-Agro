'use client'

import { useState } from 'react'

type Props = {
  label: string
  name: string
  value?: number
  onChange: (value: number | undefined) => void
  hint?: string
  obrigatorio?: boolean
}

function formatarPreview(v: number): string {
  if (v >= 1000000) return `≈ R$ ${(v / 1000000).toFixed(1).replace('.', ',')} B`
  if (v >= 1000) return `≈ R$ ${(v / 1000).toFixed(1).replace('.', ',')} M`
  return `≈ R$ ${v.toLocaleString('pt-BR')} mil`
}

export default function CampoMoeda({ label, name, value, onChange, hint, obrigatorio }: Props) {
  const [raw, setRaw] = useState(value !== undefined ? String(value) : '')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const s = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.')
    setRaw(e.target.value)
    const parsed = parseFloat(s)
    onChange(isNaN(parsed) ? undefined : parsed)
  }

  return (
    <div>
      <label className="block mb-1" style={{ color: '#1A1A1A', fontSize: '0.875rem', fontWeight: 500 }}>
        {label}
        {obrigatorio && <span className="ml-1" style={{ color: '#8B6914' }}>*</span>}
      </label>
      {hint && (
        <p className="text-xs italic mb-1" style={{ color: '#4B5563' }}>{hint}</p>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: '#9CA3AF' }}>R$</span>
        <input
          type="text"
          name={name}
          value={raw}
          onChange={handleChange}
          inputMode="decimal"
          placeholder="0"
          className="w-full pl-9 pr-3 py-2.5 border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#1B3A2D] transition-colors"
          style={{ borderColor: '#D1C9B8', borderRadius: '6px', color: '#1A1A1A' }}
        />
      </div>
      {value !== undefined && value > 0 && (
        <p className="text-xs mt-1 font-medium" style={{ color: '#8B6914' }}>{formatarPreview(value)}</p>
      )}
      <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>em R$ mil</p>
    </div>
  )
}
