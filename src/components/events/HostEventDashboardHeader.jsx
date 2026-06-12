import { useState } from 'react'
import { Calendar, ChevronDown, ExternalLink, Pencil, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { UANABI_PROFILE_CARD_CLASS } from '../layout/UanabiProfileLayout'
import EventCoverMedia from './EventCoverMedia'
import EventPublicationStatusTag from './EventPublicationStatusTag'
import { getEventFacts } from '../../utils/eventDetailFormat'

function CompactFact({ label, value }) {
  if (!value || value === '—') return null
  return (
    <span className="inline-flex min-w-0 items-baseline gap-1">
      <span className="type-small font-semibold text-foreground">{label}</span>
      <span className="type-small text-muted-foreground">{value}</span>
    </span>
  )
}

function MetaChip({ icon: Icon, children }) {
  return (
    <span className="inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-full border border-border-subtle/90 bg-secondary/40 px-2.5 py-1 type-small leading-none text-foreground/90">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} aria-hidden />
      <span className="truncate font-medium">{children}</span>
    </span>
  )
}

export default function HostEventDashboardHeader({
  event,
  isPastEvent,
  onEdit,
  onViewEvent,
  onPublicationStatusChange,
  onDeleteEventRequest,
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const facts = getEventFacts(event)
  const description = event?.description?.trim()
  const hasExtraDetails =
    Boolean(description) ||
    facts.gender !== 'A definir' ||
    (event?.matchIndustries?.length ?? 0) > 0

  const attendeesLabel = /^\d+$/.test(facts.attendees)
    ? `${facts.attendees} asistentes`
    : facts.attendees

  const metaChips = [
    facts.type && facts.type !== '—'
      ? { id: 'type', icon: Sparkles, label: facts.type }
      : null,
    facts.date && facts.date !== '—'
      ? { id: 'date', icon: Calendar, label: facts.date }
      : null,
    attendeesLabel && attendeesLabel !== '—'
      ? { id: 'attendees', icon: Users, label: attendeesLabel }
      : null,
  ].filter(Boolean)

  return (
    <Card
      className={cn(
        UANABI_PROFILE_CARD_CLASS,
        'uanabi-sponsor-stroke gap-0 py-0 shadow-[0_2px_10px_rgba(0,0,0,0.05)]',
      )}
    >
      <CardContent className="p-0">
        <div
          className={cn(
            'flex gap-4 px-4 pt-4 sm:px-6 sm:pt-6',
            !detailsOpen && 'pb-4 sm:pb-6',
            detailsOpen && 'pb-5 sm:pb-6',
          )}
        >
          <EventCoverMedia
            event={event}
            variant="thumb"
            className="!h-20 !w-[7.5rem] shrink-0 !rounded-xl sm:!h-24 sm:!w-36"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <EventPublicationStatusTag
                event={event}
                onStatusChange={onPublicationStatusChange}
                onDeleteRequest={onDeleteEventRequest}
                className="shrink-0"
              />

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onViewEvent}
                >
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                  Ver evento
                </Button>
                {!isPastEvent ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onEdit}
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                    Editar
                  </Button>
                ) : (
                  <span className="type-small text-muted-foreground">Solo lectura</span>
                )}
              </div>
            </div>

            <h1 className="type-heading mt-1.5 line-clamp-2 font-display font-bold leading-snug text-foreground">
              {event.title}
            </h1>

            {(metaChips.length > 0 || hasExtraDetails) && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                  {metaChips.map((chip) => (
                    <MetaChip key={chip.id} icon={chip.icon}>
                      {chip.label}
                    </MetaChip>
                  ))}
                </div>
                {hasExtraDetails && (
                  <button
                    type="button"
                    onClick={() => setDetailsOpen((o) => !o)}
                    className="inline-flex shrink-0 items-center gap-1 type-small font-semibold leading-none text-foreground transition hover:text-primary"
                    aria-expanded={detailsOpen}
                  >
                    {detailsOpen ? 'Ocultar detalle' : 'Ver detalle'}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                        detailsOpen && 'rotate-180',
                      )}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {hasExtraDetails && detailsOpen ? (
          <div className="border-t border-navbar-border px-4 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
            <div className="space-y-3">
                {description && (
                  <p className="type-small max-w-3xl whitespace-pre-line leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <CompactFact label="Ubicación" value={facts.location} />
                  <CompactFact label="Género" value={facts.gender} />
                  <CompactFact label="Intercambio" value={facts.exchange} />
                </div>
                {(event?.matchIndustries?.length ?? 0) > 0 && (
                  <p className="type-small text-muted-foreground">
                    <span className="font-semibold text-foreground">Rubros:</span>{' '}
                    {event.matchIndustries.join(' · ')}
                  </p>
                )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
