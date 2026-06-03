import { useState } from 'react'
import { MapPin } from 'lucide-react'

const BUDGET_SHORT = {
  Canje: 'Canje',
  'Presupuesto Efectivo': 'Efectivo',
  Híbrido: 'Híbrido',
}

function MiniLogo({ name, logo }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-xs font-bold text-neutral-800">
        {name.charAt(0)}
      </div>
    )
  }
  return (
    <img
      src={logo}
      alt=""
      className="h-10 w-10 shrink-0 rounded-xl border border-neutral-100 bg-white object-contain p-1"
      onError={() => setFailed(true)}
    />
  )
}

export default function GeoBrandCard({ brand, isHighlighted, onSelect, onApply }) {
  const canApply = brand.applicationStatus === 'disponible'

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(brand.id)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(brand.id)}
      className={`mb-3 cursor-pointer rounded-2xl border p-4 transition-all ${
        isHighlighted
          ? 'border-neutral-900 bg-neutral-50/80 shadow-sm'
          : 'border-neutral-100 bg-white hover:border-neutral-200'
      }`}
    >
      <div className="flex gap-3">
        <MiniLogo name={brand.name} logo={brand.logo} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-neutral-900">{brand.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-neutral-400">
            <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{brand.zone}</span>
          </p>
          <p className="mt-2 text-xs text-neutral-600">
            Patrocinio:{' '}
            <span className="font-semibold text-neutral-800">
              {BUDGET_SHORT[brand.budgetType] ?? brand.budgetType}
            </span>
            {brand.offers?.[0] && (
              <span className="text-neutral-400"> · {brand.offers[0]}</span>
            )}
          </p>
        </div>
      </div>

      {canApply && isHighlighted && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onApply?.(brand.id)
          }}
          className="mt-3 w-full rounded-xl bg-neutral-900 py-2 text-xs font-bold text-white transition hover:bg-neutral-800"
        >
          Postular mi Evento
        </button>
      )}
    </article>
  )
}
