import { useState } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'

function BrandAvatar({ name, logo }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl border border-border-subtle bg-secondary text-2xl font-extrabold text-foreground">
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <div className="brand-logo-surface h-28 w-28 shrink-0 rounded-3xl border border-border-subtle p-5">
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
    <div className="rounded-2xl border border-border-subtle bg-background p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
          {budget}
        </span>
        <span className="rounded-full border border-border-subtle bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
          {volume}
        </span>
      </div>
      <p className="type-body leading-relaxed text-foreground/80">
        {parts.map((part, i) =>
          /^\$/.test(part) ? (
            <strong key={i} className="font-extrabold text-foreground">
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
    <article className="overflow-hidden rounded-3xl border border-border-subtle bg-white p-8 transition-all duration-300 hover:border-[#e5e7eb]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex shrink-0 flex-col items-start gap-4 lg:w-44">
          <BrandAvatar name={proposal.brandName} logo={proposal.brandLogo} />
          <div>
            <h3 className="font-display text-xl font-extrabold tracking-tight text-foreground">
              {proposal.brandName}
            </h3>
            <span className="mt-2 inline-block rounded-full border border-border-subtle bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
              {proposal.rubro ?? proposal.industry}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <div>
            <p className="mb-2 type-label ">
              Quieren patrocinar
            </p>
            <p className="font-display text-lg font-bold leading-snug tracking-tight text-foreground">
              {proposal.eventTarget}
            </p>
          </div>

          <div>
            <p className="mb-3 type-label ">
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
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-match px-8 py-3.5 text-sm font-bold text-match-foreground transition-all hover:bg-[#e8ecd8] active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2} />
                Ir al Chat Directo
                <ArrowUpRight className="h-4 w-4 opacity-60" strokeWidth={2} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onAccept?.(proposal.id)}
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-[0.98]"
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
