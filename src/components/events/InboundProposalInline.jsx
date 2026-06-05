import { useState } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

function ProposalLogo({ name, logo }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border-subtle bg-white text-lg font-extrabold text-foreground">
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <div className="brand-logo-surface h-14 w-14 shrink-0 rounded-2xl border border-border-subtle p-2.5">
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
    <div className="flex flex-col gap-4 border-b border-border-subtle/80 py-5 last:border-0 last:pb-0 first:pt-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 gap-4">
        <ProposalLogo name={proposal.brandName} logo={proposal.brandLogo} />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h4 className="font-display text-base font-bold text-foreground">
              {proposal.brandName}
            </h4>
            <span className="rounded-full border border-border-subtle bg-white px-2.5 py-0.5 type-small font-semibold text-muted-foreground">
              {proposal.industry}
            </span>
          </div>

          <p className="mb-1 type-label ">
            Qué aporta la marca
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">{proposal.textProposal}</p>

          <p className="mt-2 text-xs text-muted-foreground">
            Quiere patrocinar tu evento y cerrar el trato directo en Onbrand.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-44">
        {isAccepted ? (
          <button
            type="button"
            onClick={() => onOpenChat?.(proposal.brandId)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-match px-4 py-3 text-sm font-bold text-match-foreground transition-all hover:bg-[#e8ecd8] active:scale-[0.98]"
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
              className="py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => onAccept?.(proposal.id)}
              className="rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Aceptar Match & Chat
            </button>
          </>
        )}
      </div>
    </div>
  )
}
