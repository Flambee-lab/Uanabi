import { useState } from 'react'
import { Plus } from 'lucide-react'

function formatContribution(brand) {
  const type = brand.typicalContribution ?? brand.budgetType
  const firstOffer = brand.offers?.[0]
  if (firstOffer && type) return `Aporta: ${type} + ${firstOffer}`
  if (type) return `Aporta: ${type}`
  return 'Aporta: patrocinio a medida'
}

export default function SuggestedSponsorCard({ brand, onInvite }) {
  const [failed, setFailed] = useState(false)

  return (
    <article className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-3">
        {failed ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold text-neutral-800">
            {brand.name.charAt(0)}
          </div>
        ) : (
          <img
            src={brand.logo}
            alt=""
            className="h-11 w-11 shrink-0 rounded-xl border border-neutral-100 bg-white object-contain p-1"
            onError={() => setFailed(true)}
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-neutral-900">{brand.name}</h3>
          <p className="text-[11px] text-neutral-400">{brand.industry}</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-neutral-600">
        {formatContribution(brand)}
      </p>

      <button
        type="button"
        onClick={() => onInvite(brand.id)}
        className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        Invitar
      </button>
    </article>
  )
}
