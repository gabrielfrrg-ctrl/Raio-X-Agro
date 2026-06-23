export default function ProgressBar({ etapaAtual, etapas }: { etapaAtual: number; etapas: string[] }) {
  const pct = (etapaAtual / (etapas.length - 1)) * 100

  return (
    <div className="w-full">
      {/* Barra */}
      <div className="w-full h-0.5 rounded-full mb-4" style={{ background: '#D1C9B8' }}>
        <div
          className="h-0.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: '#1B3A2D' }}
        />
      </div>

      {/* Labels das etapas */}
      <div className="flex justify-between">
        {etapas.map((label, i) => (
          <span
            key={i}
            className="text-xs"
            style={{
              color: i === etapaAtual ? '#1B3A2D' : i < etapaAtual ? '#4B5563' : '#9CA3AF',
              fontWeight: i === etapaAtual ? 600 : 400,
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
