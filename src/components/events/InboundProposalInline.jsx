import { useState } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
            Quiere patrocinar tu evento y cerrar el trato directo en Uanabi.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-44">
        {isAccepted ? (
          <Button type="button" variant="match" size="default" className="w-full" onClick={() => onOpenChat?.(proposal.brandId)}>
            <MessageCircle className="h-4 w-4" strokeWidth={2} />
            Ir al Chat Directo
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" strokeWidth={2} />
          </Button>
        ) : (
          <>
            <Button type="button" variant="tertiary" size="sm" className="text-muted-foreground" onClick={() => onReject?.(proposal.id)}>
              Rechazar
            </Button>
            <Button type="button" variant="primary" size="lg" onClick={() => onAccept?.(proposal.id)}>
              Aceptar Match & Chat
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
