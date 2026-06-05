import { Calendar, MapPin, Users } from 'lucide-react'
import InboundProposalInline from './InboundProposalInline'

function formatEventDate(iso) {
  return new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function EventContainerCard({
  event,
  onAcceptProposal,
  onRejectProposal,
  onOpenChat,
}) {
  const proposals = event.proposalsReceived ?? []
  const pendingCount = proposals.filter((p) => p.status === 'pendiente').length

  return (
    <article className="rounded-3xl border border-border-subtle bg-white p-7 sm:p-8">
      <header className="border-b border-border-subtle pb-6">
        <h3 className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
          {event.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            {formatEventDate(event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            {event.audience}
          </span>
        </div>
      </header>

      <div className="mt-6 rounded-2xl bg-secondary/40 p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="type-label ">
              Propuestas de marcas
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Interesadas en patrocinar este evento
            </p>
          </div>
          {proposals.length > 0 && (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white tabular-nums">
              {proposals.length}
              {pendingCount > 0 && (
                <span className="ml-1 font-medium text-white/70">
                  · {pendingCount} nueva{pendingCount !== 1 ? 's' : ''}
                </span>
              )}
            </span>
          )}
        </div>

        {proposals.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Todavía no hay marcas interesadas en este evento.
          </p>
        ) : (
          <div>
            {proposals.map((proposal) => (
              <InboundProposalInline
                key={proposal.id}
                proposal={proposal}
                onAccept={(id) => onAcceptProposal?.(event.id, id)}
                onReject={(id) => onRejectProposal?.(event.id, id)}
                onOpenChat={onOpenChat}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
