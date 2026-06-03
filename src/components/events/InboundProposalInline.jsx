import { useState } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

function ProposalLogo({ name, logo }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#eef0f2] bg-white text-lg font-extrabold text-[#111827]">
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#eef0f2] bg-white p-2.5">
      <img
        src={logo}
        alt=""
        className="max-h-full max-w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

export default function InboundProposalInline({
  proposal,
  onAccept,
  onReject,
  onOpenChat,
}) {
  const isAccepted = proposal.status === 'aceptado'

  return (
    <div className="flex flex-col gap-4 border-b border-[#eef0f2]/80 py-5 last:border-0 last:pb-0 first:pt-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 gap-4">
        <ProposalLogo name={proposal.brandName} logo={proposal.brandLogo} />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h4 className="font-display text-base font-bold text-[#111827]">
              {proposal.brandName}
            </h4>
            <span className="rounded-full border border-[#eef0f2] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#6b7280]">
              {proposal.industry}
            </span>
          </div>

          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9ca3af]">
            Qué aporta la marca
          </p>
          <p className="text-sm leading-relaxed text-[#374151]">{proposal.textProposal}</p>

          <p className="mt-2 text-xs text-[#9ca3af]">
            Quiere patrocinar tu evento y cerrar el trato directo en Onbrand.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-44">
        {isAccepted ? (
          <button
            type="button"
            onClick={() => onOpenChat?.(proposal.brandId)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f4f6e9] px-4 py-3 text-sm font-bold text-[#1d230d] transition-all hover:bg-[#e8ecd8] active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2} />
            Ir al Chat Directo
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" strokeWidth={2} />
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onReject?.(proposal.id)}
              className="py-2 text-sm font-medium text-[#9ca3af] transition-colors hover:text-[#111827]"
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => onAccept?.(proposal.id)}
              className="rounded-2xl bg-[#111827] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#1f2937] active:scale-[0.98]"
            >
              Aceptar Match & Chat
            </button>
          </>
        )}
      </div>
    </div>
  )
}
