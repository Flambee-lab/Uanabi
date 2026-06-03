import { useState } from 'react'
import { ArrowUpRight, MessageCircle, Star, Users } from 'lucide-react'

const BUDGET_LABELS = {
  Canje: 'Canje',
  'Presupuesto Efectivo': 'Efectivo',
  Híbrido: 'Híbrido',
}

const STATUS_BADGE = {
  disponible: { label: 'Abierta', className: 'bg-white/95 text-[#111827]' },
  enviada: { label: 'Postulaste', className: 'bg-white/95 text-[#6b7280]' },
  match_aceptado: { label: 'Match', className: 'bg-[#111827] text-white' },
}

function CardHero({ brand }) {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${brand.coverGradient ?? 'from-gray-100 to-white'}`}
    >
      <div className="absolute inset-0 flex items-center justify-center p-8">
        {!logoFailed ? (
          <img
            src={brand.logo}
            alt=""
            className="max-h-16 max-w-[70%] object-contain drop-shadow-sm"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="font-display text-3xl font-extrabold text-[#111827]/80">
            {brand.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#111827] shadow-sm">
          {BUDGET_LABELS[brand.budgetType]}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${STATUS_BADGE[brand.applicationStatus]?.className ?? STATUS_BADGE.disponible.className}`}
        >
          {STATUS_BADGE[brand.applicationStatus]?.label ?? 'Abierta'}
        </span>
      </div>
    </div>
  )
}

export default function BrandDiscoverCard({ brand, onApply, onOpenChat }) {
  const primaryOffer = brand.offers.find((o) => o.includes('$')) ?? brand.offers[0]
  const isMatch = brand.applicationStatus === 'match_aceptado'
  const isSent = brand.applicationStatus === 'enviada'

  return (
    <article className="group flex flex-col">
      <CardHero brand={brand} />

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-[#111827] group-hover:underline group-hover:underline-offset-2">
          {brand.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-[#6b7280]">
          {brand.industry} · Busca {brand.seeks[0]}
        </p>
        <p className="mt-0.5 line-clamp-1 text-sm font-medium text-[#374151]">
          Aporta {primaryOffer}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#eef0f2] pt-3">
          <div className="flex items-center gap-3 text-xs text-[#6b7280]">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
              {brand.activeHosts ?? 0} hosts
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#111827]">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
              {brand.matchScore ?? '4.8'}
            </span>
          </div>
        </div>

        <div className="mt-3">
          {isMatch ? (
            <button
              type="button"
              onClick={() => onOpenChat?.(brand.id)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#f4f6e9] py-2.5 text-sm font-bold text-[#1d230d] transition-colors hover:bg-[#e8ecd8]"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2} />
              Chat
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          ) : isSent ? (
            <button
              type="button"
              disabled
              className="w-full rounded-xl border border-[#eef0f2] py-2.5 text-sm font-medium text-[#9ca3af]"
            >
              Postulación enviada
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApply?.(brand.id)}
              className="w-full rounded-xl bg-[#111827] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1f2937]"
            >
              Postular mi Evento
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
