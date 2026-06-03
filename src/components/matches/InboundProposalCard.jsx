import { useState } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

function BrandAvatar({ name, logo }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl border border-[#eef0f2] bg-[#f9fafb] text-2xl font-extrabold text-[#111827]">
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-[#eef0f2] bg-[#fafafa] p-5">
      <img
        src={logo}
        alt={name}
        className="max-h-full max-w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

function HighlightedProposal({ text, budget, volume }) {
  const parts = text.split(/(\$[\d.,]+k?|\$[\d.,]+)/gi)

  return (
    <div className="rounded-2xl border border-[#eef0f2] bg-[#fbfbfc] p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#111827] px-3 py-1 text-xs font-bold text-white">
          {budget}
        </span>
        <span className="rounded-full border border-[#eef0f2] bg-white px-3 py-1 text-xs font-medium text-[#6b7280]">
          {volume}
        </span>
      </div>
      <p className="text-[15px] leading-relaxed text-[#374151]">
        {parts.map((part, i) =>
          /^\$/.test(part) ? (
            <strong key={i} className="font-extrabold text-[#111827]">
              {part}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>
    </div>
  )
}

export default function InboundProposalCard({ proposal, onAccept, onReject, onOpenChat }) {
  const isAccepted = proposal.status === 'aceptado'

  return (
    <article className="overflow-hidden rounded-3xl border border-[#eef0f2] bg-white p-8 transition-all duration-300 hover:border-[#e5e7eb]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex shrink-0 flex-col items-start gap-4 lg:w-44">
          <BrandAvatar name={proposal.brandName} logo={proposal.brandLogo} />
          <div>
            <h3 className="font-display text-xl font-extrabold tracking-tight text-[#111827]">
              {proposal.brandName}
            </h3>
            <span className="mt-2 inline-block rounded-full border border-[#eef0f2] bg-[#f9fafb] px-3 py-1 text-xs font-semibold text-[#6b7280]">
              {proposal.rubro ?? proposal.industry}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">
              Quieren patrocinar
            </p>
            <p className="font-display text-lg font-bold leading-snug tracking-tight text-[#111827]">
              {proposal.eventTarget}
            </p>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af]">
              Qué aportan
            </p>
            <HighlightedProposal
              text={proposal.textProposal}
              budget={proposal.metadata.estimatedBudget}
              volume={proposal.metadata.volume}
            />
          </div>

          <div className="flex flex-col items-stretch gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            {!isAccepted ? (
              <button
                type="button"
                onClick={() => onReject?.(proposal.id)}
                className="text-sm font-medium text-[#9ca3af] transition-colors hover:text-[#111827]"
              >
                Rechazar
              </button>
            ) : (
              <span />
            )}

            {isAccepted ? (
              <button
                type="button"
                onClick={() => onOpenChat?.(proposal.id)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f4f6e9] px-8 py-3.5 text-sm font-bold text-[#1d230d] transition-all hover:bg-[#e8ecd8] active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2} />
                Ir al Chat Directo
                <ArrowUpRight className="h-4 w-4 opacity-60" strokeWidth={2} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onAccept?.(proposal.id)}
                className="inline-flex items-center justify-center rounded-2xl bg-[#111827] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#1f2937] active:scale-[0.98]"
              >
                Aceptar Match
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
